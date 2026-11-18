// Đo nồng độ và độ sạch acid nucleic trên bệ (NanoDrop One): đo mẫu trắng đúng dung dịch đệm, nhỏ 1–2 µL mẫu,
// đọc nồng độ, 260/280, 260/230, lau bệ giữa các mẫu.
// Phổ, quang lộ tự chọn, sai số, hệ số 50/33/40, tỉ số mẫu sạch và cảnh báo độ sạch lấy từ figures/nanodrop/model.mjs
// (tờ thông số PS52754_E, Thermo T042). Lượng chất trong ba mẫu (nồng độ, guanidine, phenol) chọn ngẫu nhiên trong
// các khoảng minh hoạ quanh mẫu làm mẫu của hình. Không phụ thuộc DOM.

import { measure, BUFFERS, FACTOR, fmtConc, fmtNum } from '../../figures/nanodrop/model.mjs';
import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const ND_ACTIONS = { 'nd-blank': 'Đo mẫu trắng', 'nd-measure': 'Đo mẫu', 'nd-wipe': 'Lau bệ' };
export const ND_SAMPLES = {
  plasmid: { name: 'Plasmid tách bằng kit (miniprep)', type: 'dsDNA', buffer: 'TE' },
  gdna: { name: 'DNA bộ gen tách bằng cột, rửa chưa kỹ', type: 'dsDNA', buffer: 'EB' },
  rna: { name: 'RNA tách bằng TRIzol', type: 'RNA', buffer: 'water' },
};
const span = (r, a, b) => a + (b - a) * r();
const fmt = (v, d = 2) => fmtNum(v, d);

export class NanodropLab {
  constructor({ seed = Date.now() } = {}) {
    this.notebook = new Notebook();
    this.reset(seed);
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    const r = this.random;
    this.truth = {
      plasmid: { conc: span(r, 80, 300) },
      gdna: { conc: span(r, 40, 120), guanidine: span(r, 0.6, 1.2) },
      rna: { conc: span(r, 250, 600), phenol: span(r, 0.8, 1.6) },
    };
    this.blank = null;
    this.dirty = false;
    this.last = null;
    this.n = 0;
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'nd-blank': () => this.doBlank(params), 'nd-measure': () => this.doMeasure(params), 'nd-wipe': () => this.wipe() }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  sampleOf(id, volume = 1.5) {
    const s = ND_SAMPLES[id] ?? ND_SAMPLES.plasmid;
    return { type: s.type, buffer: s.buffer, volume, ...this.truth[ND_SAMPLES[id] ? id : 'plasmid'] };
  }

  doBlank({ buffer = 'TE' }) {
    const b = BUFFERS[buffer] ? buffer : 'TE';
    const events = [];
    if (this.dirty) events.push({ type: 'warning', text: 'Bệ còn mẫu cũ chưa lau: mẫu trắng lẫn acid nucleic, mọi số đo sau sẽ bị trừ thiếu.' });
    this.blank = b;
    this.dirty = false;
    events.unshift({ type: 'machine', label: 'Mẫu trắng', text: `Nhỏ ${fmt(1.5, 1)} µL ${BUFFERS[b].name} lên bệ, hạ cần, đo. Máy lưu phổ này để trừ khỏi mọi lần đo sau.` });
    this.notebook.add({ day: '', experiment: 'NanoDrop', action: ND_ACTIONS['nd-blank'], subject: BUFFERS[b].name, result: 'ok' });
    return { ok: true, events };
  }

  doMeasure({ sample = 'plasmid', volume = 1.5 }) {
    const id = ND_SAMPLES[sample] ? sample : 'plasmid';
    const info = ND_SAMPLES[id];
    const s = this.sampleOf(id, Number(volume));
    const events = [];
    if (this.dirty) events.push({ type: 'warning', text: 'Chưa lau bệ sau mẫu trước: phần mẫu cũ bám trên bệ lẫn vào giọt mới.' });
    this.n += 1;
    const seed = Math.floor(this.random() * 1e6);
    const r = measure(s, { blank: this.blank, seed });
    if (!r.ok) {
      events.unshift({ type: 'warning', label: 'Lỗi', text: r.message });
      this.notebook.add({ day: '', experiment: 'NanoDrop', action: ND_ACTIONS['nd-measure'], subject: info.name, result: r.error });
      if (r.error !== 'no-blank') this.dirty = true;
      return { ok: false, events };
    }
    this.dirty = true;
    this.last = { id, sample: s, blank: this.blank, reading: r, seed };
    events.unshift({ type: 'machine', label: info.type, text: `${info.name}: ${fmtConc(r)} ng/µL (A260 ${fmt(r.a260, 3)} quy về 10 mm, quang lộ ${fmtNum(r.path, 2)} mm). 260/280 = ${fmt(r.r280)}, 260/230 = ${fmt(r.r230)}.` });
    events.push({ type: 'info', text: `Nồng độ = A260 × ${FACTOR[r.type]} ng·cm/µL (${r.type}). Hệ số khác nhau vì mỗi loại acid nucleic có hệ số hấp thụ riêng.` });
    for (const f of r.flags) events.push({ type: 'warning', text: f });
    if (!r.flags.length) events.push({ type: 'effect', text: 'Hai tỉ số nằm trong khoảng mẫu sạch: dùng tiếp cho PCR, cắt enzyme, giải trình tự được.' });
    if (this.blank !== s.buffer) events.push({ type: 'warning', text: `Mẫu pha trong ${BUFFERS[s.buffer].name} nhưng mẫu trắng là ${BUFFERS[this.blank].name}: mẫu trắng phải đúng dung dịch đệm của mẫu, nếu không phần hấp thụ của đệm bị tính vào mẫu.` });
    if (s.buffer === 'water' && r.type === 'RNA') events.push({ type: 'info', text: 'Nước hơi acid (pH khoảng 6) làm 260/280 thấp đi 0,2–0,3 (T042); pha RNA trong TE pH 8 để đo cho đúng.' });
    this.notebook.add({ day: '', experiment: 'NanoDrop', action: ND_ACTIONS['nd-measure'], subject: info.name, result: r.conc.toFixed(1), a260_280: r.r280.toFixed(2), a260_230: r.r230.toFixed(2) });
    return { ok: true, events, reading: r, spectrum: r.wl.map((w, i) => [w, r.abs[i]]) };
  }

  wipe() {
    const was = this.dirty;
    this.dirty = false;
    return { ok: true, events: [{ type: 'machine', label: 'Lau bệ', text: was ? 'Lau bệ trên và bệ dưới bằng khăn giấy không xơ: sạch mẫu cũ, sẵn sàng cho mẫu mới.' : 'Bệ đã sạch.' }] };
  }

  figureData() {
    if (!this.last) return null;
    const { id, sample, blank, seed } = this.last;
    return { name: ND_SAMPLES[id].name, sample, blank, seed };
  }
}

