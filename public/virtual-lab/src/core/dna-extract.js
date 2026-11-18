import { Notebook } from './notebook.js';
import { rng } from './random.js';
import { GEL, LADDER, bpbAfter, distanceOf } from '../../figures/electrophoresis/model.mjs';

// Tách DNA thực vật bằng CTAB rồi điện di kiểm tra, theo đúng 13 bước trong báo cáo thực hành "Bài 5-6. Tách ADN từ
// thực vật" của chủ dự án (Google Drive, file "Báo cáo DTH bài 5+6"): 50 mg mẫu + 1 mL đệm CTAB (2 % CTAB, 100 mM Tris-HCl pH 8,
// 20 mM EDTA, 1,4 M NaCl) → 0,5 mL dịch chiết; 65 °C 15 phút; 500 µL chloroform : isoamyl alcohol 24 : 1, vortex 30 s;
// ly tâm 13 000 rpm 10 phút 4 °C; hút dịch nổi không chạm mặt phân cách; isopropanol 0,6 thể tích; đá 5 phút;
// ly tâm thu cặn; rửa 500 µL ethanol 70 %; để khô; hoà 30–100 µL nước; điện di agarose, TAE 1X, thang 1 kb, EtBr.
// Kết quả thật của bài: DNA đứt gãy, protein dính ở giếng, nhiều RNA ở cuối đường chạy (quy trình không có RNase).
// Lượng DNA thu được và mức đứt gãy là số minh hoạ; tỉ số A260/A280 của DNA sạch khoảng 1,8, RNA khoảng 2,0
// (Thermo Scientific, NanoDrop Technical Note T042). Không phụ thuộc DOM.

export const DX_ACTIONS = {
  'dx-sample': 'Cân mẫu thực vật',
  'dx-grind': 'Nghiền với đệm CTAB',
  'dx-label': 'Ghi tên ống',
  'dx-load': 'Hút dịch chiết vào ống',
  'dx-incubate': 'Ủ ở bể ổn nhiệt',
  'dx-ci': 'Thêm chloroform : isoamyl alcohol',
  'dx-spin': 'Ly tâm',
  'dx-transfer': 'Hút dịch nổi sang ống mới',
  'dx-iso': 'Thêm isopropanol',
  'dx-ice': 'Đặt trên đá',
  'dx-wash': 'Rửa cặn bằng ethanol',
  'dx-dissolve': 'Để khô, hoà tan DNA',
  'dx-rnase': 'Xử lý RNase',
  'dx-measure': 'Đo A260/A280',
  'dx-gel': 'Điện di kiểm tra DNA',
};

// Lượng DNA (µg) từ 50 mg mẫu khi mọi bước đúng: minh hoạ; quả mọng nước ít tế bào, nhiều đường đa nên ít DNA
const TISSUE = {
  leaf: { name: 'lá non', ug50: 4 },
  flower: { name: 'hoa', ug50: 2.5 },
  fruit: { name: 'quả', ug50: 1.2 },
};
const dec = (v, d = 1) => Number(v).toFixed(d).replace('.', ',');
const thou = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const ORDER = ['sample', 'grind', 'load', 'incubate', 'ci', 'spin1', 'transfer', 'iso', 'spin2', 'wash', 'dissolve'];

export class DnaExtractLab {
  constructor() {
    this.reset();
  }

  reset(seed = 1) {
    this.random = rng(seed);
    this.notebook = new Notebook();
    this.s = null;
  }

  do(action, params = {}) {
    const fn = {
      'dx-sample': () => this.sample(params), 'dx-grind': () => this.grind(params), 'dx-label': () => this.label(params), 'dx-load': () => this.load(params),
      'dx-incubate': () => this.incubate(params), 'dx-ci': () => this.ci(params), 'dx-spin': () => this.spin(params), 'dx-transfer': () => this.transfer(params),
      'dx-iso': () => this.iso(params), 'dx-ice': () => this.ice(params), 'dx-wash': () => this.wash(params), 'dx-dissolve': () => this.dissolve(params),
      'dx-rnase': () => this.rnase(), 'dx-measure': () => this.measure(), 'dx-gel': () => this.gel(params),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    if (action !== 'dx-sample' && !this.s) return { action, ok: false, events: [{ type: 'warning', text: 'Chưa có mẫu: cân mẫu thực vật trước.' }] };
    return { action, ...fn() };
  }

  // Bước phải làm sau bước nào (theo thứ tự trong báo cáo)
  #after(step, need) {
    const s = this.s;
    if (s.done.includes(step)) return `Đã làm bước này rồi.`;
    const i = ORDER.indexOf(need);
    if (i >= 0 && !s.done.includes(need)) return `Làm sai thứ tự: bước này phải làm sau bước "${{ sample: 'cân mẫu', grind: 'nghiền', load: 'hút dịch chiết', incubate: 'ủ 65 °C', ci: 'thêm CI', spin1: 'ly tâm tách pha', transfer: 'hút dịch nổi', iso: 'thêm isopropanol', spin2: 'ly tâm thu cặn', wash: 'rửa ethanol' }[need]}".`;
    return null;
  }

  #note(action, result) {
    this.notebook.add({ day: '', experiment: 'Tách DNA bằng CTAB', action: DX_ACTIONS[action], subject: TISSUE[this.s.tissue].name, result });
  }

  sample({ tissue = 'leaf', mg = 50 }) {
    const T = TISSUE[tissue] ?? TISSUE.leaf;
    mg = Number(mg);
    // Biến thiên giữa các mẫu và tay người làm (log-chuẩn, độ lệch 0,3; minh hoạ)
    const luck = Math.exp(0.3 * this.random.normal());
    // Làm đúng mọi bước bằng tay vẫn có chút đứt gãy (nghiền, hút) và chút protein lẫn từ mặt phân cách: trong bài
    // thật chỉ khoảng 5/13 mẫu của lớp tách khá tốt (minh hoạ)
    const shear0 = 0.12 + 0.2 * this.random();
    const protein0 = 0.3 * this.random();
    this.s = { tissue: tissue in TISSUE ? tissue : 'leaf', mg, done: ['sample'], labeled: null, ug: T.ug50 * (Math.min(mg, 100) / 50) * luck, lysis: 0, shear: shear0, protein: protein0, rna: 1, salt: 0, extractUl: 0, ul: null, warnings: [] };
    const events = [{ type: 'machine', label: 'Cân', text: `${dec(mg, 0)} mg ${T.name} cắt nhỏ cho vào cối sứ.` }];
    if (mg > 100) events.push({ type: 'warning', label: 'Quá nhiều mẫu', text: 'Hơn 100 mg cho 1 mL CTAB: dịch quá đặc, ly giải không hết và khó hút.' });
    if (mg < 20) events.push({ type: 'warning', label: 'Quá ít mẫu', text: 'Dưới 20 mg: lượng DNA quá ít, băng trên gel rất mờ.' });
    this.#note('dx-sample', `${mg} mg`);
    return { ok: mg >= 20 && mg <= 100, events };
  }

  grind({ ctab = 1, hard = false }) {
    const s = this.s;
    const why = this.#after('grind', 'sample');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push('grind');
    if (hard) s.shear += 0.25;
    if (s.mg > 100) s.lysis -= 0.3;
    s.extractUl = 500;
    this.#note('dx-grind', hard ? 'nghiền mạnh, lâu' : 'nghiền vừa');
    const events = [{ type: 'machine', label: 'Nghiền', text: `Thêm ${dec(ctab, 1)} mL đệm CTAB, nghiền đồng nhất được khoảng 0,5 mL dịch chiết xanh đặc. CTAB phá màng tế bào và màng bào quan, EDTA giữ ion hoá trị hai nên DNase không hoạt động.` }];
    if (hard) events.push({ type: 'warning', label: 'Nghiền quá mạnh', text: 'Nghiền quá mạnh và quá lâu làm DNA genome đứt gãy (vệt kéo dài trên gel).' });
    return { ok: !hard, events };
  }

  label({ where = 'both' }) {
    this.s.labeled = where;
    this.#note('dx-label', where);
    const ok = where === 'both';
    return { ok, events: [{ type: ok ? 'machine' : 'warning', label: 'Ghi tên', text: ok ? 'Ghi tên bằng bút viết kính lên cả nắp và thân ống 1,7 mL.' : where === 'cap' ? 'Chỉ ghi trên nắp: khi chuyển dịch nổi sang ống mới hoặc nắp bị cồn làm nhoè thì không còn biết ống nào.' : 'Không ghi tên: sau khi ly tâm cùng các nhóm khác thì không biết ống nào của mình.' }] };
  }

  load({ tip = 'cut' }) {
    const s = this.s;
    const why = this.#after('load', 'grind');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push('load');
    const events = [];
    if (tip === 'cut') {
      s.ul = 500;
      events.push({ type: 'machine', label: 'Hút', text: 'Cắt đầu tip cho rộng, hút 0,5 mL dịch chiết đặc sang ống 1,7 mL.' });
    } else {
      s.ul = 350;
      s.shear += 0.15;
      s.ug *= 0.7;
      events.push({ type: 'warning', label: 'Tip nhỏ', text: 'Dịch đặc làm tắc đầu tip thường: hút được ít hơn 0,5 mL, DNA bị lực cắt khi đi qua lỗ nhỏ nên đứt gãy thêm.' });
    }
    if (!s.labeled) events.push({ type: 'warning', label: 'Chưa ghi tên', text: 'Ống chưa ghi tên.' });
    this.#note('dx-load', `${s.ul} µL`);
    return { ok: tip === 'cut', events };
  }

  incubate({ temp = 65, min = 15 }) {
    const s = this.s;
    const why = this.#after('incubate', 'load');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push('incubate');
    temp = Number(temp);
    min = Number(min);
    // Ly giải theo nhiệt độ và thời gian (minh hoạ): đủ ở 55–70 °C từ 10 phút; nhiệt độ thấp ly giải kém; sôi làm DNA đứt
    let lysis = temp >= 55 && temp <= 70 ? 1 : temp < 55 ? 0.2 + (0.8 * Math.max(0, temp - 25)) / 30 : 1;
    lysis *= Math.min(1, 0.4 + (0.6 * min) / 10);
    s.lysis += lysis;
    const events = [{ type: 'machine', label: 'Bể ổn nhiệt', text: `Cắm ống vào miếng xốp, thả vào bể ${temp} °C, ủ ${min} phút.` }];
    let ok = temp >= 55 && temp <= 70 && min >= 10;
    if (temp > 80) {
      s.shear += 0.4;
      events.push({ type: 'warning', label: 'Quá nóng', text: 'Ủ gần nhiệt độ sôi làm DNA biến tính và đứt gãy nhiều.' });
    } else if (temp < 55) events.push({ type: 'warning', label: 'Chưa đủ nóng', text: 'Dưới 55 °C CTAB ly giải kém, lượng DNA thu được ít.' });
    if (min < 10) events.push({ type: 'warning', label: 'Ủ quá ngắn', text: 'Ủ chưa đủ thời gian: tế bào chưa ly giải hết.' });
    this.#note('dx-incubate', `${temp} °C, ${min} phút`);
    return { ok, events };
  }

  ci({ cool = true, ul = 500, vortex = 30 }) {
    const s = this.s;
    const why = this.#after('ci', 'incubate');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push('ci');
    const events = [{ type: 'machine', label: 'CI', text: `Thêm ${ul} µL chloroform : isoamyl alcohol 24 : 1, vortex ${vortex} s: chloroform kéo lipid và protein biến tính ra, isoamyl alcohol chống tạo bọt.` }];
    let ok = true;
    if (!cool) {
      s.ug *= 0.7;
      ok = false;
      events.push({ type: 'warning', label: 'Chưa để nguội', text: 'Cho CI vào dịch còn 65 °C: chloroform sôi ở khoảng 61 °C nên bay hơi, nắp ống bật, mất một phần mẫu. Phải để nguội về nhiệt độ phòng trước.' });
    }
    if (Number(vortex) > 60) {
      s.shear += 0.2;
      ok = false;
      events.push({ type: 'warning', label: 'Vortex quá lâu', text: 'Vortex quá lâu làm DNA genome đứt gãy.' });
    }
    if (Number(ul) < 0.8 * s.ul) {
      s.protein += 0.3;
      ok = false;
      events.push({ type: 'warning', label: 'Thiếu CI', text: 'Thể tích CI ít hơn dịch chiết: protein không được tách hết.' });
    }
    this.#note('dx-ci', `${ul} µL, vortex ${vortex} s`);
    return { ok, events };
  }

  // Ly tâm lần 1 (tách pha sau CI) hoặc lần 2 (thu cặn DNA sau isopropanol)
  spin({ rpm = 13000, min = 10, temp = 4 }) {
    const s = this.s;
    const second = s.done.includes('iso');
    const step = second ? 'spin2' : 'spin1';
    const why = this.#after(step, second ? 'iso' : 'ci');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push(step);
    rpm = Number(rpm);
    min = Number(min);
    const strong = rpm >= 10000 && min >= 5;
    const events = [];
    if (!second) {
      if (!strong) s.protein += 0.25;
      events.push({ type: 'machine', label: 'Ly tâm', text: `${thou(rpm)} rpm, ${min} phút, ${temp} °C: dịch tách ba lớp: pha nước trong ở trên (chứa DNA), lớp protein trắng đục ở giữa, pha chloroform xanh ở dưới.` });
      if (!strong) events.push({ type: 'warning', label: 'Ly tâm yếu', text: 'Lực ly tâm hoặc thời gian chưa đủ: mặt phân cách nhoè, dễ hút lẫn protein.' });
    } else {
      if (!strong) s.ug *= 0.6;
      events.push({ type: 'machine', label: 'Ly tâm', text: `${thou(rpm)} rpm, ${min} phút, ${temp} °C: cặn DNA trắng đục bám ở đáy ống.` });
      if (!strong) events.push({ type: 'warning', label: 'Ly tâm yếu', text: 'Cặn không bám chắc, mất một phần khi đổ dịch.' });
    }
    if (Number(temp) > 20) events.push({ type: 'effect', label: 'Nhiệt độ', text: 'Quy trình dùng máy ly tâm lạnh 4 °C; ly tâm ở nhiệt độ phòng vẫn được nhưng DNase còn hoạt động mạnh hơn.' });
    this.#note('dx-spin', `${second ? 'thu cặn' : 'tách pha'}, ${thou(rpm)} rpm ${min} phút`);
    return { ok: strong, events };
  }

  transfer({ touch = false }) {
    const s = this.s;
    const why = this.#after('transfer', 'spin1');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push('transfer');
    if (touch) s.protein += 0.5;
    this.#note('dx-transfer', touch ? 'chạm mặt phân cách' : 'không chạm');
    return { ok: !touch, events: [touch ? { type: 'warning', label: 'Chạm mặt phân cách', text: 'Đầu tip chạm lớp protein giữa hai pha: hút lẫn protein (A260/A280 thấp, protein dính ở giếng khi điện di).' } : { type: 'machine', label: 'Hút dịch nổi', text: 'Hút pha nước phía trên sang ống mới, đầu tip không chạm mặt phân cách.' }] };
  }

  iso({ ratio = 0.6 }) {
    const s = this.s;
    const why = this.#after('iso', 'transfer');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push('iso');
    ratio = Number(ratio);
    // Isopropanol 0,6–1 thể tích kết tủa gần hết DNA; ít hơn thì kết tủa không hết; nhiều hơn kéo theo muối (minh hoạ)
    const eff = ratio >= 0.6 ? 0.95 : 0.3 + ratio;
    s.ug *= Math.min(0.95, eff);
    if (ratio > 1) s.salt += 0.3;
    this.#note('dx-iso', `${ratio} thể tích`);
    const events = [{ type: 'machine', label: 'Isopropanol', text: `Thêm isopropanol lạnh ${dec(ratio, 1)} thể tích, đảo nhẹ: ${s.ug * s.lysis > 3 ? 'thấy sợi DNA kết tủa màu trắng.' : 'chỉ hơi đục, sợi DNA khó thấy.'}` }];
    if (ratio < 0.6) events.push({ type: 'warning', label: 'Thiếu isopropanol', text: 'Ít hơn 0,6 thể tích: DNA kết tủa không hết.' });
    if (ratio > 1) events.push({ type: 'warning', label: 'Thừa isopropanol', text: 'Quá nhiều isopropanol kéo theo muối kết tủa cùng DNA.' });
    return { ok: ratio >= 0.6 && ratio <= 1, events };
  }

  ice({ min = 5 }) {
    this.s.iced = Number(min);
    this.#note('dx-ice', `${min} phút`);
    return { ok: true, events: [{ type: 'machine', label: 'Đá', text: `Đặt ống trên đá ${min} phút cho DNA kết tủa thêm.` }] };
  }

  wash({ ethanol = 70, gentle = true }) {
    const s = this.s;
    const why = this.#after('wash', 'spin2');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push('wash');
    const events = [{ type: 'machine', label: 'Rửa', text: `Thêm 500 µL ethanol ${ethanol} %, đảo nhẹ một lần rồi đổ bỏ ethanol: ethanol rửa muối còn bám trên cặn.` }];
    let ok = true;
    if (Number(ethanol) >= 95) {
      s.salt += 0.5;
      ok = false;
      events.push({ type: 'warning', label: 'Ethanol tuyệt đối', text: 'Ethanol 100 % không hoà được muối nên muối còn lại trong cặn (A260/A230 thấp, cản trở PCR).' });
    }
    if (!gentle) {
      s.ug *= 0.3;
      ok = false;
      events.push({ type: 'warning', label: 'Đổ mạnh', text: 'Đảo và đổ mạnh làm cặn DNA trôi theo ethanol.' });
    }
    this.#note('dx-wash', `ethanol ${ethanol} %${gentle ? '' : ', đổ mạnh'}`);
    return { ok, events };
  }

  dissolve({ ul = 50 }) {
    const s = this.s;
    const why = this.#after('dissolve', 'wash');
    if (why) return { ok: false, events: [{ type: 'warning', text: why }] };
    s.done.push('dissolve');
    s.ul = Number(ul);
    const ug = this.yieldUg();
    this.#note('dx-dissolve', `${ul} µL`);
    return { ok: true, events: [{ type: 'machine', label: 'Hoà tan', text: `Để khô cặn ở nhiệt độ phòng, hoà trong ${ul} µL nước: khoảng ${dec(ug, 1)} µg DNA (${dec((ug * 1000) / s.ul, 0)} ng/µL; số minh hoạ).` }] };
  }

  rnase() {
    this.s.rna = Math.min(this.s.rna, 0.1);
    this.#note('dx-rnase', 'RNase A 37 °C');
    return { ok: true, events: [{ type: 'effect', label: 'RNase', text: 'Thêm RNase A, ủ 37 °C: RNA bị cắt nhỏ. Quy trình trong báo cáo không có bước này nên gel còn vệt RNA.' }] };
  }

  yieldUg() {
    const s = this.s;
    return Math.max(0, s.ug * Math.min(1, Math.max(0, s.lysis)));
  }

  measure() {
    const s = this.s;
    if (!s.done.includes('dissolve')) return { ok: false, events: [{ type: 'warning', text: 'Chưa hoà tan DNA.' }] };
    const dna = (this.yieldUg() * 1000) / s.ul; // ng/µL
    // RNA cùng hấp thụ ở 260 nm làm nồng độ đo được cao hơn; protein làm A260/A280 giảm (minh hoạ quanh các mốc T042)
    const rnaNg = dna * 0.8 * s.rna;
    const total = dna + rnaNg;
    const ratio = Math.max(1.2, (1.8 * dna + 2.0 * rnaNg) / Math.max(total, 1e-6) - 0.45 * Math.min(1, s.protein));
    const r230 = Math.max(0.6, 2.1 - 1.2 * s.salt - 0.5 * Math.min(1, s.protein));
    this.lastMeasure = { dna, total, ratio, r230 };
    const events = [{ type: 'machine', label: 'NanoDrop', text: `A260 cho ${dec(total, 0)} ng/µL; A260/A280 = ${dec(ratio, 2)}; A260/A230 = ${dec(r230, 2)}.` }];
    if (s.rna > 0.5) events.push({ type: 'effect', label: 'Lẫn RNA', text: 'RNA cũng hấp thụ ở 260 nm: nồng độ đo được cao hơn lượng DNA thật và tỉ số A260/A280 tiến về 2,0.' });
    if (s.protein > 0.2) events.push({ type: 'warning', label: 'Lẫn protein', text: 'A260/A280 thấp hơn 1,8: mẫu lẫn protein.' });
    if (r230 < 1.8) events.push({ type: 'warning', label: 'Lẫn muối, CTAB', text: 'A260/A230 thấp: còn muối hoặc CTAB.' });
    this.#note('dx-measure', `${dec(total, 0)} ng/µL, 260/280 ${dec(ratio, 2)}`);
    return { ok: true, ratio, ngul: total, events };
  }

  gel({ volts = 100, minutes = 40 }) {
    const s = this.s;
    if (!s.done.includes('dissolve')) return { ok: false, events: [{ type: 'warning', text: 'Chưa có DNA để điện di.' }] };
    const V = Math.min(GEL.vMax, Math.max(GEL.vMin, Number(volts)));
    const dye = Math.min(GEL.length, bpbAfter((V * Number(minutes)) / 60));
    const at = (bp) => distanceOf(bp, dye);
    // Nạp 5 µL dịch DNA + loading dye: độ sáng theo lượng DNA trong 5 µL (DNA genome trải rộng nên cần vài trăm ng mới sáng rõ; minh hoạ)
    const ngLoaded = (this.yieldUg() * 1000 * 5) / s.ul;
    const bright = Math.min(1, ngLoaded / 400);
    const shear = Math.min(0.9, s.shear);
    const bands = [];
    if (s.protein > 0.15) bands.push({ bp: 60000, cm: 0.05, w: Math.min(1, 0.3 + s.protein), note: 'protein và DNA dính ở giếng' });
    bands.push({ bp: 20000, cm: at(20000), w: bright * (1 - shear), note: 'DNA genome' });
    if (shear > 0.05) bands.push({ bp: 20000, cm: at(20000), smear: at(500), w: bright * shear, note: 'vệt DNA đứt gãy' });
    if (s.rna > 0.3) bands.push({ bp: 300, cm: at(300), smear: Math.min(GEL.length, at(60)), w: Math.min(1, 0.6 * s.rna + 0.2), note: 'RNA' });
    const lanes = [
      { name: 'L', title: 'Thang 1 kb', bands: LADDER.map((bp) => ({ bp, cm: at(bp), w: [6000, 3000, 1000].includes(bp) ? 1 : 0.55 })) },
      { name: s.labeled === 'both' || s.labeled === 'cap' ? 'M' : '?', title: `DNA ${TISSUE[s.tissue].name}`, bands: bands.filter((b) => b.cm <= GEL.length) },
    ];
    const events = [{ type: 'machine', label: 'Điện di', text: `Gel agarose 1 %, đệm TAE 1X, ${V} V, ${minutes} phút; nạp 5 µL DNA với loading dye 6X, nhuộm ethidium bromide, soi UV.` }];
    const notes = [];
    if (bright < 0.2) notes.push('băng DNA rất mờ (quá ít DNA)');
    else notes.push(shear > 0.3 ? 'DNA đứt gãy nhiều, kéo vệt dài' : 'băng DNA genome sắc gần giếng (trên 10 kb)');
    if (s.protein > 0.15) notes.push('protein dính ở miệng giếng');
    if (s.rna > 0.3) notes.push('RNA ở cuối đường chạy');
    events.push({ type: 'effect', label: 'Ảnh gel', text: `${notes.join('; ')}.` });
    if (s.labeled !== 'both' && s.labeled !== 'cap') events.push({ type: 'warning', label: 'Không ghi tên', text: 'Ống không ghi tên: không chắc làn này là mẫu của mình.' });
    const good = bright >= 0.2 && shear <= 0.3 && s.protein <= 0.15;
    this.#note('dx-gel', notes.join('; '));
    this.lastGel = { lanes };
    return { ok: true, good, lanes, gelCm: GEL.length, dyeCm: dye, events };
  }

  figureData() {
    return this.lastGel ? { done: true, V: 100, lanes: this.lastGel.lanes.map((l) => ({ name: l.name, bands: l.bands.filter((b) => !b.smear).map(({ bp, w }) => ({ bp, w })) })) } : null;
  }
}
