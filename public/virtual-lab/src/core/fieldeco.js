// Sinh thái thực địa (bài 04–06 Biological Field Study, Cát Bà; data/fieldeco.json): quần xã cây ngập mặn sinh theo
// phân bố cụm, ô tiêu chuẩn nhiều kích thước, ước lượng số lượng và mật độ, sai số so với số thật, hệ số liên kết V,
// chỉ số Margalef, Shannon–Wiener, Simpson, Sørensen; bẫy côn trùng và đường tích luỹ loài. Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';
import { margalef, shannon, simpson } from './stats.js';

export { margalef, shannon, simpson };

export const FE_ACTIONS = { 'fe-env': 'Đo môi trường', 'fe-quadrat': 'Đếm ô tiêu chuẩn', 'fe-assoc': 'Liên kết hai loài', 'fe-diversity': 'Chỉ số đa dạng', 'fe-trap': 'Đặt bẫy côn trùng', 'fe-accum': 'Đường tích luỹ loài', 'fe-bat': 'Ghi sóng siêu âm của dơi', 'fe-birds': 'Điều tra chim theo tuyến', 'fe-fish': 'Thu cá ở bãi triều', 'fe-crab': 'Thu cua ở bãi triều', 'fe-key': 'Định loại bằng khoá lưỡng phân' };
const fmt = (x, d = 2) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');

export const sorensen = (A, B) => (A.size + B.size ? (2 * [...A].filter((x) => B.has(x)).length) / (A.size + B.size) : 0);
// Hệ số liên kết V từ bảng 2 × 2 (a: có cả hai, b: chỉ B, c: chỉ A, d: không có cả hai)
export function association(a, b, c, d) {
  const den = Math.sqrt((a + b) * (c + d) * (a + c) * (b + d));
  return den ? (a * d - b * c) / den : 0;
}

export class FieldEcoLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    // Quần xã thật của mỗi điểm: toạ độ từng cây (quá trình Thomas: tâm cụm Poisson, cây phân bố chuẩn quanh tâm)
    this.plants = {};
    for (const [id, site] of Object.entries(this.data.sites)) {
      const L = site.side;
      const list = [];
      for (const [sci, vn, dens, r] of site.species) {
        const total = Math.round((dens * L * L) / 100);
        const clusters = Math.max(1, Math.round(total / 5));
        const centers = Array.from({ length: clusters }, () => [this.random() * L, this.random() * L]);
        for (let i = 0; i < total; i++) {
          const [cx, cy] = centers[i % clusters];
          const x = (((cx + r * this.random.normal()) % L) + L) % L;
          const y = (((cy + r * this.random.normal()) % L) + L) % L;
          list.push({ sp: sci, vn, x, y });
        }
      }
      this.plants[id] = list;
    }
    this.samples = {};
    this.catches = [];
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'fe-env': () => this.env(params), 'fe-quadrat': () => this.quadrat(params), 'fe-assoc': () => this.assoc(params), 'fe-diversity': () => this.diversity(params), 'fe-trap': () => this.trap(params), 'fe-accum': () => this.accum(params), 'fe-bat': () => this.bat(params), 'fe-birds': () => this.birds(params), 'fe-fish': () => this.fish(params), 'fe-crab': () => this.crab(params), 'fe-key': () => this.key(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  env({ site = 'sea' }) {
    const E = this.data.env;
    const sal = E.salinity[0] + this.random() * (E.salinity[1] - E.salinity[0]);
    const pH = E.pH + 0.05 * this.random.normal();
    return { ok: true, events: [{ type: 'machine', label: 'Môi trường', text: `${this.data.sites[site].name}: độ muối ${fmt(sal, 2)} (bài 06 ghi 1,2–1,3, không ghi đơn vị), pH ${fmt(pH, 1)}: nền rừng ngập mặn hơi chua.` }] };
  }

  // Đặt n ô vuông cạnh size (m) ngẫu nhiên; đếm số cây mỗi loài trong từng ô
  #throw(site, size, n) {
    const L = this.data.sites[site].side;
    const out = [];
    this.lastQuadrats = [];
    for (let i = 0; i < n; i++) {
      const x0 = this.random() * (L - size);
      const y0 = this.random() * (L - size);
      this.lastQuadrats.push({ site, x: x0, y: y0, size });
      const counts = {};
      for (const p of this.plants[site]) if (p.x >= x0 && p.x < x0 + size && p.y >= y0 && p.y < y0 + size) counts[p.sp] = (counts[p.sp] ?? 0) + 1;
      out.push(counts);
    }
    return out;
  }

  quadrat({ site = 'sea', size = 2, n = 5, species = null }) {
    const S = this.data.sites[site];
    const L = S.side;
    const qs = this.#throw(site, Number(size), Number(n));
    (this.samples[site] ??= []).push(...qs.map((c) => ({ size: Number(size), counts: c })));
    const target = species ?? S.species[0][0];
    const vn = S.species.find((s) => s[0] === target)?.[1] ?? target;
    const xs = qs.map((c) => c[target] ?? 0);
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const area = Number(size) ** 2;
    const Nest = (mean / area) * L * L;
    const Ntrue = this.plants[site].filter((p) => p.sp === target).length;
    const err = (1 - Nest / Ntrue) * 100;
    const rows = qs.map((c, i) => [`Ô ${i + 1}`, ...S.species.map((s) => String(c[s[0]] ?? 0))]);
    this.last = { site, size: Number(size), mean, Nest, Ntrue, err };
    this.notebook.add({ day: '', experiment: 'Ô tiêu chuẩn', action: FE_ACTIONS['fe-quadrat'], subject: `${S.name} ${size}×${size} m`, result: `${vn}: ${fmt(mean, 1)}/ô`, Nest: Math.round(Nest), err: fmt(err, 1) });
    return {
      ok: true, err,
      table: { head: ['Ô', ...S.species.map((s) => s[1])], rows },
      events: [
        { type: 'machine', label: 'Ô tiêu chuẩn', text: `${S.name}: ${n} ô ${size} × ${size} m đặt ngẫu nhiên trong khu ${L} × ${L} m.` },
        { type: 'effect', label: vn, text: `x̄ = ${fmt(mean, 2)} cây/ô → mật độ ${fmt(mean / area, 3)} cây/m², ước lượng ${Math.round(Nest)} cây trong khu (thật: ${Ntrue}). Sai số = (1 − N ước lượng / N thực tế) × 100 % = ${fmt(err, 1)} %.` },
        ...(Number(size) <= 1 ? [{ type: 'info', text: 'Ô quá nhỏ so với khoảng cách giữa các cây: nhiều ô trống, ước lượng dao động mạnh.' }] : []),
      ],
    };
  }

  // Liên kết hai loài: đếm số ô có A, có B trên n ô
  assoc({ site = 'land', a = 'Kandelia obovata', b = 'Acanthus ilicifolius', size = 2, n = 30 }) {
    const qs = this.#throw(site, Number(size), Number(n));
    let A = 0;
    let B = 0;
    let C = 0;
    let D = 0;
    for (const q of qs) {
      const ha = (q[a] ?? 0) > 0;
      const hb = (q[b] ?? 0) > 0;
      if (ha && hb) A++;
      else if (hb) B++;
      else if (ha) C++;
      else D++;
    }
    const V = association(A, B, C, D);
    const name = (sp) => this.data.sites[site].species.find((s) => s[0] === sp)?.[1] ?? sp;
    return { ok: true, V, events: [{ type: 'machine', label: 'Bảng 2 × 2', text: `${n} ô ${size} × ${size} m: cả hai ${A}, chỉ ${name(b)} ${B}, chỉ ${name(a)} ${C}, không có ${D}.` }, { type: 'effect', label: 'V', text: `V = (ad − bc)/√((a+b)(c+d)(a+c)(b+d)) = ${fmt(V, 3)}: ${V > 0.1 ? 'liên kết dương (hay gặp cùng nhau)' : V < -0.1 ? 'liên kết âm (tránh nhau)' : 'gần như không liên kết'}.` }] };
  }

  // Chỉ số đa dạng từ mọi ô đã đếm ở một điểm; Sørensen nếu đã đếm cả hai điểm
  diversity({ site = 'sea' }) {
    const qs = this.samples[site] ?? [];
    if (!qs.length) return { ok: false, events: [{ type: 'warning', text: 'Chưa đếm ô nào ở điểm này.' }] };
    const tot = {};
    for (const q of qs) for (const [sp, n] of Object.entries(q.counts)) tot[sp] = (tot[sp] ?? 0) + n;
    const counts = Object.values(tot);
    const S = counts.filter((x) => x > 0).length;
    const N = counts.reduce((a, b) => a + b, 0);
    const H = shannon(counts);
    const events = [{ type: 'effect', label: 'Đa dạng', text: `${this.data.sites[site].name}: S = ${S} loài, N = ${N} cây. Margalef D = (S − 1)/ln N = ${fmt(margalef(S, N), 3)} (bài 06 ghi dùng lg N: ${fmt(margalef(S, N, Math.log10), 3)}). Shannon H = ${fmt(H, 3)} (tối đa ln S = ${fmt(Math.log(Math.max(1, S)), 3)}). Simpson 1 − D = ${fmt(simpson(counts), 3)}.` }];
    const other = Object.keys(this.samples).find((k) => k !== site && this.samples[k].length);
    if (other) {
      const set = (k) => new Set(this.samples[k].flatMap((q) => Object.keys(q.counts)));
      events.push({ type: 'effect', label: 'Sørensen', text: `SI = 2C/(A + B) giữa hai điểm = ${fmt(sorensen(set(site), set(other)), 3)}.` });
    }
    this.notebook.add({ day: '', experiment: 'Đa dạng', action: FE_ACTIONS['fe-diversity'], subject: this.data.sites[site].name, result: `H ${fmt(H, 3)}`, S, N });
    return { ok: true, S, N, H, events };
  }

  // Bẫy côn trùng trên tuyến Ao Ếch: số con mỗi nhóm ~ Poisson(tốc độ × giờ)
  trap({ trap = 'net', hours = 2.5 }) {
    const G = this.data.insects;
    const got = G.groups.map(([taxon, vn, rates]) => [taxon, vn, this.random.poisson((rates[trap] ?? 0) * Number(hours))]).filter((g) => g[2] > 0);
    this.catches.push({ trap, got });
    const total = got.reduce((s, g) => s + g[2], 0);
    this.notebook.add({ day: '', experiment: 'Côn trùng', action: FE_ACTIONS['fe-trap'], subject: G.traps[trap], result: `${total} con, ${got.length} nhóm` });
    return { ok: true, table: { head: ['Nhóm', 'Tên', 'Số con'], rows: got.map((g) => [g[0], g[1], String(g[2])]) }, events: [{ type: 'machine', label: 'Bẫy', text: `${G.traps[trap]} ${hours} giờ: ${total} con thuộc ${got.length} nhóm.${trap === 'net' ? ' Vợt bắt chủ yếu bướm bay ban ngày (bài 04: 12 mẫu, 7 họ, nhiều nhất là bướm phấn).' : trap === 'pitfall' ? ' Bẫy hố bắt côn trùng bò trên mặt đất.' : ''}` }] };
  }

  // Đường tích luỹ số nhóm theo số mẫu (các lần đặt bẫy theo thứ tự)
  accum() {
    const seen = new Set();
    const points = [[0, 0]];
    this.catches.forEach((c, i) => { for (const g of c.got) seen.add(g[0]); points.push([i + 1, seen.size]); });
    const flat = points.length > 3 && points.at(-1)[1] === points.at(-3)[1];
    return { ok: this.catches.length > 1, series: [{ name: 'số nhóm', points }], events: [{ type: 'effect', label: 'Tích luỹ', text: `${this.catches.length} lần thu, ${seen.size} nhóm côn trùng.${flat ? ' Đường đã gần nằm ngang: thêm mẫu ít gặp nhóm mới.' : ' Đường còn đi lên: cần thu thêm để đủ thành phần loài (điều tra bổ sung như bài 05 nhắc).'}` }] };
  }

  // Dơi trong hang: máy ghi siêu âm đo tần số hằng định (CF) của từng lượt kêu; hai loài nếp mũi trông giống nhau tách
  // được nhờ tần số (báo cáo: 98,6 kHz và 78,1 kHz). Không có máy thì chỉ đếm được tổng số.
  bat({ detector = true, minutes = 10 }) {
    const B = this.data.bats;
    const total = B.species.reduce((a, s) => a + s[2], 0);
    const n = Math.round(B.passesPerMin * Number(minutes));
    if (!detector) return { ok: false, events: [{ type: 'warning', label: 'Không có máy', text: `${B.cave}: khoảng ${Math.round(total * (0.8 + 0.4 * this.random()))} con dơi nếp mũi bay ra; hai loài cùng chi trông gần như giống nhau, không có máy phân tích siêu âm thì không tách được.` }] };
    const calls = Array.from({ length: n }, () => {
      const r = this.random() * total;
      const sp = r < B.species[0][2] ? B.species[0] : B.species[1];
      return { sp: sp[0], f: sp[3] + B.sdKHz * this.random.normal() };
    });
    const cut = (B.species[0][3] + B.species[1][3]) / 2;
    const hi = calls.filter((c) => c.f >= cut).length;
    const bins = Array.from({ length: 30 }, (_, i) => [70 + i, 0]);
    for (const c of calls) { const k = Math.floor(c.f) - 70; if (k >= 0 && k < 30) bins[k][1] += 1; }
    const mean = (xs) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
    const fh = mean(calls.filter((c) => c.f >= cut).map((c) => c.f));
    const fl = mean(calls.filter((c) => c.f < cut).map((c) => c.f));
    this.notebook.add({ day: '', experiment: 'Thực địa', action: FE_ACTIONS['fe-bat'], subject: B.cave, result: `${hi}/${n} lượt ≥ ${fmt(cut, 1)} kHz`, high: fh, low: fl });
    return {
      ok: true,
      series: [{ name: 'số lượt kêu', points: bins }],
      events: [
        { type: 'machine', label: 'Máy ghi siêu âm', text: `${B.cave}, ${minutes} phút ở cửa hang: ${n} lượt kêu. Hai nhóm tần số: ${fmt(fh, 1)} kHz (${hi} lượt) và ${fmt(fl, 1)} kHz (${n - hi} lượt).` },
        { type: 'effect', label: 'Định loại', text: `Nhóm tần số cao gần ${B.species[0][3].toString().replace('.', ',')} kHz: ${B.species[0][1]} (${B.species[0][0]}); nhóm thấp gần ${B.species[1][3].toString().replace('.', ',')} kHz: ${B.species[1][1]} (${B.species[1][0]}). Tỉ lệ lượt kêu ${fmt(hi / Math.max(1, n - hi), 2)} : 1, gần tỉ lệ số con trong báo cáo (khoảng 100 : 300).` },
      ],
    };
  }

  // Chim trên tuyến: yên lặng và loa phát tiếng hót tăng số lần bắt gặp; ồn ào hoặc buổi chiều nắng thì ít hơn
  birds({ hours = 4, playback = true, quiet = true, session = 'morning' }) {
    const B = this.data.birds;
    const k = (playback ? B.playback : 1) * (quiet ? 1 : B.noisy) * (session === 'morning' ? 1 : B.afternoon);
    const seen = B.taxa.map(([sci, vn, rate]) => [sci, vn, this.random.poisson(rate * Number(hours) * k)]);
    const got = seen.filter((x) => x[2]);
    const events = [{ type: 'machine', label: 'Tuyến', text: `${hours} giờ ${session === 'morning' ? 'buổi sáng' : 'buổi chiều'}, ${quiet ? 'đi yên lặng' : 'cả nhóm nói chuyện'}${playback ? ', có loa phát tiếng chim hót' : ''}: ${got.length ? got.map(([s, v, n]) => `${v} (${s}) ${n}`).join('; ') : 'không bắt gặp con nào'}.` }];
    if (!quiet) events.push({ type: 'warning', label: 'Ồn ào', text: 'Tiếng ồn làm chim bay đi trước khi kịp quan sát: số loài và số con giảm mạnh.' });
    events.push({ type: 'info', label: 'Báo cáo gốc', text: 'Họ Hút mật 4 con, Bông lau họng vạch 1, chi Quạ 1 (định loại qua mỏ, màu lông, dị hình giới tính và tiếng kêu).' });
    this.notebook.add({ day: '', experiment: 'Thực địa', action: FE_ACTIONS['fe-birds'], subject: session, result: `${got.length} loài`, birds: got.reduce((a, x) => a + x[2], 0) });
    return { ok: quiet, table: { head: ['Taxon', 'Tên Việt', 'Số con'], rows: seen.map(([s, v, n]) => [s, v, String(n)]) }, events };
  }

  // Cá ở bãi triều: lưới, vợt bắt cá bơi; ống hút bùn bắt cá vùi bùn (bống, thòi lòi); quan sát cá thòi lòi khi triều rút
  fish({ gear = 'net', tide = 'low' }) {
    const F = this.data.fish;
    const k = tide === 'low' ? 1 : 0.4;
    const got = F.taxa.map(([sci, vn, r]) => [sci, vn, this.random.poisson((r[gear] ?? 0) * k)]);
    const events = [{ type: 'machine', label: 'Xuân Đám', text: `${{ net: 'Kéo lưới, vợt', pump: 'Hút bùn bằng ống hút', look: 'Quan sát mặt bùn' }[gear]} lúc triều ${tide === 'low' ? 'rút' : 'lên'}: ${got.filter((x) => x[2]).map(([s, v, n]) => `${v} (${s}) ${n}`).join('; ') || 'không thu được gì'}.` }];
    if (gear === 'net') events.push({ type: 'info', text: 'Lưới chỉ bắt cá bơi tự do; cá bống, cá thòi lòi vùi trong hang bùn phải dùng ống hút bùn.' });
    this.notebook.add({ day: '', experiment: 'Thực địa', action: FE_ACTIONS['fe-fish'], subject: gear, result: `${got.filter((x) => x[2]).length} nhóm`, tide });
    return { ok: true, table: { head: ['Taxon', 'Tên Việt', 'Số con'], rows: got.map(([s, v, n]) => [s, v, String(n)]) }, events };
  }

  // Cua: triều rút mới thu được nhiều; cua bãi triều (Grapsidae) sống trong hang, đào hố mới bắt được; quên găng thì bị kẹp
  crab({ tide = 'low', dig = true, gloves = true }) {
    const C = this.data.crabs;
    const got = C.families.map(([fam, vn, rate, burrow]) => [fam, vn, this.random.poisson(rate * (tide === 'low' ? 1 : C.highTide) * (burrow && dig ? C.dig : 1))]);
    const events = [{ type: 'machine', label: 'Bãi triều', text: `Triều ${tide === 'low' ? 'rút' : 'lên'}${dig ? ', đào hố và đặt bẫy chặn đường chạy' : ''}: ${got.filter((x) => x[2]).map(([f, v, n]) => `${f} (${v}) ${n}`).join('; ') || 'không thu được con nào'}. Định loại đến họ theo hình dạng mai và càng.` }];
    if (tide !== 'low') events.push({ type: 'warning', label: 'Triều lên', text: 'Triều lên cua trốn vào hang, bãi ngập nước: phải xem lịch thuỷ triều và thu mẫu lúc triều rút.' });
    if (!gloves) events.push({ type: 'warning', label: 'An toàn', text: 'Bắt cua bằng tay trần: dễ bị càng kẹp, một số loài cua đá (Eriphiidae và họ gần) có độc tố, không được ăn.' });
    this.notebook.add({ day: '', experiment: 'Thực địa', action: FE_ACTIONS['fe-crab'], subject: tide, result: `${got.filter((x) => x[2]).length} họ`, crabs: got.reduce((a, x) => a + x[2], 0) });
    return { ok: tide === 'low' && gloves, table: { head: ['Họ', 'Tên thường gọi', 'Số con'], rows: got.map(([f, v, n]) => [f, v, String(n)]) }, events };
  }

  // Khoá lưỡng phân: answers[i] là lựa chọn (0 hoặc 1) ở cặp đặc điểm thứ i đi qua
  key({ specimen = 'ardisia', answers = [] }) {
    const K = this.data.keys[specimen];
    if (!K) return { ok: false, events: [{ type: 'warning', text: `Không có mẫu ${specimen}.` }] };
    const path = [];
    let c = 0;
    let result = null;
    for (let step = 0; step < K.couplets.length && result == null; step++) {
      const cp = K.couplets[c];
      const pick = Number(answers[c] ?? 0);
      const [text, go] = cp.opts[pick];
      path.push(`${c + 1}. ${cp.q}: ${text}`);
      if (go.result) result = go.result;
      else c = go.next;
    }
    const target = K.couplets.at(-1).opts[K.answers.at(-1)][1].result;
    const ok = result === target;
    this.lastKey = { specimen, result, ok };
    const events = [{ type: 'machine', label: K.name, text: path.join(' → ') }];
    events.push(ok ? { type: 'effect', label: 'Kết quả', text: `Định loại được: ${result}. Khớp báo cáo thực tập.` } : { type: 'warning', label: 'Định loại sai', text: `Ra ${result ?? 'chưa tới kết quả'}, nhưng mẫu là ${target}. Xem lại đặc điểm ở bước chọn khác với mẫu.` });
    this.notebook.add({ day: '', experiment: 'Thực địa', action: FE_ACTIONS['fe-key'], subject: specimen, result: result ?? '' });
    return { ok, result, events };
  }
}
