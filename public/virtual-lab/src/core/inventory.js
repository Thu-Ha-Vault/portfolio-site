// Kho đồ của cả phòng thí nghiệm: mỗi món có chỗ cất (bàn, hộp đá, tủ lạnh, tủ đông, tủ âm sâu, bình nitơ lỏng),
// thời gian đã để ở từng nhiệt độ, số lần đông – rã, và hoạt tính còn lại (0–1).
// Số liệu bảo quản và độ bền của từng món ở data/storage.json, mỗi số có nguồn hoặc ghi là minh hoạ.
// Không phụ thuộc DOM.
//
// Mô hình mất hoạt tính: bậc nhất theo thời gian, a ← a·exp(−k(T)·giờ). k(T) nội suy tuyến tính theo log k giữa các
// mốc nhiệt độ trong storage.json (giữa hai mốc coi như Arrhenius); dưới mốc thấp nhất k = 0.
// Đông – rã: món có "freezes": true bị đông khi cất ở nơi < 0 °C; mỗi lần rã (đưa từ nơi < 0 °C ra nơi ≥ 0 °C) mất
// một phần "thawLoss" hoạt tính, trừ lần rã đầu tiên.


/** k (1/giờ) ở nhiệt độ T từ bảng { "nhiệt độ": k }. */
export function rateAt(table = {}, T) {
  const pts = Object.entries(table).map(([t, k]) => [Number(t), Number(k)]).sort((a, b) => a[0] - b[0]);
  if (!pts.length || T <= pts[0][0]) return pts.length && T === pts[0][0] ? pts[0][1] : 0;
  for (let i = 1; i < pts.length; i++) {
    const [t0, k0] = pts[i - 1];
    const [t1, k1] = pts[i];
    if (T <= t1) {
      if (k0 <= 0) return (k1 * (T - t0)) / (t1 - t0); // từ 0 lên mốc đầu tiên có giá trị: nội suy tuyến tính
      const f = (T - t0) / (t1 - t0);
      return Math.exp(Math.log(k0) + f * (Math.log(k1) - Math.log(k0)));
    }
  }
  // Trên mốc cao nhất: ngoại suy theo hai mốc cuối (dừng ở 10 lần)
  const [ta, ka] = pts[pts.length - 2] ?? pts[0];
  const [tb, kb] = pts[pts.length - 1];
  if (ka <= 0 || tb === ta) return kb;
  return Math.min(kb * 10, Math.exp(Math.log(kb) + ((T - tb) / (tb - ta)) * (Math.log(kb) - Math.log(ka))));
}

/** Thời gian (giờ) để hoạt tính giảm còn một nửa ở nhiệt độ T. */
export const halfLife = (table, T) => {
  const k = rateAt(table, T);
  return k > 0 ? Math.log(2) / k : Infinity;
};

export class Inventory {
  /**
   * @param {{ places: Array<{id:string,name:string,temp:number}>, items: Object<string, object> }} storage nội dung data/storage.json
   */
  constructor(storage) {
    this.places = new Map(storage.places.map((p) => [p.id, p]));
    this.catalog = storage.items;
    this.reset();
  }

  /** Đặt lại: mọi món về chỗ cất mặc định, hoặc theo start { id: placeId }. */
  reset(start = {}) {
    this.hours = 0;
    this.state = new Map();
    for (const [id, it] of Object.entries(this.catalog)) {
      const place = start[id] ?? it.start ?? it.store;
      this.state.set(id, { place, activity: 1, thaws: 0, frozen: this.#freezesAt(it, place), out: 0 });
    }
  }

  item(id) {
    return this.catalog[id];
  }

  placeOf(id) {
    return this.state.get(id)?.place;
  }

  activity(id) {
    return this.state.get(id)?.activity ?? 1;
  }

  /** Các món đang ở một chỗ. */
  at(place) {
    return [...this.state].filter(([, s]) => s.place === place).map(([id]) => id);
  }

  #freezesAt(it, place) {
    return Boolean(it.freezes) && (this.places.get(place)?.temp ?? 20) < 0;
  }

  /** Chuyển một món tới chỗ khác. Trả về các sự kiện (rã đông, đông lại). */
  move(id, to) {
    const it = this.catalog[id];
    const s = this.state.get(id);
    if (!it || !s) return { ok: false, events: [{ type: 'warning', text: `Không có món "${id}" trong kho.` }] };
    if (!this.places.has(to)) return { ok: false, events: [{ type: 'warning', text: `Không có chỗ cất "${to}".` }] };
    const events = [];
    const was = s.frozen;
    s.place = to;
    s.frozen = this.#freezesAt(it, to);
    if (was && !s.frozen) {
      s.thaws += 1;
      // Lần rã đầu tiên để dùng không mất gì; mỗi lần rã sau một lần đông lại mới mất thawLoss
      if (s.thaws > 1) s.activity *= 1 - (it.thawLoss ?? 0);
      if (s.thaws > 1 && it.thawLoss) events.push({ type: 'warning', text: `${it.name}: rã đông lần ${s.thaws}. Mỗi lần đông – rã mất khoảng ${Math.round(it.thawLoss * 100)} % hoạt tính; nên chia nhỏ thành nhiều ống dùng một lần.` });
    }
    return { ok: true, events };
  }

  /** Thời gian trôi qua (giờ): mọi món mất hoạt tính theo nhiệt độ chỗ đang để. */
  wait(hours) {
    const h = Math.max(0, Number(hours) || 0);
    this.hours += h;
    for (const [id, s] of this.state) {
      const it = this.catalog[id];
      const T = this.places.get(s.place)?.temp ?? 20;
      const k = rateAt(it.decay, T);
      s.activity *= Math.exp(-k * h);
      if (T > (it.storeTemp ?? -20) + 5) s.out += h;
    }
    return { ok: true, hours: h };
  }

  /** Các món đang ở `place` chịu nhiệt độ T trong `hours` giờ (tủ hỏng, mất điện), thay cho nhiệt độ danh định của tủ. */
  expose(place, T, hours) {
    const h = Math.max(0, Number(hours) || 0);
    for (const [id, s] of this.state) {
      if (s.place !== place) continue;
      const it = this.catalog[id];
      s.activity *= Math.exp(-rateAt(it.decay, T) * h);
      if (T > (it.storeTemp ?? -20) + 5) s.out += h;
    }
  }

  /** Bảng trạng thái cho bảng điều khiển. */
  table() {
    return [...this.state].map(([id, s]) => ({ id, name: this.catalog[id].name, place: s.place, placeName: this.places.get(s.place)?.name ?? s.place, activity: s.activity, thaws: s.thaws, out: s.out }));
  }

  /** Hoạt tính các chất có trong danh sách id (dùng cho ống PCR). Món không có trong kho coi như 1. */
  activities(ids) {
    return Object.fromEntries(ids.map((id) => [id, this.state.has(id) ? this.activity(id) : 1]));
  }
}

