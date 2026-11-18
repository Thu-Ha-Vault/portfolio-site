// Soạn protocol từ thao tác (giáo viên làm một lượt thí nghiệm, app ghi lại thành các bước) và kiểm tra protocol
// trước khi lưu; chấm điểm ở chế độ kiểm tra. Không phụ thuộc DOM.

// Nhật ký phiên (src/core/session.js) → các bước: rót chất thì so chất và vật chứa; thao tác máy thì so tên thao tác và
// tham số. Thao tác chỉnh khí hậu hay đổi cài đặt phôi cá không thành bước (ghi vào ghi chú để người soạn biết).
export function stepsFromJournal(journal, names = {}) {
  const steps = [];
  const skipped = [];
  for (const { k, a, p } of journal) {
    if (k === 'pour') steps.push({ text: `Cho ${names[p.substance] ?? p.substance} vào ${names[p.container] ?? p.container}.`, expect: { substance: p.substance, container: p.container, ...(p.tool ? { tool: p.tool } : {}), ...(p.volume ? { volume: p.volume } : {}) } });
    else if (k === 'pcr') steps.push({ text: `${names[a] ?? a}.`, expect: { action: a } });
    else if (['machine', 'pea', 'fly', 'zf', 'chem', 'ppe'].includes(k)) steps.push({ text: `${names[a] ?? a}${describe(p)}.`, expect: { action: a, ...p } });
    else skipped.push(k);
  }
  // Nhỏ buret liên tiếp gộp thành một bước
  const merged = steps.filter((s, i) => !(s.expect.action === 'titr-add' && steps[i + 1]?.expect.action === 'titr-add'));
  return { steps: merged, skipped };
}

function describe(p) {
  const parts = Object.entries(p ?? {}).filter(([, v]) => v !== null && v !== undefined && typeof v !== 'object').slice(0, 4).map(([k, v]) => `${k} ${v}`);
  return parts.length ? ` (${parts.join(', ')})` : '';
}

export function slug(text) {
  return `my-${String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'protocol'}`;
}

// Lỗi của protocol: thiếu tên, mục tiêu, bước rỗng, thao tác không có trong app, trùng id với protocol có sẵn
export function validateProtocol(p, { actions = new Set(), substances = new Set(), containers = new Set(), builtinIds = new Set() } = {}) {
  const errors = [];
  if (!p?.title?.trim()) errors.push('Chưa có tên protocol.');
  if (!p?.goal?.trim()) errors.push('Chưa có mục tiêu.');
  if (!Array.isArray(p?.steps) || !p.steps.length) errors.push('Chưa có bước nào.');
  if (p?.id && builtinIds.has(p.id)) errors.push(`Mã ${p.id} trùng với protocol có sẵn.`);
  (p?.steps ?? []).forEach((s, i) => {
    if (!s.text?.trim()) errors.push(`Bước ${i + 1} chưa có chữ.`);
    const e = s.expect ?? {};
    if (e.action) {
      if (actions.size && !actions.has(e.action)) errors.push(`Bước ${i + 1}: thao tác "${e.action}" không có trong app.`);
    } else if (!(substances.has(e.substance) && containers.has(e.container))) errors.push(`Bước ${i + 1}: cần một thao tác, hoặc một chất và một vật chứa có trong app.`);
  });
  return errors;
}

// Bật nhóm thao tác cho protocol tự soạn theo tiền tố của các thao tác trong bước (giống các khoá bc, ez… của protocol có sẵn)
export function groupKeysOf(steps) {
  const map = { tt: 'bc', wb: 'bc', bc: 'bc', ez: 'ez', mb: 'mb', mo: 'mo', pt: 'pt', ck: 'ck', ev: 'ev', fe: 'fe', uv: 'uv', cf: 'cf', hplc: 'hplc', mic: 'mic', qpcr: 'qpcr', nd: 'nd', vx: 'vx', pr: 'pr', ac: 'ac', ms: 'ms', bsc: 'bsc', inv: 'inv', hp: 'hp', bal: 'bal', fh: 'fh', em: 'em', pu: 'pu', exo: 'exo', st: 'st' };
  const keys = {};
  for (const s of steps) {
    const pre = (s.expect.action ?? '').split('-')[0];
    if (map[pre]) keys[map[pre]] = {};
  }
  return keys;
}

// Điểm ở chế độ kiểm tra (thang 10): phần bước làm xong, trừ bước sai thứ tự, thao tác ngoài protocol và cảnh báo
export function examScore({ steps = [], entries = [] }) {
  const total = steps.length || 1;
  const done = steps.filter((s) => s.state === 'done').length;
  const early = steps.filter((s) => s.state === 'early').length;
  const off = entries.filter((e) => e.step === 'ngoài protocol').length;
  const warnings = entries.reduce((n, e) => n + e.lines.filter(([l]) => /^(Chưa đúng|Nguy hiểm|Lưu ý|Nhiễm tạp|Nhiễm keratin|Sai thùng)$/.test(l)).length, 0);
  const base = (10 * (done + 0.5 * early)) / total;
  const minus = Math.min(2, 0.25 * off) + Math.min(3, 0.5 * warnings);
  const score = Math.max(0, Math.min(10, base - minus));
  return { score: Math.round(score * 10) / 10, done, early, off, warnings, total };
}
