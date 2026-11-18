import { Notebook } from './notebook.js';
import { rng } from './random.js';
import { fieldOfView } from '../../figures/microscope/model.mjs';

// Tiêu bản hiển vi ảo theo ảnh thực hành Thực vật học và Sinh học tế bào của chủ dự án (data/slides.json):
// lát cắt ngang rễ, thân, lá; tiêu bản ép tinh hoàn châu chấu (giảm phân) và đỉnh rễ hành (nguyên phân); tảo silic;
// tế bào biểu bì vảy hành và niêm mạc miệng (Bài thực tập số 2 Sinh học tế bào).
// Lõi sinh hình học của tiêu bản (đơn vị µm, tâm ở gốc toạ độ) theo cấu tạo điển hình, rồi cắt theo thị trường của
// vật kính (CX23: 20 mm / độ phóng đại). Cách làm tiêu bản quyết định ảnh: lát cắt dày thì đen, đặt lá kính rơi
// thẳng thì có bọt khí, không nhuộm thì không phân biệt được vách, tiêu bản ép không dàn thì tế bào chồng lên nhau.
// Kích thước và tần số các kỳ là số minh hoạ ước từ ảnh. Không phụ thuộc DOM.

export const SL_ACTIONS = {
  'sl-make': 'Làm tiêu bản',
  'sl-view': 'Quan sát tiêu bản',
  'sl-name': 'Nhận dạng tiêu bản',
  'sl-find': 'Tìm tế bào theo kỳ',
  'sl-count': 'Đếm tế bào theo kỳ',
};

const TAU = Math.PI * 2;
const dec = (v, d = 1) => Number(v).toFixed(d).replace('.', ',');
const mm = (um) => dec(um / 1000, um < 1000 ? 2 : 1);
// Viết thường chữ đầu, giữ số La Mã (kỳ giữa I) và tên riêng (Một lá mầm)
const lc = (t) => String(t).charAt(0).toLowerCase() + String(t).slice(1);

export class SlideLab {
  constructor(data) {
    this.data = data;
    this.reset();
  }

  reset(seed = 1) {
    this.random = rng(seed);
    this.notebook = new Notebook();
    this.slide = null;
    this.prep = null;
    this.shapes = [];
    this.cells = [];
    this.view = null;
    this.found = null;
  }

  get spec() { return this.slide ? this.data.slides[this.slide] : null; }

  do(action, params = {}) {
    const fn = { 'sl-make': () => this.make(params), 'sl-view': () => this.look(params), 'sl-name': () => this.name(params), 'sl-find': () => this.find(params), 'sl-count': () => this.count() }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    if (action !== 'sl-make' && !this.slide) return { action, ok: false, events: [{ type: 'warning', text: 'Chưa có tiêu bản trên bàn kính: làm tiêu bản trước.' }] };
    return { action, ...fn() };
  }

  #note(action, result) {
    this.notebook.add({ day: '', experiment: 'Tiêu bản hiển vi', action: SL_ACTIONS[action], subject: this.spec.name, result });
  }

  // cut: 'thin' | 'thick' (lát cắt); cover: 'slow' (đặt lá kính nghiêng rồi hạ từ từ) | 'drop' (thả rơi);
  // stain: nhuộm hay không; squash: ép dàn tiêu bản ép
  // dry: tiêu bản dấu quét niêm mạc miệng để khô se rồi mới cố định
  make({ slide = 'root-monocot', cut = 'thin', cover = 'slow', stain = true, squash = true, dry = true }) {
    const S = this.data.slides[slide];
    if (!S) return { ok: false, events: [{ type: 'warning', text: `Không có tiêu bản "${slide}".` }] };
    this.slide = slide;
    const section = S.kind === 'section' || S.kind === 'leaf';
    const squashKind = S.kind === 'meiosis' || S.kind === 'mitosis';
    this.prep = { cut: section ? cut : 'thin', cover, stain: S.kind === 'wet' ? false : Boolean(stain), squash: squashKind ? Boolean(squash) : true, dry: S.cell === 'animal' ? Boolean(dry) : true };
    this.shapes = [];
    this.cells = [];
    this.found = null;
    const R = S.size / 2;
    const gen = { section: () => this.#section(slide, R), leaf: () => this.#leaf(slide, R), meiosis: () => this.#squash('meiosis', R), mitosis: () => this.#squash('mitosis', R), wet: () => this.#diatoms(R), cells: () => (S.cell === 'plant' ? this.#onion(R) : this.#cheek(R)) }[S.kind];
    gen();
    // Bọt khí khi thả rơi lá kính: 1–3 bọt, có bọt đè lên mẫu (ảnh IMG_3989, IMG_4148–4151)
    this.bubbles = [];
    if (cover === 'drop') {
      const n = 1 + Math.floor(this.random() * 3);
      for (let k = 0; k < n; k++) {
        const a = this.random() * TAU;
        const d = R * (k === 0 ? 0.25 * this.random() : 0.3 + 0.6 * this.random());
        this.bubbles.push({ x: d * Math.cos(a), y: d * Math.sin(a), r: R * (k === 0 ? 0.35 : 0.12 + 0.15 * this.random()) });
      }
    }
    this.view = null;
    const events = [{ type: 'machine', label: 'Tiêu bản', text: `${S.name}. ${this.#how(S)}` }];
    if (section && cut === 'thick') events.push({ type: 'warning', label: 'Lát cắt dày', text: 'Lát cắt quá dày hoặc nghiêng: ánh sáng không xuyên qua, mô đen, không thấy rõ tế bào (ảnh IMG_4166, 4167, 4178).' });
    if (cover === 'drop') events.push({ type: 'warning', label: 'Bọt khí', text: 'Thả lá kính rơi thẳng xuống giọt nước: không khí bị nhốt thành bọt có viền đen đè lên mẫu. Phải đặt một cạnh lá kính chạm giọt nước rồi hạ từ từ.' });
    if (squashKind && !squash) events.push({ type: 'warning', label: 'Chưa ép dàn', text: 'Không ép dàn mẫu: nhiều lớp tế bào chồng lên nhau thành khối đỏ đặc, không thấy nhiễm sắc thể (ảnh IMG_3997, 3998).' });
    if (section && !stain) events.push({ type: 'effect', label: 'Không nhuộm', text: 'Không nhuộm: mô vàng nâu, khó phân biệt mô hoá gỗ với mô mềm.' });
    if (S.kind === 'cells' && !stain) events.push({ type: 'warning', label: 'Nhuộm chưa đủ', text: S.cell === 'plant' ? 'Chưa đợi 15–20 phút cho xanh methylene ngấm: tế bào gần như trong suốt, nhân nhạt khó thấy.' : 'Không nhuộm Giemsa: tế bào dẹt, trong suốt, chỉ thấy viền mờ.' });
    if (S.cell === 'animal' && !dry) events.push({ type: 'warning', label: 'Tế bào trôi', text: 'Cố định khi vết quét còn ướt: tế bào chưa bám vào lam, trôi đi khi nhỏ methanol và thuốc nhuộm; tiêu bản còn rất ít tế bào. Phải để khô se (vệt đục) rồi mới cố định.' });
    this.#note('sl-make', `${cut === 'thick' ? 'cắt dày, ' : ''}${cover === 'drop' ? 'có bọt khí, ' : ''}${this.prep.stain ? 'nhuộm' : 'không nhuộm'}${squashKind && !squash ? ', chưa ép' : ''}`);
    const ok = !(section && cut === 'thick') && cover === 'slow' && !(squashKind && !squash) && (!section || this.prep.stain) && (S.kind !== 'cells' || (this.prep.stain && this.prep.dry));
    return { ok, slide, events };
  }

  #how(S) {
    if (S.kind === 'section' || S.kind === 'leaf') return 'Cắt lát mỏng bằng dao cạo, ngâm javel tẩy nội chất, rửa nước, nhuộm, đặt vào giọt nước trên lam kính rồi đậy lá kính.';
    if (S.kind === 'wet') return 'Nhỏ một giọt nước có tảo lên lam kính rồi đậy lá kính.';
    if (S.cell === 'plant') return 'Nhỏ một giọt xanh methylene giữa lam, bóc lớp vỏ lụa trong vảy hành, cắt miếng khoảng 5 × 5 mm đặt chìm trong giọt thuốc nhuộm, đậy lamen, đợi 15–20 phút rồi thấm dung dịch thừa ở mép lamen.';
    if (S.cell === 'animal') return 'Đeo găng, quệt tăm bông vào mặt trong má, quét lên lam, để khô se, cố định methanol 1–2 phút, để khô rồi nhuộm Giemsa 1X 1–2 phút, rửa nhẹ, để khô.';
    return 'Đặt mẫu lên lam kính, nhỏ thuốc nhuộm, đậy lá kính rồi dùng ngón tay cái ép mạnh qua giấy thấm cho tế bào dàn thành một lớp.';
  }

  // ---- Hình học ----
  #push(s) { this.shapes.push(s); return s; }

  // Các hàng tế bào tròn đồng tâm từ bán kính r1 vào r0; cell: đường kính (hoặc [ngoài, trong]); bỏ qua chỗ trùng vật đã có
  #rings(r0, r1, cell, w, opt = {}) {
    const [c1, c0] = Array.isArray(cell) ? cell : [cell, cell];
    let r = r1;
    while (r > r0 + 1) {
      const k = (r - r0) / Math.max(1, r1 - r0);
      const c = c0 + (c1 - c0) * k;
      const rr = r - c / 2;
      if (rr < r0) break;
      const n = Math.max(1, Math.floor((TAU * rr) / c));
      const phase = this.random() * TAU;
      for (let i = 0; i < n; i++) {
        const a = phase + (i * TAU) / n;
        const x = rr * Math.cos(a);
        const y = rr * Math.sin(a);
        if (opt.avoid && opt.avoid.some((o) => Math.hypot(o.x - x, o.y - y) < o.r + c * 0.45)) continue;
        this.#push({ t: 'c', x, y, r: (c / 2) * (0.88 + 0.12 * this.random()), w, f: opt.f ?? 'cell' });
      }
      r -= c * (opt.gap ?? 0.98);
    }
  }

  // Bó mạch kín cây Một lá mầm: vỏ bó mô cứng, libe phía ngoài, hai mạch hậu mộc lớn, khoang khí phía trong
  #closedBundle(x, y, size, out) {
    const ux = Math.cos(out);
    const uy = Math.sin(out);
    const px = -uy;
    const py = ux;
    this.#push({ t: 'e', x, y, rx: size * 0.5, ry: size * 0.42, rot: out, w: 'lig', f: 'sheath' });
    this.#push({ t: 'e', x: x + ux * size * 0.18, y: y + uy * size * 0.18, rx: size * 0.16, ry: size * 0.22, rot: out, w: 'ph', f: 'phloem' });
    for (const s of [-1, 1]) this.#push({ t: 'c', x: x + px * s * size * 0.22 - ux * size * 0.04, y: y + py * s * size * 0.22 - uy * size * 0.04, r: size * 0.12, w: 'lig', f: 'lumen' });
    this.#push({ t: 'c', x: x - ux * size * 0.24, y: y - uy * size * 0.24, r: size * 0.09, w: 'none', f: 'air' });
    this.#push({ t: 'c', x: x - ux * size * 0.1, y: y - uy * size * 0.1, r: size * 0.05, w: 'lig', f: 'lumen' });
    return { x, y, r: size * 0.52 };
  }

  #section(id, R) {
    const P = (k) => k * R;
    if (id === 'root-monocot') {
      const stele = P(0.42);
      const vr = 40;
      const vessels = [];
      for (let i = 0; i < 14; i++) {
        const a = (i * TAU) / 14;
        vessels.push({ x: (stele - 70) * Math.cos(a), y: (stele - 70) * Math.sin(a), r: vr });
      }
      for (const v of vessels) this.#push({ t: 'c', ...v, w: 'lig', f: 'lumen', tag: 'vessel' });
      // Libe xen kẽ gỗ sát trụ bì
      for (let i = 0; i < 14; i++) {
        const a = ((i + 0.5) * TAU) / 14;
        this.#push({ t: 'c', x: (stele - 30) * Math.cos(a), y: (stele - 30) * Math.sin(a), r: 16, w: 'ph', f: 'phloem' });
      }
      const avoid = [...vessels, ...Array.from({ length: 14 }, (_, i) => ({ x: (stele - 30) * Math.cos(((i + 0.5) * TAU) / 14), y: (stele - 30) * Math.sin(((i + 0.5) * TAU) / 14), r: 16 }))];
      this.#rings(P(0.18), stele - 8, 14, 'lig', { avoid });
      this.#rings(0, P(0.18), 20, 'cel');
      this.#rings(stele - 8, stele + 8, 16, 'sub', { f: 'endo' });
      this.#rings(stele + 8, R - 20, [56, 26], 'cel');
      this.#rings(R - 20, R, 20, 'cut');
      this.targets = [{ x: stele - 70, y: 0 }, { x: stele - 50, y: 20 }];
    } else if (id === 'stem-dicot-young') {
      this.#rings(0, P(0.42), 60, 'cel');
      // Vòng gỗ liên tục: dãy mạch toả tia xen sợi gỗ
      this.#push({ t: 'ring', r0: P(0.42), r1: P(0.56), w: 'lig', f: 'xylem' });
      for (let i = 0; i < 44; i++) {
        const a = (i * TAU) / 44 + this.random() * 0.05;
        for (let k = 0; k < 4; k++) {
          const rr = P(0.44) + k * P(0.032);
          if (this.random() < 0.25) continue;
          this.#push({ t: 'c', x: rr * Math.cos(a), y: rr * Math.sin(a), r: 12 + k * 3, w: 'lig', f: 'lumen', tag: 'vessel' });
        }
      }
      this.#push({ t: 'ring', r0: P(0.56), r1: P(0.58), w: 'cel', f: 'cambium' });
      this.#push({ t: 'ring', r0: P(0.58), r1: P(0.64), w: 'ph', f: 'phloem' });
      const caps = [];
      for (let i = 0; i < 12; i++) {
        const a = (i * TAU) / 12 + 0.1;
        const c = { x: P(0.67) * Math.cos(a), y: P(0.67) * Math.sin(a), r: P(0.035) };
        caps.push(c);
        for (let k = 0; k < 16; k++) {
          const b = this.random() * TAU;
          const d = c.r * Math.sqrt(this.random()) * 0.85;
          this.#push({ t: 'c', x: c.x + d * Math.cos(b), y: c.y + d * Math.sin(b), r: 8, w: 'lig', f: 'fiber' });
        }
      }
      const cavities = Array.from({ length: 8 }, (_, i) => { const a = (i * TAU) / 8 + 0.3; return { x: P(0.82) * Math.cos(a), y: P(0.82) * Math.sin(a), r: 45 }; });
      for (const c of cavities) this.#push({ t: 'c', ...c, w: 'cel', f: 'cavity' });
      this.#rings(P(0.64), P(0.9), 48, 'cel', { avoid: [...caps, ...cavities] });
      this.#rings(P(0.9), P(0.975), 26, 'coll');
      this.#rings(P(0.975), R, 18, 'cut');
      this.targets = [{ x: P(0.55), y: 0 }, { x: P(0.5), y: 0 }];
    } else if (id === 'stem-dicot-secondary') {
      this.#rings(0, P(0.14), 70, 'cel');
      this.#push({ t: 'ring', r0: P(0.14), r1: P(0.6), w: 'lig', f: 'xylem' });
      // Tia gỗ và mạch gỗ thứ cấp rải theo dãy toả tia
      for (let i = 0; i < 36; i++) {
        const a = (i * TAU) / 36;
        this.#push({ t: 'ray', a, r0: P(0.15), r1: P(0.6), w: 'cel' });
      }
      for (let k = 0; k < 360; k++) {
        const a = this.random() * TAU;
        const rr = P(0.17 + 0.41 * Math.sqrt(this.random()));
        this.#push({ t: 'c', x: rr * Math.cos(a), y: rr * Math.sin(a), r: 14 + 10 * this.random(), w: 'lig', f: 'lumen', tag: 'vessel' });
      }
      this.#push({ t: 'ring', r0: P(0.6), r1: P(0.625), w: 'cel', f: 'cambium' });
      // Libe thứ cấp: băng sợi xen libe mềm, chia nêm bởi tia libe loe rộng
      this.#push({ t: 'ring', r0: P(0.625), r1: P(0.86), w: 'ph', f: 'phloem' });
      for (let b = 0; b < 4; b++) this.#push({ t: 'ring', r0: P(0.66 + b * 0.05), r1: P(0.68 + b * 0.05), w: 'lig', f: 'fiber', dash: true });
      for (let i = 0; i < 12; i++) this.#push({ t: 'wedge', a: (i * TAU) / 12, r0: P(0.625), r1: P(0.86), spread: 0.06, w: 'cel', f: 'cell' });
      this.#rings(P(0.86), P(0.955), 50, 'cel');
      this.#rings(P(0.955), R, 22, 'sub', { f: 'cork', gap: 0.8 });
      this.targets = [{ x: P(0.62), y: 0 }, { x: P(0.61), y: 0 }];
    } else if (id === 'stem-monocot-hollow') {
      const bundles = [];
      for (let i = 0; i < 15; i++) {
        const a = (i * TAU) / 15;
        bundles.push(this.#closedBundle(P(0.89) * Math.cos(a), P(0.89) * Math.sin(a), 80, a));
        const b = a + TAU / 30;
        bundles.push(this.#closedBundle(P(0.72) * Math.cos(b), P(0.72) * Math.sin(b), 150, b));
      }
      this.#rings(P(0.5), P(0.86), 46, 'cel', { avoid: bundles });
      this.#rings(P(0.86), P(0.97), 16, 'lig', { avoid: bundles, f: 'fiber' });
      this.#rings(P(0.97), R, 16, 'cut');
      this.targets = [{ x: P(0.8), y: 0 }, { x: P(0.72) * Math.cos(TAU / 30), y: P(0.72) * Math.sin(TAU / 30) }];
    } else if (id === 'stem-monocot-solid') {
      const bundles = [];
      for (let k = 0; k < 400 && bundles.length < 70; k++) {
        const rr = P(0.95) * Math.sqrt(this.random()) ** 0.6;
        const a = this.random() * TAU;
        const size = 200 - 110 * (rr / R);
        const b = { x: rr * Math.cos(a), y: rr * Math.sin(a), r: size * 0.55 };
        if (bundles.some((o) => Math.hypot(o.x - b.x, o.y - b.y) < o.r + b.r + 40)) continue;
        bundles.push(this.#closedBundle(b.x, b.y, size, a));
      }
      this.#rings(0, P(0.97), 72, 'cel', { avoid: bundles });
      this.#rings(P(0.97), R, 18, 'lig', { f: 'fiber' });
      this.bundleCount = bundles.length;
      const b0 = bundles.reduce((best, b) => (Math.hypot(b.x, b.y) < Math.hypot(best.x, best.y) ? b : best), bundles[0]);
      this.targets = [{ x: b0.x, y: b0.y }, { x: b0.x, y: b0.y }];
    } else if (id === 'stem-cucurbit') {
      const bundles = [];
      for (let i = 0; i < 10; i++) {
        const outer = i % 2 === 0;
        const a = (i * TAU) / 10;
        const rr = P(outer ? 0.78 : 0.6);
        const size = outer ? 420 : 640;
        const x = rr * Math.cos(a);
        const y = rr * Math.sin(a);
        const ux = Math.cos(a);
        const uy = Math.sin(a);
        // Bó chồng kép: libe ngoài, gỗ có 1–3 mạch rất lớn, libe trong
        this.#push({ t: 'e', x: x + ux * size * 0.36, y: y + uy * size * 0.36, rx: size * 0.16, ry: size * 0.32, rot: a, w: 'ph', f: 'phloem' });
        this.#push({ t: 'e', x: x - ux * size * 0.36, y: y - uy * size * 0.36, rx: size * 0.12, ry: size * 0.24, rot: a, w: 'ph', f: 'phloem' });
        this.#push({ t: 'e', x, y, rx: size * 0.26, ry: size * 0.3, rot: a, w: 'lig', f: 'xylem' });
        const nv = 1 + Math.floor(this.random() * 3);
        for (let k = 0; k < nv; k++) this.#push({ t: 'c', x: x + ux * (k - (nv - 1) / 2) * size * 0.18, y: y + uy * (k - (nv - 1) / 2) * size * 0.18, r: size * (0.11 + 0.03 * this.random()), w: 'lig', f: 'lumen', tag: 'vessel' });
        bundles.push({ x, y, r: size * 0.56 });
      }
      this.#rings(P(0.45), P(0.86), 84, 'cel', { avoid: bundles });
      this.#rings(P(0.86), P(0.885), 18, 'lig', { f: 'fiber' });
      this.#rings(P(0.885), P(0.95), 70, 'cel');
      this.#rings(P(0.95), P(0.985), 30, 'coll');
      this.#rings(P(0.985), R, 18, 'cut');
      // Lông che chở đa bào
      for (let i = 0; i < 26; i++) {
        const a = (i * TAU) / 26 + this.random() * 0.1;
        const n = 3 + Math.floor(this.random() * 3);
        for (let k = 0; k < n; k++) this.#push({ t: 'c', x: (R + 14 + k * 24) * Math.cos(a), y: (R + 14 + k * 24) * Math.sin(a), r: 12 - k, w: 'cel', f: 'cell', tag: 'hair' });
      }
      this.targets = [{ x: P(0.6) * Math.cos(TAU / 10), y: P(0.6) * Math.sin(TAU / 10) }, { x: P(0.6) * Math.cos(TAU / 10), y: P(0.6) * Math.sin(TAU / 10) }];
    }
  }

  // Lá: phiến dẹt nằm ngang (x), gân giữa ở x = 0; y dương là mặt trên lá
  #leaf(id, R) {
    const W = R;
    if (id === 'leaf-dicot') {
      const t = 200;
      this.#push({ t: 'blade', x0: -W, x1: W, top: t, bottom: -t, bulgeTop: 300, bulgeBottom: 760, bulgeW: 560, w: 'cut', f: 'meso' });
      for (let x = -W + 15; x < W; x += 30) {
        const mid = Math.abs(x) < 560;
        const top = mid ? t + 300 * Math.cos((x / 560) * (Math.PI / 2)) ** 2 : t;
        const bot = mid ? -t - 760 * Math.cos((x / 560) * (Math.PI / 2)) ** 2 : -t;
        this.#push({ t: 'c', x, y: top - 14, r: 13, w: 'cut', f: 'cell' });
        this.#push({ t: 'c', x, y: bot + 14, r: 13, w: 'cut', f: 'cell' });
        if (!mid) {
          // Mô giậu (tế bào dài) ở trên, mô xốp (tế bào tròn thưa) ở dưới
          this.#push({ t: 'e', x, y: t - 80, rx: 12, ry: 48, rot: 0, w: 'cel', f: 'chloro' });
          for (let k = 0; k < 3; k++) if (this.random() < 0.7) this.#push({ t: 'c', x: x + (this.random() - 0.5) * 16, y: -t + 50 + k * 50 + (this.random() - 0.5) * 16, r: 16, w: 'cel', f: 'chloro' });
        }
      }
      // Gân giữa: mô dày dưới biểu bì, mô mềm, bó mạch hình cung (gỗ quay lên, libe ở dưới)
      for (let k = 0; k < 320; k++) {
        const x = (this.random() - 0.5) * 900;
        const y = -650 + this.random() * 1050;
        const top = t + 300 * Math.cos((x / 560) * (Math.PI / 2)) ** 2 - 40;
        const bot = -t - 760 * Math.cos((x / 560) * (Math.PI / 2)) ** 2 + 40;
        if (Math.abs(x) > 520 || y > top || y < bot) continue;
        const nearEdge = y > top - 60 || y < bot + 70;
        const arc = Math.hypot(x, y + 60);
        if (arc > 230 && arc < 420 && y < -60) continue;
        this.#push({ t: 'c', x, y, r: nearEdge ? 14 : 26, w: nearEdge ? 'coll' : 'cel', f: 'cell' });
      }
      // Bó mạch hình cung lõm lên mặt trên lá: gỗ xếp dãy toả tia ở phía trong cung, libe ở phía ngoài (mặt dưới)
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (1.15 + (0.7 * i) / 8);
        for (let k = 0; k < 4; k++) {
          const rr = 250 + k * 26;
          this.#push({ t: 'c', x: rr * Math.cos(a), y: -60 + rr * Math.sin(a), r: 14 - k, w: 'lig', f: 'lumen', tag: 'vessel' });
        }
        this.#push({ t: 'c', x: 385 * Math.cos(a), y: -60 + 385 * Math.sin(a), r: 20, w: 'ph', f: 'phloem' });
      }
      this.targets = [{ x: 0, y: -150 }, { x: 0, y: -330 }];
    } else {
      const t = 260;
      this.#push({ t: 'blade', x0: -W, x1: W, top: t, bottom: -t, bulgeTop: 0, bulgeBottom: 300, bulgeW: 900, w: 'cut', f: 'meso', dark: true });
      const chambers = [];
      for (let i = -3; i <= 3; i++) {
        const x = i * 260;
        const depth = 300 * Math.cos((x / 900) * (Math.PI / 2)) ** 2;
        const c = { x, y: -depth / 2, rx: 110, ry: 150 + depth * 0.35 };
        chambers.push(c);
        this.#push({ t: 'e', x: c.x, y: c.y, rx: c.rx, ry: c.ry, rot: 0, w: 'cel', f: 'air', tag: 'chamber' });
        if (i < 3) this.#closedBundle(x + 130, t - 80, 70, Math.PI / 2);
      }
      for (let k = 0; k < 500; k++) {
        const x = (this.random() - 0.5) * 1900;
        const y = -560 + this.random() * 760;
        if (chambers.some((c) => ((x - c.x) / (c.rx + 14)) ** 2 + ((y - c.y) / (c.ry + 14)) ** 2 < 1)) continue;
        const depth = Math.abs(x) < 900 ? 300 * Math.cos((x / 900) * (Math.PI / 2)) ** 2 : 0;
        if (y > t - 70 || y < -t - depth + 70) continue;
        this.#push({ t: 'c', x, y, r: 12, w: 'cel', f: 'cell' });
      }
      this.targets = [{ x: 0, y: -100 }, { x: 130, y: -40 }];
    }
  }

  // Tiêu bản ép: tế bào trong các nang (giảm phân, tế bào cùng nang cùng kỳ) hoặc thành cột (đỉnh rễ)
  #squash(kind, R) {
    const phases = this.data.phases[kind];
    const keys = Object.keys(phases);
    const pick = () => {
      let u = this.random();
      for (const k of keys) { u -= phases[k][1]; if (u <= 0) return k; }
      return keys[0];
    };
    const spread = this.prep.squash;
    if (kind === 'meiosis') {
      // Mỗi kỳ có ít nhất một nang, các nang còn lại chọn ngẫu nhiên theo tần số
      for (let n = 0; n < 60; n++) {
        const ph = n < keys.length ? keys[n] : pick();
        const cx = (this.random() - 0.5) * 2 * R * 0.9;
        const cy = (this.random() - 0.5) * 2 * R * 0.9;
        const size = ph === 'sd' ? 10 : ph === 'sp' ? 7 : ph.endsWith('2') ? 15 : 21;
        const m = 6 + Math.floor(this.random() * 10);
        for (let k = 0; k < m; k++) {
          const a = this.random() * TAU;
          const d = Math.sqrt(this.random()) * size * (spread ? 4.6 : 2);
          this.cells.push({ x: cx + d * Math.cos(a), y: cy + d * Math.sin(a), r: size, phase: ph, rot: this.random() * Math.PI });
        }
      }
    } else {
      // Đỉnh rễ: cột tế bào gần vuông, nhân lớn
      const s = 22;
      for (let col = -Math.floor(R / s); col < R / s; col++) {
        for (let row = -Math.floor(R / s); row < R / s; row++) {
          const x = col * s + (spread ? (this.random() - 0.5) * 3 : 0);
          const y = row * s;
          if (Math.hypot(x, y) > R) continue;
          this.cells.push({ x, y, r: s / 2, phase: pick(), rot: (this.random() - 0.5) * 0.3, square: true });
        }
      }
    }
    // Không ép dàn: thêm nhiều lớp tế bào chồng lên nhau
    if (!spread) {
      const base = this.cells.slice();
      for (let k = 0; k < 2; k++) for (const c of base) this.cells.push({ ...c, x: c.x + (this.random() - 0.5) * c.r * 1.6, y: c.y + (this.random() - 0.5) * c.r * 1.6 });
    }
    this.targets = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  }

  #diatoms(R) {
    for (let k = 0; k < 7; k++) {
      const a = this.random() * TAU;
      const d = R * 0.7 * Math.sqrt(this.random());
      this.#push({ t: 'diatom', x: d * Math.cos(a), y: d * Math.sin(a), len: 70 + this.random() * 60, rot: this.random() * Math.PI, tag: 'diatom' });
    }
    for (let k = 0; k < 30; k++) this.#push({ t: 'c', x: (this.random() - 0.5) * 2 * R, y: (this.random() - 0.5) * 2 * R, r: 2 + this.random() * 5, w: 'none', f: 'debris' });
    const first = this.shapes[0];
    this.targets = [{ x: first.x, y: first.y }, { x: first.x, y: first.y }];
  }

  // Biểu bì vảy hành: tế bào chữ nhật dài xếp so le thành hàng, nhân sát vách (kích thước minh hoạ, tb2)
  #onion(R) {
    const h = 55;
    const tilt = 0.12;
    const c = Math.cos(tilt);
    const sn = Math.sin(tilt);
    for (let row = -Math.ceil(R / h); row <= Math.ceil(R / h); row++) {
      let u = -R - this.random() * 250;
      while (u < R) {
        const L = 200 + this.random() * 140;
        const cu = u + L / 2;
        const cv = row * h;
        const x = cu * c - cv * sn;
        const y = cu * sn + cv * c;
        u += L;
        if (Math.hypot(x, y) > R * 0.95) continue;
        this.#push({ t: 'rr', x, y, w: L - 2, h: h - 2, rot: tilt, r: L / 2, f: 'cell', w2: 'wall' });
        // Nhân nằm sát một vách dọc, có hạch nhân
        const along = (this.random() - 0.5) * (L - 50);
        const side = (this.random() < 0.5 ? -1 : 1) * (h / 2 - 13);
        const nx = x + along * c - side * sn;
        const ny = y + along * sn + side * c;
        this.#push({ t: 'e', x: nx, y: ny, rx: 11, ry: 8, rot: tilt, w: 'none', f: 'nuc' });
        this.#push({ t: 'c', x: nx + 2, y: ny, r: 2.6, w: 'none', f: 'nucleolus' });
      }
    }
    const near = this.shapes.filter((q) => q.t === 'rr').sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))[0];
    this.targets = [{ x: 0, y: 0 }, { x: near?.x ?? 0, y: near?.y ?? 0 }];
  }

  // Niêm mạc miệng: tế bào dẹt đa giác thành mảng hoặc rời, nhân nhỏ ở giữa; cố định khi còn ướt thì phần lớn trôi mất
  #cheek(R) {
    const keep = this.prep.dry ? 1 : 0.15;
    const centers = Array.from({ length: 9 }, () => { const a = this.random() * TAU; const d = R * 0.75 * Math.sqrt(this.random()); return [d * Math.cos(a), d * Math.sin(a)]; });
    centers[0] = [0, 0];
    for (const [cx, cy] of centers) {
      const n = 4 + Math.floor(this.random() * 10);
      for (let k = 0; k < n; k++) {
        if (this.random() > keep) continue;
        const a = this.random() * TAU;
        const d = k === 0 ? 0 : 45 + this.random() * 70;
        const x = cx + d * Math.cos(a);
        const y = cy + d * Math.sin(a);
        const rr = 26 + this.random() * 8;
        const m = 6 + Math.floor(this.random() * 2);
        const rot = this.random() * TAU;
        const pts = Array.from({ length: m }, (_, i) => { const t = rot + (i * TAU) / m + (this.random() - 0.5) * 0.4; const q = rr * (0.85 + 0.3 * this.random()); return [x + q * Math.cos(t), y + q * Math.sin(t)]; });
        this.#push({ t: 'poly', x, y, r: rr * 1.15, pts, f: 'cell', w2: 'wall' });
        this.#push({ t: 'e', x: x + (this.random() - 0.5) * 6, y: y + (this.random() - 0.5) * 6, rx: 4.5, ry: 3.6, rot: this.random() * Math.PI, w: 'none', f: 'nuc' });
      }
    }
    const first = this.shapes.find((q) => q.t === 'poly') ?? { x: 0, y: 0 };
    this.targets = [{ x: first.x, y: first.y }, { x: first.x, y: first.y }];
  }

  // ---- Quan sát ----
  look({ objective = 4, oil = false }) {
    const S = this.spec;
    const mag = [4, 10, 40, 100].includes(Number(objective)) ? Number(objective) : 4;
    const fov = fieldOfView(mag) * 1000;
    const t = mag === 4 ? { x: 0, y: 0 } : this.targets[mag === 10 ? 0 : 1];
    const center = this.found && mag >= 40 ? this.found : t;
    this.view = { mag, fov, x: center.x, y: center.y, oil: mag === 100 && Boolean(oil) };
    const events = [];
    const pct = Math.round((S.size / fov) * 100);
    events.push({ type: 'machine', label: `${mag}× · ${mag * 10}×`, text: `Thị trường ${mm(fov)} mm. ${S.kind === 'section' || S.kind === 'leaf' ? (pct <= 100 ? `Lát cắt rộng khoảng ${mm(S.size)} mm, chiếm ${pct} % đường kính thị trường: thấy toàn bộ lát cắt.` : `Lát cắt rộng khoảng ${mm(S.size)} mm, lớn hơn thị trường: chỉ thấy một phần, di chuyển tiêu bản để xem tiếp.`) : this.#squashView(mag)}` });
    const quality = this.#quality(mag);
    events.push(...quality.events);
    if (!quality.bad && (S.kind === 'section' || S.kind === 'leaf')) events.push({ type: 'effect', label: 'Thấy', text: mag === 4 ? 'Thấy cách sắp xếp các mô và bó mạch trên toàn lát cắt.' : mag === 10 ? 'Thấy rõ từng mô: vỏ, trụ, bó mạch, mạch gỗ.' : 'Thấy từng tế bào và độ dày vách.' });
    this.#note('sl-view', `${mag}×${quality.bad ? ` (${quality.bad})` : ''}`);
    return { ok: !quality.bad, field: this.field(), events };
  }

  #squashView(mag) {
    const S = this.spec;
    if (S.cell === 'plant') return mag === 4 ? 'Ở 4× thấy lớp tế bào xếp sát nhau như lớp gạch; chuyển 10× rồi 40×.' : mag === 10 ? 'Thấy tế bào hình chữ nhật dài, xếp so le, mỗi tế bào một nhân sát vách.' : 'Thấy vách tế bào, nhân có hạch nhân, tế bào chất mỏng sát vách, không bào lớn ở giữa. Vảy hành không quang hợp nên hầu như không có lục lạp.';
    if (S.cell === 'animal') return mag === 4 ? 'Ở 4× chỉ thấy các đám tế bào nhỏ; chuyển 10× rồi 40×.' : mag === 10 ? 'Thấy tế bào dẹt đa giác, nằm rời hoặc thành mảng, nhân nhỏ ở giữa.' : 'Thấy nhân tròn hồng tím ở giữa, tế bào chất hồng nhạt, không có vách tế bào và không bào lớn như tế bào thực vật.';
    if (S.kind === 'wet') return mag === 4 ? 'Tảo silic nhỏ, chỉ thấy như các hạt nâu nhạt; chuyển sang 10× và 40×.' : mag === 10 ? 'Thấy các tế bào tảo hình thuyền.' : 'Thấy vân ngang và rãnh giữa trên vỏ silic.';
    return mag === 4 ? 'Ở 4× chỉ thấy các đám tế bào; tìm vùng tế bào dàn mỏng rồi chuyển vật kính lớn hơn.' : mag === 10 ? 'Thấy từng tế bào và nhân; muốn xác định các kỳ phải dùng vật kính 40× hoặc 100×.' : mag === 40 ? 'Thấy nhiễm sắc thể trong từng tế bào; đếm từng nhiễm sắc thể thì dùng vật kính 100× có dầu soi.' : 'Thấy rõ từng nhiễm sắc thể.';
  }

  #quality(mag) {
    const S = this.spec;
    const events = [];
    let bad = null;
    if (this.prep.cut === 'thick' && mag >= 10) { bad = 'lát cắt dày'; events.push({ type: 'warning', label: 'Đen, mờ', text: 'Lát cắt quá dày: các lớp tế bào chồng lên nhau, ánh sáng không xuyên qua, không lấy nét được.' }); }
    if (mag === 100 && !this.view?.oil) { bad = 'thiếu dầu soi'; events.push({ type: 'warning', label: 'Thiếu dầu', text: 'Vật kính 100× cần một giọt dầu soi giữa vật kính và lá kính: không có dầu thì ảnh tối và nhòe (xem kính hiển vi CX23).' }); }
    if (!this.prep.squash && mag >= 10) { bad = 'chưa ép dàn'; events.push({ type: 'warning', label: 'Khối đặc', text: 'Tế bào chồng nhiều lớp thành khối đỏ đặc, không thấy nhiễm sắc thể.' }); }
    if (this.view && this.bubbles?.length) {
      const v = this.view;
      const hit = this.bubbles.find((b) => Math.hypot(b.x - v.x, b.y - v.y) < b.r + v.fov * 0.15);
      if (hit && mag >= 10) { bad = bad ?? 'bọt khí'; events.push({ type: 'warning', label: 'Bọt khí', text: 'Bọt khí viền đen che đúng chỗ cần xem. Làm lại tiêu bản, hạ lá kính từ từ.' }); }
      else events.push({ type: 'warning', label: 'Bọt khí', text: 'Có bọt khí tròn viền đen trên tiêu bản (dễ nhầm là tế bào).' });
    }
    if (!this.prep.stain && (S.kind === 'section' || S.kind === 'leaf')) events.push({ type: 'effect', label: 'Không nhuộm', text: 'Mô vàng nâu, khó phân biệt mô hoá gỗ.' });
    return { bad, events };
  }

  // Hình trong thị trường hiện tại (lọc theo khung nhìn) để vẽ
  field() {
    const S = this.spec;
    const v = this.view ?? { mag: 4, fov: fieldOfView(4) * 1000, x: 0, y: 0 };
    const half = v.fov / 2;
    const near = (x, y, r) => Math.abs(x - v.x) < half + r && Math.abs(y - v.y) < half + r;
    const shapes = this.shapes.filter((s) => (s.t === 'ring' || s.t === 'ray' || s.t === 'wedge' || s.t === 'blade' ? true : near(s.x, s.y, s.r ?? s.rx ?? s.len ?? 0)));
    const cells = this.cells.filter((c) => near(c.x, c.y, c.r * 2));
    return { slide: this.slide, kind: S.kind, stain: this.prep.stain ? S.stain : S.kind === 'cells' ? 'plain' : 'none', thick: this.prep.cut === 'thick', squash: this.prep.squash, view: v, shapes, cells, bubbles: this.bubbles ?? [], found: this.found, size: S.size };
  }

  name({ answer }) {
    const S = this.spec;
    if (!(S.kind === 'section' || S.kind === 'leaf')) return { ok: false, events: [{ type: 'warning', text: 'Nhận dạng chỉ dùng cho lát cắt giải phẫu thực vật.' }] };
    if (!this.view) return { ok: false, events: [{ type: 'warning', text: 'Chưa quan sát tiêu bản.' }] };
    const ok = answer === this.slide;
    this.#note('sl-name', `${this.data.kinds[answer] ?? answer}: ${ok ? 'đúng' : 'sai'}`);
    return { ok, events: [{ type: ok ? 'effect' : 'warning', label: ok ? 'Đúng' : 'Chưa đúng', text: ok ? `${this.data.kinds[this.slide]}. Đặc điểm nhận biết: ${S.keys.join('; ')}.` : `Đây không phải ${lc(this.data.kinds[answer] ?? answer)}. Xem lại: ${lc(S.keys[0])}.` }] };
  }

  // Tìm một tế bào ở kỳ cần tìm và đưa vào giữa thị trường 40×
  find({ phase }) {
    const S = this.spec;
    const P = this.data.phases[S.kind];
    if (!P) return { ok: false, events: [{ type: 'warning', text: 'Tiêu bản này không có tế bào đang phân chia.' }] };
    if (!P[phase]) return { ok: false, events: [{ type: 'warning', text: `Tiêu bản ${S.kind === 'meiosis' ? 'giảm phân' : 'nguyên phân'} không có kỳ này.` }] };
    if (!this.prep.squash) return { ok: false, events: [{ type: 'warning', label: 'Khối đặc', text: 'Tế bào chồng lên nhau, không phân biệt được các kỳ. Làm lại tiêu bản, ép dàn mẫu.' }] };
    const c = this.cells.filter((x) => x.phase === phase).sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))[0];
    if (!c) return { ok: false, events: [{ type: 'warning', text: `Không tìm thấy tế bào ${lc(P[phase][0])} trên tiêu bản này; làm tiêu bản khác.` }] };
    this.found = { x: c.x, y: c.y };
    // Giữ vật kính 100× (có dầu) nếu đang dùng, nếu không thì tìm ở 40×
    const mag = this.view?.mag === 100 && this.view.oil ? 100 : 40;
    this.view = { mag, fov: fieldOfView(mag) * 1000, x: c.x, y: c.y, oil: mag === 100 };
    const blocked = this.bubbles?.find((b) => Math.hypot(b.x - c.x, b.y - c.y) < b.r);
    this.#note('sl-find', `${P[phase][0]}${blocked ? ' (dưới bọt khí)' : ''}`);
    const events = [{ type: 'machine', label: P[phase][0], text: `Di chuyển tiêu bản tới một tế bào ${lc(P[phase][0])} ở vật kính ${mag}×: ${lc(P[phase][2])}.` }];
    if (S.kind === 'meiosis' && phase === 'm1') events.push({ type: 'effect', label: 'Đếm', text: 'Đếm được 11 thể lưỡng trị và một nhiễm sắc thể X đơn: con đực 2n = 23 (22 + X0) như châu chấu di cư.' });
    if (blocked) events.push({ type: 'warning', label: 'Bọt khí', text: 'Tế bào nằm dưới bọt khí, nhìn không rõ.' });
    return { ok: !blocked, phase, field: this.field(), events };
  }

  // Đếm tế bào theo kỳ trên toàn tiêu bản (như đếm nhiều thị trường 40×), tính chỉ số nguyên phân
  count() {
    const S = this.spec;
    const P = this.data.phases[S.kind];
    if (!P) return { ok: false, events: [{ type: 'warning', text: 'Tiêu bản này không có tế bào đang phân chia.' }] };
    if (!this.prep.squash) return { ok: false, events: [{ type: 'warning', label: 'Khối đặc', text: 'Tế bào chồng lên nhau, không đếm được. Làm lại tiêu bản, ép dàn mẫu.' }] };
    const n = Object.fromEntries(Object.keys(P).map((k) => [k, 0]));
    for (const c of this.cells) n[c.phase] += 1;
    const total = this.cells.length;
    const rows = Object.entries(P).map(([k, v]) => [v[0], n[k], `${dec((n[k] / total) * 100, 1)} %`]);
    const events = [];
    let index = null;
    if (S.kind === 'mitosis') {
      index = (total - n.i) / total;
      events.push({ type: 'effect', label: 'Chỉ số nguyên phân', text: `${total - n.i}/${total} tế bào đang phân chia: chỉ số nguyên phân ${dec(index * 100, 1)} %. Kỳ trung gian chiếm phần lớn vì kéo dài nhất trong chu kỳ tế bào.` });
    } else events.push({ type: 'effect', label: 'Đếm', text: `${total} tế bào: tinh tử và kỳ đầu I nhiều nhất; các kỳ ngắn (kỳ sau) hiếm gặp.` });
    this.#note('sl-count', `${total} tế bào${index != null ? `, chỉ số ${dec(index * 100, 1)} %` : ''}`);
    return { ok: true, counts: n, total, index, table: { head: ['Kỳ', 'Số tế bào', 'Tỉ lệ'], rows }, events };
  }

  figureData() {
    return this.slide ? { slide: this.slide, view: this.view } : null;
  }
}
