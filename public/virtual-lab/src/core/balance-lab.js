// Cân phân tích (Mettler Toledo MS204TS, độ đọc 0,1 mg) và pha dung dịch chuẩn từ chất rắn.
// Số đọc của cân lấy từ figures/balance/model.mjs: lực đẩy không khí (OIML), nhiễu khi mở cửa kính, khối lượng tối
// thiểu USP <41>, chưa trừ bì thì số đọc gồm cả thuyền cân. Bình định mức cấp A theo ISO 1042 (100 mL ±0,10 mL,
// 10 mL ±0,02 mL). Không phụ thuộc DOM.

import { read, buoyancyFactor, minWeight, relUncertainty, BOAT, SUBSTANCES, DOOR_NOISE, fmtG } from '../../figures/balance/model.mjs';
import { Notebook } from './notebook.js';
import { rng } from './random.js';

export const BAL_ACTIONS = { 'bal-boat': 'Đặt thuyền cân', 'bal-tare': 'Trừ bì', 'bal-door': 'Cửa kính', 'bal-add': 'Xúc chất rắn', 'bal-read': 'Đọc số cân', 'bal-flask': 'Định mức' };
export const BAL_FLASKS = { 100: { name: 'Bình định mức 100 mL cấp A', tol: 0.1 }, 10: { name: 'Bình định mức 10 mL cấp A', tol: 0.02 } };
const SOLIDS = { NaCl: { formula: 'NaCl', Mr: 58.44 } };
const g4 = (g) => `${fmtG(g)} g`;
const dec = (v, d = 1) => v.toFixed(d).replace('.', ',');

export class BalanceLab {
  constructor(seed = Date.now()) {
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.seed = seed;
    this.boat = false;
    this.tare = false; // false: chưa trừ bì; số: lượng bì (g) đã trừ
    this.doorsOpen = false;
    this.mass = 0; // khối lượng thật của chất rắn trong thuyền, g
    this.substance = 'NaCl';
    this.goal = null;
    this.recorded = null; // số đã ghi vào sổ
    this.recordedStable = true;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'bal-boat': () => this.putBoat(), 'bal-tare': () => this.doTare(), 'bal-door': () => this.door(params), 'bal-add': () => this.add(params), 'bal-read': () => this.readOut(), 'bal-flask': () => this.flask(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #reading(extra = {}) {
    return read(this.mass, { container: this.boat ? BOAT.mass : 0, tare: this.tare === false ? 0 : this.tare, doorsOpen: this.doorsOpen, rhoSample: SUBSTANCES[this.substance].rho, seed: Math.floor(this.random() * 1e9), ...extra });
  }

  putBoat() {
    this.boat = true;
    this.tare = false;
    this.mass = 0;
    this.recorded = null;
    this.doorsOpen = false;
    const r = this.#reading();
    return { ok: true, events: [{ type: 'machine', label: 'Cân phân tích', text: `Mở cửa hông, đặt thuyền cân lên giữa đĩa, đóng cửa. Màn hiện ${g4(r.shown)}: khối lượng thuyền (thật ${g4(BOAT.mass)}, nhẹ đi chút ít do lực đẩy không khí lên polystyrene).` }] };
  }

  doTare() {
    if (!this.boat) return { ok: false, events: [{ type: 'warning', text: 'Chưa có thuyền cân trên đĩa.' }] };
    const r = read(0, { container: BOAT.mass, tare: 0, doorsOpen: this.doorsOpen, seed: Math.floor(this.random() * 1e9) });
    this.tare = this.doorsOpen ? r.raw : r.net;
    const events = [{ type: 'machine', label: 'Cân phân tích', text: 'Bấm →0/T←: cân trừ khối lượng thuyền, màn về 0,0000 g.' }];
    if (this.doorsOpen) events.push({ type: 'warning', text: `Trừ bì khi cửa kính đang mở: số đọc đang dao động nên mức 0 lệch ${dec((r.raw - r.net) * 1000)} mg. Đóng cửa, chờ ký hiệu ổn định rồi mới trừ bì.` });
    else events.push({ type: 'effect', text: 'Cửa đóng, số đọc ổn định: từ giờ màn chỉ hiện khối lượng chất cho vào thuyền.' });
    this.notebook.add({ day: '', experiment: 'Cân phân tích', action: BAL_ACTIONS['bal-tare'], subject: 'thuyền cân', result: this.doorsOpen ? 'cửa mở' : 'ổn định' });
    return { ok: true, events };
  }

  door({ open = 'yes' }) {
    this.doorsOpen = open === true || open === 'yes';
    return { ok: true, events: [{ type: 'machine', label: 'Cửa kính', text: this.doorsOpen ? 'Mở cửa hông: luồng khí trong phòng lọt vào buồng cân, số đọc dao động.' : 'Đóng cửa hông: buồng cân kín gió, sau khoảng 2 s số đọc ổn định.' }] };
  }

  // Xúc chất rắn từng thìa nhỏ tới khi màn gần đúng số cần cân (lệch tối đa vài lần độ đọc vì không xúc đúng từng hạt)
  add({ target = 0.5844, substance = 'NaCl' }) {
    if (!this.boat) return { ok: false, events: [{ type: 'warning', text: 'Đặt thuyền cân lên đĩa trước khi xúc chất rắn.' }] };
    this.substance = SUBSTANCES[substance] ? substance : 'NaCl';
    this.goal = Number(target);
    this.doorsOpen = true;
    const bf = buoyancyFactor(SUBSTANCES[this.substance].rho);
    const boatShown = BOAT.mass * buoyancyFactor(BOAT.rho);
    const tare = this.tare === false ? 0 : this.tare;
    // Số đọc mong muốn = mẫu·bf + thuyền − bì; lệch ngẫu nhiên tới ±0,3 mg do xúc tay
    const want = this.goal + (this.random() * 2 - 1) * 0.0003;
    this.mass = Math.max(0, (want - boatShown + tare) / bf);
    const r = this.#reading();
    const events = [{ type: 'machine', label: 'Cân phân tích', text: `Mở cửa hông, dùng thìa xúc ${SOLIDS[this.substance].formula} vào thuyền, gõ nhẹ thìa để thêm từng ít một tới khi màn hiện khoảng ${g4(this.goal)} (đang hiện ${g4(r.shown)}).` }];
    if (this.tare === false) events.push({ type: 'warning', label: 'Chưa trừ bì', text: `Số trên màn gồm cả thuyền cân ${g4(boatShown)}: trong thuyền thật ra chỉ có ${dec(this.mass * 1000)} mg ${SOLIDS[this.substance].formula}. Phải trừ bì trước khi xúc.` });
    if (this.mass > 0 && this.mass < minWeight()) events.push({ type: 'warning', label: 'Dưới khối lượng tối thiểu', text: `${dec(this.mass * 1000)} mg nhỏ hơn khối lượng tối thiểu USP ${dec(minWeight() * 1000, 0)} mg của cân này: sai số tương đối khoảng ${dec(relUncertainty(this.mass) * 100, 2)} %, vượt 0,10 %. Pha lượng lớn hơn (bình 100 mL) để cân nhiều hơn.` });
    return { ok: true, events };
  }

  readOut() {
    if (!this.boat) return { ok: false, events: [{ type: 'warning', text: 'Trên đĩa chưa có gì để cân.' }] };
    const r = this.#reading();
    this.recorded = r.shown;
    this.recordedStable = r.stable;
    const events = [{ type: 'machine', label: 'Cân phân tích', text: `Ghi số đọc: ${g4(r.shown)}${r.stable ? ' (đã ổn định, cửa đóng)' : ''}.` }];
    for (const f of r.flags) events.push({ type: 'warning', text: f });
    if (r.stable && this.tare !== false) events.push({ type: 'effect', text: `Khối lượng thật của ${SOLIDS[this.substance].formula} là ${g4(this.mass)}: số đọc nhỏ hơn ${dec((this.mass - r.net) * 1000, 2)} mg vì lực đẩy không khí lên tinh thể (khối lượng riêng ${dec(SUBSTANCES[this.substance].rho, 2)} g/cm³) lớn hơn lên quả cân chuẩn thép (8,0 g/cm³). Với phân tích thường bỏ qua được.` });
    this.notebook.add({ day: '', experiment: 'Cân phân tích', action: BAL_ACTIONS['bal-read'], subject: SOLIDS[this.substance].formula, result: fmtG(r.shown), doors: this.doorsOpen ? 'mở' : 'đóng', tared: this.tare === false ? 'không' : 'có' });
    return { ok: true, events };
  }

  flask({ volume = 100 }) {
    const f = BAL_FLASKS[volume] ?? BAL_FLASKS[100];
    const V = Number(volume) in BAL_FLASKS ? Number(volume) : 100;
    if (!this.mass) return { ok: false, events: [{ type: 'warning', text: 'Chưa có chất rắn trong thuyền cân.' }] };
    if (this.recorded === null) return { ok: false, events: [{ type: 'warning', text: 'Chưa ghi số cân: đóng cửa, chờ ổn định và ghi số đọc trước khi chuyển chất rắn vào bình.' }] };
    const s = SOLIDS[this.substance];
    const vTrue = V + (this.random() * 2 - 1) * f.tol;
    const cLabel = this.recorded / s.Mr / (V / 1000);
    const cTrue = this.mass / s.Mr / (vTrue / 1000);
    const err = (cLabel - cTrue) / cTrue;
    const events = [{ type: 'machine', label: f.name, text: `Chuyển hết ${s.formula} vào bình qua phễu, tráng thuyền và phễu bằng nước cất, hoà tan, thêm nước tới vạch (đáy mặt khum), đậy nắp và lật ngược lắc đều.` }];
    events.push({ type: 'effect', text: `Nồng độ tính theo số cân đã ghi: ${dec(cLabel, 4)} M. Nồng độ thật: ${dec(cTrue, 4)} M (khối lượng thật ${g4(this.mass)}, thể tích bình ${dec(vTrue, 2)} mL trong dung sai ±${dec(f.tol, 2)} mL).` });
    if (Math.abs(err) > 0.005) events.push({ type: 'warning', label: 'Sai lệch lớn', text: `Nồng độ ghi trên nhãn lệch ${dec(err * 100, 1)} % so với thật${this.tare === false ? ': số cân gồm cả thuyền cân vì quên trừ bì' : ''}. Dung dịch này không dùng làm dung dịch chuẩn được.` });
    else if (!this.recordedStable || this.mass < minWeight()) {
      // Lần này có thể lệch ít do may mắn, nhưng cách cân không bảo đảm sai số dưới 0,1 %
      const spread = !this.recordedStable ? (2 * Math.hypot(DOOR_NOISE.sd, 0.08) + DOOR_NOISE.wander) / 1000 / this.mass : relUncertainty(this.mass);
      events.push({ type: 'warning', text: `Lần này lệch ${dec(err * 100, 2)} %, nhưng ${!this.recordedStable ? 'số đọc ghi lúc cửa kính còn mở, chưa ổn định' : 'lượng cân nhỏ hơn khối lượng tối thiểu của cân'}: làm lại nhiều lần thì sai lệch có thể tới khoảng ±${dec(spread * 100, 2)} %. Dung dịch chuẩn cần bảo đảm dưới 0,1 %.` });
    } else if (Math.abs(err) > 0.001) events.push({ type: 'warning', text: `Nồng độ ghi trên nhãn lệch ${dec(err * 100, 2)} % so với thật. Dung dịch chuẩn cần sai lệch dưới 0,1 %.` });
    else events.push({ type: 'effect', text: `Sai lệch ${dec(err * 100, 3)} %, dưới 0,1 %: dùng được làm dung dịch chuẩn.` });
    this.notebook.add({ day: '', experiment: 'Pha dung dịch chuẩn', action: BAL_ACTIONS['bal-flask'], subject: `${s.formula} ${V} mL`, result: dec(cLabel, 4), true: dec(cTrue, 4) });
    return { ok: true, events, table: { head: ['', 'Theo số cân', 'Thật'], rows: [['Khối lượng', g4(this.recorded), g4(this.mass)], ['Thể tích', `${V} mL`, `${dec(vTrue, 2)} mL`], ['Nồng độ', `${dec(cLabel, 4)} M`, `${dec(cTrue, 4)} M`]] } };
  }

  figureData() {
    const r = this.#reading({ seed: null });
    return { mass: +this.mass.toFixed(5), tared: this.tare !== false, doorsOpen: this.doorsOpen, substance: this.substance, seed: 1, reading: this.recorded ?? +r.shown.toFixed(4), goal: this.goal ?? undefined };
  }
}
