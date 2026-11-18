// Tủ an toàn sinh học cấp II, kiểu A2 (Esco Airstream AC2-4S8-NS): đặt độ mở kính, quạt, lưới trước; thao tác với
// mẫu vi sinh; khử trùng bằng đèn UV sau khi đóng kính.
// Vận tốc vào và xuống, báo động kính và khí, hệ số bảo vệ người, bảo vệ mẫu, khoá liên động UV lấy từ
// figures/bsc/model.mjs (brochure Esco, NSF/ANSI 49, EN 12469; hệ số bảo vệ là mô hình minh hoạ). Không phụ thuộc DOM.

import { cabinetState, CABINET, vn } from '../../figures/bsc/model.mjs';
import { Notebook } from './notebook.js';

export const BSC_ACTIONS = { 'bsc-set': 'Đặt kính, quạt, lưới', 'bsc-work': 'Thao tác với mẫu', 'bsc-uv': 'Bật đèn UV' };
const sup = (n) => String(n).replace(/[0-9-]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(c)]);
// 10^x viết thành m × 10ⁿ
const pow = (x) => {
  if (!Number.isFinite(x)) return '∞';
  const e = Math.floor(x + 1e-9);
  const m = 10 ** (x - e);
  return m < 1.05 ? `10${sup(e)}` : `${vn(m, 1)} × 10${sup(e)}`;
};

export class BscLab {
  constructor() {
    this.notebook = new Notebook();
    this.reset();
  }

  reset() {
    this.setting = { sash: 0, fan: false, grille: 'clear', filterYears: 0 };
    this.state = cabinetState({ ...this.setting });
    this.uv = false;
    this.worked = false;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'bsc-set': () => this.set(params), 'bsc-work': () => this.work(), 'bsc-uv': () => this.lamp() }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  set({ sash = CABINET.sashRated, fan = true, grille = 'clear', filterYears = this.setting.filterYears }) {
    this.setting = { sash: Number(sash), fan: Boolean(fan), grille: grille === 'blocked' ? 'blocked' : 'clear', filterYears: Number(filterYears) || 0 };
    if (this.setting.sash > 2) this.uv = false;
    const s = (this.state = cabinetState({ ...this.setting, uv: this.uv }));
    const events = [{ type: s.alarms.length ? 'warning' : 'machine', label: 'Sentinel', text: `Kính mở ${this.setting.sash} mm, quạt ${s.fan ? 'chạy' : 'tắt'}${s.grille === 'blocked' ? ', lưới trước bị che' : ''}. Vận tốc vào ${vn(s.inflow, 2)} m/s, xuống ${vn(s.downflow, 2)} m/s. ${s.message}.` }];
    if (s.alarms.includes('sash')) events.push({ type: 'warning', text: `Báo động kính: độ cao làm việc là ${CABINET.sashRated} mm (8"). Kính cao hơn thì cùng lưu lượng thải chia cho cửa mở lớn hơn, vận tốc vào giảm.` });
    if (s.alarms.includes('airflow')) events.push({ type: 'warning', text: `Báo động khí: vận tốc vào dưới ${vn(CABINET.inflowAlarm, 2)} m/s, màn khí ở cửa không còn giữ được khí dung trong tủ.` });
    if (s.grille === 'blocked') events.push({ type: 'warning', text: 'Lưới trước bị che (tay, giấy, dụng cụ): khí từ cửa không đi xuống lưới được mà cuộn lên vùng làm việc rồi tràn ra ngoài.' });
    if (s.sashState !== 'closed') events.push({ type: 'info', label: 'Bảo vệ người', text: `Hệ số bảo vệ khoảng ${pow(s.apf.log10)}: cứ chừng ấy hạt khí dung tạo ra trong tủ thì khoảng 1 hạt lọt ra phía người làm (EN 12469 yêu cầu ≥ 10⁵).` });
    this.notebook.add({ day: '', experiment: 'Tủ an toàn sinh học', action: BSC_ACTIONS['bsc-set'], subject: `${this.setting.sash} mm`, result: s.message, inflow: s.inflow.toFixed(2) });
    return { ok: true, events };
  }

  work() {
    const s = this.state;
    const events = [];
    if (s.sashState === 'closed') return { ok: false, events: [{ type: 'warning', text: 'Kính đang đóng: nâng kính lên độ cao làm việc rồi mới thao tác.' }] };
    this.worked = true;
    events.push({ type: 'machine', label: 'Thao tác', text: 'Xịt cồn 70 % lên khay, mở đĩa petri vi khuẩn, hút dịch nuôi cấy bằng micropipette chia sang ống mới. Thao tác cách mép kính ít nhất 10 cm (4 inch, theo hướng dẫn BMBL của CDC), không để tay đè lên lưới.' });
    events.push(s.containment
      ? { type: 'effect', label: 'Người làm', text: `Được bảo vệ: màn khí vào ${vn(s.inflow, 2)} m/s kéo khí dung xuống lưới trước, khí thải qua lọc ULPA (lọt 10⁻⁵ hạt).` }
      : { type: 'warning', label: 'Người làm', text: `Không được bảo vệ: hệ số bảo vệ chỉ khoảng ${pow(s.apf.log10)}, khí dung vi khuẩn lọt ra vùng thở. Phải dừng lại, đưa kính về ${CABINET.sashRated} mm, bỏ vật che lưới, bật quạt.` });
    events.push(s.product
      ? { type: 'effect', label: 'Mẫu', text: `Được bảo vệ: dòng khí sạch qua lọc ULPA đi xuống ${vn(s.downflow, 2)} m/s, bụi và vi sinh vật từ phòng không rơi vào đĩa.` }
      : { type: 'warning', label: 'Mẫu', text: 'Không được bảo vệ: không có dòng khí sạch đi xuống, vi sinh vật trong không khí phòng có thể rơi vào môi trường, mẫu dễ nhiễm.' });
    this.notebook.add({ day: '', experiment: 'Tủ an toàn sinh học', action: BSC_ACTIONS['bsc-work'], subject: `${this.setting.sash} mm`, result: s.containment ? 'an toàn' : 'không an toàn', product: s.product ? 'sạch' : 'dễ nhiễm' });
    return { ok: s.containment && s.product, events };
  }

  lamp() {
    const s = (this.state = cabinetState({ ...this.setting, uv: true }));
    if (s.uvBlocked) return { ok: false, events: [{ type: 'warning', label: 'Khoá UV', text: 'Đèn UV chỉ bật được khi kính đóng hẳn: tia UV-C làm tổn thương mắt và da người đứng trước tủ.' }] };
    this.uv = true;
    const events = [{ type: 'machine', label: 'UV', text: 'Kính đóng hẳn, đèn UV bật (hãng khuyên không quá 60 phút mỗi lần). Đèn huỳnh quang tắt.' }];
    events.push({ type: 'effect', text: 'Tia UV-C tạo dimer thymine trong DNA của vi sinh vật trên bề mặt được chiếu tới, làm chúng không nhân lên được; vùng bị che khuất không được khử, nên trước đó vẫn phải lau khay bằng cồn 70 %.' });
    if (!this.worked) events.push({ type: 'info', text: 'Chưa thao tác gì trong tủ: UV thường bật sau khi làm xong và đã lau khay.' });
    this.notebook.add({ day: '', experiment: 'Tủ an toàn sinh học', action: BSC_ACTIONS['bsc-uv'], subject: 'UV', result: 'bật' });
    return { ok: true, events };
  }

  figureData() {
    return { sash: this.setting.sash, fan: this.setting.fan, grille: this.setting.grille, uv: this.uv, filterYears: this.setting.filterYears };
  }
}
