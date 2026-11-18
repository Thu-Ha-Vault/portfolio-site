// Kính hiển vi quang học: đổi vật kính, lấy nét bằng núm thô hoặc núm tinh, dầu soi cho vật kính 100×.
// Độ phóng đại, độ phân giải, thị trường, độ sâu trường, độ mờ lấy từ figures/microscope/model.mjs (Olympus CX23).
// Sai lệch nét sau khi lấy nét: người dùng xoay tới khi ảnh trông nét nên phần lệch còn lại là số lớn hơn giữa
// (a) mức mắt còn nhận ra mờ, khoảng 0,4 lần độ sâu trường, và (b) góc xoay nhỏ nhất tay điều khiển được, giả định 0,25°:
// núm thô 36,8 mm/vòng → khoảng 26 µm, núm tinh 100 µm/vòng → khoảng 0,07 µm. Vì vậy núm thô đủ nét ở 4×,
// còn từ 10× trở lên phải chỉnh lại bằng núm tinh. Đổi vật kính không chỉnh lại: lệch đồng tiêu khoảng ±3 µm (giả định).
// Không phụ thuộc DOM.

import { viewState, SPECIMENS, objectiveOf, depthOfField, FOCUS } from '../../figures/microscope/model.mjs';
import { rng } from './random.js';
import { Notebook } from './notebook.js';

export const MIC_ACTIONS = { 'mic-view': 'Quan sát' };
const HAND_DEG = 0.25; // góc xoay nhỏ nhất tay điều khiển được (giả định)
const handStep = (perTurnUm) => (perTurnUm * HAND_DEG) / 360;
const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d).replace('.', ',') : '—');

export class MicroscopeLab {
  constructor({ seed = Date.now(), specimen = 'onion' } = {}) {
    this.notebook = new Notebook();
    this.reset(seed, specimen);
  }

  reset(seed = Date.now(), specimen = 'onion') {
    this.random = rng(seed);
    this.specimen = specimen;
    this.objective = 4;
    this.stage = -2000; // µm dưới vị trí nét: chưa lấy nét
    this.oil = false;
    this.notebook.clear();
  }

  do(action, params = {}) {
    if (action !== 'mic-view') throw new Error(`Không có thao tác "${action}"`);
    return { action, ...this.view(params) };
  }

  view({ objective = this.objective, focus = 'fine', oil = this.oil, specimen = this.specimen }) {
    const events = [];
    const o = objectiveOf(objective);
    if (specimen !== this.specimen) {
      this.specimen = specimen;
      this.stage = -2000;
    }
    if (oil && !this.oil && o.mag !== 100) events.push({ type: 'warning', text: 'Nhỏ dầu soi khi chưa dùng vật kính 100×: dầu sẽ dính vào vật kính khô 40×, làm nhòe ảnh. Chỉ nhỏ dầu ngay trước khi xoay 100× vào.' });
    this.oil = oil;
    const changed = Number(objective) !== this.objective;
    this.objective = o.mag;
    const dof = depthOfField(o);
    const residual = (perTurn) => Math.max(handStep(perTurn), 0.4 * dof) * (this.random() * 2 - 1);
    if (focus === 'coarse') {
      this.stage = residual(FOCUS.coarsePerTurn * 1000);
      if (o.mag >= 40) events.push({ type: 'warning', text: `Lấy nét bằng núm thô ở vật kính ${o.mag}× (khoảng làm việc chỉ ${fmt(o.wd, 2)} mm): dễ đẩy lam kính chạm và làm vỡ lam hoặc xước vật kính. Ở ${o.mag}× chỉ dùng núm tinh.` });
    } else if (focus === 'fine') {
      if (Math.abs(this.stage) > 400) events.push({ type: 'warning', text: 'Ảnh chưa hiện để chỉnh tinh: phải lấy nét thô trước ở vật kính nhỏ (4× hoặc 10×).' });
      else this.stage = residual(FOCUS.finePerTurn);
    } else if (changed) {
      this.stage += (this.random() * 2 - 1) * 3; // lệch đồng tiêu khi đổi vật kính
    }
    const v = viewState({ objective: o.mag, stage: this.stage, oil: this.oil });
    const sp = SPECIMENS[this.specimen];
    const size = this.specimen === 'onion' ? sp.cell.length : sp.rbc;
    const across = (v.fov * 1000) / size;
    events.unshift({ type: v.label === 'nét' ? 'machine' : 'warning', label: `${o.mag}× · ${v.total}×`, text: `${sp.name} nhuộm ${sp.stain}: ảnh ${v.label}. Thị trường ${fmt(v.fov, 2)} mm (khoảng ${across >= 10 ? Math.round(across) : fmt(across)} ${this.specimen === 'onion' ? 'tế bào' : 'hồng cầu'} nằm ngang), độ phân giải ${fmt(v.resolution, 2)} µm, độ sâu trường ${fmt(v.dof, 2)} µm.` });
    if (v.oilMissing) events.push({ type: 'warning', text: 'Vật kính 100× cần dầu soi (n = 1,515) giữa vật kính và lá kính: không có dầu thì ánh sáng khúc xạ ra ngoài, NA tụt dưới 0,95, ảnh tối và nhòe.' });
    else if (o.mag === 100) events.push({ type: 'effect', text: 'Có dầu soi: chiết suất dầu bằng thuỷ tinh nên tia sáng không bị khúc xạ lệch ra ngoài, vật kính đạt NA 1,25 và độ phân giải khoảng 0,27 µm.' });
    if (focus === 'none' && changed && v.label !== 'nét') events.push({ type: 'info', text: 'Vật kính đồng tiêu nên đổi vật kính vẫn gần nét; ở độ phóng đại lớn độ sâu trường rất mỏng, cần chỉnh lại bằng núm tinh.' });
    this.notebook.add({ day: '', experiment: 'Kính hiển vi', action: MIC_ACTIONS['mic-view'], subject: `${o.mag}× ${this.specimen}`, result: v.label, stage_um: this.stage.toFixed(2) });
    return { ok: true, events, view: v };
  }

  figureData() {
    return { objective: this.objective, specimen: this.specimen, oil: this.oil, focus: +Math.max(-14900, Math.min(100, this.stage)).toFixed(2), x: 0 };
  }
}
