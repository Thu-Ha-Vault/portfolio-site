// Chuẩn độ acid – base bằng buret, chạy trên lõi hoá học định lượng (LabEngine). Không phụ thuộc DOM.
// Buret 25 mL cấp A (ISO 385): đọc vạch chia 0,1 mL ước lượng tới ±0,02 mL; một giọt khoảng 0,05 mL, cỡ giọt lệch ±10 %.
// Kết quả so với giá trị thật mà mô phỏng biết: thể tích tương đương thật, sai số do pipet, do đọc buret, do nhỏ quá điểm cuối.

const READ = 0.02; // mL, sai số đọc buret
const DROP = 0.05; // mL mỗi giọt

export const TITRATION_ACTIONS = {
  'titr-fill': 'Nạp buret',
  'titr-add': 'Nhỏ từ buret',
  'titr-end': 'Đọc buret ở điểm cuối',
};

export class Titration {
  constructor(engine, { flask = 'flask', titrant = 'NaOH01', analyte = 'HClx', capacity = 25 } = {}) {
    this.engine = engine;
    this.flask = flask;
    this.titrant = titrant;
    this.analyte = analyte;
    this.capacity = capacity;
    this.reset();
  }

  reset() {
    this.filled = false;
    this.delivered = 0; // mL thật đã nhỏ
    this.points = [];
    this.pinkAt = null;
    this.n0 = null; // mol acid trong bình lúc bắt đầu
  }

  get left() {
    return Math.max(0, this.capacity - this.delivered);
  }

  fill() {
    this.reset();
    this.filled = true;
    const sub = this.engine.substances.get(this.titrant);
    return {
      ok: true,
      events: [
        { type: 'machine', label: 'Buret', text: `Tráng buret bằng ${sub.label ?? sub.formula}, nạp đầy rồi xả bọt khí ở đầu khoá, chỉnh mặt khum về vạch 0,00 mL.` },
        { type: 'effect', text: 'Tráng buret bằng chính dung dịch chuẩn để nước còn bám thành không làm loãng dung dịch. Đọc vạch ở đáy mặt khum, mắt ngang vạch.' },
      ],
    };
  }

  // Nhỏ `volume` mL (0 = một giọt). Trả về thẻ kết quả khi chất chỉ thị đổi màu.
  add(volume) {
    if (!this.filled) return { events: [{ type: 'warning', text: 'Buret chưa có dung dịch chuẩn: nạp buret trước.' }] };
    const box = this.engine.containers.get(this.flask);
    if (this.n0 === null) {
      this.n0 = box.amounts.get(this.analyte) ?? 0;
      this.points.push([0, this.engine.pH(this.flask)]);
    }
    const want = volume || DROP;
    const real = Math.min(this.left, volume ? want : want * (1 + (this.engine.random() * 2 - 1) * 0.1));
    if (real <= 0) return { events: [{ type: 'warning', text: 'Buret đã hết dung dịch.' }] };
    const res = this.engine.pour(this.titrant, this.flask, { tool: 'none', volume: real });
    this.delivered += real;
    const pH = this.engine.pH(this.flask);
    this.points.push([this.delivered, pH]);
    const turned = res.events.find((e) => e.type === 'indicator');
    const events = [];
    if (turned && this.pinkAt === null && pH >= 8.2) {
      this.pinkAt = this.delivered;
      events.push({ type: 'indicator', text: `Ở khoảng ${this.delivered.toFixed(2).replace('.', ',')} mL dung dịch chuyển hồng nhạt. Lắc đều: màu bền khoảng 30 giây là tới điểm cuối, dừng nhỏ và đọc buret.` });
    }
    return { events, pH, delivered: this.delivered, quiet: !events.length };
  }

  end() {
    if (!this.filled || this.delivered <= 0) return { events: [{ type: 'warning', text: 'Chưa nhỏ dung dịch chuẩn nào.' }] };
    const reading = Math.max(0, this.delivered + (this.engine.random() * 2 - 1) * READ);
    const tit = this.engine.substances.get(this.titrant);
    const C = this.engine.molarity(tit);
    const ana = this.engine.substances.get(this.analyte);
    const trueC = this.engine.molarity(ana);
    const vEq = this.n0 ? (this.n0 / C) * 1000 : null; // thể tích tương đương thật
    const V0 = 10; // mL acid lấy theo protocol
    const calc = (C * reading) / V0;
    const err = ((calc - trueC) / trueC) * 100;
    const box = this.engine.containers.get(this.flask);
    const hasInd = [...box.amounts.keys()].some((id) => this.engine.substances.get(id).indicator);
    const pH = this.engine.pH(this.flask);
    const fmt = (v, d = 2) => v.toFixed(d).replace('.', ',');
    const events = [
      { type: 'machine', label: 'Đọc buret', text: `${fmt(reading)} mL NaOH ${fmt(C, 3)} M.` },
      { type: 'machine', label: 'Tính', text: `C(HCl) = C(NaOH) × V(NaOH) / V(HCl) = ${fmt(C, 3)} × ${fmt(reading)} / ${V0} = ${fmt(calc, 4)} M.` },
      { type: Math.abs(err) <= 1 ? 'effect' : 'warning', label: 'So với thật', text: `Nồng độ thật ${fmt(trueC, 4)} M, sai số ${err >= 0 ? '+' : ''}${fmt(err, 1)} %.${vEq ? ` Điểm tương đương thật ở ${fmt(vEq)} mL.` : ''}` },
    ];
    if (!hasInd) events.push({ type: 'warning', text: 'Bình không có chất chỉ thị: không thấy được điểm cuối bằng mắt.' });
    else if (vEq && this.delivered - vEq > 0.1) events.push({ type: 'warning', text: `Nhỏ quá điểm tương đương ${fmt(this.delivered - vEq)} mL (khoảng ${Math.round((this.delivered - vEq) / DROP)} giọt): dung dịch hồng đậm (pH ${fmt(pH, 1)}). Gần điểm cuối nên nhỏ từng giọt và lắc đều.` });
    else if (vEq && vEq - this.delivered > 0.05) events.push({ type: 'warning', text: `Dừng trước điểm tương đương ${fmt(vEq - this.delivered)} mL: acid chưa bị trung hoà hết.` });
    if (vEq && Math.abs(this.n0 / 1e-3 - trueC * V0) / (trueC * V0) > 0.005) events.push({ type: 'info', text: `Lượng acid trong bình lệch ${fmt(((this.n0 * 1000) / (trueC * V0) - 1) * 100, 1)} % so với 10 mL đúng: do dụng cụ lấy acid (pipet bầu sai ±0,2 %, ống đong ±2 %, rót trực tiếp ±20 %).` });
    return { ok: true, events, points: this.points, reading, calc, trueC, err, vEq };
  }
}
