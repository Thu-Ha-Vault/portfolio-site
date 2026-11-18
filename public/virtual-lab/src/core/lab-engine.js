// Lõi hoá học định lượng. Không phụ thuộc Three.js hay DOM.
// Mỗi vật chứa biết mình chứa bao nhiêu mol mỗi chất và bao nhiêu mL dung dịch. Rót bằng một dụng cụ thì thể tích thật
// lệch khỏi thể tích định lấy theo dung sai của dụng cụ (data/tools.json, theo ISO 4788, 648, 385).
// Phản ứng xảy ra theo hệ số tỉ lượng đọc từ phương trình trong reactions.json: chất hết quyết định lượng sản phẩm,
// chất dư ở lại. Các phản ứng xét lần lượt theo thứ tự trong file (thứ tự ưu tiên).
// pH tính cho acid mạnh, base mạnh (kể cả tự phân li của nước) và muối carbonate (base yếu).
// Thuốc thử sinh học (PCR) vẫn định tính: chỉ ghi có hay không có trong ống.
// Nhiệt độ: mỗi vật chứa có nhiệt độ; dung dịch rót vào ở nhiệt độ phòng trộn nhiệt theo nhiệt dung; phản ứng toả hoặc
// thu nhiệt q = −ΔH × độ tiến triển (ΔH theo phương trình trong data/thermo.json, tính từ ΔfH° của NBS 1982, CRC),
// làm nóng dung dịch và thành cốc: ΔT = q / (m_dd·c_dd + m_cốc·c_thuỷ tinh).
// Độ tan của kết tủa có Ksp và ion trong data/thermo.json (hiện có PbI₂): Ksp theo nhiệt độ bằng van 't Hoff với ΔH hoà tan,
// tính cả ion chung từ chất dư trong cốc. Phần tan nằm trong box.dissolved; khi nguội, phần kết tinh lại ghi vào
// box.crystals theo tốc độ nguội: nguội chậm ra tinh thể lớn (vảy), nguội nhanh ra bột mịn (ngưỡng minh hoạ).

import { rng } from './random.js';

const KIND_WARNING = {
  tube: 'Thành phần PCR nên cho vào ống PCR bằng micropipet, không dùng cốc có mỏ.',
  beaker: 'Hoá chất này thường thao tác trong cốc có mỏ hoặc ống nghiệm, không cho vào ống PCR.',
};
const EPS = 1e-9; // mol: nhỏ hơn coi như hết
const DRY_ML = 0.02; // dưới mức này coi như đã cạn khô
const SOLID_CP = 1.0; // J/(g·K), nhiệt dung riêng gần đúng của muối rắn (minh hoạ)
const TESTTUBE_GLASS_J_PER_K = 6 * 0.78; // phần ống nghiệm 16 × 150 mm nóng cùng chất lỏng: 6 g thuỷ tinh (data/flame.json, minh hoạ)
const dec = (v, d = 1) => v.toFixed(d).replace('.', ',');
const KW = 1e-14;
const R = 8.314;
const SLOW_K_PER_MIN = 10; // nguội chậm hơn ngưỡng này thì tinh thể lớn (minh hoạ)

// "2AgNO3 + Na2CO3 → Ag2CO3↓ + 2NaNO3" → hệ số theo id chất. Chỉ khớp công thức với các chất khai báo trong phản ứng;
// nước ở vế trái coi là dung môi.
export function parseEquation(rx, substances) {
  const [left, right] = rx.equation.split('→');
  const side = (text, ids) => {
    const out = {};
    for (const term of text.split(' + ').map((t) => t.trim().replace(/[↓↑]/g, ''))) {
      const m = /^(\d*)(.+)$/.exec(term);
      const coef = m[1] ? Number(m[1]) : 1;
      const id = ids.find((x) => substances.get(x)?.formula === m[2]);
      if (id) out[id] = coef;
    }
    return out;
  };
  return { reactants: side(left, rx.reactants), products: side(right, rx.products) };
}

const mmol = (n) => `${(n * 1000).toFixed(n * 1000 < 0.1 ? 3 : 2).replace('.', ',')} mmol`;
const mL = (v) => `${v.toFixed(v < 1 ? 2 : 2).replace('.', ',')} mL`;

export class LabEngine {
  // tools: data/tools.json (không có thì rót đúng thể tích); exact: bỏ sai số dụng cụ (dùng cho kiểm thử)
  constructor({ substances, reactions, tools = null, thermo = null, seed = Date.now(), exact = false }) {
    this.substances = new Map(substances.map((s) => [s.id, s]));
    this.reactions = reactions.map((r) => ({ ...r, stoich: parseEquation(r, this.substances) }));
    this.tools = new Map((tools?.tools ?? []).map((t) => [t.id, t]));
    this.exact = exact;
    this.containers = new Map();
    this.seed = seed;
    this.random = rng(seed);
    this.molar = new Map();
    this.thermo = thermo;
    const ph = thermo?.physical;
    this.room = 25;
    this.cp = ph?.solution_cp_J_per_gK?.value ?? 4.18;
    this.rho = ph?.solution_density_g_per_mL?.value ?? 1;
    this.glass = (ph?.beaker_100mL?.mass_g ?? 45) * (ph?.glass_cp_J_per_gK?.value ?? 0.78);
    this.#pickUnknowns();
  }

  // Nhiệt dung (J/K) của dung dịch trong vật chứa cộng thành cốc thuỷ tinh (ống PCR nhựa nhỏ: bỏ qua)
  heatCapacity(box) {
    const glass = box.kind === 'beaker' ? this.glass : box.kind === 'testtube' ? TESTTUBE_GLASS_J_PER_K : 0;
    return box.volume * this.rho * this.cp + glass + this.solidMass(box) * SOLID_CP;
  }

  // Khối lượng chất rắn khô trong vật chứa (g): chất rắn lấy bằng thìa chưa tan, cặn khô khi dung dịch bay hơi hết
  solidMass(box) {
    let g = 0;
    for (const [id, n] of box.amounts) {
      const s = this.substances.get(id);
      if (n > EPS && s.state !== 'g' && (s.solid || box.volume <= DRY_ML)) g += n * (s.Mr ?? 0);
    }
    return g;
  }

  temperature(containerId) {
    return this.containers.get(containerId)?.T ?? this.room;
  }

  // Dung dịch chưa biết nồng độ: chọn ngẫu nhiên một lần cho mỗi lượt làm
  #pickUnknowns() {
    for (const s of this.substances.values()) {
      if (s.unknown) this.molar.set(s.id, +(s.unknown[0] + this.random() * (s.unknown[1] - s.unknown[0])).toFixed(4));
    }
  }

  molarity(sub) {
    return this.molar.get(sub.id) ?? sub.M ?? 0;
  }

  addContainer({ id, name, kind, capacity }) {
    this.containers.set(id, { id, name, kind, capacity: capacity ?? (kind === 'tube' ? 0.025 : kind === 'testtube' ? 20 : 15), amounts: new Map(), volume: 0, pours: 0, T: this.room, dissolved: new Map(), crystals: new Map(), ring: new Map() });
  }

  // seed: đặt lại bộ sinh số ngẫu nhiên (mở lại phiên cần đúng seed cũ); bỏ trống thì chạy tiếp dãy số hiện tại
  reset(seed = null) {
    if (seed !== null) {
      this.seed = seed;
      this.random = rng(seed);
    }
    for (const box of this.containers.values()) {
      box.amounts.clear();
      box.volume = 0;
      box.pours = 0;
      box.T = this.room;
      box.dissolved.clear();
      box.crystals.clear();
      box.ring.clear();
    }
    this.#pickUnknowns();
  }

  // Thể tích thật khi định lấy `want` mL bằng dụng cụ `tool`
  measure(toolId, want) {
    const tool = this.tools.get(toolId);
    if (!tool || this.exact) return want;
    const v = tool.tol ? want + (this.random() * 2 - 1) * tool.tol : want * (1 + this.random.normal() * (tool.rel / 2));
    return Math.max(want * 0.05, v);
  }

  pour(substanceId, containerId, { tool = 'pour', volume } = {}) {
    const sub = this.substances.get(substanceId);
    const box = this.containers.get(containerId);
    if (!sub || !box) throw new Error(`Không có chất "${substanceId}" hoặc vật chứa "${containerId}"`);

    const events = [];
    const wasEmpty = this.#present(box).length === 0;
    const indicatorBefore = this.#indicator(box);
    const chem = sub.kind === 'chem';
    let actual = 0;
    if (chem && sub.solid) {
      // Chất rắn: xúc bằng thìa, lượng tính theo gam; không làm tăng thể tích dung dịch
      // Thể tích chọn cho dụng cụ đong chất lỏng không áp dụng cho chất rắn: chỉ dùng lượng truyền vào khi tool là thìa
      const want = tool === 'spatula' && volume ? volume : sub.grams ?? 0.5;
      actual = this.measure('spatula', want);
      const n = actual / sub.Mr;
      box.amounts.set(sub.id, (box.amounts.get(sub.id) ?? 0) + n);
      events.push({ type: 'measure', text: `Thìa xúc: định lấy ${dec(want, 1)} g, thực tế khoảng ${dec(actual, 2)} g = ${mmol(n)} ${sub.formula}.` });
    } else if (chem) {
      const want = volume ?? 2;
      actual = this.measure(tool, want);
      const n = (this.molarity(sub) * actual) / 1000;
      box.amounts.set(sub.id, (box.amounts.get(sub.id) ?? 0) + n);
      // Trộn nhiệt: dung dịch mới ở nhiệt độ phòng
      const c0 = this.heatCapacity(box);
      const c1 = actual * this.rho * this.cp;
      box.T = (c0 * box.T + c1 * this.room) / Math.max(1e-9, c0 + c1);
      box.volume += actual;
      const t = this.tools.get(tool);
      if (t) events.push({ type: 'measure', text: `${t.name}: định lấy ${mL(want)}, thực tế ${mL(actual)}${sub.unknown || sub.solvent ? '' : ` = ${mmol(n)} ${sub.formula ?? sub.label}`}.` });
    } else {
      box.amounts.set(sub.id, 1);
    }
    box.pours += 1;

    if (sub.effect) events.push({ type: 'effect', text: sub.effect });
    if (sub.container && sub.container !== box.kind && !(sub.container === 'beaker' && box.kind === 'testtube')) events.push({ type: 'warning', text: KIND_WARNING[sub.container] });
    if (sub.solvent && box.kind === 'testtube' && box.T > 150) events.push({ type: 'warning', label: 'Ống còn nóng', text: `${box.name} còn khoảng ${Math.round(box.T)} °C: nước lạnh gặp thuỷ tinh đang nóng làm ống co lại đột ngột, dễ nứt vỡ. Để nguội ống trước khi cho nước vào.` });
    const hyd = this.#hydrate(box);
    if (hyd) events.push(hyd);

    let gas = false;
    const gases = []; // id các khí sinh ra (cảnh 3D vẽ bọt khí và khí có màu theo màu của chất)
    let reacted = false;
    for (let guard = 0; guard < 20; guard++) {
      const rx = this.reactions.find((r) => r.reactants.every((id) => (box.amounts.get(id) ?? 0) > EPS));
      if (!rx) break;
      const nu = rx.stoich.reactants;
      const extent = Math.min(...rx.reactants.map((id) => box.amounts.get(id) / (nu[id] ?? 1)));
      const used = rx.reactants.map((id) => [id, extent * (nu[id] ?? 1)]);
      for (const [id, n] of used) {
        const left = box.amounts.get(id) - n;
        if (left > EPS) box.amounts.set(id, left);
        else box.amounts.delete(id);
      }
      const made = [];
      for (const id of rx.products) {
        const p = this.substances.get(id);
        if (!p) continue;
        const n = extent * (rx.stoich.products[id] ?? 1);
        made.push([id, n]);
        if (p.state === 'g') { gas = true; if (!gases.includes(id)) gases.push(id); } // khí thoát ra ngoài
        else if (!p.solvent) box.amounts.set(id, (box.amounts.get(id) ?? 0) + n);
      }
      const leftover = rx.reactants.filter((id) => box.amounts.has(id));
      events.push({ type: 'reaction', reaction: rx, amounts: this.#describe(used, made, leftover, box) });
      const dH = this.thermo?.reactions?.[rx.id]?.dH_kJ_per_mol;
      if (Number.isFinite(dH) && box.volume > 0) {
        const T0 = box.T;
        box.T += (-dH * 1000 * extent) / this.heatCapacity(box);
        const dT = box.T - T0;
        if (Math.abs(dT) >= 0.05) events.push({ type: 'info', label: 'Nhiệt', text: `${dT > 0 ? 'Toả nhiệt' : 'Thu nhiệt'} (ΔH = ${dH.toFixed(1).replace('.', ',')} kJ/mol): ${box.name} ${dT > 0 ? 'ấm lên' : 'lạnh đi'} ${Math.abs(dT).toFixed(1).replace('.', ',')} °C, còn ${box.T.toFixed(1).replace('.', ',')} °C.${Math.abs(dT) < 1 ? ' Thay đổi nhỏ, nhiệt kế thường khó thấy.' : ''}` });
      }
      const kin = Object.values(this.thermo?.kinetics ?? {}).find((k) => k.reaction === rx.id);
      if (kin && box.volume > 0) {
        // Arrhenius: t = t_ref × (c_ref / c) × exp(Ea/R × (1/T − 1/T_ref)); c là nồng độ chất đo tốc độ lúc trộn
        const lead = rx.reactants[0];
        const c = ((used.find(([id]) => id === lead)?.[1] ?? 0) + (box.amounts.get(lead) ?? 0)) / (box.volume / 1000); // nồng độ lúc trộn
        const T = box.T + 273.15;
        const t0 = kin.t_ref_s * (kin.thiosulfate_ref_M / Math.max(1e-6, c)) * Math.exp(((kin.Ea_kJ_per_mol * 1000) / R) * (1 / T - 1 / (kin.T_ref_C + 273.15)));
        const t = t0 * (this.exact ? 1 : 1 + 0.03 * this.random.normal()); // bấm đồng hồ theo mắt: lệch khoảng 3 % (minh hoạ)
        box.lastTime = { t, T: box.T, c };
        events.push({ type: 'measure', label: 'Thời gian', text: `Ở ${box.T.toFixed(1).replace('.', ',')} °C, nồng độ ${(c * 1000).toFixed(0)} mM ${this.substances.get(lead).formula}: dung dịch đục che mất dấu chữ thập sau khoảng ${Math.round(t)} s (Ea ${kin.Ea_kJ_per_mol} kJ/mol; mốc ${kin.t_ref_s} s ở ${kin.T_ref_C} °C là minh hoạ).` });
      }
      reacted = true;
    }

    const eqEv = this.#complexEquilibrium(box, reacted || sub.solvent || sub.id in this.#eqMembers());
    if (eqEv) events.push(eqEv);
    const sol = this.#equilibrate(box);
    for (const [id, d] of sol) {
      const p = this.substances.get(id);
      const n = box.amounts.get(id);
      if (d.after > 0.05 * n) events.push({ type: 'info', label: 'Độ tan', text: `Ở ${fmtT(box.T)} và ${mL(box.volume)} dung dịch, ${Math.round((100 * d.after) / n)} % ${p.formula} (${mg(d.after * p.Mr)}) còn tan${d.common ? ', ít hơn trong nước cất vì có ion chung từ chất dư' : ''}.${d.after >= n - EPS ? ' Chưa thấy kết tủa.' : ''}` });
    }

    const indicatorAfter = this.#indicator(box);
    if (indicatorAfter && indicatorAfter.key !== indicatorBefore?.key) events.push({ type: 'indicator', text: indicatorAfter.text });

    if (!reacted && chem && sub.solvent) events.push({ type: 'info', text: `Thêm nước: ${box.name} còn ${mL(box.volume)}, các chất loãng ra.` });
    else if (!reacted && chem) {
      if (wasEmpty && sub.note) events.push({ type: 'info', text: sub.note });
      else if (!wasEmpty && !eqEv && !events.some((e) => e.type === 'indicator')) {
        events.push({ type: 'none', text: 'Không có phản ứng: các chất trong cốc không tạo kết tủa, chất khí hay chất điện li yếu.' });
      }
    }
    if (!events.length) events.push({ type: 'info', text: `Đã thêm vào ${box.name}.` });

    return { substance: sub, container: box, events, gas, gases, T: box.T, contents: this.contents(containerId), amounts: this.amounts(containerId), volume: box.volume, pH: this.pH(containerId), added: actual };
  }

  // Các chất tham gia cân bằng tạo phức trong data/thermo.json (ví dụ Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺)
  #eqMembers() {
    const out = {};
    for (const e of Object.values(this.thermo?.equilibria ?? {})) {
      if (!e.complex) continue;
      out[e.metal.id] = out[e.ligand.id] = out[e.complex.id] = true;
    }
    return out;
  }

  /** Cân bằng tạo phức 1:1 trong cốc: { C (mol/L phức), A (độ hấp thụ, 1 cm), K, frac (phần kim loại ở dạng phức) } hoặc null. */
  complexIn(containerId) {
    const box = this.containers.get(containerId);
    for (const e of Object.values(this.thermo?.equilibria ?? {})) {
      if (!e.complex) continue;
      const nC = box.amounts.get(e.complex.id) ?? 0;
      const V = box.volume / 1000;
      if (nC <= EPS || V <= 0) continue;
      const M = (nC * e.complex.metal + (box.amounts.get(e.metal.id) ?? 0) * e.metal.per) / V;
      const L = (nC * e.complex.ligand + (box.amounts.get(e.ligand.id) ?? 0) * e.ligand.per) / V;
      const K = e.K25_I0 * Math.exp(((-(e.dH_kJ ?? 0) * 1000) / R) * (1 / (box.T + 273.15) - 1 / 298.15));
      // K = C / ((M − C)(L − C)) → K C² − (K(M + L) + 1) C + K M L = 0, lấy nghiệm nhỏ
      const b = K * (M + L) + 1;
      const C = (b - Math.sqrt(Math.max(0, b * b - 4 * K * K * M * L))) / (2 * K);
      return { C, A: (e.epsilon_447nm_L_per_mol_cm ?? 4700) * C, K, frac: M > 0 ? C / M : 0, eq: e };
    }
    return null;
  }

  #complexEquilibrium(box, changed) {
    if (!changed) return null;
    const r = this.complexIn(box.id);
    if (!r) return null;
    box.complexA = r.A;
    return { type: 'info', label: 'Cân bằng', text: `Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺ (K ≈ ${Math.round(r.K)} ở ${box.T.toFixed(0)} °C, lực ion 0): [FeSCN²⁺] = ${(r.C * 1000).toFixed(2).replace('.', ',')} mM, ${Math.round(r.frac * 100)} % Fe³⁺ ở dạng phức, độ hấp thụ ở 447 nm khoảng ${r.A.toFixed(2).replace('.', ',')} (cuvet 1 cm). Thêm Fe³⁺ hoặc SCN⁻ thì cân bằng dịch sang phải, màu đỏ đậm hơn; pha loãng thì dịch sang trái.` };
  }

  // Ksp ở nhiệt độ T (°C): van 't Hoff từ Ksp 25 °C và ΔH hoà tan
  ksp(id, T) {
    const k = this.thermo?.ksp_25C?.[id];
    if (!k?.ions) return null;
    return k.Ksp * Math.exp((-(k.dH_sol_kJ ?? 0) * 1000) / R * (1 / (T + 273.15) - 1 / 298.15));
  }

  /** Độ tan (mol/L) của kết tủa id trong cốc ở nhiệt độ T, có tính ion chung. */
  solubility(containerId, id, T = this.temperature(containerId)) {
    const box = this.containers.get(containerId);
    const K = this.ksp(id, T);
    const V = box.volume / 1000;
    if (K === null || V <= 0) return null;
    const ions = this.thermo.ksp_25C[id].ions.map((ion) => ({ n: ion.n, c: (box.amounts.get(ion.from) ?? 0) / V }));
    const f = (s) => ions.reduce((p, ion) => p * (ion.c + ion.n * s) ** ion.n, 1) - K;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 100; i++) {
      const mid = (lo + hi) / 2;
      if (f(mid) > 0) hi = mid;
      else lo = mid;
    }
    return { s: lo, common: ions.some((ion) => ion.c > 0) };
  }

  // Cân bằng hoà tan cho mọi kết tủa có Ksp trong cốc. rate: tốc độ nguội (K/phút) khi kết tinh lại.
  #equilibrate(box, rate = 0) {
    const out = new Map();
    for (const [id, n] of box.amounts) {
      const r = this.solubility(box.id, id, box.T);
      if (!r || n <= EPS) continue;
      const before = box.dissolved.get(id) ?? 0;
      const after = Math.min(n, (r.s * box.volume) / 1000);
      box.dissolved.set(id, after);
      const c = box.crystals.get(id) ?? { plates: 0, fine: 0 };
      if (after < before) {
        // Kết tinh lại từ dung dịch
        if (rate > 0 && rate < SLOW_K_PER_MIN) c.plates += before - after;
        else c.fine += before - after;
      } else if (after > before) {
        // Tan thêm: các dạng rắn tan theo tỉ lệ
        const solid0 = n - before;
        const k = solid0 > EPS ? Math.max(0, (n - after) / solid0) : 0;
        c.plates *= k;
        c.fine *= k;
      }
      box.crystals.set(id, c);
      out.set(id, { before, after, common: r.common });
    }
    return out;
  }

  /**
   * Đặt nhiệt độ và thể tích của cốc sau khi đun hoặc làm nguội (thể tích giảm do bay hơi), rồi tính lại độ tan.
   * rate: tốc độ nguội trung bình (K/phút) lúc kết tinh. Trả về thay đổi độ tan theo từng chất.
   */
  setTemperature(containerId, T, { volume, rate = 0 } = {}) {
    const box = this.containers.get(containerId);
    box.T = T;
    if (Number.isFinite(volume)) box.volume = Math.max(0, volume);
    return this.#equilibrate(box, rate);
  }

  /** Lượng rắn (mol) của kết tủa id: tổng, phần tan, vảy tinh thể, bột mịn, kết tủa ban đầu. */
  solid(containerId, id) {
    const box = this.containers.get(containerId);
    const n = box.amounts.get(id) ?? 0;
    const dissolved = box.dissolved.get(id) ?? 0;
    const c = box.crystals.get(id) ?? { plates: 0, fine: 0 };
    return { n, dissolved, plates: c.plates, fine: c.fine, raw: Math.max(0, n - dissolved - c.plates - c.fine) };
  }

  #describe(used, made, leftover, box) {
    const name = (id) => this.substances.get(id).formula ?? this.substances.get(id).label;
    const parts = [`${used.map(([id, n]) => `${mmol(n)} ${name(id)}`).join(' + ')} → ${made.map(([id, n]) => {
      const p = this.substances.get(id);
      const mass = p.precipitate && p.Mr ? ` (${(n * p.Mr * 1000).toFixed(1).replace('.', ',')} mg)` : '';
      return `${mmol(n)} ${name(id)}${p.precipitate ? '↓' : p.state === 'g' ? '↑' : ''}${mass}`;
    }).join(' + ')}.`];
    if (leftover.length) parts.push(`Còn dư ${leftover.map((id) => `${mmol(box.amounts.get(id))} ${name(id)}`).join(', ')}.`);
    else parts.push('Các chất tham gia phản ứng vừa đủ.');
    return parts.join(' ');
  }

  #present(box) {
    return [...box.amounts].filter(([, n]) => n > EPS).map(([id]) => id);
  }

  // Đổ bỏ toàn bộ chất trong vật chứa (vào can chất thải); trả về danh sách chất đã đổ
  empty(containerId) {
    const box = this.containers.get(containerId);
    if (!box) throw new Error(`Không có vật chứa "${containerId}"`);
    const gone = this.contents(containerId);
    box.amounts = new Map();
    box.dissolved = new Map();
    box.crystals = new Map();
    box.ring = new Map();
    box.volume = 0;
    box.pours = 0;
    box.T = this.room;
    return gone;
  }

  contents(containerId) {
    return this.#present(this.containers.get(containerId)).map((id) => this.substances.get(id));
  }

  amounts(containerId) {
    const box = this.containers.get(containerId);
    return this.#present(box).map((id) => ({ substance: this.substances.get(id), n: box.amounts.get(id) }));
  }

  // pH của dung dịch: acid/base mạnh tính cả tự phân li của nước; chỉ có carbonate thì tính như base yếu
  pH(containerId) {
    const box = this.containers.get(containerId);
    const V = box.volume / 1000;
    if (box.kind === 'tube' || V <= 0) return null;
    let net = 0;
    let weak = 0;
    let kb = 0;
    for (const [id, n] of box.amounts) {
      const s = this.substances.get(id);
      if (s.acid) net += s.acid * n;
      if (s.base) net -= s.base * n;
      if (s.Kb) { weak += n; kb = s.Kb; }
    }
    const C = net / V;
    if (Math.abs(C) < 1e-7 && weak > EPS) return 14 + Math.log10(Math.sqrt(kb * (weak / V)));
    const H = (C + Math.sqrt(C * C + 4 * KW)) / 2;
    return -Math.log10(H);
  }

  // Chất rắn tan khi có nước (data/substances.json: aq là chất trong dung dịch, dHsol_kJ_per_mol là nhiệt hoà tan, NBS 1982):
  // CuSO₄ khan trắng gặp nước thành dung dịch xanh lam và toả nhiệt; CuSO₄·5H₂O tan hơi thu nhiệt
  #hydrate(box) {
    if (box.volume <= 0.3) return null;
    const parts = [];
    for (const [id, n] of [...box.amounts]) {
      const s = this.substances.get(id);
      if (!s?.aq || n <= EPS) continue;
      box.amounts.delete(id);
      box.amounts.set(s.aq, (box.amounts.get(s.aq) ?? 0) + n);
      const dH = s.dHsol_kJ_per_mol ?? 0;
      const T0 = box.T;
      if (dH) box.T += (-dH * 1000 * n) / this.heatCapacity(box);
      parts.push(`${s.label ?? s.formula} tan thành dung dịch ${this.substances.get(s.aq)?.formula ?? s.aq}${dH ? `, ${dH < 0 ? 'toả nhiệt' : 'thu nhiệt'} (ΔH hoà tan ${dec(dH)} kJ/mol): ${dec(T0)} → ${dec(box.T)} °C` : ''}.`);
    }
    return parts.length ? { type: 'effect', label: 'Hoà tan', text: parts.join(' ') } : null;
  }

  // Lõi đun (src/core/flame.js) gọi sau khi đổi thể tích, nhiệt độ hoặc thành phần
  rehydrate(containerId) {
    return this.#hydrate(this.containers.get(containerId));
  }

  appearance(containerId) {
    const box = this.containers.get(containerId);
    let liquidColor = null;
    let precipitateColor = null;
    let most = 0;
    for (const [id, n] of box.amounts) {
      if (n <= EPS) continue;
      const s = this.substances.get(id);
      if (s.precipitate) {
        const solid = n - (box.dissolved.get(id) ?? 0);
        if (solid > EPS && solid > most) { most = solid; precipitateColor = s.color; }
      } else if (s.color && !s.solid && s.state !== 'g') liquidColor = liquidColor ? mixHex(liquidColor, s.color) : s.color;
    }
    const cx = this.complexIn(containerId);
    if (cx) liquidColor = mixHex('#f3e7c4', cx.eq.color ?? '#8e1010', Math.min(1, 1 - 10 ** (-cx.A * 0.3)));
    const ind = this.#indicator(box);
    if (ind?.color) liquidColor = ind.color;
    const level = box.kind === 'tube' ? Math.min(box.pours, 6) / 6 : Math.min(1, box.volume / box.capacity);
    // Chất rắn: lấy bằng thìa và chưa tan, hoặc cặn khô khi dung dịch bay hơi hết (màu theo solidColor, trộn theo khối lượng)
    let solid = null;
    const dry = box.volume <= DRY_ML;
    let mass = 0;
    let color = null;
    for (const [id, n] of box.amounts) {
      const s = this.substances.get(id);
      if (n <= EPS || s.state === 'g' || (!dry && !s.solid)) continue;
      const g = n * (s.Mr ?? 0);
      const c = s.solidColor ?? s.color ?? '#f4f4f0';
      color = color ? mixHex(color, c, g / (mass + g)) : c;
      mass += g;
    }
    if (mass > 0) solid = { color, grams: mass };
    if (dry) { liquidColor = null; precipitateColor = null; }
    // Chất thăng hoa đọng lại ở phần trên (nguội) của ống nghiệm
    let ring = null;
    for (const [id, n] of box.ring) if (n > EPS) ring = { color: this.substances.get(id)?.color ?? '#f2f2f2' };
    return { level: dry ? 0 : level, liquidColor, precipitateColor, solid, ring };
  }

  #indicator(box) {
    for (const [id, n] of box.amounts) {
      const ind = this.substances.get(id).indicator;
      if (!ind || n <= EPS) continue;
      const pH = this.pH(box.id);
      const [lo, hi] = ind.range ?? [8.2, 10];
      if (pH !== null && pH >= lo) {
        // Hồng nhạt ở đầu khoảng đổi màu, hồng đậm khi pH cao hơn
        const k = Math.min(1, (pH - lo) / (hi - lo));
        return { key: 'base', color: mixHex('#f4dce8', ind.baseColor, k), text: ind.baseText, pH };
      }
      return { key: 'other', color: null, text: ind.otherText, pH };
    }
    return null;
  }
}

const fmtT = (T) => `${T.toFixed(0)} °C`;
const mg = (g) => `${(g * 1000).toFixed(1).replace('.', ',')} mg`;

function mixHex(a, b, k = 0.5) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift) => Math.round(((pa >> shift) & 255) * (1 - k) + ((pb >> shift) & 255) * k);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}
