// Bộ sinh số ngẫu nhiên có seed (mulberry32) để chạy lại được đúng kết quả. Dùng chung cho mọi mô phỏng.

export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Phân phối chuẩn tắc (Box–Muller)
  next.normal = () => {
    const u = Math.max(next(), 1e-12);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * next());
  };
  // Phân phối Poisson (thuật toán Knuth, đủ dùng cho trung bình nhỏ)
  next.poisson = (mean) => {
    const L = Math.exp(-mean);
    let k = 0;
    let p = 1;
    do {
      k += 1;
      p *= next();
    } while (p > L);
    return k - 1;
  };
  next.pick = (list) => list[Math.floor(next() * list.length)];
  return next;
}
