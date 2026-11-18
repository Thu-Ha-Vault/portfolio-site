// Lớp học không cần máy chủ: giáo viên xuất "gói bài tập" (protocol, seed, chế độ kiểm tra); học sinh mở gói, làm bài
// rồi xuất "bài nộp" (nhật ký phiên, tên, điểm tự chấm, mã băm); giáo viên mở bài nộp, app kiểm mã băm rồi chạy lại nhật
// ký với đúng seed để chấm lại và xem từng bước. Mã băm SHA-256 chỉ phát hiện file bị sửa tay; ai biết cách vẫn tính lại
// được mã băm, nên muốn chống gian lận thật sự cần máy chủ lưu bài. Không phụ thuộc DOM.

import { Session } from './session.js';

export const ASSIGNMENT_FORMAT = 'virtual-lab-assignment';
export const SUBMISSION_FORMAT = 'virtual-lab-submission';

// SHA-256 (FIPS 180-4) trên chuỗi UTF-8, trả về hex; viết thuần JS để chạy đồng bộ ở trình duyệt, Electron và Node
export function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const len = bytes.length;
  const padded = new Uint8Array(((len + 9 + 63) >> 6) << 6);
  padded.set(bytes);
  padded[len] = 0x80;
  const bits = len * 8;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, Math.floor(bits / 2 ** 32));
  dv.setUint32(padded.length - 4, bits >>> 0);
  const W = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) W[i] = dv.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
      const s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] += a; H[1] += b; H[2] += c; H[3] += d; H[4] += e; H[5] += f; H[6] += g; H[7] += h;
  }
  return [...H].map((x) => x.toString(16).padStart(8, '0')).join('');
}

// JSON với khoá sắp xếp, để cùng nội dung luôn ra cùng chuỗi (và cùng mã băm)
export function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
}

// Gói bài tập: protocol (đầy đủ, để mở được cả protocol giáo viên tự soạn), seed chung cho cả lớp, chế độ kiểm tra
export function makeAssignment({ protocol, seed, title = protocol.title, exam = true, note = '', createdAt = new Date().toISOString() }) {
  const body = { format: ASSIGNMENT_FORMAT, version: 1, title, note, exam, seed: seed >>> 0, protocol, createdAt };
  return { ...body, id: sha256(canonical(body)).slice(0, 12) };
}

// Bài nộp: nhật ký phiên và điểm tự chấm; mã băm phủ cả bài tập, tên học sinh, nhật ký và điểm
export function makeSubmission({ assignment, student, session, score, submittedAt = new Date().toISOString() }) {
  const body = { format: SUBMISSION_FORMAT, version: 1, assignment: { id: assignment.id, title: assignment.title, seed: assignment.seed, protocol: assignment.protocol }, student: String(student ?? '').trim(), session: session.toJSON(), score, submittedAt };
  return { ...body, hash: sha256(canonical(body)) };
}

// Đọc file bất kỳ của lớp học; trả về { kind: 'assignment' | 'submission', data, intact } hoặc ném lỗi rõ ràng
export function parseClassFile(text) {
  let data;
  try {
    data = typeof text === 'string' ? JSON.parse(text) : text;
  } catch {
    throw new Error('File không phải JSON.');
  }
  if (data?.format === ASSIGNMENT_FORMAT) {
    if (!data.protocol?.steps || !Number.isFinite(data.seed)) throw new Error('Gói bài tập thiếu protocol hoặc seed.');
    const { id, ...body } = data;
    return { kind: 'assignment', data, intact: sha256(canonical(body)).slice(0, 12) === id };
  }
  if (data?.format === SUBMISSION_FORMAT) {
    const { hash, ...body } = data;
    const session = Session.parse(data.session);
    return { kind: 'submission', data, session, intact: sha256(canonical(body)) === hash };
  }
  return null;
}
