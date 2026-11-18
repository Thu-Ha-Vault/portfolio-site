// Chuỗi PCR → điện di → chụp ảnh gel. Không phụ thuộc Three.js hay DOM.
// Dùng lại mô hình số liệu của hình máy (figures/*/model.mjs) để con số trong app khớp với hình cận cảnh.
// Số liệu và giả định:
// - Chương trình nhiệt, số bản sao: figures/thermocycler/model.mjs (Addgene, Bio-Rad T100).
// - Vị trí băng: figures/electrophoresis/model.mjs (Bio-Rad Mini-Sub Cell GT, gel agarose 1 %, TAE).
// - Sản phẩm đích 1 250 bp, như làn S+ của bài thực hành Sinh học phân tử (cùng model điện di).
// - Khối lượng một bản sao dsDNA = bp × 650 g/mol / 6,022×10²³ (khối lượng trung bình một cặp base).
// - Nạp 5 µL trong 25 µL sản phẩm; ethidium bromide thấy được băng từ khoảng 1–5 ng DNA (Sambrook & Russell,
//   Molecular Cloning) → lấy ngưỡng 2 ng; băng sáng hết mức từ khoảng 100 ng.
// - Sai số: số bản khuôn ban đầu lệch theo log-chuẩn (σ = 0,15 log₁₀, sai số hút micropipet),
//   hiệu suất mỗi chu kỳ 0,95 ± 0,02; vị trí băng lệch ± 0,04 cm giữa các giếng. Đây là giả định minh hoạ.
// - Ladder: GeneRuler 1 kb (Thermo SM0311), 0,5 µg mỗi giếng.

import { PCR, RUN_SECONDS, fmtTime, fmtCopies } from '../../figures/thermocycler/model.mjs';
import { rng } from './random.js';
import { LANES, bpbAfter, distanceOf, endVh, minutesAt, GEL, fmtCm } from '../../figures/electrophoresis/model.mjs';

export { rng };

export const CHAIN = {
  productBp: 1250,
  reactionUl: 25,
  loadUl: 5,
  detectNg: 2,
  fullNg: 100,
  copyNoise: 0.15,
  effNoise: 0.02,
  laneJitter: 0.04,
  volts: 100,
};

const AVOGADRO = 6.022e23;
const LADDER = LANES[0][1];

export const ACTIONS = {
  'pcr-run': 'Chạy máy PCR',
  'gel-load': 'Nạp mẫu vào gel',
  'gel-run': 'Chạy điện di',
  'gel-image': 'Chụp ảnh gel',
};

// Đánh giá thành phần của một ống: thiếu chất bắt buộc thì không khuếch đại; thiếu chất phụ thì hiệu suất giảm.
// Vai trò của từng chất ghi ở trường "pcr" trong substances.json.
// activity: hoạt tính còn lại (0–1) của từng chất theo kho lạnh (src/core/cold-lab.js). Ánh xạ minh hoạ: hoạt tính của
// enzyme, dNTP, mồi nhân thẳng vào hiệu suất mỗi chu kỳ; hoạt tính của DNA khuôn nhân vào số bản khuôn còn nguyên.
export function assessTube(ids, substances, activity = {}) {
  const have = new Set(ids);
  const roles = substances.filter((s) => s.pcr);
  const missing = roles.filter((s) => !have.has(s.id));
  const blocked = missing.filter((s) => s.pcr.need === 'required');
  let factor = 1;
  for (const s of missing) if (s.pcr.need === 'factor') factor *= s.pcr.factor;
  const foreign = ids.map((id) => substances.find((s) => s.id === id)).filter((s) => s && s.kind !== 'bio');
  if (foreign.length) factor = 0; // hoá chất lạ (CuSO₄, acid, base…) làm hỏng enzyme và DNA
  const weak = [];
  for (const id of new Set(ids)) {
    const a = activity[id];
    if (a === undefined || a >= 0.999) continue;
    const s = roles.find((r) => r.id === id);
    if (!s) continue;
    weak.push({ id, label: s.label ?? s.name, activity: a });
    if (id !== 'template') factor *= a;
  }
  return {
    weak,
    templateActivity: activity.template ?? 1,
    template: have.has('template'),
    missing,
    blocked,
    foreign,
    efficiencyFactor: blocked.length ? 0 : factor,
  };
}

export const ngOf = (copies, bp, ul = CHAIN.loadUl) => (copies * bp * 650 * (ul / CHAIN.reactionUl) * 1e9) / AVOGADRO;

// Độ sáng 0–1 của băng theo khối lượng DNA (thang log giữa ngưỡng thấy được và mức sáng hết cỡ)
export const brightness = (ng) => (ng < CHAIN.detectNg ? 0 : Math.min(1, 0.15 + 0.85 * (Math.log10(ng / CHAIN.detectNg) / Math.log10(CHAIN.fullNg / CHAIN.detectNg))));

export class PcrChain {
  constructor({ substances, tubes, seed = Date.now() }) {
    this.substances = substances;
    this.tubes = tubes;
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.seed = seed;
    this.random = rng(seed);
    this.pcr = null; // kết quả lần chạy PCR gần nhất, theo id ống
    this.lanes = null; // các giếng đã nạp
    this.vh = 0; // vôn·giờ đã chạy điện di
    this.image = null; // ảnh gel đã chụp gần nhất
  }

  // Dữ liệu cho hình cận cảnh của máy (figures/*), để hình hiện đúng ống người dùng đã pha.
  // Trả về null khi chưa làm thao tác tương ứng, hình sẽ chạy chương trình mẫu của nó.
  figureData(id) {
    if (id === 'pcr') {
      const runs = Object.values(this.pcr ?? {});
      const t = runs.find((r) => !r.control) ?? runs[0];
      return t ? { name: t.name, start: t.start, eff: t.eff } : null;
    }
    if (id === 'gel') return this.lanes ? { done: this.vh > 0, V: CHAIN.volts, lanes: this.lanes.map((l) => ({ name: l.name, bands: l.bands.map(({ bp, w }) => ({ bp, w })) })) } : null;
    if (id === 'geldoc') {
      return this.image ? { lanes: this.image.lanes.map((l) => ({ name: l.name, bands: l.bands.map(({ bp, w, cm }) => ({ bp, w, cm: +cm.toFixed(3) })) })) } : null;
    }
    return null;
  }

  // contentsOf(id) trả về danh sách id chất đang có trong ống
  runPcr(contentsOf, activityOf = () => ({})) {
    const events = [];
    const tubes = [];
    for (const t of this.tubes) {
      const ids = contentsOf(t.id);
      if (!ids.length) continue;
      const a = assessTube(ids, this.substances, activityOf(ids));
      const start = a.template ? PCR.copies.start * a.templateActivity * 10 ** (this.random.normal() * CHAIN.copyNoise) : 0;
      const eff = Math.min(1, Math.max(0, (PCR.copies.efficiency + this.random.normal() * CHAIN.effNoise) * a.efficiencyFactor));
      let N = start;
      for (let c = 0; c < PCR.cycles; c++) N *= 1 + eff * (1 - N / PCR.copies.plateau);
      tubes.push({ ...t, ids, assess: a, start, eff, copies: N });
    }
    if (!tubes.length) {
      events.push({ type: 'warning', text: 'Các ống PCR đều trống. Hãy pha ống trên bàn sinh học phân tử trước khi chạy máy.' });
      return { action: 'pcr-run', events, tubes };
    }
    this.pcr = Object.fromEntries(tubes.map((t) => [t.id, t]));
    this.lanes = null;
    this.vh = 0;
    this.image = null;
    events.push({
      type: 'machine',
      label: 'Chương trình',
      text: `${PCR.initial.T} °C ${PCR.initial.s / 60} phút → ${PCR.cycles} chu kỳ (${PCR.steps.map((s) => `${s.T} °C ${s.s} s`).join(' · ')}) → ${PCR.final.T} °C ${PCR.final.s / 60} phút → giữ ${PCR.hold.T} °C. Nắp gia nhiệt ${PCR.lid} °C. Thời gian chạy ${fmtTime(RUN_SECONDS)}.`,
    });
    events.push({ type: 'effect', text: 'Mỗi chu kỳ: 94 °C tách hai mạch DNA, 55 °C cho mồi bắt cặp vào khuôn, 72 °C để Taq polymerase kéo dài mạch mới. Số bản sao đoạn đích tăng gần gấp đôi sau mỗi chu kỳ.' });
    for (const t of tubes) {
      const bad = t.assess.foreign.length || t.assess.blocked.length || (!t.control && !t.assess.template);
      events.push({ type: bad ? 'warning' : 'machine', label: t.name, text: this.#tubeText(t) });
    }
    return { action: 'pcr-run', events, tubes };
  }

  #tubeText(t) {
    const a = t.assess;
    if (a.foreign.length) return `Ống có ${a.foreign.map((s) => s.formula ?? s.name).join(', ')}: hoá chất lạ làm biến tính enzyme và hỏng DNA, không có sản phẩm.`;
    if (a.blocked.length) return `Không khuếch đại: thiếu ${a.blocked.map((s) => s.label).join(', ')}. ${a.blocked.map((s) => s.pcr.missing).join(' ')}`;
    if (!a.template) return t.control ? 'Không có DNA khuôn nên không có gì để nhân bản: đúng như mong đợi với đối chứng âm.' : 'Quên DNA khuôn: không có gì để nhân bản.';
    const parts = [`${fmtCopies(t.start)} bản khuôn ban đầu → khoảng ${fmtCopies(t.copies)} bản sau ${PCR.cycles} chu kỳ (hiệu suất ${Math.round(t.eff * 100)} %/chu kỳ, ${Math.round(ngOf(t.copies, CHAIN.productBp, CHAIN.reactionUl))} ng sản phẩm).`];
    for (const s of a.missing) if (s.pcr.need === 'factor') parts.push(`Thiếu ${s.label}: ${s.pcr.missing}`);
    for (const w of a.weak ?? []) parts.push(w.id === 'template' ? `DNA khuôn chỉ còn khoảng ${Math.round(w.activity * 100)} % nguyên vẹn (để ngoài lâu hoặc đông – rã nhiều lần): ít bản khuôn ban đầu hơn.` : `${w.label} chỉ còn khoảng ${Math.round(w.activity * 100)} % hoạt tính (bảo quản không đúng): hiệu suất mỗi chu kỳ giảm theo.`);
    return parts.join(' ');
  }

  loadGel() {
    const events = [];
    const lanes = [{ name: 'L', title: 'Ladder 1 kb', bands: LADDER.map((b) => ({ ...b })) }];
    for (const t of this.tubes) {
      const run = this.pcr?.[t.id];
      if (!run) continue;
      const ng = ngOf(run.copies, CHAIN.productBp);
      const w = brightness(ng);
      lanes.push({ name: t.short ?? t.name, title: t.name, tubeId: t.id, ng, bands: w > 0 ? [{ bp: CHAIN.productBp, w }] : [] });
    }
    if (lanes.length === 1) {
      events.push({ type: 'warning', text: 'Chưa có ống nào chạy PCR: chỉ nạp được ladder. Hãy chạy máy PCR trước rồi mới nạp sản phẩm vào gel.' });
    }
    events.push({
      type: 'machine',
      label: 'Giếng',
      text: lanes.map((l, i) => `${i + 1}: ${l.title}`).join(' · ') + `. Mỗi giếng ${CHAIN.loadUl} µL sản phẩm trộn loading dye 6X (bromophenol blue, glycerol); ladder 0,5 µg.`,
    });
    events.push({ type: 'effect', text: 'Glycerol trong loading dye làm mẫu nặng, chìm xuống đáy giếng; bromophenol blue cho thấy mẫu chạy tới đâu. Giếng đặt ở phía cực âm (dây đen) vì DNA mang điện âm, chạy về cực dương (dây đỏ).' });
    this.lanes = lanes;
    this.vh = 0;
    this.image = null;
    return { action: 'gel-load', events, lanes };
  }

  runGel(volts = CHAIN.volts) {
    const events = [];
    const vh = endVh();
    const minutes = Math.round(minutesAt(vh, volts));
    if (!this.lanes) events.push({ type: 'warning', text: 'Gel chưa nạp mẫu: chạy điện di lúc này không có gì để tách.' });
    events.push({ type: 'machine', label: 'Chạy', text: `${volts} V trong khoảng ${minutes} phút, đến khi bromophenol blue đi được ${Math.round(GEL.stop * 100)} % chiều dài gel (${fmtCm(bpbAfter(vh))}).` });
    events.push({ type: 'effect', text: 'Trong gel agarose 1 %, đoạn DNA càng ngắn chạy càng xa; quãng đường gần tỉ lệ nghịch với log(kích thước). Bromophenol blue chạy cùng các đoạn khoảng 400–500 bp.' });
    this.vh = this.lanes ? vh : 0;
    return { action: 'gel-run', events, minutes };
  }

  imageGel() {
    const events = [];
    const dye = bpbAfter(this.vh);
    const lanes = (this.lanes ?? [{ name: 'L', title: 'Ladder 1 kb', bands: [] }]).map((l, i) => {
      const shift = i ? this.random.normal() * CHAIN.laneJitter : 0;
      return { ...l, bands: l.bands.map((b) => ({ ...b, cm: this.vh ? Math.max(0, distanceOf(b.bp, dye) + shift) : 0 })) };
    });
    if (!this.lanes) events.push({ type: 'warning', text: 'Gel trống: chưa nạp mẫu nên ảnh không có băng nào.' });
    else if (!this.vh) events.push({ type: 'warning', text: 'Chưa chạy điện di: DNA vẫn nằm trong giếng, chưa tách theo kích thước.' });
    else events.push(...this.#verdict(lanes));
    events.push({ type: 'effect', text: 'Ethidium bromide chèn vào giữa các cặp base, phát huỳnh quang cam dưới tia UV 302 nm. Băng càng nhiều DNA càng sáng.' });
    this.image = { lanes };
    return { action: 'gel-image', events, lanes, dyeCm: dye, gelCm: GEL.length };
  }

  // Đọc kết quả như người làm thí nghiệm: so băng với ladder, xem đối chứng âm
  #verdict(lanes) {
    const out = [];
    const tubes = lanes.filter((l) => l.tubeId);
    const sample = tubes.filter((l) => !this.pcr[l.tubeId].control);
    const controls = tubes.filter((l) => this.pcr[l.tubeId].control);
    for (const l of sample) {
      out.push(l.bands.length
        ? { type: 'machine', label: l.title, text: `Có một băng nằm giữa vạch 1 000 và 1 500 bp của ladder, khoảng ${CHAIN.productBp.toLocaleString('fr-FR')} bp: đúng kích thước sản phẩm (ước tính ${Math.round(l.ng)} ng trong giếng).` }
        : { type: 'warning', label: l.title, text: 'Không có băng: phản ứng không tạo đủ sản phẩm để thấy được. Xem lại thành phần ở thẻ "Chạy máy PCR".' });
    }
    for (const l of controls) {
      out.push(l.bands.length
        ? { type: 'warning', label: l.title, text: 'Đối chứng âm có băng: ống bị nhiễm DNA. Kết quả của cả lần chạy không tin được.' }
        : { type: 'machine', label: l.title, text: 'Không có băng: không có DNA lạ nhiễm vào hoá chất, băng ở ống mẫu là sản phẩm thật.' });
    }
    if (!controls.length) out.push({ type: 'warning', text: 'Không có đối chứng âm (ống đủ thành phần nhưng không có DNA khuôn): không loại trừ được khả năng băng đến từ DNA nhiễm.' });
    return out;
  }
}
