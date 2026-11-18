import { Notebook } from './notebook.js';
import { rng } from './random.js';

// Thực tập hoá đại cương, Bài 1 (cân, kết tủa, lọc, rửa), Bài 2 (pha dung dịch, chuẩn độ), Bài 4 (định tính anion),
// Bài 5A (nhiệt lượng kế), Bài 7 (tốc độ phản ứng), Bài 9 (Le Chatelier), cùng bài muối Mohr (định tính, chuẩn độ
// permanganat, khối lượng BaSO₄) theo giáo trình trong
// Google Drive của chủ dự án (data/genchem.json). pH trong bình tính từ cân bằng điện tích với pKa của oxalic acid;
// điểm cuối là thể tích làm chất chỉ thị đổi màu, nên chỉ thị chọn sai cho kết quả sai. Dụng cụ có dung sai cấp A.
// Không phụ thuộc DOM.

export const GC_ACTIONS = {
  'gc-weigh': 'Cân 10 mL nước lấy bằng pipet',
  'gc-precip': 'Tạo kết tủa',
  'gc-filter': 'Lọc kết tủa',
  'gc-wash': 'Rửa kết tủa, thử Cl⁻ bằng AgNO₃',
  'gc-prep': 'Pha dung dịch',
  'gc-titrate': 'Chuẩn độ acid – base',
  'gc-redox': 'Chuẩn độ KMnO₄ bằng oxalic acid',
  'gc-result': 'Tính nồng độ',
  'gc-eq': 'Chuyển dịch cân bằng (Le Chatelier)',
  'gc-rate-conc': 'Tốc độ theo nồng độ Na₂S₂O₃',
  'gc-rate-temp': 'Tốc độ theo nhiệt độ (KMnO₄ + oxalic acid)',
  'gc-rate-cat': 'Thử chất xúc tác',
  'gc-rate-plot': 'Vẽ đồ thị tốc độ',
  'gc-an-test': 'Định tính anion (mẫu 1 và mẫu 2)',
  'gc-an-answer': 'Kết luận thành phần mẫu 2',
  'gc-cal-run': 'Đo nhiệt hoà tan trong nhiệt lượng kế',
  'gc-cal-result': 'Tính C_k và ΔH hoà tan KCl',
  'gc-mohr-salt': 'Lọc, rửa tinh thể muối Mohr',
  'gc-mohr-qual': 'Định tính muối Mohr',
  'gc-mohr-titr': 'Chuẩn độ Fe²⁺ bằng KMnO₄',
  'gc-mohr-ba': 'Phân tích khối lượng BaSO₄',
  'gc-mohr-formula': 'Tính công thức thực nghiệm',
};

const KW = 1e-14;
const R_GAS = 8.314;
const DROP = 0.05;
const dec = (v, d = 2) => Number(v).toFixed(d).replace('.', ',');
const sig = (v, n = 4) => Number(v).toPrecision(n).replace('.', ',');

export class GenChemLab {
  constructor(data) {
    this.data = data;
    this.reset();
  }

  reset(seed = 1) {
    this.random = rng(seed);
    this.notebook = new Notebook();
    this.weighings = [];
    this.ppt = null;
    this.sol = {};
    this.trials = [];
    this.rates = { conc: [], temp: [], cat: [] };
    // Bài 4: mẫu 2 có 2–5 trong 6 anion, chọn theo seed của phiên (dãy ngẫu nhiên riêng, không làm lệch các bài khác)
    const ions = this.data.anion?.order ?? [];
    const draw = rng(seed * 7919 + 13);
    let pick = [];
    while (ions.length && (pick.length < 2 || pick.length > 5)) pick = ions.filter(() => draw() < 0.5);
    this.sample2 = new Set(pick);
    this.anionSeen = new Map();
    this.calRuns = {};
    this.mohr = { water: this.data.mohrLab?.waterOk ?? 6, washed: false, titr: [], ba: null };
  }

  do(action, params = {}) {
    const fn = {
      'gc-weigh': () => this.weigh(), 'gc-precip': () => this.precip(params), 'gc-filter': () => this.filter(params), 'gc-wash': () => this.wash(params),
      'gc-prep': () => this.prep(params), 'gc-titrate': () => this.titrate(params), 'gc-redox': () => this.redox(params), 'gc-result': () => this.result(params), 'gc-eq': () => this.equilibrium(params),
      'gc-rate-conc': () => this.rateConc(params), 'gc-rate-temp': () => this.rateTemp(params), 'gc-rate-cat': () => this.rateCat(params), 'gc-rate-plot': () => this.ratePlot(params),
      'gc-an-test': () => this.anionTest(params), 'gc-an-answer': () => this.anionAnswer(params), 'gc-cal-run': () => this.calRun(params), 'gc-cal-result': () => this.calResult(params),
      'gc-mohr-salt': () => this.mohrSalt(params), 'gc-mohr-qual': () => this.mohrQual(params), 'gc-mohr-titr': () => this.mohrTitr(params), 'gc-mohr-ba': () => this.mohrBa(params), 'gc-mohr-formula': () => this.mohrFormula(),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #note(action, subject, result) {
    this.notebook.add({ day: '', experiment: 'Thực tập hoá đại cương', action: GC_ACTIONS[action], subject, result });
  }

  // Thể tích thật của pipet bầu 10 mL cấp A (±0,02 mL)
  #pipet() { return 10 + Math.max(-0.02, Math.min(0.02, 0.008 * this.random.normal())); }

  // ---- Bài 1 ----
  weigh() {
    const d = this.data.water.density20;
    const g = Math.round(this.#pipet() * d * 100) / 100; // cân kỹ thuật 2 số lẻ
    this.weighings.push(g);
    const n = this.weighings.length;
    const mean = this.weighings.reduce((a, b) => a + b, 0) / n;
    const err = ((g - 10) / 10) * 100;
    const events = [{ type: 'machine', label: `Lần ${n}`, text: `Pipet 10 mL nước cất vào cốc cân đã trừ bì: cân đọc ${dec(g)} g, lệch ${dec(err, 1)} % so với 10,00 g nếu coi d = 1 g/mL.` }];
    if (n >= 3) events.push({ type: 'effect', label: 'Nhận xét', text: `Trung bình ${dec(mean, 3)} g. Phần lớn sai lệch không do pipet (dung sai ±0,02 mL) mà do khối lượng riêng của nước ở 20 °C là ${dec(d, 4)} g/mL: 10 mL nước nặng ${dec(10 * d, 3)} g.` });
    this.#note('gc-weigh', 'nước 10 mL', `${dec(g)} g`);
    return { ok: true, grams: g, events };
  }

  precip({ anion = 'CO3' }) {
    const P = this.data.precip[anion];
    if (!P) return { ok: false, events: [{ type: 'warning', text: `Không có thuốc thử "${anion}".` }] };
    const nCa = 0.2 * 0.010;
    const nX = P.c * 0.010;
    const [a, b] = P.ratio; // aCa + bX
    const nP = Math.min(nCa / a, nX / b);
    const grams = nP * this.data.M[P.key];
    // Cl⁻ trong dung dịch: toàn bộ Cl⁻ của 10 mL CaCl₂ 0,2 M ở trong 20 mL
    this.ppt = { anion, grams, cl: (2 * nCa) / 0.020, filtered: false, washes: 0, fold: null, paper: null };
    this.#note('gc-precip', P.product, `${dec(grams * 1000, 0)} mg (lý thuyết)`);
    return { ok: true, grams, events: [
      { type: 'machine', label: 'Kết tủa', text: `Pipet 10 mL CaCl₂ 0,2 M vào cốc, tráng pipet bằng nước cất 3 lần rồi hút 10 mL ${P.reagent} cho từ từ vào, khuấy, để yên 3–5 phút: ${P.look}.` },
      { type: 'effect', label: 'Phương trình', text: `${P.eq}. Lượng ${P.product} lý thuyết ${dec(grams * 1000, 0)} mg (tính theo chất thiếu).` },
    ] };
  }

  // fold: 'fluted' giấy gấp rãnh (lọc nhanh) | 'cone' gấp côn; paper: 'below' mép giấy thấp hơn mép phễu 3–5 mm | 'above'
  filter({ fold = 'fluted', paper = 'below' }) {
    const pp = this.ppt;
    if (!pp) return { ok: false, events: [{ type: 'warning', text: 'Chưa có kết tủa để lọc.' }] };
    pp.filtered = true;
    pp.fold = fold;
    pp.paper = paper;
    const slow = this.data.precip[pp.anion].slow;
    const minutes = Math.round((fold === 'fluted' ? 2 : 5) * slow); // minh hoạ: giấy gấp rãnh có diện tích lọc lớn hơn
    const events = [{ type: 'machine', label: 'Lọc', text: `Giấy lọc ${fold === 'fluted' ? 'gấp rãnh' : 'gấp côn'} đặt trong phễu, tia nước cất cho giấy áp sát, cuống phễu đầy nước; rót theo đũa thuỷ tinh. Lọc hết khoảng ${minutes} phút.` }];
    const ok = paper === 'below';
    if (!ok) events.push({ type: 'warning', label: 'Mép giấy', text: 'Mép giấy cao hơn mép phễu: dung dịch thấm theo phần giấy thò ra ngoài, kết tủa lọt xuống nước lọc. Mép giấy phải thấp hơn mép phễu khoảng 0,5 cm.' });
    this.#note('gc-filter', this.data.precip[pp.anion].product, `${fold === 'fluted' ? 'gấp rãnh' : 'gấp côn'}, ${minutes} phút`);
    return { ok, minutes, events };
  }

  // Mỗi lần rửa: nước còn giữ trên giấy và kết tủa (retainMl) pha loãng với nước rửa mới (washMl)
  wash({ times = 3 }) {
    const pp = this.ppt;
    if (!pp?.filtered) return { ok: false, events: [{ type: 'warning', text: 'Lọc kết tủa trước khi rửa.' }] };
    const W = this.data.wash;
    pp.washes += Number(times);
    const c = pp.cl * (W.retainMl / (W.retainMl + W.washMl)) ** pp.washes;
    const look = c >= W.turbidM ? 'đục trắng AgCl' : c >= W.faintM ? 'hơi đục mờ' : 'trong suốt';
    const clean = c < W.faintM;
    this.#note('gc-wash', `${pp.washes} lần rửa`, look);
    return { ok: true, clean, washes: pp.washes, chloride: c, events: [
      { type: 'machine', label: 'Rửa', text: `Rửa kết tủa trên giấy lọc bằng nước cất thêm ${times} lần (tổng ${pp.washes} lần). Hứng 3–5 giọt nước rửa ở cuống phễu vào ống nghiệm, thêm 1–2 giọt AgNO₃: ${look}.` },
      { type: clean ? 'effect' : 'warning', label: clean ? 'Đã sạch Cl⁻' : 'Còn Cl⁻', text: clean ? 'Nước rửa không còn tạo AgCl thấy được: kết tủa đã sạch Cl⁻.' : 'Ag⁺ + Cl⁻ → AgCl↓ trắng: kết tủa còn NaCl bám, phải rửa tiếp.' },
    ] };
  }

  // ---- Bài 2: pha dung dịch ----
  // solution: 'oxalic' (chuẩn gốc), 'NaOH', 'HCl', 'KMnO4'; balance: 'analytical' | 'technical'; fill: 'mark' | 'over'
  prep({ solution = 'oxalic', balance = 'analytical', fill = 'mark' }) {
    const M = this.data.M;
    const events = [];
    let ok = fill === 'mark';
    if (solution === 'oxalic') {
      // Cân khoảng 0,788 g, cân phân tích đọc 3 số lẻ; cân kỹ thuật chỉ 2 số
      const target = 0.788;
      const trueG = target + 0.002 * this.random.normal();
      const read = balance === 'analytical' ? Math.round(trueG * 1000) / 1000 : Math.round(trueG * 100) / 100;
      const vol = fill === 'mark' ? 250 + 0.05 * this.random.normal() : 252 + this.random();
      const c = trueG / M.oxalic / (vol / 1000);
      const cWritten = read / M.oxalic / 0.25;
      this.sol.oxalic = { c, written: cWritten };
      events.push({ type: 'machine', label: 'Oxalic acid', text: `Cân ${balance === 'analytical' ? dec(read, 3) : dec(read, 2)} g H₂C₂O₄·2H₂O (M = ${dec(M.oxalic, 2)}) trên cân ${balance === 'analytical' ? 'phân tích' : 'kỹ thuật'}, chuyển qua phễu vào bình định mức 250,0 mL, tráng cốc cân 3 lần, thêm nước, lắc tan rồi thêm tới vạch: ghi C = ${sig(cWritten)} M.` });
      if (balance !== 'analytical') { ok = false; events.push({ type: 'warning', label: 'Cân kỹ thuật', text: 'Cân kỹ thuật chỉ đọc tới 0,01 g: với 0,79 g sai số tương đối tới khoảng 0,6 %, không đủ cho dung dịch chuẩn 4 chữ số có nghĩa.' }); }
    } else if (solution === 'NaOH') {
      // NaOH rắn hút ẩm và CO₂: lượng NaOH thật thấp hơn lượng cân (minh hoạ 1–5 %)
      const g = Math.round((0.2 + 0.01 * this.random.normal()) * 100) / 100;
      const purity = 0.95 + 0.04 * this.random();
      this.sol.NaOH = { c: (g * purity) / M.NaOH / 0.1, rinsedWith: null };
      events.push({ type: 'machine', label: 'NaOH', text: `Cân nhanh ${dec(g)} g NaOH trên cân kỹ thuật, hoà trong cốc chịu nhiệt (toả nhiệt), để nguội rồi thêm nước tới 100 mL: khoảng 0,05 M, phải chuẩn lại bằng oxalic acid.` });
      events.push({ type: 'effect', label: 'Vì sao phải chuẩn lại', text: 'NaOH rắn hút ẩm và CO₂ trong không khí nên khối lượng cân không đúng lượng NaOH thật; NaOH không phải chất gốc.' });
    } else if (solution === 'HCl') {
      const c = 0.05 * (0.96 + 0.08 * this.random());
      this.sol.HCl = { c };
      events.push({ type: 'machine', label: 'HCl', text: 'Tính từ HCl 37 % (d = 1,19 g/mL, khoảng 12,1 M) và HCl (1+1) khoảng 6 M; cho nước cất tới khoảng nửa bình định mức 100 mL, thêm HCl, thêm nước tới vạch: HCl khoảng 0,05 M, chưa biết chính xác.' });
    } else if (solution === 'KMnO4') {
      // KMnO₄ bị khử chậm bởi chất hữu cơ trong nước: nồng độ thật thấp hơn tính toán (minh hoạ 1–4 %)
      const c = 0.004 * (0.96 + 0.03 * this.random());
      this.sol.KMnO4 = { c };
      events.push({ type: 'machine', label: 'KMnO₄', text: 'Pipet 4 mL KMnO₄ 0,1 M vào bình định mức 100,0 mL có sẵn khoảng nửa bình nước, thêm nước tới vạch: khoảng 0,004 M, phải chuẩn lại bằng oxalic acid.' });
    } else return { ok: false, events: [{ type: 'warning', text: `Không có dung dịch "${solution}".` }] };
    if (fill !== 'mark') events.push({ type: 'warning', label: 'Quá vạch', text: 'Thêm nước quá vạch mức: nồng độ thật thấp hơn nồng độ ghi trên bình, phải pha lại (không được hút bớt ra).' });
    this.#note('gc-prep', solution, fill === 'mark' ? 'tới vạch' : 'quá vạch');
    return { ok, events };
  }

  // ---- Bài 2: chuẩn độ ----
  // pH của dung dịch chứa HCl, oxalic acid, Na⁺ (mol) trong V mL, từ cân bằng điện tích (chia đôi trên log[H⁺])
  pHof({ hcl = 0, ox = 0, na = 0, V }) {
    const L = V / 1000;
    const [p1, p2] = this.data.pKa.oxalic;
    const K1 = 10 ** -p1;
    const K2 = 10 ** -p2;
    const f = (h) => h + na / L - KW / h - hcl / L - (ox / L) * ((K1 * h + 2 * K1 * K2) / (h * h + K1 * h + K1 * K2));
    let lo = -14;
    let hi = 1;
    for (let k = 0; k < 60; k++) {
      const mid = (lo + hi) / 2;
      if (f(10 ** mid) > 0) hi = mid;
      else lo = mid;
    }
    return -(lo + hi) / 2;
  }

  // analyte: 'oxalic' | 'HCl'; indicator: 'pp' | 'mo'; rinse: tráng buret bằng NaOH; wait: đợi màu bền 30 giây
  titrate({ analyte = 'oxalic', indicator = 'pp', rinse = true, wait = true }) {
    const S = this.sol;
    if (!S.NaOH) return { ok: false, events: [{ type: 'warning', text: 'Chưa pha NaOH để nạp buret.' }] };
    if (!S[analyte]) return { ok: false, events: [{ type: 'warning', text: `Chưa pha dung dịch ${analyte === 'oxalic' ? 'oxalic acid chuẩn' : 'HCl'}.` }] };
    const I = this.data.indicators[indicator];
    // Nước còn trong buret khi không tráng bằng NaOH làm loãng dung dịch chuẩn (minh hoạ 2 %)
    const cB = S.NaOH.c * (rinse ? 1 : 0.98);
    const va = this.#pipet();
    const nA = S[analyte].c * (va / 1000);
    const sample = analyte === 'oxalic' ? { ox: nA } : { hcl: nA };
    const ph = (vb) => this.pHof({ ...sample, na: cB * (vb / 1000), V: va + vb + 0.15 });
    // Thể tích NaOH tới khi chỉ thị đổi màu (pH tăng đơn điệu theo thể tích)
    let lo = 0;
    let hi = 60;
    for (let k = 0; k < 50; k++) { const mid = (lo + hi) / 2; if (ph(mid) >= I.end) hi = mid; else lo = mid; }
    const vEnd = hi;
    const vEq = (nA * (analyte === 'oxalic' ? 2 : 1)) / cB * 1000;
    // Nhỏ từng giọt tới khi đổi màu; không đợi 30 giây thì dừng ở màu hồng thoáng qua (sớm 0,1–0,4 mL, minh hoạ)
    let reading = Math.ceil(vEnd / DROP) * DROP + 0.01 * this.random.normal();
    if (!wait) reading -= 0.1 + 0.3 * this.random();
    reading = Math.round(reading * 100) / 100;
    const points = [];
    for (let v = 0; v <= Math.max(reading, vEq) + 3; v += 0.25) points.push([v, ph(v)]);
    this.trials.push({ analyte, indicator, reading, rinse, wait });
    const n = this.trials.filter((t) => t.analyte === analyte && t.indicator === indicator).length;
    const events = [{ type: 'machine', label: `Lần ${n}`, text: `Pipet 10,00 mL ${analyte === 'oxalic' ? 'oxalic acid chuẩn' : 'HCl'} vào bình nón, thêm 2–3 giọt ${I.name}, nhỏ NaOH từ buret vừa nhỏ vừa lắc tới khi ${I.from} chuyển ${I.to}${indicator === 'pp' && wait ? ' bền 30 giây' : ''}: V = ${dec(reading)} mL.` }];
    let ok = rinse && wait;
    if (analyte === 'oxalic' && indicator === 'mo') { ok = false; events.push({ type: 'warning', label: 'Sai chỉ thị', text: `Oxalic acid có hai nấc (pKa ${dec(this.data.pKa.oxalic[0])} và ${dec(this.data.pKa.oxalic[1])}): methyl orange đổi màu ở pH khoảng 4, lúc nấc thứ hai mới trung hoà được một phần, nên dừng sớm. Điểm tương đương thứ hai ở pH khoảng 8: phải dùng phenolphthalein.` }); }
    if (!rinse) events.push({ type: 'warning', label: 'Chưa tráng buret', text: 'Buret chỉ tráng nước cất: nước còn bám làm loãng NaOH, tốn nhiều NaOH hơn, nồng độ tính ra sai. Tráng thêm 1 lần bằng 3–5 mL NaOH.' });
    if (!wait) events.push({ type: 'warning', label: 'Dừng sớm', text: 'Màu hồng xuất hiện tại chỗ giọt rơi rồi mất khi lắc: chưa tới điểm cuối. Phải đợi màu bền 30 giây.' });
    if (analyte === 'HCl') events.push({ type: 'effect', label: 'Bước nhảy pH', text: `HCl là acid mạnh: bước nhảy pH quanh điểm tương đương trải từ khoảng 4 đến 10, nên cả methyl orange (${dec(I.range[0], 1)}–${dec(I.range[1], 1)}) và phenolphthalein đều cho kết quả gần nhau.` });
    this.#note('gc-titrate', `${analyte} · ${I.name}`, `${dec(reading)} mL`);
    return { ok, reading, vEq, points, events };
  }

  // Chuẩn độ KMnO₄ bằng oxalic acid chuẩn: 2MnO₄⁻ + 5H₂C₂O₄ + 6H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O. heat: đun 60–70 °C; acid: thêm 5 mL H₂SO₄ 20 %
  redox({ heat = true, acid = true, rinse = true }) {
    const S = this.sol;
    if (!S.KMnO4 || !S.oxalic) return { ok: false, events: [{ type: 'warning', text: 'Cần pha oxalic acid chuẩn và KMnO₄ trước.' }] };
    const cK = S.KMnO4.c * (rinse ? 1 : 0.98);
    const nOx = S.oxalic.c * (this.#pipet() / 1000);
    // Trong acid mạnh MnO₄⁻ nhận 5e (Mn²⁺); thiếu acid thành MnO₂ nâu, chỉ nhận 3e (harris)
    const e = acid ? 5 : 3;
    const vEq = ((2 * nOx) / e / cK) * 1000;
    let reading = Math.ceil(vEq / DROP) * DROP + DROP + 0.01 * this.random.normal();
    const events = [];
    let ok = heat && acid && rinse;
    if (!heat) {
      // Nguội: phản ứng chậm, màu tím mất chậm nên dễ nhỏ quá điểm cuối (minh hoạ 0,3–0,8 mL)
      reading += 0.3 + 0.5 * this.random();
      events.push({ type: 'warning', label: 'Chưa đun', text: 'Ở nhiệt độ phòng phản ứng với oxalat rất chậm lúc đầu (Mn²⁺ sinh ra mới xúc tác cho phản ứng nhanh dần): màu tím mất chậm, dễ nhỏ quá điểm cuối. Đun bình tới 60–70 °C trước khi chuẩn độ.' });
    }
    if (!acid) events.push({ type: 'warning', label: 'Thiếu acid', text: 'Không thêm H₂SO₄: MnO₄⁻ bị khử thành MnO₂ kết tủa nâu (nhận 3 electron thay vì 5), dung dịch vẩn nâu, không thấy điểm cuối, tính theo tỉ lệ 2 : 5 sẽ sai.' });
    if (!rinse) events.push({ type: 'warning', label: 'Chưa tráng buret', text: 'Buret chưa tráng bằng KMnO₄: dung dịch bị loãng, kết quả sai.' });
    reading = Math.round(reading * 100) / 100;
    this.trials.push({ analyte: 'KMnO4', indicator: 'self', reading, rinse, heat, acid });
    const n = this.trials.filter((t) => t.analyte === 'KMnO4').length;
    events.unshift({ type: 'machine', label: `Lần ${n}`, text: `Pipet 10,00 mL oxalic acid chuẩn vào bình nón${acid ? ', thêm 5 mL H₂SO₄ 20 %' : ''}${heat ? ', đun tới 60–70 °C' : ''}; nhỏ từng giọt KMnO₄ vừa nhỏ vừa lắc tới khi ${acid ? 'xuất hiện màu tím hồng nhạt bền 30 giây' : 'dung dịch vẩn nâu'}: V = ${dec(reading)} mL. KMnO₄ tự làm chỉ thị: MnO₄⁻ tím, Mn²⁺ gần như không màu.` });
    this.#note('gc-redox', 'KMnO₄', `${dec(reading)} mL`);
    return { ok, reading, vEq, events };
  }

  // ---- Bài 9: cân bằng hoá học, Le Chatelier ----
  // pH của dung dịch có một cặp acid – base yếu: acid trung hoà HA (acetic, tổng ca mol) hoặc acid cation BH⁺ (NH₄⁺,
  // tổng cb mol), cation mạnh na và anion mạnh cl (mol), trong V mL; giải cân bằng điện tích
  pHweak({ ca = 0, cb = 0, na = 0, cl = 0, V }) {
    const L = V / 1000;
    const Ka = 10 ** -this.data.pKa.acetic;
    const Kb = 10 ** -this.data.pKa.NH4;
    const f = (h) => h + na / L + ((cb / L) * h) / (h + Kb) - KW / h - cl / L - ((ca / L) * Ka) / (h + Ka);
    let lo = -14;
    let hi = 1;
    for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (f(10 ** mid) > 0) hi = mid; else lo = mid; }
    return -(lo + hi) / 2;
  }

  #indicator(ind, pH) {
    const row = this.data.eq.indicatorColors[ind].find(([lim]) => pH < lim);
    return { color: row[1], name: row[2] };
  }

  // system: 'co' | 'acetic' | 'ammonia' | 'nacl'; add: chất thêm vào; temp: 'room' | 'hot' | 'cold'; indicator: 'mo' | 'pp'
  equilibrium({ system = 'co', add = 'none', temp = 'room', indicator = 'mo' }) {
    const E = this.data.eq;
    const V = E.drops * E.dropMl;
    const events = [];
    let ok = true;
    let tubes = [];
    if (system === 'co') {
      if (!['none', 'hcl', 'nh4cl'].includes(add)) return { ok: false, events: [{ type: 'warning', text: 'Ống CoCl₂ chỉ thêm HCl đặc hoặc NH₄Cl.' }] };
      // Mức chuyển dịch về phía CoCl₄²⁻ (thang định tính): Cl⁻ tăng thì dịch phải; nóng dịch phải, lạnh dịch trái (chiều thuận thu nhiệt);
      // hoà tan NH₄Cl thu nhiệt nên ngay sau khi lắc tan, ống lạnh đi (data/thermo.json: ΔH hoà tan 14,77 kJ/mol)
      // Nóng chuyển dịch mạnh hơn khi có nhiều Cl⁻ (thang định tính)
      const t = (cl) => (temp === 'hot' ? (cl ? 1.6 : 0.8) : temp === 'cold' ? -1 : 0);
      const score = (extra, cl) => Math.max(-1, Math.min(3, extra + t(cl)));
      const color = (v) => E.coColors.reduce((best, c) => (Math.abs(c[0] - v) < Math.abs(best[0] - v) ? c : best));
      const ref = color(score(0, false));
      const v = add === 'hcl' ? 2.6 : add === 'nh4cl' ? (temp === 'room' ? 0.6 : 1) : 0;
      const got = color(score(v, add !== 'none'));
      tubes = [{ label: 'ống đối chứng (chỉ CoCl₂)', color: ref[1], name: ref[2] }, { label: add === 'none' ? 'ống thử' : add === 'hcl' ? 'ống + HCl đặc' : 'ống + NH₄Cl bão hoà', color: got[1], name: got[2] }];
      events.push({ type: 'machine', label: 'CoCl₂', text: `10 giọt CoCl₂ 0,1 M${add === 'hcl' ? ' + 10 giọt HCl đặc' : add === 'nh4cl' ? ' + NH₄Cl tinh thể lắc tới bão hoà' : ''}${temp === 'hot' ? ', đặt vào cốc nước nóng' : temp === 'cold' ? ', chuyển ngay sang cốc nước lạnh' : ''}: ${got[2]} (ống đối chứng ${ref[2]}).` });
      events.push({ type: 'effect', label: 'Giải thích', text: `Co(H₂O)₆²⁺ (hồng) + 4Cl⁻ ⇌ CoCl₄²⁻ (xanh) + 6H₂O. ${add === 'hcl' ? 'Thêm Cl⁻ từ HCl đặc: cân bằng chuyển sang phải, dung dịch xanh lên.' : add === 'nh4cl' ? 'NH₄Cl thêm Cl⁻ nên cân bằng chuyển sang phải; nhưng hoà tan NH₄Cl thu nhiệt làm ống lạnh đi, đẩy ngược lại, nên ở nhiệt độ phòng màu chỉ đổi ít.' : 'Không thêm gì.'}${temp === 'hot' ? ' Chiều thuận thu nhiệt nên đun nóng làm cân bằng chuyển sang phải (xanh hơn).' : temp === 'cold' ? ' Làm lạnh làm cân bằng chuyển sang trái (hồng hơn).' : ''}` });
    } else if (system === 'acetic' || system === 'ammonia') {
      const acid = system === 'acetic';
      const n0 = 0.1 * (V / 1000);
      const allowed = acid ? ['none', 'acetate', 'naoh'] : ['none', 'nh4cl', 'zncl2'];
      if (!allowed.includes(add)) return { ok: false, events: [{ type: 'warning', text: acid ? 'Ống acetic acid thêm CH₃COONa hoặc NaOH.' : 'Ống NH₃ thêm NH₄Cl hoặc ZnCl₂.' }] };
      const salt = (E.crystalG / E.M[acid ? 'CH3COONa' : 'NH4Cl']);
      const before = acid ? this.pHweak({ ca: n0, V }) : this.pHweak({ cb: n0, V });
      let after;
      let Vt = V;
      if (add === 'none') after = before;
      else if (add === 'acetate') after = this.pHweak({ ca: n0 + salt, na: salt, V });
      else if (add === 'naoh') { Vt = V + E.fewDrops * E.dropMl; after = this.pHweak({ ca: n0, na: 1 * (E.fewDrops * E.dropMl) / 1000, V: Vt }); }
      else if (add === 'nh4cl') after = this.pHweak({ cb: n0 + salt, cl: salt, V });
      else after = null; // ZnCl₂: Zn²⁺ lấy OH⁻ tạo Zn(OH)₂ kết tủa (định tính)
      const i0 = this.#indicator(indicator, before);
      const i1 = after === null ? this.#indicator(indicator, 7) : this.#indicator(indicator, after);
      const iname = this.data.indicators[indicator].name;
      tubes = [{ label: 'trước', color: i0.color, name: i0.name }, { label: `sau khi thêm ${{ none: 'gì', acetate: 'CH₃COONa', naoh: 'NaOH', nh4cl: 'NH₄Cl', zncl2: 'ZnCl₂' }[add]}`, color: i1.color, name: i1.name, ppt: add === 'zncl2' }];
      events.push({ type: 'machine', label: acid ? 'Acetic acid' : 'NH₃', text: `15 giọt ${acid ? 'CH₃COOH' : 'NH₃'} 0,1 M + 1–2 giọt ${iname}: pH ${dec(before, 2)}, ${i0.name}.${add === 'none' ? '' : ` Thêm ${{ acetate: 'ít tinh thể CH₃COONa', naoh: 'vài giọt NaOH 1 M', nh4cl: 'ít tinh thể NH₄Cl, lắc tan', zncl2: '10 giọt ZnCl₂ 1 M' }[add]}: ${after === null ? 'kết tủa trắng Zn(OH)₂' : `pH ${dec(after, 2)}`}, ${i1.name}.`}` });
      events.push({ type: 'effect', label: 'Giải thích', text: acid ? `CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺ (pKa ${dec(this.data.pKa.acetic, 2)}). ${add === 'acetate' ? 'Thêm ion chung CH₃COO⁻: cân bằng chuyển sang trái, H₃O⁺ giảm.' : add === 'naoh' ? 'OH⁻ trung hoà H₃O⁺: cân bằng chuyển sang phải tới khi acid hết.' : ''}` : `NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ (pKa của NH₄⁺ ${dec(this.data.pKa.NH4, 2)}). ${add === 'nh4cl' ? 'Thêm ion chung NH₄⁺: cân bằng chuyển sang trái, OH⁻ giảm.' : add === 'zncl2' ? 'Zn²⁺ + 2OH⁻ → Zn(OH)₂↓ trắng, ít tan: OH⁻ giảm, cân bằng chuyển sang phải nhưng dung dịch không còn đủ OH⁻ để phenolphthalein hồng.' : ''}` });
      // Chỉ thị không đổi màu trong khoảng pH của thí nghiệm thì không thấy cân bằng chuyển dịch
      if (i0.name === i1.name && add !== 'none') {
        ok = false;
        events.push({ type: 'warning', label: 'Không thấy đổi màu', text: `${iname} có khoảng đổi màu pH ${this.data.indicators[indicator].range.map((x) => dec(x, 1)).join('–')}, không nằm trong khoảng pH trước và sau khi thêm chất, nên không thấy cân bằng chuyển dịch. Dùng ${acid ? 'methyl orange' : 'phenolphthalein'} như giáo trình.` });
      }
    } else if (system === 'nacl') {
      if (add !== 'hcl' && add !== 'none') return { ok: false, events: [{ type: 'warning', text: 'Ống NaCl bão hoà thêm HCl đặc.' }] };
      tubes = [{ label: 'NaCl bão hoà', color: null, name: 'trong suốt' }, { label: add === 'hcl' ? '+ HCl đặc' : 'không thêm', color: null, name: add === 'hcl' ? 'có tinh thể trắng' : 'trong suốt', ppt: add === 'hcl' }];
      events.push({ type: 'machine', label: 'NaCl', text: `10–15 giọt NaCl bão hoà${add === 'hcl' ? ' + ít HCl đặc: tinh thể NaCl trắng tách ra.' : '.'}` });
      events.push({ type: 'effect', label: 'Giải thích', text: 'NaCl(r) ⇌ Na⁺ + Cl⁻ trong dung dịch bão hoà. Thêm ion chung Cl⁻ (HCl đặc) làm cân bằng chuyển sang trái: NaCl kết tinh lại (hiệu ứng ion chung).' });
    } else return { ok: false, events: [{ type: 'warning', text: `Không có hệ "${system}".` }] };
    this.#note('gc-eq', system, tubes.map((t) => t.name).join(' → '));
    return { ok, tubes, events };
  }

  // ---- Bài 7: các yếu tố ảnh hưởng đến tốc độ phản ứng ----
  // Đồng hồ bấm tay: lệch theo mắt khi nhận mốc (tỉ lệ) và phản xạ (tuyệt đối), đọc tới 0,1 s
  #stopwatch(t) {
    const R = this.data.rate;
    return Math.max(1, Math.round((t * (1 + R.timerRel * this.random.normal()) + R.timerAbsS * this.random.normal()) * 10) / 10);
  }

  // Arrhenius: t = t_ref · exp(Ea/R · (1/T − 1/T_ref))
  #arrhenius(tRef, EaKJ, TrefC, TC) {
    return tRef * Math.exp(((EaKJ * 1000) / R_GAS) * (1 / (TC + 273.15) - 1 / (TrefC + 273.15)));
  }

  // tube: 1–5 theo bảng của giáo trình; cue: 'first' bắt đầu đục | 'opaque' đợi đục hẳn (sai); dry: ống khô hay còn nước
  rateConc({ tube = 1, cue = 'first', dry = true }) {
    const R = this.data.rate;
    const K = R.thio;
    const row = K.tubes[Number(tube) - 1];
    if (!row) return { ok: false, events: [{ type: 'warning', text: 'Bảng có 5 ống, chọn ống 1–5.' }] };
    const [vS, vW] = row;
    const wet = dry ? 0 : R.wetMl;
    const V = vS + vW + K.acidMl + wet;
    const c = (K.stockM * vS) / V;
    const cAcid = (K.acidM * K.acidMl) / V;
    const T = R.roomC;
    const tTrue = this.#arrhenius(K.tRefS * (K.cRefM / c) ** K.order, K.EaKJ, K.TrefC, T);
    const t = this.#stopwatch(cue === 'opaque' ? tTrue * R.opaqueFactor : tTrue);
    const ok = cue === 'first' && dry;
    this.rates.conc.push({ tube: Number(tube), c, cAcid, t, ok });
    const events = [
      { type: 'machine', label: `Ống ${tube}`, text: `Pipet ${dec(vS)} mL Na₂S₂O₃ 0,20 M${vW ? ` + ${dec(vW)} mL nước cất` : ''} vào ống nghiệm ${dry ? 'sạch, khô' : 'còn ướt'}; pipet 3,00 mL H₂SO₄ 0,20 M vào ống khác. Rót nhanh acid vào, lắc đều, bấm giờ tới khi ${cue === 'first' ? 'bắt đầu xuất hiện vẩn đục trắng sữa' : 'đục hẳn'}: Δt = ${dec(t, 1)} s.` },
      { type: 'effect', label: 'Kết quả', text: `Na₂S₂O₃ + H₂SO₄ → Na₂SO₄ + S↓ + SO₂ + H₂O. Sau khi trộn [Na₂S₂O₃] = ${sig(c, 3)} M, [H₂SO₄] = ${sig(cAcid, 3)} M; v = 1/Δt = ${sig(1 / t, 3)} s⁻¹.` },
    ];
    if (cue !== 'first') events.push({ type: 'warning', label: 'Sai mốc', text: 'Giáo trình bấm giờ tới lúc kết tủa bắt đầu xuất hiện. Đợi tới khi đục hẳn thì Δt dài hơn và mốc khó lặp lại giữa các ống.' });
    if (!dry) events.push({ type: 'warning', label: 'Ống ướt', text: `Nước còn trong ống (khoảng ${dec(wet, 1)} mL) làm loãng dung dịch: nồng độ thật thấp hơn nồng độ ghi trong bảng, phản ứng chậm hơn.` });
    this.#note('gc-rate-conc', `ống ${tube}, [Na₂S₂O₃] ${sig(c, 3)} M`, `${dec(t, 1)} s`);
    return { ok, c, t, events };
  }

  // dT: 0, 10, 20, 30 °C trên nhiệt độ phòng; soak: số phút ngâm hai ống trong máy điều nhiệt trước khi trộn
  rateTemp({ dT = 0, soak = 5 }) {
    const R = this.data.rate;
    const K = R.mno4;
    const d = Number(dT);
    const m = Number(soak);
    // Ống nghiệm trong nước ổn nhiệt tiến tới nhiệt độ đặt theo hàm mũ
    const T = R.roomC + d * (1 - Math.exp(-m / K.tauMin));
    const tTrue = this.#arrhenius(K.tRefS, K.EaKJ, K.TrefC, T);
    const t = this.#stopwatch(tTrue);
    const ok = d === 0 || m >= K.soakMin;
    this.rates.temp.push({ set: R.roomC + d, T, t, ok });
    const events = [
      { type: 'machine', label: `t phòng${d ? ` + ${d}` : ''} °C`, text: `2,0 mL KMnO₄ 0,01 M và 2,0 mL oxalic acid 0,10 M (trong H₂SO₄ 10 %) ở hai ống khô${d ? `, ngâm ${m} phút trong máy điều nhiệt đặt ${R.roomC + d} °C` : ''}. Đổ nhanh oxalic acid vào KMnO₄, lắc, bấm giờ tới khi mất màu tím, trong suốt: Δt = ${dec(t, 1)} s.` },
      { type: 'effect', label: 'Kết quả', text: `2KMnO₄ + 5H₂C₂O₄ + 3H₂SO₄ → K₂SO₄ + 2MnSO₄ + 10CO₂ + 8H₂O. Nhiệt độ thật trong ống ${dec(T, 1)} °C; lg(1/Δt) = ${dec(Math.log10(1 / t), 3)}.` },
    ];
    if (!ok) events.push({ type: 'warning', label: 'Ngâm chưa đủ', text: `Mới ngâm ${m} phút: dung dịch trong ống chỉ tới khoảng ${dec(T, 1)} °C, chưa bằng ${R.roomC + d} °C của máy điều nhiệt, nên Δt dài hơn và điểm trên đồ thị lệch. Giáo trình yêu cầu ngâm khoảng 5 phút.` });
    this.#note('gc-rate-temp', `${R.roomC + d} °C đặt, ${dec(T, 1)} °C thật`, `${dec(t, 1)} s`);
    return { ok, T, t, events };
  }

  // add: 'water' 3 giọt nước (đối chứng) | 'cuso4' 3 giọt CuSO₄ | 'mnso4' ít MnSO₄ (so sánh, chất xúc tác đã biết)
  rateCat({ add = 'water' }) {
    const R = this.data.rate;
    const C = R.cat;
    if (!['water', 'cuso4', 'mnso4'].includes(add)) return { ok: false, events: [{ type: 'warning', text: `Không có chất "${add}".` }] };
    // Không có nguồn đo tác dụng của Cu²⁺ nên Cu²⁺ không đổi tốc độ trong mô hình; Mn²⁺ là chất tự xúc tác đã biết
    const tTrue = C.tRefS * (add === 'mnso4' ? C.mnFactor : 1);
    const t = this.#stopwatch(tTrue);
    this.rates.cat.push({ add, t });
    const name = { water: '3 giọt nước cất', cuso4: '3 giọt CuSO₄ loãng', mnso4: 'vài tinh thể MnSO₄' }[add];
    const events = [{ type: 'machine', label: name, text: `2,0 mL oxalic acid 0,10 M (trong H₂SO₄ 20 %) + ${name}, thêm 3 giọt KMnO₄ 0,01 M, lắc đều; bấm giờ tới khi mất màu: Δt = ${dec(t, 1)} s.` }];
    const ref = this.rates.cat.find((r) => r.add === 'water');
    if (add !== 'water' && ref) {
      const ratio = ref.t / t;
      events.push({ type: 'effect', label: 'So với ống nước', text: `Ống nước ${dec(ref.t, 1)} s, ống này ${dec(t, 1)} s: Δt(nước)/Δt = ${dec(ratio, 2)}. ${add === 'mnso4' ? 'Mn²⁺ là chất xúc tác: Mn²⁺ bị oxy hoá thành Mn³⁺, Mn³⁺ oxy hoá oxalat rồi về Mn²⁺. Vì Mn²⁺ cũng là sản phẩm nên phản ứng tự xúc tác: lúc đầu chậm, sau nhanh dần.' : Math.abs(ratio - 1) < 0.15 ? 'Hai ống chênh nhau trong khoảng sai số bấm giờ. App chưa có nguồn đo tác dụng của Cu²⁺ lên phản ứng này nên coi như Cu²⁺ không đổi tốc độ. Chất xúc tác đã biết của phản ứng là Mn²⁺ (thử thêm MnSO₄ để so sánh).' : 'Chênh lệch lớn hơn sai số bấm giờ.'}` });
    } else if (add !== 'water') events.push({ type: 'info', label: 'Đối chứng', text: 'Làm thêm ống chỉ có 3 giọt nước cất để so sánh.' });
    this.#note('gc-rate-cat', name, `${dec(t, 1)} s`);
    return { ok: true, t, events };
  }

  // part: 'conc' v theo [Na₂S₂O₃] và bậc riêng | 'temp' lg(1/Δt) theo 1/T, γ và Ea
  ratePlot({ part = 'conc' }) {
    const lsq = (pts) => {
      const n = pts.length;
      const mx = pts.reduce((s, p) => s + p[0], 0) / n;
      const my = pts.reduce((s, p) => s + p[1], 0) / n;
      const b = pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0) / pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
      return { a: my - b * mx, b };
    };
    if (part === 'conc') {
      // Lần đo cuối của mỗi ống
      const byTube = new Map(this.rates.conc.map((r) => [r.tube, r]));
      const rows = [...byTube.values()].sort((a, b) => b.c - a.c);
      if (rows.length < 3) return { ok: false, events: [{ type: 'warning', text: 'Cần ít nhất 3 ống trong bảng để vẽ đồ thị.' }] };
      const points = rows.map((r) => [r.c, 1 / r.t]);
      const slope = points.reduce((s, p) => s + p[0] * p[1], 0) / points.reduce((s, p) => s + p[0] * p[0], 0); // đường qua gốc
      const order = lsq(points.map(([c, v]) => [Math.log10(c), Math.log10(v)])).b;
      const ok = rows.every((r) => r.ok);
      this.#note('gc-rate-plot', 'bậc riêng của Na₂S₂O₃', dec(order, 2));
      return { ok, part, points, fit: { a: 0, b: slope }, order, table: { head: ['Ống', '[Na₂S₂O₃] (M)', 'Δt (s)', 'v = 1/Δt (s⁻¹)'], rows: rows.map((r) => [String(r.tube), sig(r.c, 3), dec(r.t, 1), sig(1 / r.t, 3)]) }, events: [
        { type: 'machine', label: 'Đồ thị', text: `v = 1/Δt theo [Na₂S₂O₃] sau khi trộn (${rows.length} ống). Độ dốc lg v theo lg C là ${dec(order, 2)}: bậc riêng của Na₂S₂O₃ khoảng ${Math.round(order)}.` },
        { type: ok ? 'effect' : 'warning', label: 'Nhận xét', text: ok ? 'Các điểm nằm gần một đường thẳng qua gốc toạ độ: tốc độ tỉ lệ thuận với nồng độ Na₂S₂O₃ (bậc 1 theo mô hình đơn giản của app; tài liệu cho bậc khoảng 3/2 ở nồng độ thấp, chưa xác minh).' : 'Có ống đo sai cách (ống ướt hoặc sai mốc): điểm lệch khỏi đường thẳng, đo lại ống đó.' },
      ] };
    }
    if (part === 'temp') {
      const bySet = new Map(this.rates.temp.map((r) => [r.set, r]));
      const rows = [...bySet.values()].sort((a, b) => a.set - b.set);
      if (rows.length < 3) return { ok: false, events: [{ type: 'warning', text: 'Cần ít nhất 3 nhiệt độ để vẽ đồ thị.' }] };
      // Học sinh ghi nhiệt độ đặt của máy điều nhiệt, không phải nhiệt độ thật trong ống
      const pts = rows.map((r) => [1000 / (r.set + 273.15), Math.log10(1 / r.t)]);
      const f = lsq(pts);
      const Ea = (-f.b * 1000 * Math.LN10 * R_GAS) / 1000; // kJ/mol
      const gammas = rows.slice(1).map((r, i) => (rows[i].t / r.t) ** (10 / (r.set - rows[i].set)));
      const gamma = gammas.reduce((s, g) => s + g, 0) / gammas.length;
      const ok = rows.every((r) => r.ok) && gamma >= 2 && gamma <= 4;
      const xs = pts.map((p) => p[0]);
      const line = [Math.min(...xs), Math.max(...xs)].map((x) => [x, f.a + f.b * x]);
      this.#note('gc-rate-plot', 'hệ số nhiệt độ γ', dec(gamma, 2));
      return { ok, part, series: [{ name: 'đường thẳng khớp', points: line, kind: 'alt', legend: 'đường khớp' }, { name: 'đo', points: pts, kind: 'dots', legend: 'điểm đo' }], gamma, Ea, table: { head: ['T (K)', 'Δt (s)', '1/T (10⁻³ K⁻¹)', 'lg(1/Δt)'], rows: rows.map((r) => [dec(r.set + 273.15, 2), dec(r.t, 1), dec(1000 / (r.set + 273.15), 4), dec(Math.log10(1 / r.t), 3)]) }, events: [
        { type: 'machine', label: 'Đồ thị', text: `lg(1/Δt) theo 1/T gần một đường thẳng, độ dốc ${dec(f.b * 1000, 0)} K. Hệ số nhiệt độ γ = Δt(T)/Δt(T + 10) trung bình ${dec(gamma, 2)}; năng lượng hoạt hoá ước tính Ea = −2,303 · R · độ dốc ≈ ${dec(Ea, 0)} kJ/mol.` },
        { type: ok ? 'effect' : 'warning', label: 'Nhận xét', text: ok ? `Tăng 10 °C thì tốc độ tăng khoảng ${dec(gamma, 1)} lần, nằm trong khoảng 2–4 của quy tắc van 't Hoff. Ea mô hình dùng ${this.data.rate.mno4.EaKJ} kJ/mol (chưa xác minh).` : 'Có lần đo ngâm ống chưa đủ 5 phút: nhiệt độ thật thấp hơn nhiệt độ ghi, γ và Ea tính ra sai. Đo lại với thời gian ngâm đủ.' },
      ] };
    }
    return { ok: false, events: [{ type: 'warning', text: `Không có đồ thị "${part}".` }] };
  }

  // ---- Bài 4: định tính anion trong cùng dung dịch mẫu ----
  // test: 'PO4' | 'CO3' | 'S' | 'I' | 'Cl' | 'NO3'; slip: lỗi thao tác của bước đó (mặc định làm đúng)
  // 'nowait' không đun và để yên 15 phút (B1) hoặc không đợi I₃⁻ tạo thành (E1); 'touch' đũa chạm thành ống (C2);
  // 'nonh3' bỏ bước thử tan trong NH₃ (F2); 'noag2so4' bỏ kết tủa ion cản bằng Ag₂SO₄ (G1); 'shake' lắc ống làm xáo trộn hai lớp (G2)
  anionTest({ test = 'PO4', slip = 'none' }) {
    const A = this.data.anion;
    const I = A.ions[test];
    if (!I) return { ok: false, events: [{ type: 'warning', text: `Không có thí nghiệm cho "${test}".` }] };
    const SLIPS = { PO4: ['nowait'], I: ['nowait'], CO3: ['touch'], Cl: ['nonh3'], NO3: ['noag2so4', 'shake'], S: [] };
    const applies = slip !== 'none' && SLIPS[test].includes(slip);
    const run = (has) => {
      // Trả về { seen: thấy dấu hiệu dương tính, note: hiện tượng, color, ppt }
      if (test === 'PO4' || test === 'I') {
        if (has && applies) return { seen: false, note: test === 'PO4' ? 'chưa thấy kết tủa vàng (chưa đun, chưa để đủ 15 phút)' : 'màu xanh rất nhạt, khó nhận (I₃⁻ chưa kịp tạo thành)', color: test === 'I' ? '#c9d0e6' : null, ppt: false };
        return has ? { seen: true, note: I.pos, color: I.color, ppt: I.ppt } : { seen: false, note: I.neg, color: null, ppt: false };
      }
      if (test === 'CO3') {
        if (applies) return { seen: false, note: 'đầu đũa chạm thành ống dính acid: giọt Ca(OH)₂ bị trung hoà, không thấy đục', color: null, ppt: false };
        return has ? { seen: true, note: I.pos, color: null, ppt: true } : { seen: false, note: I.neg, color: null, ppt: false };
      }
      if (test === 'Cl') {
        // Không thử NH₃ thì kết tủa trắng ngà còn lẫn AgI (vàng nhạt) cũng bị coi là AgCl
        if (applies && !has && this.sample2.has('I')) return { seen: true, note: 'có kết tủa vàng nhạt (AgI còn sót), tưởng là AgCl', color: '#efe6b8', ppt: true };
        return has ? { seen: true, note: applies ? 'kết tủa trắng (chưa khẳng định bằng NH₃)' : I.pos, color: null, ppt: true } : { seen: false, note: I.neg, color: null, ppt: false };
      }
      if (test === 'NO3') {
        if (slip === 'shake') return { seen: false, note: 'lắc làm hai lớp trộn lẫn, dung dịch nóng lên, không thấy vòng nâu', color: '#e9e2cf', ppt: false };
        return has ? { seen: true, note: I.pos, color: I.color, ppt: false } : { seen: false, note: I.neg, color: null, ppt: false };
      }
      return has ? { seen: true, note: I.pos, color: I.color, ppt: I.ppt } : { seen: false, note: I.neg, color: null, ppt: false };
    };
    const s1 = run(true);
    const has2 = this.sample2.has(test);
    let s2 = run(has2);
    // Bỏ Ag₂SO₄: I⁻ hoặc S²⁻ còn trong mẫu bị H₂SO₄ đặc oxy hoá thành I₂ (nâu tím) hoặc S, tạo lớp màu giả vòng nâu
    const reducer2 = this.sample2.has('I') || this.sample2.has('S');
    if (test === 'NO3' && slip === 'noag2so4' && reducer2 && !has2) s2 = { seen: true, note: 'có lớp màu nâu tím ở mặt phân cách (I₂ hoặc S do H₂SO₄ đặc oxy hoá I⁻, S²⁻ chưa loại), dễ nhầm là vòng nâu', color: A.falseRing, ppt: false };
    this.anionSeen.set(test, s2.seen);
    const step = { PO4: 'B1: hoà tan kết tủa A2 bằng HNO₃ 6 M, thêm 1 mL (NH₄)₂MoO₄ 0,5 M, đun nhẹ trong nước ấm, để yên 15 phút', CO3: 'C2: thêm 3–5 giọt HNO₃ 6 M vào kết tủa A2, nhúng ngay đầu đũa đã nhúng Ca(OH)₂ bão hoà vào miệng ống, không chạm thành ống', S: 'D1: lấy dung dịch A2, thêm HNO₃ 6 M tới môi trường acid, thêm từng giọt Cu(NO₃)₂ 1 M, để yên 2 phút, ly tâm', I: 'E1: 1 mL dung dịch D1 + 5 giọt Fe(NO₃)₃ 0,2 M, khuấy, đợi 1–2 phút rồi thêm 2 giọt hồ tinh bột 1 %', Cl: 'F1–F2: thêm HNO₃ 6 M vào dung dịch E1, thêm từng giọt AgNO₃ 0,01 M, ly tâm; kết tủa thêm NH₃ 6 M rồi HNO₃ 6 M', NO3: 'G1–G2: 1,5 mL mẫu + NaOH 3 M tới kiềm, thêm Ag₂SO₄ bão hoà tới kết tủa hoàn toàn, ly tâm; 10 giọt nước lọc + H₂SO₄ 3 M + 0,5 mL FeSO₄ bão hoà, làm lạnh trong nước đá, nghiêng ống 45° nhỏ 0,5 mL H₂SO₄ đặc theo thành ống' }[test];
    const slipText = { nowait: 'không đợi đủ thời gian', touch: 'đũa chạm thành ống', nonh3: 'bỏ bước thử tan trong NH₃', noag2so4: 'bỏ bước kết tủa ion cản bằng Ag₂SO₄', shake: 'lắc ống làm xáo trộn hai lớp' }[slip];
    const events = [
      { type: 'machine', label: `Thí nghiệm ${I.test}`, text: `${step}${applies ? ` (${slipText})` : ''}. Mẫu 1: ${s1.note}. Mẫu 2: ${s2.note}.` },
      { type: 'effect', label: 'Phương trình', text: I.eq },
    ];
    const ok = !applies;
    if (applies) events.push({ type: 'warning', label: 'Sai thao tác', text: { nowait: test === 'PO4' ? 'Kết tủa amoni photphomolipdat tạo chậm, cần đun nhẹ và để yên 15 phút; không đợi thì mẫu có PO₄³⁻ vẫn ra âm tính giả.' : 'Fe³⁺ oxy hoá I⁻ thành I₃⁻ chậm trong 1–2 phút; thêm tinh bột ngay thì màu xanh quá nhạt, dễ kết luận nhầm.', touch: 'Giáo trình nhắc không để đầu đũa chạm thành ống: thành ống dính HNO₃, giọt Ca(OH)₂ bị trung hoà nên CO₂ không làm đục được.', nonh3: 'Chỉ AgCl tan trong NH₃ 6 M rồi kết tủa lại khi thêm HNO₃; AgI không tan. Bỏ bước này thì kết tủa vàng nhạt AgI còn sót có thể bị nhầm là AgCl.', noag2so4: 'G1 dùng Ag₂SO₄ để kết tủa các ion khác (I⁻, S²⁻, Cl⁻…) trước; I⁻ và S²⁻ còn lại bị H₂SO₄ đặc oxy hoá, tạo lớp màu giống vòng nâu, cho dương tính giả.', shake: 'H₂SO₄ đặc phải chìm thành lớp riêng; lắc làm hai lớp trộn lẫn, toả nhiệt mạnh, FeNO²⁺ bị phân huỷ nên không thấy vòng.' }[slip] });
    else if (slip !== 'none') events.push({ type: 'info', label: 'Không áp dụng', text: `Lỗi "${slipText}" không thuộc thí nghiệm ${I.test}, bỏ qua.` });
    this.#note('gc-an-test', `${I.name} (thí nghiệm ${I.test})`, `mẫu 1: ${s1.seen ? 'có' : 'không'}, mẫu 2: ${s2.seen ? 'có' : 'không'}`);
    const ring = test === 'NO3';
    return { ok, seen1: s1.seen, seen2: s2.seen, tubes: [{ label: 'Mẫu 1', color: s1.color, name: s1.seen ? 'dương tính' : 'âm tính', ppt: s1.ppt, ring }, { label: 'Mẫu 2', color: s2.color, name: s2.seen ? 'dương tính' : 'âm tính', ppt: s2.ppt, ring }], events };
  }

  // ions: chuỗi các anion người học kết luận có trong mẫu 2, ví dụ 'CO3,Cl,NO3'; bỏ trống thì lấy theo các thí nghiệm đã làm
  anionAnswer({ ions = null }) {
    const A = this.data.anion;
    const said = ions == null ? new Set([...this.anionSeen].filter(([, v]) => v).map(([k]) => k)) : new Set(String(ions).split(',').map((x) => x.trim()).filter(Boolean));
    const truth = this.sample2;
    const right = A.order.filter((k) => said.has(k) === truth.has(k));
    const ok = right.length === A.order.length;
    const fmt = (set) => A.order.filter((k) => set.has(k)).map((k) => A.ions[k].name).join(', ') || 'không có';
    const untested = A.order.filter((k) => !this.anionSeen.has(k));
    const events = [
      { type: 'machine', label: 'Kết luận', text: `Mẫu 2 có: ${fmt(said)}.` },
      { type: ok ? 'effect' : 'warning', label: ok ? 'Đúng' : 'Chưa đúng', text: ok ? `Đúng cả 6 anion. Thành phần mẫu 2: ${fmt(truth)}.` : `Đúng ${right.length}/6 anion. Thành phần thật của mẫu 2: ${fmt(truth)}.${untested.length ? ` Chưa làm thí nghiệm cho ${untested.map((k) => A.ions[k].name).join(', ')}.` : ''}` },
    ];
    this.#note('gc-an-answer', 'mẫu 2', `${right.length}/6 đúng`);
    return { ok, correct: right.length, truth: A.order.filter((k) => truth.has(k)), events };
  }

  // ---- Muối Mohr (NH₄)₂Fe(SO₄)₂·6H₂O ----
  // ethanol: mL cồn rửa tinh thể trên phễu Buchner (giáo trình 10 mL; rửa quá nhiều thì cồn kéo nước kết tinh)
  mohrSalt({ ethanol = 10 }) {
    const H = this.data.mohrLab;
    const many = Number(ethanol) > 10;
    this.mohr = { water: many ? H.waterEthanol : H.waterOk, washed: true, titr: [], ba: null };
    const events = [{ type: 'machine', label: 'Lọc, rửa', text: `Lọc tinh thể muối Mohr trên phễu Buchner, rửa bằng ${ethanol} mL cồn, để khô, cân, đóng gói. Tinh thể đơn tà xanh lục nhạt.` }];
    if (many) events.push({ type: 'warning', label: 'Rửa nhiều cồn', text: 'Rửa quá nhiều cồn kéo một phần nước kết tinh ra khỏi tinh thể: muối không còn đủ 6 H₂O, các phép phân tích sau sẽ cho công thức thiếu nước (báo cáo của nhóm sinh viên ra 5,67 H₂O vì lỗi này).' });
    this.#note('gc-mohr-salt', `rửa ${ethanol} mL cồn`, many ? 'mất một phần nước kết tinh' : 'đạt');
    return { ok: !many, events };
  }

  // reagent: naoh | bacl2 | air | h2o2 | kmno4 | k2cr2o7; salt: 'mohr' | 'feso4' (FeSO₄·7H₂O để so sánh)
  mohrQual({ reagent = 'naoh', salt = 'mohr' }) {
    const Q = this.data.mohrLab.qual[reagent];
    if (!Q) return { ok: false, events: [{ type: 'warning', text: `Không có thuốc thử "${reagent}".` }] };
    const nh3 = salt === 'mohr' ? 'chuyển xanh (pH 9–10) vì có NH₃ bay ra' : 'không đổi màu (pH 7), FeSO₄ không có NH₄⁺';
    const note = Q.note.replace('{nh3}', nh3);
    const tubes = [{ label: `dung dịch ${salt === 'mohr' ? 'muối Mohr' : 'FeSO₄'}`, color: '#d6e8cf', name: 'xanh lục nhạt' }, { label: `+ ${Q.label}: ${Q.name}`, color: Q.color, name: Q.short, ppt: Q.ppt }];
    const events = [{ type: 'machine', label: Q.label, text: `Vài hạt ${salt === 'mohr' ? 'muối Mohr' : 'FeSO₄·7H₂O'} hoà trong 1 mL nước, thêm ${Q.label}: ${Q.name}${note ? `; ${note}` : ''}.` }, { type: 'effect', label: 'Phương trình', text: Q.eq }];
    this.#note('gc-mohr-qual', `${salt}, ${Q.label}`, Q.name);
    return { ok: true, tubes, events };
  }

  #mohrMol(g) { const H = this.data.mohrLab; return g / (H.M.anhydrous + H.M.water * this.mohr.water); }

  // acid: thêm 5 mL H₂SO₄ (1:2); không acid hoá thì MnO₄⁻ thành MnO₂ nâu, Fe²⁺ còn bị không khí oxy hoá một phần
  mohrTitr({ acid = true }) {
    const H = this.data.mohrLab;
    const g = Math.round((H.grams + 0.0015 * this.random.normal()) * 10000) / 10000;
    const nFe = (this.#mohrMol(g) * H.aliquotTitr) / H.flaskMl;
    const eqFe = acid ? nFe : nFe * (1 - H.airLoss);
    // MnO₄⁻ nhận 5 e trong acid, 3 e thành MnO₂ khi trung tính (Harris): cần nhiều KMnO₄ hơn, điểm cuối bị MnO₂ che
    const V = (eqFe / H.normKMnO4) * 1000 * (acid ? 1 : 5 / 3);
    const read = Number((Math.round((V + 0.03 * this.random.normal()) / 0.05) * 0.05).toFixed(2));
    if (acid) this.mohr.titr.push({ g, V: read });
    const events = [{ type: 'machine', label: `Lần ${this.mohr.titr.length || 1}`, text: `Cân ${dec(g, 4)} g muối, hoà bằng nước đã acid hoá, định mức 100,00 mL. Pipet 10,00 mL${acid ? ' + 5 mL H₂SO₄ (1:2)' : ''}, chuẩn bằng KMnO₄ ${sig(H.normKMnO4, 3)} N tới hồng nhạt bền 30 giây: V = ${dec(read, 2)} mL.` },
      { type: 'effect', label: 'Phương trình', text: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O; KMnO₄ tự làm chỉ thị, không cần đun.' }];
    if (!acid) events.push({ type: 'warning', label: 'Thiếu acid', text: 'Không thêm H₂SO₄: MnO₄⁻ chỉ nhận 3 electron, tạo MnO₂ nâu che điểm cuối; Fe²⁺ trong dung dịch trung tính còn bị không khí oxy hoá. Lần này không tính.' });
    this.#note('gc-mohr-titr', `${dec(g, 4)} g${acid ? '' : ', không acid'}`, `${dec(read, 2)} mL`);
    return { ok: acid, V: read, events };
  }

  // aging: già hoá kết tủa 15–20 phút trên bếp; wash: rửa nước nóng rồi cồn
  mohrBa({ aging = true, wash = true }) {
    const H = this.data.mohrLab;
    const g = this.mohr.titr[0]?.g ?? H.grams;
    const nSO4 = (2 * this.#mohrMol(g) * H.aliquotBa) / H.flaskMl;
    let m = nSO4 * H.M.BaSO4 * (aging ? 1 : 1 - H.fineLoss) * (wash ? 1 : 1 + H.bacl2Gain);
    m = Math.round((m + 0.0008 * this.random.normal()) * 1000) / 1000;
    this.mohr.ba = { m, g, ok: aging && wash };
    const events = [{ type: 'machine', label: 'BaSO₄', text: `50,00 mL dung dịch + 25,0 mL BaCl₂ 0,50 M (dư), ${aging ? 'già hoá trên bếp 15–20 phút, ' : ''}lọc nóng qua giấy đã cân bì${wash ? ', rửa 2 × 10 mL nước nóng rồi 5 mL cồn' : ''}, sấy 120 °C 45 phút: m(BaSO₄) = ${dec(m, 3)} g.` },
      { type: 'effect', label: 'Tính', text: `n(SO₄²⁻) trong 100 mL = 2 × m/233,39 = ${sig((2 * m) / H.M.BaSO4, 4)} mol.` }];
    if (!aging) events.push({ type: 'warning', label: 'Không già hoá', text: 'Kết tủa vừa tạo còn hạt rất mịn, một phần lọt qua giấy lọc: khối lượng BaSO₄ thấp.' });
    if (!wash) events.push({ type: 'warning', label: 'Không rửa', text: 'BaCl₂ dư bám trên kết tủa và giấy lọc: khối lượng cân được cao hơn thật.' });
    this.#note('gc-mohr-ba', `${aging ? 'già hoá' : 'không già hoá'}, ${wash ? 'rửa' : 'không rửa'}`, `${dec(m, 3)} g`);
    return { ok: aging && wash, m, events };
  }

  mohrFormula() {
    const H = this.data.mohrLab;
    const T = this.mohr.titr;
    const B = this.mohr.ba;
    if (!T.length || !B) return { ok: false, events: [{ type: 'warning', text: 'Cần ít nhất một lần chuẩn độ Fe²⁺ và kết quả BaSO₄.' }] };
    const g = T[0].g;
    const V = T.reduce((s, t) => s + t.V, 0) / T.length;
    const nFe = (H.normKMnO4 * V) / 1000 * (H.flaskMl / H.aliquotTitr);
    const nSO4 = (2 * B.m) / H.M.BaSO4;
    const nNH4 = 2 * nSO4 - 2 * nFe;
    const mWater = g - (nNH4 * H.M.NH4 + nFe * H.M.Fe + nSO4 * H.M.SO4);
    const z = mWater / H.M.water / nFe;
    const x = nNH4 / nFe;
    const y = nSO4 / nFe;
    const ok = Math.abs(z - 6) < 0.15 && B.ok && this.mohr.water === H.waterOk;
    const events = [{ type: 'machine', label: 'Công thức', text: `n(Fe²⁺) = N·V·10 = ${sig(nFe, 4)} mol; n(SO₄²⁻) = ${sig(nSO4, 4)} mol; n(NH₄⁺) = 2n(SO₄²⁻) − 2n(Fe²⁺) (bảo toàn điện tích) = ${sig(nNH4, 4)} mol; nước = phần khối lượng còn lại. Công thức thực nghiệm (NH₄)${dec(x, 2)}Fe(SO₄)${dec(y, 2)}·${dec(z, 2)}H₂O.` },
      { type: ok ? 'effect' : 'warning', label: ok ? 'Đúng công thức' : 'Lệch công thức', text: ok ? 'Gần đúng (NH₄)₂Fe(SO₄)₂·6H₂O.' : `Lệch so với (NH₄)₂Fe(SO₄)₂·6H₂O.${this.mohr.water !== H.waterOk ? ' Tinh thể đã mất một phần nước kết tinh khi rửa nhiều cồn.' : ''}${!B.ok ? ' Phần khối lượng BaSO₄ sai (không già hoá hoặc không rửa) kéo theo n(SO₄²⁻), n(NH₄⁺) và lượng nước sai.' : ''}` }];
    this.#note('gc-mohr-formula', `${T.length} lần chuẩn độ`, `·${dec(z, 2)}H₂O`);
    return { ok, x, y, z, table: { head: ['Đại lượng', 'Giá trị'], rows: [['V(KMnO₄) trung bình (mL)', dec(V, 3)], ['n(Fe²⁺) (mol)', sig(nFe, 4)], ['m(BaSO₄) (g)', dec(B.m, 3)], ['n(SO₄²⁻) (mol)', sig(nSO4, 4)], ['n(NH₄⁺) (mol)', sig(nNH4, 4)], ['Số H₂O', dec(z, 2)]] }, events };
  }

  // ---- Bài 5A: nhiệt hoà tan đo bằng nhiệt lượng kế ----
  // salt: 'KNO3' | 'KCl'; grams: lượng cân; stuck: muối dính thành ămpun (sai)
  calRun({ salt = 'KNO3', grams = salt === 'KNO3' ? 7 : 6, stuck = false }) {
    const C = this.data.calorimeter;
    if (!C.M[salt]) return { ok: false, events: [{ type: 'warning', text: `Không có muối "${salt}".` }] };
    const g = Math.round((Number(grams) + 0.002 * this.random.normal()) * 10000) / 10000; // cân phân tích 4 số lẻ
    const Ck = C.waterG * C.cpWater + C.vesselJK; // J/K
    const n0 = (g / C.M[salt]) * (stuck ? 1 - C.stuckFrac : 1);
    const dH = C.dH[salt] * 1000; // J/mol, dương: thu nhiệt
    const room = C.roomC;
    let T = room + C.waterOffsetC;
    let n = 0; // mol đã tan
    const k = C.leakPerMin / 60;
    const stir = C.stirKPerMin / 60;
    const step = (secs, dissolving) => {
      for (let i = 0; i < secs; i++) {
        let dn = 0;
        if (dissolving) { dn = (n0 - n) / C.tau[salt]; n += dn; }
        T += -k * (T - room) + stir - (dn * dH) / Ck;
      }
    };
    const read = () => Math.round((T + 0.003 * this.random.normal()) / C.resolution) * C.resolution;
    const pts = [];
    let t = 0;
    step(180, false); // khuấy đều 3 phút trước khi ghi
    for (let i = 0; i < C.pre.points; i++) { step(C.pre.every, false); t += C.pre.every; pts.push([t, read()]); }
    const tB = t;
    let calm = 0;
    let mainPts = 0;
    while (mainPts < C.main.maxPoints) {
      const before = pts.at(-1)[1];
      step(C.main.every, true); t += C.main.every; pts.push([t, read()]); mainPts++;
      calm = Math.abs(pts.at(-1)[1] - before) <= C.resolution ? calm + 1 : 0;
      if (mainPts >= 6 && calm >= 3) break;
    }
    const tD = t;
    for (let i = 0; i < C.post.points; i++) { step(C.post.every, true); t += C.post.every; pts.push([t, read()]); }
    const corr = this.#dickinson(pts, tB, tD);
    const raw = pts.at(-1 - C.post.points)[1] - pts[C.pre.points - 1][1];
    const ideal = -(n0 * dH) / Ck;
    this.calRuns[salt] = { g, dt: corr.dt, raw, stuck, ideal };
    this.#note('gc-cal-run', `${salt} ${dec(g, 4)} g`, `Δt hiệu chỉnh ${dec(corr.dt, 3)} °C`);
    const fmtT = (v) => dec(v, 2);
    const events = [
      { type: 'machine', label: salt === 'KNO3' ? 'KNO₃' : 'KCl', text: `250 mL nước cất trong bình nhiệt lượng kế, ${dec(g, 4)} g ${salt === 'KNO3' ? 'KNO₃' : 'KCl'} nghiền nhỏ trong ămpun. Giai đoạn đầu ${C.pre.points} điểm (30 giây một lần) từ ${fmtT(pts[0][1])} tới ${fmtT(pts[C.pre.points - 1][1])} °C; chọc thủng ămpun, giai đoạn chính ${mainPts} điểm (10 giây một lần); giai đoạn cuối ${C.post.points} điểm, kết thúc ở ${fmtT(pts.at(-1)[1])} °C.` },
      { type: 'effect', label: 'Δt', text: `Kéo dài hai đoạn thẳng ab và de, kẻ đường thẳng đứng ở t = ${dec(corr.tC, 0)} s sao cho hai phần diện tích bằng nhau: Δt = cc′ = ${dec(corr.dt, 3)} °C (hiệu nhiệt độ đọc thẳng ${dec(raw, 2)} °C).` },
    ];
    if (stuck) events.push({ type: 'warning', label: 'Muối dính thành ămpun', text: 'Một phần muối dính lại thành ămpun, không rơi vào nước: lượng muối thật đã tan ít hơn lượng cân, nên |Δt| nhỏ hơn và kết quả tính sai.' });
    const lines = [[pts[0][0], corr.L1(pts[0][0])], [corr.tC, corr.L1(corr.tC)], [corr.tC, corr.L2(corr.tC)], [pts.at(-1)[0], corr.L2(pts.at(-1)[0])]];
    return { ok: !stuck, dt: corr.dt, series: [{ name: 'đường ngoại suy, cc′', points: lines, kind: 'alt', legend: 'ngoại suy, cc′' }, { name: 'nhiệt độ', points: pts, kind: 'dots', legend: 'nhiệt độ đo' }], events };
  }

  // Hiệu chỉnh trao đổi nhiệt bằng đồ thị (hình 5.2): đường thẳng ab (trước tB) và de (sau tD), điểm C giữa B và D sao cho
  // diện tích giữa đường cong với ab (từ B tới C) bằng diện tích giữa đường cong với de (từ C tới D)
  #dickinson(pts, tB, tD) {
    const fit = (sel) => {
      const n = sel.length;
      const mx = sel.reduce((s, p) => s + p[0], 0) / n;
      const my = sel.reduce((s, p) => s + p[1], 0) / n;
      const b = sel.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0) / sel.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
      return (t) => my + b * (t - mx);
    };
    const L1 = fit(pts.filter((p) => p[0] <= tB));
    const L2 = fit(pts.filter((p) => p[0] >= tD));
    const mid = pts.filter((p) => p[0] >= tB && p[0] <= tD);
    const area = (f, a, b) => {
      let s = 0;
      for (let i = 1; i < mid.length; i++) {
        const [t0, y0] = mid[i - 1];
        const [t1, y1] = mid[i];
        const lo = Math.max(a, t0);
        const hi = Math.min(b, t1);
        if (hi <= lo) continue;
        const yAt = (t) => y0 + ((y1 - y0) * (t - t0)) / (t1 - t0);
        s += ((yAt(lo) - f(lo) + yAt(hi) - f(hi)) / 2) * (hi - lo);
      }
      return s;
    };
    let lo = tB;
    let hi = tD;
    for (let k = 0; k < 50; k++) {
      const c = (lo + hi) / 2;
      // Phần trước C: đường cong lệch khỏi ab; phần sau C: đường cong lệch khỏi de (dấu ngược)
      const g = Math.abs(area(L1, tB, c)) - Math.abs(area(L2, c, tD));
      if (g > 0) hi = c; else lo = c;
    }
    const tC = (lo + hi) / 2;
    return { tC, dt: L2(tC) - L1(tC), L1, L2 };
  }

  // method: 'graph' Δt hiệu chỉnh bằng đồ thị | 'raw' lấy hiệu nhiệt độ đọc thẳng (sai)
  calResult({ method = 'graph' }) {
    const C = this.data.calorimeter;
    const a = this.calRuns.KNO3;
    const b = this.calRuns.KCl;
    if (!a || !b) return { ok: false, events: [{ type: 'warning', text: `Chưa đo ${!a ? 'KNO₃ (để tìm C_k)' : 'KCl'}.` }] };
    const pick = (r) => (method === 'raw' ? r.raw : r.dt);
    const dHtext = C.textbookKNO3kcal * C.kcal; // kJ/mol
    const Ck = ((a.g / C.M.KNO3) * dHtext * 1000) / -pick(a); // J/K
    const dHKCl = (-Ck * pick(b) * C.M.KCl) / b.g / 1000; // kJ/mol
    const truth = C.dH.KCl;
    const err = ((dHKCl - truth) / truth) * 100;
    const ok = method === 'graph' && Math.abs(err) < 5 && !a.stuck && !b.stuck;
    this.#note('gc-cal-result', 'ΔH hoà tan KCl', `${dec(dHKCl, 2)} kJ/mol`);
    return { ok, Ck, dH: dHKCl, error: err, table: { head: ['', 'KNO₃', 'KCl'], rows: [['Khối lượng muối (g)', dec(a.g, 4), dec(b.g, 4)], [`Δt ${method === 'raw' ? 'đọc thẳng' : 'từ đồ thị'} (°C)`, dec(pick(a), 3), dec(pick(b), 3)], ['ΔH hoà tan (kJ/mol)', `${dec(dHtext, 2)} (giáo trình)`, dec(dHKCl, 2)]] }, events: [
      { type: 'machine', label: 'C_k', text: `C_k = (g/M) · ΔH(KNO₃) / (−Δt′) = (${dec(a.g, 4)}/${dec(C.M.KNO3, 2)}) · ${dec(dHtext, 2)} kJ/mol / ${dec(-pick(a), 3)} = ${dec(Ck, 0)} J/K (${dec(Ck / C.kcal / 1000, 3)} kcal/độ).` },
      { type: 'machine', label: 'ΔH(KCl)', text: `ΔH = −C_k · Δt · M / g = ${dec(Ck, 0)} · ${dec(-pick(b), 3)} · ${dec(C.M.KCl, 2)} / ${dec(b.g, 4)} = ${dec(dHKCl, 2)} kJ/mol (${dec(dHKCl / C.kcal, 2)} kcal/mol).` },
      { type: ok ? 'effect' : 'warning', label: 'So với tài liệu', text: `Tài liệu cho ΔH hoà tan KCl ${dec(truth, 2)} kJ/mol, lệch ${dec(err, 1)} %. Giáo trình lấy ΔH(KNO₃) = 8,52 kcal/mol (${dec(dHtext, 2)} kJ/mol), tài liệu khác cho ${dec(C.dH.KNO3, 2)} kJ/mol, nên kết quả lệch thêm khoảng ${dec((dHtext / C.dH.KNO3 - 1) * 100, 1)} %.${method === 'raw' ? ` Lấy hiệu nhiệt độ đọc thẳng, không hiệu chỉnh trao đổi nhiệt với môi trường: Δt của KNO₃ lệch ${dec((a.raw / a.dt - 1) * 100, 1)} %, của KCl lệch ${dec((b.raw / b.dt - 1) * 100, 1)} % so với Δt hiệu chỉnh, nên C_k sai; hai lần đo cùng lệch một chiều nên ΔH(KCl) chỉ lệch ít, nhưng đó là do may mắn bù trừ.` : ''}${a.stuck || b.stuck ? ' Có lần đo muối dính thành ămpun: đo lại.' : ''}` },
    ] };
  }

  // Nồng độ tính từ trung bình các lần chuẩn độ, so với nồng độ thật trong mô phỏng
  result({ of = 'NaOH' }) {
    const S = this.sol;
    const pick = (a, i) => this.trials.filter((t) => t.analyte === a && (!i || t.indicator === i));
    const mean = (xs) => xs.reduce((s, x) => s + x.reading, 0) / xs.length;
    const sd = (xs) => { const m = mean(xs); return xs.length > 1 ? Math.sqrt(xs.reduce((s, x) => s + (x.reading - m) ** 2, 0) / (xs.length - 1)) : 0; };
    let rows = [];
    let found = null;
    let truth = null;
    let label = '';
    if (of === 'NaOH') {
      const t = pick('oxalic', 'pp').length ? pick('oxalic', 'pp') : pick('oxalic');
      if (!t.length || !S.oxalic) return { ok: false, events: [{ type: 'warning', text: 'Chưa chuẩn độ oxalic acid bằng NaOH.' }] };
      const v = mean(t);
      found = (2 * S.oxalic.written * 10) / v;
      truth = S.NaOH.c;
      S.NaOH.found = found;
      label = `C(NaOH) = 2 · C(oxalic) · 10,00 / V = 2 · ${sig(S.oxalic.written)} · 10,00 / ${dec(v)}`;
      rows = t.map((x, i) => [`Lần ${i + 1}`, dec(x.reading)]);
    } else if (of === 'HCl') {
      if (!S.NaOH?.found) return { ok: false, events: [{ type: 'warning', text: 'Tính nồng độ NaOH (chuẩn bằng oxalic acid) trước.' }] };
      const groups = ['pp', 'mo'].map((i) => [i, pick('HCl', i)]).filter(([, t]) => t.length);
      if (!groups.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa chuẩn độ HCl.' }] };
      const [i0, t0] = groups[0];
      const v = mean(t0);
      found = (S.NaOH.found * v) / 10;
      truth = S.HCl.c;
      label = `C(HCl) = C(NaOH) · V / 10,00 = ${sig(S.NaOH.found)} · ${dec(v)} / 10,00 (${this.data.indicators[i0].name})`;
      rows = groups.flatMap(([i, t]) => t.map((x, k) => [`${this.data.indicators[i].name}, lần ${k + 1}`, dec(x.reading)]));
    } else if (of === 'KMnO4') {
      const t = pick('KMnO4');
      if (!t.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa chuẩn độ KMnO₄.' }] };
      const v = mean(t);
      found = (2 * S.oxalic.written * 10) / (5 * v);
      truth = S.KMnO4.c;
      label = `C(KMnO₄) = 2 · C(oxalic) · 10,00 / (5 · V) = 2 · ${sig(S.oxalic.written)} · 10,00 / (5 · ${dec(v)})`;
      rows = t.map((x, i) => [`Lần ${i + 1}`, dec(x.reading)]);
    } else return { ok: false, events: [{ type: 'warning', text: `Không tính được "${of}".` }] };
    const t = of === 'HCl' ? pick('HCl') : of === 'KMnO4' ? pick('KMnO4') : pick('oxalic');
    const err = ((found - truth) / truth) * 100;
    const ok = Math.abs(err) < 1;
    rows.push(['Trung bình ± SD', `${dec(mean(t))} ± ${dec(sd(t), 2)}`]);
    this.#note('gc-result', of, `${sig(found)} M`);
    return { ok, found, truth, error: err, table: { head: ['Lần chuẩn độ', 'V (mL)'], rows }, events: [
      { type: 'machine', label: `C(${of === 'KMnO4' ? 'KMnO₄' : of})`, text: `${label} = ${sig(found)} M.` },
      { type: ok ? 'effect' : 'warning', label: 'So với thật', text: `Nồng độ thật trong mô phỏng ${sig(truth)} M, lệch ${dec(err, 2)} %.${ok ? '' : ' Lệch nhiều: xem lại chỉ thị, cách tráng buret, cách đọc điểm cuối và dung dịch chuẩn.'}` },
    ] };
  }
}
