// Thử độc tính trên phôi cá ngựa vằn (FET, OECD 236): thu trứng, chọn phôi thụ tinh, chia vào đĩa giếng theo dãy nồng độ,
// ủ và quan sát mỗi 24 giờ tới 96 giờ, rồi tính LC50, EC50 và kiểm tra tiêu chí hợp lệ. Không phụ thuộc DOM.
// Nguồn số liệu: data/zebrafish.json (Kimmel 1995, OECD TG 236, báo cáo thực hành PG của chủ dự án).

import { rng } from './random.js';
import { Notebook } from './notebook.js';
import { fitLL4, ll4, nls } from './stats.js';
import { spawning, spawnStart, SPAWN, HUSBANDRY } from '../../figures/zebrafish/model.mjs';

export const ZF_ACTIONS = {
  'zf-spawn': 'Cho cá đẻ',
  'zf-collect': 'Thu trứng',
  'zf-expose': 'Chia phôi vào đĩa giếng',
  'zf-grow': 'Ủ phôi',
  'zf-observe': 'Quan sát dưới kính soi nổi',
  'zf-analyze': 'Tính LC50, kiểm tra hợp lệ',
};

export const ENDPOINT = {
  coagulated: 'phôi đông tụ',
  somites: 'không hình thành thể tiết',
  tail: 'đuôi không tách khỏi noãn hoàng',
  heart: 'không có nhịp tim',
};
export const MALFORMATION = { edema: 'phù màng tim, phù noãn hoàng', curve: 'cong cột sống, cong đuôi' };

const log10 = Math.log10;
const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d).replace('.', ',') : '—');

// Tốc độ phát triển so với 28,5 °C (Kimmel 1995): H_T = h / (0,055·T − 0,57)
export const devRate = (T) => 0.055 * T - 0.57;

export function stageAt(zf, devH) {
  let s = zf.stages[0];
  for (const st of zf.stages) if (devH >= st.h) s = st;
  return s;
}

// Hồi quy logistic theo log10(nồng độ), số liệu nhị thức (IRLS). Trả về LC50 hoặc null khi không ước lượng được.
export function fitLC50(points) {
  const pts = points.filter((p) => p.c > 0 && p.n > 0);
  const partial = pts.filter((p) => p.k > 0 && p.k < p.n);
  if (!pts.length) return null;
  if (partial.length) {
    let a = 0;
    let b = 1;
    // Khởi tạo từ hai điểm đầu cuối
    for (let it = 0; it < 50; it++) {
      let g0 = 0, g1 = 0, h00 = 0, h01 = 0, h11 = 0;
      for (const p of pts) {
        const x = log10(p.c);
        const pr = 1 / (1 + Math.exp(-(a + b * x)));
        const w = p.n * pr * (1 - pr);
        const r = p.k - p.n * pr;
        g0 += r; g1 += r * x;
        h00 += w; h01 += w * x; h11 += w * x * x;
      }
      const det = h00 * h11 - h01 * h01;
      if (Math.abs(det) < 1e-12) break;
      const da = (h11 * g0 - h01 * g1) / det;
      const db = (h00 * g1 - h01 * g0) / det;
      a += da; b += db;
      if (Math.abs(da) + Math.abs(db) < 1e-8) break;
    }
    if (b > 0 && Number.isFinite(a)) return { lc50: 10 ** (-a / b), slope: b, method: 'hồi quy logistic theo log(nồng độ)' };
  }
  // Không có nồng độ nào chết một phần: lấy trung bình nhân giữa nồng độ cao nhất không chết và thấp nhất chết hết
  const none = pts.filter((p) => p.k === 0).map((p) => p.c);
  const all = pts.filter((p) => p.k === p.n).map((p) => p.c);
  if (none.length && all.length) {
    const lo = Math.max(...none.filter((c) => c < Math.min(...all)), 0);
    const hi = Math.min(...all);
    if (lo > 0) return { lc50: Math.sqrt(lo * hi), slope: null, method: `trung bình nhân của ${fmt(lo, 2)} (không chết) và ${fmt(hi, 2)} (chết hết)` };
  }
  return null;
}

export class ZebrafishLab {
  // setup: { chemical, series, perWell, plate, temp, positive, oecd }
  constructor({ zf, setup, seed = Date.now() }) {
    this.zf = zf;
    this.notebook = new Notebook();
    this.setUp(setup, seed);
  }

  setUp(setup, seed = Date.now()) {
    this.setup = { perWell: 20, temp: 26, positive: false, ...setup };
    this.random = rng(seed);
    this.notebook.clear();
    this.clutch = null;
    this.spawned = null;
    this.wells = null;
    this.hours = 0; // giờ thật sau thụ tinh
    this.devH = 0; // giờ phát triển chuẩn (ở 28,5 °C)
    this.history = [];
  }

  chemical(id = this.setup.chemical) {
    return this.zf.chemicals.find((c) => c.id === id);
  }

  #log(action, subject, result, extra = {}) {
    this.notebook.add({ day: `${Math.round(this.hours)} hpf`, experiment: 'FET', action: ZF_ACTIONS[action], subject, result, ...extra });
  }

  do(action, params = {}) {
    const fn = {
      'zf-spawn': () => this.spawn(params),
      'zf-collect': () => this.collect(params),
      'zf-expose': () => this.expose(params),
      'zf-grow': () => this.grow(params.hours ?? 24),
      'zf-observe': () => this.observe(),
      'zf-analyze': () => this.analyze(),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    const out = fn();
    return { action, hpf: Math.round(this.hours), ...out };
  }

  // Thu trứng sau khi cá đẻ; select: soi và chỉ giữ trứng đã thụ tinh, phát triển bình thường
  // Ghép cặp tối hôm trước trong bể giao phối có vách ngăn (giá nuôi Tecniplast ZebTEC, figures/zebrafish/model.mjs);
  // rút vách lúc pullHour giờ. Cá đẻ khoảng 15 phút sau khi có ánh sáng (đèn bật 08:00); rút muộn quá 2 giờ sau khi
  // đèn bật thì cá đẻ ít dần. Thu trứng 1 giờ sau khi cá bắt đầu đẻ. Số trứng mỗi cặp là số minh hoạ của model.
  spawn({ pullHour = 8, pairs = 3 }) {
    const tOut = Number(pullHour) * 60;
    const start = spawnStart(tOut);
    const t = start + SPAWN.delay + 60;
    let eggs = 0;
    let mot = 1;
    for (let i = 0; i < pairs; i++) {
      const r = spawning({ t, divider: 'out', dividerOutAt: tOut });
      mot = r.motivation;
      eggs += r.eggs * (0.6 + 0.8 * this.random()); // mỗi cặp đẻ khác nhau (minh hoạ)
    }
    eggs = Math.round(eggs);
    this.spawned = { eggs, pullHour: Number(pullHour), pairs };
    const hh = (m) => `${String(Math.floor((m / 60) % 24)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`;
    const events = [{ type: 'machine', label: 'Bể giao phối', text: `${pairs} cặp cá (1 đực : 1 cái) ghép từ tối hôm trước, vách ngăn giữa. Rút vách lúc ${hh(tOut)}; đèn bật lúc ${String(HUSBANDRY.lightsOn).padStart(2, '0')}:00, sáng ${HUSBANDRY.lightHours} giờ.` }];
    events.push({ type: 'effect', text: `Cá bắt đầu đẻ lúc khoảng ${hh(start + SPAWN.delay)}; thu bằng lưới lọc 1 giờ sau: ${eggs} trứng.` });
    if (tOut < HUSBANDRY.lightsOn * 60 || tOut >= (HUSBANDRY.lightsOn + HUSBANDRY.lightHours) * 60) events.push({ type: 'info', text: 'Rút vách khi đèn còn tắt: cá chưa đẻ, chờ tới khi đèn bật. Trứng đẻ lúc không ai trông dễ bị cá bố mẹ ăn mất, nên thường rút vách ngay lúc đèn bật.' });
    if (mot < 0.9) events.push({ type: 'warning', text: `Rút vách muộn, ${Math.round((start - HUSBANDRY.lightsOn * 60) / 6) / 10} giờ sau khi đèn bật: cá đẻ ít hơn nhiều (chỉ còn khoảng ${Math.round(mot * 100)} %). Cá ngựa vằn đẻ mạnh nhất trong 1–2 giờ đầu của chu kỳ sáng.` });
    this.#log('zf-spawn', `${pairs} cặp`, `${eggs} trứng`);
    return { events, ok: true };
  }

  collect({ n, select = true }) {
    if (n === undefined) n = this.spawned ? this.spawned.eggs : 200;
    if (!n) return { events: [{ type: 'warning', text: 'Không có trứng: cá chưa đẻ.' }] };
    const [lo, hi] = this.zf.fertilization;
    const rate = lo + this.random() * (hi - lo);
    const eggs = Array.from({ length: n }, () => ({ fertilized: this.random() < rate }));
    const fert = eggs.filter((e) => e.fertilized).length;
    this.clutch = { eggs, rate: fert / n, selected: select };
    this.hours = 0.75;
    this.devH = 0.75;
    const events = [
      { type: 'machine', label: 'Thu trứng', text: `${n} trứng; soi dưới kính soi nổi: ${fert} trứng đã thụ tinh (${fmt((100 * fert) / n)} %).` },
      select
        ? { type: 'effect', text: 'Chỉ giữ phôi đã thụ tinh, phân cắt đều (giai đoạn 2–64 tế bào); loại trứng không thụ tinh (đục, không phân cắt) và phôi bất thường.' }
        : { type: 'warning', text: 'Chưa chọn phôi: trứng không thụ tinh sẽ lẫn vào giếng và bị đếm là phôi chết (đông tụ).' },
    ];
    if (fert / n < 0.7) events.push({ type: 'warning', text: 'Tỉ lệ thụ tinh dưới 70 %: theo OECD 236 nên bỏ lứa trứng này.' });
    this.#log('zf-collect', `${n} trứng`, `thụ tinh ${fmt((100 * fert) / n)} %`);
    return { events, ok: true };
  }

  /** Dữ liệu cho hình giá nuôi (figures/zebrafish, #run). */
  rackData() {
    const h = this.spawned ? Math.max(this.spawned.pullHour, HUSBANDRY.lightsOn) + 1 : 9;
    return { lightOn: true, hour: h, divider: this.spawned ? 'out' : 'in', pump: true, tanks: 6 };
  }

  expose() {
    if (!this.clutch) return { events: [{ type: 'warning', text: 'Chưa có trứng: thu trứng trước.' }] };
    const { series, perWell, positive } = this.setup;
    const chem = this.chemical();
    const pool = this.clutch.selected ? this.clutch.eggs.filter((e) => e.fertilized) : [...this.clutch.eggs];
    const wells = [...series.map((c) => ({ chem: chem.id, c })), ...(positive ? [{ chem: 'DCA', c: 4, positive: true }] : [])];
    if (pool.length < wells.length * perWell) return { events: [{ type: 'warning', text: `Không đủ phôi: cần ${wells.length * perWell}, chỉ có ${pool.length}.` }] };
    this.wells = wells.map((w) => ({ ...w, embryos: Array.from({ length: perWell }, () => this.#embryo(pool.splice(Math.floor(this.random() * pool.length), 1)[0], w)) }));
    const events = [
      { type: 'machine', label: 'Đĩa giếng', text: `${wells.length} nhóm × ${perWell} phôi: ${wells.map((w) => `${w.positive ? 'đối chứng dương 3,4-DCA ' : ''}${fmt(w.c, w.c > 0 && w.c < 1 ? 1 : 0)} ${chem.unit}`).join(' · ')}. Ủ ở ${fmt(this.setup.temp)} °C.` },
      { type: 'effect', text: 'Phôi cho vào dung dịch thử càng sớm càng tốt (trước giai đoạn 16 tế bào, khoảng 1,5 giờ sau thụ tinh) để phơi nhiễm từ đầu quá trình phát triển.' },
    ];
    if (!series.includes(0)) events.push({ type: 'warning', text: 'Không có giếng đối chứng âm (0 mg/L): không biết tỉ lệ chết tự nhiên, không kiểm tra được tính hợp lệ.' });
    this.#log('zf-expose', chem.name, `${wells.length} nhóm × ${perWell} phôi`);
    return { events, ok: true };
  }

  #embryo(egg, w) {
    const chem = this.chemical(w.chem);
    const tol = log10(chem.lc50) + this.random.normal() / chem.slope; // ngưỡng gây chết (log10) của từng phôi
    const tera = chem.teratogen ? log10(chem.teratogen.ec50) + this.random.normal() / chem.teratogen.slope : Infinity;
    const lethal = w.c > 0 && log10(w.c) > tol;
    const bg = this.random() < this.zf.background.death;
    let deathAt = Infinity;
    if (!egg.fertilized) deathAt = 2;
    else if (lethal) deathAt = 3 + this.random() * 21; // phần lớn chết trong 24 giờ đầu (số liệu thực hành)
    else if (bg) deathAt = this.random() * 96;
    return {
      fertilized: egg.fertilized,
      deathAt,
      malformed: !lethal && w.c > 0 && log10(w.c) > tera ? (this.random() < 0.6 ? 'edema' : 'curve') : null,
      hatchAt: this.zf.hatch.mean + this.random.normal() * this.zf.hatch.sd,
    };
  }

  grow(hours) {
    if (!this.wells) return { events: [{ type: 'warning', text: 'Chưa chia phôi vào đĩa giếng.' }] };
    const rate = devRate(this.setup.temp);
    this.hours += hours;
    this.devH += hours * rate;
    const st = stageAt(this.zf, this.devH);
    const events = [{ type: 'machine', label: 'Tủ ấm', text: `Ủ ${hours} giờ ở ${fmt(this.setup.temp)} °C → ${Math.round(this.hours)} giờ sau thụ tinh. Phôi đối chứng tới giai đoạn: ${st.name.toLowerCase()} (tương đương ${fmt(this.devH)} giờ ở 28,5 °C).` }];
    if (Math.abs(this.setup.temp - 28.5) > 0.1) events.push({ type: 'effect', text: `Ở ${fmt(this.setup.temp)} °C phôi phát triển bằng ${fmt(rate * 100, 0)} % tốc độ ở 28,5 °C (Kimmel 1995).` });
    this.#log('zf-grow', `${hours} giờ`, `${Math.round(this.hours)} hpf`);
    return { events, ok: true };
  }

  // Trạng thái một phôi ở thời điểm hiện tại
  fate(e) {
    if (this.devH >= e.deathAt) {
      const t = e.deathAt;
      const endpoint = !e.fertilized || t < 10 ? 'coagulated' : t < 24 ? (t < 16 ? 'somites' : 'tail') : 'heart';
      return { dead: true, endpoint: endpoint === 'heart' && this.devH < 24 ? 'coagulated' : endpoint };
    }
    return { dead: false, hatched: this.devH >= e.hatchAt, malformed: this.devH >= 48 ? e.malformed : null };
  }

  observe() {
    if (!this.wells) return { events: [{ type: 'warning', text: 'Chưa có phôi trong đĩa.' }] };
    const chem = this.chemical();
    const rows = this.wells.map((w) => {
      const fates = w.embryos.map((e) => this.fate(e));
      const dead = fates.filter((f) => f.dead);
      const by = Object.fromEntries(Object.keys(ENDPOINT).map((k) => [k, dead.filter((f) => f.endpoint === k).length]));
      const alive = fates.filter((f) => !f.dead);
      return { c: w.c, positive: Boolean(w.positive), n: fates.length, dead: dead.length, by, malformed: alive.filter((f) => f.malformed).length, hatched: alive.filter((f) => f.hatched).length, sample: fates };
    });
    const obs = { hours: Math.round(this.hours), devH: this.devH, rows };
    this.history.push(obs);
    const events = rows.map((r) => ({
      type: r.dead && r.c === 0 && !r.positive && r.dead / r.n > 0.1 ? 'warning' : 'machine',
      label: r.positive ? '3,4-DCA 4 mg/L' : `${fmt(r.c, r.c > 0 && r.c < 1 ? 1 : 0)} ${chem.unit}`,
      text: `${r.n - r.dead} sống, ${r.dead} chết${r.dead ? ` (${Object.entries(r.by).filter(([, v]) => v).map(([k, v]) => `${v} ${ENDPOINT[k]}`).join(', ')})` : ''}${r.malformed ? `, ${r.malformed} dị dạng` : ''}${r.hatched ? `, ${r.hatched} đã nở` : ''}.`,
    }));
    events.push({ type: 'effect', text: this.#stageNote() });
    this.#log('zf-observe', `${obs.hours} hpf`, rows.map((r) => `${r.c}:${r.dead}/${r.n}`).join(' '), Object.fromEntries(rows.map((r) => [`chết ${r.positive ? 'DCA4' : r.c}`, r.dead])));
    return { events, ok: true, observation: obs };
  }

  #stageNote() {
    const h = this.devH;
    if (h < 10) return 'Tiêu chí chết lúc này: phôi đông tụ (trắng đục, mờ đặc dưới kính).';
    if (h < 30) return 'Ở 24 giờ: phôi khoẻ đã có thể tiết (đốt cơ), đuôi tách khỏi noãn hoàng, mắt và túi tai hình thành, có cử động tự phát. Phôi chết: đông tụ, không có thể tiết hoặc đuôi không tách.';
    if (h < 60) return 'Ở 48 giờ: tim đập, máu chảy dọc thân tới đuôi, sắc tố ở mắt và thân. Thêm tiêu chí chết: không có nhịp tim.';
    return 'Từ 72 giờ: phần lớn ấu thể đã nở khỏi màng phôi, bơi được, noãn hoàng thu nhỏ; 96 giờ có bóng bơi.';
  }

  analyze() {
    const last = this.history.at(-1);
    if (!last) return { events: [{ type: 'warning', text: 'Chưa có lần quan sát nào.' }] };
    const chem = this.chemical();
    const events = [];
    if (last.hours < 96) events.push({ type: 'warning', text: `Lần quan sát cuối ở ${last.hours} giờ: OECD 236 tính LC50 ở 96 giờ.` });
    const control = last.rows.find((r) => r.c === 0 && !r.positive);
    const tested = last.rows.filter((r) => !r.positive);
    const fit = fitLC50(tested.map((r) => ({ c: r.c, n: r.n, k: r.dead })));
    events.push(fit
      ? { type: 'machine', label: `LC50 ${last.hours} h`, text: `${fmt(fit.lc50, fit.lc50 < 10 ? 2 : 1)} ${chem.unit} (${fit.method}).` }
      : { type: 'warning', label: 'LC50', text: 'Không ước lượng được: dãy nồng độ chưa bao quanh mức gây chết 50 %. Mở rộng dãy nồng độ.' });
    // Cùng số liệu khớp bằng mô hình log-logistic của gói drc (Ritz & Streibig 2005) theo % chết, để so với hồi quy nhị thức:
    // LL.4 (4 tham số) nếu giới hạn ước lượng được hợp lý; nếu giới hạn vượt khoảng 0–100 % thì cố định 0 và 100 % (LL.2)
    let ll = null;
    const xs = tested.map((r) => r.c);
    const ys = tested.map((r) => (100 * r.dead) / r.n);
    const cMax = Math.max(...xs);
    const sane = (e) => Number.isFinite(e) && e > 0 && e < 10 * cMax;
    if (xs.filter((c) => c > 0).length >= 4) {
      try {
        const f = fitLL4(xs, ys);
        const [b, c, d, e] = f.coef.map((q) => q.b);
        if ([b, c, d].every(Number.isFinite) && sane(e) && c <= 105 && c >= 50 && d >= -5 && d <= 30) ll = { model: 'LL.4', b, c, d, e, se: f.coef[3].se };
      } catch { ll = null; }
      if (!ll) {
        try {
          const f = nls((x, [b, e]) => ll4(x, [b, 100, 0, e]), [2, fit?.lc50 ?? Math.sqrt(cMax)], xs, ys, { names: ['b', 'e'] });
          const [b, e] = f.coef.map((q) => q.b);
          if (Number.isFinite(b) && sane(e)) ll = { model: 'LL.2', b, c: 100, d: 0, e, se: f.coef[1].se };
        } catch { ll = null; }
      }
    }
    const lcTxt = (v) => fmt(v, v < 10 ? 2 : 1);
    events.push(ll
      ? { type: 'machine', label: 'Mô hình log-logistic', text: `${ll.model === 'LL.4' ? `LL.4 (như drm(chet ~ conc, fct = LL.4()) trong R): giới hạn dưới ${fmt(ll.d, 1)} %, trên ${fmt(ll.c, 1)} %` : 'LL.4 cho giới hạn ngoài khoảng 0–100 % (quá ít mức nồng độ ở hai đầu), nên cố định 0 và 100 %: LL.2 (như drm(chet/n ~ conc, weights = n, fct = LL.2(), type = "binomial"))'}; b = ${fmt(ll.b, 2)}, LC50 = e = ${lcTxt(ll.e)}${Number.isFinite(ll.se) ? ` ± ${lcTxt(ll.se)}` : ''} ${chem.unit}.${fit ? ` Hồi quy nhị thức cho ${lcTxt(fit.lc50)} ${chem.unit}.` : ''}` }
      : { type: 'info', label: 'Mô hình log-logistic', text: 'Chưa khớp được: cần ít nhất 4 mức nồng độ có phôi và dãy nồng độ bao quanh mức chết 50 %.' });
    const mal = tested.filter((r) => r.c > 0).map((r) => ({ c: r.c, n: r.n - r.dead, k: r.malformed }));
    const ec = mal.some((m) => m.k) ? fitLC50(mal) : null;
    if (ec) {
      events.push({ type: 'machine', label: 'EC50 dị dạng', text: `${fmt(ec.lc50, 2)} ${chem.unit}${fit ? `; chỉ số gây quái thai TI = LC50/EC50 = ${fmt(fit.lc50 / ec.lc50, 2)}${fit.lc50 / ec.lc50 > 1 ? ' (> 1: gây dị dạng ở nồng độ thấp hơn mức gây chết)' : ''}` : ''}.` });
    } else events.push({ type: 'info', text: 'Không có phôi sống sót nào bị dị dạng: không tính được EC50 và chỉ số gây quái thai (TI).' });
    // Tiêu chí hợp lệ của OECD 236
    const checks = [];
    checks.push([this.clutch.rate >= 0.7, `tỉ lệ thụ tinh ${fmt(this.clutch.rate * 100)} % (≥ 70 %)`]);
    if (control) {
      checks.push([(control.n - control.dead) / control.n >= 0.9, `đối chứng âm sống ${control.n - control.dead}/${control.n} (≥ 90 %)`]);
      if (last.hours >= 96) checks.push([control.hatched / Math.max(1, control.n - control.dead) >= 0.8, `đối chứng âm nở ${control.hatched}/${control.n - control.dead} (≥ 80 %)`]);
    } else checks.push([false, 'không có đối chứng âm']);
    const pos = last.rows.find((r) => r.positive);
    if (this.setup.oecd) checks.push([pos ? pos.dead / pos.n >= 0.3 : false, pos ? `đối chứng dương 3,4-DCA 4 mg/L chết ${pos.dead}/${pos.n} (≥ 30 %)` : 'không có đối chứng dương 3,4-DCA']);
    if (this.setup.oecd) checks.push([Math.abs(this.setup.temp - 26) <= 1, `nhiệt độ ${fmt(this.setup.temp)} °C (26 ± 1 °C)`]);
    const valid = checks.every(([ok]) => ok);
    events.push({ type: valid ? 'effect' : 'warning', label: 'Hợp lệ (OECD 236)', text: `${valid ? 'Đạt' : 'Không đạt'}: ${checks.map(([ok, t]) => `${ok ? '✓' : '✗'} ${t}`).join('; ')}.` });
    if (chem.id === 'PG') events.push({ type: 'info', label: 'Số liệu thực hành', text: 'Báo cáo Nhóm 5: 50 mg/L không chết, 150 mg/L chết 93–100 %, LC50 75–125 mg/L, không dị dạng.' });
    this.#log('zf-analyze', chem.name, fit ? `LC50 ${fit.lc50.toFixed(3)}` : 'không ước lượng được', { lc50: fit?.lc50?.toFixed(4), valid });
    return { events, ok: true, curve: { rows: tested, lc50: fit?.lc50 ?? null, unit: chem.unit, ll: ll ? { f: (x) => ll4(x, [ll.b, ll.c, ll.d, ll.e]) / 100, e: ll.e } : null }, valid, ll };
  }

  state() {
    return {
      hours: Math.round(this.hours),
      devH: this.devH,
      stage: stageAt(this.zf, this.devH),
      collected: Boolean(this.clutch),
      plated: Boolean(this.wells),
      wells: (this.wells ?? []).map((w) => ({ c: w.c, positive: Boolean(w.positive), fates: w.embryos.map((e) => this.fate(e)) })),
      temp: this.setup.temp,
    };
  }
}
