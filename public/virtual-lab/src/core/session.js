// Phiên làm việc: ghi lại protocol, seed và từng thao tác của người dùng theo thứ tự (nhật ký). Mở lại phiên thì đặt
// lại mọi lõi bằng đúng các seed cũ rồi chạy lại nhật ký, nên kết quả ngẫu nhiên (số hạt đậu, sai số pipet…) giống hệt
// lần trước. Lưu được vào localStorage và xuất/nhập file JSON. Không phụ thuộc DOM.

export const SESSION_FORMAT = 'virtual-lab-session';
export const SESSION_VERSION = 1;

// Băm chuỗi thành số 32 bit (FNV-1a) để mỗi lõi có seed riêng suy ra từ seed của phiên
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export class Session {
  constructor({ protocol = null, seed = Date.now(), start = {}, journal = [], savedAt = null } = {}) {
    this.protocol = protocol;
    this.seed = seed >>> 0;
    this.start = start;
    this.journal = journal;
    this.savedAt = savedAt;
  }

  // Seed của một lõi: cùng phiên, cùng tên thì luôn ra cùng số
  seedFor(name) {
    return hash(`${this.seed}:${name}`);
  }

  // kind: nhóm thao tác (pour, pea, fly, machine…); thao tác đặt trạng thái liên tục (khí hậu) thì gộp vào dòng trước
  record(kind, action, params = {}, { merge = false } = {}) {
    const entry = { k: kind, a: action, p: JSON.parse(JSON.stringify(params ?? {})) };
    const last = this.journal[this.journal.length - 1];
    if (merge && last && last.k === kind && last.a === action) this.journal[this.journal.length - 1] = entry;
    else this.journal.push(entry);
    return entry;
  }

  get length() {
    return this.journal.length;
  }

  // Chạy lại nhật ký qua hàm dispatch(kind, action, params); dừng ở dòng lỗi đầu tiên và báo số dòng
  replay(dispatch) {
    for (let i = 0; i < this.journal.length; i++) {
      const { k, a, p } = this.journal[i];
      try {
        dispatch(k, a, p);
      } catch (err) {
        return { ok: false, at: i, error: String(err?.message ?? err) };
      }
    }
    return { ok: true, at: this.journal.length };
  }

  toJSON() {
    return { format: SESSION_FORMAT, version: SESSION_VERSION, protocol: this.protocol, seed: this.seed, start: this.start, savedAt: this.savedAt, journal: this.journal };
  }

  stringify(savedAt = new Date().toISOString()) {
    this.savedAt = savedAt;
    return JSON.stringify(this.toJSON());
  }

  // Đọc phiên từ chuỗi JSON (file hoặc localStorage); sai định dạng thì báo lỗi rõ ràng
  static parse(text) {
    let data;
    try {
      data = typeof text === 'string' ? JSON.parse(text) : text;
    } catch {
      throw new Error('File không phải JSON.');
    }
    if (!data || data.format !== SESSION_FORMAT) throw new Error('File không phải phiên của Virtual Lab.');
    if (data.version > SESSION_VERSION) throw new Error(`Phiên được lưu bằng bản mới hơn (định dạng ${data.version}).`);
    if (!Array.isArray(data.journal) || !Number.isFinite(data.seed)) throw new Error('Phiên thiếu nhật ký hoặc seed.');
    const journal = data.journal.filter((e) => e && typeof e.k === 'string' && typeof e.a === 'string').map((e) => ({ k: e.k, a: e.a, p: e.p ?? {} }));
    return new Session({ protocol: data.protocol ?? null, seed: data.seed, start: data.start ?? {}, journal, savedAt: data.savedAt ?? null });
  }
}
