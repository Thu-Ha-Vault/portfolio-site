// Đèn cồn trên bàn hoá học (giai đoạn 5 mục 2): đun ống nghiệm và cốc, sôi, bay hơi tới cạn khô; nhiệt phân và thăng hoa
// chất rắn; thử màu ngọn lửa bằng dây đốt; đốt băng magnesium; thử khí bằng que đóm.
// Mô hình nhiệt một nút: công suất đèn = tốc độ cháy × nhiệt đốt cháy ethanol; một phần đi vào vật chứa; mất nhiệt theo
// Newton; tới 100 °C thì nhiệt dư làm nước bay hơi (nhiệt hoá hơi). Phản ứng nhiệt phân bậc nhất, tốc độ gấp đôi mỗi 20 K
// trên nhiệt độ bắt đầu (minh hoạ). Số liệu và nguồn trong data/flame.json. Không phụ thuộc DOM.

import { Notebook } from './notebook.js';

export const FL_ACTIONS = {
  'fl-light': 'Châm đèn cồn',
  'fl-out': 'Tắt đèn cồn',
  'fl-heat': 'Đun bằng đèn cồn',
  'fl-cool': 'Để nguội',
  'fl-clean': 'Làm sạch dây đốt',
  'fl-test': 'Thử màu ngọn lửa',
  'fl-burn': 'Đốt băng magnesium',
  'fl-splint': 'Thử khí bằng que đóm',
};
export const FL_TARGETS = { 'tt-1': 'Ống nghiệm 1', 'tt-2': 'Ống nghiệm 2', 'tt-3': 'Ống nghiệm 3', 'beaker-a': 'Cốc A', 'beaker-b': 'Cốc B', 'beaker-c': 'Cốc C' };

const DT = 0.5; // s, bước tính
const dec = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const chem = (f) => String(f ?? '').replace(/([A-Za-z)\]])(\d+)/g, (_, a, d) => a + [...d].map((x) => SUB[x]).join(''));
const EPS = 1e-9;

export class FlameLab {
  constructor(engine, data) {
    this.engine = engine;
    this.data = data;
    this.notebook = new Notebook();
    this.reset();
  }

  reset() {
    this.lamp = { lit: false, fuel: this.data.lamp.fuel_g };
    this.wire = { clean: true, last: null };
    this.gas = new Map(); // vật chứa → id các khí vừa thoát ra trong lần đun gần nhất (cho que đóm)
    this.last = { target: 'tt-1', seconds: 30, even: true, gauze: true };
    this.flame = null; // màu ngọn lửa đang thấy khi thử màu (hex) hoặc null
    this.notebook.clear();
  }

  /** Công suất nhiệt của đèn (W) = tốc độ cháy × nhiệt đốt cháy. */
  get power() {
    const L = this.data.lamp;
    return ((L.burn_g_per_min / 60) * L.dHc_kJ_per_g * 1000);
  }

  do(action, params = {}) {
    const fn = {
      'fl-light': () => this.light(params),
      'fl-out': () => this.out(params),
      'fl-heat': () => this.heat(params),
      'fl-cool': () => this.cool(params),
      'fl-clean': () => this.clean(params),
      'fl-test': () => this.test(params),
      'fl-burn': () => this.burn(params),
      'fl-splint': () => this.splint(params),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #needFlame() {
    return this.lamp.lit ? null : { ok: false, events: [{ type: 'warning', label: 'Đèn chưa cháy', text: 'Mở nắp và châm đèn cồn bằng diêm trước.' }] };
  }

  #burnFuel(seconds) {
    this.lamp.fuel = Math.max(0, this.lamp.fuel - (this.data.lamp.burn_g_per_min * seconds) / 60);
    return this.lamp.fuel < 5 ? [{ type: 'warning', label: 'Sắp hết cồn', text: `Đèn còn khoảng ${dec(this.lamp.fuel, 0)} g cồn. Tắt đèn, để nguội rồi mới rót thêm cồn (không rót khi đèn đang cháy).` }] : [];
  }

  light({ method = 'match' } = {}) {
    if (this.lamp.lit) return { ok: true, events: [{ type: 'info', text: 'Đèn cồn đang cháy.' }] };
    this.lamp.lit = true;
    const events = [{ type: 'machine', label: 'Đèn cồn', text: `Mở nắp đèn, châm bấc ${method === 'lamp' ? 'bằng một đèn cồn khác' : 'bằng que diêm'}. Ngọn lửa xanh nhạt ở lõi, vàng cam ở ngoài, cao khoảng 4–5 cm.` }];
    if (method === 'lamp') events.push({ type: 'warning', label: 'Sai quy tắc', text: 'Không châm đèn cồn từ một đèn cồn khác: nghiêng đèn làm cồn chảy ra và bắt lửa. Châm bằng diêm hoặc bật lửa.' });
    return { ok: method !== 'lamp', events, lamp: true };
  }

  out({ method = 'cap' } = {}) {
    if (!this.lamp.lit) return { ok: true, events: [{ type: 'info', text: 'Đèn cồn đã tắt.' }] };
    this.lamp.lit = false;
    this.flame = null;
    if (method === 'blow') return { ok: false, lamp: false, events: [{ type: 'warning', label: 'Sai quy tắc', text: 'Không thổi để tắt đèn cồn: hơi thở có thể đẩy lửa vào bầu đèn làm cồn bên trong bắt cháy. Tắt bằng cách đậy nắp; ngọn lửa tắt vì hết oxygen.' }] };
    return { ok: true, lamp: false, events: [{ type: 'machine', label: 'Đèn cồn', text: 'Đậy nắp đèn: ngọn lửa tắt vì thiếu oxygen. Nắp đậy kín còn giữ cồn không bay hơi.' }] };
  }

  // Trạng thái của vật chứa dạng đơn giản để mô phỏng mà không đổi lõi (dùng cho xem trước khi đang hơ)
  #snapshot(id) {
    const box = this.engine.containers.get(id);
    return { id, kind: box.kind, name: box.name, T: box.T, volume: box.volume, amounts: new Map(box.amounts), ring: new Map(box.ring) };
  }

  /**
   * Mô phỏng đun `seconds` giây. opts: { even: hơ đều cả ống trước, gauze: cốc đặt trên lưới }.
   * Trả về trạng thái cuối và dòng thời gian (mỗi giây) cho cảnh 3D: nhiệt độ, thể tích, sôi, khí, hơi màu.
   */
  simulate(id, seconds, { even = true, gauze = true } = {}, state = this.#snapshot(id)) {
    const D = this.data;
    const eng = this.engine;
    const tube = state.kind === 'testtube';
    const eff = tube ? D.transfer.tube_in_flame : gauze ? D.transfer.beaker_on_gauze : D.transfer.beaker_no_gauze;
    const P = this.power * eff;
    const geo = tube ? D.tube : D.beaker;
    const room = eng.room;
    const W = D.water;
    const T0 = state.T;
    const v0 = state.volume;
    const info = { tBoil: null, tDry: null, bumped: 0, splatter: false, maxT: state.T, gases: new Map(), rules: new Map(), lost: 0 };
    const timeline = [];
    const series = [[0, +state.T.toFixed(1)]];
    let gasNow = new Set();
    let vaporNow = null;
    for (let t = DT; t <= seconds + 1e-9; t += DT) {
      const wet = state.volume > W.dryAt_mL;
      const h = wet ? geo.h_W_per_m2K : tube ? D.tube.h_dry_W_per_m2K : geo.h_W_per_m2K;
      const loss = h * geo.area_m2 * (state.T - room);
      if (wet && state.T >= W.boil_C - 1e-6) {
        if (info.tBoil === null) {
          info.tBoil = t;
          // Không hơ đều: chất lỏng ở đáy quá nhiệt rồi sôi bùng, trào ra miệng ống
          if (tube && !even && state.volume >= D.bump.minVolume_mL) {
            const k = D.bump.loss;
            info.bumped = state.volume * k;
            state.volume *= 1 - k;
            for (const [sid, n] of state.amounts) state.amounts.set(sid, n * (1 - k));
          }
        }
        const m = Math.max(0, ((P - loss) * DT) / W.Lv_J_per_g);
        state.volume = Math.max(0, state.volume - m);
        state.T = W.boil_C;
        if (state.volume < D.splatter_mL && state.volume > W.dryAt_mL) info.splatter = true;
        gasNow.add('H2Og');
        if (state.volume <= W.dryAt_mL && info.tDry === null) { info.tDry = t; state.volume = 0; }
      } else {
        const C = Math.max(1, eng.heatCapacity(state));
        state.T += ((P - loss) * DT) / C;
        if (state.T > W.boil_C && state.volume > W.dryAt_mL) state.T = W.boil_C;
      }
      info.maxT = Math.max(info.maxT, state.T);
      // Nhiệt phân, thăng hoa
      const dry = state.volume <= W.dryAt_mL;
      for (const r of D.decompositions) {
        if (state.T < r.minT || (r.dry && !dry)) continue;
        const k = Math.min(1, r.k_per_s * 2 ** ((state.T - r.minT) / 20));
        for (const from of r.from) {
          const n = state.amounts.get(from) ?? 0;
          if (n <= EPS) continue;
          const dn = n * (1 - Math.exp(-k * DT));
          state.amounts.set(from, n - dn);
          if (n - dn <= EPS) state.amounts.delete(from);
          const rec = info.rules.get(r.id) ?? { n: 0, t0: t, from };
          rec.n += dn;
          info.rules.set(r.id, rec);
          if (r.sublime) {
            state.ring.set(from, (state.ring.get(from) ?? 0) + dn);
            vaporNow = r.vapor;
          }
          for (const [pid, c] of r.products ?? []) state.amounts.set(pid, (state.amounts.get(pid) ?? 0) + dn * c);
          for (const [gid, c] of r.gases ?? []) {
            info.gases.set(gid, (info.gases.get(gid) ?? 0) + dn * c);
            if (dn * c > 1e-7) gasNow.add(gid);
          }
        }
      }
      if (Math.abs(t - Math.round(t)) < 1e-6) {
        timeline.push({ t, T: state.T, volume: state.volume, boiling: state.volume > W.dryAt_mL && state.T >= W.boil_C - 1e-6, gases: [...gasNow], vapor: vaporNow, dry });
        series.push([t, +state.T.toFixed(1)]);
        gasNow = new Set();
        vaporNow = null;
      }
    }
    return { state, timeline, series, info, T0, v0, P };
  }

  /** Xem trước (không đổi lõi): cảnh 3D gọi trong lúc người dùng đang hơ, để hiện đúng hiện tượng theo thời gian. */
  preview(id, seconds, opts = {}) {
    return this.simulate(id, seconds, opts);
  }

  heat({ target = 'tt-1', seconds = 30, even = true, gauze = true } = {}) {
    const need = this.#needFlame();
    if (need) return need;
    const box = this.engine.containers.get(target);
    if (!box || !FL_TARGETS[target]) return { ok: false, events: [{ type: 'warning', text: 'Chọn ống nghiệm hoặc cốc để đun.' }] };
    const s = Math.max(1, Math.min(600, Math.round(Number(seconds) || 30)));
    const tube = box.kind === 'testtube';
    const evenOn = even === true || even === 'yes';
    const gauzeOn = gauze === true || gauze === 'yes';
    const empty = box.volume <= this.data.water.dryAt_mL && ![...box.amounts.values()].some((n) => n > EPS);
    this.last = { target, seconds: s, even: evenOn, gauze: gauzeOn };
    if (empty) return { ok: false, events: [{ type: 'warning', label: 'Vật chứa trống', text: `${box.name} chưa có gì: đun ống hoặc cốc rỗng làm thuỷ tinh nóng cục bộ, dễ nứt.` }] };
    const before = new Map(box.amounts);
    const sim = this.simulate(target, s, { even: evenOn, gauze: gauzeOn });
    const { state, info } = sim;
    box.amounts = state.amounts;
    box.ring = state.ring;
    this.engine.setTemperature(target, state.T, { volume: state.volume });
    const fuel = this.#burnFuel(s);
    const name = box.name;
    const events = [{ type: 'machine', label: 'Đèn cồn', text: tube ? `Kẹp ${name} bằng kẹp ống nghiệm, ${evenOn ? 'hơ đều cả ống rồi đun tập trung ở đáy' : 'đưa ngay đáy ống vào ngọn lửa'}, miệng ống hướng ra xa người, ${s} giây (đèn cấp khoảng ${dec(sim.P, 0)} W vào ống).` : `Đặt ${name} lên kiềng${gauzeOn ? ' có lưới tản nhiệt' : ' không có lưới'}, đèn cồn bên dưới, đun ${s} giây (khoảng ${dec(sim.P, 0)} W vào cốc).` }];
    if (!tube && !gauzeOn) events.push({ type: 'warning', label: 'Không có lưới', text: 'Ngọn lửa chạm thẳng đáy cốc thuỷ tinh: đáy nóng cục bộ, cốc có thể nứt. Đặt lưới tản nhiệt lên kiềng trước.' });
    if (sim.v0 > this.data.water.dryAt_mL) {
      const parts = [`Nhiệt độ ${dec(sim.T0, 0)} → ${dec(state.T, 0)} °C.`];
      if (info.tBoil !== null) parts.push(`Sôi sau khoảng ${dec(info.tBoil, 0)} giây: bọt khí lớn sủi từ đáy, hơi nước bốc lên ở miệng ${tube ? 'ống' : 'cốc'}.`);
      const lost = sim.v0 - state.volume - info.bumped;
      if (lost > 0.01) parts.push(`Nước bay hơi ${dec(lost, 2)} mL${state.volume > 0 ? `, còn ${dec(state.volume, 2)} mL` : ''}.`);
      events.push({ type: 'effect', label: 'Đun nóng', text: parts.join(' ') });
    } else {
      events.push({ type: 'effect', label: 'Đun chất rắn', text: `Chất rắn trong ống nóng lên ${dec(info.maxT, 0)} °C (ống khô không có nước giữ ở 100 °C nên nóng hơn nhiều).` });
    }
    if (info.bumped > 0) events.push({ type: 'warning', label: 'Trào', text: `Đun ngay ở đáy mà không hơ đều: dung dịch ở đáy quá nhiệt rồi sôi bùng, trào ra khỏi miệng ống khoảng ${dec(info.bumped, 1)} mL. Phải hơ đều cả ống trước, rồi mới đun tập trung ở đáy.` });
    if (info.tDry !== null) {
      const residue = [...state.amounts].filter(([id, n]) => n > EPS && this.engine.substances.get(id).state !== 'g');
      const txt = residue.map(([id, n]) => { const sb = this.engine.substances.get(id); return `${chem(sb.formula ?? sb.label)} ${dec(n * sb.Mr * 1000, 0)} mg`; }).join(', ');
      events.push({ type: 'effect', label: 'Cô cạn', text: `Sau khoảng ${dec(info.tDry, 0)} giây nước bay hơi hết${txt ? `: còn lại chất rắn ở đáy (${txt}). Đây là cách tách chất tan khỏi dung dịch (cô cạn).` : '.'}` });
    }
    if (info.splatter) events.push({ type: 'warning', label: 'Bắn', text: 'Dung dịch còn rất ít mà vẫn đun mạnh: chất rắn kết tinh nổ lách tách và bắn ra ngoài. Khi gần cạn nên tắt lửa, để nhiệt dư làm khô nốt.' });
    for (const r of this.data.decompositions) {
      const rec = info.rules.get(r.id);
      if (!rec || rec.n <= 1e-7) continue;
      const sb = this.engine.substances.get(rec.from);
      const left = state.amounts.get(rec.from) ?? 0;
      const share = Math.min(1, rec.n / (rec.n + left));
      events.push({ type: 'effect', label: r.sublime ? 'Thăng hoa' : 'Nhiệt phân', text: `${r.equation}. ${r.observation} Từ khoảng giây ${dec(rec.t0, 0)} (trên ${r.minT} °C), ${Math.round(share * 100)} % ${chem(sb.formula)} đã ${r.sublime ? 'thăng hoa' : 'phân huỷ'}.` });
      if (r.id === 'i2') events.push({ type: 'warning', label: 'Hơi iodine', text: 'Hơi iodine kích ứng mắt và đường thở: đun iodine trong tủ hút, ống nghiệm nút bông.' });
    }
    // Khí trong ống ngay sau khi đun (cho que đóm): chỉ các khí sinh ra trong lần đun này
    const gases = [...info.gases].filter(([, n]) => n > 1e-6).map(([id]) => id).filter((id) => id !== 'H2Og');
    this.gas.set(target, gases);
    const decomposed = [...info.rules.values()].some((r) => r.n > 1e-7);
    if (!decomposed && info.tBoil === null && sim.v0 <= this.data.water.dryAt_mL) {
      const solids = [...before.keys()].map((id) => this.engine.substances.get(id)).filter((sb) => sb?.solid);
      const need = this.data.decompositions.filter((r) => r.from.some((f) => before.has(f)));
      if (solids.length) events.push({ type: 'info', text: need.length ? `Chưa đủ nóng hoặc chưa đủ lâu: ${need.map((r) => `${r.equation} bắt đầu khoảng ${r.minT} °C`).join('; ')}. Đun thêm.` : `${solids.map((sb) => chem(sb.formula)).join(', ')} không đổi khi đun bằng đèn cồn.` });
    }
    const hyd = this.engine.rehydrate(target);
    if (hyd) events.push(hyd);
    events.push(...fuel);
    const ok = info.bumped === 0 && (tube || gauzeOn);
    this.notebook.add({ day: '', experiment: 'Đèn cồn', action: FL_ACTIONS['fl-heat'], subject: name, result: `${dec(state.T, 0)} °C, còn ${dec(state.volume, 2)} mL`, seconds: s, even: evenOn ? 'có' : 'không' });
    return { ok, events, series: [{ name, points: sim.series }], timeline: sim.timeline, target, gases };
  }

  // Để nguội trên giá: định luật Newton, hằng số thời gian = nhiệt dung / (h × diện tích); ống khô mất nhiệt nhanh hơn
  cool({ target = 'tt-1', seconds = 180 } = {}) {
    const box = this.engine.containers.get(target);
    if (!box || !FL_TARGETS[target]) return { ok: false, events: [{ type: 'warning', text: 'Chọn ống nghiệm hoặc cốc để làm nguội.' }] };
    const D = this.data;
    const tube = box.kind === 'testtube';
    const geo = tube ? D.tube : D.beaker;
    const wet = box.volume > D.water.dryAt_mL;
    const hA = (wet ? geo.h_W_per_m2K : tube ? D.tube.h_dry_W_per_m2K : geo.h_W_per_m2K) * geo.area_m2;
    const tau = Math.max(1, this.engine.heatCapacity(box)) / hA;
    const s = Math.max(10, Math.min(1800, Number(seconds) || 180));
    const room = this.engine.room;
    const T0 = box.T;
    const T = room + (T0 - room) * Math.exp(-s / tau);
    this.engine.setTemperature(target, T);
    this.gas.set(target, []);
    return { ok: true, events: [{ type: 'machine', label: 'Để nguội', text: `Đặt ${box.name} lên giá ${s >= 60 ? `${dec(s / 60, 0)} phút` : `${s} giây`}: ${dec(T0, 0)} → ${dec(T, 0)} °C (hằng số thời gian khoảng ${dec(tau, 0)} giây).` }], target };
  }

  clean() {
    const need = this.#needFlame();
    if (need) return need;
    this.wire = { clean: true, last: null };
    this.flame = null;
    return { ok: true, events: [{ type: 'machine', label: 'Dây đốt', text: 'Nhúng dây nichrome vào HCl rồi hơ trên ngọn lửa, lặp lại tới khi ngọn lửa không còn màu lạ. Dây nichrome luôn để lại chút màu cam nhạt.' }] };
  }

  test({ sample, cobalt = false } = {}) {
    const need = this.#needFlame();
    if (need) return need;
    const sub = this.engine.substances.get(sample);
    if (!sub) return { ok: false, events: [{ type: 'warning', text: 'Chọn chất để thử màu ngọn lửa.' }] };
    const C = this.data.flameColors;
    const el = sub.flame ?? null;
    const coOn = cobalt === true || cobalt === 'yes';
    const dirty = !this.wire.clean && this.wire.last && this.wire.last !== el;
    const seen = [el, dirty ? this.wire.last : null].filter(Boolean);
    // Màu thấy được: Na lấn át các màu khác; kính cobalt hấp thụ màu vàng cam của Na
    let show = seen.includes('Na') && !coOn ? 'Na' : seen.find((e) => e !== 'Na' || !coOn) ?? null;
    if (coOn && show === 'Na') show = null;
    const events = [{ type: 'machine', label: 'Thử màu ngọn lửa', text: `Nhúng đầu dây đốt vào ${chem(sub.formula ?? sub.label)} rồi đưa vào phần ngoài ngọn lửa${coOn ? ', nhìn qua kính cobalt xanh' : ''}.` }];
    if (show) {
      const c = C[show];
      events.push({ type: 'effect', label: 'Màu ngọn lửa', text: `Ngọn lửa ${c.name}${c.line ? ` (vạch phát xạ ${c.line})` : ''}: ion ${show}${show === 'Na' || show === 'K' || show === 'Li' ? '⁺' : '²⁺'} hấp thụ nhiệt, electron lên mức năng lượng cao rồi trở về, phát ra ánh sáng có màu riêng của nguyên tố.` });
    } else {
      events.push({ type: 'effect', label: 'Màu ngọn lửa', text: el && coOn && el === 'Na' ? 'Qua kính cobalt, màu vàng cam của sodium bị hấp thụ, gần như không thấy màu.' : 'Ngọn lửa không đổi màu rõ: chất này không có màu ngọn lửa đặc trưng.' });
    }
    if (dirty) events.push({ type: 'warning', label: 'Dây chưa làm sạch', text: `Dây đốt còn dính chất của lần thử trước (${this.wire.last}): ${this.wire.last === 'Na' ? 'màu vàng cam của sodium lấn át' : 'hai màu lẫn vào nhau'}. Nhúng HCl và hơ sạch dây trước mỗi mẫu.` });
    if (el === 'K' && !coOn && seen.includes('Na')) events.push({ type: 'info', text: 'Muốn thấy màu tím của potassium khi có sodium lẫn vào, nhìn qua kính cobalt xanh.' });
    this.wire = { clean: false, last: dirty && this.wire.last === 'Na' ? 'Na' : el ?? this.wire.last };
    this.flame = show ? C[show].color : null;
    const ok = !dirty;
    this.notebook.add({ day: '', experiment: 'Màu ngọn lửa', action: FL_ACTIONS['fl-test'], subject: chem(sub.formula ?? sub.label), result: show ? C[show].name : 'không màu rõ', cobalt: coOn ? 'có' : 'không' });
    return { ok, events, flame: this.flame };
  }

  burn({ tool = 'tongs', look = false } = {}) {
    const need = this.#needFlame();
    if (need) return need;
    const M = this.data.magnesium;
    const n = M.ribbon_g / 24.305;
    const events = [{ type: 'machine', label: 'Đốt magnesium', text: `${tool === 'tongs' ? 'Gắp' : 'Cầm tay'} một đoạn băng magnesium (khoảng ${dec(M.ribbon_g * 1000, 0)} mg) đưa vào ngọn lửa, chén sứ hứng bên dưới.` }];
    events.push({ type: 'effect', label: 'Phản ứng', text: `${M.equation}. ${M.observation} Sau khoảng ${M.ignite_s} giây trong lửa thì bắt cháy; thu được khoảng ${dec(n * 40.3 * 1000, 0)} mg MgO.` });
    const warn = [];
    if (tool !== 'tongs') warn.push('Không cầm băng magnesium bằng tay khi đốt: ngọn lửa magnesium rất nóng. Dùng kẹp sắt.');
    if (look === true || look === 'yes') warn.push('Không nhìn thẳng vào ngọn lửa magnesium: ánh sáng rất mạnh làm chói, hại mắt.');
    for (const w of warn) events.push({ type: 'warning', label: 'An toàn', text: w });
    this.notebook.add({ day: '', experiment: 'Đốt Mg', action: FL_ACTIONS['fl-burn'], subject: 'Mg', result: 'MgO trắng' });
    return { ok: !warn.length, events, burst: true };
  }

  splint({ target = 'tt-1' } = {}) {
    const need = this.#needFlame();
    if (need) return need;
    const box = this.engine.containers.get(target);
    if (!box) return { ok: false, events: [{ type: 'warning', text: 'Chọn ống nghiệm để thử.' }] };
    const g = this.gas.get(target) ?? [];
    let result = 'none';
    let text = `Châm que đóm, thổi tắt cho còn tàn đỏ, đưa vào miệng ${box.name}: que đóm vẫn chỉ còn tàn đỏ, không có khí làm cháy mạnh hay làm tắt.`;
    if (g.includes('O2')) { result = 'relight'; text = `Que đóm còn tàn đỏ đưa vào miệng ${box.name} bùng cháy thành ngọn lửa: khí thoát ra là O₂ (duy trì sự cháy).`; }
    else if (g.includes('CO2')) { result = 'out'; text = `Que đóm đang cháy đưa vào miệng ${box.name} tắt ngay: khí CO₂ không duy trì sự cháy. Muốn khẳng định là CO₂ thì dẫn khí qua nước vôi trong (vẩn đục).`; }
    return { ok: true, events: [{ type: 'effect', label: 'Que đóm', text }], splint: result, target };
  }
}
