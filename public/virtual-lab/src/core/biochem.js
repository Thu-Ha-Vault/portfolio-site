// Hoá sinh định tính trên giá ống nghiệm và bể ổn nhiệt (bài 01–07 Hoá sinh của chủ dự án, data/biochem.json):
// phản ứng nhận biết đường (Tromer, Fehling, Benedict, Barfoed, Tollens, Xelivanop, Lugol), amino acid và protein
// (biure, ninhydrin, HNO₂, xanthoprotein, Adamkiewicz, Folia), tính chất protein (pI casein, salting out, biến tính,
// kim loại nặng), lipid (tan, nhũ tương, acrolein, xà phòng hoá) và vitamin (D, B2), cùng các phép định lượng chuẩn độ:
// chỉ số acid, xà phòng hoá, iod của dầu lạc và vitamin C. Màu của mỗi ống tính lại từ thành phần, thứ tự thêm và
// thời gian đun. Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';
import { WNB10, heatUpMinutes, waterLitres } from '../../figures/waterbath/model.mjs';

export const BC_ACTIONS = {
  'wb-set': 'Đặt bể ổn nhiệt',
  'tt-fill': 'Cho mẫu vào ống',
  'tt-row': 'Pha một dãy ống',
  'tt-add': 'Thêm thuốc thử',
  'tt-heat': 'Đun ống',
  'tt-cool': 'Làm nguội ống',
  'tt-wait': 'Chờ',
  'tt-take': 'Hút sang ống khác',
  'tt-clear': 'Rửa ống',
  'tt-guess': 'Kết luận lọ mất nhãn',
  'bc-index': 'Chỉ số lipid',
  'bc-vitc': 'Định lượng vitamin C',
};
export const TUBES = 10;
export const BATH_SETS = [37, 60, 100];
const ROOM = 25;
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');
const TEST_REAGENTS = ['fehling', 'benedict', 'barfoed', 'tollens', 'seliwanoff', 'lugol', 'ninhydrin', 'nitrous', 'HNO3', 'glyoxylic', 'PbAc'];

export class BiochemLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.min = 0;
    this.bath = { setC: null, waterC: ROOM, lid: 'closed' };
    this.tubes = Array.from({ length: TUBES }, (_, i) => this.#empty(i + 1));
    // Năm lọ mất nhãn: hoán vị ngẫu nhiên theo seed của phiên
    const ids = [...this.data.unknowns.ids];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    this.bottles = ids;
    this.guesses = {};
    this.last = null;
    this.notebook.clear();
  }

  #empty(n) {
    return { n, sample: null, label: null, mL: 0, adds: [], boil: 0, warm: 0, flame: false, hot: false, age: 0, hydro: 0 };
  }

  do(action, params = {}) {
    const fn = {
      'wb-set': () => this.setBath(params),
      'tt-fill': () => this.fill(params),
      'tt-row': () => this.row(params),
      'tt-add': () => this.add(params),
      'tt-heat': () => this.heat(params),
      'tt-cool': () => this.cool(params),
      'tt-wait': () => this.wait(params),
      'tt-take': () => this.take(params),
      'tt-clear': () => this.clear(params),
      'tt-guess': () => this.guess(params),
      'bc-index': () => this.lipidIndex(params),
      'bc-vitc': () => this.vitaminC(params),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  // tube: số ống, mảng số ống, hoặc 'all' (mọi ống đang có mẫu hoặc thuốc thử)
  #list(tube, pick = (t) => t.sample || t.adds.length) {
    if (tube === 'all') return this.tubes.filter(pick);
    return (Array.isArray(tube) ? tube : [tube]).map((n) => this.tube(n));
  }

  tube(n) {
    const t = this.tubes[Number(n) - 1];
    if (!t) throw new Error(`Không có ống ${n}`);
    return t;
  }

  // Mẫu thật của một id (lọ mất nhãn x1…x5 → chất thật theo seed)
  sampleOf(id) {
    const m = /^x([1-5])$/.exec(id);
    return m ? this.bottles[Number(m[1]) - 1] : id;
  }

  // Bể ổn nhiệt Memmert WNB 10 (figures/waterbath/model.mjs): thời gian nóng lên theo cân bằng nhiệt của nước, vỏ inox
  // và nhiệt mất ra ngoài khi đậy nắp; nguội tự nhiên coi như tức thì khi đặt thấp hơn
  setBath({ setC = 100 }) {
    const T = Number(setC);
    const target = Math.min(T, 100);
    const dT = Math.max(0, target - this.bath.waterC);
    const minutes = heatUpMinutes({ fromC: this.bath.waterC, toC: target, lid: 'closed' });
    const volumeL = waterLitres();
    const powerW = WNB10.powerW;
    this.bath = { ...this.bath, setC: T, waterC: target };
    this.#pass(minutes);
    const events = [{ type: 'machine', label: 'Bể ổn nhiệt', text: `Đặt ${T} °C${T >= 100 ? ' (chế độ sôi)' : ''}. ${dT > 0 ? `Nước ${fmt(volumeL, 1)} L nóng từ ${fmt(target - dT, 0)} lên ${fmt(target, 0)} °C sau khoảng ${fmt(minutes, 0)} phút (bộ đun ${powerW} W).` : 'Nước đã ở nhiệt độ đặt.'}` }];
    if (T < 90) events.push({ type: 'info', text: 'Ở nhiệt độ này đủ để ủ enzyme (37 °C) nhưng không đủ cho các phản ứng cần "cách thuỷ sôi" như Fehling, Benedict, Barfoed.' });
    return { ok: true, events };
  }

  fill({ tube, sample, mL = 2 }) {
    const t = this.tube(tube);
    const real = this.sampleOf(sample);
    const s = this.data.samples[real];
    if (!s) throw new Error(`Không có mẫu "${sample}"`);
    // Ống đã có mẫu thì rửa trước; ống mới có thuốc thử (Benedict, Xelivanop, Tollens: thuốc thử trước, mẫu sau) thì giữ
    if (t.sample) Object.assign(t, this.#empty(t.n));
    t.sample = real;
    t.label = /^x/.test(sample) ? `lọ ${sample.slice(1)}` : s.name;
    t.mL = Number(mL);
    this.notebook.add({ day: '', experiment: 'Hoá sinh', action: BC_ACTIONS['tt-fill'], subject: `ống ${t.n}`, result: `${fmt(t.mL)} mL ${t.label}` });
    return { ok: true, tube: t.n, events: [{ type: 'machine', label: `Ống ${t.n}`, text: `Cho ${fmt(t.mL)} mL ${t.label} vào ống.` }, ...this.#look(t)] };
  }

  // Một dãy ống cùng phép thử: ống tubes[i] nhận mẫu samples[i] rồi thuốc thử (hoặc thuốc thử trước nếu reagentFirst)
  row({ tubes, samples, reagent = null, mL = 1, sampleMl = 1, reagentFirst = false }) {
    const events = [];
    tubes.forEach((n, i) => {
      const t = this.tube(n);
      Object.assign(t, this.#empty(t.n));
      const put = () => this.fill({ tube: n, sample: samples[i] ?? samples[0], mL: sampleMl });
      const pour = () => reagent && this.add({ tube: n, reagent, mL });
      if (reagentFirst) { pour(); put(); } else { put(); pour(); }
      const o = this.#look(t);
      events.push(...o);
    });
    const r = reagent ? this.data.reagents[reagent] : null;
    return { ok: true, hazard: r?.hazard ?? null, events: [{ type: 'machine', label: `Ống ${tubes[0]}–${tubes[tubes.length - 1]}`, text: `${tubes.map((n) => `ống ${n}: ${this.tube(n).label}`).join(' · ')}${r ? `; mỗi ống ${mL < 0.2 ? `${Math.round(mL / 0.05)} giọt` : `${fmt(mL)} mL`} ${r.name}` : ''}.` }, ...events] };
  }

  // mode 'layer': nhỏ theo thành ống thành lớp riêng (Adamkiewicz); 'mix': lắc đều
  add({ tube, reagent, mL = 1, mode = 'mix' }) {
    const t = this.tube(tube);
    const r = this.data.reagents[reagent];
    if (!r) throw new Error(`Không có thuốc thử "${reagent}"`);
    t.adds.push({ r: reagent, mL: Number(mL), mode, boilAt: t.boil, warmAt: t.warm, ageAt: t.age, flameAt: t.flame });
    t.mL += Number(mL);
    if (reagent === 'water' && t.adds.some((a) => a.r === 'ASsat' || a.r === 'ASsolid')) t.diluted = true;
    this.notebook.add({ day: '', experiment: 'Hoá sinh', action: BC_ACTIONS['tt-add'], subject: `ống ${t.n}`, result: `${fmt(mL)} mL ${r.name}` });
    return { ok: true, tube: t.n, hazard: r.hazard ?? null, events: [{ type: 'machine', label: `Ống ${t.n}`, text: `Thêm ${mL < 0.2 ? `${Math.round(mL / 0.05)} giọt` : `${fmt(mL)} mL`} ${r.name}${mode === 'layer' ? ', nhỏ từ từ theo thành ống thành lớp riêng' : ''}.` }, ...this.#look(t)] };
  }

  // mode 'bath': đun cách thuỷ ở nhiệt độ của bể; 'flame': hơ trực tiếp trên đèn cồn (vài trăm °C ở đáy ống)
  heat({ tube = 'all', minutes = 5, mode = 'bath' }) {
    const list = this.#list(tube);
    const m = Number(minutes);
    const T = mode === 'flame' ? 250 : this.bath.waterC;
    const events = [{ type: 'machine', label: mode === 'flame' ? 'Đèn cồn' : 'Bể ổn nhiệt', text: `${mode === 'flame' ? 'Hơ trực tiếp' : `Đun cách thuỷ ở ${fmt(T, 0)} °C`} ${fmt(m, m < 1 ? 1 : 0)} phút: ống ${list.map((t) => t.n).join(', ') || '(không có ống nào)'}.` }];
    if (mode === 'bath' && this.bath.setC === null) events.push({ type: 'warning', label: 'Lưu ý', text: 'Bể ổn nhiệt chưa bật: nước mới ở nhiệt độ phòng, ống không nóng lên.' });
    for (const t of list) {
      if (T >= this.data.thresholds.boilC) t.boil += m;
      if (T >= 35) t.warm += m;
      if (mode === 'flame') t.flame = true;
      if (T >= 35) t.hot = true;
      if (T >= this.data.thresholds.boilC && this.#acidLeft(t)) t.hydro += m;
      t.age += m;
    }
    this.#pass(m);
    for (const t of list) events.push(...this.#look(t, true));
    this.notebook.add({ day: '', experiment: 'Hoá sinh', action: BC_ACTIONS['tt-heat'], subject: list.map((t) => `ống ${t.n}`).join(' '), result: `${fmt(T, 0)} °C ${fmt(m, 1)} phút` });
    return { ok: list.length > 0, events };
  }

  cool({ tube = 'all' }) {
    const list = this.#list(tube, (t) => t.hot);
    for (const t of list) t.hot = false;
    const events = [{ type: 'machine', label: 'Làm nguội', text: `Ngâm ống ${list.map((t) => t.n).join(', ') || '…'} vào cốc nước lạnh.` }];
    for (const t of list) events.push(...this.#look(t, true));
    return { ok: true, events };
  }

  wait({ minutes = 1, tube = 'all' }) {
    const m = Number(minutes);
    const list = this.#list(tube, (t) => t.sample);
    for (const t of this.tubes) t.age += m;
    this.#pass(m);
    const events = [{ type: 'machine', label: 'Đồng hồ', text: `Chờ ${fmt(m, m < 1 ? 2 : 0)} phút.` }];
    for (const t of list) events.push(...this.#look(t, true));
    return { ok: true, events };
  }

  // Hút một phần dịch sang ống khác (lấy mẫu theo thời gian khi thuỷ phân tinh bột)
  take({ from, to, mL = 0.5 }) {
    const a = this.tube(from);
    const b = this.tube(to);
    Object.assign(b, this.#empty(b.n), { sample: a.sample, label: `${a.label} (từ ống ${a.n}, ${fmt(a.hydro, 0)} phút thuỷ phân)`, mL: Number(mL), hydro: a.hydro, adds: a.adds.filter((x) => x.r === 'HCl').map((x) => ({ ...x, boilAt: 0, ageAt: 0 })) });
    b.hydroFixed = true;
    a.mL = Math.max(0, a.mL - Number(mL));
    return { ok: true, events: [{ type: 'machine', label: `Ống ${b.n}`, text: `Hút ${fmt(mL)} mL từ ống ${a.n} sang ống ${b.n}.` }, ...this.#look(b)] };
  }

  clear({ tube = 'all' }) {
    const list = tube === 'all' ? this.tubes : [this.tube(tube)];
    for (const t of list) Object.assign(t, this.#empty(t.n));
    return { ok: true, events: [{ type: 'machine', label: 'Rửa ống', text: tube === 'all' ? 'Đổ bỏ và rửa sạch cả giá ống.' : `Đổ bỏ và rửa sạch ống ${tube}.` }] };
  }

  // Không ghi đáp án (nút Làm mẫu) thì dùng đáp án đúng
  guess({ bottle, answer }) {
    const real = this.bottles[Number(bottle) - 1];
    answer = answer ?? real;
    const right = real === answer;
    this.guesses[bottle] = answer;
    const names = this.data.unknowns.names;
    this.notebook.add({ day: '', experiment: 'Hoá sinh', action: BC_ACTIONS['tt-guess'], subject: `lọ ${bottle}`, result: `${names[answer] ?? answer}: ${right ? 'đúng' : 'sai'}` });
    return { ok: right, events: [right
      ? { type: 'effect', text: `Lọ ${bottle} là ${names[real]}: đúng.` }
      : { type: 'warning', label: 'Chưa đúng', text: `Lọ ${bottle} không phải ${names[answer] ?? answer}. Xem lại thứ tự: Fehling (đường khử) → Lugol (tinh bột) → Barfoed (mono hay disaccharide) → Xelivanop (aldose hay ketose).` }] };
  }

  #pass(minutes) {
    this.min += minutes;
  }

  // Quan sát một ống: màu dung dịch, kết tủa, vòng; kèm cảnh báo khi làm sai bước
  observe(t) {
    const C = this.data.colors;
    const TH = this.data.thresholds;
    const S = t.sample ? this.data.samples[t.sample] : null;
    const find = (r) => t.adds.find((a) => a.r === r);
    const has = (r) => Boolean(find(r));
    const boiled = (a, need = 1) => t.boil - a.boilAt >= need;
    const res = (color, text, more = {}) => ({ color: C[color] ?? color, text, ppt: null, ring: null, positive: null, warn: [], ...more });
    if (!S && !t.adds.length) return null;
    if (!S) return res('clear', 'Chỉ có thuốc thử, chưa có mẫu.');
    const base = S.kind === 'lipid' ? 'oil' : S.kind === 'vitamin' ? 'yellow' : S.starch ? 'white' : 'clear';
    if (!t.adds.length && !(S.kind === 'protein' && t.boil > 0)) return res(base, `${S.name}: ${S.kind === 'lipid' ? 'giọt dầu vàng nhạt' : S.kind === 'vitamin' ? 'dung dịch vàng huỳnh quang' : 'dung dịch không màu'}.`);
    const R = this.#reducing(t, S);

    // Vitamin B2: kẽm trong HCl đặc sinh H mới sinh khử riboflavin
    if (t.sample === 'riboflavin' && has('Zn')) {
      if (!has('HCl')) return res('yellow', 'Kẽm không tan trong nước: không có hydro mới sinh, riboflavin giữ màu vàng.', { warn: ['Thiếu HCl đặc: kẽm cần acid để sinh hydro.'] });
      const dt = t.age - find('Zn').ageAt;
      const steps = this.data.riboflavin.steps;
      const st = [...steps].reverse().find((s) => dt >= s[0]);
      return res(st[1], `Sủi bọt khí H₂; sau ${fmt(dt, 2)} phút: ${st[2]}.`, { positive: st[1] === 'clear' });
    }
    // Lipid
    if (S.kind === 'lipid' || S.kind === 'soap') {
      if (has('aniline')) {
        const a = find('aniline');
        if (!boiled(a, TH.boilMin.vitD)) return res('paleyellow', 'Chưa đun: hỗn hợp vàng nhạt.');
        return S.vitD ? res('redbrown', 'Đáy ống màu đỏ nâu: dầu cá có vitamin D.', { positive: true }) : res('paleyellow', 'Không có màu đỏ: mẫu không có vitamin D.', { positive: false });
      }
      if (has('KHSO4')) {
        if (!t.flame) return res('oil', 'Đun cách thuỷ chỉ tới 100 °C: glycerol chưa mất nước, không có acrolein.', { warn: ['Phản ứng acrolein cần hơ trực tiếp trên lửa tới khi bốc khói trắng.'], positive: false });
        return res('brown', 'Khói trắng mùi khét (acrolein); giấy tẩm AgNO₃/NH₃ ở miệng ống hoá đen; đáy ống có cặn đen.', { ppt: C.black, positive: true });
      }
      if (S.kind === 'soap') {
        if (has('CaCl2')) return res('white', 'Kết tủa trắng: muối calci của acid béo không tan (nước cứng làm mất tác dụng của xà phòng).', { ppt: C.white, positive: true });
        if (has('H2SO4')) {
          const a = find('H2SO4');
          if (!boiled(a, 1)) return res('white', 'Dung dịch vẩn đục; đun để acid béo tách hẳn thành váng.');
          if (has('phenol')) return res('clear', 'Dung dịch hồng (NaOH dư) mất màu: acid béo tự do trung hoà NaOH.', { positive: true });
          return res('white', 'Váng acid béo tự do nổi trên mặt: acid mạnh đẩy acid béo yếu ra khỏi muối.', { ring: C.oil, positive: true });
        }
        if (has('phenol')) return res('pink', 'Dung dịch xà phòng có tính kiềm: phenolphthalein vẫn hồng.');
        return res('white', 'Dung dịch xà phòng trắng đục, lắc có bọt.');
      }
      if (has('KOHeth')) {
        const a = find('KOHeth');
        const m = t.boil - a.boilAt;
        if (m < 20) return res('oil', `Mới đun ${fmt(m, 0)} phút: còn giọt dầu chưa xà phòng hoá.`, { warn: m > 0 ? ['Đun cách thuỷ tới cạn (khoảng 20–30 phút) để xà phòng hoá hoàn toàn.'] : [] });
        if (has('water')) return res('white', 'Thêm nước lắc mạnh: bọt xà phòng bền; dung dịch trắng đục, không còn giọt dầu.', { positive: true });
        return res('paleyellow', 'Cạn còn khối xà phòng màu vàng nhạt (muối kali của acid béo) và glycerol.', { positive: true });
      }
      const solv = t.adds.find((a) => this.data.reagents[a.r].solvent !== undefined);
      if (solv) {
        const P = this.data.reagents[solv.r].solvent;
        const s = (Math.exp(P / 2) * this.data.lipid.solventRateK * 2) / Math.max(0.5, solv.mL) * 10;
        return res('clear', P >= 5 ? `Dầu tan chậm trong ${this.data.reagents[solv.r].name} (dung môi phân cực hơn): khoảng ${fmt(s, 0)} giây mới tan hết khi lắc.` : `Dầu tan trong ${this.data.reagents[solv.r].name} sau khoảng ${fmt(s, 0)} giây lắc.`, { positive: true, seconds: s });
      }
      if (has('water')) {
        if (has('soapR')) return res('white', 'Lắc mạnh: hạt dầu li ti phân tán đều, nhũ tương trắng đục bền (xà phòng bao quanh giọt dầu).', { positive: true });
        return res('clear', 'Lắc xong để yên: dầu không tan trong nước, tách thành váng vàng nổi trên mặt.', { ring: C.oil, positive: false });
      }
      return res('oil', 'Dầu và thuốc thử chưa phản ứng.');
    }

    // Đường: phản ứng với Cu²⁺, Ag⁺, resorcinol, iod
    if (S.kind === 'carb') {
      const last = [...t.adds].reverse().find((a) => TEST_REAGENTS.includes(a.r));
      const acidLeft = this.#acidLeft(t);
      if (last?.r === 'lugol') {
        if (!S.starch) return res('iodine', 'Màu vàng nâu của iod: mẫu không có tinh bột.', { positive: false });
        const D = this.#hydrolysis(t);
        if (t.boil - last.boilAt >= TH.lugolLostMin) return res('paleyellow', 'Đun lâu: xoắn amylose bị phá và iod bay hơi, mất màu hẳn kể cả khi để nguội.', { positive: false });
        if (t.hot) return res('paleyellow', 'Đang nóng: iod rời khỏi lòng xoắn amylose, mất màu. Để nguội màu sẽ trở lại.');
        if (D >= this.data.hydrolysis.achro) return res('iodine', 'Màu vàng của iod: tinh bột đã thuỷ phân thành maltodextrin, không còn tạo phức màu.', { positive: false });
        if (D >= this.data.hydrolysis.erythro) return res('redbrown', 'Màu nâu đỏ: erythrodextrin (mạch ngắn hơn amylose).', { positive: true });
        return res('starch', D > 0.05 ? 'Màu tím đen: amylodextrin, mạch còn dài.' : 'Màu xanh tím: iod chui vào lòng xoắn amylose.', { positive: true });
      }
      if (last?.r === 'seliwanoff') {
        const m = t.boil - last.boilAt;
        if (m < TH.boilMin.seliwanoff) return res('clear', 'Chưa đun: chưa có màu.');
        if (S.ketose) return res('red', 'Màu đỏ thẫm sau chưa đầy 1 phút đun: ketose (fructose, hoặc fructose từ sucrose bị thuỷ phân) tạo HMF ngưng tụ với resorcinol.', { positive: true });
        if (m >= TH.seliwanoffAldoseMin) return res('paleyellow', `Đun ${fmt(m, 0)} phút mới hơi vàng: aldose chuyển thành HMF rất chậm. Phải đọc kết quả trong 1–2 phút đầu.`, { positive: false, warn: m >= 15 ? ['Đun quá lâu: aldose cũng có thể cho màu nhạt, dễ kết luận nhầm.'] : [] });
        return res('clear', 'Không đổi màu: aldose (glucose) phản ứng rất chậm.', { positive: false });
      }
      if (last?.r === 'tollens') {
        if (t.warm - last.warmAt < TH.boilMin.tollens) return res('clear', 'Chưa đun ấm: chưa có bạc.');
        return R > 0.05 ? res('silver', 'Lớp bạc sáng bám thành ống: đường khử Ag⁺ thành Ag.', { positive: true }) : res('clear', 'Không có lớp bạc: mẫu không có tính khử.', { positive: false });
      }
      if (last?.r === 'barfoed') {
        const m = t.boil - last.boilAt;
        if (m < TH.boilMin.barfoed) return res('blue', 'Chưa đun đủ: dung dịch xanh của đồng acetat.');
        if (S.mono && R > 0.05) return res('blue', 'Kết tủa đỏ gạch ở đáy ống: monosaccharide khử được Cu²⁺ trong môi trường acid yếu.', { ppt: C.brickred, positive: true });
        if (m > TH.barfoedFalseMin && !S.mono && !S.starch) return res('blue', `Đun ${fmt(m, 0)} phút: có ít tủa đỏ, nhưng là dương tính giả.`, { ppt: C.brickred, positive: true, warn: ['Đun Barfoed quá lâu: disaccharide bị thuỷ phân thành monosaccharide nên cũng cho tủa. Chỉ đun khoảng 2–3 phút cho mono, đọc ngay.'] });
        return res('blue', 'Không có tủa: disaccharide (hoặc đường không khử) không khử được Cu²⁺ trong môi trường trung tính.', { positive: false });
      }
      if (last?.r === 'fehling' || last?.r === 'benedict') {
        const fe = last.r === 'fehling';
        const name = fe ? 'Fehling' : 'Benedict';
        const m = t.boil - last.boilAt;
        if (acidLeft) return res('greenblue', `${name} gặp acid còn dư nên mất tính kiềm: không tạo được phức Cu²⁺, không có tủa (âm tính giả).`, { positive: false, warn: ['Trung hoà acid bằng NaOH trước khi thêm thuốc thử.'] });
        if (m < TH.boilMin[last.r]) {
          return res('blue', `${t.warm - last.warmAt > 0 ? 'Mới ấm, chưa sôi' : 'Chưa đun'}: giữ màu xanh lam của thuốc thử.`, { warn: t.warm - last.warmAt > 0 ? [`${name} chỉ cho tủa khi đun sôi (cách thuỷ sôi ${fe ? '1–2' : '3–5'} phút).`] : [] });
        }
        if (R < (fe ? TH.fehlingTrace : TH.benedictTrace)) return res('blue', 'Không có tủa, giữ màu xanh lam: mẫu không có tính khử.', { positive: false });
        if (fe) {
          if (R < TH.fehlingSome) return res('blue', 'Có ít tủa đỏ cam lắng ở đáy.', { ppt: C.orange, positive: true, amount: R });
          if (R < TH.fehlingMuch) return res('orangered', 'Tủa đỏ cam.', { ppt: C.orangered, positive: true, amount: R });
          return res('brickred', 'Nhiều tủa đỏ gạch (Cu₂O).', { ppt: C.brickred, positive: true, amount: R });
        }
        if (R < TH.benedictOrange) return res('greenblue', 'Tủa xanh lơ ánh vàng, dung dịch xanh: rất ít đường khử.', { ppt: C.green, positive: true, amount: R });
        if (R < TH.benedictBrick) return res('orange', 'Tủa cam đỏ.', { ppt: C.orangered, positive: true, amount: R });
        return res('brickred', 'Tủa đỏ gạch dày (ban đầu nổi thành hai lớp rồi chìm dần).', { ppt: C.brickred, positive: true, amount: R });
      }
      if (has('NaOH') && has('CuSO4')) {
        const cu = find('CuSO4');
        const excess = t.adds.filter((a) => a.r === 'CuSO4').reduce((s, a) => s + a.mL, 0) > 0.5;
        if (!boiled(cu, TH.boilMin.tromer)) return res('blue', 'Kết tủa Cu(OH)₂ xanh lam; đường tạo phức làm dung dịch xanh thẫm. Đun sôi để thấy tính khử.', { ppt: C.blue });
        if (excess) return res('black', 'Kết tủa đen CuO lấn át màu: CuSO₄ cho dư, Cu(OH)₂ thừa bị nhiệt phân.', { ppt: C.black, positive: null, warn: ['Nhỏ CuSO₄ từng giọt, chỉ tới khi vừa xuất hiện tủa Cu(OH)₂.'] });
        if (R < 0.05) return res('black', 'Không có tính khử: Cu(OH)₂ bị nhiệt phân thành CuO đen.', { ppt: C.black, positive: false });
        return res('orangered', R < TH.tromerFaint ? 'Dung dịch đỏ cam, gần như không có tủa.' : 'Đỏ cam, tủa Cu₂O huyền phù tăng theo nồng độ đường.', { ppt: R < TH.tromerFaint ? null : C.orangered, positive: true, amount: R });
      }
      if (has('HCl')) return res(S.starch ? 'white' : 'clear', `Đang thuỷ phân trong acid: ${fmt(this.#hydrolysis(t) * 100, 0)} % liên kết glycoside đã bị cắt (mô hình).`);
      return res(base, 'Chưa có thuốc thử nhận biết.');
    }

    // Amino acid và protein
    if (has('PbAc')) {
      const na = find('NaOH');
      if (!na || !boiled(na, TH.boilMin.folia)) return res('clear', 'Không có kết tủa đen: chưa đun sôi với NaOH nên lưu huỳnh chưa tách ra thành Na₂S.', { positive: false, warn: S.sulfur ? ['Đun sôi mẫu với NaOH 10 % trước khi thêm chì acetat.'] : [] });
      return S.sulfur ? res('brown', 'Dung dịch và kết tủa nâu đen PbS: có amino acid chứa lưu huỳnh (cysteine, cystine).', { ppt: C.black, positive: true }) : res('clear', 'Không có kết tủa đen: rất ít amino acid chứa lưu huỳnh.', { positive: false });
    }
    if (has('HNO3')) {
      const a = find('HNO3');
      if (!S.aromatic) return res('clear', 'Không đổi màu: không có amino acid vòng thơm (gelatin thiếu Tyr, Trp).', { positive: false });
      if (!boiled(a, TH.boilMin.xantho)) return res('paleyellow', 'Kết tủa trắng do acid làm đông protein; đun để thấy màu vàng.', { ppt: C.white });
      if (has('NH4OH')) return res('orange', 'Thêm kiềm: màu chuyển cam (muối dạng quinoid của dẫn xuất nitro).', { positive: true });
      return res('yellow', 'Đun với HNO₃ đặc: màu vàng (vòng thơm của Phe, Tyr, Trp bị nitro hoá).', { positive: true });
    }
    if (has('glyoxylic') && has('H2SO4')) {
      const h = find('H2SO4');
      if (h.mode !== 'layer') return res('brown', 'H₂SO₄ đặc bị lắc trộn: nóng lên, protein cháy thành màu nâu, không thấy vòng.', { positive: null, warn: ['Nhỏ H₂SO₄ đặc từ từ theo thành ống để tạo hai lớp, không lắc.'] });
      return S.trp ? res('clear', 'Vòng đỏ tím ở mặt phân cách hai lớp: có tryptophan.', { ring: C.violet, positive: true }) : res('clear', 'Không có vòng màu: không có tryptophan.', { positive: false });
    }
    if (has('ninhydrin')) {
      const a = find('ninhydrin');
      if (t.warm - a.warmAt < TH.boilMin.ninhydrin) return res('clear', 'Chưa sấy hoặc đun: màu chưa hiện.');
      if (S.amine === 'imino') return res('yellow', 'Màu vàng tươi: prolin có N bậc 2 trong vòng.', { positive: true });
      if (S.amine === 'primary') return res('violet', 'Màu tím: amino acid có nhóm α-NH₂ tự do.', { positive: true });
      if (S.amine === 'protein') return res('bluviolet', 'Màu tím nhạt: protein chỉ có ít nhóm NH₂ tự do.', { positive: true });
      return res('clear', 'Không có màu.', { positive: false });
    }
    if (has('nitrous')) {
      if (S.amine === 'primary') return res('clear', 'Sủi bọt khí không màu (N₂): nhóm α-NH₂ bị khử amin.', { positive: true, gas: true });
      if (S.amine === 'protein') return res('clear', 'Lác đác vài bọt khí: protein ít nhóm α-NH₂ tự do.', { positive: true, gas: true });
      return res('clear', 'Không có bọt khí: không có nhóm amin bậc 1 tự do.', { positive: false });
    }
    if (has('NaOH') && has('CuSO4')) {
      const cuMl = t.adds.filter((a) => a.r === 'CuSO4').reduce((s, a) => s + a.mL, 0);
      if (cuMl > 0.5) return res('blue', 'CuSO₄ dư: tủa Cu(OH)₂ xanh lam che mất màu phức biure.', { ppt: C.blue, warn: ['Chỉ nhỏ 1–2 giọt CuSO₄ 1 %.'] });
      if (S.peptide === 'biuret') return res('pinkviolet', 'Màu tím hồng: biure tạo phức với Cu²⁺ qua 4 liên kết phối trí.', { positive: true });
      if (S.peptide === 'protein') return res('bluviolet', 'Màu tím xanh: phức Cu²⁺ với các liên kết peptide.', { positive: true });
      return res('blue', 'Giữ màu xanh lam nhạt: amino acid tự do không có liên kết peptide.', { positive: false });
    }
    if (t.sample === 'casein' && has('acetic')) {
      const acidMmol = t.adds.filter((a) => a.r === 'acetic').reduce((s, a) => s + a.mL, 0) * 0.1;
      const pH = 4.76 + Math.log10(S.acetateMmol / Math.max(1e-6, acidMmol));
      const cs = this.data.casein;
      const d = pH - S.pI;
      const turb = Math.exp(-((d / (d > 0 ? cs.wAbove : cs.wBelow)) ** 2));
      const lvl = cs.levels.find((l) => turb >= l[0])[1];
      return res('white', `pH ${fmt(pH, 2)}: độ đục ${lvl}${turb > 0.9 ? ', gần điểm đẳng điện' : ''}.`, { ppt: turb > 0.25 ? C.white : null, positive: turb > 0.5, pH, turbidity: turb, level: lvl });
    }
    if (has('ASsat') || has('ASsolid')) {
      if (t.diluted) return res('white', 'Thêm nước: kết tủa albumin tan nhanh, kết tủa globulin tan chậm, còn trắng mờ. Kết tủa bằng muối trung tính là thuận nghịch.', { positive: true });
      if (has('ASsolid')) return res('white', 'Bão hoà muối: albumin kết tủa từ từ, hơi vẩn đục.', { ppt: C.white, positive: true });
      return res('white', 'Bán bão hoà (NH₄)₂SO₄: globulin (phân tử lớn) kết tủa nhanh, trắng đục.', { ppt: C.white, positive: true });
    }
    if (has('TCA')) return res('white', 'Kết tủa trắng đục ngay: TCA làm biến tính và kết tủa protein.', { ppt: C.white, positive: true });
    for (const metal of ['FeCl3', 'CuSO4']) {
      if (!has(metal)) continue;
      const drops = Math.round(t.adds.filter((a) => a.r === metal).reduce((s, a) => s + a.mL, 0) / 0.05);
      const need = this.data.heavyMetal[metal];
      if (drops > need) return res(metal === 'FeCl3' ? 'paleyellow' : 'blue', `Đã nhỏ ${drops} giọt: muối dư làm protein tích điện dương, kết tủa tan trở lại (cần ${need} giọt).`, { positive: true });
      return res(metal === 'FeCl3' ? 'paleyellow' : 'blue', `Kết tủa: ion kim loại nặng trung hoà điện tích protein (${drops} giọt).`, { ppt: C.white, positive: true });
    }
    if (S.kind === 'protein' && t.boil > 0) {
      const mods = t.adds.map((a) => a.r);
      let level = 2;
      let why = 'nhiệt phá các liên kết yếu, protein đông vón';
      if (mods.includes('acetic10') && mods.includes('NaClsat')) { level = 3; why = 'muối trung hoà điện tích, protein mất áo nước'; }
      else if (mods.includes('acetic10')) { level = 0; why = 'pH thấp hơn pI nhiều, protein tích điện dương nên vẫn tan'; }
      else if (mods.includes('NaOH')) { level = 0; why = 'pH cao hơn pI nhiều, protein tích điện âm nên vẫn tan'; }
      else if (mods.includes('acetic1')) { level = 4; why = 'pH gần pI cộng với nhiệt: kết tủa mạnh nhất'; }
      const words = ['không kết tủa', 'ít', 'đông vón vừa', 'kết tủa nhiều', 'kết tủa rất nhiều'];
      return res('white', `Đun sôi: ${words[level]} (${why}).`, { ppt: level ? C.white : null, positive: level > 0, level });
    }
    return res(base, 'Chưa có phản ứng đặc trưng.');
  }

  // Đường khử tương đương glucose (%): mẫu đường khử, hoặc tinh bột đã thuỷ phân (số đầu khử theo D², minh hoạ)
  #reducing(t, S) {
    if (S.kind !== 'carb') return 0;
    const D = this.#hydrolysis(t);
    if (S.starch) return S.conc * D * D;
    return S.conc * Math.max(S.reducing, D);
  }

  // Ống còn HCl chưa được trung hoà bằng NaOH thêm sau đó
  #acidLeft(t) {
    const i = t.adds.findIndex((a) => a.r === 'HCl');
    return i >= 0 && !t.adds.slice(i + 1).some((a) => a.r === 'NaOH');
  }

  #hydrolysis(t) {
    return t.hydro ? 1 - Math.exp(-this.data.hydrolysis.k * t.hydro) : 0;
  }

  // Thẻ kết quả của một ống
  #look(t) {
    const o = this.observe(t);
    t.obs = o;
    if (!o) return [];
    return [{ type: o.positive === true ? 'effect' : 'info', label: `Ống ${t.n}`, text: o.text }, ...o.warn.map((w) => ({ type: 'warning', label: 'Chưa đúng', text: w }))];
  }

  // Chỉ số của lipid bằng chuẩn độ (bài 06). index: 'acid' | 'sap' | 'iodine'
  lipidIndex({ index = 'acid', drops, reflux = true, minutes, blank = true, reagent = 'wijs', darkMin, warm = true }) {
    const L = this.data.lipid;
    const n = Number(drops ?? { acid: 15, sap: 10, iodine: 5 }[index]);
    let vol = 0;
    for (let i = 0; i < n; i++) vol += L.dropMl * (1 + L.dropCv * this.random.normal());
    const m = vol * L.density;
    const read = () => 0.03 * this.random.normal();
    const events = [{ type: 'measure', label: 'Mẫu', text: `${n} giọt dầu lạc ≈ ${fmt(m, 3)} g (thể tích giọt dao động; cân mẫu cho kết quả chính xác hơn).` }];
    let value = null;
    let row = null;
    if (index === 'acid') {
      const meqFFA = (L.acidValue * m) / 56.1;
      const seen = warm ? 1 : 0.7;
      const V = Math.max(0, (meqFFA * seen) / 0.02 + read());
      value = (V * 0.02 * 56.1) / m;
      events.push({ type: 'machine', label: 'Chuẩn độ', text: `Hoà dầu trong 20 mL ethanol 96 %${warm ? ' (đun nhẹ cho tan)' : ''}, phenolphthalein, chuẩn độ bằng KOH 0,02 N tới hồng nhạt bền 30 giây: V = ${fmt(V, 2)} mL.` });
      events.push({ type: 'effect', label: 'Chỉ số acid', text: `X = V·N·56,1/m = ${fmt(V, 2)} × 0,02 × 56,1 / ${fmt(m, 3)} = ${fmt(value, 2)} mg KOH/g. Công thức của bài (X = A·f·5,6, coi như 1 g mẫu) cho ${fmt(V * 0.02 * 56, 2)}.` });
      if (!warm) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Dầu chưa tan hết trong ethanol: một phần acid béo tự do chưa gặp KOH, chỉ số acid thấp giả.' });
      row = { V: fmt(V, 2), X: fmt(value, 2) };
    } else if (index === 'sap') {
      const min = Number(minutes ?? L.sapMinutes);
      const fKOH = 1 + 0.02 * this.random.normal();
      const A = 20 * fKOH + read();
      let done = 1 - Math.exp(-min / 12);
      let drift = 0;
      if (!reflux) {
        done *= 0.6 + 0.35 * this.random();
        drift = 1.2 * this.random.normal();
      }
      const meq = ((L.sapValue * m) / 56.1) * done;
      const B = A - meq / 0.5 + drift + read();
      events.push({ type: 'machine', label: 'Chuẩn độ', text: `Bình kiểm tra (nước) và bình mẫu, mỗi bình 20 mL KOH/ethanol, đun ${reflux ? 'hồi lưu' : 'cách thuỷ không có ống sinh hàn'} ${min} phút, chuẩn độ KOH dư bằng HCl 0,5 N: A = ${fmt(A, 2)} mL, B = ${fmt(B, 2)} mL.` });
      if (!blank) {
        events.push({ type: 'warning', label: 'Chưa đúng', text: 'Không có bình kiểm tra: không biết lượng KOH ban đầu, không tính được A − B.' });
      } else {
        value = ((A - B) * 28.05) / m;
        events.push({ type: 'effect', label: 'Chỉ số xà phòng hoá', text: `X = (A − B)·28,05/m = ${fmt(A - B, 2)} × 28,05 / ${fmt(m, 3)} = ${fmt(value, 0)} mg KOH/g (dầu lạc theo TCVN 7597:2018: 187–196).` });
      }
      if (!reflux) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Không có ống sinh hàn hồi lưu: ethanol bay hơi, hỗn hợp cạn và bắn, xà phòng hoá không hết và hai bình mất dung môi khác nhau, nên kết quả lệch xa và khác nhau giữa các nhóm (như bài 06).' });
      else if (min < 45) events.push({ type: 'warning', label: 'Chưa đúng', text: `Đun mới ${min} phút: xà phòng hoá chưa hoàn toàn (khoảng ${fmt(done * 100, 0)} %), chỉ số thấp giả.` });
      row = { A: fmt(A, 2), B: fmt(B, 2), X: value === null ? '' : fmt(value, 0) };
    } else {
      const R = L.reagents[reagent] ?? L.reagents.wijs;
      const dark = Number(darkMin ?? L.iodineDarkMin);
      const need = (L.iodineValue * m) / 12.69;
      const reacted = Math.min(need * (1 - Math.exp(-dark / 8.5)), R.meq);
      const b = R.meq / 0.1 + read();
      const a = Math.max(0, (R.meq - reacted) / 0.1 + read());
      value = (1.269 * (b - a)) / m;
      const excess = (R.meq - reacted) / R.meq;
      events.push({ type: 'machine', label: 'Chuẩn độ', text: `${R.name}, để tối ${dark} phút, thêm KI rồi chuẩn độ iod dư bằng Na₂S₂O₃ 0,1 N (chỉ thị hồ tinh bột): mẫu trắng b = ${fmt(b, 2)} mL, mẫu thử a = ${fmt(a, 2)} mL.` });
      events.push({ type: excess < 0.5 ? 'warning' : 'effect', label: 'Chỉ số iod', text: `X = 1,269·(b − a)/m = 1,269 × ${fmt(b - a, 2)} / ${fmt(m, 3)} = ${fmt(value, 1)} g I₂/100 g (dầu lạc: 80–106). Halogen còn dư ${fmt(excess * 100, 0)} %.` });
      if (excess < 0.5) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Iod không đủ dư: mẫu dùng hết gần như toàn bộ iod nên kết quả chỉ phản ánh lượng thuốc thử, không phải độ không no của dầu. Dùng ít mẫu hơn hoặc nhiều thuốc thử hơn (ISO 3961: halogen còn dư 50–60 %).' });
      if (dark < 20) events.push({ type: 'warning', label: 'Chưa đúng', text: `Để tối ${dark} phút chưa đủ cho phản ứng cộng halogen, chỉ số iod thấp giả.` });
      row = { a: fmt(a, 2), b: fmt(b, 2), X: fmt(value, 1) };
    }
    this.last = { index, value, mass: m };
    this.notebook.add({ day: '', experiment: 'Chỉ số lipid', action: BC_ACTIONS['bc-index'], subject: index, result: value === null ? '' : fmt(value, 2), ...row, m: fmt(m, 3) });
    return { ok: value !== null, value, events };
  }

  // Định lượng vitamin C trong cây thìa là bằng iod 0,01 N (bài 07): X(%) = V·V1·0,00088·100/(V2·a)
  vitaminC({ part = 'young', grams = 5, acid = true, starch = true, minutes = 20 }) {
    const V = this.data.vitc;
    const p = V.parts[part] ?? V.parts.young;
    const a = Number(grams);
    let g = (p.pct / 100) * a;
    if (!acid) g *= Math.exp(-V.lossNoAcidPerMin * Number(minutes));
    let mL = (g * (V.V2 / V.V1)) / V.factor;
    if (!starch) mL += V.noStarchOvershootMl;
    mL = Math.max(0, mL + V.readSd * this.random.normal());
    const X = (mL * V.V1 * V.factor * 100) / (V.V2 * a);
    const events = [
      { type: 'machine', label: 'Chuẩn độ', text: `Nghiền ${fmt(a, 0)} g ${p.name} với ${acid ? '5 mL HCl 5 %' : 'nước'}, định mức ${V.V1} mL, lọc, lấy ${V.V2} mL${starch ? ' + 10 giọt hồ tinh bột 1 %' : ''}, chuẩn độ bằng iod 0,01 N: V = ${fmt(mL, 2)} mL.` },
      { type: 'effect', label: 'Vitamin C', text: `X = V·V₁·0,00088·100/(V₂·a) = ${fmt(X, 3)} % (${fmt(X * 1000, 0)} mg/100 g). Bài 07: lá già > lá non > thân.` },
    ];
    if (!acid) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Chiết bằng nước: acid ascorbic bị oxy hoá trong lúc nghiền và lọc, hàm lượng thấp giả. HCl giữ vitamin C bền.' });
    if (!starch) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Không có hồ tinh bột: điểm cuối chỉ nhận ra khi iod dư đã vàng đậm, chuẩn độ lố.' });
    this.last = { index: 'vitc', value: X };
    this.notebook.add({ day: '', experiment: 'Vitamin C', action: BC_ACTIONS['bc-vitc'], subject: p.name, result: `${fmt(X, 3)} %`, V: fmt(mL, 2) });
    return { ok: acid && starch, value: X, mL, events };
  }

  // Dữ liệu cho hình bể ổn nhiệt và giá ống trong cảnh 3D
  figureData() {
    const tubes = this.tubes.filter((t) => t.sample || t.adds.length).map((t) => {
      const o = t.obs ?? this.observe(t);
      return { n: t.n, label: t.label ?? '', color: o?.color ?? this.data.colors.clear, level: Math.min(1, t.mL / 12), precipitate: o?.ppt ?? null, ring: o?.ring ?? null };
    });
    return { setC: this.bath.setC ?? ROOM, waterC: this.bath.waterC, lid: this.bath.setC !== null && this.bath.waterC >= 60 ? 'open' : 'closed', minutes: Math.round(this.min), tubes };
  }
}
