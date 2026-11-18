// Động học enzyme cho các bài 08–10 Hoá sinh và bài lipase (data/enzyme.json): Michaelis–Menten, nhiệt độ dịch
// trong ống tiến dần về nhiệt độ bể hoặc tủ, tốc độ xúc tác theo Arrhenius, biến tính bậc nhất theo nhiệt độ và pH,
// đường chuông pH, Cl⁻ hoạt hoá, Cu²⁺ kìm hãm, tính đặc hiệu cơ chất. Theo dõi tinh bột bằng Lugol trên bản sứ,
// phương pháp Wohlgemuth, lipase với p-NPP đo ở 405 nm và đồ thị Lineweaver–Burk. Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';
import { measure } from '../../figures/spectro/model.mjs';

export const EZ_ACTIONS = {
  'ez-setup': 'Pha ống enzyme',
  'ez-run': 'Ủ và thử Lugol theo thời gian',
  'ez-test': 'Thử ống',
  'ez-wohl': 'Hoạt độ Wohlgemuth',
  'ez-pnpp': 'Lipase với p-NPP',
  'ez-lb': 'Đồ thị Lineweaver–Burk',
  'ez-clear': 'Rửa các ống',
};
const R = 8.314;
const K = (c) => c + 273.15;
const ROOM = 25;
const DT = 0.05;
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');

// Hoạt độ tương đối theo pH (mô hình hai nhóm ion hoá), chuẩn hoá về 1 ở đỉnh
function bell(e, pH) {
  const g = (p) => 1 / (1 + 10 ** (e.pKa1 - p) + 10 ** (p - e.pKa2));
  return g(pH) / g((e.pKa1 + e.pKa2) / 2);
}

export class EnzymeLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.tubes = new Map();
    this.points = [];
    this.last = null;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = {
      'ez-setup': () => this.setup(params),
      'ez-run': () => this.run(params),
      'ez-test': () => this.test(params),
      'ez-wohl': () => this.wohlgemuth(params),
      'ez-pnpp': () => this.pnpp(params),
      'ez-lb': () => this.lineweaver(),
      'ez-clear': () => { this.tubes.clear(); this.points = []; return { ok: true, events: [{ type: 'machine', label: 'Rửa ống', text: 'Đổ bỏ và rửa các ống enzyme.' }] }; },
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  // Hằng số tốc độ biến tính (phút⁻¹) theo nhiệt độ và pH
  #kd(e, T, pH) {
    let k = e.kd80 * Math.exp((-e.ead / R) * (1 / K(T) - 1 / K(80)));
    if (pH !== null && e.alkali && pH > e.alkali.at - 1.5) k += e.alkali.k * 10 ** (e.alkali.slope * (pH - e.alkali.at));
    if (pH !== null && e.acid && pH < e.acid.at + 1.5) k += e.acid.k * 10 ** (e.acid.slope * (e.acid.at - pH));
    return k;
  }

  #rateFactor(e, T) {
    return Math.exp((-e.ea / R) * (1 / K(T) - 1 / K(37)));
  }

  // Ống: enzyme (enzMl, hoạt độ chế phẩm prep), cơ chất (subMl), đệm (bufMl, pH), chất thêm (addMl);
  // xử lý enzyme trước (preT, preMin, preMedium, prePH) rồi mới trộn với cơ chất; ủ ở T trong môi trường medium
  setup({ tube = 1, enzyme = 'saliva', prep = 1, control = false, enzMl = 1, substrate = 'starch1', subMl = 3, pH = null, bufMl = 0, additive = 'none', addMl = 0, T = 37, medium = 'bath', preT = null, preMin = 0, preMedium = 'bath', prePH = null, preBufMl = 0 }) {
    const e = this.data.enzymes[enzyme];
    const s = this.data.substrates[substrate];
    if (!e || !s) throw new Error('Không có enzyme hoặc cơ chất này');
    const add = this.data.additives[additive] ?? this.data.additives.none;
    const V = enzMl + subMl + bufMl + addMl + preBufMl;
    const events = [];
    // Xử lý trước: enzyme đứng riêng, nhiệt độ tiến về preT
    let E = 1;
    let Te = ROOM;
    if (preT !== null && preMin > 0) {
      const tau = this.data.media[preMedium]?.tau ?? 1;
      for (let t = 0; t < preMin; t += DT) {
        Te += (preT - Te) * (1 - Math.exp(-DT / tau));
        E *= Math.exp(-this.#kd(e, Te, prePH) * DT);
      }
      events.push({ type: 'machine', label: `Ống ${tube}`, text: `Xử lý ${e.name} ${preMin} phút ở ${preT} °C${prePH !== null ? `, pH ${fmt(prePH, 1)}` : ''} (${this.data.media[preMedium]?.name}): còn ${fmt(E * 100, 0)} % hoạt tính.` });
    }
    // Nhiệt độ lúc trộn: trung bình theo thể tích của enzyme (vừa xử lý) và dung dịch ở nhiệt độ phòng
    const T0 = (enzMl * Te + (V - enzMl) * ROOM) / V;
    const cl = ((e.salivaCl ?? 0) * enzMl + (s.clMM ?? 0) * subMl + (add.clMM ?? 0) * addMl) / V;
    const cu = ((add.cuMM ?? 0) * addMl) / V;
    const S0 = s.kind === 'starch' ? (s.gL * subMl) / V : ((s.mM ?? 0) * subMl) / V;
    const noise = 1 + this.data.noise * this.random.normal();
    const t = { tube, enzyme, e, sub: substrate, s, S0, S: S0, E, T: T0, setT: Number(T), medium, pH: pH === null ? null : Number(pH), cl, cu, frac: control ? 0 : (enzMl * prep * noise) / V, control, V, time: 0, specific: e.substrates.includes(s.kind) };
    this.tubes.set(Number(tube), t);
    events.push({ type: 'machine', label: `Ống ${tube}`, text: `${fmt(subMl)} mL ${s.name} + ${fmt(enzMl)} mL ${control ? 'nước cất (đối chứng, không có enzyme)' : e.name}${bufMl ? ` + ${fmt(bufMl)} mL đệm pH ${fmt(pH, 1)}` : ''}${addMl ? ` + ${fmt(addMl)} mL ${add.name}` : ''}; ủ ở ${T} °C (${this.data.media[medium]?.name}).` });
    this.notebook.add({ day: '', experiment: 'Enzyme', action: EZ_ACTIONS['ez-setup'], subject: `ống ${tube}`, result: `${e.name} + ${s.name}`, T, pH: pH ?? '' });
    return { ok: true, events };
  }

  // Một bước thời gian cho một ống
  #step(t, dt) {
    const md = this.data.media[t.medium] ?? {};
    const target = ROOM + (t.setT - ROOM) * (md.reach ?? 1);
    t.T += (target - t.T) * (1 - Math.exp(-dt / (md.tau ?? 1)));
    const e = t.e;
    if (t.specific && e.vmax) {
      const fCl = e.clBasal >= 1 ? 1 : e.clBasal + (1 - e.clBasal) * (t.cl / (e.clKa + t.cl));
      const fCu = 1 / (1 + t.cu / e.cuKi);
      const fpH = bell(e, t.pH ?? (e.pKa1 + e.pKa2) / 2);
      const vmax = e.vmax * t.frac * this.#rateFactor(e, t.T) * fpH * fCl * fCu * t.E;
      t.S = Math.max(0, t.S - ((vmax * t.S) / (e.km + t.S)) * dt);
    }
    t.E *= Math.exp(-this.#kd(e, t.T, t.pH) * dt);
    t.time += dt;
  }

  #advance(t, minutes) {
    for (let x = 0; x < minutes - 1e-9; x += DT) this.#step(t, Math.min(DT, minutes - x));
  }

  // Màu Lugol theo mức tinh bột đã thuỷ phân
  lugol(t) {
    const D = t.S0 > 0 ? 1 - t.S / t.S0 : 0;
    const lv = this.data.lugol.levels.find((l) => D < l[0]);
    return { D, name: lv[1], color: lv[2] };
  }

  run({ minutes = 21, every = 3, tubes = null }) {
    const list = [...this.tubes.values()].filter((t) => !tubes || tubes.includes(t.tube));
    if (!list.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa pha ống nào.' }] };
    const times = [];
    for (let m = 0; m <= minutes + 1e-9; m += every) times.push(Math.round(m * 10) / 10);
    const rows = list.map((t) => [`Ống ${t.tube} (${t.setT} °C${t.pH !== null ? `, pH ${fmt(t.pH, 1)}` : ''})`]);
    let prev = 0;
    for (const m of times) {
      list.forEach((t, i) => {
        this.#advance(t, m - prev);
        rows[i].push(t.s.kind === 'starch' ? this.lugol(t).name : this.#look(t).text);
      });
      prev = m;
    }
    const events = [{ type: 'machine', label: 'Ủ', text: `Ủ ${minutes} phút, cứ ${every} phút nhỏ 1 giọt dịch lên bản sứ có sẵn Lugol.` }];
    for (const t of list) {
      const o = t.s.kind === 'starch' ? this.lugol(t) : null;
      events.push({ type: 'info', label: `Ống ${t.tube}`, text: `${o ? `Cuối cùng ${o.name} (đã thuỷ phân khoảng ${fmt(o.D * 100, 0)} % tinh bột)` : this.#look(t).text}; nhiệt độ dịch ${fmt(t.T, 0)} °C, enzyme còn ${fmt(t.E * 100, 0)} % hoạt tính.` });
      if (!t.specific) events.push({ type: 'effect', label: 'Đặc hiệu', text: `${t.e.name} không xúc tác cho ${t.s.name}: trung tâm hoạt động chỉ khớp với cơ chất riêng.` });
    }
    this.notebook.add({ day: '', experiment: 'Enzyme', action: EZ_ACTIONS['ez-run'], subject: list.map((t) => `ống ${t.tube}`).join(' '), result: rows.map((r) => `${r[0]}: ${r[r.length - 1]}`).join('; ') });
    return { ok: true, table: { head: ['Ống', ...times.map((m) => `${fmt(m, m % 1 ? 1 : 0)}′`)], rows }, events };
  }

  // Thuốc thử cuối cho ống: Lugol (tinh bột), Fehling (đường khử từ sucrose), phenolphthalein (NH₃ từ ure)
  #look(t) {
    const done = t.S0 > 0 ? 1 - t.S / t.S0 : 0;
    if (t.s.kind === 'starch') return { text: `Lugol: ${this.lugol(t).name}`, positive: done >= 0.9 };
    if (t.s.kind === 'sucrose') {
      const glcPct = ((t.S0 - t.S) * 2 * 0.18) / 10; // mM sucrose → % đường khử (glucose + fructose)
      return glcPct >= 0.05 ? { text: 'Fehling: kết tủa đỏ gạch (glucose + fructose)', positive: true } : { text: 'Fehling: xanh dương nhạt, không có đường khử', positive: false };
    }
    if (t.s.kind === 'urea' || t.s.kind === 'acetamide') {
      const nh3 = (t.S0 - t.S) * 2;
      return nh3 >= 2 ? { text: 'Phenolphthalein: hồng (NH₃ làm môi trường kiềm)', positive: true } : nh3 >= 0.5 ? { text: 'Phenolphthalein: hồng nhạt dần', positive: true } : { text: 'Phenolphthalein: không màu', positive: false };
    }
    return { text: '', positive: null };
  }

  test({ tube = 1 }) {
    const t = this.tubes.get(Number(tube));
    if (!t) return { ok: false, events: [{ type: 'warning', text: `Ống ${tube} chưa pha.` }] };
    const o = this.#look(t);
    return { ok: true, positive: o.positive, events: [{ type: o.positive ? 'effect' : 'info', label: `Ống ${tube}`, text: o.text }] };
  }

  // Wohlgemuth: n ống 1 mL NaCl 0,9 %, pha loãng nối tiếp 1 mL nước bọt (ống k chứa 2^−k mL), thêm 2 mL tinh bột 0,1 %,
  // ủ, nhỏ Lugol. Đơn vị theo cách tính trong bài: 2^k × 2 với k là ống pha loãng nhất còn vàng.
  wohlgemuth({ T = 50, minutes = 30, medium = 'bath', n = 10, enzyme = 'saliva', prep = 1 }) {
    const e = this.data.enzymes[enzyme];
    const s = this.data.substrates.starch01;
    const rows = [];
    let last = 0;
    for (let k = 1; k <= n; k++) {
      const enzMl = 2 ** -k;
      const V = 1 + 2;
      const noise = 1 + this.data.noise * this.random.normal();
      const t = { e, s, S0: (s.gL * 2) / V, S: (s.gL * 2) / V, E: 1, T: ROOM, setT: Number(T), medium, pH: null, cl: (154 * 1 + e.salivaCl * enzMl) / V, cu: 0, frac: (enzMl * prep * noise) / V, specific: true, time: 0 };
      this.#advance(t, minutes);
      const o = this.lugol(t);
      if (o.name === 'vàng' && last === k - 1) last = k;
      rows.push([`Ống ${k}`, `1/${2 ** k}`, o.name]);
    }
    const units = last ? 2 ** last * 2 : 0;
    this.last = { wohlgemuth: units, lastYellow: last };
    this.notebook.add({ day: '', experiment: 'Enzyme', action: EZ_ACTIONS['ez-wohl'], subject: `${T} °C ${minutes} phút`, result: `${units} đơn vị`, last });
    return {
      ok: last > 0,
      units,
      table: { head: ['Ống', 'Nước bọt', 'Màu với Lugol'], rows },
      events: [
        { type: 'machine', label: 'Wohlgemuth', text: `${n} ống NaCl 0,9 %, pha loãng nước bọt theo cơ số 2, thêm 2 mL tinh bột 0,1 %, ủ ${T} °C ${minutes} phút, nhỏ Lugol.` },
        { type: 'effect', label: 'Hoạt độ', text: last ? `Ống pha loãng nhất còn vàng: ống ${last}. Hoạt độ = 2^${last} × 2 = ${units} đơn vị Wohlgemuth (bài 08, nhóm 3: 16).` : 'Không ống nào thuỷ phân hết tinh bột.' },
        ...(Number(T) !== 37 ? [{ type: 'info', text: 'Đơn vị Wohlgemuth định nghĩa ở 37 °C trong 30 phút; ủ ở nhiệt độ khác thì số đơn vị không so được với tài liệu.' }] : []),
      ],
    };
  }

  // Lipase với p-NPP: S (mM) trong 1 mL đệm Tris-HCl, µg enzyme, ủ T °C trong minutes phút, dừng bằng base (pH > 10)
  // hoặc acid, đo A405 trên máy quang phổ (cuvet 1 cm, ánh sáng lạc của máy UV-1900i)
  pnpp({ S = 1, T = 28, pH = 7.5, minutes = 10, ug = 1, additive = 'none', preT = null, preMin = 0, stop = 'base', buffer = true }) {
    const e = this.data.enzymes.lipase;
    let E = (e.additives[additive] ?? 100) / 100;
    const events = [];
    if (preT !== null && preMin > 0) {
      const kd60 = Math.LN2 / e.halfLife60;
      const kd = kd60 * Math.exp((-300000 / R) * (1 / K(preT) - 1 / K(60)));
      E *= Math.exp(-kd * preMin);
      events.push({ type: 'machine', label: 'Xử lý nhiệt', text: `Ủ enzyme ${preMin} phút ở ${preT} °C: còn ${fmt(E * 100, 0)} % hoạt độ (bán huỷ ở 60 °C: ${e.halfLife60} phút).` });
    }
    const pHreal = buffer ? Number(pH) : 5.5;
    const [lo, hi] = e.pHStable;
    const fpH = pHreal >= lo && pHreal <= hi ? 1 : Math.max(0, 1 - 0.45 * Math.min(Math.abs(pHreal - lo), Math.abs(pHreal - hi)));
    const vmax = e.vmaxPaper * (ug / 1000) * Math.exp((-e.ea / R) * (1 / K(T) - 1 / K(28))) * fpH * E * (1 + this.data.noise * this.random.normal());
    // Tích phân Michaelis–Menten (cơ chất giảm dần) trong 1 mL: µmol/phút ↔ mM/phút
    let s = Number(S);
    for (let x = 0; x < minutes; x += DT) s = Math.max(0, s - ((vmax * s) / (e.kmPaper + s)) * DT);
    const pnp = Number(S) - s; // mM
    const ion = stop === 'base' ? 1 : 1 / (1 + 10 ** (7.15 - 2));
    const Atrue = 18500 * (pnp / 1000) * ion;
    const m = measure(Atrue, 405, { rand: this.random });
    const v = (m.A / 18500) * 1000 / minutes; // mM/phút = µmol/phút trong 1 mL
    const activity = v / (ug / 1000); // µmol/phút/mg
    this.points.push({ S: Number(S), v, A: m.A, over: m.over || m.A > 2 });
    events.push({ type: 'machine', label: 'Máy quang phổ', text: `[S] = ${fmt(S, 2)} mM, ${ug} µg lipase, ${minutes} phút ở ${T} °C${buffer ? `, pH ${fmt(pH, 1)}` : ', không có đệm'}; dừng bằng ${stop === 'base' ? 'Na₂CO₃ (kiềm)' : 'HCl (acid)'}: A405 = ${fmt(m.A, 3)}.` });
    events.push({ type: 'effect', label: 'Hoạt độ', text: `v = ΔA·V/(ε·l·t) = ${fmt(v * 1000, 2)} nmol/phút → ${fmt(activity, 2)} µmol/phút/mg${additive !== 'none' ? ` (phụ gia ${additive}: hoạt độ còn lại theo bài báo ${e.additives[additive]} %)` : ''}.` });
    if (stop !== 'base') events.push({ type: 'warning', label: 'Chưa đúng', text: 'Dừng bằng acid: p-nitrophenol ở dạng không ion hoá gần như không màu ở 405 nm, phải dừng bằng dung dịch kiềm (pH > 10).' });
    if (m.A > 1.5) events.push({ type: 'warning', label: 'Chưa đúng', text: `A405 = ${fmt(m.A, 2)} vượt khoảng tuyến tính: ánh sáng lạc làm số đọc thấp hơn thật. Giảm lượng enzyme hoặc thời gian ủ.` });
    if (pnp / Number(S) > 0.1) events.push({ type: 'warning', label: 'Chưa đúng', text: `Đã dùng hết ${fmt((pnp / Number(S)) * 100, 0)} % cơ chất: không còn là tốc độ ban đầu, Km và Vmax tính ra sẽ lệch.` });
    if (!buffer) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Quên đệm Tris-HCl: pH lệch khỏi vùng bền 6–8 của enzyme, hoạt độ giảm.' });
    this.last = { S: Number(S), v, A: m.A };
    this.notebook.add({ day: '', experiment: 'Lipase', action: EZ_ACTIONS['ez-pnpp'], subject: `[S] ${fmt(S, 2)} mM`, result: fmt(m.A, 3), v: fmt(v * 1000, 3), activity: fmt(activity, 3) });
    return { ok: true, A: m.A, v, events };
  }

  // Lineweaver–Burk: 1/v theo 1/[S], hồi quy tuyến tính; Km = hệ số góc / tung độ gốc, Vmax = 1 / tung độ gốc
  lineweaver() {
    const pts = this.points.filter((p) => p.v > 0);
    const xs = [...new Set(pts.map((p) => p.S))];
    if (xs.length < 3) return { ok: false, events: [{ type: 'warning', text: 'Cần đo ít nhất 3 nồng độ cơ chất khác nhau.' }] };
    const X = pts.map((p) => 1 / p.S);
    const Y = pts.map((p) => 1 / (p.v * 1000)); // 1/(nmol/phút)
    const n = X.length;
    const mx = X.reduce((a, b) => a + b, 0) / n;
    const my = Y.reduce((a, b) => a + b, 0) / n;
    const b = X.reduce((s, x, i) => s + (x - mx) * (Y[i] - my), 0) / X.reduce((s, x) => s + (x - mx) ** 2, 0);
    const a = my - b * mx;
    const Vmax = 1 / a;
    const Km = b / a;
    this.last = { Km, Vmax };
    const e = this.data.enzymes.lipase;
    const events = [
      { type: 'machine', label: 'Lineweaver–Burk', text: `1/v = ${fmt(b, 4)} × 1/[S] + ${fmt(a, 4)} (${n} điểm).` },
      { type: 'effect', label: 'Hằng số', text: `Km = ${fmt(Km, 2)} mM, Vmax = ${fmt(Vmax, 2)} nmol/phút (bài báo: Km ${String(e.kmPaper).replace('.', ',')} mM).` },
    ];
    if (pts.some((p) => p.over)) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Có điểm đo ngoài khoảng tuyến tính của máy: các điểm [S] cao bị nén lại, Km và Vmax lệch.' });
    return { ok: Number.isFinite(Km) && Km > 0, Km, Vmax, points: X.map((x, i) => [x, Y[i]]), fit: { a, b }, events };
  }

  figureData() {
    const T = Math.max(37, ...[...this.tubes.values()].filter((t) => t.medium === 'bath').map((t) => t.setT));
    return { setC: T, waterC: T, lid: 'open', minutes: Math.round(Math.max(0, ...[...this.tubes.values()].map((t) => t.time))), tubes: [...this.tubes.values()].map((t) => ({ n: t.tube, label: t.e.name, color: t.s.kind === 'starch' ? this.lugol(t).color : '#dfe9ee', level: Math.min(1, t.V / 12), precipitate: null, ring: null })) };
  }
}
