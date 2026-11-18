// Ly tâm thu cặn tế bào: nạp ống vào rotor (cân bằng hay lệch), đặt lực và thời gian, chạy máy.
// Số liệu máy, công thức RCF, ngưỡng lệch tâm lấy từ figures/centrifuge/model.mjs (Eppendorf 5425, rotor FA-24×2).
// Ngưỡng thu cặn vi khuẩn: khoảng 5 000 × g trong 5–10 phút như các quy trình thu tế bào E. coli thường dùng;
// mô hình coi cặn chắc khi tích (× g · phút) ≥ 25 000, lỏng khi ≥ 8 000 (giả định minh hoạ). Không phụ thuộc DOM.

import { programOf, stateAt, totalSeconds, kFactor, pelletSeconds, fmtInt, ROTOR } from '../../figures/centrifuge/model.mjs';
import { Notebook } from './notebook.js';

export const CF_ACTIONS = { 'cf-run': 'Chạy máy ly tâm' };

// Cách xếp ống: lỗ i đối diện lỗ i + 12
export const LOADS = {
  pair: { name: '2 ống đối diện (cân bằng)', tubes: [0, 12] },
  six: { name: '6 ống, 3 cặp đối diện', tubes: [0, 12, 4, 16, 8, 20] },
  three: { name: '3 ống cách đều 120°', tubes: [0, 8, 16] },
  single: { name: '1 ống (không có ống đối trọng)', tubes: [0] },
  adjacent: { name: '2 ống cạnh nhau', tubes: [0, 1] },
};

export class CentrifugeLab {
  constructor() {
    this.notebook = new Notebook();
    this.last = null;
  }

  reset() {
    this.notebook.clear();
    this.last = null;
  }

  do(action, params = {}) {
    if (action !== 'cf-run') throw new Error(`Không có thao tác "${action}"`);
    return { action, ...this.run(params) };
  }

  // tubes: các lỗ rotor tự chọn khi nạp ống bằng tay (0–23, lỗ i đối diện lỗ i + 12); không có thì theo cách xếp load
  run({ rcf = 5000, minutes = 10, load = 'pair', tubes = null }) {
    const L = Array.isArray(tubes) && tubes.length ? { name: `${tubes.length} ống ở lỗ ${[...tubes].sort((a, b) => a - b).map((i) => i + 1).join(', ')}`, tubes } : LOADS[load] ?? LOADS.pair;
    const prog = programOf({ rcf, minutes, tubes: L.tubes });
    const events = [{ type: 'machine', label: 'Chương trình', text: `${fmtInt(prog.rcf)} × g (${fmtInt(prog.rpm)} rpm, r = ${String(ROTOR.rMax).replace('.', ',')} cm), ${minutes} phút; ${L.name}.` }];
    for (const w of prog.warnings) events.push({ type: 'warning', text: w });
    let result;
    if (prog.imbalanced) {
      const end = totalSeconds(prog);
      let stop = null;
      for (let t = 0; t <= end; t += 0.5) {
        const s = stateAt(t, prog);
        if (s.error) { stop = s; break; }
      }
      events.push({ type: 'warning', label: 'IMBAL', text: `Rotor lệch tâm: máy rung mạnh và tự dừng ở khoảng ${fmtInt(prog.tripRpm)} rpm, màn hình báo IMBAL. Mẫu chưa được ly tâm.` });
      events.push({ type: 'effect', text: 'Rotor quay nhanh với khối lượng lệch tạo lực ly tâm không cân, làm hỏng trục động cơ. Luôn đặt ống thành cặp đối diện, cùng loại, cùng lượng mẫu (thêm ống nước làm đối trọng nếu số mẫu lẻ).' });
      result = { pellet: 'none', stoppedAt: stop?.rpm ?? prog.tripRpm };
    } else {
      const gmin = prog.rcf * minutes;
      const pellet = gmin >= 25000 ? 'firm' : gmin >= 8000 ? 'loose' : 'none';
      events.push({
        type: pellet === 'firm' ? 'effect' : 'warning',
        label: 'Kết quả',
        text: pellet === 'firm' ? 'Tế bào lắng thành cặn chắc ở đáy ống, dịch nổi trong: gạn bỏ dịch nổi được.' : pellet === 'loose' ? 'Cặn lỏng, dễ bung khi gạn; dịch nổi còn đục. Tăng lực hoặc thời gian.' : 'Gần như không có cặn: lực hoặc thời gian quá thấp.',
      });
      events.push({ type: 'info', label: 'Tham khảo', text: `Hệ số k của rotor ở ${fmtInt(prog.rpm)} rpm khoảng ${fmtInt(kFactor(prog.rpm))}; ribosome 70S (70 S) cần khoảng ${(pelletSeconds(70, prog.rpm) / 3600).toFixed(1).replace('.', ',')} giờ để lắng hết (t = k/S): ly tâm thường chỉ lắng được tế bào và kết tủa, muốn lắng bào quan nhỏ cần siêu ly tâm.` });
      result = { pellet };
    }
    this.last = { rcf: prog.rcf, minutes, tubes: L.tubes, imbalanced: prog.imbalanced };
    this.notebook.add({ day: '', experiment: 'Ly tâm', action: CF_ACTIONS['cf-run'], subject: L.name, result: prog.imbalanced ? 'IMBAL' : result.pellet, rcf: Math.round(prog.rcf), minutes });
    return { ok: !prog.imbalanced, events, result };
  }

  figureData() {
    return this.last ? { rcf: Math.round(this.last.rcf), minutes: this.last.minutes, tubes: this.last.tubes } : null;
  }
}
