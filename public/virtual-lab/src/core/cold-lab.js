// Khu tủ lạnh, tủ đông, tủ âm sâu: lấy thuốc thử ra hộp đá hoặc để trên bàn, cất lại, cho thời gian trôi qua,
// kiểm tra hoạt tính còn lại. Hoạt tính dùng trong chuỗi PCR (src/core/pcr-chain.js).
// Kho đồ và mô hình mất hoạt tính ở src/core/inventory.js, số liệu ở data/storage.json. Không phụ thuộc DOM.

import { Inventory, halfLife } from './inventory.js';
import { Notebook } from './notebook.js';
import { doorOpen, powerFailure, ALARM, BACKUP, TSX, fmtT } from '../../figures/ultrafreezer/model.mjs';
import { levelAfter, alarmState as ln2Alarm, holdingDays, daysUntil, oxygenPercent, litresToO2Limit, VESSEL, MONITOR, dec } from '../../figures/ln2/model.mjs';

export const INV_ACTIONS = { 'inv-move': 'Chuyển chỗ', 'inv-kit': 'Lấy hoặc cất bộ thuốc thử PCR', 'inv-wait': 'Chờ', 'inv-check': 'Kiểm tra hoạt tính', 'inv-door': 'Mở cửa tủ −80 °C', 'inv-power': 'Mất điện tủ −80 °C', 'inv-ln2': 'Kiểm tra bình nitơ lỏng' };
export const BACKUPS = { none: 'không có dự phòng', LN2: 'dự phòng LN2', CO2: 'dự phòng CO₂' };
const pct = (a) => `${Math.round(a * 100)} %`;
const hrs = (h) => (h < 1 ? `${Math.round(h * 60)} phút` : `${String(+h.toFixed(1)).replace('.', ',')} giờ`);
const OUT = new Set(['bench', 'ice']);

export class ColdLab {
  constructor(storage) {
    this.storage = storage;
    this.inv = new Inventory(storage);
    this.notebook = new Notebook();
  }

  reset(start = {}) {
    this.inv.reset(start);
    this.notebook.clear();
    this.ult = { doorSeconds: 30, innerDoors: true, powerFailHours: 0, backup: 'none' };
    this.ln2 = { days: 0, startLevel: 1, lidOpen: false, rackUp: false };
    this.figure = 'ultrafreezer';
  }

  do(action, params = {}) {
    const fn = { 'inv-move': () => this.move(params), 'inv-kit': () => this.kit(params), 'inv-wait': () => this.wait(params), 'inv-check': () => this.check(), 'inv-door': () => this.door(params), 'inv-power': () => this.power(params), 'inv-ln2': () => this.dewar(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  placeName(id) {
    return this.inv.places.get(id)?.name ?? id;
  }

  /** Món đang ở ngoài (bàn hoặc hộp đá) thì dùng được trên bàn. */
  usable(id) {
    const p = this.inv.placeOf(id);
    return p === undefined || OUT.has(p);
  }

  move({ item, to }) {
    const it = this.inv.item(item);
    if (!it) return { ok: false, events: [{ type: 'warning', text: `Không có "${item}" trong kho.` }] };
    const from = this.inv.placeOf(item);
    const res = this.inv.move(item, to);
    if (!res.ok) return res;
    const events = [{ type: 'machine', label: it.name, text: `${this.placeName(from)} → ${this.placeName(to)}.` }];
    events.push(...res.events);
    const T = this.inv.places.get(to).temp;
    if (to === 'bench' && it.decay && Object.keys(it.decay).length) {
      const h = halfLife(it.decay, T);
      if (Number.isFinite(h)) events.push(h > 72 ? { type: 'info', text: `Ở nhiệt độ phòng ${it.name} khá bền: hoạt tính giảm một nửa sau khoảng ${Math.round(h / 24)} ngày (số liệu hãng). Vẫn nên cất lại tủ sau khi dùng.` } : { type: 'warning', text: `Để ở nhiệt độ phòng: hoạt tính giảm một nửa sau khoảng ${hrs(h)}.` });
    }
    if (to === 'ice') events.push({ type: 'effect', text: 'Giữ trên đá (khoảng 0 °C) trong lúc dùng: chậm phân huỷ, và khi pha phản ứng PCR thì enzyme chưa hoạt động nên mồi không kéo dài sai trước khi chạy máy.' });
    if (!OUT.has(to) && to !== it.store && T > this.inv.places.get(it.store).temp) events.push({ type: 'warning', text: `${it.name} phải cất ở ${this.placeName(it.store)}; cất ở ${this.placeName(to)} thì hoạt tính vẫn giảm dần.` });
    this.notebook.add({ day: '', experiment: 'Kho lạnh', action: INV_ACTIONS['inv-move'], subject: it.name, result: this.placeName(to), activity: this.inv.activity(item).toFixed(3) });
    return { ok: true, events };
  }

  kit({ to = 'ice' }) {
    const events = [];
    for (const id of this.storage.kit) {
      const target = to === 'store' ? this.inv.item(id).store : to;
      const r = this.inv.move(id, target);
      events.push(...r.events);
    }
    const where = to === 'store' ? 'chỗ cất của từng ống' : this.placeName(to);
    events.unshift({ type: 'machine', label: 'Bộ thuốc thử PCR', text: `Chuyển ${this.storage.kit.length} ống tới ${where}.` });
    if (to === 'ice') events.push({ type: 'effect', text: 'Rã đông trên đá, búng nhẹ và ly tâm nhanh trước khi hút. Taq polymerase trong glycerol 50 % không đông ở −20 °C nên lấy ra là dùng được ngay.' });
    this.notebook.add({ day: '', experiment: 'Kho lạnh', action: INV_ACTIONS['inv-kit'], subject: 'PCR', result: where });
    return { ok: true, events };
  }

  wait({ hours = 1 }) {
    const before = new Map(this.inv.table().map((r) => [r.id, r.activity]));
    this.inv.wait(hours);
    const events = [{ type: 'machine', label: 'Thời gian', text: `${hrs(Number(hours))} trôi qua.` }];
    for (const r of this.inv.table()) {
      const drop = before.get(r.id) - r.activity;
      if (drop > 0.005) events.push({ type: drop > 0.1 ? 'warning' : 'info', label: r.name, text: `Ở ${r.placeName}: hoạt tính ${pct(before.get(r.id))} → ${pct(r.activity)}.` });
    }
    if (events.length === 1) events.push({ type: 'effect', text: 'Mọi ống đang ở đúng nhiệt độ: hoạt tính gần như không đổi.' });
    return { ok: true, events };
  }

  check() {
    const rows = this.inv.table();
    const events = [];
    const bad = rows.filter((r) => r.activity < 0.8);
    events.push(bad.length ? { type: 'warning', text: `${bad.map((r) => r.name).join(', ')} còn dưới 80 % hoạt tính: PCR dùng các ống này sẽ cho ít sản phẩm hơn, băng mờ hơn.` } : { type: 'effect', text: 'Mọi thuốc thử còn trên 80 % hoạt tính.' });
    const misplaced = rows.filter((r) => !OUT.has(r.place) && r.place !== this.inv.item(r.id).store);
    if (misplaced.length) events.push({ type: 'warning', text: `Cất sai chỗ: ${misplaced.map((r) => `${r.name} (${r.placeName})`).join(', ')}.` });
    const table = { head: ['Ống', 'Ở đâu', 'Hoạt tính', 'Lần rã đông'], rows: rows.map((r) => [r.name, r.placeName, pct(r.activity), String(r.thaws)]) };
    return { ok: true, events, table };
  }

  // Tủ âm sâu Thermo TSX40086V: mở cửa ngoài (cửa trong đóng hoặc mở) rồi đóng lại, theo figures/ultrafreezer/model.mjs
  door({ seconds = 30, inner = 'closed' }) {
    this.figure = 'ultrafreezer';
    const s = Math.max(1, Number(seconds) || 30);
    const innerDoors = inner !== 'open';
    const d = doorOpen(s, { innerDoors });
    this.ult = { doorSeconds: s, innerDoors, powerFailHours: 0, backup: 'none' };
    const events = [{ type: 'machine', label: 'Tủ −80 °C', text: `Mở cửa ngoài ${s} giây${innerDoors ? ', cửa trong vẫn đóng' : ' và mở cả cửa trong'}: không khí trong tủ lên ${fmtT(d.air)} °C, ${d.recoveryMin < 0.5 ? `vẫn dưới ${fmtT(TSX.recoveryTo, 0)} °C` : `đóng cửa thì khoảng ${Math.round(d.recoveryMin)} phút sau về ${fmtT(TSX.recoveryTo, 0)} °C`}.` }];
    if (d.doorAlarm) events.push({ type: 'warning', label: 'Báo động cửa', text: `Cửa mở quá ${ALARM.doorS / 60} phút: tủ kêu báo động cửa mở.` });
    if (d.alarm) events.push({ type: 'warning', label: 'Báo động nhiệt cao', text: `Không khí vượt ${fmtT(ALARM.high, 0)} °C: tủ báo động nhiệt độ cao tới khi hồi phục. Mẫu trong hộp giấy ấm chậm hơn không khí nhiều nên chưa hỏng, nhưng mở cửa lâu và thường xuyên làm đá bám gioăng, tủ kém kín.` });
    else events.push({ type: 'effect', text: 'Lấy hộp nhanh, mở cửa trong đúng ngăn cần lấy: không khí lạnh ít bị thay, mẫu trong hộp hầu như không đổi nhiệt độ.' });
    if (!innerDoors) events.push({ type: 'info', text: 'Cửa trong giữ lại phần lớn khí lạnh: mở cả cửa trong thì không khí ấm lên nhanh hơn khoảng 8 lần (ước tính, chưa xác minh).' });
    this.notebook.add({ day: '', experiment: 'Tủ −80 °C', action: INV_ACTIONS['inv-door'], subject: `${s} s`, result: `${fmtT(d.air)} °C` });
    return { ok: true, events };
  }

  // Mất điện: không khí ấm dần theo Newton (khớp 267 phút từ −80 lên −50 °C của TDS); mẫu trễ so với không khí.
  // Các món cất trong tủ −80 °C mất hoạt tính theo nhiệt độ của mẫu (data/storage.json).
  power({ hours = 12, backup = 'none' }) {
    this.figure = 'ultrafreezer';
    const h = Math.max(0.5, Number(hours) || 12);
    const b = BACKUP[backup] ? backup : 'none';
    const before = new Map(this.inv.table().filter((r) => r.place === 'ult').map((r) => [r.id, r.activity]));
    const stepH = 0.25;
    for (let t = stepH; t <= h + 1e-9; t += stepH) this.inv.expose('ult', powerFailure(t - stepH / 2, { backup: b }).sample, stepH);
    const end = powerFailure(h, { backup: b });
    this.ult = { doorSeconds: 0, innerDoors: true, powerFailHours: h, backup: b };
    const events = [{ type: 'machine', label: 'Tủ −80 °C', text: `Mất điện ${h} giờ, cửa đóng, ${BACKUPS[b]}: không khí lên ${fmtT(end.air)} °C, mẫu trong hộp ${fmtT(end.sample)} °C. Bộ điều khiển chạy pin vẫn báo động mất điện${end.alarm.high ? ' và nhiệt độ cao' : ''}.` }];
    if (b === 'none') events.push({ type: 'info', text: `Tủ rỗng lên −50 °C sau khoảng ${hrs(end.hoursTo[-50])}, −20 °C sau khoảng ${hrs(end.hoursTo[-20])} (ngoại suy từ số liệu hãng; tủ đầy mẫu ấm chậm hơn).` });
    else events.push({ type: 'effect', text: `Van dự phòng phun ${b === 'LN2' ? 'nitơ lỏng' : 'CO₂'} giữ không khí ở ${fmtT(BACKUP[b].set, 0)} °C, tốn khoảng ${BACKUP[b].usePerH.join('–').replace(/\./g, ',')} ${BACKUP[b].unit} mỗi giờ.` });
    for (const r of this.inv.table().filter((x) => x.place === 'ult')) {
      const a0 = before.get(r.id);
      if (a0 - r.activity > 0.01) events.push({ type: 'warning', label: r.name, text: `Hoạt tính ${pct(a0)} → ${pct(r.activity)}: mẫu ấm lên tới ${fmtT(end.sample, 0)} °C nên hỏng dần. Chuyển mẫu sang tủ −80 °C khác hoặc thùng đá khô ngay khi tủ báo động.` });
      else events.push({ type: 'effect', label: r.name, text: `Hoạt tính còn ${pct(r.activity)}: mẫu vẫn đủ lạnh.` });
    }
    this.notebook.add({ day: '', experiment: 'Tủ −80 °C', action: INV_ACTIONS['inv-power'], subject: `${h} giờ, ${BACKUPS[b]}`, result: `${fmtT(end.sample)} °C` });
    return { ok: true, events };
  }

  // Bình nitơ lỏng Thermo Locator 4 Plus: mức LN2 giảm theo bay hơi tĩnh 0,99 L/ngày (manual), bộ đo mức siêu âm
  // báo LOW LEVEL dưới 5 cm; cạn thì mẫu trong bình ấm lên. Nạp lại thì mức về đầy.
  dewar({ days = 30, refill = 'no' }) {
    const d = Math.max(0, Number(days) || 0);
    const fill = refill === true || refill === 'yes';
    const start = this.ln2.startLevel * VESSEL.capacityL;
    const total = this.ln2.days + d;
    const lv = levelAfter(total, start);
    const al = ln2Alarm(lv.cm);
    const events = [{ type: 'machine', label: 'Bình nitơ lỏng', text: `${d} ngày trôi qua (${total} ngày từ lần nạp trước): còn ${dec(lv.litres)} L LN2, mức ${dec(lv.cm)} cm, bộ đo mức: ${al.text}.` }];
    if (al.state === 'ok') events.push({ type: 'effect', text: `Bình đầy giữ được khoảng ${Math.round(holdingDays(VESSEL.capacityL))} ngày; LOW LEVEL sẽ sáng sau khoảng ${Math.round(daysUntil(MONITOR.lowCm, start))} ngày kể từ lần nạp.` });
    else if (al.state === 'low') events.push({ type: 'warning', label: 'LOW LEVEL', text: 'Mức LN2 dưới 5 cm: nạp thêm ngay. Mẫu vẫn dưới −180 °C trong pha hơi nhưng không còn dự trữ.' });
    else events.push({ type: 'warning', label: 'Báo động', text: al.state === 'empty' ? 'Bình cạn: không còn LN2 giữ lạnh, mẫu ấm dần lên. Ấm quá khoảng −135 °C (nhiệt độ chuyển thuỷ tinh của nước) thì băng trong tế bào đông lạnh kết tinh lại, tế bào hỏng. Chuyển mẫu sang bình khác ngay.' : 'Mức LN2 dưới 2,5 cm: còi kêu và tiếp điểm báo động từ xa bật. Nạp ngay.' });
    // Bình cạn: mẫu cất trong bình coi như ở −80 °C trong thời gian đã cạn (minh hoạ, hãng không công bố đường ấm lên)
    if (lv.empty) this.inv.expose('ln2', -80, Math.max(0, (total - holdingDays(start)) * 24));
    if (fill) {
      const need = VESSEL.capacityL - lv.litres;
      this.ln2 = { ...this.ln2, days: 0, startLevel: 1 };
      events.push({ type: 'machine', label: 'Nạp LN2', text: `Đeo găng cryo và tấm che mặt, rót ${dec(need)} L LN2 từ bình chứa vào tới mức tối đa ${dec(VESSEL.maxFillCm)} cm.` });
      events.push({ type: 'info', label: 'Thiếu oxy', text: `${dec(need)} L LN2 hoá thành khoảng ${dec(need * 0.694)} m³ khí N₂. Trong phòng kín 30 m³, chỉ khoảng ${dec(litresToO2Limit(30))} L bay hơi là O₂ xuống dưới 19,5 %; đổ ra 10 L thì còn khoảng ${dec(oxygenPercent(10, 30))} %. Nạp ở phòng thông gió, có cảm biến O₂.` });
    } else this.ln2 = { ...this.ln2, days: total };
    this.figure = 'ln2';
    this.notebook.add({ day: '', experiment: 'Bình nitơ lỏng', action: INV_ACTIONS['inv-ln2'], subject: `${total} ngày`, result: `${dec(lv.cm)} cm`, refill: fill ? 'có' : 'không' });
    return { ok: true, events };
  }

  // which: 'ultrafreezer' | 'ln2' (mặc định: thiết bị vừa thao tác)
  figureData(which = this.figure) {
    return which === 'ln2' ? { ...this.ln2 } : { ...this.ult, name: 'Tế bào khả biến' };
  }

  /** Hoạt tính các chất có trong ống (cho pcr-chain). */
  activities(ids) {
    return this.inv.activities(ids);
  }
}
