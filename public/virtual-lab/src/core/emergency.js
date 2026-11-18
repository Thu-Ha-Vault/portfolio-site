// Xử lý sự cố trong phòng thí nghiệm: rửa mắt hoặc tắm khẩn cấp, chọn bình chữa cháy theo loại đám cháy, bỏ chất thải
// đúng thùng. Ngưỡng của trạm rửa mắt và vòi tắm theo ANSI/ISEA Z358.1-2014, bình chữa cháy theo NFPA 10, chất thải
// sinh học và vật sắc nhọn theo OSHA 1910.1030 (data/safety.json, mục "emergency"). Không phụ thuộc DOM.

import { Notebook } from './notebook.js';

export const EM_ACTIONS = { 'em-eyewash': 'Rửa mắt khẩn cấp', 'em-fire': 'Chữa cháy', 'em-waste': 'Bỏ chất thải', 'em-spill': 'Xử lý tràn hoá chất' };
// Tràn hoá chất lượng nhỏ trên bàn (giai đoạn 7): bộ xử lý tràn có bột trung hoà acid (NaHCO₃), base (acid citric) và
// gối thấm trơ cho dung môi, theo hướng dẫn của American Chemical Society, Guide for Chemical Spill Response Planning in
// Laboratories (1995): đeo đồ bảo hộ, khoanh vùng, thấm từ mép vào giữa, trung hoà acid và base trước khi thấm.
export const SPILLS = {
  acid: { name: 'HCl 1 M đổ ra bàn (khoảng 50 mL)', ok: 'kit' },
  base: { name: 'NaOH 1 M đổ ra bàn (khoảng 50 mL)', ok: 'kit' },
  solvent: { name: 'ethanol đổ ra bàn (khoảng 100 mL)', ok: 'kit' },
};
export const SPILL_METHODS = { kit: 'bộ xử lý tràn: trung hoà, gối thấm', towel: 'lau ngay bằng giấy lau tay', water: 'dội nước cho loãng rồi lau' };
export const FIRES = {
  paper: { name: 'giấy, khăn lau cháy (loại A)', cls: 'A' },
  solvent: { name: 'ethanol tràn bốc cháy (loại B)', cls: 'B' },
  electrical: { name: 'bếp điện đang cắm điện cháy (loại C)', cls: 'C' },
  metal: { name: 'mẩu natri cháy (loại D)', cls: 'D' },
};
export const AGENTS = { water: 'nước', CO2: 'bình CO₂', ABC: 'bình bột ABC', D: 'bình bột loại D (cát khô)' };
export const WASTES = {
  needle: { name: 'kim tiêm đã dùng', bin: 'sharps' },
  tip: { name: 'đầu tip dính dịch vi khuẩn', bin: 'bio' },
  culture: { name: 'đĩa thạch đã nuôi vi khuẩn', bin: 'bio' },
  glass: { name: 'ống nghiệm thuỷ tinh vỡ (sạch)', bin: 'glass' },
  lead: { name: 'dung dịch còn chì sau thí nghiệm mưa vàng', bin: 'chem' },
};
export const BINS = { sharps: 'hộp vật sắc nhọn', bio: 'thùng rác sinh học (túi đỏ)', glass: 'hộp thuỷ tinh vỡ', chem: 'can chất thải kim loại nặng', general: 'thùng rác thường' };

// Hiệu quả của từng chất chữa cháy theo loại đám cháy (NFPA 10): ok, poor (dập được nhưng dễ cháy lại), bad (nguy hiểm)
const FIRE_TABLE = {
  water: { A: 'ok', B: 'bad', C: 'bad', D: 'bad' },
  CO2: { A: 'poor', B: 'ok', C: 'ok', D: 'bad' },
  ABC: { A: 'ok', B: 'ok', C: 'ok', D: 'bad' },
  D: { A: 'poor', B: 'poor', C: 'poor', D: 'ok' },
};
const WHY = {
  'water-B': 'Phun nước vào chất lỏng dễ cháy làm chất lỏng đang cháy văng rộng ra, lửa lan theo.',
  'water-C': 'Nước dẫn điện: người cầm vòi có thể bị điện giật. Ngắt điện trước.',
  'water-D': 'Natri gặp nước sinh H₂ và toả nhiệt mạnh: lửa bùng to, có thể nổ.',
  'CO2-D': 'Kim loại kiềm cháy khử được CO₂, lửa không tắt.',
  'ABC-D': 'Bột ABC không dập được kim loại cháy.',
  'CO2-A': 'CO₂ tan nhanh, than hồng trong giấy có thể cháy lại.',
};

export class EmergencyLab {
  constructor(safety) {
    this.em = safety.emergency;
    this.notebook = new Notebook();
    this.reset();
  }

  reset() {
    this.last = { mode: 'off', minutes: 0, waterC: 25 };
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'em-eyewash': () => this.eyewash(params), 'em-fire': () => this.fire(params), 'em-waste': () => this.waste(params), 'em-spill': () => this.spill(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  // Hoá chất bắn vào mắt: tới trạm trong reachS giây, rửa minutes phút, nước waterC °C
  eyewash({ reachS = 10, minutes = 15, waterC = 25 }) {
    const e = this.em.eyewash;
    const m = Number(minutes);
    const s = Number(reachS);
    const T = Number(waterC);
    this.last = { mode: 'eyewash', minutes: m, waterC: T, reachS: s };
    const litres = e.flow_Lpm * m;
    const events = [{ type: 'machine', label: 'Trạm rửa mắt', text: `Tới trạm sau ${s} s, đẩy cần mở van: hai tia nước ${e.flow_Lpm.toString().replace('.', ',')} L/phút, nắp chống bụi bật ra. Giữ mí mắt mở, rửa ${m} phút (${litres.toFixed(1).replace('.', ',')} L nước, nước ${T} °C).` }];
    const bad = [];
    if (s > e.reach_s) bad.push(`tới trạm mất ${s} s, quá ${e.reach_s} s (ANSI Z358.1: trạm phải tới được trong ${e.reach_s} s, khoảng ${e.reach_m} m)`);
    if (m < e.duration_min) bad.push(`chỉ rửa ${m} phút, ít hơn ${e.duration_min} phút`);
    if (T < e.temp_C[0] || T > e.temp_C[1]) bad.push(`nước ${T} °C ngoài khoảng ấm ${e.temp_C[0]}–${e.temp_C[1]} °C: ${T < e.temp_C[0] ? 'lạnh quá, người bị nạn khó giữ mắt dưới nước đủ lâu' : 'nóng quá, làm tổn thương thêm'}`);
    if (bad.length) events.push({ type: 'warning', label: 'Chưa đúng', text: `${bad.join('; ')}. Hoá chất ăn mòn (nhất là base như NaOH) tiếp tục làm hỏng giác mạc khi chưa rửa sạch.` });
    else events.push({ type: 'effect', text: 'Rửa đúng thời gian và nhiệt độ: hoá chất được pha loãng và trôi hết. Sau đó vẫn phải đi khám mắt, mang theo SDS của hoá chất.' });
    this.notebook.add({ day: '', experiment: 'Sự cố', action: EM_ACTIONS['em-eyewash'], subject: `${s} s`, result: `${m} phút, ${T} °C` });
    return { ok: !bad.length, events };
  }

  fire({ fire = 'electrical', agent = 'CO2' }) {
    const f = FIRES[fire] ?? FIRES.electrical;
    const a = AGENTS[agent] ? agent : 'CO2';
    const r = FIRE_TABLE[a][f.cls];
    const events = [{ type: 'machine', label: 'Chữa cháy', text: `Đám cháy: ${f.name}. Dùng ${AGENTS[a]}: rút chốt, hướng vòi vào gốc lửa, bóp cò, quét qua lại.` }];
    if (r === 'ok') events.push({ type: 'effect', text: `Lửa tắt. ${f.cls === 'C' ? 'Ngắt điện ngay sau đó; CO₂ không để lại cặn làm hỏng máy.' : f.cls === 'D' ? 'Phủ kín bằng bột loại D hoặc cát khô để cách ly không khí.' : ''}`.trim() });
    else events.push({ type: 'warning', label: r === 'bad' ? 'Nguy hiểm' : 'Chưa chắc', text: WHY[`${a}-${f.cls}`] ?? (r === 'bad' ? 'Chất chữa cháy này không dùng cho loại đám cháy này.' : 'Dập được nhưng lửa dễ bùng lại.') });
    this.notebook.add({ day: '', experiment: 'Sự cố', action: EM_ACTIONS['em-fire'], subject: f.name, result: `${AGENTS[a]}: ${r}` });
    return { ok: r === 'ok', events };
  }

  waste({ item = 'needle', bin = 'sharps' }) {
    const w = WASTES[item] ?? WASTES.needle;
    const b = BINS[bin] ? bin : 'general';
    const right = w.bin === b;
    const events = [{ type: 'machine', label: 'Chất thải', text: `Bỏ ${w.name} vào ${BINS[b]}.` }];
    if (right) events.push({ type: 'effect', text: { sharps: 'Hộp vật sắc nhọn cứng, kín, không bị đâm thủng; đầy tới vạch thì đóng nắp, không ấn thêm.', bio: 'Túi đỏ có nhãn biohazard; hấp tiệt trùng trước khi đưa đi xử lý.', glass: 'Thuỷ tinh vỡ sạch để riêng trong hộp cứng để người thu gom không bị cứa tay.', chem: 'Chất thải chứa kim loại nặng thu riêng vào can có nhãn, không đổ xuống bồn.' }[b] });
    else events.push({ type: 'warning', label: 'Sai thùng', text: `${w.name.charAt(0).toUpperCase()}${w.name.slice(1)} phải bỏ vào ${BINS[w.bin]}.${w.bin === 'sharps' ? ' Kim trong túi rác thường đâm vào tay người thu gom.' : w.bin === 'bio' ? ' Vi khuẩn chưa tiệt trùng ra môi trường.' : w.bin === 'chem' ? ' Chì độc với sinh vật thuỷ sinh, không được đổ vào nước thải.' : ''}` });
    this.notebook.add({ day: '', experiment: 'Sự cố', action: EM_ACTIONS['em-waste'], subject: w.name, result: right ? 'đúng' : 'sai' });
    return { ok: right, events };
  }

  spill({ spill = 'acid', method = 'kit' }) {
    const sp = SPILLS[spill] ?? SPILLS.acid;
    const m = SPILL_METHODS[method] ? method : 'kit';
    const events = [{ type: 'machine', label: 'Tràn hoá chất', text: `${sp.name.charAt(0).toUpperCase()}${sp.name.slice(1)}. Cách xử lý: ${SPILL_METHODS[m]}.` }];
    const why = {
      'acid-kit': 'Rắc bột NaHCO₃ từ mép vào giữa tới khi hết sủi bọt, thấm bằng gối thấm, gom vào túi chất thải có nhãn.',
      'base-kit': 'Rắc bột trung hoà base (acid yếu) rồi thấm; kiểm tra lại bằng giấy pH trước khi gom.',
      'solvent-kit': 'Tắt nguồn lửa, mở thông gió; phủ gối thấm trơ, không dùng giấy (giấy thấm dung môi là vật dễ cháy).',
      'acid-towel': 'Giấy lau thấm acid làm ướt và thủng găng, acid vẫn còn trên mặt bàn; phải trung hoà trước.',
      'base-towel': 'Giấy lau không trung hoà được base; găng ướt NaOH gây bỏng da.',
      'solvent-towel': 'Giấy thấm đầy ethanol thành mồi lửa trong thùng rác; dùng gối thấm trơ.',
      'acid-water': 'Dội nước làm acid lan rộng ra bàn và sàn, chảy vào ổ điện, khó gom.',
      'base-water': 'Dội nước làm NaOH lan rộng, sàn trơn, dễ bắn vào người.',
      'solvent-water': 'Ethanol tan trong nước, vùng tràn rộng ra mà hơi dễ cháy vẫn bốc lên.',
    }[`${spill}-${m}`];
    const right = sp.ok === m;
    events.push(right ? { type: 'effect', text: why } : { type: 'warning', label: 'Chưa đúng', text: why });
    this.notebook.add({ day: '', experiment: 'Sự cố', action: EM_ACTIONS['em-spill'], subject: sp.name, result: right ? 'đúng' : 'sai' });
    return { ok: right, events };
  }

  figureData() {
    return { ...this.last };
  }
}
