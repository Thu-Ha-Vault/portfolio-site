// Proteomics (bài 02, 04, 05, 07 Proteomics của chủ dự án; data/proteins.json): SDS-PAGE, điện di hai chiều (IEF trên
// thanh IPG rồi SDS-PAGE), nhuộm Coomassie, định lượng spot theo %V như Phoretix, thuỷ phân trong gel bằng trypsin,
// phổ MALDI-TOF và nhận dạng bằng dấu vân tay khối lượng peptide (PMF) với điểm kiểu Mascot. Khối lượng và pI tính từ
// trình tự UniProt. Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';
import { rfOf as gelRf, LADDER } from '../../figures/sdspage/model.mjs';

export const PR_ACTIONS2 = {
  'pt-sds': 'SDS-PAGE',
  'pt-2d': 'Điện di hai chiều',
  'pt-spots': 'Phân tích spot (%V)',
  'pt-digest': 'Thuỷ phân trong gel',
  'pt-maldi': 'Đo MALDI-TOF',
  'pt-pmf': 'Tra cứu PMF',
  'pt-compare': 'So sánh hai gel 2D',
};
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');

// Khối lượng gốc amino acid (Da): đơn đồng vị và trung bình
const MONO = { G: 57.02146, A: 71.03711, S: 87.03203, P: 97.05276, V: 99.06841, T: 101.04768, C: 103.00919, L: 113.08406, I: 113.08406, N: 114.04293, D: 115.02694, Q: 128.05858, K: 128.09496, E: 129.04259, M: 131.04049, H: 137.05891, F: 147.06841, R: 156.10111, Y: 163.06333, W: 186.07931 };
const AVG = { G: 57.0519, A: 71.0788, S: 87.0782, P: 97.1167, V: 99.1326, T: 101.1051, C: 103.1388, L: 113.1594, I: 113.1594, N: 114.1038, D: 115.0886, Q: 128.1307, K: 128.1741, E: 129.1155, M: 131.1926, H: 137.1411, F: 147.1766, R: 156.1875, Y: 163.176, W: 186.2132 };
const WATER = 18.01056;
const PROTON = 1.00728;
const CAM = 57.02146;
// pKa theo bảng của EMBOSS iep
const PKA = { Nt: 8.6, Ct: 3.6, K: 10.8, R: 12.5, H: 6.5, D: 3.9, E: 4.1, C: 8.5, Y: 10.1 };

export function averageMass(seq) {
  let m = 18.01528;
  for (const a of seq) m += AVG[a] ?? 110;
  return m;
}

export function isoelectric(seq) {
  const n = {};
  for (const a of seq) n[a] = (n[a] ?? 0) + 1;
  const charge = (pH) => {
    const pos = (pk) => 1 / (1 + 10 ** (pH - pk));
    const neg = (pk) => -1 / (1 + 10 ** (pk - pH));
    return pos(PKA.Nt) + neg(PKA.Ct) + (n.K ?? 0) * pos(PKA.K) + (n.R ?? 0) * pos(PKA.R) + (n.H ?? 0) * pos(PKA.H) + (n.D ?? 0) * neg(PKA.D) + (n.E ?? 0) * neg(PKA.E) + (n.C ?? 0) * neg(PKA.C) + (n.Y ?? 0) * neg(PKA.Y);
  };
  let lo = 0;
  let hi = 14;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (charge(mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Peptide trypsin: cắt sau K/R trừ khi trước P; missed: số vị trí bỏ sót tối đa. Trả [{ seq, start, mh }]
export function tryptic(seq, { missed = 1, cam = true, min = 700, max = 3500 } = {}) {
  const cuts = [0];
  for (let i = 0; i < seq.length - 1; i++) if ((seq[i] === 'K' || seq[i] === 'R') && seq[i + 1] !== 'P') cuts.push(i + 1);
  cuts.push(seq.length);
  const out = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    for (let m = 0; m <= missed && i + m + 1 < cuts.length; m++) {
      const p = seq.slice(cuts[i], cuts[i + m + 1]);
      let mass = WATER + PROTON;
      for (const a of p) mass += (MONO[a] ?? 110) + (cam && a === 'C' ? CAM : 0);
      if (mass >= min && mass <= max) out.push({ seq: p, start: cuts[i], mh: mass, missed: m });
    }
  }
  return out;
}

// Rf trên gel SDS: bảng di chuyển của thang Precision Plus theo % gel (figures/sdspage/model.mjs, đo trên biểu đồ của
// Bio-Rad, minh hoạ); dùng chung với hình bộ điện di protein đứng
export function rfOf(kDa, percent = 10) {
  return gelRf(kDa, percent);
}

export class ProteomicsLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    // Chuỗi trưởng thành: khối lượng biểu kiến = trình tự + N-glycan × 2,2 kDa + vùng biến đổi (Ig)
    this.proteins = data.proteins.map((p) => ({ ...p, kDa: averageMass(p.seq) / 1000 + p.nGlycan * 2.2 + (p.variableKDa ?? 0), pI: isoelectric(p.seq) }));
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.gel = null;
    this.sdsGel = null;
    this.spots = [];
    this.picked = null;
    this.peptides = null;
    this.peaks = null;
    this.last = null;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'pt-sds': () => this.sds(params), 'pt-2d': () => this.twoD(params), 'pt-spots': () => this.spotTable(params), 'pt-digest': () => this.digest(params), 'pt-maldi': () => this.maldi(params), 'pt-pmf': () => this.pmf(params), 'pt-compare': () => this.compare(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #plasma() {
    return this.proteins.filter((p) => p.abundance > 0);
  }

  // SDS-PAGE một chiều: mẫu huyết tương hoặc albumin tinh khiết; không khử thì chuỗi Hp, Ig, C3 không tách
  sds({ sample = 'plasma', percent = 10, loadUg = 20, reduce = true }) {
    const list = sample === 'albumin' ? this.proteins.filter((p) => p.id === 'ALBU') : this.#plasma();
    const total = list.reduce((s, p) => s + p.abundance, 0) || 1;
    let bands = list.map((p) => ({ name: p.name, kDa: p.kDa, ug: sample === 'albumin' ? loadUg : (loadUg * p.abundance) / total }));
    if (!reduce) {
      bands = bands.filter((b) => !/chuỗi/.test(b.name));
      bands.push({ name: 'IgG nguyên (không khử)', kDa: 150, ug: (loadUg * 9) / total }, { name: 'Haptoglobin (không khử)', kDa: 100, ug: loadUg / total });
    }
    const out = bands.map((b) => ({ ...b, rf: rfOf(b.kDa, Number(percent)), w: Math.min(1, Math.log10(1 + b.ug / 0.1) / 2.5) })).filter((b) => b.ug >= 0.1);
    this.gel = { kind: 'sds', bands: out, percent: Number(percent) };
    this.sdsGel = this.gel;
    const events = [{ type: 'machine', label: 'SDS-PAGE', text: `${loadUg} µg ${sample === 'albumin' ? 'albumin' : 'huyết tương'} ${reduce ? 'khử bằng DTT, ' : ''}đun 95 °C 5 phút trong đệm Laemmli, gel ${percent} %, 200 V 35 phút, nhuộm Coomassie: ${out.length} băng thấy được.` }];
    events.push({ type: 'info', label: 'Băng chính', text: out.sort((a, b) => b.w - a.w).slice(0, 5).map((b) => `${b.name} khoảng ${fmt(b.kDa, 0)} kDa`).join('; ') });
    if (out.some((b) => b.ug > 15)) events.push({ type: 'info', text: 'Albumin chiếm hơn một nửa protein huyết tương nên băng 66 kDa to và loe, che các protein gần đó: các nghiên cứu thường loại bỏ albumin và IgG trước.' });
    return { ok: true, events };
  }

  // Điện di hai chiều: IEF trên thanh IPG 7 cm (Vh: vôn·giờ), cân bằng DTT rồi iodoacetamide, SDS-PAGE, nhuộm CBB
  twoD({ loadUg = 170, ipg = '3-10', vh = 10000, equilibrate = true, ureaWarm = false, percent = 10 }) {
    const [pHlo, pHhi] = ipg.split('-').map(Number);
    const list = this.#plasma();
    const total = list.reduce((s, p) => s + p.abundance, 0);
    const focus = Math.min(1, Number(vh) / 8000); // thanh 7 cm cần khoảng 8–10 kVh (minh hoạ)
    const spots = [];
    for (const p of list) {
      const ug = (loadUg * p.abundance) / total;
      const n = p.nGlycan;
      // Dạng glycan khác nhau về số acid sialic: một dãy spot lệch về phía acid (minh hoạ)
      const forms = n ? n + 1 : 1;
      for (let k = 0; k < forms; k++) {
        const share = n ? binom(n, k) / 2 ** n : 1;
        const pI = p.pI - 0.08 * k;
        if (pI < pHlo || pI > pHhi) continue;
        spots.push({ id: `${p.id}${forms > 1 ? `-${k + 1}` : ''}`, protein: p.id, name: p.name, pI, kDa: p.kDa, ug: ug * share, x: (pI - pHlo) / (pHhi - pHlo), y: rfOf(p.kDa, Number(percent)), smearX: 1 - focus, smearY: equilibrate ? 0 : 0.6 });
      }
      if (ureaWarm) spots.push({ id: `${p.id}-carb`, protein: p.id, name: `${p.name} (carbamyl hoá)`, pI: p.pI - 0.25, kDa: p.kDa, ug: ug * 0.2, x: (p.pI - 0.25 - pHlo) / (pHhi - pHlo), y: rfOf(p.kDa, Number(percent)), smearX: 1 - focus, smearY: 0, artifact: true });
    }
    // Ngưỡng phát hiện của Coomassie khoảng 0,1 µg mỗi spot (minh hoạ)
    this.spots = spots.filter((s) => s.ug >= 0.1 && s.x >= 0 && s.x <= 1);
    this.gel = { kind: '2d', spots: this.spots, ipg, percent: Number(percent) };
    const events = [{ type: 'machine', label: '2D-PAGE', text: `${loadUg} µg protein huyết tương trương vào thanh IPG ${ipg} 7 cm qua đêm, IEF ${Number(vh).toLocaleString('fr-FR')} Vh ở 20 °C${equilibrate ? ', cân bằng 10 phút trong DTT rồi 10 phút trong iodoacetamide' : ''}, SDS-PAGE ${percent} %, nhuộm CBB R-250: thấy ${this.spots.length} spot.` }];
    if (focus < 0.8) events.push({ type: 'warning', label: 'Chưa đúng', text: `IEF mới ${Number(vh).toLocaleString('fr-FR')} Vh: protein chưa tới pI, spot kéo vệt ngang.` });
    if (!equilibrate) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Bỏ bước cân bằng: protein chưa bọc SDS, cầu disulfide còn nguyên, spot kéo vệt dọc và chạy sai khối lượng.' });
    if (ureaWarm) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Đệm urea bị làm ấm quá 30 °C: urea phân huỷ thành cyanate gắn vào lysine (carbamyl hoá), mỗi protein có thêm dãy spot lệch về phía acid.' });
    this.notebook.add({ day: '', experiment: 'Proteomics', action: PR_ACTIONS2['pt-2d'], subject: `IPG ${ipg}`, result: `${this.spots.length} spot`, vh });
    return { ok: focus >= 0.8 && equilibrate && !ureaWarm, events };
  }

  // %V như Phoretix: thể tích spot / tổng thể tích mọi spot × 100 (thể tích tỉ lệ lượng protein, có nhiễu đo)
  spotTable({ top = 10 }) {
    if (!this.spots.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa có gel 2D.' }] };
    const vols = this.spots.map((s) => ({ s, v: s.ug * (1 + 0.08 * this.random.normal()) }));
    const sum = vols.reduce((t, x) => t + x.v, 0);
    const rows = vols.sort((a, b) => b.v - a.v).slice(0, Number(top)).map(({ s, v }, i) => [String(i + 1), s.id, s.name, fmt(s.pI, 2), fmt(s.kDa, 1), `${fmt((v / sum) * 100, 2)} %`]);
    return { ok: true, table: { head: ['#', 'Spot', 'Protein', 'pI', 'kDa', '%V'], rows }, events: [{ type: 'machine', label: 'Phoretix', text: `${this.spots.length} spot; %V = thể tích spot / tổng thể tích mọi spot × 100, so được giữa các gel.` }] };
  }

  // So sánh gel thứ hai cùng mẫu với gel hiện tại (bài 04): nạp lệch loadRatio lần; so bằng thể tích thô hoặc %V.
  // Spot "khác biệt" theo tiêu chí tỉ lệ ≥ 1,5 hoặc < 0,66 (như Dong et al. 2022). Sai số kỹ thuật của thể tích spot
  // giữa các gel khoảng 20 % (minh hoạ), nên vẫn có vài spot khác biệt giả: cần lặp lại và kiểm định thống kê.
  compare({ loadRatio = 1, normalize = true }) {
    if (!this.spots.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa có gel 2D để làm gel tham chiếu.' }] };
    const cv = 0.2;
    const r = Number(loadRatio);
    const a = this.spots.map((s) => s.ug * Math.max(0.05, 1 + cv * this.random.normal()));
    const b = this.spots.map((s) => s.ug * r * Math.max(0.05, 1 + cv * this.random.normal()));
    const sa = a.reduce((x, y) => x + y, 0);
    const sb = b.reduce((x, y) => x + y, 0);
    const ratio = this.spots.map((_, i) => (normalize ? b[i] / sb / (a[i] / sa) : b[i] / a[i]));
    const diff = ratio.map((x, i) => ({ i, x })).filter(({ x }) => x >= 1.5 || x < 0.66);
    const rows = diff.sort((p, q) => Math.abs(Math.log(q.x)) - Math.abs(Math.log(p.x))).slice(0, 8).map(({ i, x }) => [this.spots[i].id, this.spots[i].name, fmt(x, 2), x >= 1 ? 'tăng' : 'giảm']);
    const events = [{ type: 'machine', label: 'So sánh gel', text: `Gel thứ hai cùng mẫu huyết tương${r !== 1 ? `, nạp nhiều hơn ${fmt(r, 1)} lần` : ''}; khớp ${this.spots.length} spot theo vị trí, so bằng ${normalize ? '%V (thể tích chuẩn hoá)' : 'thể tích thô'}: ${diff.length}/${this.spots.length} spot có tỉ lệ ≥ 1,5 hoặc < 0,66.` }];
    if (!normalize && r !== 1) events.push({ type: 'warning', label: 'Chưa chuẩn hoá', text: 'So thể tích thô giữa hai gel nạp lượng khác nhau: gần như mọi spot đều "tăng" giả. %V chia cho tổng thể tích của từng gel nên bỏ được chênh lệch lượng nạp.' });
    else events.push({ type: 'info', label: 'Lưu ý', text: 'Cùng một mẫu mà vẫn có spot "khác biệt": đó là sai số kỹ thuật giữa các gel. Cần ít nhất 3 gel mỗi nhóm và kiểm định thống kê, như nghiên cứu exosome ung thư gan (p < 0,05).' });
    this.notebook.add({ day: '', experiment: 'Proteomics', action: PR_ACTIONS2['pt-compare'], subject: `nạp ${r}×`, result: `${diff.length} spot khác biệt`, normalize });
    return { ok: true, table: rows.length ? { head: ['Spot', 'Protein', 'Tỉ lệ', 'Chiều'], rows } : null, falsePositive: diff.length / this.spots.length, events };
  }

  // Cắt spot (theo mã protein), tẩy màu, khử DTT, alkyl hoá IAA, trypsin 37 °C; găng tay để tránh keratin từ da, tóc
  digest({ spot = 'TRFE', destain = true, reduce = true, alkylate = true, trypsinMin = 960, gloves = true }) {
    const p = this.proteins.find((x) => x.id === spot || spot.startsWith(`${x.id}-`));
    if (!p) return { ok: false, events: [{ type: 'warning', text: `Không có spot ${spot}.` }] };
    const missedBias = trypsinMin >= 60 ? 0.15 : 0.6;
    const pep = tryptic(p.seq, { missed: 1, cam: reduce && alkylate });
    // Peptide thu hồi được: phụ thuộc độ dài và ngẫu nhiên; mất màu chưa hết thì ít peptide hơn
    const keep = pep.filter((x) => this.random() < (x.missed ? missedBias : 1 - missedBias * 0.5) * (destain ? 0.55 : 0.2) * (x.seq.includes('C') && !(reduce && alkylate) ? 0.2 : 1));
    const extra = gloves ? [] : ['K1C10', 'K2C1'].flatMap((id) => tryptic(this.proteins.find((x) => x.id === id).seq, { missed: 0 }).filter(() => this.random() < 0.25).map((x) => ({ ...x, from: id })));
    const auto = tryptic(this.proteins.find((x) => x.id === 'TRYP').seq, { missed: 0 }).filter((x) => Math.abs(x.mh - 842.51) < 0.05 || Math.abs(x.mh - 2211.1) < 0.1).map((x) => ({ ...x, from: 'TRYP' }));
    this.picked = p;
    this.peptides = [...keep.map((x) => ({ ...x, from: p.id })), ...extra, ...auto];
    const events = [{ type: 'machine', label: 'Thuỷ phân', text: `Cắt spot ${p.name}, ${destain ? 'tẩy màu bằng ABC/AcCN tới khi trắng, ' : ''}${reduce ? 'khử bằng DTT, ' : ''}${alkylate ? 'alkyl hoá bằng IAA trong tối, ' : ''}trypsin 37 °C ${trypsinMin >= 60 ? `${Math.round(trypsinMin / 60)} giờ` : `${trypsinMin} phút`}, làm sạch bằng Ziptip C18: thu khoảng ${keep.length} peptide của protein.` }];
    if (!destain) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Chưa tẩy hết Coomassie: thuốc nhuộm cản trypsin và ức chế ion hoá, ít peptide.' });
    if (!(reduce && alkylate)) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Không khử và alkyl hoá: peptide chứa cystein nối nhau bằng cầu disulfide, khối lượng không khớp với tra cứu có Carbamidomethyl (C).' });
    if (trypsinMin < 60) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Ủ trypsin quá ngắn: nhiều vị trí cắt bị bỏ sót.' });
    if (!gloves) events.push({ type: 'warning', label: 'Nhiễm keratin', text: 'Không đeo găng, để tóc rơi vào: peptide keratin lẫn vào mẫu, protein nhiễm hay gặp nhất trong proteomics (bài 07).' });
    return { ok: true, events };
  }

  // Phổ MALDI-TOF: ion đơn điện tích [M+H]⁺; hiệu chuẩn nội bằng peptide tự cắt của trypsin (842,509 và 2211,104)
  maldi({ matrix = 'CHCA', calibration = 'internal', peaks = 15 }) {
    if (!this.peptides) return { ok: false, events: [{ type: 'warning', text: 'Chưa thuỷ phân spot nào.' }] };
    const sd = calibration === 'internal' ? 15 : 30;
    const offset = calibration === 'internal' ? 0 : 90;
    const signal = matrix === 'SA' ? 0.35 : 1;
    const list = this.peptides.filter(() => this.random() < signal).map((x) => ({ mz: x.mh * (1 + (offset + sd * this.random.normal()) * 1e-6), from: x.from, seq: x.seq, I: 0.2 + this.random() }));
    for (let i = 0; i < 3; i++) list.push({ mz: 800 + this.random() * 2500, from: 'nhiễu', I: 0.15 * this.random() });
    this.peaks = list.sort((a, b) => b.I - a.I).slice(0, Number(peaks)).sort((a, b) => a.mz - b.mz);
    const events = [{ type: 'machine', label: 'MALDI-TOF', text: `Chất nền ${matrix}, hiệu chuẩn ${calibration === 'internal' ? 'nội bằng peptide tự cắt của trypsin' : 'ngoại'}: ${this.peaks.length} đỉnh [M+H]⁺: ${this.peaks.map((x) => fmt(x.mz, 3)).join('; ')}.` }];
    if (matrix === 'SA') events.push({ type: 'warning', label: 'Chưa đúng', text: 'Sinapinic acid hợp với protein nguyên (> 10 kDa); peptide cho tín hiệu yếu, nên dùng CHCA.' });
    return { ok: true, peaks: this.peaks.map((x) => x.mz), events };
  }

  // Tra cứu PMF trong cơ sở dữ liệu nhỏ (các protein trong data/proteins.json); điểm kiểu Mascot = −10·log10(P) với P là
  // xác suất số đỉnh khớp do ngẫu nhiên (phân phối nhị thức); ngưỡng p < 0,05 tính theo cỡ SwissProt (khoảng 570 000 mục)
  pmf({ tolDa = null, tolPpm = 50, missed = 1, cam = true }) {
    if (!this.peaks?.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa có danh sách đỉnh.' }] };
    const q = this.peaks.map((x) => x.mz);
    const range = [700, 3500];
    const hits = this.proteins.filter((p) => p.id !== 'TRYP').map((p) => {
      const theo = tryptic(p.seq, { missed, cam, min: range[0], max: range[1] });
      const tol = (m) => (tolDa !== null ? Number(tolDa) : (m * Number(tolPpm)) / 1e6);
      const matched = q.map((m) => theo.find((t) => Math.abs(t.mh - m) <= tol(m))).filter(Boolean);
      const k = matched.length;
      const pRand = Math.min(0.99, (theo.length * 2 * tol(2000)) / (range[1] - range[0]));
      const P = binomTail(q.length, k, pRand);
      const covered = new Set();
      for (const t of matched) for (let i = t.start; i < t.start + t.seq.length; i++) covered.add(i);
      return { p, k, score: -10 * Math.log10(Math.max(P, 1e-300)), coverage: covered.size / p.seq.length };
    }).sort((a, b) => b.score - a.score);
    const thr = 10 * Math.log10(570000 / 0.05);
    const top = hits[0];
    const rows = hits.slice(0, 5).map((h) => [h.p.name, String(h.k), fmt(h.score, 0), `${fmt(h.coverage * 100, 0)} %`, fmt(h.p.kDa, 1), fmt(h.p.pI, 2)]);
    const events = [{ type: 'machine', label: 'Tra cứu', text: `${q.length} khối lượng, trypsin, bỏ sót tối đa ${missed}, ${cam ? 'Carbamidomethyl (C) cố định, ' : ''}sai số ${tolDa !== null ? `± ${fmt(tolDa, 1)} Da` : `± ${tolPpm} ppm`}. Ngưỡng có ý nghĩa (p < 0,05): điểm > ${fmt(thr, 0)}.` }];
    events.push(top.score > thr
      ? { type: 'effect', label: 'Nhận dạng', text: `${top.p.name} (${top.p.acc}): điểm ${fmt(top.score, 0)}, ${top.k} peptide khớp, độ che phủ ${fmt(top.coverage * 100, 0)} %.${/Keratin/.test(top.p.name) ? ' Keratin là protein nhiễm, thường loại khỏi kết quả (bài 07).' : ''}` }
      : { type: 'warning', label: 'Chưa nhận dạng được', text: `Điểm cao nhất ${fmt(top.score, 0)} (${top.p.name}) chưa vượt ngưỡng: sai số khối lượng rộng làm số đỉnh khớp ngẫu nhiên tăng, hoặc quá ít peptide.` });
    if (tolDa !== null && Number(tolDa) >= 0.5) events.push({ type: 'info', text: `Sai số ± ${fmt(tolDa, 1)} Da (như bài 07) rộng gấp hàng chục lần độ chính xác của máy khi hiệu chuẩn nội: điểm giảm vì xác suất khớp ngẫu nhiên lớn.` });
    this.last = { top: top.p.id, score: top.score, coverage: top.coverage, thr };
    this.notebook.add({ day: '', experiment: 'Proteomics', action: PR_ACTIONS2['pt-pmf'], subject: this.picked?.name ?? '', result: `${top.p.name} ${fmt(top.score, 0)}`, coverage: fmt(top.coverage * 100, 0) });
    return { ok: top.score > thr, top: top.p.id, score: top.score, table: { head: ['Protein', 'Khớp', 'Điểm', 'Che phủ', 'kDa', 'pI'], rows }, events };
  }

  figureData() {
    const g = this.sdsGel;
    if (!g) return null;
    return { volts: 200, minutes: 35, running: false, percent: g.percent, lanes: [{ label: 'Thang', ladder: true, bands: LADDER }, { label: 'Mẫu', bands: g.bands.map((b) => ({ kDa: b.kDa, amount: b.w })) }] };
  }
}

function binom(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

// P(X ≥ k) với X ~ nhị thức(n, p)
function binomTail(n, k, p) {
  let s = 0;
  for (let i = k; i <= n; i++) s += binom(n, i) * p ** i * (1 - p) ** (n - i);
  return s;
}
