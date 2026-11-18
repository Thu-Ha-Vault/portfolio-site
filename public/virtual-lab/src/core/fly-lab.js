// Thí nghiệm ruồi giấm (Morgan): dòng thuần, thu ruồi cái chưa giao phối, lai trong lọ, tủ ấm theo nhiệt độ,
// bỏ bố mẹ trước khi con nở, gây mê và đếm theo giới tính. Không phụ thuộc Three.js hay DOM.
// Số liệu và nguồn: data/fly.json (vòng đời, bản đồ gen FlyBase, số liệu Morgan 1910).

import { rng } from './random.js';
import { VirtualClock } from './clock.js';
import { Notebook } from './notebook.js';
import { makeGenome, meiosis, fertilize, linkedPhenotype, chiSquare } from './genetics.js';

export const FLY_ACTIONS = {
  'fly-collect': 'Thu ruồi',
  'fly-cross': 'Lai trong lọ',
  'fly-grow': 'Tua thời gian (tủ ấm)',
  'fly-clear': 'Bỏ ruồi bố mẹ',
  'fly-count': 'Gây mê và đếm',
  'fly-temp': 'Đặt nhiệt độ tủ ấm',
};

const SEX = { F: '♀', M: '♂' };

export class FlyLab {
  // setup: { genes: [geneId] } — các gen theo dõi trong protocol
  constructor({ fly, setup, seed = Date.now() }) {
    this.fly = fly;
    this.chromosomes = fly.chromosomes;
    this.genes = fly.chromosomes.flatMap((c) => c.genes);
    this.clock = new VirtualClock();
    this.notebook = new Notebook();
    this.clock.subscribe(() => this.tick());
    this.setUp(setup, seed);
  }

  setUp(setup, seed = Date.now()) {
    this.setup = setup;
    this.random = rng(seed);
    this.clock.reset();
    this.notebook.clear();
    this.temp = 25;
    this.batches = new Map();
    this.vials = new Map();
  }

  gene(id) {
    return this.genes.find((g) => g.id === id);
  }

  devDays(temp = this.temp) {
    return this.fly.lifecycle.days[String(temp)] ?? 10;
  }

  #log(action, subject, result, extra = {}) {
    this.notebook.add({ day: this.clock.day, experiment: 'Morgan', action: FLY_ACTIONS[action], subject, result, ...extra });
  }

  #unique(base, map) {
    if (!map.has(base)) return base;
    let i = 2;
    while (map.has(`${base} (${i})`)) i += 1;
    return `${base} (${i})`;
  }

  do(action, params = {}) {
    const fn = {
      'fly-collect': () => this.collect(params),
      'fly-cross': () => this.cross(params),
      'fly-grow': () => this.grow(params),
      'fly-clear': () => this.clearParents(params.vial),
      'fly-count': () => this.count(params.vial, params.genes ?? this.setup.genes, params.expect),
      'fly-temp': () => this.setTemp(params.temp),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    const out = fn();
    return { action, day: this.clock.day, ...out };
  }

  setTemp(t) {
    this.temp = Number(t);
    const events = [{ type: 'machine', label: 'Tủ ấm', text: `${this.temp} °C: ruồi con nở sau khoảng ${this.devDays()} ngày.` }];
    if (this.temp >= this.fly.lifecycle.sterileMaleFrom) events.push({ type: 'warning', text: `Từ ${this.fly.lifecycle.sterileMaleFrom} °C ruồi đực gần như bất thụ: lọ lai mới sẽ không có con.` });
    if (this.temp < 25) events.push({ type: 'effect', text: 'Lạnh làm vòng đời dài ra: thường giữ dòng gốc ở 18 °C cho đỡ phải chuyển lọ, lai ở 25 °C.' });
    this.#log('fly-temp', 'tủ ấm', `${this.temp} °C`);
    return { events, ok: true };
  }

  #isStock(id) {
    return this.fly.stocks.some((s) => s.id === id);
  }

  // Thu n ruồi một giới từ dòng gốc hoặc từ lọ đã nở. Ruồi cái chỉ chắc chắn chưa giao phối nếu thu trong 8 giờ sau khi nở.
  collect({ source, sex = 'F', hours = 6, n = 5 }) {
    const events = [];
    let flies;
    let mates;
    let gen;
    let virgin = sex === 'F' && hours <= this.fly.lifecycle.virginHours;
    if (this.#isStock(source)) {
      const st = this.fly.stocks.find((s) => s.id === source);
      flies = Array.from({ length: n }, () => makeGenome(this.chromosomes, sex, st.mutant));
      mates = Array.from({ length: 5 }, () => makeGenome(this.chromosomes, 'M', st.mutant));
      gen = 'P';
    } else {
      const v = this.vials.get(source);
      if (!v) return { events: [{ type: 'warning', text: `Không có dòng hay lọ "${source}".` }] };
      if (!v.offspring) return { events: [{ type: 'warning', label: v.id, text: `Ruồi con chưa nở (cần khoảng ${this.devDays()} ngày ở ${this.temp} °C kể từ khi lai).` }] };
      const pool = v.offspring.filter((f) => f.sex === sex);
      if (!pool.length) return { events: [{ type: 'warning', label: v.id, text: `Lọ không có ruồi ${sex === 'F' ? 'cái' : 'đực'}.` }] };
      flies = [];
      for (let i = 0; i < Math.min(n, pool.length); i++) flies.push(pool.splice(Math.floor(this.random() * pool.length), 1)[0]);
      v.offspring = v.offspring.filter((f) => !flies.includes(f));
      mates = v.offspring.filter((f) => f.sex === 'M');
      gen = v.gen;
      // Ruồi trong lọ nở rải rác vài ngày; quá thời gian đó thì không còn con nào mới nở để thu ruồi cái chưa giao phối
      if (virgin && this.clock.day > v.emergeDay + this.fly.lifecycle.emergeWindow) {
        virgin = false;
        events.push({ type: 'warning', label: v.id, text: `Đã quá ${this.fly.lifecycle.emergeWindow} ngày nở: không còn ruồi cái mới nở, ruồi cái thu được đã giao phối với anh em trong lọ.` });
      }
    }
    const label = `${SEX[sex]} ${source}`;
    const id = this.#unique(label, this.batches);
    this.batches.set(id, { id, sex, flies, virgin: sex === 'F' ? virgin : null, mates, gen, source });
    events.unshift({ type: 'machine', label: 'Thu ruồi', text: `${flies.length} ruồi ${sex === 'F' ? 'cái' : 'đực'} từ ${source}${sex === 'F' ? `, thu trong ${hours} giờ sau khi nở` : ''} → ${id}.` });
    if (sex === 'F') {
      events.push(virgin
        ? { type: 'effect', text: 'Ruồi cái mới nở chưa giao phối trong khoảng 8 giờ đầu: dùng ruồi cái này làm mẹ thì mọi con đều là con của ruồi bố bạn chọn.' }
        : { type: 'warning', text: 'Ruồi cái đã quá 8 giờ sau khi nở nên đã giao phối với ruồi đực cùng lọ và giữ tinh trùng trong túi chứa: con của chúng sẽ không phải con lai.' });
    }
    this.#log('fly-collect', id, `${flies.length} con${sex === 'F' ? (virgin ? ', chưa giao phối' : ', đã giao phối') : ''}`);
    return { events, ok: true, batch: id };
  }

  // Lai: ruồi cái (lô đã thu) với ruồi đực (lô đã thu hoặc lấy thẳng từ dòng gốc, lọ đã nở)
  cross({ females, males }) {
    const fb = this.batches.get(females);
    if (!fb || fb.sex !== 'F') return { events: [{ type: 'warning', text: 'Chọn một lô ruồi cái đã thu.' }] };
    let mb = this.batches.get(males);
    if (!mb) {
      const got = this.collect({ source: males, sex: 'M' });
      if (!got.ok) return { events: got.events };
      mb = this.batches.get(got.batch);
    }
    if (mb.sex !== 'M') return { events: [{ type: 'warning', text: 'Chọn ruồi đực cho bố.' }] };
    const gen = this.#nextGen(fb.gen, mb.gen);
    const id = this.#unique(gen, this.vials);
    const vial = { id, gen, label: `${fb.id} × ${mb.id}`, mothers: fb.flies, fathers: mb.flies, virgin: fb.virgin, mates: fb.mates, startDay: this.clock.day, progress: 0, offspring: null, emergeDay: null, cleared: false, sterile: this.temp >= this.fly.lifecycle.sterileMaleFrom };
    this.vials.set(id, vial);
    this.batches.delete(fb.id);
    this.batches.delete(mb.id);
    const events = [
      { type: 'machine', label: 'Lọ lai', text: `${fb.flies.length} ${fb.id} × ${mb.flies.length} ${mb.id} → lọ ${id}. Ruồi con nở sau khoảng ${this.devDays()} ngày ở ${this.temp} °C.` },
      { type: 'effect', text: 'Bỏ ruồi bố mẹ khỏi lọ trước khi ruồi con nở (khoảng ngày 7–8), để khỏi đếm lẫn bố mẹ và để bố mẹ không giao phối với con.' },
    ];
    if (!fb.virgin) {
      events.push(fb.source === mb.source && !this.#isStock(fb.source)
        ? { type: 'info', text: 'Ruồi cái đã giao phối với anh em cùng lọ: với phép lai giữa anh chị em (F1 × F1) thì vẫn đúng ý đồ.' }
        : { type: 'warning', text: 'Ruồi cái đã giao phối từ trước: con trong lọ là con của ruồi đực cùng lọ cũ, không phải của ruồi bố vừa cho vào.' });
    }
    if (vial.sterile) events.push({ type: 'warning', text: `Tủ ấm ${this.temp} °C: ruồi đực bất thụ, lọ sẽ không có con.` });
    this.#log('fly-cross', id, vial.label);
    return { events, ok: true, vial: id };
  }

  #nextGen(a, b) {
    if (a === 'P' && b === 'P') return 'F1';
    const ma = /^F(\d+)$/.exec(a);
    if (ma && a === b) return `F${Number(ma[1]) + 1}`;
    return `${a}×${b}`;
  }

  tick() {
    const events = [];
    for (const v of this.vials.values()) {
      if (v.offspring) continue;
      v.progress += 1 / this.devDays();
      if (v.progress >= 1) {
        v.offspring = this.#brood(v);
        v.emergeDay = this.clock.day;
        events.push({ type: v.offspring.length ? 'info' : 'warning', label: v.id, text: v.offspring.length ? `Ruồi con bắt đầu nở (${v.offspring.length} con).` : 'Không có ruồi con nở.' });
      }
    }
    return events;
  }

  #brood(v) {
    if (v.sterile) return [];
    const out = [];
    for (const mom of v.mothers) {
      const n = this.random.poisson(this.fly.brood.perFemale);
      for (let i = 0; i < n; i++) {
        // Ruồi cái đã giao phối giữ tinh trùng của con đực trước và không nhận đực mới trong nhiều ngày
        const dad = v.virgin ? this.random.pick(v.fathers) : this.random.pick(v.mates.length ? v.mates : v.fathers);
        const egg = meiosis(mom, this.chromosomes, this.random, { crossover: true });
        const sperm = meiosis(dad, this.chromosomes, this.random, { crossover: false });
        out.push(fertilize(egg, sperm, this.chromosomes));
      }
    }
    return out;
  }

  grow({ days = 1, until }) {
    if (!this.vials.size) return { events: [{ type: 'warning', text: 'Chưa có lọ lai nào trong tủ ấm.' }] };
    const start = this.clock.day;
    const events = [];
    const latest = [...this.vials.values()].reduce((a, b) => (b.startDay >= a.startDay ? b : a));
    const stopDay = until === 'clear' ? latest.startDay + Math.max(1, Math.round(this.devDays() * 0.75)) : null;
    const done = () => (until === 'adult' ? Boolean(latest.offspring) : until === 'clear' ? this.clock.day >= stopDay : this.clock.day - start >= days);
    while (!done() && this.clock.day - start < 60) {
      for (const e of this.clock.advance(1)) events.push({ ...e, label: `Ngày ${this.clock.day} · ${e.label}` });
    }
    events.unshift({ type: 'machine', label: 'Đồng hồ ảo', text: `Tua ${this.clock.day - start} ngày ở ${this.temp} °C: ngày ${start} → ngày ${this.clock.day}.` });
    if (until === 'adult' && !latest.offspring) events.push({ type: 'warning', label: latest.id, text: 'Sau 60 ngày vẫn không có ruồi con nở.' });
    this.#log('fly-grow', until ?? `${days} ngày`, `ngày ${this.clock.day}`);
    const reached = [];
    if (until === 'clear' || (latest && !latest.offspring && latest.progress >= 0.7)) reached.push('clear');
    if (latest?.offspring) reached.push('adult');
    return { events, ok: true, reached };
  }

  clearParents(vialId) {
    const v = this.vials.get(vialId);
    if (!v) return { events: [{ type: 'warning', text: `Không có lọ "${vialId}".` }] };
    if (v.cleared) return { events: [{ type: 'warning', label: v.id, text: 'Đã bỏ bố mẹ khỏi lọ này rồi.' }] };
    v.cleared = true;
    const events = [{ type: 'machine', label: v.id, text: `Đã chuyển ${v.mothers.length + v.fathers.length} ruồi bố mẹ ra khỏi lọ; trứng và ấu trùng ở lại trong môi trường.` }];
    if (v.offspring) events.push({ type: 'warning', label: v.id, text: 'Ruồi con đã nở trước khi bỏ bố mẹ: bố mẹ có thể đã giao phối với con. Lần sau bỏ bố mẹ trước khoảng ngày 7–8.' });
    this.#log('fly-clear', v.id, 'xong');
    return { events, ok: true };
  }

  phenotypeLabel(genome, genes) {
    return genes.map((id) => this.gene(id)[linkedPhenotype(genome, this.chromosomes, id)]).join(', ');
  }

  // expect: 'x-f2' (♀ đỏ 2 : ♂ đỏ 1 : ♂ trắng 1), 'criss-cross' (♀ đỏ : ♂ trắng), 'linked-testcross' (tính tần số hoán vị), 'uniform'
  count(vialId, geneIds, expect) {
    const v = this.vials.get(vialId);
    if (!v) return { events: [{ type: 'warning', text: `Không có lọ "${vialId}".` }] };
    if (!v.offspring) return { events: [{ type: 'warning', label: v.id, text: `Ruồi con chưa nở, chưa có gì để đếm (cần khoảng ${this.devDays()} ngày ở ${this.temp} °C).` }] };
    const flies = [...v.offspring, ...(v.cleared ? [] : [...v.mothers, ...v.fathers])];
    const genes = geneIds;
    const bySex = genes.some((g) => this.chromosomes.find((c) => c.sex).genes.some((x) => x.id === g));
    const keyOf = (f) => (bySex ? `${SEX[f.sex]} ` : '') + this.phenotypeLabel(f, genes);
    const counts = new Map();
    for (const f of flies) counts.set(keyOf(f), (counts.get(keyOf(f)) ?? 0) + 1);
    // Thứ tự cố định: theo giới (♀ trước) rồi kiểu hình trội trước
    const combos = genes.reduce((acc, id) => acc.flatMap((c) => [[...c, this.gene(id).dom], [...c, this.gene(id).rec]]), [[]]).map((c) => c.join(', '));
    const keys = bySex ? ['♀', '♂'].flatMap((s) => combos.map((c) => `${s} ${c}`)) : combos;
    const classes = keys.map((label) => ({ label, n: counts.get(label) ?? 0 }));
    const total = flies.length;
    const events = [{ type: 'machine', label: 'Kết quả', text: `${classes.filter((c) => c.n).map((c) => `${c.n} ${c.label}`).join(' · ')} (tổng ${total} ruồi).` }];
    events.push({ type: 'effect', text: 'Ruồi được gây mê bằng CO₂ trên tấm xốp, soi dưới kính lúp: con cái bụng to, đầu bụng nhọn có sọc; con đực nhỏ hơn, đầu bụng tròn sẫm màu, có lược sinh dục ở chân trước.' });
    if (!v.cleared) events.push({ type: 'warning', label: v.id, text: `Chưa bỏ bố mẹ: ${v.mothers.length + v.fathers.length} ruồi bố mẹ bị đếm lẫn vào ruồi con.` });
    const table = { classes, unit: 'ruồi', total, subject: v.id };
    const extra = Object.fromEntries(classes.map((c) => [c.label, c.n]));
    const kind = expect ?? null;
    if (kind === 'x-f2') {
      const pick = (lbl) => classes.find((c) => c.label === lbl)?.n ?? 0;
      const obs = [pick(`♀ ${this.gene('w').dom}`), pick(`♂ ${this.gene('w').dom}`), pick(`♂ ${this.gene('w').rec}`)];
      const chi = chiSquare(obs, [2, 1, 1]);
      const rows = [`♀ ${this.gene('w').dom}`, `♂ ${this.gene('w').dom}`, `♂ ${this.gene('w').rec}`];
      table.chi = { ...chi, ratio: [2, 1, 1] };
      table.expected = classes.map((c) => (rows.includes(c.label) ? chi.expected[rows.indexOf(c.label)] : c.label.startsWith('♀') ? 0 : null));
      const whiteF = pick(`♀ ${this.gene('w').rec}`);
      events.push(whiteF
        ? { type: 'warning', text: `Có ${whiteF} ruồi cái mắt trắng: không đúng với gen trên X khi bố F1 mắt đỏ (ruồi cái nhận X mang alen trội của bố). Kiểm tra ruồi cái có thật chưa giao phối, bố mẹ đã bỏ chưa.` }
        : { type: 'effect', text: 'Mọi ruồi cái đều mắt đỏ, mắt trắng chỉ có ở con đực: gen màu mắt nằm trên nhiễm sắc thể X, con đực chỉ có một X nên nhận alen từ mẹ.' });
      events.push({ type: chi.chi2 < chi.critical ? 'machine' : 'warning', label: 'Kiểm định χ²', text: `♀ đỏ : ♂ đỏ : ♂ trắng = ${obs.join(' : ')}, lý thuyết 2 : 1 : 1; χ² = ${chi.chi2.toFixed(2).replace('.', ',')}, df = 2, p = ${chi.p.toFixed(3).replace('.', ',')}. ${chi.chi2 < chi.critical ? 'Phù hợp' : 'Không phù hợp'} ở α = 0,05.` });
      events.push({ type: 'info', label: 'Số liệu của Morgan', text: '2459 ♀ đỏ, 1011 ♂ đỏ, 782 ♂ trắng (Morgan 1910). Con mắt trắng ít hơn kỳ vọng vì sống kém hơn.' });
      extra.chi2 = chi.chi2.toFixed(3);
    } else if (kind === 'criss-cross') {
      const f = classes.filter((c) => c.label.startsWith('♀') && c.n);
      const m = classes.filter((c) => c.label.startsWith('♂') && c.n);
      const ok = f.length === 1 && m.length === 1 && f[0].label.endsWith(this.gene('w').dom) && m[0].label.endsWith(this.gene('w').rec);
      events.push(ok
        ? { type: 'effect', text: 'Lai nghịch (♀ mắt trắng × ♂ mắt đỏ): F1 ruồi cái mắt đỏ, ruồi đực mắt trắng, khác hẳn phép lai thuận. Con đực nhận X từ mẹ, con cái nhận X mang alen trội từ bố (di truyền chéo).' }
        : { type: 'warning', text: 'F1 không theo đúng di truyền chéo: kiểm tra ruồi mẹ chưa giao phối và đã bỏ bố mẹ.' });
    } else if (kind === 'linked-testcross') {
      const four = [...classes].sort((a, b) => b.n - a.n);
      const parental = four.slice(0, 2);
      const recomb = four.slice(2);
      const rec = recomb.reduce((a, c) => a + c.n, 0);
      const rf = (100 * rec) / Math.max(1, total);
      const [g1, g2] = genes.map((id) => this.gene(id));
      const dist = Math.abs(g2.pos - g1.pos);
      events.push({ type: 'machine', label: 'Hoán vị gen', text: `Kiểu bố mẹ: ${parental.map((c) => `${c.label} (${c.n})`).join(', ')}; kiểu tái tổ hợp: ${recomb.map((c) => `${c.label} (${c.n})`).join(', ')}. Tần số hoán vị = ${rec}/${total} = ${rf.toFixed(1).replace('.', ',')} %, tức khoảng cách ${g1.id}–${g2.id} ≈ ${rf.toFixed(1).replace('.', ',')} cM (bản đồ FlyBase: ${dist.toFixed(1).replace('.', ',')} cM).` });
      events.push(rec
        ? { type: 'effect', text: 'Hai gen nằm trên cùng nhiễm sắc thể 2 nên đi cùng nhau (kiểu bố mẹ chiếm đa số); trao đổi chéo ở ruồi cái F1 tạo ra số ít kiểu tái tổ hợp. Tần số hoán vị càng lớn thì hai gen càng xa nhau.' }
        : { type: 'effect', text: 'Không có kiểu tái tổ hợp: ruồi dị hợp đem lai là con đực, mà ruồi giấm đực không trao đổi chéo nên liên kết hoàn toàn.' });
      extra.recombination = rf.toFixed(2);
    } else if (kind === 'three-point' || (genes.length === 3 && !bySex && !kind)) {
      Object.assign(extra, this.#threePoint(flies, genes, events));
    } else if (kind === 'uniform') {
      const shown = classes.filter((c) => c.n);
      const phen = new Set(shown.map((c) => c.label.replace(/^[♀♂] /, '')));
      events.push(phen.size === 1
        ? { type: 'effect', text: `F1 đồng tính: mọi ruồi đều ${[...phen][0]}.` }
        : { type: 'warning', text: 'F1 không đồng tính: có ruồi cái đã giao phối từ trước hoặc chưa bỏ bố mẹ.' });
    }
    this.#log('fly-count', v.id, `${total} ruồi`, extra);
    return { events, table, ok: true };
  }

  // Lai ba điểm: hai lớp nhiều nhất là kiểu bố mẹ, hai lớp ít nhất là trao đổi chéo kép; gen giữa là gen đổi chỗ giữa hai
  // nhóm đó. Khoảng cách = tần số tái tổ hợp của từng cặp (tính cả trao đổi chéo kép); hệ số trùng hợp = kép quan sát / kép kỳ vọng.
  #threePoint(flies, genes, events) {
    const ph = (f) => genes.map((id) => linkedPhenotype(f, this.chromosomes, id));
    const key = (p) => p.join('|');
    const counts = new Map();
    for (const f of flies) counts.set(key(ph(f)), (counts.get(key(ph(f))) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const total = flies.length;
    if (sorted.length < 4 || total < 50) {
      events.push({ type: 'warning', label: 'Lai ba điểm', text: `Mới có ${total} ruồi, ${sorted.length} lớp kiểu hình: cần vài trăm tới hơn nghìn ruồi để thấy các lớp trao đổi chéo kép.` });
      return {};
    }
    const parental = sorted.slice(0, 2).map(([k]) => k.split('|'));
    // Lớp trao đổi chéo kép: hai lớp ít nhất trong các lớp có ruồi, phải là cặp bổ sung nhau
    const dco = sorted.length >= 8 ? sorted.slice(-2).map(([k]) => k.split('|')) : null;
    const rf = (i, j) => {
      const par = new Set(parental.map((p) => `${p[i]}|${p[j]}`));
      return flies.filter((f) => { const p = ph(f); return !par.has(`${p[i]}|${p[j]}`); }).length / total;
    };
    const pairs = [[0, 1], [0, 2], [1, 2]].map(([i, j]) => ({ i, j, r: rf(i, j) }));
    const ends = pairs.reduce((a, b) => (b.r > a.r ? b : a));
    const mid = [0, 1, 2].find((x) => x !== ends.i && x !== ends.j);
    const d1 = pairs.find((p) => (p.i === ends.i && p.j === mid) || (p.i === mid && p.j === ends.i)).r;
    const d2 = pairs.find((p) => (p.i === ends.j && p.j === mid) || (p.i === mid && p.j === ends.j)).r;
    const isDco = (p) => p[mid] !== parental[0][mid] && p[ends.i] === parental[0][ends.i] && p[ends.j] === parental[0][ends.j]
      || p[mid] !== parental[1][mid] && p[ends.i] === parental[1][ends.i] && p[ends.j] === parental[1][ends.j];
    const obsDco = flies.filter((f) => isDco(ph(f))).length;
    const expDco = d1 * d2 * total;
    const coc = expDco ? obsDco / expDco : NaN;
    const g = (x) => this.gene(genes[x]);
    const pct = (x) => (x * 100).toFixed(1).replace('.', ',');
    const fb = (a, b) => Math.abs(g(a).pos - g(b).pos).toFixed(1).replace('.', ',');
    events.push({ type: 'machine', label: 'Lai ba điểm', text: `Kiểu bố mẹ: ${parental.map((p) => p.map((v, x) => g(x)[v]).join(', ')).join(' | ')}. ${dco ? `Hai lớp ít nhất (trao đổi chéo kép): ${dco.map((p) => p.map((v, x) => g(x)[v]).join(', ')).join(' | ')}. ` : ''}Gen ở giữa: ${g(mid).id}.` });
    events.push({ type: 'effect', label: 'Bản đồ', text: `${g(ends.i).id} — ${pct(d1)} cM — ${g(mid).id} — ${pct(d2)} cM — ${g(ends.j).id} (FlyBase: ${fb(ends.i, mid)} và ${fb(mid, ends.j)} cM). Trao đổi chéo kép quan sát ${obsDco}, kỳ vọng nếu độc lập ${expDco.toFixed(1).replace('.', ',')}: hệ số trùng hợp ${Number.isFinite(coc) ? coc.toFixed(2).replace('.', ',') : '—'}, nhiễu I = ${Number.isFinite(coc) ? (1 - coc).toFixed(2).replace('.', ',') : '—'}.` });
    events.push({ type: 'info', text: 'Một lần trao đổi chéo làm giảm khả năng có trao đổi chéo thứ hai ở gần đó (nhiễu), nên số trao đổi chéo kép ít hơn tích hai tần số. Khoảng cách hai gen đầu mút đo trực tiếp nhỏ hơn tổng hai khoảng vì bỏ sót trao đổi chéo kép.' });
    return { middle: g(mid).id, d1: (d1 * 100).toFixed(2), d2: (d2 * 100).toFixed(2), dco: obsDco, coc: Number.isFinite(coc) ? coc.toFixed(3) : '' };
  }

  state() {
    return {
      day: this.clock.day,
      temp: this.temp,
      devDays: this.devDays(),
      stocks: this.fly.stocks.map((s) => s.id),
      batches: [...this.batches.values()].map((b) => ({ id: b.id, sex: b.sex, n: b.flies.length, virgin: b.virgin })),
      vials: [...this.vials.values()].map((v) => ({ id: v.id, label: v.label, age: this.clock.day - v.startDay, emerged: Boolean(v.offspring), n: v.offspring?.length ?? 0, cleared: v.cleared, progress: Math.min(1, v.progress) })),
    };
  }
}
