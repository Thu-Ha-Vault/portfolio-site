// Theo dõi tiến độ một protocol. Mỗi bước chờ một thao tác: "rót chất X vào vật chứa Y"
// (expect: { substance, container }) hoặc một thao tác máy (expect: { action }, ví dụ "pcr-run").
// Làm bước sau trước bước đang chờ vẫn được ghi nhận, nhưng đánh dấu là sai thứ tự.

const LOOSE = new Set(['action', 'count', 'days', 'hours', 'n', 'expect', 'traits', 'genes', 'rcf', 'minutes', 'dilution', 'focus', 'mL', 'sampleMl', 'mode', 'enzMl', 'subMl', 'bufMl', 'addMl', 'preBufMl', 'prep', 'every', 'tubes']);
// Giá trị mảng (dãy ống) so theo nội dung; thao tác trên 'all' (cả giá ống) khớp với mọi dãy ống
const same = (a, b) => a === b || a === 'all' || (typeof b === 'object' && b !== null && JSON.stringify(a) === JSON.stringify(b));

export class ProtocolTracker {
  constructor(protocol = null) {
    this.set(protocol);
  }

  set(protocol) {
    this.protocol = protocol;
    this.status = protocol ? protocol.steps.map(() => 'todo') : [];
  }

  reset() {
    this.set(this.protocol);
  }

  // Chỉ số bước đang chờ, -1 khi đã xong hết
  get current() {
    return this.status.indexOf('todo');
  }

  get finished() {
    return Boolean(this.protocol) && this.current === -1;
  }

  state(i) {
    const s = this.status[i];
    if (s !== 'todo') return s;
    return i === this.current ? 'current' : 'todo';
  }

  record(substanceId, containerId) {
    return this.#match((e) => e.substance === substanceId && e.container === containerId);
  }

  // Thao tác có tham số (lô hạt, nhóm cây, lọ, giai đoạn…) phải khớp đúng tham số của bước.
  // Các tham số về số lượng hay cách làm (số hạt, số ngày, số giờ…) không cần khớp: làm khác đi thì kết quả tự khác.
  recordAction(action, params = {}) {
    return this.#match((e) => e.action === action && Object.entries(e).every(([k, v]) => LOOSE.has(k) || same(params[k], v)));
  }

  #match(fits) {
    if (!this.protocol || this.finished) return null;
    const cur = this.current;
    const i = this.protocol.steps.findIndex((s, k) => this.status[k] === 'todo' && fits(s.expect));
    if (i === -1) return { status: 'off', waiting: cur + 1 };
    const early = i !== cur;
    this.status[i] = early ? 'early' : 'done';
    return {
      status: early ? 'early' : 'done',
      step: i + 1,
      waiting: cur + 1,
      text: early ? this.protocol.steps[i].warnIfEarly ?? null : null,
      finished: this.finished,
    };
  }
}
