import { Notebook } from './notebook.js';
import { rng } from './random.js';
import { GEL, LADDER, bpbAfter, distanceOf } from '../../figures/electrophoresis/model.mjs';

// PCR mở rộng theo tài liệu trong Google Drive của chủ dự án (data/pcrmix.json): pha master mix theo bảng bằng C·V = C′·V′,
// touch-down PCR (mỗi sản phẩm nhân lên với hiệu suất theo Ta so với Tm của nó, giới hạn bởi sức chứa của phản ứng),
// RAPD (mồi 10 nucleotide, băng có hoặc không, hệ số Dice, cây UPGMA), đường cong nóng chảy DNA đo A260
// (Tm theo Schildkraut & Lifson). Không phụ thuộc DOM.

export const PM_ACTIONS = {
  'pm-mix': 'Pha master mix',
  'pm-td': 'Chạy PCR (so sánh touch-down)',
  'pm-rapd': 'RAPD với mồi ngẫu nhiên',
  'pm-tree': 'Ma trận Dice, cây UPGMA',
  'pm-melt': 'Đường cong nóng chảy DNA',
};

const dec = (v, d = 1) => Number(v).toFixed(d).replace('.', ',');
const sig = (v) => (v >= 100 ? dec(v, 0) : v >= 10 ? dec(v, 1) : v >= 1 ? dec(v, 2) : dec(v, 3));
const sigmoid = (z) => 1 / (1 + Math.exp(-z));

// Tm theo quy tắc Wallace: 2(A + T) + 4(G + C)
export function wallaceTm(seq) {
  const s = seq.toUpperCase();
  const gc = [...s].filter((c) => c === 'G' || c === 'C').length;
  return 2 * (s.length - gc) + 4 * gc;
}

// Tm của DNA sợi đôi (°C) theo Schildkraut & Lifson 1965
export const meltTm = (gc, na) => 81.5 + 16.6 * Math.log10(na) + 0.41 * gc;

// Hệ số tương đồng Dice giữa hai dãy băng 0/1
export function dice(a, b) {
  let both = 0;
  let one = 0;
  a.forEach((v, i) => { if (v && b[i]) both++; else if (v || b[i]) one++; });
  return 2 * both + one === 0 ? 1 : (2 * both) / (2 * both + one);
}

// UPGMA trên ma trận tương đồng: ghép hai cụm giống nhau nhất, tương đồng của cụm mới là trung bình có trọng số
export function upgma(names, sim) {
  let clusters = names.map((n, i) => ({ label: n, members: [i], size: 1 }));
  let S = sim.map((r) => r.slice());
  const joins = [];
  while (clusters.length > 1) {
    let bi = 0;
    let bj = 1;
    for (let i = 0; i < clusters.length; i++) for (let j = i + 1; j < clusters.length; j++) if (S[i][j] > S[bi][bj]) { bi = i; bj = j; }
    const a = clusters[bi];
    const b = clusters[bj];
    const merged = { label: `(${a.label},${b.label})`, members: [...a.members, ...b.members], size: a.size + b.size };
    joins.push({ a: a.label, b: b.label, s: S[bi][bj] });
    const row = clusters.map((_, k) => (a.size * S[bi][k] + b.size * S[bj][k]) / merged.size);
    const keep = clusters.map((_, k) => k).filter((k) => k !== bi && k !== bj);
    S = [...keep.map((k) => [...keep.map((m) => S[k][m]), row[k]]), [...keep.map((k) => row[k]), 1]];
    clusters = [...keep.map((k) => clusters[k]), merged];
  }
  return { newick: clusters[0].label, joins };
}

export class PcrMixLab {
  constructor(data) {
    this.data = data;
    this.reset();
  }

  reset(seed = 1) {
    this.seed = seed;
    this.random = rng(seed);
    this.notebook = new Notebook();
    this.mixed = null;
    this.tdLanes = [];
    this.rapdRuns = {};
    this.genomes = this.#rapdGenomes(seed);
  }

  do(action, params = {}) {
    const fn = {
      'pm-mix': () => this.mix(params), 'pm-td': () => this.runTd(params), 'pm-rapd': () => this.rapd(params), 'pm-tree': () => this.tree(), 'pm-melt': () => this.melt(params),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #note(action, subject, result) {
    this.notebook.add({ day: '', experiment: 'PCR mở rộng', action: PM_ACTIONS[action], subject, result });
  }

  // ---- Master mix ----
  // mode: 'master' pha chung n phản ứng | 'single' pha từng ống (sai); bufferMg: buffer 10X đã có MgCl₂ 15 mM mà vẫn thêm MgCl₂
  mix({ n = 100, mode = 'master', bufferMg = false }) {
    const M = this.data.mix;
    n = Number(n);
    const reactions = mode === 'single' ? 1 : n;
    const Vtot = reactions * M.rxnUl;
    const mixPer = M.rxnUl - M.sampleUl;
    const rows = M.rows.map((r) => {
      // Nồng độ: C·V = C′·V′; lượng (U, pmol): số đơn vị mỗi phản ứng chia nồng độ gốc
      const per = r.kind === 'conc' ? (r.final * M.rxnUl) / r.stock : r.final / r.stock;
      return { ...r, per, total: per * reactions };
    });
    const water = (mixPer - rows.reduce((s, r) => s + r.per, 0)) * reactions;
    const tiny = rows.filter((r) => r.total < M.minPipetUl);
    // Buffer có sẵn MgCl₂ 15 mM (thành 1,5 mM trong 1X) mà vẫn thêm MgCl₂: Mg²⁺ gấp đôi
    const mg = 1.5 + (bufferMg ? M.bufferMgMM / 10 : 0);
    this.mixed = { mode, reactions, mg, tiny: tiny.length > 0 };
    const table = { head: ['Thành phần', 'Gốc', 'Trong 1 phản ứng', `Lấy cho ${reactions} pư (µL)`], rows: [
      ...rows.map((r) => [r.name, r.stockLabel ?? `${String(r.stock).replace('.', ',')} ${r.stockUnit ?? r.unit}`, `${String(r.final).replace('.', ',')} ${r.unit}`, sig(r.total)]),
      ['Nước khử ion', '—', `đủ ${mixPer} µL`, sig(water)],
      ['Tổng', '', `${mixPer} µL mix`, sig(mixPer * reactions)],
    ] };
    const events = [{ type: 'machine', label: 'Master mix', text: `${mode === 'master' ? `Pha chung cho ${reactions} phản ứng ${M.rxnUl} µL (mẫu ${M.sampleUl} µL, mix ${mixPer} µL mỗi ống): V = C′·V′/C với V′ = ${reactions} × ${M.rxnUl} = ${Vtot} µL.` : `Pha riêng một ống ${M.rxnUl} µL.`} Giữ thuốc thử trên đá bào, pha trong tủ sạch ở phòng trước PCR.` }];
    let ok = mode === 'master' && !bufferMg;
    if (mode === 'master' && n === M.n) {
      const same = rows.every((r) => Math.abs(r.total - r.book) < 0.01) && Math.abs(water - M.waterBook) < 0.01;
      events.push({ type: same ? 'effect' : 'warning', label: 'So với Bảng 1', text: same ? `Trùng Bảng 1 của tài liệu: buffer 250, MgCl₂ 75, Taq 25, dNTP 20, mỗi mồi 10, dUTP 5, UNG 100, nước 1505 µL.` : 'Khác Bảng 1 của tài liệu.' });
    }
    if (tiny.length) events.push({ type: 'warning', label: 'Thể tích quá nhỏ', text: `Pha từng ống phải lấy ${tiny.map((r) => `${r.name} ${sig(r.total)} µL`).join(', ')}: dưới ${dec(M.minPipetUl, 1)} µL thì micropipet không lấy chính xác. Tài liệu khuyên pha master mix cho ít nhất 5–10 phản ứng.` });
    if (bufferMg) events.push({ type: 'warning', label: 'Thừa Mg²⁺', text: `PCR buffer 10X đã có MgCl₂ 15 mM (1,5 mM khi pha 1X) mà vẫn thêm MgCl₂: Mg²⁺ trong phản ứng ${dec(mg, 1)} mM. Thừa Mg²⁺ làm mồi bắt cặp kém đặc hiệu, dễ có băng phụ.` });
    this.#note('pm-mix', `${reactions} phản ứng`, `nước ${sig(water)} µL, Mg²⁺ ${dec(mg, 1)} mM`);
    return { ok, rows, water, mg, table, events };
  }

  // ---- Touch-down PCR ----
  // Mỗi chu kỳ: N ← N·(1 + E·(1 − ΣN/K)), E = eMax·σ((Tm − Ta)/w). Bước kéo dài coi như đủ.
  #amplify(program, mg = 1.5) {
    const T = this.data.td;
    // Thừa Mg²⁺ làm bắt cặp lệch dễ hơn: Tm biểu kiến của vị trí lệch cao thêm (minh hoạ)
    const shift = mg > 2 ? 2.5 : 0;
    const N = T.products.map((p) => p.copies);
    let cycles = 0;
    for (const [count, ta0, step] of program.steps) {
      for (let c = 0; c < count; c++) {
        const ta = ta0 + step * c;
        const load = N.reduce((s, v, i) => s + v * T.products[i].bp, 0) / (T.capacity * 450);
        T.products.forEach((p, i) => {
          const tm = p.id === 'spec' ? p.tm : p.tm + shift;
          const E = T.eMax * sigmoid((tm - ta) / T.width);
          N[i] *= 1 + E * Math.max(0, 1 - load);
        });
        cycles++;
      }
    }
    return { N, cycles };
  }

  runTd({ program = 'td1' }) {
    const T = this.data.td;
    const P = T.programs[program];
    if (!P) return { ok: false, events: [{ type: 'warning', text: `Không có chương trình "${program}".` }] };
    const mg = this.mixed?.mg ?? 1.5;
    const { N, cycles } = this.#amplify(P, mg);
    const dye = Math.min(GEL.length, bpbAfter((100 * 40) / 60));
    const at = (bp) => distanceOf(bp, dye);
    const mass = N.map((v, i) => v * T.products[i].bp);
    const ref = T.visible * 450 * 20; // khối lượng cho băng sáng hết mức (minh hoạ)
    const bands = T.products.map((p, i) => ({ bp: p.bp, cm: at(p.bp), w: Math.min(1, mass[i] / ref), name: p.name })).filter((b) => b.w > 0.05);
    const label = { std55: '55', std65: '65', td1: 'TD1', td2: 'TD2' }[program];
    this.tdLanes = [...this.tdLanes.filter((l) => l.name !== label), { name: label, title: P.name, bands }];
    const lanes = [{ name: 'L', title: 'Thang 1 kb', bands: LADDER.map((bp) => ({ bp, cm: at(bp), w: [6000, 3000, 1000].includes(bp) ? 1 : 0.55 })) }, ...this.tdLanes];
    const specW = bands.find((b) => b.bp === 450)?.w ?? 0;
    const extra = bands.filter((b) => b.bp !== 450);
    const events = [{ type: 'machine', label: { std55: 'PCR 55 °C', std65: 'PCR 65 °C', td1: 'Touch-down 1', td2: 'Touch-down 2' }[program], text: `${P.name}: ${cycles} chu kỳ (${P.steps.map(([c, t, s]) => `${c} × ${dec(t, 1)} °C${s ? ` giảm ${dec(-s, 1)} °C mỗi chu kỳ` : ''}`).join(' → ')}); điện di gel agarose 1 %, nhuộm ethidium bromide.` }];
    events.push({ type: 'effect', label: 'Ảnh gel', text: `${specW > 0.2 ? 'Băng đặc hiệu 450 bp rõ' : specW > 0.05 ? 'Băng đặc hiệu 450 bp mờ' : 'Không thấy băng đặc hiệu'}${extra.length ? `; có ${extra.length} băng phụ (${extra.map((b) => `${b.bp} bp`).join(', ')})` : '; không có băng phụ'}. ${program === 'std55' ? 'Bắt cặp ở 55 °C thấp hơn Tm khá nhiều: mồi bám được cả vị trí lệch, sinh băng phụ.' : program === 'std65' ? 'Bắt cặp ở 65 °C đặc hiệu nhưng gần Tm của mồi nên hiệu suất mỗi chu kỳ thấp, sản phẩm ít.' : 'Các chu kỳ đầu ở nhiệt độ cao chỉ nhân sản phẩm đặc hiệu; khi hạ về 55 °C, sản phẩm đặc hiệu đã nhiều hơn hẳn nên lấn át băng phụ.'}` });
    const ok = specW > 0.2 && extra.every((b) => b.w < 0.15);
    if (mg > 2) events.push({ type: 'warning', label: 'Thừa Mg²⁺', text: `Mix có ${dec(mg, 1)} mM Mg²⁺: mồi bắt cặp lệch bền hơn nên băng phụ tăng.` });
    this.#note('pm-td', P.name, bands.map((b) => `${b.bp} bp (${dec(b.w, 2)})`).join(', ') || 'không có băng');
    return { ok: program.startsWith('td') ? ok : true, good: ok, lanes, gelCm: GEL.length, events };
  }

  // ---- RAPD ----
  // Vị trí khuếch đại của mỗi mồi ở tổ tiên chung; mỗi nhánh cây mất hoặc thêm băng với xác suất bằng độ dài nhánh
  #rapdGenomes(seed) {
    const R = this.data.rapd;
    const draw = rng(seed * 104729 + 7);
    const out = {};
    for (const pr of R.primers) {
      const sizes = Array.from({ length: R.sites }, () => Math.round(Math.exp(Math.log(R.bpRange[0]) + draw() * Math.log(R.bpRange[1] / R.bpRange[0])) / 10) * 10);
      const root = sizes.map(() => (draw() < 0.6 ? 1 : 0));
      const at = { root };
      for (const [from, to, len] of R.tree.edges) at[to] = at[from].map((v) => (draw() < len ? 1 - v : v));
      out[pr.id] = { sizes, profile: Object.fromEntries(R.accessions.map((a) => [a, at[a]])) };
    }
    return out;
  }

  rapd({ primer = 'OPA-02', ta = 36 }) {
    const R = this.data.rapd;
    const pr = R.primers.find((p) => p.id === primer);
    if (!pr) return { ok: false, events: [{ type: 'warning', text: `Không có mồi "${primer}".` }] };
    ta = Number(ta);
    const tm = wallaceTm(pr.seq);
    const G = this.genomes[primer];
    // Mồi 10 nucleotide chỉ bám bền khi Ta không vượt quá Tm vài độ
    const works = ta <= tm + 4;
    const dye = Math.min(GEL.length, bpbAfter((100 * 40) / 60));
    const at = (bp) => distanceOf(bp, dye);
    const lanes = [{ name: 'L', title: 'Thang 1 kb', bands: LADDER.map((bp) => ({ bp, cm: at(bp), w: [6000, 3000, 1000].includes(bp) ? 1 : 0.55 })) },
      ...R.accessions.map((a) => ({ name: a, title: `Giống ${a}`, bands: works ? G.sizes.map((bp, i) => ({ bp, cm: at(bp), w: 0.5 + 0.4 * ((i * 37) % 10) / 10, on: G.profile[a][i] })).filter((b) => b.on) : [] }))];
    if (works) this.rapdRuns[primer] = true;
    const poly = G.sizes.filter((_, i) => { const col = R.accessions.map((a) => G.profile[a][i]); return col.some(Boolean) && !col.every(Boolean); }).length;
    const scored = G.sizes.filter((_, i) => R.accessions.some((a) => G.profile[a][i])).length;
    const events = [{ type: 'machine', label: primer, text: `Mồi ${pr.seq} (10 nucleotide, Tm theo quy tắc Wallace ${tm} °C), bắt mồi ${ta} °C, 6 giống A–F; gel agarose 1,5 % (vị trí băng tính theo mô hình gel 1 % của app, gần đúng).` }];
    if (works) events.push({ type: 'effect', label: 'Kiểu băng', text: `${scored} băng ghi được, ${poly} băng đa hình (có ở giống này, không có ở giống khác). Mỗi băng là một đoạn nằm giữa hai vị trí mồi bám ngược chiều nhau trong khoảng vài kb; đột biến ở vị trí bám làm mất băng.` });
    else events.push({ type: 'warning', label: 'Không có băng', text: `Bắt mồi ở ${ta} °C cao hơn nhiều so với Tm ${tm} °C của mồi 10 nucleotide: mồi không bám được, không có sản phẩm. RAPD dùng nhiệt độ bắt mồi 34–37 °C.` });
    this.#note('pm-rapd', `${primer}, ${ta} °C`, works ? `${scored} băng, ${poly} đa hình` : 'không có băng');
    return { ok: works, lanes, gelCm: GEL.length, events };
  }

  tree() {
    const R = this.data.rapd;
    const used = R.primers.filter((p) => this.rapdRuns[p.id]);
    if (!used.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa chạy RAPD với mồi nào ở nhiệt độ bắt mồi phù hợp.' }] };
    const vec = (a) => used.flatMap((p) => this.genomes[p.id].profile[a]);
    const names = R.accessions;
    const sim = names.map((a) => names.map((b) => dice(vec(a), vec(b))));
    const t = upgma(names, sim);
    const ok = used.length === R.primers.length;
    const table = { head: ['', ...names], rows: names.map((a, i) => [a, ...names.map((_, j) => dec(sim[i][j], 2))]) };
    const events = [{ type: 'machine', label: 'Ma trận 0/1', text: `${used.length} mồi, ${vec(names[0]).length} vị trí băng; tương đồng Dice S = 2a/(2a + b + c) giữa từng cặp giống.` },
      { type: 'effect', label: 'Cây UPGMA', text: `${t.newick}. Thứ tự ghép: ${t.joins.map((j) => `${j.a} + ${j.b} (S = ${dec(j.s, 2)})`).join('; ')}.` }];
    if (!ok) events.push({ type: 'warning', label: 'Ít mồi', text: 'Mới dùng một mồi: số băng ít nên cây kém tin cậy. Chạy thêm mồi thứ hai rồi tính lại.' });
    this.#note('pm-tree', `${used.length} mồi`, t.newick);
    return { ok, sim, newick: t.newick, table, events };
  }

  // ---- Đường cong nóng chảy DNA ----
  // A260 tương đối = 1 + h·σ((T − Tm)/w); đun nhanh thì nhiệt độ mẫu trễ sau nhiệt độ đọc trên máy
  melt({ species = 'ecoli', buffer = 'ssc', rate = 'slow' }) {
    const M = this.data.melt;
    const S = M.species[species];
    const B = M.buffers[buffer];
    if (!S || !B) return { ok: false, events: [{ type: 'warning', text: 'Chọn loài và dung dịch đệm có trong danh sách.' }] };
    const tm = meltTm(S.gc, B.na);
    const lag = rate === 'fast' ? M.fastLag : 0;
    const pts = [];
    for (let T = 40; T <= 100; T += 0.5) pts.push([T, 1 + M.hyper * sigmoid((T - lag - tm) / M.width) + 0.002 * this.random.normal()]);
    // Tm đọc được: nhiệt độ có độ dốc lớn nhất (đạo hàm làm trơn trên 5 điểm)
    let best = 0;
    let tmRead = pts[0][0];
    for (let i = 2; i < pts.length - 2; i++) {
      const d = (pts[i + 2][1] - pts[i - 2][1]) / (pts[i + 2][0] - pts[i - 2][0]);
      if (d > best) { best = d; tmRead = pts[i][0]; }
    }
    const ok = buffer === 'ssc' && rate === 'slow';
    const events = [{ type: 'machine', label: 'Nóng chảy', text: `DNA ${S.name} (${S.gc} % GC) trong ${B.name}, cuvet thạch anh có bộ điều nhiệt, đo A260 từ 40 đến 100 °C, ${rate === 'slow' ? 'tăng 0,5 °C mỗi phút' : 'tăng nhanh 5 °C mỗi phút'}.` },
      { type: 'effect', label: 'Tm', text: `A260 tăng khoảng ${Math.round(M.hyper * 100)} % khi hai mạch tách nhau (hiệu ứng tăng sắc). Tm đọc ở điểm dốc nhất: ${dec(tmRead, 1)} °C; công thức 81,5 + 16,6·log[Na⁺] + 0,41·%GC cho ${dec(tm, 1)} °C. DNA nhiều G–C (3 liên kết hydro, xếp chồng bền hơn) nóng chảy ở nhiệt độ cao hơn.` }];
    if (species === 'ecoli') events.push({ type: 'info', label: 'Chú ý tài liệu', text: 'Sách Sinh học phân tử ghi Tm của E. coli khoảng 69–70 °C; theo Marmur & Doty (1962) trong SSC là 69,3 + 0,41 × 51 ≈ 90 °C. Số 69,3 là hằng số của công thức, không phải Tm.' });
    if (buffer !== 'ssc') events.push({ type: 'warning', label: 'Ít muối', text: 'Đệm loãng 10 lần: ít Na⁺ che điện tích âm của khung phosphate nên hai mạch đẩy nhau mạnh hơn, Tm thấp hơn khoảng 16,6 °C. So sánh Tm giữa các mẫu phải dùng cùng một đệm.' });
    if (rate === 'fast') events.push({ type: 'warning', label: 'Đun quá nhanh', text: 'Đun nhanh thì dung dịch trong cuvet chưa kịp bằng nhiệt độ của bộ điều nhiệt: Tm đọc được cao hơn thật.' });
    this.#note('pm-melt', `${S.name}, ${B.name}`, `Tm ${dec(tmRead, 1)} °C`);
    return { ok, tm, tmRead, series: [{ name: `${S.name}`, points: pts, kind: 'dots', legend: 'A260 tương đối' }], events };
  }
}
