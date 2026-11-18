import { Notebook } from './notebook.js';
import { rng } from './random.js';

// Khu giải phẫu động vật (mở rộng bàn thí nghiệm): mổ giun đất, tôm sông, cá chép, ếch đồng theo các bài thực hành
// SGK Sinh học 7. Lõi theo dõi từng bước trên khay mổ: đặt mẫu, ghim, cắt (đường cắt, độ sâu), đổ nước, phanh mở,
// gỡ ống tiêu hoá, quan sát cơ quan (cần kính lúp với phần nhỏ), kiểm tra đủ cơ quan, dọn khay. Làm sai thì cơ quan
// bị hỏng hoặc bị che: đặt sai mặt cắt đứt chuỗi thần kinh, cắt sâu làm rách ruột hoặc vỡ túi mật, cắt lớp cơ bụng
// ếch đúng đường giữa làm đứt tĩnh mạch bụng. Dữ liệu ở data/dissection.json.

export const DIS_ACTIONS = {
  'dis-take': 'Lấy mẫu vật ra khay mổ',
  'dis-place': 'Đặt mẫu trên khay',
  'dis-pin': 'Ghim mẫu xuống khay',
  'dis-cut': 'Cắt mở thành cơ thể',
  'dis-water': 'Đổ nước ngập mẫu',
  'dis-open': 'Phanh và ghim hai mép',
  'dis-remove': 'Gỡ ống tiêu hoá',
  'dis-observe': 'Quan sát một cơ quan',
  'dis-check': 'Kiểm tra đủ cơ quan',
  'dis-clean': 'Dọn khay, khử trùng dụng cụ',
};

export class DissectLab {
  constructor(data) {
    this.data = data;
    this.reset();
  }

  reset(seed = 1) {
    this.random = rng(seed);
    this.notebook = new Notebook();
    this.sp = null;
    this.state = null;
  }

  get spec() { return this.sp ? this.data.specimens[this.sp] : null; }

  do(action, params = {}) {
    const fn = {
      'dis-take': () => this.take(params), 'dis-place': () => this.place(params), 'dis-pin': () => this.pin(params), 'dis-cut': () => this.cut(params),
      'dis-water': () => this.water(), 'dis-open': () => this.open(), 'dis-remove': () => this.remove(), 'dis-observe': () => this.observe(params),
      'dis-check': () => this.check(), 'dis-clean': () => this.clean(params),
    }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    if (action !== 'dis-take' && !this.sp) return { action, ok: false, events: [{ type: 'warning', text: 'Trên khay chưa có mẫu: lấy mẫu vật trước.' }] };
    return { action, ...fn() };
  }

  #note(action, result) {
    this.notebook.add({ day: '', experiment: `Mổ ${this.spec.name.toLowerCase()}`, action: DIS_ACTIONS[action], subject: this.spec.name, result });
  }

  take({ specimen = 'earthworm' }) {
    const S = this.data.specimens[specimen];
    if (!S) return { ok: false, events: [{ type: 'warning', text: `Không có mẫu "${specimen}".` }] };
    this.sp = specimen;
    // Giới tính của cá, ếch quyết định tuyến sinh dục nhìn thấy (ngẫu nhiên theo seed của phiên)
    this.state = { place: null, pins: 0, cut: null, water: false, open: false, removed: false, damaged: new Map(), obscured: null, seen: new Set(), male: this.random() < 0.5, clean: false };
    this.#note('dis-take', S.sci);
    return { ok: true, specimen, events: [{ type: 'machine', label: S.name, text: `${S.name} (${S.sci}) đặt vào khay mổ có đáy sáp. Bài thực hành: ${S.lesson}. ${this.data.ethics}` }, { type: 'effect', label: 'Cách mổ', text: S.how }] };
  }

  place({ side = 'dorsal' }) {
    const S = this.spec;
    const st = this.state;
    if (st.cut) return { ok: false, events: [{ type: 'warning', text: 'Mẫu đã cắt mở, không lật lại được.' }] };
    st.place = side;
    const ok = side === S.place;
    this.#note('dis-place', this.data.places[side]);
    return { ok, events: [{ type: ok ? 'machine' : 'warning', label: 'Đặt mẫu', text: `${S.name} ${this.data.places[side]}.${ok ? '' : ` Bài này cần đặt ${this.data.places[S.place]}.`}` }] };
  }

  pin({ n = null }) {
    const S = this.spec;
    const st = this.state;
    st.pins = n == null ? Math.max(S.pins, 2) : Number(n);
    const need = S.pins;
    const ok = st.pins >= need;
    this.#note('dis-pin', `${st.pins} đinh ghim`);
    return { ok, events: [{ type: ok ? 'machine' : 'warning', label: 'Ghim', text: need ? `${st.pins} đinh ghim giữ ${S.name.toLowerCase()} trên sáp (bài này cần ${need}).` : `${S.name} giữ bằng tay trên khay, không cần ghim trước khi mổ.` }] };
  }

  // Cắt mở thành cơ thể. line: 'mid' | 'side'; depth: 'shallow' | 'deep'
  cut({ line = 'mid', depth = 'shallow' }) {
    const S = this.spec;
    const st = this.state;
    if (!st.place) return { ok: false, events: [{ type: 'warning', text: 'Đặt mẫu lên khay đúng tư thế trước khi cắt.' }] };
    if (st.cut) return { ok: false, events: [{ type: 'warning', text: 'Đã cắt rồi.' }] };
    st.cut = { line, depth };
    const events = [];
    const harm = (ids, why) => ids.forEach((id) => st.damaged.set(id, why));
    if (st.place !== S.place) {
      harm(S.placeDamage, S.wrong.place);
      events.push({ type: 'warning', label: 'Đặt sai mặt', text: S.wrong.place });
    }
    if (depth === 'deep') {
      harm(S.deepDamage, S.wrong.deep);
      st.obscured = S.wrong.deep;
      events.push({ type: 'warning', label: 'Cắt sâu', text: S.wrong.deep });
    }
    if (!S.line.includes(line) && S.wrong.mid) {
      st.obscured = S.wrong.mid;
      events.push({ type: 'warning', label: 'Đường cắt', text: S.wrong.mid });
    }
    const ok = !events.length;
    if (ok) events.push({ type: 'machine', label: 'Cắt', text: `Đường cắt ${this.data.lines[line]}, ${this.data.depths[depth]}: thành cơ thể mở, nội quan còn nguyên.` });
    this.#note('dis-cut', `${this.data.lines[line]}, ${depth === 'deep' ? 'sâu' : 'nông'}`);
    return { ok, events };
  }

  water() {
    const S = this.spec;
    const st = this.state;
    st.water = true;
    // Nước rửa trôi đất tràn từ ruột rách; máu từ tĩnh mạch bụng thì vẫn rỉ ra
    if (st.obscured && st.obscured === S.wrong.deep && this.sp === 'earthworm') st.obscured = null;
    this.#note('dis-water', 'ngập nước');
    return { ok: true, events: [{ type: 'machine', label: 'Nước', text: S.water ? 'Nước ngập mẫu: nội quan nổi lên, tách khỏi nhau, các phần nhỏ dễ thấy hơn.' : 'Mẫu này không cần ngâm nước; nước chỉ dùng để rửa.' }] };
  }

  open() {
    const S = this.spec;
    const st = this.state;
    if (!st.cut) return { ok: false, events: [{ type: 'warning', text: 'Chưa cắt mở thành cơ thể.' }] };
    // Đặt đúng tư thế thì mở hoàn toàn. Đặt sai thì theo misplaced trong dữ liệu: 'closed' (ếch, chuột nằm sấp không mở
    // được bụng), 'partial' (cá không nằm nghiêng chỉ mở được một phần); mặc định vẫn mở được (giun, tôm nằm ngửa: chuỗi
    // thần kinh bụng đã đứt khi cắt)
    st.open = st.place === S.place ? true : ({ closed: false, partial: 'partial' }[S.misplaced] ?? true);
    this.#note('dis-open', st.open === true ? 'mở hoàn toàn' : st.open ? 'mở một phần' : 'không mở được');
    if (!st.open) return { ok: false, events: [{ type: 'warning', label: 'Không mở được', text: S.wrong.place }] };
    return { ok: st.open === true, events: [{ type: st.open === true ? 'machine' : 'warning', label: 'Phanh', text: st.open === true ? `Dùng kẹp và kim phanh hai mép, ghim nghiêng ra ngoài: khoang cơ thể của ${S.name.toLowerCase()} mở ra.` : 'Chỉ mở được một phần khoang bụng.' }] };
  }

  remove() {
    const S = this.spec;
    const st = this.state;
    if (!st.open) return { ok: false, events: [{ type: 'warning', text: 'Mở khoang cơ thể trước.' }] };
    st.removed = true;
    this.#note('dis-remove', S.remove);
    return { ok: true, events: [{ type: 'machine', label: 'Gỡ', text: `Gỡ ${S.remove.toLowerCase()} sang một bên: thấy các cơ quan nằm sát thành lưng hoặc mặt bụng.` }] };
  }

  // Cơ quan đang thấy được không, và vì sao
  visible(o, lens = false) {
    const st = this.state;
    const S = this.spec;
    if (o.layer === 0) return { ok: true };
    if (!st.open) return { ok: false, why: 'Chưa mở khoang cơ thể.' };
    if (st.open === 'partial' && o.layer > 0 && o.pos[1] < 0) return { ok: false, why: 'Khoang bụng mới mở một phần, chưa thấy phần sát lưng.' };
    if (o.layer === 2 && !st.removed) return { ok: false, why: `Nằm dưới lớp nội quan phía trên: gỡ ${S.remove.toLowerCase()} trước.` };
    if (o.layer === 1 && o.gut && st.removed) return { ok: false, why: 'Đã gỡ sang một bên.' };
    if (o.small && !lens) return { ok: false, why: 'Quá nhỏ để nhìn bằng mắt thường: dùng kính lúp.' };
    if (o.small && S.water && !st.water) return { ok: false, why: S.wrong.water };
    return { ok: true };
  }

  observe({ organ, lens = false }) {
    const S = this.spec;
    const st = this.state;
    const o = S.organs.find((x) => x.id === organ);
    if (!o) return { ok: false, events: [{ type: 'warning', text: `${S.name} không có cơ quan "${organ}" trong bài này.` }] };
    const v = this.visible(o, Boolean(lens));
    const name = this.organName(o);
    if (!v.ok) return { ok: false, organ, events: [{ type: 'warning', label: name, text: `Chưa thấy ${name.toLowerCase()}: ${v.why}` }] };
    const events = [];
    const dmg = st.damaged.get(o.id);
    if (dmg) events.push({ type: 'warning', label: `${name} bị hỏng`, text: dmg });
    else if (st.obscured && o.layer > 0) events.push({ type: 'warning', label: 'Bị che', text: st.obscured });
    const clear = !dmg && !(st.obscured && o.layer > 0);
    if (clear) st.seen.add(o.id);
    events.unshift({ type: 'machine', label: name, text: `${o.system}. ${this.organFn(o)}` });
    this.#note('dis-observe', `${name}${clear ? '' : dmg ? ' (hỏng)' : ' (bị che)'}`);
    return { ok: clear, organ, events };
  }

  organName(o) {
    if (!o.sexed) return o.name;
    return this.state.male ? 'Tinh hoàn' : 'Buồng trứng';
  }

  organFn(o) {
    if (!o.sexed) return o.fn;
    return `${this.state.male ? 'Mẫu này là con đực.' : 'Mẫu này là con cái.'} ${o.fn}`;
  }

  check() {
    const S = this.spec;
    const st = this.state;
    const rows = S.required.map((id) => {
      const o = S.organs.find((x) => x.id === id);
      return [this.organName(o), o.system, st.damaged.has(id) ? 'bị hỏng' : st.seen.has(id) ? 'đã thấy' : 'chưa thấy'];
    });
    const done = rows.filter((r) => r[2] === 'đã thấy').length;
    const ok = done === rows.length;
    this.#note('dis-check', `${done}/${rows.length}`);
    return {
      ok,
      done,
      total: rows.length,
      table: { head: ['Cơ quan', 'Hệ', 'Kết quả'], rows },
      events: [{ type: ok ? 'effect' : 'warning', label: 'Kiểm tra', text: ok ? `Đã quan sát đủ ${rows.length} cơ quan ${S.lesson.split(', ')[1]} yêu cầu.` : `Mới thấy rõ ${done}/${rows.length} cơ quan bài yêu cầu.${st.damaged.size ? ' Có cơ quan bị hỏng do thao tác sai, phải làm lại với mẫu khác.' : ''}` }],
    };
  }

  clean({ bin = 'bio' }) {
    const S = this.spec;
    const ok = bin === 'bio';
    this.#note('dis-clean', ok ? 'túi rác sinh học' : 'thùng rác thường');
    const name = S.name;
    this.sp = null;
    this.state = null;
    return { ok, events: [{ type: ok ? 'machine' : 'warning', label: 'Dọn', text: ok ? `Bỏ ${name.toLowerCase()} đã mổ vào túi rác sinh học, đinh ghim vào hộp đựng; rửa dao, kéo, kẹp bằng nước xà phòng rồi lau cồn 70 %, rửa tay.` : 'Mẫu động vật đã mổ không bỏ vào thùng rác thường: cho vào túi rác sinh học để xử lý riêng.' }] };
  }

  // Trạng thái cho cảnh 3D và hình chú thích
  figureData() {
    const S = this.spec;
    if (!S) return { specimen: null };
    const st = this.state;
    return {
      specimen: this.sp,
      place: st.place,
      pins: st.pins,
      cut: st.cut,
      water: st.water,
      open: st.open,
      removed: st.removed,
      male: st.male,
      obscured: Boolean(st.obscured),
      damaged: [...st.damaged.keys()],
      seen: [...st.seen],
    };
  }
}
