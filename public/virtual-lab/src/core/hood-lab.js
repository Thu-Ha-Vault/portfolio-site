// Tủ hút khí độc (Labconco Protector XStream 5 ft) và phản ứng sinh khí độc Cu + HNO₃ đặc → NO₂.
// Vận tốc mặt cửa, báo động, hệ số rò ở vùng thở theo figures/fumehood/model.mjs (lưu lượng theo bảng của hãng;
// hệ số rò là số minh hoạ theo chiều hướng của các phép thử ASHRAE 110). Ngưỡng NO₂ theo NIOSH/OSHA.
// Làm ngoài tủ: NO₂ hoà vào luồng khí khoảng 0,05 m³/s quanh mặt người làm (minh hoạ). Không phụ thuộc DOM.

import { hoodState, gasSource, no2Level, HOOD, vn } from '../../figures/fumehood/model.mjs';
import { Notebook } from './notebook.js';

export const FH_ACTIONS = { 'fh-set': 'Chỉnh tủ hút', 'fh-work': 'Cho Cu vào HNO₃ đặc', 'fh-tube': 'Ống NO₂ kín' };
export const BATHS = { ice: { name: 'cốc nước đá', T: 0 }, room: { name: 'giá ống ở nhiệt độ phòng', T: 25 }, hot: { name: 'cốc nước nóng', T: 80 } };
export const SASH_STOPS = [0, 152, 305, 457, 711];
const BENCH_AIR_LPM = 3000; // L/min khí đi qua vùng thở khi làm trên bàn hở (minh hoạ)
const LEVEL_TEXT = {
  safe: 'dưới giới hạn ngắn hạn 1 ppm (NIOSH)',
  stel: 'vượt giới hạn ngắn hạn 1 ppm (NIOSH): kích ứng mắt, mũi, họng',
  ceiling: 'vượt trần 5 ppm (OSHA): ho, khó thở, có thể phù phổi sau vài giờ',
  idlh: 'vượt mức nguy hiểm tức thời 13 ppm (IDLH): phải rời phòng ngay',
};

export class HoodLab {
  // eq: data/thermo.json equilibria.N2O4_from_NO2 (K25 theo bar⁻¹, ΔH của 2NO₂ ⇌ N₂O₄)
  constructor(eq = null) {
    this.eq = eq;
    this.notebook = new Notebook();
    this.reset();
  }

  reset() {
    this.set = { sash: HOOD.sashStop, fan: true, clutter: false };
    this.last = { gas: 'none' };
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'fh-set': () => this.adjust(params), 'fh-work': () => this.work(params), 'fh-tube': () => this.tube(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  state(gas = 'none') {
    return hoodState({ ...this.set, gas });
  }

  adjust({ sash, fan, clutter }) {
    if (sash !== undefined) this.set.sash = Math.max(0, Math.min(HOOD.sashMax, Number(sash)));
    if (fan !== undefined) this.set.fan = fan === true || fan === 'yes';
    if (clutter !== undefined) this.set.clutter = clutter === true || clutter === 'yes';
    const s = this.state();
    const events = [{ type: 'machine', label: 'Tủ hút', text: `Kính mở ${s.sash} mm, quạt ${s.fan ? 'chạy' : 'tắt'}${s.clutter ? ', có chai lọ để sát vách ngăn' : ''}: lưu lượng thải ${Math.round(s.flowM3h)} m³/h, vận tốc mặt cửa ${vn(s.velocity)} m/s.` }];
    if (s.alarms.includes('airflow')) events.push({ type: 'warning', label: 'Báo động', text: s.fan ? `Vận tốc mặt cửa dưới ${vn(HOOD.alarmLow)} m/s: còi kêu, đèn đỏ. Hạ kính xuống chặn ${HOOD.sashStop} mm.` : 'Quạt tắt: tủ không hút, bộ báo luồng khí kêu.' });
    if (s.alarms.includes('sash')) events.push({ type: 'warning', label: 'Kính quá chặn', text: `Kính mở cao hơn chặn ${HOOD.sashStop} mm: chỉ nâng cao khi xếp đồ vào tủ, không làm thí nghiệm ở độ mở này.` });
    if (s.clutter) events.push({ type: 'warning', text: 'Chai lọ che khe dưới của vách ngăn: dòng khí quẩn ngược ra cửa. Để đồ cách mép trong cửa ít nhất 15 cm và không chắn vách sau.' });
    if (!s.alarms.length && !s.clutter) events.push({ type: 'effect', text: s.sashState === 'closed' ? 'Kính đóng: tủ vẫn hút qua khe dưới gờ khí động và cửa bypass phía trên.' : `Vận tốc trong khoảng 0,4–0,6 m/s: tủ giữ được khí (ANSI Z9.5 gợi ý 80–100 fpm, tức 0,41–0,51 m/s).` });
    return { ok: true, events };
  }

  work({ where = 'hood', grams = 2 }) {
    const g = Math.max(0.05, Number(grams) || 2);
    const source = gasSource('NO2', { grams: g, minutes: 2 });
    const inHood = where === 'hood';
    let ppm;
    let s = null;
    if (inHood) {
      s = this.state('NO2');
      ppm = (s.leak.ppm * source) / HOOD.tracer.rate;
    } else ppm = (source / BENCH_AIR_LPM) * 1e6;
    const level = no2Level(ppm);
    this.last = { gas: 'NO2', where, grams: g, ppm };
    const events = [{ type: 'effect', label: 'Phản ứng', text: `Cu + 4HNO₃ (đặc) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O: ${vn(g, 2)} g phoi đồng tan trong khoảng 2 phút, dung dịch xanh lục, khí nâu đỏ bốc lên mạnh. Sinh ra khoảng ${vn(source * 2, 2)} L NO₂ (${vn(source, 2)} L/phút).` }];
    if (inHood) events.push({ type: 'machine', label: 'Tủ hút', text: !s.fan ? `Kính ${s.sash} mm, quạt tắt: khí nâu không được hút, dâng lên rồi tràn ra cửa tủ.` : `Kính ${s.sash} mm, vận tốc mặt cửa ${vn(s.velocity)} m/s: khí nâu bị kéo ra sau vách ngăn và lên ống thải${s.safe ? '' : ', nhưng một phần xoáy ngược ra cửa'}.` });
    else events.push({ type: 'warning', label: 'Làm ngoài tủ hút', text: 'Phản ứng sinh khí độc phải làm trong tủ hút. Trên bàn hở, khí nâu bốc thẳng vào vùng thở của người làm (ước tính hoà vào khoảng 3 m³/phút không khí quanh mặt, minh hoạ).' });
    events.push({ type: level === 'safe' ? 'effect' : 'warning', label: 'NO₂ ở vùng thở', text: `Khoảng ${ppm < 0.01 ? '< 0,01' : vn(ppm, ppm < 1 ? 3 : 1)} ppm: ${LEVEL_TEXT[level]}.` });
    if (inHood && !s.safe && level === 'safe' && s.fan) events.push({ type: 'info', text: `Tủ chưa đạt mức giữ khí của phép thử ASHRAE 110 (${vn(s.leak.ppm, 3)} ppm so với 0,05 ppm khi nhả 4 L/phút khí đánh dấu): ${s.message.toLowerCase()}.` });
    this.notebook.add({ day: '', experiment: 'Tủ hút khí độc', action: FH_ACTIONS['fh-work'], subject: inHood ? `trong tủ, kính ${s.sash} mm` : 'trên bàn hở', result: `${vn(ppm, 3)} ppm NO₂`, grams: g });
    return { ok: true, events, safe: level === 'safe' };
  }

  /**
   * Cân bằng 2NO₂ ⇌ N₂O₄ trong ống kín đã thu NO₂ (P0 = 1 bar quy về NO₂ ở 25 °C): Kp theo van 't Hoff,
   * p(NO₂) = (−1 + √(1 + 8·Kp·P0)) / (4·Kp). Màu nâu tỉ lệ với p(NO₂).
   */
  no2At(T) {
    const e = this.eq ?? { K25: 6.75, dH_kJ: -57.12 };
    const K = e.K25 * Math.exp(((-e.dH_kJ * 1000) / 8.314) * (1 / (T + 273.15) - 1 / 298.15));
    const P0 = (T + 273.15) / 298.15;
    const p = (-1 + Math.sqrt(1 + 8 * K * P0)) / (4 * K);
    return { K, p, frac: p / P0 };
  }

  tube({ bath = 'ice' }) {
    if (this.last.gas !== 'NO2') return { ok: false, events: [{ type: 'warning', text: 'Chưa có NO₂: cho Cu vào HNO₃ đặc trong tủ hút và thu khí vào ống nghiệm có nút trước.' }] };
    const b = BATHS[bath] ?? BATHS.ice;
    const r = this.no2At(b.T);
    const r25 = this.no2At(25);
    const k = r.p / r25.p;
    this.tubeBath = bath;
    const events = [{ type: 'machine', label: 'Ống kín', text: `Ngâm ống NO₂ đã nút kín vào ${b.name} (${b.T} °C): Kp = ${r.K.toFixed(r.K < 1 ? 2 : 1).replace('.', ',')} bar⁻¹, p(NO₂) = ${r.p.toFixed(2).replace('.', ',')} bar, ${Math.round(r.frac * 100)} % nitơ ở dạng NO₂.` }];
    events.push({ type: 'effect', label: 'Màu', text: b.T < 25 ? `Màu nâu nhạt đi còn khoảng ${Math.round(k * 100)} % so với ở 25 °C: 2NO₂ ⇌ N₂O₄ toả nhiệt (ΔH = ${String(this.eq?.dH_kJ ?? -57.12).replace('.', ',')} kJ), làm lạnh thì cân bằng dịch sang phải tạo N₂O₄ không màu.` : b.T > 25 ? `Màu nâu đậm lên khoảng ${k.toFixed(1).replace('.', ',')} lần so với ở 25 °C: đun nóng thì cân bằng dịch về phía thu nhiệt, N₂O₄ phân li thành NO₂.` : 'Màu nâu ở 25 °C làm mốc so sánh.' });
    this.notebook.add({ day: '', experiment: 'Cân bằng NO₂/N₂O₄', action: FH_ACTIONS['fh-tube'], subject: b.name, result: `${Math.round(r.frac * 100)} % NO₂` });
    return { ok: true, events };
  }

  figureData() {
    return { sash: this.set.sash, fan: this.set.fan, clutter: this.set.clutter, gas: this.last.gas === 'NO2' && this.last.where === 'hood' ? 'NO2' : 'none' };
  }
}
