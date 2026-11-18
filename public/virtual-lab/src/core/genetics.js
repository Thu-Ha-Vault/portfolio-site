// Lõi di truyền dùng chung cho mọi thí nghiệm lai (đậu Hà Lan, sau này ruồi giấm). Không phụ thuộc Three.js hay DOM.
// Kiểu gen là object { gen: [alen, alen] }; alen trội viết đúng ký hiệu gen (R), alen lặn viết thường (r).
// Giảm phân: mỗi gen phân li độc lập, mỗi giao tử nhận ngẫu nhiên một trong hai alen (quy luật phân li, phân li độc lập).

import { chi2Gof } from './stats.js';

export const recessive = (gene) => gene.toLowerCase();

// Kiểu tính trạng (trường `kind` trong dữ liệu):
// - mặc định: một gen, trội hoàn toàn (lớp dom, rec);
// - 'incomplete': một gen, trội không hoàn toàn (lớp dom, het, rec: thể dị hợp có kiểu hình trung gian);
// - 'complementary': hai gen bổ trợ (genes: [A, B]); chỉ biểu hiện kiểu hình trội khi có cả alen trội của hai gen (9 : 7).
// - 'dominant-epistasis': át chế trội (genes: [W, Y]); W_ át mọi kiểu hình (dom), wwY_ là mid, wwyy là rec (12 : 3 : 1).
// - 'recessive-epistasis': át chế lặn (genes: [C, R]); cc át mọi kiểu hình (rec), C_R_ là dom, C_rr là mid (9 : 3 : 4).
// - 'duplicate': hai gen trùng lặp (genes: [A, B]); chỉ aabb mang kiểu hình lặn (15 : 1).
// - 'lethal': một gen, alen trội gây chết ở thể đồng hợp (YY chết, Yy là dom, yy là rec; cây sống phân li 2 : 1).
export const genesOf = (t) => t.genes ?? [t.gene];
const classKeys = (t) => (t.kind === 'incomplete' ? ['dom', 'het', 'rec'] : t.kind === 'dominant-epistasis' || t.kind === 'recessive-epistasis' ? ['dom', 'mid', 'rec'] : ['dom', 'rec']);

// spec: { traitId: 'dom' | 'rec' | 'het' | { gen: 'dom' | 'rec' | 'het' } }; không nêu thì đồng hợp trội (dòng thuần)
export function makeGenotype(traits, spec = {}) {
  const g = {};
  for (const t of traits) {
    const s = spec[t.id] ?? 'dom';
    for (const gene of genesOf(t)) {
      const v = typeof s === 'object' ? s[gene] ?? 'dom' : s;
      const D = gene;
      const r = recessive(gene);
      g[gene] = v === 'rec' ? [r, r] : v === 'het' ? [D, r] : [D, D];
    }
  }
  return g;
}

export function gamete(genotype, rnd) {
  const out = {};
  for (const [gene, pair] of Object.entries(genotype)) out[gene] = pair[rnd() < 0.5 ? 0 : 1];
  return out;
}

export function zygote(egg, sperm) {
  const g = {};
  for (const gene of Object.keys(egg)) g[gene] = [egg[gene], sperm[gene]];
  return g;
}

const doses = (genotype, gene) => genotype[gene].filter((a) => a === gene).length;

export function phenotypeOf(genotype, trait) {
  if (trait.kind === 'complementary') return genesOf(trait).every((gene) => doses(genotype, gene) > 0) ? 'dom' : 'rec';
  if (trait.kind === 'dominant-epistasis') {
    const [w, y] = genesOf(trait);
    return doses(genotype, w) > 0 ? 'dom' : doses(genotype, y) > 0 ? 'mid' : 'rec';
  }
  if (trait.kind === 'recessive-epistasis') {
    const [c, r] = genesOf(trait);
    return doses(genotype, c) === 0 ? 'rec' : doses(genotype, r) > 0 ? 'dom' : 'mid';
  }
  if (trait.kind === 'duplicate') return genesOf(trait).some((gene) => doses(genotype, gene) > 0) ? 'dom' : 'rec';
  const n = doses(genotype, trait.gene);
  if (trait.kind === 'incomplete') return n === 2 ? 'dom' : n === 1 ? 'het' : 'rec';
  if (trait.kind === 'lethal') return n === 2 ? 'dead' : n === 1 ? 'dom' : 'rec';
  return n > 0 ? 'dom' : 'rec';
}

export function genotypeText(genotype, traits) {
  return traits
    .flatMap((t) => genesOf(t).map((gene) => {
      const [a, b] = genotype[gene];
      return a === gene || b !== gene ? a + b : b + a; // alen trội viết trước
    }))
    .join('');
}

// Các lớp kiểu hình theo thứ tự trội trước: 1 tính trạng → [D, d]; 2 tính trạng → [DD, Dd, dD, dd]
export function phenotypeClasses(traits) {
  let classes = [[]];
  for (const t of traits) classes = classes.flatMap((c) => classKeys(t).map((k) => [...c, k]));
  return classes.map((c) => ({ key: c.join('|'), label: c.map((p, i) => traits[i][p]).join(', '), parts: c }));
}

export function countPhenotypes(genotypes, traits) {
  const classes = phenotypeClasses(traits);
  const counts = Object.fromEntries(classes.map((c) => [c.key, 0]));
  for (const g of genotypes) {
    const key = traits.map((t) => phenotypeOf(g, t)).join('|');
    if (key in counts) counts[key] += 1; // kiểu gen gây chết không có lớp kiểu hình
  }
  return classes.map((c) => ({ ...c, n: counts[c.key] }));
}

// Tỉ lệ lý thuyết theo phép lai: F2 (tự thụ dị hợp) 3:1, 9:3:3:1; lai phân tích 1:1, 1:1:1:1
export function expectedRatio(nTraits, kind = 'f2') {
  const one = kind === 'testcross' ? [1, 1] : [3, 1];
  let r = [1];
  for (let i = 0; i < nTraits; i++) r = r.flatMap((a) => one.map((b) => a * b));
  return r;
}

// Như expectedRatio nhưng theo kiểu từng tính trạng: trội không hoàn toàn 1:2:1, gen bổ trợ 9:7 (lai phân tích 1:3)
export function expectedRatioFor(traits, kind = 'f2') {
  const one = (t) => {
    if (t.kind === 'incomplete') return kind === 'testcross' ? [0, 1, 1] : [1, 2, 1];
    if (t.kind === 'complementary') return kind === 'testcross' ? [1, 3] : [9, 7];
    if (t.kind === 'dominant-epistasis') return kind === 'testcross' ? [2, 1, 1] : [12, 3, 1];
    if (t.kind === 'recessive-epistasis') return kind === 'testcross' ? [1, 1, 2] : [9, 3, 4];
    if (t.kind === 'duplicate') return kind === 'testcross' ? [3, 1] : [15, 1];
    if (t.kind === 'lethal') return kind === 'testcross' ? [1, 1] : [2, 1];
    return kind === 'testcross' ? [1, 1] : [3, 1];
  };
  let r = [1];
  for (const t of traits) r = r.flatMap((a) => one(t).map((b) => a * b));
  return r;
}

// Kiểm định χ² phù hợp: so số đếm với tỉ lệ lý thuyết (stats.js); giữ bảng giá trị tới hạn ở mức 0,05 cho phần hiển thị
export function chiSquare(observed, ratio) {
  const r = chi2Gof(observed, ratio);
  return { ...r, critical: CRITICAL_05[r.df] };
}

// Giá trị tới hạn χ² ở mức ý nghĩa 0,05
export const CRITICAL_05 = { 1: 3.841, 2: 5.991, 3: 7.815, 4: 9.488, 5: 11.07 };

// ——— Bộ gen theo nhiễm sắc thể (dùng cho ruồi giấm): liên kết gen, hoán vị gen, nhiễm sắc thể giới tính ———
// genome = { sex: 'F' | 'M', chr: { [id]: [hap, hap] } }; hap = { gen: alen } với alen '+' (hoang dại) hoặc ký hiệu đột biến.
// Nhiễm sắc thể giới tính: con cái XX; con đực X và Y (Y ghi là null, không mang gen của X).
// chromosomes: [{ id, sex?: true, genes: [{ id, pos (cM) }] }]

export function makeGenome(chromosomes, sex, mutant = [], { het = [] } = {}) {
  const chr = {};
  for (const c of chromosomes) {
    const hap = (hetSide) => Object.fromEntries(c.genes.map((g) => [g.id, mutant.includes(g.id) || (hetSide && het.includes(g.id)) ? g.id : '+']));
    chr[c.id] = c.sex && sex === 'M' ? [hap(false), null] : [hap(false), hap(true)];
  }
  return { sex, chr };
}

// Giảm phân: mỗi cặp nhiễm sắc thể cho một chiếc; giữa hai gen liền nhau trao đổi chéo với xác suất r = khoảng cách (cM) / 100.
// crossover = false cho ruồi đực (ruồi giấm đực không trao đổi chéo).
export function meiosis(genome, chromosomes, rnd, { crossover = true } = {}) {
  const out = {};
  for (const c of chromosomes) {
    const [a, b] = genome.chr[c.id];
    if (!b || !a) {
      out[c.id] = rnd() < 0.5 ? (a && { ...a }) : (b && { ...b }); // X hoặc Y của con đực
      continue;
    }
    const genes = [...c.genes].sort((x, y) => x.pos - y.pos);
    let side = rnd() < 0.5 ? 0 : 1;
    const hap = {};
    // Nhiễu (interference) I: có trao đổi chéo ở khoảng liền trước thì xác suất ở khoảng sau nhân (1 − I)
    let prev = false;
    genes.forEach((g, i) => {
      if (i > 0 && crossover) {
        const co = rnd() < Math.min(0.5, (g.pos - genes[i - 1].pos) / 100) * (prev ? 1 - (c.interference ?? 0) : 1);
        if (co) side = 1 - side;
        prev = co;
      }
      hap[g.id] = (side ? b : a)[g.id];
    });
    out[c.id] = hap;
  }
  return out;
}

// Thụ tinh: trứng luôn mang X; tinh trùng mang X (con cái) hoặc Y (con đực)
export function fertilize(egg, sperm, chromosomes) {
  const sexChr = chromosomes.find((c) => c.sex);
  const sex = sexChr && sperm[sexChr.id] === null ? 'M' : 'F';
  const chr = {};
  for (const c of chromosomes) chr[c.id] = [egg[c.id], sperm[c.id]];
  return { sex, chr };
}

// Kiểu hình của một gen lặn: biểu hiện khi mọi alen có mặt đều là đột biến (con đực chỉ có một X)
export function linkedPhenotype(genome, chromosomes, geneId) {
  const c = chromosomes.find((cc) => cc.genes.some((g) => g.id === geneId));
  const alleles = genome.chr[c.id].filter(Boolean).map((h) => h[geneId]);
  return alleles.every((a) => a !== '+') ? 'rec' : 'dom';
}
