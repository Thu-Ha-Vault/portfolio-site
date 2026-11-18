// Đun nóng và làm nguội cốc trên bàn hoá học (máy khuấy từ gia nhiệt IKA C-MAG HS 7 control).
// Gia nhiệt theo mô hình hai nút của figures/hotplate/model.mjs (mặt đế và dung dịch, bộ điều khiển PI khi có đầu dò,
// bay hơi theo Antoine). Làm nguội theo định luật Newton: h đối lưu tự nhiên của không khí lấy từ data/thermo.json,
// hệ số của chậu nước đá là số minh hoạ. Độ tan và kết tinh lại do LabEngine tính (Ksp theo van 't Hoff, ion chung).
// Không phụ thuộc DOM.

import { initialState, stepHeat, HS7, BEAKERS, THERMAL } from '../../figures/hotplate/model.mjs';
import { Notebook } from './notebook.js';

export const HP_ACTIONS = { 'hp-heat': 'Đun trên máy khuấy từ', 'hp-cool': 'Làm nguội', 'hp-look': 'Quan sát tinh thể', 'hp-kno3': 'Kết tinh lại KNO₃' };
export const HP_CUPS = { 'beaker-a': 'Cốc A', 'beaker-b': 'Cốc B', 'beaker-c': 'Cốc C' };
const ICE_H = 200; // W/(m²·K), cốc ngâm trong chậu nước đá (minh hoạ, đối lưu tự nhiên của nước 50–1000)
const ICE_DEPTH = 0.03; // m, phần thành cốc ngập trong nước đá
const dec = (v, d = 1) => v.toFixed(d).replace('.', ',');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const chemText = (f) => f.replace(/([A-Za-z)])(\d+)/g, (_, a, d) => a + [...d].map((x) => SUB[x]).join(''));
// Có đầu dò: mạch an toàn của mặt đế đặt cao hơn nhiệt độ đặt 60 K (tối thiểu 100 °C, dải chỉnh 100–650 °C của máy),
// để cốc nhỏ không bị mặt đế quá nóng làm dung dịch vượt nhiệt độ đặt và sôi (khoảng cách 60 K là minh hoạ).
const SAFETY_ABOVE = 60;

export class HeatLab {
  constructor(engine) {
    this.engine = engine;
    this.notebook = new Notebook();
    this.reset();
  }

  reset() {
    this.last = { cup: 'beaker-a', setC: 95, rpm: 300, probe: true, minutes: 10, volumeMl: 11 };
    this.history = new Map(); // cốc → { maxT, cooled: 'air' | 'ice' | null }
    this.plateC = 25; // nhiệt độ mặt đế (đèn Hot Top sáng khi trên 50 °C)
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'hp-heat': () => this.heat(params), 'hp-cool': () => this.cool(params), 'hp-look': () => this.look(params), 'hp-kno3': () => this.kno3(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #cup(id) {
    const box = this.engine.containers.get(id);
    if (!box || !HP_CUPS[id]) return { error: { ok: false, events: [{ type: 'warning', text: 'Chọn Cốc A, B hoặc C để đặt lên máy.' }] } };
    if (box.volume <= 0.05) return { error: { ok: false, events: [{ type: 'warning', text: `${box.name} đang trống: rót dung dịch vào cốc trước khi đun.` }] } };
    return { box };
  }

  // Các kết tủa có Ksp trong cốc (để báo tan hay chưa)
  #solids(box) {
    return [...box.amounts.keys()].filter((id) => this.engine.ksp(id, 25) !== null).map((id) => ({ id, sub: this.engine.substances.get(id), ...this.engine.solid(box.id, id) }));
  }

  heat({ cup = 'beaker-a', setC = 95, minutes = 10, rpm = 300, probe = true }) {
    const { box, error } = this.#cup(cup);
    if (error) return error;
    const set = clamp(Math.round(Number(setC)), 30, probe ? 300 : HS7.plateMax);
    const min = clamp(Number(minutes) || 10, 1, 60);
    const n = clamp(Math.round(Number(rpm) / 10) * 10, 0, HS7.rpm[1]);
    const probeOn = probe === true || probe === 'yes';
    const room = this.engine.room;
    const s = initialState({ volumeMl: box.volume, roomC: room, beakerMl: 50 });
    s.T = box.T;
    const dt = 0.5;
    const liquid = [[0, s.T]];
    const plate = [[0, s.Tp]];
    let reach = null;
    let maxT = s.T;
    let boiled = false;
    for (let i = 1; i <= (min * 60) / dt; i++) {
      stepHeat(s, { setC: set, probe: probeOn, heat: true, rpm: n, roomC: room, safetyC: probeOn ? clamp(set + SAFETY_ABOVE, HS7.safety[0], HS7.safety[1]) : undefined }, dt);
      maxT = Math.max(maxT, s.T);
      boiled ||= s.boiling;
      if (reach === null && probeOn && Math.abs(s.T - Math.min(set, 100)) < 1) reach = s.t / 60;
      if (i % 20 === 0) { liquid.push([s.t / 60, s.T]); plate.push([s.t / 60, s.Tp]); }
    }
    const before = this.#solids(box);
    const lost = box.volume - s.m;
    this.plateC = s.Tp;
    const sol = this.engine.setTemperature(cup, s.T, { volume: s.m });
    this.last = { cup, setC: set, rpm: n, probe: probeOn, minutes: min, volumeMl: box.volume };
    const h = this.history.get(cup) ?? { maxT: box.T, cooled: null };
    h.maxT = Math.max(h.maxT, maxT);
    h.cooled = null;
    this.history.set(cup, h);

    const events = [{ type: 'machine', label: 'Máy khuấy từ', text: `${box.name} (cốc 50 mL, ${dec(s.m + lost)} mL) trên mặt đế, khuấy ${n} vòng/phút, ${probeOn ? `đặt ${set} °C cho dung dịch (đầu dò PT1000 nhúng trong cốc)` : `đặt mặt đế ${set} °C (không cắm đầu dò)`}, ${dec(min, 0)} phút.` }];
    events.push({ type: 'effect', text: `Dung dịch lên ${dec(s.T)} °C${reach !== null ? ` (đạt nhiệt độ đặt sau khoảng ${dec(reach)} phút)` : ''}, mặt đế ${dec(s.Tp, 0)} °C.${maxT > s.T + 1 ? ` Lúc đầu dung dịch vượt lên ${dec(maxT)} °C rồi mới ổn định.` : ''} Bay hơi ${dec(lost, 2)} mL, còn ${dec(s.m, 2)} mL.` });
    if (!probeOn) events.push({ type: 'warning', label: 'Không có đầu dò', text: `Máy chỉ giữ mặt đế ở ${set} °C. Dung dịch luôn nguội hơn mặt đế vì mất nhiệt qua thành cốc và mặt thoáng, nên chỉ lên khoảng ${dec(s.T, 0)} °C. Muốn dung dịch đúng nhiệt độ thì cắm đầu dò vào cốc.` });
    if (boiled) events.push({ type: 'warning', label: 'Sôi', text: 'Dung dịch sôi: nước bay hơi nhanh, dung dịch đặc lại; chất tan có thể bắn ra ngoài. Hạ nhiệt độ đặt xuống dưới 100 °C.' });
    if (n === 0) events.push({ type: 'info', text: 'Không khuấy: dung dịch ở đáy nóng hơn ở mặt, chất rắn lắng ở đáy tan chậm.' });
    for (const b of before) {
      const d = sol.get(b.id);
      const left = b.n - d.after;
      const name = chemText(b.sub.formula);
      if (left <= 1e-9) events.push({ type: 'effect', label: name, text: `${name} tan hết ở ${dec(s.T, 0)} °C: dung dịch trong, không màu. Độ tan của ${name} tăng mạnh theo nhiệt độ (quá trình hoà tan thu nhiệt, ΔH = ${dec(this.engine.thermo.ksp_25C[b.id].dH_sol_kJ)} kJ/mol).` });
      else events.push({ type: 'warning', label: name, text: `Còn ${dec(left * b.sub.Mr * 1000)} mg ${name} chưa tan ở ${dec(s.T, 0)} °C (${Math.round((100 * d.after) / b.n)} % đã tan). Cần nóng hơn, thêm nước, hoặc bớt chất dư (ion chung làm giảm độ tan). Phần chưa tan làm mầm, khi nguội tinh thể mọc trên đó thành bột nhỏ.` });
    }
    this.notebook.add({ day: '', experiment: 'Máy khuấy từ', action: HP_ACTIONS['hp-heat'], subject: box.name, result: `${dec(s.T)} °C`, set, probe: probeOn ? 'có' : 'không', minutes: min });
    return { ok: true, events, series: [{ name: 'dung dịch', points: liquid }, { name: 'mặt đế', points: plate }] };
  }

  cool({ cup = 'beaker-a', minutes = 30, mode = 'air' }) {
    const { box, error } = this.#cup(cup);
    if (error) return error;
    const ice = mode === 'ice';
    const min = clamp(Number(minutes) || 30, 1, 120);
    const room = this.engine.room;
    const env = ice ? 0 : room;
    // Diện tích ngoài của cốc 50 mL (đáy + thành); trong chậu đá chỉ phần ngập trao đổi với nước đá
    const b = BEAKERS.find((x) => x.ml === 50);
    const r = b.od / 2000;
    const hAir = this.engine.thermo?.physical?.newton_cooling?.h_W_per_m2K ?? 7;
    const aOut = Math.PI * r * r + 2 * Math.PI * r * (b.h / 1000);
    const hA = ice ? ICE_H * (Math.PI * r * r + 2 * Math.PI * r * ICE_DEPTH) + hAir * 2 * Math.PI * r * (b.h / 1000 - ICE_DEPTH) : hAir * aOut;
    const C = this.engine.heatCapacity(box);
    const tau = C / hA; // giây
    const T0 = box.T;
    const before = this.#solids(box);
    const dt = 10;
    const pts = [[0, T0]];
    for (let t = dt; t <= min * 60; t += dt) {
      const prev = box.T;
      const T = env + (prev - env) * Math.exp(-dt / tau);
      this.engine.setTemperature(cup, T, { rate: ((prev - T) / dt) * 60 });
      if (t % 60 === 0) pts.push([t / 60, T]);
    }
    // Máy đã tắt: mặt đế nguội với hằng số thời gian C_đế / h_đế của mô hình
    this.plateC = room + (this.plateC - room) * Math.exp((-min * 60 * THERMAL.plateLoss) / THERMAL.plateC);
    const h = this.history.get(cup) ?? { maxT: T0, cooled: null };
    h.cooled = ice ? 'ice' : 'air';
    this.history.set(cup, h);
    const events = [{ type: 'machine', label: ice ? 'Chậu nước đá' : 'Để nguội', text: `${box.name} ${ice ? 'ngâm trong chậu nước đá' : 'nhấc khỏi mặt đế, để trên lưới ở nhiệt độ phòng'} ${dec(min, 0)} phút: ${dec(T0)} → ${dec(box.T)} °C (hằng số thời gian khoảng ${dec(tau / 60)} phút, tốc độ nguội ban đầu ${dec((T0 - env) / (tau / 60))} K/phút).` }];
    for (const s0 of before) {
      const s1 = this.engine.solid(cup, s0.id);
      const grown = s1.plates + s1.fine - s0.plates - s0.fine;
      if (grown <= 1e-9) continue;
      const name = chemText(s0.sub.formula);
      if (s1.plates - s0.plates > s1.fine - s0.fine) events.push({ type: 'effect', label: name, text: `Nguội chậm: ${name} kết tinh lại thành vảy lục giác vàng óng ánh, lấp lánh khi lắc cốc (mưa vàng), ${dec(grown * s0.sub.Mr * 1000)} mg.` });
      else events.push({ type: 'warning', label: name, text: `Nguội quá nhanh: dung dịch quá bão hoà mạnh, nhiều mầm sinh cùng lúc nên ${name} tách ra thành bột vàng mịn (${dec(grown * s0.sub.Mr * 1000)} mg), không có vảy óng ánh. Để nguội từ từ ở nhiệt độ phòng thì tinh thể lớn hơn.` });
    }
    this.notebook.add({ day: '', experiment: 'Làm nguội', action: HP_ACTIONS['hp-cool'], subject: box.name, result: `${dec(box.T)} °C`, mode: ice ? 'nước đá' : 'không khí', minutes: min });
    return { ok: true, events, series: [{ name: box.name, points: pts }] };
  }

  look({ cup = 'beaker-a' }) {
    const box = this.engine.containers.get(cup);
    if (!box) return { ok: false, events: [{ type: 'warning', text: 'Không có cốc này.' }] };
    const solids = this.#solids(box);
    if (!solids.length) return { ok: false, events: [{ type: 'warning', text: `${box.name} không có kết tủa nào kết tinh lại được.` }] };
    const events = [];
    const rows = [];
    for (const s of solids) {
      const m = (x) => x * s.sub.Mr * 1000;
      rows.push([chemText(s.sub.formula), `${dec(m(s.plates))} mg`, `${dec(m(s.fine))} mg`, `${dec(m(s.raw))} mg`, `${dec(m(s.dissolved))} mg`]);
      const solid = s.plates + s.fine + s.raw;
      const share = solid > 0 ? s.plates / solid : 0;
      if (share >= 0.6) events.push({ type: 'effect', label: chemText(s.sub.formula), text: `Phần lớn chất rắn (${Math.round(share * 100)} %) là vảy tinh thể lớn: kết tinh lại thành công. Lọc, rửa bằng nước lạnh và để khô là thu được ${chemText(s.sub.formula)} tinh khiết hơn kết tủa ban đầu.` });
      else if (s.raw > s.plates + s.fine) events.push({ type: 'warning', label: chemText(s.sub.formula), text: `Phần lớn vẫn là kết tủa ban đầu chưa tan (${dec(m(s.raw))} mg): lần đun chưa đủ nóng hoặc dung dịch có quá nhiều ion chung, nên không kết tinh lại được.` });
      else events.push({ type: 'warning', label: chemText(s.sub.formula), text: `Chỉ ${Math.round(share * 100)} % là vảy tinh thể; còn lại là bột mịn${s.raw > 1e-9 ? ' và kết tủa ban đầu' : ''}. Kết tinh lại chưa đạt.` });
    }
    events.push({ type: 'info', text: `Còn tan trong dung dịch ở ${dec(box.T, 0)} °C: phần này mất khi lọc. Làm lạnh thêm trước khi lọc thì thu được nhiều tinh thể hơn.` });
    return { ok: true, events, table: { head: ['Chất', 'Vảy tinh thể', 'Bột mịn', 'Kết tủa ban đầu', 'Còn tan'], rows } };
  }

  /** Độ tan (g/100 g nước) ở T °C, nội suy tuyến tính trong bảng data/thermo.json (bỏ qua ô trống). */
  solubilityG(id, T) {
    const tb = this.engine.thermo?.solubility_g_per_100g_water;
    const pts = tb.T_C.map((t, i) => [t, tb[id][i]]).filter(([, v]) => v !== null && v !== undefined);
    const x = clamp(T, pts[0][0], pts.at(-1)[0]);
    for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) return pts[i - 1][1] + ((x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0])) * (pts[i][1] - pts[i - 1][1]);
    return pts.at(-1)[1];
  }

  /**
   * Kết tinh lại KNO₃: hoà grams g vào waterMl mL nước, đun tới hotC trên máy khuấy, rồi làm lạnh tới coolC.
   * Độ tan theo bảng trong data/thermo.json; hoà tan thu nhiệt (ΔH hoà tan) làm nước lạnh đi lúc đầu.
   */
  kno3({ grams = 20, waterMl = 20, hotC = 80, coolC = 0 }) {
    const g = Number(grams);
    const w = Number(waterMl);
    const sHot = this.solubilityG('KNO3', Number(hotC));
    const sCold = this.solubilityG('KNO3', Number(coolC));
    const dissolved = Math.min(g, (sHot * w) / 100);
    const left = g - dissolved;
    const crystals = Math.max(0, dissolved - (sCold * w) / 100);
    const dH = this.engine.thermo?.dissolution_kJ_per_mol?.KNO3_s?.value ?? 34.89;
    const nRoom = Math.min(g, (this.solubilityG('KNO3', 25) * w) / 100) / 101.1;
    const drop = (nRoom * dH * 1000) / (w * 4.18 + this.engine.glass);
    const events = [{ type: 'machine', label: 'KNO₃', text: `Cho ${dec(g, 0)} g KNO₃ vào ${dec(w, 0)} mL nước cất: KNO₃ tan thu nhiệt (ΔH hoà tan ${dec(dH)} kJ/mol), phần tan được ở nhiệt độ phòng làm nước lạnh đi khoảng ${dec(drop, 0)} °C. Đun tới ${hotC} °C, khuấy.` }];
    if (left > 0.05) events.push({ type: 'warning', label: 'Chưa tan hết', text: `Ở ${hotC} °C chỉ tan được ${dec((sHot * w) / 100)} g (${dec(sHot, 0)} g/100 g nước): còn ${dec(left)} g chưa tan. Đun nóng hơn hoặc thêm nước, rồi lọc nóng bỏ tạp chất không tan.` });
    else events.push({ type: 'effect', text: `Tan hết ở ${hotC} °C (độ tan ${dec(sHot, 0)} g/100 g nước).` });
    events.push({ type: crystals / g >= 0.6 ? 'effect' : 'warning', label: 'Tinh thể', text: `Làm lạnh tới ${coolC} °C: độ tan còn ${dec(sCold)} g/100 g nước, tách ra ${dec(crystals)} g tinh thể hình kim (hiệu suất ${Math.round((100 * crystals) / g)} %); ${dec((sCold * w) / 100)} g còn trong nước lọc.${crystals / g < 0.6 ? ' Dùng ít nước hơn (vừa đủ hoà tan khi nóng) và làm lạnh sâu hơn thì thu được nhiều tinh thể hơn.' : ''}` });
    this.notebook.add({ day: '', experiment: 'Kết tinh lại', action: HP_ACTIONS['hp-kno3'], subject: `${g} g KNO₃ / ${w} mL`, result: `${dec(crystals)} g`, hot: hotC, cool: coolC });
    return { ok: true, events, crystals };
  }

  figureData() {
    const { volumeMl, setC, rpm, probe, minutes } = this.last;
    return { volumeMl: clamp(Math.round(volumeMl), 20, 250), setC, rpm, probe, minutes };
  }
}
