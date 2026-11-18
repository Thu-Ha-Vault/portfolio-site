// Đồng hồ ảo dùng chung cho các thí nghiệm kéo dài nhiều ngày (cây trồng, ruồi giấm, phôi cá).
// Thời gian tính bằng ngày; tua nhanh bằng advance(). Mỗi lần tua, các mô phỏng đăng ký được gọi theo từng ngày
// để sự kiện trong ngày (ra hoa, tự thụ phấn) xảy ra đúng thứ tự.

export class VirtualClock {
  constructor(day = 0) {
    this.day = day;
    this.subscribers = [];
  }

  // fn(day) được gọi một lần cho mỗi ngày trôi qua, trả về danh sách sự kiện (có thể rỗng)
  subscribe(fn) {
    this.subscribers.push(fn);
  }

  advance(days) {
    const events = [];
    for (let i = 0; i < Math.max(0, Math.round(days)); i++) {
      this.day += 1;
      for (const fn of this.subscribers) events.push(...(fn(this.day) ?? []));
    }
    return events;
  }

  reset(day = 0) {
    this.day = day;
  }
}
