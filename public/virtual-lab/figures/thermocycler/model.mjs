// Mô hình chu trình nhiệt của máy PCR, dùng chung cho bản dựng (Node) và trang (trình duyệt).
// Số liệu:
// - Chu trình 3 bước chuẩn theo Addgene (https://www.addgene.org/protocols/pcr/):
//   biến tính ban đầu 94 °C 2 phút; 30 chu kỳ 94 °C 30 s · 55 °C 30 s · 72 °C 1 phút (sản phẩm 1 kb);
//   kéo dài cuối 72 °C 5 phút; giữ 4 °C.
// - Máy làm mẫu Bio-Rad T100 (Tech Spec Bulletin 6060): tốc độ đổi nhiệt trung bình 2,5 °C/s,
//   nắp gia nhiệt mặc định 105 °C, block 4–100 °C.
// - Số bản sao: giả định 10⁴ bản khuôn ban đầu, hiệu suất mỗi chu kỳ 95 %, bão hoà quanh 5×10¹¹ bản
//   (con số minh hoạ cho một phản ứng 25 µL, không phải thông số của máy).

export const PCR = {
  ramp: 2.5,
  lid: 105,
  room: 25,
  cycles: 30,
  initial: { name: "Biến tính ban đầu", T: 94, s: 120 },
  steps: [
    { name: "Biến tính", T: 94, s: 30 },
    { name: "Gắn mồi", T: 55, s: 30 },
    { name: "Kéo dài", T: 72, s: 60 },
  ],
  final: { name: "Kéo dài cuối", T: 72, s: 300 },
  hold: { name: "Giữ", T: 4 },
  copies: { start: 1e4, efficiency: 0.95, plateau: 5e11 },
};

// Dòng thời gian của cả chương trình: mỗi bước là một đoạn đổi nhiệt rồi một đoạn giữ nhiệt.
// Máy chỉ bắt đầu đếm thời gian giữ khi block đã đạt nhiệt độ đặt.
export function timeline(pcr = PCR) {
  const list = [{ ...pcr.initial, cycle: 0, step: -1 }];
  for (let c = 1; c <= pcr.cycles; c++) pcr.steps.forEach((s, i) => list.push({ ...s, cycle: c, step: i }));
  list.push({ ...pcr.final, cycle: pcr.cycles, step: 3 });
  list.push({ ...pcr.hold, s: Infinity, cycle: pcr.cycles, step: 4 });
  const segments = [];
  let t = 0;
  let T = pcr.room;
  for (const step of list) {
    const ramp = Math.abs(step.T - T) / pcr.ramp;
    segments.push({ ...step, from: T, t0: t, ramp, hold0: t + ramp, t1: t + ramp + step.s });
    t += ramp + step.s;
    T = step.T;
  }
  return segments;
}

const SEGMENTS = timeline();
export const RUN_SECONDS = SEGMENTS[SEGMENTS.length - 1].hold0;

// Trạng thái của máy ở giây thứ t kể từ khi bấm chạy.
export function stateAt(t, segments = SEGMENTS, pcr = PCR) {
  if (t <= 0) return { T: pcr.room, rate: 0, index: -1, seg: null, cycle: 0, ramping: false, left: RUN_SECONDS, holdLeft: 0, done: false };
  let i = segments.findIndex((s) => t < s.t1);
  if (i < 0) i = segments.length - 1;
  const seg = segments[i];
  const ramping = t < seg.hold0;
  const k = seg.ramp > 0 ? Math.min(1, (t - seg.t0) / seg.ramp) : 1;
  const T = ramping ? seg.from + (seg.T - seg.from) * k : seg.T;
  const rate = ramping ? Math.sign(seg.T - seg.from) * pcr.ramp : 0;
  const done = seg.step === 4 && !ramping;
  return {
    T,
    rate,
    index: i,
    seg,
    cycle: seg.cycle,
    ramping,
    holdLeft: ramping ? seg.s : Math.max(0, seg.t1 - t),
    left: Math.max(0, RUN_SECONDS - t),
    done,
  };
}

// Số bản sao sau n chu kỳ hoàn tất: mỗi lần kéo dài xong, số bản sao tăng theo hiệu suất,
// hiệu suất giảm dần khi gần bão hoà (cạn mồi, dNTP, enzyme).
export function copiesAfter(n, pcr = PCR) {
  const { start, efficiency, plateau } = pcr.copies;
  let N = start;
  for (let c = 0; c < n; c++) N = N * (1 + efficiency * (1 - N / plateau));
  return N;
}

// Số chu kỳ đã hoàn tất ở giây t: một chu kỳ xong khi bước kéo dài của nó kết thúc.
export function cyclesDone(t, segments = SEGMENTS) {
  let n = 0;
  for (const s of segments) if (s.step === 2 && t >= s.t1) n = s.cycle;
  return n;
}

// Đường nhiệt độ của một chu kỳ mẫu (để vẽ trục trên màn hình): [giây, °C].
export function cycleProfile(pcr = PCR) {
  const pts = [];
  let t = 0;
  let T = pcr.steps[pcr.steps.length - 1].T;
  for (const s of pcr.steps) {
    const ramp = Math.abs(s.T - T) / pcr.ramp;
    pts.push([t, T], [t + ramp, s.T]);
    t += ramp + s.s;
    T = s.T;
    pts.push([t, T]);
  }
  return { points: pts, length: t };
}

export const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export const fmtCopies = (N) => {
  const e = Math.floor(Math.log10(N));
  const m = N / 10 ** e;
  const sup = String(e).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  return `${m.toFixed(1).replace(".", ",")}×10${sup}`;
};
