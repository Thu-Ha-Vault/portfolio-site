// Quy trình như phòng thật (giai đoạn 7): đồ bảo hộ khi vào phòng làm việc, rửa tay và tháo găng khi ra, đi một chiều
// giữa khu trước và sau PCR, lượng hoá chất trong chai, dụng cụ bẩn phải rửa trước khi dùng lại, nhãn mẫu, nhật ký thiết
// bị, kiểm tra cuối buổi. Không dùng Three.js, không đụng DOM.
//
// Nguồn: WHO Laboratory Biosafety Manual, 4th ed. (2020), mục 3 "Core requirements": mặc áo phòng thí nghiệm, găng, bảo
// vệ mắt khi làm việc; rửa tay sau khi tiếp xúc vật liệu và trước khi rời phòng; không mang áo phòng thí nghiệm ra
// ngoài; khử nhiễm mặt bàn sau khi làm việc; ghi nhãn mẫu. WHO SEARO, Establishment of PCR laboratory (2016), chương 5:
// đi một chiều từ khu trước sang khu sau khuếch đại, không quay lại trong ngày. Tắt máy không dùng tới cuối buổi là nội
// quy phòng (minh hoạ, không có văn bản chuẩn).
//
// Thêm (giai đoạn 7): đậy nắp chai ngay sau khi lấy hoá chất (quy tắc lấy hoá chất trong SGK Hoá học 8); chai có ngày pha
// và hạn dùng in trên nhãn; máy dùng chung phải đặt lịch trong sổ (nội quy phòng, minh hoạ); mẫu cất vào hộp mẫu của
// mình trong tủ −20 °C phải có nhãn (WHO LBM4 mục 3: ghi nhãn mẫu). Máy cần đặt lịch, lịch của nhóm khác, tuổi và hạn
// dùng của chai lấy từ data/facility.json mục ops (minh hoạ).

import { Notebook } from './notebook.js';

export const OPS_ACTIONS = { 'ops-wash': 'Rửa tay', 'ops-empty': 'Đổ bỏ vào can chất thải', 'ops-clean': 'Rửa dụng cụ', 'ops-label': 'Ghi nhãn mẫu', 'ops-refill': 'Pha thêm hoá chất', 'ops-wipe': 'Lau mặt bàn', 'ops-end': 'Kết thúc buổi', 'ops-cap': 'Đậy nắp chai', 'ops-book': 'Đặt lịch máy', 'ops-store': 'Cất mẫu vào hộp' };
export const WORK_ROOMS = ['open-lab', 'post-pcr', 'analysis', 'bsl2', 'wash', 'wing', 'store', 'husbandry'];
export const EYE = ['glasses', 'goggles'];
// Chai thuốc thử DURAN GL 45 100 mL (src/core/vessel.js): đổ đầy 100 mL khi pha
export const BOTTLE_ML = 100;

const fmt = (v) => (Math.round(v * 10) / 10).toString().replace('.', ',');
// Giờ trong ngày từ số giây kể từ 8:00 (cùng mốc với src/core/labclock.js)
const hhmm = (t) => { const m = Math.round(8 * 60 + t / 60); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };

export class LabOps {
  // rules: data/facility.json mục ops { booking: { machines, others }, bottles: { id: { age, life } } }
  constructor({ roomName = (id) => id, rules = {} } = {}) {
    this.roomName = roomName;
    this.rules = rules;
    this.notebook = new Notebook();
    this.reset();
  }

  reset() {
    this.room = null;
    this.postPcr = false; // đã vào phòng sau PCR trong buổi
    this.washed = true;
    this.worked = false;
    this.stock = new Map(); // id chất → mL còn trong chai
    this.dirty = new Set(); // vật chứa đã dùng, đã đổ bỏ nhưng chưa rửa
    this.used = new Set(); // vật chứa đang chứa chất
    this.labels = new Map();
    this.wiped = false;
    this.caps = new Set(); // chai đang mở nắp
    this.made = new Map(); // id chai → tuổi (ngày) khi pha lại trong buổi (0)
    this.warnedOld = new Set();
    this.bookings = (this.rules.booking?.others ?? []).map((b) => ({ ...b, mine: false }));
    this.warnedBook = new Set();
    this.box = []; // hộp mẫu của mình trong tủ −20 °C
    this.notebook.clear();
  }

  // Đi từ phòng này sang phòng khác (camera ở tầm mắt). worn: Set đồ bảo hộ đang mặc (src/core/safety.js)
  move(to, worn) {
    const from = this.room;
    this.room = to;
    const events = [];
    if (!to || to === from) return { events };
    const work = (r) => WORK_ROOMS.includes(r);
    if (work(to) && !work(from)) {
      const miss = [!worn.has('coat') && 'áo blouse', !worn.has('gloves') && 'găng', !EYE.some((k) => worn.has(k)) && 'kính bảo hộ'].filter(Boolean);
      if (miss.length) events.push({ type: 'warning', label: 'Thiếu đồ bảo hộ', text: `Vào ${this.roomName(to)} mà chưa có ${miss.join(', ')}: mặc ở phòng đệm trước khi vào (móc áo, hộp găng, giá kính).` });
    }
    if ((to === 'corridor' || to === 'anteroom') && work(from)) {
      if (worn.has('gloves')) events.push({ type: 'warning', label: 'Còn đeo găng', text: 'Tháo găng trước khi ra khỏi phòng làm việc: găng đã chạm hoá chất, mẫu sẽ làm bẩn tay nắm cửa.' });
      if (this.worked && !this.washed) events.push({ type: 'warning', label: 'Chưa rửa tay', text: 'Rửa tay ở bồn cạnh cửa trước khi rời phòng làm việc.' });
      if (this.caps.size) events.push({ type: 'warning', label: 'Chai còn mở nắp', text: `Còn ${this.caps.size} chai mở nắp trên bàn: đậy lại trước khi rời phòng.` });
    }
    if (to === 'corridor' && worn.has('coat')) events.push({ type: 'warning', label: 'Mặc áo ra ngoài', text: 'Cởi áo blouse, treo ở phòng đệm: không mặc áo phòng thí nghiệm ra hành lang.' });
    if (to === 'post-pcr') this.postPcr = true;
    if (to === 'open-lab' && from !== 'anteroom' && this.postPcr) events.push({ type: 'warning', label: 'Đi ngược chiều', text: 'Đã vào phòng sau PCR thì không quay lại khu pha mẫu trước PCR trong buổi: sản phẩm PCR theo người, áo, găng làm nhiễm các phản ứng sau.' });
    return { events };
  }

  // Có thao tác với hoá chất, mẫu: tay cần rửa lại
  work() {
    this.worked = true;
    this.washed = false;
    this.wiped = false;
  }

  wash() {
    this.washed = true;
    return { ok: true, events: [{ type: 'machine', label: 'Rửa tay', text: 'Rửa tay bằng xà phòng ít nhất 20 giây ở bồn rửa tay, lau khô bằng giấy.' }] };
  }

  // Lượng trong chai: chưa có thì coi như chai đầy
  left(id) {
    return this.stock.has(id) ? this.stock.get(id) : BOTTLE_ML;
  }

  // Lấy mL từ chai; không đủ thì chỉ rót được phần còn lại
  take(id, mL) {
    const left = this.left(id);
    if (left <= 0.001) return { ok: false, got: 0, events: [{ type: 'warning', label: 'Hết hoá chất', text: 'Chai đã hết: pha thêm (bảng Thao tác tay, mục Quy trình) trước khi rót tiếp.' }] };
    const got = Math.min(left, mL);
    this.stock.set(id, left - got);
    const events = [];
    if (got < mL - 1e-9) events.push({ type: 'warning', label: 'Chai cạn', text: `Chai chỉ còn ${fmt(got)} mL, rót được ${fmt(got)} mL thay vì ${fmt(mL)} mL.` });
    else if (left - got < 10) events.push({ type: 'warning', label: 'Sắp hết', text: `Chai còn khoảng ${fmt(left - got)} mL: chuẩn bị pha thêm.` });
    return { ok: true, got, events };
  }

  refill(id) {
    this.stock.set(id, BOTTLE_ML);
    this.made.set(id, 0);
    const life = this.rules.bottles?.[id]?.life;
    return { ok: true, events: [{ type: 'machine', label: 'Pha thêm', text: `Pha thêm, đổ đầy chai ${BOTTLE_ML} mL, ghi ngày pha hôm nay${life ? ` và hạn dùng ${life} ngày` : ''} trên nhãn.` }] };
  }

  // ---- Nắp chai ----
  // Lấy hoá chất từ chai thì nắp mở; trả về true nếu vừa mở
  openCap(id) {
    if (this.caps.has(id)) return false;
    this.caps.add(id);
    return true;
  }

  closeCap(id) {
    if (!this.caps.delete(id)) return { ok: false, events: [{ type: 'warning', text: 'Chai này đang đậy nắp.' }] };
    return { ok: true, events: [{ type: 'machine', label: 'Đậy nắp', text: 'Đậy nắp chai ngay sau khi lấy: hoá chất không bay hơi, không hút ẩm, không lẫn bụi, và không đổ khi lỡ tay chạm chai.' }] };
  }

  // ---- Hạn dùng ----
  // Tuổi (ngày) và hạn dùng của chai; chai pha lại trong buổi có tuổi 0
  bottleAge(id) {
    const b = this.rules.bottles?.[id];
    if (!b) return null;
    return { age: this.made.has(id) ? this.made.get(id) : b.age, life: b.life };
  }

  // Cảnh báo khi lấy từ chai đã quá hạn (mỗi chai một lần mỗi buổi)
  checkExpiry(id, name = id) {
    const a = this.bottleAge(id);
    if (!a || a.age <= a.life || this.warnedOld.has(id)) return [];
    this.warnedOld.add(id);
    return [{ type: 'warning', label: 'Quá hạn dùng', text: `Chai ${name} pha cách đây ${a.age} ngày, hạn dùng ${a.life} ngày: nồng độ ghi trên nhãn không còn tin được. Pha lại (Pha thêm) hoặc chuẩn hoá lại trước khi dùng cho phép đo định lượng.` }];
  }

  // ---- Sổ đặt lịch máy dùng chung ----
  needsBooking(machine) {
    return (this.rules.booking?.machines ?? []).includes(machine);
  }

  // Đặt máy từ t0 (giây kể từ 8:00) trong minutes phút; trùng giờ người khác đã đặt thì không được
  book(machine, name, t0, minutes) {
    const t1 = t0 + minutes * 60;
    const clash = this.bookings.find((b) => b.machine === machine && b.t0 < t1 && t0 < b.t1);
    if (clash) return { ok: false, events: [{ type: 'warning', label: 'Trùng lịch', text: `${name} đã có ${clash.mine ? 'bạn' : clash.who} đặt ${hhmm(clash.t0)}–${hhmm(clash.t1)}. Chọn giờ khác.` }] };
    this.bookings.push({ machine, t0, t1, who: 'Bạn', mine: true });
    this.notebook.add({ day: '', experiment: 'Sổ đặt lịch máy', action: name, subject: `${hhmm(t0)}–${hhmm(t1)}`, result: 'đã đặt' });
    return { ok: true, events: [{ type: 'machine', label: 'Đặt lịch', text: `Đã ghi sổ: ${name} ${hhmm(t0)}–${hhmm(t1)}.` }] };
  }

  // Trước khi chạy máy dùng chung lúc now: chưa đặt lịch hoặc đang trong giờ của nhóm khác thì cảnh báo (mỗi máy một lần)
  checkRun(machine, name, now) {
    if (!this.needsBooking(machine)) return [];
    const at = this.bookings.filter((b) => b.machine === machine && b.t0 <= now && now < b.t1);
    if (at.some((b) => b.mine)) return [];
    const other = at.find((b) => !b.mine);
    if (other) return [{ type: 'warning', label: 'Giờ của nhóm khác', text: `${name} đang trong giờ ${other.who} đã đặt (${hhmm(other.t0)}–${hhmm(other.t1)}): hỏi nhóm đó trước, nếu không mẫu của họ phải chờ.` }];
    if (this.warnedBook.has(machine)) return [];
    this.warnedBook.add(machine);
    return [{ type: 'warning', label: 'Chưa đặt lịch', text: `${name} là máy dùng chung: ghi sổ đặt lịch (bảng Thao tác tay, mục Quy trình) trước khi chạy để không trùng giờ người khác.` }];
  }

  // ---- Hộp mẫu của mình (tủ −20 °C) ----
  // contents: tên các chất trong dụng cụ; chỉ cất được khi đã ghi nhãn
  store(container, contents, name = container) {
    if (!contents.length) return { ok: false, events: [{ type: 'warning', text: `${name} không có gì để cất.` }] };
    const label = this.labels.get(container);
    if (!label) return { ok: false, events: [{ type: 'warning', label: 'Chưa có nhãn', text: 'Mẫu không nhãn cất vào tủ chung sẽ bị coi là mẫu bỏ đi: ghi nhãn (tên mẫu, ngày, người làm) trước khi cất.' }] };
    this.box.push({ label, contents: [...contents], from: name });
    this.used.delete(container);
    this.dirty.add(container);
    this.labels.delete(container);
    return { ok: true, events: [{ type: 'machine', label: 'Cất mẫu', text: `Chuyển sang ống có nắp, cất vào hộp mẫu của bạn trong tủ −20 °C: ${label}. ${name} thành dụng cụ bẩn, cần rửa.` }] };
  }

  // Cho chất vào vật chứa: dụng cụ bẩn (đã dùng, chưa rửa) thì cảnh báo nhiễm chéo
  fill(container) {
    const events = [];
    if (this.dirty.has(container)) events.push({ type: 'warning', label: 'Dụng cụ bẩn', text: 'Dụng cụ vừa đổ bỏ nhưng chưa rửa: chất cũ còn bám thành sẽ phản ứng với chất mới. Rửa ở bồn rửa dụng cụ, tráng nước cất trước khi dùng lại.' });
    this.used.add(container);
    this.work();
    return { events };
  }

  empty(container) {
    this.used.delete(container);
    this.dirty.add(container);
    this.labels.delete(container);
    return { ok: true, events: [{ type: 'machine', label: 'Đổ bỏ', text: 'Đổ chất trong dụng cụ vào can chất thải đúng loại; dụng cụ thành dụng cụ bẩn, cần rửa.' }] };
  }

  clean(container) {
    if (this.used.has(container)) return { ok: false, events: [{ type: 'warning', text: 'Dụng cụ còn chứa chất: đổ bỏ vào can chất thải trước khi rửa.' }] };
    this.dirty.delete(container);
    return { ok: true, events: [{ type: 'machine', label: 'Rửa dụng cụ', text: 'Rửa bằng nước xà phòng, tráng nước máy rồi tráng nước cất 2–3 lần, úp lên giá phơi.' }] };
  }

  label(container, text) {
    const t = String(text ?? '').trim();
    if (!t) return { ok: false, events: [{ type: 'warning', text: 'Nhãn trống.' }] };
    this.labels.set(container, t);
    return { ok: true, events: [{ type: 'machine', label: 'Nhãn mẫu', text: `Ghi nhãn: ${t}.` }] };
  }

  wipe() {
    this.wiped = true;
    return { ok: true, events: [{ type: 'machine', label: 'Lau bàn', text: 'Lau mặt bàn bằng cồn 70 % (hoặc chất khử nhiễm của phòng), bỏ giấy lau vào đúng thùng.' }] };
  }

  // Ghi một lần chạy máy vào nhật ký thiết bị
  logRun(machine, detail, day = '') {
    this.notebook.add({ day, experiment: 'Nhật ký thiết bị', action: machine, subject: detail, result: 'đã chạy' });
  }

  // Kiểm tra cuối buổi. machinesOn: tên các máy đã dùng trong buổi mà còn bật (tủ lạnh, tủ đông, tủ ấm đang nuôi mẫu thì
  // để chạy); worn: đồ bảo hộ
  endSession({ machinesOn = [], worn = new Set(), names = (id) => id, bottles = (id) => id } = {}) {
    const items = [
      { ok: machinesOn.length === 0, text: machinesOn.length ? `Máy đã dùng còn bật: ${machinesOn.join(', ')}` : 'Đã tắt các máy đã dùng' },
      { ok: this.used.size === 0, text: this.used.size ? `Dụng cụ còn chứa chất: ${[...this.used].map(names).join(', ')}` : 'Đã đổ bỏ chất trong dụng cụ' },
      { ok: this.dirty.size === 0, text: this.dirty.size ? `Dụng cụ chưa rửa: ${[...this.dirty].map(names).join(', ')}` : 'Đã rửa dụng cụ' },
      { ok: this.caps.size === 0, text: this.caps.size ? `Chai còn mở nắp: ${[...this.caps].map(bottles).join(', ')}` : 'Đã đậy nắp chai' },
      { ok: this.wiped, text: this.wiped ? 'Đã lau mặt bàn' : 'Chưa lau mặt bàn' },
      { ok: !worn.has('gloves'), text: worn.has('gloves') ? 'Còn đeo găng' : 'Đã tháo găng' },
      { ok: this.washed || !this.worked, text: this.washed || !this.worked ? 'Đã rửa tay' : 'Chưa rửa tay' },
    ];
    const done = items.filter((i) => i.ok).length;
    return { ok: done === items.length, done, total: items.length, items, events: [{ type: done === items.length ? 'machine' : 'warning', label: 'Cuối buổi', text: `${done}/${items.length} việc: ${items.map((i) => `${i.ok ? '✓' : '✗'} ${i.text}`).join('; ')}.` }] };
  }
}
