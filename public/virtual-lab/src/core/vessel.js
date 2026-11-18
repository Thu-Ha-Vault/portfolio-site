// Dụng cụ chứa theo kích thước thật (giai đoạn 7): bán kính lòng trong theo độ cao và quy đổi thể tích ↔ chiều cao mực
// chất lỏng. Không dùng Three.js, không đụng DOM; cảnh 3D (src/scene/bench-items.js) dựng thành cốc, mặt chất lỏng và
// vạch chia từ đây. Đơn vị mét, mL. Nguồn kích thước ngoài ghi ở từng mục (chi tiết ở note 12); bề dày thành, độ cao phần
// nón của ống là minh hoạ.

export const VESSELS = {
  // Cốc có mỏ DURAN dạng thấp 50 mL (ISO 3819): ngoài Ø 42 × 60 mm (DWK 211061706, catalog Hermes LabSystems)
  beaker50: { shape: 'beaker', mL: 50, R: 0.021, H: 0.06, wall: 0.0015, marks: [10, 20, 30, 40, 50] },
  // Bình tam giác DURAN cổ hẹp 100 mL (ISO 1773): cao 105 mm, đáy Ø 64 mm, cổ Ø 22 mm (cùng catalog); cổ cao 25 mm: minh hoạ
  flask100: { shape: 'flask', mL: 100, R: 0.032, H: 0.105, neckR: 0.011, neckH: 0.025, wall: 0.0015, marks: [25, 50, 75, 100] },
  // Ống nghiệm PYREX 9820-16XX: Ø ngoài khoảng 16 mm, cao 150 mm, khoảng 20 mL (Corning eCatalog)
  tube16: { shape: 'testtube', R: 0.008, H: 0.15, wall: 0.0012 },
  // Ống PCR 0,2 mL Greiner Bio-One 671201: dài 20,75 mm không kể nắp, Ø ngoài 7,09 mm, Ø trong 5,38 mm (datasheet 671201 FT)
  pcr02: { shape: 'pcr', R: 0.003545, Rin: 0.00269, H: 0.02075, cone: 0.011, tipR: 0.0008 },
  // Ống Eppendorf Safe-Lock 1,5 mL: thân cao 38,9 mm, Ø 10,8 mm (Technical Data Sheet 0017010417)
  micro15: { shape: 'pcr', R: 0.0054, Rin: 0.0047, H: 0.0389, cone: 0.018, tipR: 0.0015 },
  // Cốc có mỏ DURAN dạng thấp (ISO 3819), ngoài Ø × cao theo bảng của DWK: 100 mL 50 × 70 mm (211062402), 250 mL 70 × 95 mm
  // (211063604), 600 mL 90 × 125 mm (211064806), 1000 mL 105 × 145 mm (211065408); bề dày thành là minh hoạ
  beaker100: { shape: 'beaker', mL: 100, R: 0.025, H: 0.07, wall: 0.0015, marks: [20, 40, 60, 80, 100] },
  beaker250: { shape: 'beaker', mL: 250, R: 0.035, H: 0.095, wall: 0.0018, marks: [50, 100, 150, 200, 250] },
  beaker600: { shape: 'beaker', mL: 600, R: 0.045, H: 0.125, wall: 0.002, marks: [100, 200, 300, 400, 500, 600] },
  beaker1000: { shape: 'beaker', mL: 1000, R: 0.0525, H: 0.145, wall: 0.0022, marks: [200, 400, 600, 800, 1000] },
  // Ống đong DURAN 10 mL cấp B đế lục giác (DWK 213960801, ISO 4788): Ø 14 × cao 137 mm; đế cao 8 mm, rộng 44 mm là minh hoạ
  cyl10: { shape: 'cylinder', mL: 10, R: 0.007, H: 0.137, wall: 0.0012, foot: 0.008, footR: 0.022, marks: [2, 4, 6, 8, 10] },
  // Bình định mức DURAN 100 mL cấp A, nút NS 12/21: cao 170 mm (danh mục nhà phân phối DWK); bầu Ø 60 mm, cổ Ø 13 mm
  // chưa xác minh. Bầu coi như hình cầu, nên vạch 100 mL nằm ở chân cổ (bình thật có vạch cao hơn trên cổ)
  vol100: { shape: 'volflask', mL: 100, R: 0.03, H: 0.17, neckR: 0.0065, wall: 0.0012, marks: [100] },
};

// Dụng cụ đo dạng ống (dựng đúng cỡ trong cảnh; lượng lấy và sai số tính trong lab-engine.js theo data/tools.json)
export const TUBES = {
  // Pipet bầu 10 mL một vạch BLAUBRAND (BRAND, Sigma-Aldrich Z325147, DIN EN ISO 648): dài 440 mm; bầu Ø 16 × 100 mm
  // và thân Ø 6 mm là minh hoạ
  pip10: { L: 0.44, R: 0.003, bulbR: 0.008, bulbL: 0.1, bulbAt: 0.13 },
  // Pipet chia vạch 10 mL : 0,1 mL kiểu 3 BLAUBRAND (Sigma-Aldrich Z325937, DIN EN ISO 835): dài 360 mm; Ø 9 mm minh hoạ
  pipg10: { L: 0.36, R: 0.0045 },
  // Buret 25 mL : 0,05 mL BLAUBRAND khoá thẳng (BRAND 12487, Sigma-Aldrich Z323535): dài khoảng 800 mm. Lòng Ø 8 mm, đoạn
  // chia vạch 500 mm là minh hoạ, chọn để 25 mL nằm vừa đoạn chia vạch (π · 4² · 500 mm³ ≈ 25 mL)
  buret25: { L: 0.8, R: 0.0055, Rin: 0.004, scale: 0.5, mL: 25 },
};

// Thể tích (mL) của đoạn ống lòng tròn bán kính Rin, dài h (m)
export const tubeVolume = (t, h = t.scale) => Math.PI * t.Rin * t.Rin * h * 1e6;

// Chiều cao lòng trong (từ đáy trong tới miệng)
export function innerHeight(v) {
  if (v.shape === 'cylinder') return v.H - v.foot - v.wall;
  return v.shape === 'pcr' ? v.H : v.H - v.wall;
}

// Bán kính lòng trong ở độ cao y tính từ đáy trong
export function innerRadius(v, y) {
  const h = Math.max(0, Math.min(innerHeight(v), y));
  if (v.shape === 'beaker' || v.shape === 'cylinder') return v.R - v.wall;
  if (v.shape === 'volflask') {
    // Bầu cầu bán kính lòng ri, tâm ở độ cao ri; trên chỗ bầu bằng cổ là cổ thẳng
    const ri = v.R - v.wall;
    const rn = v.neckR - v.wall;
    const top = ri + Math.sqrt(ri * ri - rn * rn);
    return h < top ? Math.sqrt(Math.max(0, ri * ri - (h - ri) * (h - ri))) : rn;
  }
  if (v.shape === 'flask') {
    const r0 = v.R - v.wall;
    const rn = v.neckR - v.wall;
    const hc = v.H - v.neckH;
    return h < hc ? r0 + ((rn - r0) * h) / hc : rn;
  }
  if (v.shape === 'testtube') {
    const r = v.R - v.wall;
    return h < r ? Math.sqrt(Math.max(0, r * r - (r - h) * (r - h))) : r;
  }
  // Ống có đáy nón
  return h < v.cone ? v.tipR + ((v.Rin - v.tipR) * h) / v.cone : v.Rin;
}

// Thể tích (mL) chứa tới độ cao h
export function volumeAt(v, h, n = 240) {
  const top = Math.max(0, Math.min(innerHeight(v), h));
  const dy = top / n;
  let s = 0;
  for (let i = 0; i < n; i++) {
    const r = innerRadius(v, (i + 0.5) * dy);
    s += Math.PI * r * r * dy;
  }
  return s * 1e6;
}

// Sức chứa tới miệng (mL)
export const brimful = (v) => volumeAt(v, innerHeight(v));

// Độ cao mực chất lỏng (m) của thể tích mL; quá miệng thì trả về miệng
export function heightFor(v, mL) {
  if (!(mL > 0)) return 0;
  const H = innerHeight(v);
  if (mL >= brimful(v)) return H;
  let lo = 0;
  let hi = H;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (volumeAt(v, mid) < mL) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
