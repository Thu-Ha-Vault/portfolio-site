// Thao tác bằng tay (giai đoạn 7): rót theo thời gian giữ, nhỏ giọt đếm giọt, micropipet theo từng nấc, nạp ống vào rotor
// theo vị trí tự chọn. Không dùng Three.js, không đụng DOM. Mỗi thao tác trả về lượng thật và các sự kiện cho thẻ kết quả;
// lượng thật được ghi vào nhật ký phiên nên mở lại phiên ra đúng kết quả cũ.

export const HAND = {
  // Rót từ chai 100 mL: chai nghiêng trong khoảng 0,4 s đầu thì chưa chảy, sau đó khoảng 4 mL/s, mỗi lần rót lệch ±25 %
  // theo tay (minh hoạ: không có số đo; người dùng đọc vạch trên cốc để biết đã rót bao nhiêu)
  pour: { rate: 4, jitter: 0.25, ramp: 0.4 },
  // Ống nhỏ giọt chuẩn USP <1101> Medicine Dropper: mỗi giọt nước 45–55 mg, tức 20 giọt khoảng 1 mL
  drop: { mL: 0.05, rel: 0.1 },
  // Micropipet piston một kênh, sai số tối đa cho phép ở thể tích danh định theo ISO 8655-2:2002 Bảng 1
  // (sys: sai số hệ thống ±µL, rand: sai số ngẫu nhiên, độ lệch chuẩn µL); dải thể tích theo micropipet P20, P200, P1000
  pipettes: {
    P20: { name: 'P20 (2–20 µL)', min: 2, max: 20, sys: 0.2, rand: 0.1 },
    P200: { name: 'P200 (20–200 µL)', min: 20, max: 200, sys: 1.6, rand: 0.6 },
    P1000: { name: 'P1000 (100–1000 µL)', min: 100, max: 1000, sys: 8, rand: 3 },
  },
  // Lỗi thao tác (minh hoạ): ấn quá nấc 1 tới nấc 2 rồi mới hút thì hút thừa khoảng 5 %; nhả chỉ tới nấc 1, không đẩy tới
  // nấc 2, thì khoảng 3 % còn đọng trong tip
  overdraw: 0.05,
  residue: 0.03,
};

const r2 = (v) => Math.round(v * 100) / 100;
const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',');

// Thể tích (mL) chảy ra khi giữ nghiêng chai trong `seconds` giây; rng() trong [0, 1)
export function pourVolume(seconds, rng, o = HAND.pour) {
  const t = Math.max(0, seconds - o.ramp);
  return t * o.rate * (1 + (rng() * 2 - 1) * o.jitter);
}

// Thể tích (mL) của n giọt, mỗi giọt lệch ngẫu nhiên trong ±rel
export function dropsVolume(n, rng, o = HAND.drop) {
  let v = 0;
  for (let i = 0; i < n; i++) v += o.mL * (1 + (rng() * 2 - 1) * o.rel);
  return v;
}

// Số ngẫu nhiên phân phối chuẩn từ rng đều (Box–Muller)
function normal(rng) {
  const u = Math.max(1e-12, rng());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

// Micropipet: chỉnh thể tích, gắn tip, ấn nấc 1 hoặc nấc 2 khi hút, nhả tới nấc 1 hoặc nấc 2, thải tip.
// Đổi chất mà không thay tip thì tip mang theo chất cũ vào ống thuốc thử (nhiễm chéo).
export class Micropipette {
  constructor(model = 'P20', rng = Math.random) {
    this.rng = rng;
    this.select(model);
  }

  select(model) {
    this.model = HAND.pipettes[model] ? model : 'P20';
    this.spec = HAND.pipettes[this.model];
    this.volume = this.spec.max;
    this.tip = null; // { used: id chất đã hút bằng tip này hoặc null }
    this.loaded = 0;
    this.loadedId = null;
    return this;
  }

  // Đặt thể tích (µL); ngoài dải của micropipet thì không vặn được
  setVolume(uL) {
    const s = this.spec;
    if (!(uL >= s.min && uL <= s.max)) return { ok: false, events: [{ type: 'warning', label: 'Ngoài dải', text: `${s.name} chỉ chỉnh được ${s.min}–${s.max} µL; vặn quá giới hạn làm hỏng cơ cấu đo. Chọn micropipet khác.` }] };
    this.volume = uL;
    return { ok: true, events: [{ type: 'measure', text: `Đặt ${s.name.split(' ')[0]} ở ${fmt(uL, uL < 10 ? 1 : 0)} µL.` }] };
  }

  attachTip() {
    if (this.tip) return { ok: false, events: [{ type: 'warning', text: 'Đã có tip trên micropipet.' }] };
    this.tip = { used: null };
    return { ok: true, events: [{ type: 'measure', text: 'Gắn tip mới từ hộp tip.' }] };
  }

  ejectTip() {
    if (!this.tip) return { ok: false, events: [{ type: 'warning', text: 'Chưa có tip để thải.' }] };
    const left = this.loaded;
    this.tip = null;
    this.loaded = 0;
    this.loadedId = null;
    return { ok: true, events: [{ type: 'measure', text: left > 0 ? `Thải tip còn ${fmt(left)} µL chất lỏng.` : 'Thải tip vào hộp chất thải.' }] };
  }

  // Hút chất `id`. stop: nấc ấn xuống trước khi nhúng tip (1 là đúng, 2 là ấn quá)
  aspirate(id, stop = 1) {
    const events = [];
    if (!this.tip) return { ok: false, contaminated: false, events: [{ type: 'warning', label: 'Chưa gắn tip', text: 'Không hút khi chưa gắn tip: chất lỏng vào thân micropipet làm hỏng piston và nhiễm các lần hút sau.' }] };
    if (this.loaded > 0) return { ok: false, contaminated: false, events: [{ type: 'warning', text: 'Tip đang chứa chất lỏng: nhả hết trước khi hút tiếp.' }] };
    const contaminated = Boolean(this.tip.used && this.tip.used !== id);
    if (contaminated) events.push({ type: 'warning', label: 'Nhiễm chéo', text: 'Dùng lại tip đã hút chất khác: tip mang chất cũ vào ống thuốc thử. Mỗi chất, mỗi mẫu dùng một tip mới.' });
    const s = this.spec;
    // Sai số theo ISO 8655-2 ở thể tích danh định, quy theo tỉ lệ thể tích đặt
    const k = this.volume / s.max;
    let v = this.volume + (this.rng() * 2 - 1) * s.sys * k + normal(this.rng) * s.rand * k;
    if (stop === 2) {
      v *= 1 + HAND.overdraw;
      events.push({ type: 'warning', label: 'Ấn quá nấc', text: `Ấn tới nấc 2 rồi mới hút: hút thừa khoảng ${Math.round(HAND.overdraw * 100)} %. Khi hút chỉ ấn tới nấc 1.` });
    }
    this.loaded = Math.max(0, v);
    this.loadedId = id;
    this.tip.used = id;
    events.push({ type: 'measure', text: `Hút khoảng ${fmt(this.loaded, this.loaded < 10 ? 2 : 1)} µL.` });
    return { ok: true, contaminated, volume: this.loaded, events };
  }

  // Nhả vào ống đích. stop: nấc cuối cùng ấn tới (2 là đúng: đẩy hết giọt cuối)
  dispense(stop = 2) {
    if (!this.tip || this.loaded <= 0) return { ok: false, volume: 0, events: [{ type: 'warning', text: 'Tip chưa có chất lỏng để nhả.' }] };
    const events = [];
    let out = this.loaded;
    if (stop === 1) {
      out = this.loaded * (1 - HAND.residue);
      events.push({ type: 'warning', label: 'Chưa nhả hết', text: `Chỉ nhả tới nấc 1: khoảng ${Math.round(HAND.residue * 100)} % còn đọng trong tip. Ấn tiếp tới nấc 2 để đẩy hết.` });
    }
    const id = this.loadedId;
    this.loaded = 0;
    this.loadedId = null;
    events.push({ type: 'measure', text: `Nhả ${fmt(out, out < 10 ? 2 : 1)} µL vào ống.` });
    return { ok: true, id, volume: r2(out), events };
  }
}
