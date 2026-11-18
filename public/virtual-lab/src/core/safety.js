// An toàn hoá chất: nhãn GHS, đồ bảo hộ cần có khi thao tác, chất cất chung tủ có tương kỵ không.
// Số liệu trong data/safety.json, lấy theo SDS của hãng (Merck, Sigma, Fisher) và CLP; chỗ chưa xác minh ghi ở trường
// "basis". Không phụ thuộc DOM.

export const PPE = { coat: 'áo blouse', gloves: 'găng nitrile', glasses: 'kính bảo hộ', goggles: 'kính chống bắn hoá chất' };
export const SAFETY_ACTIONS = { 'ppe-wear': 'Đồ bảo hộ' };

// Lời giải thích ngắn của các câu cảnh báo H (GHS)
const H_TEXT = {
  H225: 'chất lỏng và hơi rất dễ cháy',
  H228: 'chất rắn dễ cháy',
  H261: 'gặp nước sinh khí dễ cháy',
  H271: 'có thể gây cháy hoặc nổ, chất oxi hoá mạnh',
  H272: 'chất oxi hoá, làm cháy mạnh thêm',
  H290: 'ăn mòn kim loại',
  H302: 'độc khi nuốt',
  H312: 'độc khi tiếp xúc với da',
  H314: 'gây bỏng da nặng và tổn thương mắt',
  H315: 'kích ứng da',
  H318: 'gây tổn thương mắt nghiêm trọng',
  H319: 'gây kích ứng mắt nghiêm trọng',
  H330: 'gây chết nếu hít phải',
  H332: 'độc khi hít phải',
  H335: 'kích ứng đường hô hấp',
  H341: 'nghi ngờ gây đột biến gen',
  H350: 'có thể gây ung thư',
  H360: 'có thể gây hại khả năng sinh sản hoặc thai nhi',
  H360D: 'có thể gây hại thai nhi',
  H360Df: 'có thể gây hại thai nhi, nghi ngờ giảm khả năng sinh sản',
  H362: 'có thể gây hại trẻ bú mẹ',
  H372: 'gây tổn thương cơ quan khi tiếp xúc lâu hoặc lặp lại',
  H373: 'có thể gây tổn thương cơ quan khi tiếp xúc lâu dài',
  H400: 'rất độc cho sinh vật thuỷ sinh',
  H410: 'rất độc với sinh vật thuỷ sinh, ảnh hưởng lâu dài',
  H412: 'có hại cho sinh vật thuỷ sinh, ảnh hưởng lâu dài',
  EUH032: 'gặp acid giải phóng khí rất độc',
};
const GHS_TEXT = { GHS01: 'nổ', GHS02: 'dễ cháy', GHS03: 'oxi hoá', GHS04: 'khí nén', GHS05: 'ăn mòn', GHS06: 'độc cấp tính', GHS07: 'có hại', GHS08: 'nguy hại sức khoẻ', GHS09: 'môi trường' };

export class Safety {
  constructor(data) {
    this.data = data;
    this.reset();
  }

  // Mặc định mặc đủ áo, găng, kính chống bắn: cởi bớt để xem cảnh báo
  reset() {
    this.worn = new Set(['coat', 'gloves', 'goggles']);
  }

  do(action, params = {}) {
    if (action !== 'ppe-wear') throw new Error(`Không có thao tác "${action}"`);
    return { action, ...this.wear(params) };
  }

  wear({ item, on = 'yes' }) {
    if (!PPE[item]) return { ok: false, events: [{ type: 'warning', text: 'Không có đồ bảo hộ này.' }] };
    const v = on === true || on === 'yes';
    if (v) this.worn.add(item);
    else this.worn.delete(item);
    return { ok: true, events: [{ type: 'machine', label: 'Đồ bảo hộ', text: `${v ? 'Mặc' : 'Bỏ'} ${PPE[item]}. Đang mặc: ${this.wornText()}.` }] };
  }

  wornText() {
    return [...this.worn].map((k) => PPE[k]).join(', ') || 'không có gì';
  }

  // Thông tin GHS của chất; concentrated: dùng mục "concentrated" (ví dụ HNO₃ đặc) nếu có
  info(id, concentrated = false) {
    const s = this.data.substances[id] ?? null;
    return s && concentrated && s.concentrated ? { ...s, ...s.concentrated } : s;
  }

  /** Nhãn GHS ngắn cho chip hoặc chai: "Nguy hiểm · ăn mòn, độc cấp tính". */
  label(id, concentrated = false) {
    const s = this.info(id, concentrated);
    if (!s || !s.ghs?.length) return '';
    return `${s.signal === 'Danger' ? 'Nguy hiểm' : 'Cảnh báo'} · ${s.ghs.map((g) => GHS_TEXT[g] ?? g).join(', ')}`;
  }

  /** Đồ bảo hộ còn thiếu khi thao tác với chất id. Kính chống bắn dùng thay được kính bảo hộ. */
  missing(id, { extra = [], concentrated = false } = {}) {
    const need = new Set([...(this.info(id, concentrated)?.ppe ?? []), ...extra]);
    return [...need].filter((k) => !(this.worn.has(k) || (k === 'glasses' && this.worn.has('goggles'))));
  }

  /** Cảnh báo cho thẻ kết quả khi rót hoặc thao tác với chất id mà thiếu đồ bảo hộ. */
  warnings(id, name = id, opts = {}) {
    const s = this.info(id, opts.concentrated);
    const miss = this.missing(id, opts);
    if (!s || !miss.length) return [];
    const h = (s.h ?? []).filter((c) => H_TEXT[c]).map((c) => `${c} ${H_TEXT[c]}`);
    return [{ type: 'warning', label: 'Thiếu đồ bảo hộ', text: `Đang thao tác với ${name}${s.signal ? ` (${this.label(id, opts.concentrated).toLowerCase()})` : ''} mà chưa có ${miss.map((k) => PPE[k]).join(', ')}.${h.length ? ` Theo SDS: ${h.join('; ')}.` : ''}` }];
  }

  /** Các cặp chất cất chung một tủ mà tương kỵ theo nhóm bảo quản. */
  cabinetConflicts(substances) {
    const pairs = new Set(this.data.incompatible.map(([a, b]) => [a, b].sort().join('|')));
    const out = [];
    const byCab = new Map();
    for (const s of substances.filter((x) => x.cabinet)) {
      if (!byCab.has(s.cabinet)) byCab.set(s.cabinet, []);
      byCab.get(s.cabinet).push(s.id);
    }
    for (const [cab, ids] of byCab) {
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const a = this.info(ids[i])?.group;
          const b = this.info(ids[j])?.group;
          if (a && b && a !== b && pairs.has([a, b].sort().join('|'))) out.push({ cabinet: cab, a: ids[i], b: ids[j] });
        }
      }
    }
    return out;
  }
}
