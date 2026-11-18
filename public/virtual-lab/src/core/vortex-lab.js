// Trộn bằng máy vortex rồi ly tâm nhanh gom giọt (máy vortex Vortex-Genie 2, máy ly tâm mini Spectrafuge Mini).
// Quỹ đạo, Froude, thời gian trộn, RCF, gom giọt lấy từ figures/vortex/model.mjs. Thời gian trộn và gom giọt là
// mô hình minh hoạ (ghi trong model.mjs). Ống enzyme (glycerol 50 %) không được vortex mạnh: quy tắc thực hành
// chung của các hãng enzyme (trộn bằng búng nhẹ hoặc đảo ống). Không phụ thuộc DOM.

import { orbitOf, mixSeconds, collectAfter, collectSeconds, rcfOf, SPIN, VORTEX, TUBE, clampVortexRpm, fmtInt, fmtDec } from '../../figures/vortex/model.mjs';
import { Notebook } from './notebook.js';

export const VX_ACTIONS = { 'vx-mix': 'Trộn bằng vortex', 'vx-spin': 'Ly tâm nhanh' };
export const VX_SAMPLES = {
  mix: { name: 'Hỗn hợp thuốc thử (đệm, dNTP, mồi)', volume: TUBE.volume },
  enzyme: { name: 'Ống Taq polymerase (glycerol 50 %)', volume: 50 },
};

export class VortexLab {
  constructor() {
    this.notebook = new Notebook();
    this.reset();
  }

  reset() {
    this.mixed = 0; // 0–1: mức đều của dung dịch
    this.drops = 0; // 0–1: phần dung dịch còn bám nắp, thành ống
    this.last = { rpm: 2500, spin: 0 };
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'vx-mix': () => this.mix(params), 'vx-spin': () => this.spin(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  mix({ rpm = 2500, seconds = 10, sample = 'mix' }) {
    const r = clampVortexRpm(Number(rpm));
    const s = VX_SAMPLES[sample] ? sample : 'mix';
    const o = orbitOf(r);
    const need = mixSeconds(r, VX_SAMPLES[s].volume);
    this.last.rpm = r;
    const events = [{ type: 'machine', label: 'Vortex', text: `${fmtInt(r)} rpm, ${seconds} s, ${VX_SAMPLES[s].name}: cup chạy quỹ đạo tròn đường kính ${VORTEX.orbitDia} mm, ${fmtDec(o.hz)} vòng/s, gia tốc ${fmtDec(o.accelG)} g (Fr = ${fmtDec(o.froude)}).` }];
    if (!Number.isFinite(need)) {
      events.push({ type: 'warning', text: 'Tốc độ quá thấp (Fr ≤ 1): gia tốc của cup không thắng được trọng lực, chất lỏng không xoáy, dung dịch chưa được trộn. Tăng tốc độ.' });
    } else {
      this.mixed = Math.min(1, this.mixed + Number(seconds) / need);
      this.drops = 1;
      events.push(this.mixed >= 1
        ? { type: 'effect', text: `Chất lỏng xoáy thành phễu và trộn đều (cần khoảng ${fmtDec(need)} s). Giọt bắn lên nắp và thành ống: cần ly tâm nhanh để gom xuống đáy.` }
        : { type: 'warning', text: `Mới trộn được khoảng ${Math.round(this.mixed * 100)} %: cần khoảng ${fmtDec(need)} s ở tốc độ này. Dung dịch còn phân lớp (glycerol, muối nặng ở đáy).` });
    }
    if (s === 'enzyme') events.push({ type: 'warning', label: 'Enzyme', text: 'Không vortex mạnh ống enzyme: bọt và lực cắt làm biến tính protein, glycerol 50 % bám thành ống làm hút sai thể tích. Trộn enzyme bằng búng nhẹ hoặc đảo ống rồi ly tâm nhanh.' });
    this.notebook.add({ day: '', experiment: 'Vortex', action: VX_ACTIONS['vx-mix'], subject: VX_SAMPLES[s].name, result: Math.round(this.mixed * 100) + ' %', rpm: r, seconds });
    return { ok: Number.isFinite(need), events };
  }

  spin({ seconds = 10 }) {
    const t = Number(seconds);
    const p = collectAfter(t);
    this.last.spin = t;
    const events = [{ type: 'machine', label: 'Ly tâm mini', text: `Đóng nắp ${t} s: rotor lên ${fmtInt(SPIN.rpm)} rpm, ${fmtInt(rcfOf(SPIN.rpm))} × g ở đáy ống (r = ${fmtDec(SPIN.rMax, 2)} cm), rồi mở nắp cho rotor tự dừng.` }];
    if (this.drops > 0) {
      this.drops *= 1 - p;
      events.push(p >= 0.99
        ? { type: 'effect', text: 'Giọt trên nắp và thành ống trượt hết xuống đáy: thể tích đủ, mở nắp không bắn mẫu ra ngoài.' }
        : { type: 'warning', text: `Mới gom được khoảng ${Math.round(p * 100)} % giọt (cần khoảng ${fmtDec(collectSeconds())} s kể cả lúc tăng tốc). Ly tâm thêm vài giây.` });
    } else events.push({ type: 'info', text: 'Ống không có giọt bám: ly tâm nhanh chỉ cần sau khi trộn hoặc khi mở ống vừa lấy từ tủ đông.' });
    if (this.mixed < 1) events.push({ type: 'warning', text: 'Dung dịch chưa được trộn đều: ly tâm làm các thành phần nặng (glycerol, muối) lắng sâu hơn. Trộn trước rồi mới ly tâm.' });
    this.notebook.add({ day: '', experiment: 'Ly tâm mini', action: VX_ACTIONS['vx-spin'], subject: `${t} s`, result: Math.round(p * 100) + ' %' });
    return { ok: true, events };
  }

  figureData() {
    return { vortexRpm: this.last.rpm, spinSeconds: Math.max(1, Math.min(60, this.last.spin || 8)) };
  }
}
