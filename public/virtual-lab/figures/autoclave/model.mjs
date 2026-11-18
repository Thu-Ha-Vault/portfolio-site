// Mô hình nồi hấp tiệt trùng (theo Tomy SX-500), dùng chung cho bản dựng (Node), trang (trình duyệt)
// và sau này cho lõi mô phỏng của app (src/core). Module thuần: không DOM, không Three.js.
//
// Nguồn số liệu:
// - Tomy SX-300/500/700 Operator's Manual, ID No. 21006.12, 01/2014
//   (https://groups.oist.jp/sites/default/files/imce/u430/TOMY_Autoclave.pdf):
//   buồng φ325 × 733 mm, 58 L (dùng được 50 L), thép SUS304; tiệt trùng 105–135 °C (0,019–0,212 MPa);
//   áp suất làm việc tối đa 0,25 MPa; đồng hồ áp 0–0,4 MPa; điện trở 2,0 kW; nước khoảng 3,0 L;
//   khoá nắp nhả ở 97 °C (mặc định của hãng, chỉnh 60–100 °C); hoàn tất khi buồng còn 60 °C;
//   chạy dịch lỏng lâu hơn: 2 L +4 phút, 5 L +8 phút, 10 L +15 phút (ở 121 °C 20 phút);
//   đồ đem hấp chỉ nên chiếm tối đa 50 % thể tích buồng; không hấp chai đậy kín.
// - Phương trình Antoine của nước (hằng số theo mmHg, °C; Dortmund Data Bank, chép trong
//   https://en.wikipedia.org/wiki/Antoine_equation): 1–100 °C A 8,07131 B 1730,63 C 233,426;
//   99–374 °C A 8,14019 B 1810,94 C 244,485. Kiểm lại: 121 °C → 204 kPa tuyệt đối (≈ 1,03 bar dư),
//   134 °C → 302 kPa; khớp bảng hơi bão hoà trong 0,5 %.
// - Bào tử Geobacillus stearothermophilus (chỉ thị sinh học cho hấp hơi nước, ISO 11138-3):
//   D121 ≥ 1,5 phút, thường 1,5–2,5 phút; z ≈ 10 °C. Mô hình dùng D121 = 2,0 phút, quần thể 10⁶ bào tử.
// - F0: số phút tương đương ở 121,1 °C với z = 10 °C (dược điển, Ph. Eur. 5.1.5).
// - Khí còn trong buồng (minh hoạ, theo bảng cổ điển của Perkins 1969, "Principles and Methods of
//   Sterilization in Health Sciences"): ở 1,03 bar dư, đuổi hết khí 121 °C, đuổi 2/3 khí 115 °C,
//   đuổi 1/2 khí 112 °C, không đuổi khí 100 °C. Mô hình định luật Dalton: khí còn lại giữ áp riêng
//   phần (tỉ lệ khí × 1 atm), hơi nước chỉ còn phần áp suất còn lại, nên nóng kém hơn ở cùng áp suất.
// Các số ước tính, chưa xác minh với hãng: khối thép buồng (~20 kg, thành 3 mm), hiệu suất gia nhiệt
// 85 %, thời gian đuổi khí ở 100 °C (5 phút), hằng số xả áp (2 phút) và hằng số nguội có quạt (30 phút).

export const ATM = 101.325; // kPa

export const SX500 = {
  chamber: { d: 325, depth: 733, volumeL: 58, effectiveL: 50 },
  heaterW: 2000,
  efficiency: 0.85,
  waterL: 3.0,
  steelKg: 20,
  setRange: [105, 135],
  maxGaugeMPa: 0.25,
  gaugeMaxMPa: 0.4,
  unlockC: 80, // khoá nắp nhả khi buồng ≤ 80 °C (máy cho chỉnh 60–100 °C, mặc định của hãng 97 °C)
  doneC: 60,
  room: 25,
  purgeMin: 5,
  exhaustTauMin: 2,
  coolTauMin: 30,
};

export const SPORE = { name: "Geobacillus stearothermophilus", d121: 2.0, z: 10, n0: 1e6 };

/** Áp suất hơi nước bão hoà (kPa tuyệt đối) ở nhiệt độ T (°C), phương trình Antoine. */
export function psat(T) {
  const [A, B, C] = T < 100 ? [8.07131, 1730.63, 233.426] : [8.14019, 1810.94, 244.485];
  return 10 ** (A - B / (C + T)) * 0.133322;
}

/** Nhiệt độ sôi (°C) của nước ở áp suất tuyệt đối P (kPa): nghịch đảo của psat. */
export function tsat(P) {
  const mmHg = Math.max(1e-6, P) / 0.133322;
  const hi = 1810.94 / (8.14019 - Math.log10(mmHg)) - 244.485;
  if (hi >= 100) return hi;
  return 1730.63 / (8.07131 - Math.log10(mmHg)) - 233.426;
}

/** Áp suất dư (MPa) mà đồng hồ chỉ, từ áp suất tuyệt đối (kPa). */
export const gaugeMPa = (P) => Math.max(0, (P - ATM) / 1000);

/**
 * Nhiệt độ thật trong buồng khi còn khí (minh hoạ, Dalton): ở áp suất tuyệt đối P (kPa), phần khí
 * còn lại `air` (0–1, so với lượng khí ban đầu ở 1 atm, nhiệt độ phòng) giữ áp riêng phần air × airKPa(room).
 * air = 0 → hơi bão hoà tinh khiết; air = 1 → gần 100 °C dù đồng hồ chỉ 0,1 MPa.
 */
export function tempWithAir(P, air, room = 25) {
  return tsat(Math.max(1, P - air * airKPa(room)));
}

/** Áp riêng phần (kPa) của lượng khí ban đầu trong buồng: 1 atm trừ hơi nước ở nhiệt độ phòng. */
export const airKPa = (room = 25) => ATM - psat(room);

/** Giá trị D (phút) của bào tử ở nhiệt độ T: D(T) = D121 · 10^((121 − T)/z). */
export function dValue(T, spore = SPORE) {
  return spore.d121 * 10 ** ((121 - T) / spore.z);
}

/** Tốc độ chết (log/phút) ở nhiệt độ T: 1/D(T). Dưới 100 °C coi như bằng 0. */
export function killRate(T, spore = SPORE) {
  return T < 100 ? 0 : 1 / dValue(T, spore);
}

/** Tốc độ gây chết tương đương F0 (phút ở 121,1 °C mỗi phút) ở nhiệt độ T, z = 10 °C. */
export function lethality(T) {
  return T < 100 ? 0 : 10 ** ((T - 121.1) / 10);
}

/** Số phút cần kéo dài khi hấp dịch lỏng (bảng của hãng: 2 L +4, 5 L +8, 10 L +15), nội suy tuyến tính. */
export function liquidExtraMin(L) {
  const pts = [[0, 0], [2, 4], [5, 8], [10, 15]];
  if (L >= 10) return 15 + (L - 10) * 1.4;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if (L <= x1) return y0 + ((L - x0) * (y1 - y0)) / (x1 - x0);
  }
  return 15;
}

/**
 * Chai đậy kín (minh hoạ, vì sao hãng cấm): khí trong chai nóng lên ở thể tích không đổi cộng hơi nước bão hoà.
 * Trả về áp suất trong chai (kPa tuyệt đối) và chênh lệch với buồng (kPa) khi buồng ở áp suất chamberP.
 */
export function sealedBottle(T, chamberP, fillC = 25) {
  const air = (ATM - psat(fillC)) * ((T + 273.15) / (fillC + 273.15));
  const inside = air + psat(T);
  return { inside, diff: inside - chamberP };
}

/**
 * Mô phỏng một chu trình theo các pha của máy (manual mục 2-1): gia nhiệt (van xả mở, hơi đuổi khí),
 * giữ 100 °C đuổi khí, đóng van tăng nhiệt tăng áp, tiệt trùng, xả áp, hạ nhiệt (quạt), nhả khoá nắp, hoàn tất 60 °C.
 * opts: { temp (°C), holdMin, loadL (lít dịch), load (phần thể tích buồng bị chiếm, 0–1), purge (false = không đuổi khí),
 *         sealed (chai đậy kín), unlockC, step (s) }.
 * Trả về { samples, phases, total, opts }; mỗi mẫu: { t, phase, T, Tload, P, gauge, air, valve, heater, fan,
 *         locked, log, f0, tape, unlock, done }.
 */
export function simulate(opts = {}, m = SX500, spore = SPORE) {
  const o = {
    temp: Math.min(m.setRange[1], Math.max(m.setRange[0], Number(opts.temp ?? 121))),
    holdMin: Math.min(120, Math.max(0, Number(opts.holdMin ?? 20))),
    loadL: Math.max(0, Number(opts.loadL ?? 1.5)),
    load: Math.min(1, Math.max(0, Number(opts.load ?? 0.3))),
    purge: opts.purge !== false,
    sealed: Boolean(opts.sealed),
    unlockC: Math.min(100, Math.max(60, Number(opts.unlockC ?? m.unlockC))),
    step: opts.step ?? 2,
  };
  // Nhiệt dung toàn khối (kJ/K): nước trong buồng, thép buồng, dịch và thuỷ tinh của mẻ hấp.
  const C = m.waterL * 4.186 + m.steelKg * 0.5 + o.loadL * 4.186 + o.loadL * 0.6 * 0.84;
  const rate = ((m.heaterW / 1000) * m.efficiency) / C; // K/s
  // Dịch trong bình theo sau nhiệt độ buồng với hằng số thời gian khớp bảng kéo dài của hãng.
  const tauLoad = Math.max(10, (liquidExtraMin(o.loadL) * 60) / 3);
  // Đuổi khí: hơi sinh ra (kg/s) thay thể tích buồng; xếp quá 50 % buồng thì khí khó thoát hơn.
  const steamKgS = ((m.heaterW / 1000) * m.efficiency) / 2257;
  const chamberSteamKg = (m.chamber.volumeL / 1000) * 0.598 * (1 - o.load * 0.5);
  const tauPurge = (chamberSteamKg / steamKgS) * (1 + 4 * Math.max(0, o.load - 0.5));
  const Pset = psat(o.temp);
  const dt = o.step;

  let t = 0;
  let phase = "heat";
  let phaseAt = 0;
  let T = m.room;
  let Tload = m.room;
  let P = ATM;
  let air = 1;
  let log = 0;
  let f0 = 0;
  let tape = 0;
  let exhaustFrom = Pset;
  let coolFrom = 100;
  let unlockAt = null;
  const samples = [];
  const phases = [{ phase, t: 0 }];
  const go = (next) => {
    phase = next;
    phaseAt = t;
    phases.push({ phase, t });
  };
  const push = () => {
    const locked = phase !== "done" && (unlockAt === null || t < unlockAt);
    samples.push({
      t,
      phase,
      T,
      Tload,
      P,
      gauge: gaugeMPa(P),
      air,
      valve: phase === "heat" || phase === "purge" ? 1 : phase === "exhaust" ? 0.8 : phase === "cool" || phase === "done" ? 1 : 0,
      heater: phase === "heat" || phase === "purge" || phase === "pressurize" ? 1 : phase === "hold" ? 0.35 : 0,
      fan: phase === "exhaust" || phase === "cool" ? 1 : 0,
      locked,
      log,
      f0,
      tape: 1 - Math.exp(-tape / 3),
      unlock: unlockAt !== null && t >= unlockAt,
      done: phase === "done",
    });
  };
  push();
  for (let guard = 0; guard < 40000 && phase !== "done"; guard++) {
    t += dt;
    const age = t - phaseAt;
    if (phase === "heat") {
      T = Math.min(100, T + rate * dt);
      if (o.purge) {
        // Van xả mở: hơi sinh ra từ khoảng 90 °C đẩy khí ra bình xả.
        air *= Math.exp((-dt / tauPurge) * Math.min(1, Math.max(0, (T - 90) / 10)));
        P = ATM;
        if (T >= 100) go("purge");
      } else {
        // Không đuổi khí (minh hoạ): van đóng từ đầu, khí giữ nguyên áp riêng phần.
        P = Math.max(ATM, psat(T) + air * airKPa(m.room));
        if (P >= Pset) { P = Pset; T = tempWithAir(P, air, m.room); go("hold"); }
        else if (T >= 100) go("pressurize");
      }
    } else if (phase === "purge") {
      air *= Math.exp(-dt / tauPurge);
      if (age >= m.purgeMin * 60) go("pressurize");
    } else if (phase === "pressurize") {
      // Van đóng: năng lượng làm nước nóng thêm; áp suất = hơi bão hoà + khí còn lại.
      T = Math.min(o.temp + 20, T + rate * dt);
      P = Math.max(ATM, psat(T) + air * airKPa(m.room));
      if (P >= Pset) P = Pset;
      T = tempWithAir(P, air, m.room);
      if (P >= Pset) go("hold");
    } else if (phase === "hold") {
      P = Pset;
      T = tempWithAir(P, air, m.room);
      if (age >= o.holdMin * 60) {
        exhaustFrom = P;
        go("exhaust");
      }
    } else if (phase === "exhaust") {
      P = ATM + (exhaustFrom - ATM) * Math.exp(-age / (m.exhaustTauMin * 60));
      air *= Math.exp(-dt / 30); // khí còn lại theo hơi ra ngoài
      T = Math.min(T, tempWithAir(P, air, m.room));
      if (gaugeMPa(P) < 0.0005) {
        P = ATM;
        coolFrom = T;
        go("cool");
      }
    } else if (phase === "cool") {
      P = ATM;
      T = m.room + (coolFrom - m.room) * Math.exp(-age / (m.coolTauMin * 60));
      if (unlockAt === null && T <= o.unlockC) unlockAt = t;
      if (T <= m.doneC) go("done");
    }
    Tload += (T - Tload) * (1 - Math.exp(-dt / tauLoad));
    log += (killRate(Tload, spore) * dt) / 60;
    f0 += (lethality(Tload) * dt) / 60;
    if (air < 0.5 && T > 100) tape += (10 ** ((T - 121) / 10) * dt) / 60;
    push();
  }
  return { samples, phases, total: t, opts: o, unlockAt: unlockAt ?? t, holdAt: phases.find((p) => p.phase === "hold")?.t ?? 0 };
}

/** Trạng thái ở giây t (nội suy tuyến tính giữa hai mẫu). */
export function stateAt(sim, t) {
  const s = sim.samples;
  if (t <= 0) return s[0];
  if (t >= sim.total) return s[s.length - 1];
  const i = Math.min(s.length - 2, Math.floor(t / sim.opts.step));
  const a = s[i];
  const b = s[i + 1];
  const k = (t - a.t) / (b.t - a.t);
  const mix = (key) => a[key] + (b[key] - a[key]) * k;
  return { ...a, T: mix("T"), Tload: mix("Tload"), P: mix("P"), gauge: mix("gauge"), air: mix("air"), log: mix("log"), f0: mix("f0"), tape: mix("tape"), t };
}

/** Bào tử còn sống trên một chỉ thị sinh học 10⁶ sau số log đã giảm. */
export const survivors = (log, spore = SPORE) => spore.n0 * 10 ** -log;

/** Tên pha hiển thị (tiếng Việt, theo đèn "work monitor" trên bảng điều khiển). */
export const PHASE_NAME = {
  ready: "Sẵn sàng",
  heat: "Gia nhiệt · đuổi khí",
  purge: "Giữ 100 °C · đuổi khí",
  pressurize: "Tăng nhiệt, tăng áp",
  hold: "Tiệt trùng",
  exhaust: "Xả áp",
  cool: "Hạ nhiệt",
  done: "Hoàn tất",
};

export const fmtClock = (s) => {
  const m = Math.floor(Math.max(0, s) / 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
};
