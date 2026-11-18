// Vườn đậu Hà Lan cho thí nghiệm Mendel: lô hạt, nhóm cây gieo cùng ngày, sinh trưởng theo đồng hồ ảo,
// tự thụ phấn trong nụ, khử nhị, thụ phấn chéo, thu hoạch và đếm kiểu hình. Không phụ thuộc Three.js hay DOM.
// Số liệu (data/pea.json): giai đoạn sinh trưởng, năng suất theo số liệu Mendel 1866, gen theo Reid & Ross 2011.

import { rng } from './random.js';
import { makeGenotype, gamete, zygote, phenotypeOf, countPhenotypes } from './genetics.js';
import { dayOutlook, refGdd, FieldSoil, LOSS, SOIL } from './field.js';

export const STAGE_ORDER = ['seed', 'sprout', 'veg', 'bud', 'flower', 'pod', 'ripe'];

export class PeaGarden {
  // climateLevel(): 'good' | 'warn' | 'bad' theo bảng khí hậu (cách cũ, dùng khi không có climate).
  // climate(): { temp, humidity, light, weather } của khu trồng trọt; có climate và crop (data/crops.json) thì cây lớn
  // theo độ ngày sinh trưởng, có nước trong đất, sương giá, nắng nóng, bệnh (src/core/field.js).
  constructor({ pea, seed = Date.now(), climateLevel = () => 'good', climate = null, crop = null }) {
    this.pea = pea;
    this.traits = pea.traits;
    this.climateLevel = climateLevel;
    this.climate = climate;
    this.crop = crop;
    this.soil = new FieldSoil();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.seed = seed;
    this.random = rng(seed);
    this.lots = new Map();
    this.groups = new Map();
    this.soil.reset();
    this.stats = { days: 0, rate: 0 };
    this.flags = {};
  }

  get fieldMode() {
    return Boolean(this.climate && this.crop);
  }

  trait(id) {
    return this.traits.find((t) => t.id === id);
  }

  stageOf(growth) {
    const g = this.pea.growth;
    if (growth < g.emerge) return 'seed';
    if (growth < 20) return 'sprout';
    if (growth < g.bud) return 'veg';
    if (growth < g.flower) return 'bud';
    if (growth < g.pod) return 'flower';
    if (growth < g.ripe) return 'pod';
    return 'ripe';
  }

  stageName(stage) {
    return this.pea.stages[stage];
  }

  // Dòng thuần (P) mua sẵn: spec { traitId: 'dom' | 'rec' }, các tính trạng khác đồng hợp trội
  addLine(id, spec, label, n = 300) {
    const genotype = makeGenotype(this.traits, spec);
    this.lots.set(id, { id, gen: 'P', label, seeds: Array.from({ length: n }, () => structuredClone(genotype)), origin: 'Dòng thuần chủng' });
    return this.lots.get(id);
  }

  #uniqueId(base, map) {
    if (!map.has(base)) return base;
    let i = 2;
    while (map.has(`${base} (${i})`)) i += 1;
    return `${base} (${i})`;
  }

  sow(lotId, count, day) {
    const lot = this.lots.get(lotId);
    if (!lot) return { events: [{ type: 'warning', text: `Không có lô hạt "${lotId}".` }] };
    if (!lot.seeds.length) return { events: [{ type: 'warning', text: `Lô ${lot.id} đã hết hạt.` }] };
    const n = Math.min(count, lot.seeds.length);
    // Lấy ngẫu nhiên n hạt trong lô
    const picked = [];
    for (let i = 0; i < n; i++) picked.push(lot.seeds.splice(Math.floor(this.random() * lot.seeds.length), 1)[0]);
    // Kiểu gen gây chết (ví dụ hoa mõm chó aurea đồng hợp): cây con không có diệp lục, chết sau khi nảy mầm
    const dies = (g) => this.traits.some((t) => t.kind === 'lethal' && phenotypeOf(g, t) === 'dead');
    const dead = picked.filter(dies).length;
    const id = this.#uniqueId(lot.id, this.groups);
    const group = { id, lot: lot.id, gen: lot.gen, plants: picked.filter((g) => !dies(g)).map((genotype) => ({ genotype })), dead, sownDay: day, growth: 0, stage: 'seed', emasculated: false, selfed: false, cross: null, heat: false, harvested: false };
    this.groups.set(id, group);
    const events = [{ type: 'machine', label: 'Gieo', text: `${n} hạt lô ${lot.id} (${lot.label ?? lot.gen}) vào luống. Hạt nảy mầm sau khoảng ${this.pea.growth.emerge} ngày.` }];
    if (n < count) events.push({ type: 'warning', text: `Lô chỉ còn ${n} hạt, ít hơn ${count} hạt định gieo.` });
    if (dead) events.push({ type: 'effect', label: 'Cây con chết', text: `${dead} cây con trắng, không có diệp lục, chết sau khi nảy mầm: đó là thể đồng hợp của alen gây chết.` });
    return { events, group };
  }

  // Một ngày trôi qua: cây lớn theo khí hậu; tới lúc hoa tự thụ phấn trong nụ nếu chưa khử nhị
  tick() {
    const events = [];
    const growing = [...this.groups.values()].filter((g) => !g.harvested);
    let rate;
    let day = null;
    if (this.fieldMode) {
      const st = this.climate();
      const o = dayOutlook(this.crop, st, this.pea);
      const soil = this.soil.day(this.crop, st);
      // Hệ số chung của ngày; tốc độ từng nhóm cây = GDD / °C·ngày của giai đoạn nhóm đang ở
      rate = o.frost ? 0 : 1;
      if (soil.dry) rate *= 0.4; // khô hạn: cây gần như ngừng lớn (minh hoạ)
      if (soil.waterlogged) rate *= 0.5; // úng rễ (minh hoạ)
      day = { ...o, ...soil };
      if (growing.length) {
        this.#notice('frost', o.frost, 'warning', `Sương giá (${st.temp} °C ≤ ${this.crop.tKill} °C): cây bị hại, ngừng lớn.`, events);
        this.#notice('dry', soil.dry, 'warning', `Đất khô (còn ${Math.round(this.soil.fraction * 100)} % nước dùng được): cây héo, ngừng lớn; hoa rụng nếu đang ra hoa. Tưới nước.`, events);
        this.#notice('wet', soil.waterlogged, 'warning', `Đất ngập nước quá ${this.crop.waterlogHoursTolerable ?? 36} giờ: rễ thiếu oxy, cây vàng lá, chậm lớn.`, events);
      }
    } else {
      const level = this.climateLevel();
      rate = this.pea.rate[level] ?? 1;
      day = { heat: level === 'bad' };
    }
    let sum = 0;
    for (const g of growing) {
      const before = g.growth;
      const r = this.fieldMode ? (rate * day.gdd) / refGdd(this.crop, this.pea, g.growth) : rate;
      g.growth += r;
      sum += r;
      const flowerAt = this.pea.growth.flower;
      const flowering = g.growth >= flowerAt && g.growth < this.pea.growth.ripe;
      if (flowering && day.heat) g.heat = true;
      if (flowering && day.dry) g.dry = true;
      if (day.botrytis && g.growth >= this.pea.growth.bud && !g.botrytis) {
        g.botrytis = true;
        events.push({ type: 'warning', label: g.id, text: `Mốc xám (Botrytis): độ ẩm ≥ ${this.crop.botrytis.rhAbove} % ở ${this.crop.botrytis.tempRange.join('–')} °C cả ngày làm thối hoa và quả non. Giảm độ ẩm dưới 85 %, thông gió.` });
      }
      if (day.mildew && g.growth >= this.pea.growth.emerge) {
        g.mildewDays = (g.mildewDays ?? 0) + 1;
        if (!g.mildew && g.mildewDays >= (this.crop.mildew.incubationDays ?? 4)) {
          g.mildew = true;
          events.push({ type: 'warning', label: g.id, text: `Bệnh trên lá (${this.crop.mildew.pathogen}): điều kiện ẩm, nhiệt độ ${this.crop.mildew.tempRange.join('–')} °C kéo dài ${g.mildewDays} ngày. Lá phủ lớp nấm, quang hợp kém, ít quả.` });
        }
      }
      if (before < flowerAt && g.growth >= flowerAt) {
        if (!g.emasculated) {
          g.selfed = true;
          events.push({ type: 'info', label: g.id, text: 'Hoa tự thụ phấn ngay trong nụ, trước khi nở.' });
        } else if (!g.cross) {
          events.push({ type: 'warning', label: g.id, text: 'Hoa đã khử nhị nhưng chưa được thụ phấn: nếu không thụ phấn, hoa sẽ rụng, không có hạt.' });
        }
      }
      const stage = this.stageOf(g.growth);
      if (stage !== g.stage) {
        g.stage = stage;
        events.push({ type: 'stage', label: g.id, stage, text: this.stageName(stage) });
      }
    }
    if (this.fieldMode && growing.length) {
      this.stats.days += 1;
      this.stats.rate += sum / growing.length;
    }
    return events;
  }

  // Báo một lần khi điều kiện bắt đầu (không lặp lại mỗi ngày)
  #notice(key, on, type, text, events) {
    if (on && !this.flags[key]) events.push({ type, text });
    this.flags[key] = on;
  }

  /** Tưới nước cho luống. */
  water(mm = SOIL.waterMm) {
    if (!this.fieldMode) return { ok: true, events: [{ type: 'machine', label: 'Tưới', text: `Tưới ${mm} mm.` }] };
    const r = this.soil.irrigate(mm);
    const events = [{ type: 'machine', label: 'Tưới', text: `Tưới ${mm} mm nước cho luống: đất còn ${Math.round(this.soil.fraction * 100)} % nước dùng được.` }];
    if (r.over > 0) events.push({ type: 'warning', text: `Tưới quá nhiều: ${Math.round(r.over)} mm thừa đọng lại, đất ngập. Ngập lâu thì rễ thiếu oxy.` });
    return { ok: true, events };
  }

  /** Bao hoa (túi giấy) trước khi hoa nở để côn trùng không mang phấn lạ tới. */
  bag(groupId) {
    const g = this.groups.get(groupId);
    if (!g) return { events: [{ type: 'warning', text: `Không có nhóm cây "${groupId}".` }] };
    if (g.growth < this.pea.growth.bud) return { events: [{ type: 'warning', label: g.id, text: `Cây chưa có nụ (${this.stageName(g.stage)}): bao hoa khi đã có nụ.` }] };
    g.bagged = true;
    const late = g.growth >= this.pea.growth.flower;
    if (late) g.bagLate = true;
    const insect = this.crop?.pollination === 'insect';
    const events = [{ type: 'machine', label: g.id, text: `Trùm túi giấy lên cụm hoa của ${g.plants.length} cây.` }];
    if (late) events.push({ type: 'warning', label: g.id, text: 'Hoa đã nở trước khi bao: côn trùng có thể đã mang phấn lạ tới.' });
    else events.push({ type: 'effect', text: insect ? `${this.crop.name} thụ phấn nhờ ${this.crop.pollinator === 'bumblebee' ? 'ong nghệ' : 'ong'}: bao hoa trước khi nở thì chỉ phấn do người làm chấm mới tới được đầu nhuỵ.` : 'Đậu tự thụ phấn trong nụ nên gần như không giao phấn; bao hoa vẫn giữ cho phép lai sạch.' });
    return { ok: true, events };
  }

  emasculate(groupId) {
    const g = this.groups.get(groupId);
    if (!g) return { events: [{ type: 'warning', text: `Không có nhóm cây "${groupId}".` }] };
    const { bud, flower } = this.pea.growth;
    if (g.growth < bud) return { events: [{ type: 'warning', label: g.id, text: `Cây chưa có nụ (${this.stageName(g.stage)}). Khử nhị khi nụ đã hình thành nhưng chưa nở.` }] };
    if (g.growth >= flower || g.selfed) {
      return { events: [{ type: 'warning', label: g.id, text: 'Quá muộn: hoa đã tự thụ phấn trong nụ. Khử nhị lúc này không ngăn được tự thụ phấn, hạt thu được vẫn là hạt tự thụ.' }] };
    }
    g.emasculated = true;
    return {
      ok: true,
      events: [
        { type: 'machine', label: g.id, text: `Đã khử nhị ${g.plants.length} cây: mở nụ, gắp bỏ hết bao phấn khi phấn chưa chín.` },
        { type: 'effect', text: 'Đậu Hà Lan tự thụ phấn khi hoa còn là nụ. Bỏ nhị trước lúc đó thì hoa không tự thụ được và chỉ nhận phấn của cây bố do người làm thí nghiệm chọn.' },
      ],
    };
  }

  pollinate(motherId, fatherId) {
    const m = this.groups.get(motherId);
    const f = this.groups.get(fatherId);
    if (!m || !f) return { events: [{ type: 'warning', text: 'Chọn nhóm cây mẹ và nhóm cây bố đang trồng.' }] };
    const { bud, flower, ripe } = this.pea.growth;
    if (f.growth < flower || f.growth >= ripe) return { events: [{ type: 'warning', label: f.id, text: `Cây bố chưa có phấn (${this.stageName(f.stage)}). Lấy phấn từ hoa đang nở.` }] };
    if (m.growth < bud || m.growth >= ripe) return { events: [{ type: 'warning', label: m.id, text: `Cây mẹ chưa có hoa để thụ phấn (${this.stageName(m.stage)}).` }] };
    if (m.selfed) {
      return { events: [{ type: 'warning', label: m.id, text: 'Hoa cây mẹ đã tự thụ phấn trong nụ vì chưa khử nhị: phấn của cây bố đến muộn, gần như không thụ tinh được. Hạt thu được sẽ là hạt tự thụ.' }] };
    }
    m.cross = f.id;
    const events = [{ type: 'machine', label: m.id, text: `Đã thụ phấn: chấm phấn của cây bố ${f.id} lên đầu nhuỵ hoa cây mẹ ${m.id}.` }];
    if (!m.emasculated) events.push({ type: 'warning', label: m.id, text: 'Cây mẹ chưa khử nhị: hoa vẫn tự thụ phấn trong nụ, phần lớn hạt sẽ là hạt tự thụ.' });
    return { ok: true, events };
  }

  harvest(groupId) {
    const g = this.groups.get(groupId);
    if (!g) return { events: [{ type: 'warning', text: `Không có nhóm cây "${groupId}".` }] };
    if (g.harvested) return { events: [{ type: 'warning', label: g.id, text: 'Nhóm cây này đã thu hoạch.' }] };
    if (g.growth < this.pea.growth.ripe) return { events: [{ type: 'warning', label: g.id, text: `Quả chưa chín khô (${this.stageName(g.stage)}). Thu hạt khi quả đã khô vàng, khoảng ngày ${this.pea.growth.ripe} sau gieo.` }] };
    const father = g.cross ? this.groups.get(g.cross) : null;
    // Chưa khử nhị mà vẫn thụ phấn chéo: phấn của chính hoa đã thụ tinh trước, chỉ một phần nhỏ hạt là con lai (giả định 10 %)
    // Chưa khử nhị mà vẫn thụ phấn chéo: hoa đã tự thụ trong nụ, phấn chấm sau chỉ thụ tinh được như phấn lạ tự nhiên
    // (tỉ lệ giao phấn của loài trong data/crops.json); không có số liệu loài thì giả định 10 %.
    const crop = this.crop;
    const crossShare = father ? (g.emasculated ? 1 : (crop?.outcrossRateUnbagged ?? 0.1)) : 0;
    // Không bao hoa: côn trùng mang phấn của các nhóm cây khác trong vườn tới (loài thụ phấn nhờ côn trùng)
    const donors = [...this.groups.values()].filter((x) => x !== g && x !== father && x.plants.length);
    const stray = crop && (!g.bagged || g.bagLate) && donors.length ? crop.outcrossRateUnbagged ?? 0 : 0;
    const { pods, seedsPerPod, heatPodFactor } = this.pea.yield;
    const podFactor = (g.heat ? heatPodFactor : 1) * (g.mildew ? LOSS.mildew : 1) * (g.botrytis ? LOSS.botrytis : 1) * (g.dry ? LOSS.dry : 1);
    const seeds = [];
    let crossed = 0;
    let strayed = 0;
    if (!(g.emasculated && !father)) {
      for (const plant of g.plants) {
        const nPods = this.random.poisson(pods * podFactor);
        for (let p = 0; p < nPods; p++) {
          const n = Math.max(1, this.random.poisson(seedsPerPod));
          for (let k = 0; k < n; k++) {
            let dad = plant.genotype;
            if (stray && this.random() < stray) {
              dad = this.random.pick(this.random.pick(donors).plants).genotype;
              strayed += 1;
            } else if (this.random() < crossShare) {
              dad = this.random.pick(father.plants).genotype;
              crossed += 1;
            }
            seeds.push(zygote(gamete(plant.genotype, this.random), gamete(dad, this.random)));
          }
        }
      }
    }
    g.harvested = true;
    const events = [];
    if (!seeds.length) {
      events.push({ type: 'warning', label: g.id, text: g.emasculated && !father ? 'Không có hạt: hoa đã khử nhị nhưng không được thụ phấn nên rụng hết.' : 'Không có hạt.' });
      return { events };
    }
    const gen = this.#nextGen(g, father, crossed > seeds.length / 2);
    const id = this.#uniqueId(gen, this.lots);
    const lot = { id, gen, label: father && crossed > seeds.length / 2 ? `${g.id} × ${father.id}` : `${g.id} tự thụ`, seeds, origin: g.id };
    this.lots.set(id, lot);
    events.push({ type: 'machine', label: 'Thu hoạch', text: `${seeds.length} hạt từ ${g.plants.length} cây ${g.id} (trung bình ${(seeds.length / g.plants.length).toFixed(1).replace('.', ',')} hạt/cây) → lô ${id} (${lot.label}).` });
    if (g.heat) events.push({ type: 'warning', label: g.id, text: `Nắng nóng lúc ra hoa${crop ? ` (≥ ${crop.heatAbortC} °C)` : ''} làm rụng hoa, ít quả: năng suất giảm.` });
    if (g.dry) events.push({ type: 'warning', label: g.id, text: 'Đất khô lúc ra hoa làm rụng hoa: năng suất giảm.' });
    if (g.mildew || g.botrytis) events.push({ type: 'warning', label: g.id, text: `Cây bị bệnh (${[g.mildew && 'bệnh trên lá', g.botrytis && 'mốc xám'].filter(Boolean).join(', ')}): ít quả hơn.` });
    if (strayed) events.push({ type: 'warning', label: g.id, text: `${strayed}/${seeds.length} hạt mang phấn lạ của nhóm cây khác do côn trùng mang tới: ${g.bagged ? 'bao hoa muộn' : 'hoa không được bao'}. Các hạt này làm sai tỉ lệ phân li.` });
    if (father && crossed < seeds.length) events.push({ type: 'warning', label: g.id, text: `Chỉ ${crossed}/${seeds.length} hạt là con lai, còn lại là hạt tự thụ của cây mẹ.` });
    return { ok: true, events, lot };
  }

  #nextGen(g, father, isCross) {
    if (isCross) {
      if (g.gen === 'P' && father.gen === 'P') return 'F1';
      return `${g.gen}×${father.gen}`;
    }
    const m = /^F(\d+)$/.exec(g.gen);
    return m ? `F${Number(m[1]) + 1}` : g.gen;
  }

  // Đếm kiểu hình: tính trạng của hạt đếm trên lô hạt; tính trạng của cây, hoa, quả đếm trên nhóm cây đã đủ lớn
  count(targetId, traitIds) {
    const traits = traitIds.map((id) => this.trait(id));
    const lot = this.lots.get(targetId);
    const group = this.groups.get(targetId);
    const onSeed = traits.every((t) => t.on === 'seed');
    if (onSeed) {
      const src = lot;
      if (!src) return { events: [{ type: 'warning', text: `Tính trạng của hạt đếm trên lô hạt đã thu hoạch, không có lô "${targetId}".` }] };
      return { ok: true, classes: countPhenotypes(src.seeds, traits), traits, subject: src.id, unit: 'hạt' };
    }
    if (!group) return { events: [{ type: 'warning', text: `Tính trạng ${traits.map((t) => t.name.toLowerCase()).join(', ')} phải gieo hạt rồi đếm trên cây. Chưa có nhóm cây "${targetId}".` }] };
    const need = Math.max(...traits.map((t) => this.#visibleFrom(t)));
    if (group.growth < need) {
      return { events: [{ type: 'warning', label: group.id, text: `Chưa thấy được tính trạng: cây đang ở giai đoạn ${this.stageName(group.stage).toLowerCase()}, cần tới khoảng ngày ${Math.ceil(need)} sau gieo.` }] };
    }
    return { ok: true, classes: countPhenotypes(group.plants.map((p) => p.genotype), traits), traits, subject: group.id, unit: 'cây' };
  }

  #visibleFrom(trait) {
    const g = this.pea.growth;
    return { plant: g.bud, flower: g.flower, pod: g.pod, seed: 0 }[trait.on];
  }

  // Hình dạng cây để vẽ: cao/thấp, màu hoa (tím, trắng, đỏ, hồng), màu quả. Loài khác không có tính trạng thì dùng mặc định.
  #look(genotype) {
    const ph = (id, fallback) => (this.trait(id) ? phenotypeOf(genotype, this.trait(id)) : fallback);
    const flower = this.traits.find((t) => t.on === 'flower' && t.colors);
    const fruit = this.traits.find((t) => t.on === 'pod' && t.colors);
    return {
      fruit: fruit ? fruit.colors[phenotypeOf(genotype, fruit)] : null,
      tall: ph('height', 'dom') === 'dom',
      purple: ph('flowerColor', 'dom') === 'dom',
      flower: flower ? flower.colors[phenotypeOf(genotype, flower)] : null,
      greenPod: ph('podColor', 'dom') === 'dom',
    };
  }

  // Ảnh chụp trạng thái cho cảnh 3D và bảng điều khiển
  snapshot(displayTraits = []) {
    return {
      lots: [...this.lots.values()].map((l) => ({ id: l.id, gen: l.gen, label: l.label, left: l.seeds.length })),
      groups: [...this.groups.values()].map((g) => ({
        id: g.id,
        gen: g.gen,
        n: g.plants.length,
        growth: g.growth,
        stage: g.stage,
        emasculated: g.emasculated,
        selfed: g.selfed,
        cross: g.cross,
        harvested: g.harvested,
        sick: Boolean(g.mildew || g.botrytis),
        bagged: Boolean(g.bagged),
        // Kiểu hình từng cây để vẽ: cao/thấp, màu hoa, màu quả
        look: g.plants.map((p) => this.#look(p.genotype)),
      })),
      displayTraits,
    };
  }
}
