// Thí nghiệm lai đậu Hà Lan (Mendel): nối vườn đậu, đồng hồ ảo và sổ thí nghiệm thành các thao tác của người dùng.
// Mỗi thao tác trả về { action, events, table? } để bảng protocol hiện thành thẻ kết quả. Không phụ thuộc DOM.

import { VirtualClock } from './clock.js';
import { Notebook } from './notebook.js';
import { PeaGarden, STAGE_ORDER } from './pea-garden.js';
import { chiSquare, expectedRatioFor } from './genetics.js';

export const PEA_ACTIONS = {
  'pea-sow': 'Gieo hạt',
  'pea-grow': 'Tua thời gian',
  'pea-emasculate': 'Khử nhị',
  'pea-pollinate': 'Thụ phấn chéo',
  'pea-harvest': 'Thu hoạch',
  'pea-count': 'Đếm kiểu hình',
  'pea-water': 'Tưới nước',
  'pea-bag': 'Bao hoa',
};

const MAX_DAYS = 240;

export class MendelLab {
  // setup: { traits: [traitId], lines: [{ id, spec, label }] } (protocol hoặc chế độ tự do)
  // species: data/crosses.json (loài cho phép lai mở rộng); setup.species chọn loài, không có thì là đậu Hà Lan
  // climate, crops: khí hậu khu trồng trọt và ngưỡng của từng loài (data/crops.json); có cả hai thì cây lớn theo
  // độ ngày sinh trưởng (src/core/field.js), không có thì theo mức khí hậu climateLevel (cách cũ)
  constructor({ pea, setup, seed = Date.now(), climateLevel, species = {}, climate = null, crops = null }) {
    this.pea = pea;
    this.species = species;
    this.crops = crops;
    this.clock = new VirtualClock();
    this.notebook = new Notebook();
    this.garden = new PeaGarden({ pea, seed, climateLevel, climate });
    this.clock.subscribe(() => this.garden.tick());
    this.setUp(setup, seed);
  }

  setUp(setup, seed = Date.now()) {
    this.setup = setup;
    const sp = setup.species ? this.species[setup.species] : null;
    this.garden.pea = sp ? { ...this.pea, traits: sp.traits } : this.pea;
    this.garden.traits = this.garden.pea.traits;
    this.garden.crop = this.crops?.find((c) => c.id === (setup.species ?? 'pea')) ?? null;
    this.clock.reset();
    this.notebook.clear();
    this.garden.reset(seed);
    for (const l of setup.lines) this.garden.addLine(l.id, l.spec, l.label);
  }

  get traits() {
    return this.setup.traits.map((id) => this.garden.trait(id));
  }

  #log(action, subject, result, extra = {}) {
    this.notebook.add({ day: this.clock.day, experiment: 'Mendel', action: PEA_ACTIONS[action], subject, result, ...extra });
  }

  do(action, params = {}) {
    const fn = {
      'pea-sow': () => this.sow(params.lot, params.count ?? 10),
      'pea-grow': () => this.grow(params),
      'pea-emasculate': () => this.#simple('pea-emasculate', params.group, this.garden.emasculate(params.group)),
      'pea-pollinate': () => this.pollinate(params.mother, params.father),
      'pea-harvest': () => this.harvest(params.group),
      'pea-water': () => this.#simple('pea-water', 'luống', this.garden.water(params.mm)),
      'pea-bag': () => this.#simple('pea-bag', params.group, this.garden.bag(params.group)),
      'pea-count': () => this.count(params.target, params.traits ?? this.setup.traits, params.expect),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    const out = fn();
    return { action, day: this.clock.day, ...out };
  }

  sow(lotId, count) {
    const res = this.garden.sow(lotId, count, this.clock.day);
    if (res.group) this.#log('pea-sow', res.group.id, `${res.group.plants.length} hạt`);
    return { events: res.events, ok: Boolean(res.group) };
  }

  // Tua { days } ngày, hoặc tới khi nhóm cây { group } (mặc định: nhóm gieo gần nhất còn đang trồng) đạt giai đoạn { until }
  grow({ days = 7, until, group }) {
    const growing = [...this.garden.groups.values()].filter((g) => !g.harvested);
    if (!growing.length) return { events: [{ type: 'warning', text: 'Chưa có cây nào đang trồng. Hãy gieo hạt trước.' }] };
    const watch = this.garden.groups.get(group) ?? growing.reduce((a, b) => (b.sownDay >= a.sownDay ? b : a));
    const start = this.clock.day;
    const events = [];
    const reached = new Set();
    this.garden.stats = { days: 0, rate: 0 };
    const target = until ? STAGE_ORDER.indexOf(until) : -1;
    const done = () => (until ? STAGE_ORDER.indexOf(watch.stage) >= target : this.clock.day - start >= days);
    while (!done() && this.clock.day - start < MAX_DAYS) {
      for (const e of this.clock.advance(1)) {
        if (e.type === 'stage') {
          reached.add(e.stage);
          events.push({ type: 'info', label: `Ngày ${this.clock.day}`, text: `${e.label}: ${e.text.toLowerCase()}.` });
        } else events.push({ ...e, label: `Ngày ${this.clock.day} · ${e.label ?? ''}`.trim() });
      }
    }
    const passed = this.clock.day - start;
    const level = this.garden.climateLevel();
    events.unshift({ type: 'machine', label: 'Đồng hồ ảo', text: `Tua ${passed} ngày: ngày ${start} → ngày ${this.clock.day}.` });
    if (this.garden.fieldMode) {
      const st = this.garden.stats;
      const avg = st.days ? st.rate / st.days : 1;
      const crop = this.garden.crop;
      const T = this.garden.climate().temp;
      const note = `${crop.name} lớn theo độ ngày sinh trưởng: nhiệt độ nền ${String(crop.tBase).replace('.', ',')} °C, ${String(crop.gddFlower)} °C·ngày tới ra hoa.`;
      if (avg < 0.85) events.push({ type: 'warning', text: `Ở ${T} °C cây lớn bằng ${Math.round(avg * 100)} % tốc độ của ngày điều kiện tốt. ${note}` });
      else events.push({ type: 'info', text: `Ở ${T} °C cây lớn bằng ${Math.round(avg * 100)} % tốc độ của ngày điều kiện tốt. ${note}` });
    } else if (level !== 'good') events.push({ type: 'warning', text: `Khí hậu ở khu trồng trọt chưa phù hợp (${level === 'bad' ? 'quá nóng hoặc quá lạnh' : 'hơi lệch'}): cây lớn chậm hơn ${Math.round((1 - this.pea.rate[level]) * 100)} %.` });
    if (until && this.clock.day - start >= MAX_DAYS) events.push({ type: 'warning', text: `Sau ${MAX_DAYS} ngày cây vẫn chưa tới giai đoạn này. Kiểm tra khí hậu ở khu trồng trọt.` });
    this.#log('pea-grow', until ?? `${days} ngày`, `ngày ${this.clock.day}`);
    return { events, reached: [...reached] };
  }

  #simple(action, subject, res) {
    if (res.ok) this.#log(action, subject, 'xong');
    return { events: res.events, ok: Boolean(res.ok) };
  }

  pollinate(mother, father) {
    const res = this.garden.pollinate(mother, father);
    if (res.ok) this.#log('pea-pollinate', `${mother} × ${father}`, 'xong');
    return { events: res.events, ok: Boolean(res.ok) };
  }

  harvest(groupId) {
    const res = this.garden.harvest(groupId);
    if (res.lot) {
      this.#log('pea-harvest', groupId, `lô ${res.lot.id}: ${res.lot.seeds.length} hạt`);
      // Tính trạng của hạt thấy được ngay trên hạt vừa thu: đếm luôn để người dùng thấy
      const seedTraits = this.traits.filter((t) => t.on === 'seed');
      if (seedTraits.length) {
        const c = this.garden.count(res.lot.id, seedTraits.map((t) => t.id));
        res.events.push({ type: 'info', label: `Hạt lô ${res.lot.id}`, text: c.classes.map((k) => `${k.n} ${k.label}`).join(' · ') });
      }
    }
    return { events: res.events, ok: Boolean(res.lot), lot: res.lot?.id };
  }

  // expect: 'f2' (3:1, 9:3:3:1), 'testcross' (1:1…), 'uniform' (F1 đồng tính); không nêu thì đoán theo thế hệ
  count(target, traitIds, expect) {
    const res = this.garden.count(target, traitIds);
    if (!res.ok) return { events: res.events };
    const n = res.classes.reduce((a, c) => a + c.n, 0);
    const kind = expect ?? this.#guessExpect(target);
    const events = [{ type: 'machine', label: 'Kết quả', text: `${res.classes.map((c) => `${c.n} ${c.label}`).join(' · ')} (tổng ${n} ${res.unit}).` }];
    const table = { classes: res.classes, unit: res.unit, total: n, subject: res.subject };
    const extra = Object.fromEntries(res.classes.map((c) => [c.label, c.n]));
    if (kind === 'uniform') {
      const shown = res.classes.filter((c) => c.n > 0);
      events.push(shown.length === 1
        ? { type: 'effect', text: `F1 đồng tính: mọi ${res.unit} đều ${shown[0].label}. Tính trạng biểu hiện ở F1 là tính trạng trội.` }
        : { type: 'warning', text: 'F1 không đồng tính: có hạt tự thụ của cây mẹ lẫn vào (quên khử nhị hoặc khử nhị muộn), hoặc bố mẹ không thuần chủng.' });
    } else if (kind === 'f2' || kind === 'testcross') {
      // Lớp có kỳ vọng 0 (ví dụ lớp đồng hợp trội trong lai phân tích trội không hoàn toàn) không đưa vào χ²
      const full = expectedRatioFor(res.traits, kind);
      const keep = full.map((r) => r > 0);
      const ratio = full.filter((r, i) => keep[i]);
      const chi = chiSquare(res.classes.filter((c, i) => keep[i]).map((c) => c.n), ratio);
      table.chi = { ...chi, ratio };
      let j = 0;
      table.expected = keep.map((k) => (k ? chi.expected[j++] : 0));
      const fits = chi.chi2 < chi.critical;
      const shown = res.classes.filter((c, i) => keep[i]);
      const r = shown.map((c) => (c.n / Math.max(1, Math.min(...shown.map((x) => x.n)))).toFixed(2).replace('.', ',')).join(' : ');
      events.push({ type: 'effect', label: 'Tỉ lệ', text: `${r} (lý thuyết ${ratio.join(' : ')}).` });
      events.push({
        type: fits ? 'machine' : 'warning',
        label: 'Kiểm định χ²',
        text: `χ² = ${chi.chi2.toFixed(2).replace('.', ',')}, df = ${chi.df}, p = ${chi.p.toFixed(3).replace('.', ',')}. ${fits ? `χ² nhỏ hơn giá trị tới hạn ${String(chi.critical).replace('.', ',')} (α = 0,05): số liệu phù hợp tỉ lệ ${ratio.join(' : ')}, độ lệch là do ngẫu nhiên.` : `χ² lớn hơn giá trị tới hạn ${String(chi.critical).replace('.', ',')} (α = 0,05): số liệu lệch khỏi tỉ lệ ${ratio.join(' : ')} nhiều hơn mức ngẫu nhiên cho phép.`}`,
      });
      if (n < 100) events.push({ type: 'warning', text: `Chỉ có ${n} ${res.unit}: mẫu nhỏ thì tỉ lệ dao động mạnh. Mendel đếm hàng nghìn hạt.` });
      const mendel = this.#mendelData(res.traits);
      if (mendel) events.push({ type: 'info', label: 'Số liệu của Mendel', text: mendel });
      extra.chi2 = chi.chi2.toFixed(3);
      extra.p = chi.p.toFixed(4);
    }
    this.#log('pea-count', res.subject, `${n} ${res.unit}`, extra);
    return { events, table, ok: true };
  }

  #guessExpect(target) {
    const gen = this.garden.lots.get(target)?.gen ?? this.garden.groups.get(target)?.gen;
    if (gen === 'F1') return 'uniform';
    if (gen === 'F2') return 'f2';
    if (gen && gen.includes('×')) return 'testcross';
    return null;
  }

  #mendelData(traits) {
    if (traits.length === 1 && traits[0].mendelF2) {
      const [a, b] = traits[0].mendelF2;
      return `${a} ${traits[0].dom} : ${b} ${traits[0].rec} = ${(a / b).toFixed(2).replace('.', ',')} : 1 (Mendel 1866).`;
    }
    const d = this.pea.dihybrid;
    if (traits.length === 2 && traits.every((t) => d.traits.includes(t.id))) {
      return `${d.mendelF2.join(' : ')} hạt từ ${d.plants} cây F1 (Mendel 1866), gần 9 : 3 : 3 : 1.`;
    }
    return null;
  }

  // Trạng thái để vẽ cảnh và bảng điều khiển
  state() {
    const sp = this.setup.species ? this.species[this.setup.species] : null;
    return { day: this.clock.day, species: sp ? { id: this.setup.species, name: sp.name, latin: sp.latin, form: sp.form ?? 'climber' } : { id: 'pea', name: 'Đậu Hà Lan', latin: 'Pisum sativum', form: 'climber' }, ...this.garden.snapshot() };
  }
}
