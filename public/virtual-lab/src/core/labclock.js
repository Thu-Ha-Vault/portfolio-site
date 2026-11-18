// Đồng hồ chung của phòng thí nghiệm (giai đoạn 7): chạy theo thời gian thật, tua ×10 hoặc ×60, "chờ tới khi xong" nhảy
// tới lúc việc gần nhất xong. Mỗi lần chạy máy có thời gian (ly tâm, PCR, điện di…) là một việc; nhiều việc chạy song
// song. Không dùng Three.js, không đụng DOM. Đơn vị: giây kể từ đầu buổi.

export const SPEEDS = [1, 10, 60];
export const DAY_START = 8 * 3600; // buổi bắt đầu lúc 8:00 (minh hoạ)

export class LabClock {
  constructor() {
    this.reset();
  }

  reset() {
    this.now = 0;
    this.speed = 1;
    this.jobs = [];
    this.nextId = 1;
  }

  setSpeed(k) {
    if (SPEEDS.includes(k)) this.speed = k;
    return this.speed;
  }

  // Thêm một việc kéo dài seconds giây; data đi kèm để trả lại khi xong
  start(name, seconds, data = null) {
    const job = { id: this.nextId++, name, t0: this.now, t1: this.now + Math.max(0, seconds), data, done: false };
    this.jobs.push(job);
    return job;
  }

  running() {
    return this.jobs.filter((j) => !j.done);
  }

  remaining(job) {
    return Math.max(0, job.t1 - this.now);
  }

  // Thời gian thật trôi dt giây: đồng hồ chạy dt × tốc độ. Trả về các việc vừa xong theo thứ tự xong.
  tick(dt) {
    return this.advanceTo(this.now + Math.max(0, dt) * this.speed);
  }

  advanceTo(t) {
    this.now = Math.max(this.now, t);
    const done = this.jobs.filter((j) => !j.done && j.t1 <= this.now + 1e-9).sort((a, b) => a.t1 - b.t1);
    for (const j of done) j.done = true;
    return done;
  }

  // "Chờ tới khi xong": nhảy tới lúc việc đang chạy gần xong nhất (all: tới khi mọi việc xong)
  waitNext(all = false) {
    const run = this.running();
    if (!run.length) return [];
    return this.advanceTo(all ? Math.max(...run.map((j) => j.t1)) : Math.min(...run.map((j) => j.t1)));
  }
}

// Giờ trong ngày dạng "8:05:09" từ số giây kể từ đầu buổi
export function clockText(t, start = DAY_START) {
  const s = Math.floor(start + t);
  const h = Math.floor(s / 3600) % 24;
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// Thời gian còn lại dạng "1 giờ 05 phút", "3 phút 20 giây", "45 giây"
export function leftText(s) {
  const t = Math.ceil(s);
  if (t >= 3600) return `${Math.floor(t / 3600)} giờ ${String(Math.floor((t % 3600) / 60)).padStart(2, '0')} phút`;
  if (t >= 60) return `${Math.floor(t / 60)} phút ${String(t % 60).padStart(2, '0')} giây`;
  return `${t} giây`;
}
