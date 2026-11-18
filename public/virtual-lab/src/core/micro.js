// Vi sinh và biến nạp plasmid (data/micro.json): pha môi trường LB, đổ đĩa có hoặc không có ampicillin, biến nạp tế bào
// khả biến E. coli theo protocol của NEB (ủ đá, sốc nhiệt 42 °C 30 giây, phục hồi trong SOC), cấy trải, ủ, đếm khuẩn
// lạc và tính hiệu suất biến nạp (cfu/µg). Hoạt tính tế bào lấy từ kho lạnh; thao tác ngoài tủ an toàn sinh học hoặc
// dụng cụ chưa tiệt trùng thì có khuẩn lạc lạ. Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const MB_ACTIONS = {
  'mb-medium': 'Pha môi trường LB agar',
  'mb-pour': 'Đổ đĩa',
  'mb-transform': 'Biến nạp',
  'mb-spread': 'Cấy trải',
  'mb-incubate': 'Ủ đĩa',
  'mb-count': 'Đếm khuẩn lạc',
};
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');
const sci = (x) => {
  if (!x) return '0';
  const e = Math.floor(Math.log10(x));
  return `${fmt(x / 10 ** e, 1)} × 10${String(e).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c] ?? '⁻').join('')}`;
};

export class MicroLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.medium = null;
    this.plates = [];
    this.tube = null;
    this.hours = 0;
    this.last = null;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = {
      'mb-medium': () => this.makeMedium(params),
      'mb-pour': () => this.pour(params),
      'mb-transform': () => this.transform(params),
      'mb-spread': () => this.spread(params),
      'mb-incubate': () => this.incubate(params),
      'mb-count': () => this.count(params),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  // Poisson cho số lớn: xấp xỉ chuẩn
  #poisson(mean) {
    if (mean <= 0) return 0;
    if (mean > 50) return Math.max(0, Math.round(mean + Math.sqrt(mean) * this.random.normal()));
    return this.random.poisson(mean);
  }

  makeMedium({ autoclave = true }) {
    this.medium = { sterile: Boolean(autoclave) };
    return { ok: true, events: [{ type: 'machine', label: 'Môi trường', text: `Pha LB agar (tryptone 10 g/L, cao nấm men 5 g/L, NaCl 10 g/L, agar 15 g/L)${autoclave ? ', hấp 121 °C 20 phút' : ', không hấp tiệt trùng'}.` }, ...(autoclave ? [] : [{ type: 'warning', label: 'Chưa đúng', text: 'Môi trường chưa hấp: bào tử vi khuẩn và nấm trong bột và nước sẽ mọc lên trên mọi đĩa.' }])] };
  }

  // kind 'LB+' (ampicillin) hoặc 'LB-'; agarC: nhiệt độ thạch lúc cho kháng sinh; sterile: đổ trong tủ an toàn sinh học đang bảo vệ mẫu
  pour({ kind = 'LB+', agarC = 55, n = 1, where = 'bsc', sterile = true }) {
    if (!this.medium) this.makeMedium({ autoclave: true });
    const A = this.data.amp;
    const amp = kind === 'LB+';
    const T = Number(agarC);
    const k = A.k55 * Math.exp(A.slope * (T - 55));
    const left = amp ? A.mgL * Math.exp(-k * A.setMin) : 0;
    const clean = where === 'bsc' && sterile;
    for (let i = 0; i < n; i++) {
      this.plates.push({ id: this.plates.length + 1, kind, ampLeft: left, clean, mediumSterile: this.medium.sterile, sample: null });
    }
    const events = [{ type: 'machine', label: 'Đổ đĩa', text: `Đổ ${n} đĩa ${kind}${amp ? ` (ampicillin 100 µg/mL cho vào khi thạch ${T} °C, còn khoảng ${fmt(left, 0)} µg/mL)` : ''} ${where === 'bsc' ? 'trong tủ an toàn sinh học' : 'trên bàn'}.` }];
    if (amp && left < A.mic) events.push({ type: 'warning', label: 'Chưa đúng', text: `Thạch còn ${T} °C khi cho ampicillin: kháng sinh bị phân huỷ gần hết, đĩa không còn chọn lọc được. Để thạch nguội tới khoảng 50–55 °C (cầm được bình bằng tay).` });
    else if (amp && T < 45) events.push({ type: 'warning', label: 'Lưu ý', text: 'Thạch dưới 45 °C bắt đầu đông vón, đĩa lổn nhổn.' });
    if (!clean) events.push({ type: 'warning', label: 'Chưa đúng', text: where === 'bsc' ? 'Tủ an toàn sinh học chưa ở trạng thái bảo vệ mẫu (kính, quạt): bụi và bào tử rơi vào đĩa.' : 'Đổ đĩa trên bàn hở: bụi và bào tử trong không khí rơi vào thạch.' });
    this.notebook.add({ day: '', experiment: 'Vi sinh', action: MB_ACTIONS['mb-pour'], subject: kind, result: `${n} đĩa`, agarC: T, amp: fmt(left, 0) });
    return { ok: true, events };
  }

  // activity: hoạt tính tế bào khả biến theo kho lạnh (0–1)
  transform({ dnaPg = 100, mix = 'flick', iceMin = 30, shockC = 42, shockS = 30, medium = 'SOC', outMin = 60, activity = 1 }) {
    const C = this.data.cells;
    const F = this.data.factors;
    const s = Number(shockS);
    const shockOn = s > 0;
    const uptake = (t) => 1 - Math.exp(-t / F.shockUptakeS);
    const h = (t) => uptake(t) * Math.exp(-F.shockKillPerS * t);
    const fTime = shockOn ? h(s) / h(30) : F.noShock;
    const fTemp = shockOn ? Math.exp(-(((Number(shockC) - F.shockOptC) / F.shockWidthC) ** 2)) : 1;
    const fIce = Number(iceMin) >= F.iceMin ? 1 : 2 ** (-(F.iceMin - Number(iceMin)) / F.iceHalvingMin);
    const fMix = mix === 'vortex' ? F.vortex : 1;
    const fMed = medium === 'SOC' ? 1 : F.lbInsteadOfSoc;
    const fOut = Number(outMin) >= F.outMin ? 1 : 2 ** (-(F.outMin - Number(outMin)) / F.outHalvingMin);
    const eff = C.efficiency * activity * fTime * fTemp * fIce * fMix * fMed * fOut * Math.exp(0.15 * this.random.normal());
    const V = (C.volUl + 950) / 1000; // mL
    const transformants = eff * (Number(dnaPg) * 1e-6);
    const killed = shockOn ? Math.exp(-F.shockKillPerS * Math.max(0, s - 30)) * (Number(shockC) > 43 ? 0.7 : 1) : 1;
    const grow = 2 ** (Number(outMin) / C.outgrowthDoubleMin * (medium === 'SOC' ? 1 : 0.8));
    const viable = (C.perMl * (C.volUl / 1000) * C.survival * activity ** 0.3 * killed * grow) / V;
    this.tube = { perMl: transformants / V, viablePerMl: viable, V, dnaPg: Number(dnaPg), eff };
    const events = [{ type: 'machine', label: 'Biến nạp', text: `${C.volUl} µL ${C.name} + ${fmt(dnaPg / 1000, 2)} ng plasmid (trộn bằng ${mix === 'vortex' ? 'vortex' : 'búng nhẹ'}), đá ${iceMin} phút, sốc nhiệt ${shockOn ? `${fmt(shockC, 1)} °C ${s} giây` : 'không'}, đá 5 phút, ${950} µL ${medium}, 37 °C lắc 250 rpm ${outMin} phút.` }];
    const bad = [];
    if (activity < 0.6) bad.push(`tế bào khả biến chỉ còn khoảng ${fmt(activity * 100, 0)} % hoạt tính (rã đông rồi đông lại, hoặc để ở −20 °C)`);
    if (!shockOn) bad.push('không sốc nhiệt: rất ít DNA vào được tế bào');
    else if (Math.abs(Number(shockC) - F.shockOptC) >= 1) bad.push(`sốc nhiệt ${fmt(shockC, 1)} °C thay vì đúng 42 °C (bài 11: bể nhảy lên 44 °C, biến nạp thất bại)`);
    if (shockOn && s > 45) bad.push(`sốc nhiệt ${s} giây: tế bào bị tổn thương (80 giây mất khoảng 60 %)`);
    if (Number(iceMin) < F.iceMin) bad.push(`ủ đá ${iceMin} phút: mỗi 10 phút bớt đi hiệu suất giảm một nửa`);
    if (mix === 'vortex') bad.push('vortex làm vỡ tế bào khả biến: chỉ búng nhẹ ống');
    if (medium !== 'SOC') bad.push('phục hồi bằng LB thay vì SOC');
    if (Number(outMin) < F.outMin) bad.push(`phục hồi ${outMin} phút: gen kháng ampicillin chưa kịp biểu hiện`);
    events.push({ type: bad.length ? 'warning' : 'effect', label: bad.length ? 'Chưa đúng' : 'Tác dụng', text: bad.length ? `${bad.join('; ')}.` : 'CaCl₂ làm màng tế bào và DNA bớt đẩy nhau; sốc nhiệt tạo chênh lệch nhiệt độ giúp plasmid đi qua màng; SOC giàu dinh dưỡng giúp tế bào hồi phục và biểu hiện β-lactamase trước khi gặp ampicillin.' });
    this.notebook.add({ day: '', experiment: 'Biến nạp', action: MB_ACTIONS['mb-transform'], subject: `${fmt(shockC, 1)} °C ${s} s`, result: sci(eff), activity: fmt(activity, 2) });
    return { ok: !bad.length, events };
  }

  // Cấy trải volUl µL dịch đã pha loãng dilution lần lên một đĩa trống loại kind
  spread({ kind = 'LB+', volUl = 100, dilution = 1, where = 'bsc', sterile = true, spreader = 'flamed' }) {
    if (!this.tube) return { ok: false, events: [{ type: 'warning', text: 'Chưa có dịch biến nạp: làm bước biến nạp trước.' }] };
    const p = this.plates.find((x) => x.kind === kind && !x.sample);
    if (!p) return { ok: false, events: [{ type: 'warning', text: `Không còn đĩa ${kind} trống: đổ thêm đĩa.` }] };
    const mL = Number(volUl) / 1000 / Number(dilution);
    p.sample = { trans: this.tube.perMl * mL, viable: this.tube.viablePerMl * mL, dilution: Number(dilution), volUl: Number(volUl), clean: where === 'bsc' && sterile, flamed: spreader === 'flamed' };
    const events = [{ type: 'machine', label: `Đĩa ${p.id} (${kind})`, text: `Cấy trải ${volUl} µL dịch ${Number(dilution) > 1 ? `pha loãng ${dilution.toLocaleString('fr-FR')} lần` : 'không pha loãng'} bằng que gạt ${spreader === 'flamed' ? 'đã hơ lửa và để nguội' : 'chưa tiệt trùng'}.` }];
    if (spreader !== 'flamed') events.push({ type: 'warning', label: 'Chưa đúng', text: 'Que gạt chưa nhúng cồn hơ lửa: mang vi khuẩn lạ lên đĩa.' });
    if (where !== 'bsc' || !sterile) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Cấy ngoài vùng vô trùng: dễ nhiễm tạp.' });
    return { ok: true, events };
  }

  incubate({ hours = 16, T = 37 }) {
    this.hours += Number(hours) * (Number(T) >= 35 ? 1 : 1 / 1.6);
    return { ok: true, events: [{ type: 'machine', label: 'Tủ ấm', text: `Úp ngược đĩa, ủ ${hours} giờ ở ${T} °C.` }] };
  }

  count() {
    const G = this.data.growth;
    const N = this.data.count;
    const A = this.data.amp;
    const Ct = this.data.contamination;
    const rows = [];
    const events = [];
    if (this.hours < G.visibleH) return { ok: false, events: [{ type: 'warning', label: 'Chưa đếm được', text: `Mới ủ ${fmt(this.hours, 0)} giờ: khuẩn lạc chưa đủ lớn để thấy bằng mắt (cần khoảng ${G.fullH} giờ ở 37 °C).` }] };
    let effOut = null;
    for (const p of this.plates.filter((x) => x.sample)) {
      const s = p.sample;
      const selective = p.kind === 'LB+' && p.ampLeft >= A.mic;
      const mean = selective ? s.trans : s.viable;
      const n = this.#poisson(mean);
      const contamMean = (p.mediumSterile ? 0 : Ct.unsterileMedium) + (p.clean ? 0 : Ct.openBench) + (s.clean ? 0 : Ct.openBench) + (s.flamed ? 0 : Ct.unflamedSpreader);
      const contam = this.#poisson(contamMean * (selective ? 1 - Ct.ampSensitive : 1));
      const sat = selective && this.hours > A.satelliteH ? Math.round(n * 0.5) : 0;
      const shown = n >= N.lawn ? 'mọc kín đĩa' : n > N.max ? `quá nhiều (> ${N.max})` : String(n);
      rows.push([`Đĩa ${p.id} (${p.kind})`, `${s.volUl} µL, pha loãng ${s.dilution.toLocaleString('fr-FR')}`, shown, contam ? String(contam) : '0', sat ? String(sat) : '—']);
      if (p.kind === 'LB+' && !selective) events.push({ type: 'warning', label: 'Chưa đúng', text: `Đĩa ${p.id}: ampicillin còn ${fmt(p.ampLeft, 0)} µg/mL, không chọn lọc được: cả tế bào không mang plasmid cũng mọc.` });
      if (contam) events.push({ type: 'warning', label: 'Nhiễm tạp', text: `Đĩa ${p.id}: ${contam} khuẩn lạc lạ (to, bờ không đều, màu khác hoặc sợi nấm) không phải E. coli.` });
      if (sat) events.push({ type: 'info', label: 'Khuẩn lạc vệ tinh', text: `Đĩa ${p.id}: ủ ${fmt(this.hours, 0)} giờ, quanh khuẩn lạc lớn xuất hiện khuẩn lạc nhỏ không mang plasmid (β-lactamase đã phân huỷ ampicillin quanh đó). Không đếm khuẩn lạc vệ tinh.` });
      if (p.kind === 'LB+' && selective && n >= N.min && n <= N.max && effOut === null) {
        const total = n * s.dilution * (this.tube.V * 1000) / s.volUl;
        effOut = total / (this.tube.dnaPg * 1e-6);
      }
      if (p.kind === 'LB-' && n >= N.lawn) events.push({ type: 'info', label: 'Đĩa LB−', text: `Đĩa ${p.id} mọc kín: dịch chưa pha loãng đủ (bài 11, nhóm 7.3). Đĩa LB− chỉ để chứng minh tế bào còn sống.` });
    }
    const lbPlus = rows.filter((r) => r[0].includes('LB+'));
    if (effOut !== null) events.unshift({ type: 'effect', label: 'Hiệu suất', text: `Hiệu suất biến nạp = số khuẩn lạc × độ pha loãng × thể tích dịch / thể tích cấy / lượng DNA = ${sci(effOut)} cfu/µg (NEB 5-alpha: 1–3 × 10⁹ cfu/µg pUC19).` });
    else if (lbPlus.length && lbPlus.every((r) => r[2] === '0')) events.unshift({ type: 'warning', label: 'Hiệu suất', text: 'Không có khuẩn lạc trên đĩa LB+: hiệu suất H = 0, biến nạp thất bại (như nhóm 7.1 ở bài 11).' });
    else if (lbPlus.length) events.unshift({ type: 'info', label: 'Hiệu suất', text: 'Chưa có đĩa LB+ nào đếm được trong khoảng 30–300 khuẩn lạc: pha loãng lại để đếm chính xác.' });
    this.last = { efficiency: effOut, rows };
    this.notebook.add({ day: '', experiment: 'Biến nạp', action: MB_ACTIONS['mb-count'], subject: `${fmt(this.hours, 0)} giờ`, result: effOut === null ? '' : sci(effOut), plates: rows.map((r) => `${r[0]}: ${r[2]}`).join('; ') });
    return { ok: effOut !== null, efficiency: effOut, table: { head: ['Đĩa', 'Cấy', 'Khuẩn lạc', 'Khuẩn lạc lạ', 'Vệ tinh'], rows }, events };
  }

  figureData() {
    // Ống phục hồi trong SOC (lắc 250 rpm) và bình LB + ampicillin nuôi qua đêm (OD600 tăng theo số giờ ủ, minh hoạ)
    const od = Math.min(3, 0.02 * 2 ** (this.hours / 1.5));
    return { setC: 37, tempC: 37, rpm: this.tube ? 250 : 0, door: 'closed', hours: Math.round(this.hours * 10) / 10, flasks: this.tube ? [{ label: 'SOC phục hồi', od: 0.3, kind: 'tube' }, ...(this.hours ? [{ label: 'LB + Amp qua đêm', od, kind: 'flask' }] : [])] : [] };
  }
}
