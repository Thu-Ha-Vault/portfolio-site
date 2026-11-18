// Phôi gà (data/chick.json): giai đoạn Hamburger–Hamilton theo giờ ấp và nhiệt độ, độ ẩm, đảo trứng; soi trứng, mở
// cửa sổ vỏ, quan sát phôi. Nhiệt độ lệch, quên đảo trứng hay mở cửa sổ sai thì phôi chậm hoặc chết. Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const CK_ACTIONS = { 'ck-set': 'Xếp trứng vào máy ấp', 'ck-incubate': 'Ấp', 'ck-candle': 'Soi trứng', 'ck-window': 'Mở cửa sổ vỏ', 'ck-observe': 'Quan sát phôi' };
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');

// Giai đoạn HH theo số giờ phát triển tương đương ở 37,75 °C (nội suy theo bảng)
export function stageAt(stages, h) {
  let s = stages[0];
  for (const x of stages) if (h >= x[1]) s = x;
  const next = stages[stages.indexOf(s) + 1];
  let stage = s[0];
  if (next && next[0] - s[0] > 1) stage = Math.floor(s[0] + ((next[0] - s[0]) * (h - s[1])) / (next[1] - s[1]));
  const somites = stage >= 7 && stage <= 20 ? 3 * stage - 20 : stage > 20 ? 40 : 0;
  return { stage, somites, text: s[2] };
}

export class ChickLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.eggs = [];
    this.hours = 0;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'ck-set': () => this.set(params), 'ck-incubate': () => this.incubate(params), 'ck-candle': () => this.candle(params), 'ck-window': () => this.window(params), 'ck-observe': () => this.observe(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  set({ n = 6 }) {
    this.eggs = Array.from({ length: Number(n) }, (_, i) => ({ n: i + 1, fertile: this.random() < this.data.model.fertile, dev: 0, alive: true, window: null, diedAt: null }));
    this.hours = 0;
    return { ok: true, events: [{ type: 'machine', label: 'Máy ấp', text: `Xếp ${n} trứng gà có phôi vào khay, đầu tù lên trên.` }] };
  }

  // Ấp hours giờ ở T °C, độ ẩm rh %, có hoặc không đảo trứng
  incubate({ hours = 24, T = 37.8, rh = 55, turning = true }) {
    const M = this.data.model;
    const t = Number(T);
    const rate = Math.max(0, (t - M.zeroC) / (M.optC - M.zeroC));
    const events = [{ type: 'machine', label: 'Máy ấp', text: `Ấp ${fmt(hours, 0)} giờ ở ${fmt(t, 1)} °C, độ ẩm ${rh} %, ${turning ? 'tự đảo trứng mỗi giờ' : 'không đảo trứng'}.` }];
    for (let h = 0; h < Number(hours); h++) {
      const day = (this.hours + h) / 24;
      let hazard = M.baseDeath;
      if (t > M.hotC) hazard += M.hotPerC * (t - M.hotC);
      if (t >= M.lethalC) hazard += 6;
      if (t < M.coldC) hazard += M.coldDeath;
      if (!turning && day >= 3 && day <= 7) hazard += M.noTurn;
      if (rh < M.dryRh || rh > M.wetRh) hazard += M.rhDeath;
      for (const e of this.eggs) {
        if (!e.fertile || !e.alive) continue;
        if (e.window && e.window.torn) hazard += 0;
        e.dev += rate;
        if (this.random() < hazard / 24) { e.alive = false; e.diedAt = this.hours + h; }
      }
    }
    this.hours += Number(hours);
    const dead = this.eggs.filter((e) => e.fertile && !e.alive).length;
    if (t > M.hotC) events.push({ type: 'warning', label: 'Chưa đúng', text: `${fmt(t, 1)} °C quá nóng: phôi phát triển dị dạng và chết nhiều.` });
    if (t < M.coldC) events.push({ type: 'warning', label: 'Chưa đúng', text: `${fmt(t, 1)} °C quá lạnh: phôi chỉ lớn bằng ${fmt(rate * 100, 0)} % tốc độ bình thường.` });
    if (!turning) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Không đảo trứng: từ ngày 3 phôi dễ dính vào màng vỏ và chết.' });
    events.push({ type: 'info', label: 'Thời gian', text: `Đã ấp ${fmt(this.hours, 0)} giờ (ngày ${fmt(this.hours / 24, 1)}). ${dead ? `${dead} phôi đã chết.` : ''}`.trim() });
    this.notebook.add({ day: fmt(this.hours / 24, 1), experiment: 'Phôi gà', action: CK_ACTIONS['ck-incubate'], subject: `${fmt(t, 1)} °C`, result: `${dead} chết`, hours });
    return { ok: t >= 37 && t <= 38.5 && turning, events };
  }

  // Soi trứng: không phôi thì trong suốt; phôi sống từ ngày 3 thấy mạch máu hình mạng nhện; phôi chết có vòng máu
  candle() {
    const rows = this.eggs.map((e) => {
      let look = 'chưa thấy gì rõ (mới ấp, noãn hoàng che)';
      if (!e.fertile) look = this.hours >= 48 ? 'trong suốt: trứng không có phôi' : look;
      else if (!e.alive) look = this.hours - e.diedAt > 12 ? 'vòng máu đỏ quanh noãn hoàng: phôi đã chết' : look;
      else if (this.hours >= 72) look = 'mạng mạch máu hình mạng nhện, chấm phôi chuyển động: phôi sống';
      else if (this.hours >= 48) look = 'vết mờ có mạch máu mảnh';
      return [`Trứng ${e.n}`, look];
    });
    return { ok: true, table: { head: ['Trứng', 'Soi đèn'], rows }, events: [{ type: 'machine', label: 'Đèn soi', text: 'Soi từng trứng trong phòng tối bằng đèn soi đặt sát đầu tù.' }] };
  }

  // Mở cửa sổ: rút 2–3 mL lòng trắng ở đầu nhọn trước để noãn hoàng hạ xuống, cắt một ô vỏ ở đầu tù
  window({ egg = 1, removeAlbumin = true }) {
    const e = this.eggs[Number(egg) - 1];
    if (!e) return { ok: false, events: [{ type: 'warning', text: `Không có trứng ${egg}.` }] };
    e.window = { torn: !removeAlbumin && this.random() < this.data.model.windowTear };
    if (e.window.torn && e.alive) { e.alive = false; e.diedAt = this.hours; }
    const events = [{ type: 'machine', label: `Trứng ${egg}`, text: `${removeAlbumin ? 'Rút 3 mL lòng trắng ở đầu nhọn bằng kim, ' : ''}cắt cửa sổ vỏ khoảng 2 cm ở đầu tù, nhỏ vài giọt nước muối sinh lý ấm.` }];
    if (!removeAlbumin) events.push({ type: 'warning', label: 'Chưa đúng', text: e.window.torn ? 'Không rút lòng trắng: noãn hoàng dính sát vỏ, mũi kéo làm rách màng noãn hoàng, phôi chết.' : 'Không rút lòng trắng: noãn hoàng sát vỏ, dễ làm rách khi cắt.' });
    return { ok: !e.window.torn, events };
  }

  observe({ egg = 1 }) {
    const e = this.eggs[Number(egg) - 1];
    if (!e) return { ok: false, events: [{ type: 'warning', text: `Không có trứng ${egg}.` }] };
    if (!e.window) return { ok: false, events: [{ type: 'warning', text: 'Chưa mở cửa sổ vỏ: chỉ soi đèn được, chưa thấy rõ phôi.' }] };
    if (!e.fertile) return { ok: true, stage: null, events: [{ type: 'info', label: `Trứng ${egg}`, text: 'Chỉ có đĩa phôi trắng nhỏ không phát triển: trứng không được thụ tinh.' }] };
    const dev = e.alive ? e.dev : (e.dev * (e.diedAt ?? 0)) / Math.max(1, this.hours);
    const st = stageAt(this.data.stages, dev);
    this.lastObs = { egg: e.n, ...st, alive: e.alive, hours: this.hours };
    const events = [{ type: e.alive ? 'effect' : 'warning', label: `HH${st.stage}`, text: `${e.alive ? '' : 'Phôi đã chết, dừng ở '}giai đoạn HH${st.stage} sau ${fmt(this.hours, 0)} giờ ấp: ${st.text}.` }];
    if (e.alive && Math.abs(dev - this.hours) > 6) events.push({ type: 'info', text: `Phôi ${dev < this.hours ? 'chậm' : 'nhanh'} hơn lịch ở 37,75 °C khoảng ${fmt(Math.abs(dev - this.hours), 0)} giờ do nhiệt độ ấp.` });
    this.notebook.add({ day: fmt(this.hours / 24, 1), experiment: 'Phôi gà', action: CK_ACTIONS['ck-observe'], subject: `trứng ${egg}`, result: `HH${st.stage}`, somites: st.somites, alive: e.alive ? 'sống' : 'chết' });
    return { ok: e.alive, stage: st.stage, somites: st.somites, events };
  }
}
