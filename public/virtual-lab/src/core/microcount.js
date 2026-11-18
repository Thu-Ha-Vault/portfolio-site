import { Notebook } from './notebook.js';
import { rng } from './random.js';

// Thí nghiệm vi sinh vật học theo giáo trình trong Google Drive của chủ dự án (data/microbe.json): nhuộm Gram B. subtilis
// và E. coli; pha loãng thập phân, đổ đĩa PCA, đếm tổng vi khuẩn hiếu khí theo công thức ISO 7218; MPN coliform 3 × 3
// tính bằng hợp lý cực đại (Cochran 1950); đếm nấm men bằng buồng đếm Goriaev. Số khuẩn lạc trên đĩa theo phân phối
// Poisson của số tế bào thật trong thể tích cấy. Thêm nhuộm bào tử (Ôgietska), kháng sinh đồ khoanh giấy (vòng chuẩn
// EUCAST cho E. coli ATCC 25922) và lên men rượu (CO₂, iodoform, K₂Cr₂O₇). Không phụ thuộc DOM.

export const VS_ACTIONS = {
  'vs-gram': 'Nhuộm Gram',
  'vs-dilute': 'Pha loãng thập phân',
  'vs-plate': 'Đổ đĩa',
  'vs-incubate': 'Ủ đĩa',
  'vs-count': 'Đếm khuẩn lạc, tính kết quả',
  'vs-mpn': 'MPN coliform 3 × 3',
  'vs-hemo': 'Đếm bằng buồng đếm',
  'vs-spore': 'Nhuộm bào tử',
  'vs-disk': 'Kháng sinh đồ khoanh giấy',
  'vs-ferment': 'Lên men rượu',
};

const dec = (v, d = 1) => Number(v).toFixed(d).replace('.', ',');
const sup = (n) => String(n).replace(/[0-9-]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(c)]);
// Viết số kiểu 2,4 · 10⁵
export const sci = (v, d = 1) => {
  if (!Number.isFinite(v) || v <= 0) return '0';
  const e = Math.floor(Math.log10(v));
  const m = v / 10 ** e;
  return `${dec(m, d)} · 10${sup(e)}`;
};

// Kết quả đếm đĩa theo quy ước của giáo trình (ISO 7218): counts = { độ pha loãng k (10⁻ᵏ): [số khuẩn lạc từng đĩa] }, V mL mỗi đĩa
export function plateCount(counts, V = 1) {
  const ks = Object.keys(counts).map(Number).sort((a, b) => a - b);
  let prevOver = false;
  for (const k of ks) {
    const c1 = counts[k];
    if (c1.some((c) => c > 250)) { prevOver = true; continue; }
    // Độ pha loãng trước quá dày, độ này lại dưới 25: vẫn dùng độ này, ghi là ước lượng
    if (!c1.some((c) => c >= 25) && !prevOver) break;
    const c2 = (counts[k + 1] ?? []).filter(() => (counts[k + 1] ?? []).some((c) => c >= 10));
    const sum = [...c1, ...c2].reduce((a, b) => a + b, 0);
    const n = V * (c1.length + 0.1 * c2.length);
    return { value: (sum * 10 ** k) / n, used: { [k]: c1, ...(c2.length ? { [k + 1]: c2 } : {}) }, sum, k, n1: c1.length, n2: c2.length, low: !c1.some((c) => c >= 25) };
  }
  // Mọi đĩa quá 250 ở độ pha loãng cao nhất, hoặc dưới 25 ở độ pha loãng thấp nhất
  const hi = ks[ks.length - 1];
  const lo = ks[0];
  if (counts[hi].every((c) => c > 250)) return { value: null, over: (250 * 10 ** hi) / V };
  return { value: null, under: (25 * 10 ** lo) / V };
}

// MPN theo hợp lý cực đại: Σ pᵢvᵢ/(1 − e^(−λvᵢ)) = Σ nᵢvᵢ (Cochran 1950)
export function mpn(positives, volumes, n = 3) {
  const total = volumes.reduce((a, v) => a + n * v, 0);
  if (positives.every((p) => p === 0)) return { value: 0, below: true };
  if (positives.every((p) => p === n)) return { value: Infinity, above: true };
  const f = (lam) => positives.reduce((a, p, i) => a + (p * volumes[i]) / (1 - Math.exp(-lam * volumes[i])), 0) - total;
  let lo = 1e-6;
  let hi = 1e7;
  for (let k = 0; k < 200; k++) { const mid = Math.sqrt(lo * hi); if (f(mid) > 0) lo = mid; else hi = mid; }
  return { value: Math.sqrt(lo * hi) };
}

// Làm tròn MPN như bảng: 2 chữ số có nghĩa
const round2 = (v) => (v >= 10 ? Math.round(Number(v.toPrecision(2))) : Number(v.toPrecision(2)));

export class MicroCountLab {
  constructor(data) {
    this.data = data;
    this.reset();
  }

  reset(seed = 1) {
    this.random = rng(seed);
    this.notebook = new Notebook();
    this.series = null;
    this.plates = [];
    this.incubated = null;
    this.gram = null;
    this.sporeField = null;
    this.diskPlate = null;
  }

  do(action, params = {}) {
    const fn = {
      'vs-gram': () => this.stain(params), 'vs-dilute': () => this.dilute(params), 'vs-plate': () => this.plate(params), 'vs-incubate': () => this.incubate(params),
      'vs-count': () => this.count(), 'vs-mpn': () => this.mpnTest(params), 'vs-hemo': () => this.hemo(params),
      'vs-spore': () => this.spore(params), 'vs-disk': () => this.disk(params), 'vs-ferment': () => this.ferment(params),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #note(action, subject, result) {
    this.notebook.add({ day: '', experiment: 'Vi sinh vật học', action: VS_ACTIONS[action], subject, result });
  }

  #poisson(mean) {
    if (mean < 30) return this.random.poisson(mean);
    return Math.max(0, Math.round(mean + Math.sqrt(mean) * this.random.normal()));
  }

  // ---- Nhuộm Gram ----
  // fix: 'gentle' hơ nhẹ | 'hard' hơ trực tiếp lâu; decolor: giây tẩy cồn; age: tuổi canh trường (giờ)
  stain({ fix = 'gentle', lugol = true, decolor = 30, safranin = true, age = 24 }) {
    const G = this.data.gram;
    decolor = Number(decolor);
    age = Number(age);
    // Xác suất tế bào Gram dương bị tẩy mất màu tím, Gram âm còn giữ tím (minh hoạ theo hướng của giáo trình)
    const posLoss = !lugol ? 1 : decolor >= 60 ? 0.6 : age >= 48 ? 0.4 : 0.03;
    const negKeep = !lugol ? 0 : decolor <= 10 ? 0.7 : 0.03;
    const cells = [];
    const W = 60; // µm, vùng giữa thị trường 100×
    for (let k = 0; k < 70; k++) {
      // Vết bôi giữa: trộn hai loài
      const sp = this.random() < 0.5 ? 'bsub' : 'ecoli';
      const S = G[sp];
      const n = S.chain[0] + Math.floor(this.random() * (S.chain[1] - S.chain[0] + 1));
      const len = S.len[0] + this.random() * (S.len[1] - S.len[0]);
      const a = this.random() * Math.PI;
      let x = (this.random() - 0.5) * W;
      let y = (this.random() - 0.5) * W;
      for (let i = 0; i < n; i++) {
        const violet = S.gram === '+' ? this.random() >= posLoss : this.random() < negKeep;
        cells.push({ sp, x, y, a: a + (this.random() - 0.5) * 0.3, len, w: S.width, color: violet ? 'violet' : safranin ? 'pink' : 'faint', broken: fix === 'hard' && this.random() < 0.5 });
        x += Math.cos(a) * len * 1.02;
        y += Math.sin(a) * len * 1.02;
      }
    }
    this.gram = { cells, field: W };
    const bs = cells.filter((c) => c.sp === 'bsub');
    const ec = cells.filter((c) => c.sp === 'ecoli');
    const pct = (xs) => Math.round((xs.filter((c) => c.color === 'violet').length / xs.length) * 100);
    const events = [{ type: 'machine', label: 'Nhuộm Gram', text: `Ba vết bôi trên một phiến kính (trái B. subtilis, phải E. coli, giữa trộn hai loài), ${fix === 'gentle' ? 'hơ nhẹ cố định' : 'hơ trực tiếp lâu trên lửa'}; tím kết tinh 1 phút${lugol ? ', Lugol 1 phút' : ''}, rửa nước, tẩy cồn ${decolor} giây, rửa nước${safranin ? ', safranin 30 giây' : ''}; soi vật kính dầu 100×.` }];
    events.push({ type: 'effect', label: 'Kết quả', text: `Vết giữa: ${pct(bs)} % tế bào B. subtilis (que dài 3–5 µm, xếp chuỗi) màu tím; ${pct(ec)} % tế bào E. coli (que ngắn) màu tím, còn lại ${safranin ? 'hồng' : 'gần như không màu'}. Gram dương giữ phức tím kết tinh – iodine trong lớp peptidoglycan dày; Gram âm mất màu khi tẩy cồn rồi bắt màu thuốc nhuộm phụ.` });
    let ok = fix === 'gentle' && lugol && decolor >= 20 && decolor <= 45 && safranin && age <= 24;
    if (!lugol) events.push({ type: 'warning', label: 'Quên Lugol', text: 'Không có Lugol (chất cắn màu) thì tím kết tinh không tạo phức, bị cồn tẩy hết: mọi tế bào đều hồng như Gram âm.' });
    if (decolor >= 60) events.push({ type: 'warning', label: 'Tẩy quá lâu', text: 'Tẩy cồn quá lâu làm cả tế bào Gram dương mất màu tím: B. subtilis lẫn màu hồng, đọc sai thành Gram âm.' });
    if (decolor <= 10) events.push({ type: 'warning', label: 'Tẩy chưa đủ', text: 'Tẩy cồn quá ngắn: E. coli chưa mất màu tím, đọc sai thành Gram dương.' });
    if (age >= 48 && lugol && decolor < 60) events.push({ type: 'warning', label: 'Canh trường già', text: 'Canh trường già, vách tế bào Gram dương yếu đi nên một phần B. subtilis bắt màu hồng (Gram biến đổi). Dùng canh trường 18–24 giờ.' });
    if (!safranin) events.push({ type: 'warning', label: 'Quên thuốc nhuộm phụ', text: 'Không nhuộm safranin hoặc fuchsin: tế bào Gram âm sau khi tẩy gần như trong suốt, khó thấy.' });
    if (fix === 'hard') events.push({ type: 'warning', label: 'Cố định quá nóng', text: 'Hơ trực tiếp lâu trên lửa làm tế bào co rúm, vỡ, hình dạng sai.' });
    this.#note('vs-gram', 'B. subtilis + E. coli', `B. subtilis ${pct(bs)} % tím, E. coli ${pct(ec)} % tím`);
    return { ok, gram: this.gram, violetBsub: pct(bs), violetEcoli: pct(ec), events };
  }

  // ---- Nhuộm bào tử (Ôgietska) ----
  // age: '2w' canh trường 2 tuần | '24h' (sai); heat: hơ HCl và fuchsin tới bốc hơi; counter: nhuộm xanh methylene
  spore({ age = '2w', heat = true, counter = true }) {
    const G = this.data.gram.bsub;
    const S = this.data.spore;
    const frac = S.fraction[age] ?? S.fraction['2w'];
    const cells = [];
    const W = 60;
    for (let k = 0; k < 60; k++) {
      const len = G.len[0] + this.random() * (G.len[1] - G.len[0]);
      const a = this.random() * Math.PI;
      const x = (this.random() - 0.5) * W;
      const y = (this.random() - 0.5) * W;
      const sporulated = this.random() < frac;
      // Bào tử nằm giữa hoặc lệch tâm (0 là giữa tế bào, ±0,3 lệch về một đầu)
      const at = (this.random() < 0.5 ? 0 : 0.3) * (this.random() < 0.5 ? -1 : 1);
      const sporeColor = heat ? 'red' : 'clear';
      if (sporulated && this.random() < S.free) cells.push({ x, y, a, len: S.size[0], w: S.size[1], color: sporeColor, free: true });
      else cells.push({ x, y, a, len, w: G.width, color: counter ? 'blue' : 'faint', spore: sporulated ? { at, color: sporeColor, len: S.size[0], w: S.size[1] } : null });
    }
    this.sporeField = { cells, field: W };
    const nSp = cells.filter((c) => c.free || c.spore).length;
    const events = [{ type: 'machine', label: 'Nhuộm bào tử', text: `Vết bôi B. subtilis ${age === '2w' ? '2 tuần tuổi' : '24 giờ tuổi'}, để khô tự nhiên; HCl 0,5 %${heat ? ' hơ tới bốc hơi, giữ 2 phút' : ' không hơ'}; giấy lọc + fuchsin Ziehl${heat ? ' hơ tới bốc hơi, giữ 5 phút' : ' không hơ'}; tẩy H₂SO₄ 1 % 2 phút${counter ? '; xanh methylene Loeffler 5–15 phút' : ''}; soi vật kính dầu.` },
      { type: 'effect', label: 'Kết quả', text: `${nSp}/${cells.length} tế bào có bào tử hoặc là bào tử tự do. Bào tử ${heat ? 'màu đỏ' : 'không bắt màu, sáng và chiết quang'}, tế bào chất ${counter ? 'màu xanh' : 'gần như không màu'}. Vỏ bào tử dày, nhiều lipid nên khó bắt màu; phải xử lý acid và hơ nóng để fuchsin thấm vào, sau đó bào tử giữ màu đỏ khi tẩy acid còn tế bào chất thì mất màu.` }];
    const ok = age === '2w' && heat && counter;
    if (age !== '2w') events.push({ type: 'warning', label: 'Canh trường non', text: 'Canh trường 24 giờ hầu như chưa tạo bào tử (B. subtilis tạo bào tử khi môi trường cạn dinh dưỡng). Giáo trình dùng canh trường 2 tuần tuổi.' });
    if (!heat) events.push({ type: 'warning', label: 'Không hơ nóng', text: 'Không hơ nóng thì fuchsin không thấm qua vỏ bào tử: bào tử chỉ là những hạt sáng không màu trong tế bào xanh.' });
    if (!counter) events.push({ type: 'warning', label: 'Quên nhuộm bổ sung', text: 'Không nhuộm xanh methylene: tế bào chất sau khi tẩy acid gần như trong suốt, khó thấy vị trí bào tử trong tế bào.' });
    this.#note('vs-spore', 'B. subtilis', `${nSp}/${cells.length} có bào tử`);
    return { ok, spore: this.sporeField, events };
  }

  // ---- Kháng sinh đồ khoanh giấy ----
  // strain: 'atcc' E. coli ATCC 25922 | 'puc' cùng chủng mang pUC19 (gen bla); inoculum: 'std' | 'heavy'; hours: 18 | 6; spacing: 'even' | 'close'
  disk({ strain = 'atcc', inoculum = 'std', hours = 18, spacing = 'even' }) {
    const D = this.data.disk;
    hours = Number(hours);
    const zones = D.disks.map((d) => {
      const sd = (d.range[1] - d.range[0]) / 4;
      let z = d.target + sd * this.random.normal();
      if (strain === 'puc' && d.id === 'AMP') z = D.diskMm; // β-lactamase thuỷ phân ampicillin: không có vòng
      if (inoculum === 'heavy' && z > D.diskMm) z = Math.max(D.diskMm, z - D.heavyShrinkMm);
      z = Math.round(z);
      return { ...d, zone: z, inRange: z >= d.range[0] && z <= d.range[1] };
    });
    const readable = hours >= 16;
    const ring = spacing === 'close' ? D.closeMm : D.ringMm;
    // Hai vòng chồng nhau khi tổng bán kính lớn hơn khoảng cách hai khoanh cạnh nhau
    const gap = ring * Math.SQRT2;
    const overlap = zones.some((z, i) => (z.zone + zones[(i + 1) % zones.length].zone) / 2 > gap);
    this.diskPlate = { zones, ring, plate: D.plateMm, disk: D.diskMm, readable, heavy: inoculum === 'heavy' };
    const name = strain === 'puc' ? 'E. coli ATCC 25922 mang pUC19 (gen bla)' : 'E. coli ATCC 25922';
    const events = [{ type: 'machine', label: 'Khoanh giấy', text: `Trải đều ${name} lên thạch Mueller-Hinton (${inoculum === 'std' ? 'huyền phù chuẩn' : 'huyền phù quá đặc'}), đặt 4 khoanh giấy 6 mm ${spacing === 'even' ? 'cách đều nhau' : 'sát nhau'}, ủ 37 °C ${hours} giờ.` }];
    if (readable) events.push({ type: 'effect', label: 'Vòng vô khuẩn', text: zones.map((z) => `${z.name}: ${z.zone} mm${strain === 'atcc' ? (z.inRange ? ' (trong khoảng chuẩn)' : ` (ngoài khoảng chuẩn ${z.range.join('–')} mm)`) : ''}`).join('; ') + `.${strain === 'puc' ? ' Gen bla của pUC19 mã hoá β-lactamase thuỷ phân vòng β-lactam của ampicillin nên vi khuẩn mọc sát khoanh ampicillin; các kháng sinh khác vẫn có vòng.' : ' Chủng kiểm chuẩn cho vòng trong khoảng EUCAST thì đĩa, khoanh và thạch đạt yêu cầu.'}` });
    let ok = readable && spacing === 'even' && inoculum === 'std';
    if (readable && strain === 'atcc' && !zones.every((z) => z.inRange)) events.push({ type: 'info', label: 'Kiểm chuẩn', text: 'Có vòng nằm ngoài khoảng kiểm chuẩn EUCAST: trong phòng thật phải kiểm tra lại khoanh, thạch, huyền phù và làm lại đĩa kiểm chuẩn.' });
    if (!readable) events.push({ type: 'warning', label: 'Ủ chưa đủ', text: 'Sau 6 giờ lớp vi khuẩn còn mỏng, chưa thấy rõ ranh giới vòng vô khuẩn. Giáo trình ủ 16–18 giờ.' });
    if (inoculum === 'heavy') events.push({ type: 'warning', label: 'Cấy quá dày', text: 'Huyền phù quá đặc làm vòng vô khuẩn nhỏ hơn thật, kết quả nghiêng về kháng thuốc.' });
    if (spacing === 'close' && overlap) events.push({ type: 'warning', label: 'Khoanh quá sát', text: 'Các vòng vô khuẩn chồng lên nhau, không đo được đường kính từng vòng. Đặt khoanh cách đều nhau và cách mép đĩa.' });
    else if (spacing === 'close') ok = false;
    this.#note('vs-disk', name, readable ? zones.map((z) => `${z.id} ${z.zone}`).join(', ') : 'chưa đọc được');
    return { ok, plate: this.diskPlate, zones, events };
  }

  // ---- Lên men rượu bằng nấm men ----
  // yeast: có cấy men giống; temp: 30 | 4 °C; hours: 24 | 48
  ferment({ yeast = true, temp = 30, hours = 24 }) {
    temp = Number(temp);
    hours = Number(hours);
    const active = yeast && temp >= 25;
    const tubes = [
      { label: 'Ba(OH)₂ + dịch lên men', color: null, name: active ? 'đục trắng BaCO₃' : 'trong', ppt: active },
      { label: 'I₂ + NaOH + dịch lên men', color: active ? '#f4e7a6' : null, name: active ? 'tinh thể vàng CHI₃' : 'không có tinh thể', ppt: active },
      { label: 'K₂Cr₂O₇ + dịch lên men', color: active ? '#3f8f5a' : '#e8892c', name: active ? 'xanh lục' : 'da cam' },
      { label: 'K₂Cr₂O₇ + dịch chưa lên men (đối chứng)', color: '#e8892c', name: 'da cam' },
    ];
    const events = [{ type: 'machine', label: 'Lên men', text: `50 mL dịch quả pH 4–6 đã thanh trùng${yeast ? ' + 10 mL men giống' : ', không cấy men giống'}, đậy nút nối ống dẫn khí vào ống chia vạch 25 mL úp ngược trong nước; ủ ${temp} °C ${hours} giờ: ${active ? 'bọt khí CO₂ thoát ra đều, mực nước trong ống chia vạch hạ dần tới khi ống đầy khí' : 'không thấy bọt khí, mực nước trong ống không đổi'}.` },
      { type: 'effect', label: 'Định tính', text: `${tubes.slice(0, 3).map((t) => `${t.label}: ${t.name}`).join('; ')}; đối chứng dịch chưa lên men: da cam. C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂; CO₂ + Ba(OH)₂ → BaCO₃↓; ethanol cho iodoform vàng với I₂ trong kiềm và khử Cr₂O₇²⁻ (da cam) thành Cr³⁺ (xanh lục).` }];
    const ok = yeast && temp === 30;
    if (!yeast) events.push({ type: 'warning', label: 'Quên cấy men', text: 'Dịch quả đã thanh trùng không còn nấm men: không lên men, mọi phép thử âm tính như ống đối chứng.' });
    if (yeast && temp < 25) events.push({ type: 'warning', label: 'Nhiệt độ thấp', text: 'Ở 4 °C nấm men gần như không lên men trong 1–2 ngày. Giáo trình ủ 28–30 °C.' });
    this.#note('vs-ferment', `${yeast ? 'có' : 'không'} men giống, ${temp} °C ${hours} giờ`, active ? 'CO₂, iodoform, K₂Cr₂O₇ dương tính' : 'âm tính');
    return { ok, tubes, events };
  }

  // ---- Đếm khuẩn lạc ----
  // mix: lắc trộn mỗi ống trước khi hút; tip: đổi đầu tip mỗi lần chuyển
  dilute({ to = 5, mix = true, tip = true }) {
    const T = this.data.tpc;
    to = Number(to);
    // Mật độ thật (tế bào/mL) của dịch ở mỗi độ pha loãng 10⁻ᵏ
    const conc = { 1: T.trueCfuPerG / 10 };
    for (let k = 2; k <= to; k++) {
      // Không đổi tip: đầu tip mang theo khoảng 0,05 mL dịch của ống trước (minh hoạ)
      const carry = tip ? 0 : T.tipCarry * conc[k - 1];
      // Không lắc: lượng tế bào hút được dao động mạnh (minh hoạ)
      const draw = mix ? 1 : Math.exp(0.6 * this.random.normal());
      conc[k] = (conc[k - 1] * draw + carry) / 10;
    }
    this.series = { to, conc, mix, tip };
    this.plates = [];
    this.incubated = null;
    const events = [{ type: 'machine', label: 'Pha loãng', text: `10 g mẫu + 90 mL nước muối peptone (SPW), dập mẫu 2 phút → 10⁻¹; rồi 1 mL + 9 mL SPW tới 10⁻${sup(to)}${mix ? ', lắc trộn mỗi ống' : ''}${tip ? ', đổi đầu tip mỗi lần' : ''}.` }];
    if (!tip) events.push({ type: 'warning', label: 'Không đổi tip', text: 'Dùng một đầu tip cho cả dãy: dịch đậm đặc bám ngoài tip đi theo sang ống sau, độ pha loãng cao có nhiều tế bào hơn thật.' });
    if (!mix) events.push({ type: 'warning', label: 'Không lắc', text: 'Không lắc trộn trước khi hút: tế bào lắng, lượng hút được không đại diện, các độ pha loãng không tỉ lệ 10 lần.' });
    this.#note('vs-dilute', T.label, `tới 10⁻${to}`);
    return { ok: mix && tip, events };
  }

  // dils: các độ pha loãng (k) đem đổ đĩa, mỗi độ 2 đĩa; agarC: nhiệt độ PCA khi đổ
  plate({ dils = [3, 4], agarC = 45, method = 'pour' }) {
    if (!this.series) return { ok: false, events: [{ type: 'warning', text: 'Chưa pha loãng mẫu.' }] };
    const T = this.data.tpc;
    agarC = Number(agarC);
    const V = method === 'spread' ? 0.1 : 1;
    const kill = agarC > 55 ? T.hotAgarSurvival : 1;
    const events = [];
    for (const k of dils) {
      if (!this.series.conc[k]) { events.push({ type: 'warning', text: `Chưa có ống 10⁻${sup(k)}.` }); continue; }
      for (let r = 0; r < 2; r++) this.plates.push({ k, V, mean: this.series.conc[k] * V * kill });
    }
    events.unshift({ type: 'machine', label: 'Đổ đĩa', text: method === 'pour' ? `Hút 1 mL mỗi độ pha loãng (${dils.map((k) => `10⁻${sup(k)}`).join(', ')}) vào 2 đĩa, đổ 10–15 mL PCA ${agarC} °C, xoay mỗi chiều 3–5 lần, để đông.` : `Nhỏ 0,1 mL mỗi độ pha loãng lên mặt thạch PCA, trải đều bằng que gạt đã hơ lửa và để nguội.` });
    if (agarC > 55) events.push({ type: 'warning', label: 'Thạch quá nóng', text: `Đổ PCA ${agarC} °C: thạch quá nóng làm chết một phần tế bào, số khuẩn lạc thấp hơn thật. Giữ thạch ở 45 °C trước khi đổ.` });
    this.#note('vs-plate', dils.map((k) => `10⁻${k}`).join(', '), `PCA ${agarC} °C`);
    return { ok: agarC <= 55 && method === 'pour', events };
  }

  incubate({ temp = 30, hours = 72 }) {
    if (!this.plates.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa có đĩa để ủ.' }] };
    const T = this.data.tpc;
    hours = Number(hours);
    temp = Number(temp);
    // Ủ chưa đủ: khuẩn lạc nhỏ chưa nhìn thấy (minh hoạ)
    const seen = hours >= 72 ? 1 : T.early24h;
    for (const p of this.plates) p.count = this.#poisson(p.mean * seen);
    this.incubated = { temp, hours };
    const events = [{ type: 'machine', label: 'Ủ', text: `Lật ngược đĩa, ủ ${temp} °C trong ${hours} giờ.` }];
    if (hours < 72) events.push({ type: 'warning', label: 'Ủ chưa đủ', text: 'Ủ chưa đủ 72 giờ: khuẩn lạc mọc chậm còn quá nhỏ, đếm thiếu.' });
    this.#note('vs-incubate', `${this.plates.length} đĩa`, `${temp} °C, ${hours} giờ`);
    return { ok: hours >= 72 && temp === 30, events };
  }

  count() {
    if (!this.incubated) return { ok: false, events: [{ type: 'warning', text: 'Chưa ủ đĩa.' }] };
    const counts = {};
    for (const p of this.plates) (counts[p.k] ??= []).push(p.count);
    const V = this.plates[0].V;
    const r = plateCount(counts, V);
    const truth = this.data.tpc.trueCfuPerG;
    const rows = Object.entries(counts).map(([k, cs]) => [`10⁻${sup(k)}`, cs.map((c) => (c > 300 ? 'quá dày' : c)).join(', '), r.used?.[k] ? 'dùng để tính' : cs.some((c) => c > 250) ? 'quá 250' : 'dưới 25']);
    const events = [];
    let ok = true;
    if (r.value) {
      const err = ((r.value - truth) / truth) * 100;
      ok = Math.abs(err) < 30;
      if (r.low) events.push({ type: 'warning', label: 'Ước lượng', text: 'Đĩa dùng để tính có dưới 25 khuẩn lạc: kết quả chỉ là ước lượng.' });
      events.push({ type: 'machine', label: 'Tổng vi khuẩn hiếu khí', text: `A = ΣC / [V(n₁ + 0,1n₂)d] = ${r.sum} / [${dec(V, V < 1 ? 1 : 0)} × (${r.n1} + 0,1 × ${r.n2}) × 10⁻${sup(r.k)}] = ${sci(r.value)} CFU/g.` });
      events.push({ type: ok ? 'effect' : 'warning', label: 'So với thật', text: `Mật độ thật của mẫu trong mô phỏng ${sci(truth)} CFU/g, lệch ${dec(err, 0)} %.${ok ? '' : ' Lệch nhiều: xem lại nhiệt độ thạch, thời gian ủ, đổi tip và lắc trộn khi pha loãng.'}` });
    } else {
      ok = false;
      events.push({ type: 'warning', label: 'Ngoài khoảng đếm', text: r.over ? `Mọi đĩa ở độ pha loãng cao nhất đều quá 250 khuẩn lạc: ghi > ${sci(r.over)} CFU/g, phải pha loãng thêm.` : `Mọi đĩa ở độ pha loãng thấp nhất đều dưới 25 khuẩn lạc: ghi < ${sci(r.under)} CFU/g, phải cấy độ pha loãng thấp hơn.` });
    }
    this.#note('vs-count', 'tổng vi khuẩn hiếu khí', r.value ? `${sci(r.value)} CFU/g` : 'ngoài khoảng đếm');
    return { ok, value: r.value, counts, table: { head: ['Độ pha loãng', 'Khuẩn lạc/đĩa', 'Ghi chú'], rows }, events };
  }

  // ---- MPN coliform ----
  mpnTest({ confirm = true }) {
    const M = this.data.mpn;
    const lsb = M.volumesG.map((v) => Array.from({ length: 3 }, () => this.random.poisson(M.truePerG * v) > 0));
    // Ống LSB sinh hơi do vi khuẩn khác (không phải coliform): mất đi khi khẳng định trên BGBL (minh hoạ)
    const gas = lsb.map((row) => row.map((pos) => pos || this.random() < M.falseLsb));
    const read = confirm ? lsb : gas;
    const pos = read.map((row) => row.filter(Boolean).length);
    const r = mpn(pos, M.volumesG);
    const code = pos.join('-');
    const val = r.below ? '< 3' : r.above ? '> 1100' : String(round2(r.value)).replace('.', ',');
    const events = [{ type: 'machine', label: 'MPN 3 × 3', text: `1 mL mỗi độ pha loãng 10⁻¹, 10⁻², 10⁻³ (0,1; 0,01; 0,001 g mẫu) vào 3 ống canh LSB có ống Durham, 37 °C 48 giờ: ${gas.map((row) => row.filter(Boolean).length).join('-')} ống sinh hơi.${confirm ? ` Cấy sang BGBL 37 °C 48 giờ để khẳng định: ${code}.` : ''}` }];
    events.push({ type: 'effect', label: 'MPN', text: `Tổ hợp ${code} → ${val} MPN/g (nghiệm hợp lý cực đại, trùng bảng MPN của giáo trình).` });
    if (!confirm) events.push({ type: 'warning', label: 'Chưa khẳng định', text: 'Ống LSB sinh hơi chưa chắc là coliform (vi khuẩn khác cũng lên men sinh hơi): phải cấy sang BGBL để khẳng định, nếu không MPN có thể cao hơn thật.' });
    this.#note('vs-mpn', 'coliform', `${code}, ${val} MPN/g`);
    return { ok: Boolean(confirm), code, value: r.value, events };
  }

  // ---- Buồng đếm Goriaev: nấm men ----
  // dil: hệ số pha loãng; squares: số ô lớn đếm
  hemo({ dil = 5, squares = 5 }) {
    const Y = this.data.yeast;
    dil = Number(dil);
    squares = Number(squares);
    const perLarge = (Y.trueCellsPerMl / dil) * 4e-6; // ô lớn 1/25 mm² × 0,1 mm = 4·10⁻⁶ mL
    const perSmall = perLarge / 16;
    // Quá đông thì tế bào chồng lên nhau, đếm sót (minh hoạ 2 % mỗi tế bào trên ô nhỏ)
    const seen = Math.max(0.5, 1 - Y.crowdLoss * Math.max(0, perSmall - 10));
    const counts = Array.from({ length: squares }, () => this.#poisson(perLarge * seen));
    const a = counts.reduce((x, y) => x + y, 0) / squares;
    const N = 0.25 * a * 1e6 * dil;
    const err = ((N - Y.trueCellsPerMl) / Y.trueCellsPerMl) * 100;
    const events = [{ type: 'machine', label: 'Buồng đếm', text: `Pha loãng ${dil} lần, nhỏ vào buồng đếm Goriaev, đếm ${squares} ô lớn: ${counts.join(', ')} tế bào (trung bình a = ${dec(a, 1)}, khoảng ${dec(perSmall, 1)} tế bào mỗi ô nhỏ). N = 0,25 · a · 10⁶ · ${dil} = ${sci(N, 2)} tế bào/mL.` }];
    events.push({ type: 'effect', label: 'So với thật', text: `Mật độ thật trong mô phỏng ${sci(Y.trueCellsPerMl, 1)} tế bào/mL, lệch ${dec(err, 0)} %.` });
    let ok = perSmall >= 5 && perSmall <= 10 && squares >= 5;
    if (perSmall > 10) events.push({ type: 'warning', label: 'Quá đông', text: 'Hơn 10 tế bào mỗi ô nhỏ: tế bào chồng lên nhau, đếm sót. Pha loãng thêm để mỗi ô nhỏ có 5–10 tế bào.' });
    if (perSmall < 5) events.push({ type: 'warning', label: 'Quá thưa', text: 'Dưới 5 tế bào mỗi ô nhỏ: số đếm ít nên sai số ngẫu nhiên lớn. Pha loãng ít hơn.' });
    if (squares < 5) events.push({ type: 'warning', label: 'Đếm quá ít ô', text: 'Phải đếm ít nhất 5 ô lớn (4 góc và giữa) để giảm sai số.' });
    this.#note('vs-hemo', 'nấm men', `${sci(N, 2)} tế bào/mL`);
    return { ok, N, a, counts, events };
  }
}
