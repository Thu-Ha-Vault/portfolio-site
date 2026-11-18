// Sinh lý cây ở khu trồng trọt: cây lớn theo độ ngày sinh trưởng (GDD), nước trong đất, sương giá, nắng nóng lúc ra
// hoa, bệnh phấn trắng và mốc xám theo độ ẩm và nhiệt độ. Ngưỡng của từng loài trong data/crops.json, mỗi số có nguồn
// trong trường "_src", chỗ chưa xác minh ở "_unverified". Không phụ thuộc DOM.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Độ ngày sinh trưởng của một ngày ở nhiệt độ trung bình T (°C·ngày): T − nhiệt độ nền, chặn ở nhiệt độ trần. */
export function gddOf(crop, T) {
  if (Number.isFinite(crop.tMax) && T >= crop.tMax) return 0;
  // Trần: loài có số đo thì dùng (hoa mõm chó 28 °C); không có thì lấy hết khoảng tối ưu thêm 6 °C (minh hoạ)
  const top = crop.tCeiling ?? (crop.tOpt ? crop.tOpt[1] + 6 : 30);
  return Math.max(0, Math.min(T, top) - crop.tBase);
}

/**
 * °C·ngày ứng với một "ngày điều kiện tốt" trong lịch sinh trưởng của data/pea.json, theo giai đoạn: GDD tới mọc,
 * tới ra hoa, tới hạt chín của loài chia cho số ngày tương ứng của lịch. Lịch ngày cũ giữ nguyên làm thang đo, còn
 * tốc độ lớn đổi theo nhiệt độ thật. growth: số "ngày lịch" cây đã đạt (không có thì tính cho giai đoạn tới ra hoa).
 */
export function refGdd(crop, pea, growth = pea.growth.emerge) {
  const g = pea.growth;
  if (growth < g.emerge && crop.gddEmerge) return crop.gddEmerge / g.emerge;
  if (growth < g.flower) return (crop.gddFlower - (crop.gddEmerge ?? 0)) / (g.flower - g.emerge);
  return (crop.gddSeed - crop.gddFlower) / (g.ripe - g.flower);
}

// Đất trong luống (minh hoạ): giữ tối đa 40 mm nước dùng được; mưa một ngày thêm 8 mm; một lần tưới 15 mm;
// dưới 25 % là khô hạn.
export const SOIL = { capacity: 40, start: 30, rainMm: 8, waterMm: 15, dryBelow: 0.25 };

/** Lượng nước cây dùng một ngày (mm): theo nhu cầu mỗi tuần của loài, tăng khi nóng và nắng (hệ số minh hoạ). */
export function waterUse(crop, state) {
  const light = clamp((state.light ?? 75) / 100, 0, 1) * ({ sun: 1, cloud: 0.6, rain: 0.3 }[state.weather] ?? 1);
  return ((crop.waterMmWeek ?? 25) / 7) * clamp(state.temp / 20, 0.3, 1.6) * (0.5 + 0.5 * light);
}

/** Một ngày có đủ điều kiện cho phấn trắng (mildew) và mốc xám (Botrytis) không. */
export function diseaseDay(crop, state) {
  const m = crop.mildew;
  const rain = state.weather === 'rain';
  let mildew = false;
  if (m) {
    mildew = state.humidity >= m.rhAbove && state.temp >= m.tempRange[0] && state.temp <= m.tempRange[1];
    if ((m.rainSuppresses || m.freeWaterSuppresses) && rain) mildew = false;
    const stop = m.stopsAboveC ?? m.inhibitedAboveC;
    if (Number.isFinite(stop) && state.temp > stop) mildew = false;
  }
  const b = crop.botrytis;
  const botrytis = Boolean(b) && state.humidity >= b.rhAbove && state.temp >= b.tempRange[0] && state.temp <= b.tempRange[1];
  return { mildew, botrytis };
}

/**
 * Đánh giá nhanh một trạng thái khí hậu cho bảng điều khiển: cây lớn nhanh bao nhiêu so với ngày điều kiện tốt,
 * và các nguy cơ (sương giá, nắng nóng lúc ra hoa, bệnh).
 */
export function dayOutlook(crop, state, pea) {
  const gdd = gddOf(crop, state.temp);
  const rate = gdd / refGdd(crop, pea); // tốc độ ở giai đoạn sinh dưỡng, để báo trên bảng
  const d = diseaseDay(crop, state);
  return {
    gdd,
    rate,
    frost: Number.isFinite(crop.tKill) && state.temp <= crop.tKill,
    heat: Number.isFinite(crop.heatAbortC) && state.temp >= crop.heatAbortC,
    ...d,
  };
}

// Hệ số giảm số quả (minh hoạ): phấn trắng làm lá mất diện tích quang hợp, mốc xám làm thối hoa và quả non,
// khô hạn lúc ra hoa làm rụng hoa.
export const LOSS = { mildew: 0.7, botrytis: 0.6, dry: 0.6 };

/** Trạng thái ruộng: nước trong đất và số ngày ngập. */
export class FieldSoil {
  constructor() {
    this.reset();
  }

  reset() {
    this.water = SOIL.start;
    this.wetDays = 0;
  }

  get fraction() {
    return this.water / SOIL.capacity;
  }

  /** Một ngày: mưa thêm nước, cây dùng nước. Trả về { dry, waterlogged }. */
  // state.irrigation: 'auto' (tưới nhỏ giọt tự động, mặc định của nhà kính) hoặc 'manual' (người dùng tự tưới)
  day(crop, state) {
    const rain = state.weather === 'rain' ? SOIL.rainMm : 0;
    this.water = this.water + rain - waterUse(crop, state);
    // Tưới nhỏ giọt tự động: đất xuống dưới một nửa thì bơm lại tới 80 % (minh hoạ)
    if (state.irrigation !== 'manual' && this.water < 0.5 * SOIL.capacity) this.water = 0.8 * SOIL.capacity;
    // Nước vượt sức giữ của đất: ngập tạm thời, thoát dần
    if (this.water > SOIL.capacity) {
      this.wetDays += 1;
      this.water = SOIL.capacity;
    } else this.wetDays = 0;
    this.water = Math.max(0, this.water);
    const tolerable = (crop.waterlogHoursTolerable ?? 36) / 24;
    return { dry: this.fraction < SOIL.dryBelow, waterlogged: this.wetDays > tolerable };
  }

  irrigate(mm = SOIL.waterMm) {
    const over = this.water + mm - SOIL.capacity;
    this.water = Math.min(SOIL.capacity, this.water + mm);
    if (over > 0) this.wetDays += 1;
    return { over: Math.max(0, over) };
  }
}
