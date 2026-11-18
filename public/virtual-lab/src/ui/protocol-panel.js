import { esc, chem, subName } from './format.js';

// Văn bản có công thức hoá học (mmol CuSO4…): chữ số sau ký hiệu nguyên tố thành chỉ số dưới, giữ số lượng
const chemText = (t) => esc(t).replace(/([A-Za-z)])(\d+)/g, '$1<sub>$2</sub>');
import { gelImage } from './gel-image.js';

// Nửa phải màn hình: chọn protocol, danh sách bước, và kết quả của từng thao tác (mới nhất ở trên).

const KIND = {
  reaction: { chip: 'Phản ứng', cls: 'react', label: null },
  effect: { chip: 'Tác dụng', cls: 'effect', label: 'Tác dụng' },
  indicator: { chip: 'Chỉ thị', cls: 'accent', label: 'Chỉ thị' },
  warning: { chip: 'Lưu ý', cls: 'warn', label: 'Lưu ý' },
  none: { chip: 'Không phản ứng', cls: 'muted', label: 'Quan sát' },
  info: { chip: 'Quan sát', cls: 'muted', label: 'Quan sát' },
  measure: { chip: 'Lượng', cls: 'muted', label: 'Lượng lấy' },
  stage: { chip: 'Sinh trưởng', cls: 'muted', label: 'Giai đoạn' },
  machine: { chip: 'Kết quả máy', cls: 'accent', label: 'Kết quả' },
};

// groups: [{ id, title, actions: { actionId: tên } }] — các nhóm thao tác máy hiện dưới danh sách bước
export function createProtocolPanel(root, { protocols, groups, onSelect, onReset, onGoto, onDemo, onAction, onSave, onOpen, onReport, onExam, onSubmit, onAssign, onHandIn }) {
  const actions = Object.assign({}, ...groups.map((g) => g.actions));
  root.innerHTML = `
    <div class="panel-head">
      <div class="panel-title">
        <label class="eyebrow" for="protocol-select">Protocol</label>
        <select id="protocol-select">
          ${protocols.map((p) => `<option value="${esc(p.id)}">${p.id.startsWith('my-') ? 'Của tôi: ' : ''}${esc(p.title)}</option>`).join('')}
          <option value="">Tự do, không theo protocol</option>
        </select>
      </div>
      <div class="panel-actions">
        <button type="button" class="btn" id="btn-goto">Đến bàn thí nghiệm</button>
        <button type="button" class="btn btn-ghost" id="btn-reset">Làm lại</button>
      </div>
      <div class="session-bar" role="group" aria-label="Phiên làm việc">
        <span class="session-state" id="session-state" aria-live="polite"></span>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-save">Lưu file phiên</button>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-open">Mở file phiên</button>
        <input type="file" id="session-file" accept=".json,application/json" hidden>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-report">Xuất báo cáo</button>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-exam" aria-pressed="false">Chế độ kiểm tra</button>
        <button type="button" class="btn btn-sm" id="btn-submit" hidden>Nộp bài</button>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-assign" title="Giáo viên: xuất protocol đang chọn thành gói bài tập cho cả lớp">Xuất bài tập</button>
      </div>
      <div class="class-bar" id="class-bar" role="group" aria-label="Bài tập đang làm" hidden>
        <span class="class-title" id="class-title"></span>
        <label class="sr-only" for="student-name">Tên học sinh</label>
        <input type="text" id="student-name" placeholder="Họ tên học sinh" autocomplete="name">
        <button type="button" class="btn btn-sm" id="btn-handin">Xuất bài nộp</button>
      </div>
    </div>
    <div class="panel-body">
      <section class="protocol" aria-labelledby="protocol-goal-title">
        <h2 class="section-title" id="protocol-goal-title"><span id="protocol-field"></span></h2>
        <p class="protocol-goal" id="protocol-goal"></p>
        <ol class="steps" id="steps"></ol>
      </section>
      <section class="editor-wrap" id="editor-root" aria-label="Soạn protocol"></section>
      ${groups
        .filter((g) => !g.custom)
        .map((g) => `
      <section class="machines" data-group="${esc(g.id)}" aria-labelledby="machines-${esc(g.id)}">
        <h2 class="section-title" id="machines-${esc(g.id)}">${esc(g.title)}</h2>
        <div class="machine-actions">
          ${Object.entries(g.actions).map(([id, name], i) => `<button type="button" class="btn btn-ghost" data-action="${esc(id)}"><span class="machine-no">${i + 1}</span>${esc(name)}</button>`).join('')}
        </div>
      </section>`)
        .join('')}
      ${groups.filter((g) => g.custom).map((g) => `<section class="tools" data-group="${esc(g.id)}" aria-labelledby="${esc(g.id)}-title"></section>`).join('')}
      <section class="results" aria-labelledby="results-title">
        <div class="results-head">
          <h2 class="section-title" id="results-title">Kết quả từng bước</h2>
          <span class="count" id="log-count">0</span>
        </div>
        <p class="empty" id="log-empty">Chưa có thao tác nào. Kéo một chai trên bàn thí nghiệm rồi thả vào cốc hoặc ống PCR: kết quả, phương trình và tác dụng của từng chất sẽ hiện ở đây.</p>
        <ol class="log" id="log" aria-live="polite" aria-relevant="additions"></ol>
      </section>
    </div>`;

  const $ = (id) => root.querySelector(`#${id}`);
  const select = $('protocol-select');
  const field = $('protocol-field');
  const goal = $('protocol-goal');
  const steps = $('steps');
  const log = $('log');
  const count = $('log-count');
  const empty = $('log-empty');
  let n = 0;
  let tracker = null;
  // Chế độ kiểm tra: ẩn phần giải thích, tác dụng và nút làm mẫu; chấm điểm khi nộp bài
  let exam = false;
  const shown = (events) => (exam ? events.filter((e) => e.type !== 'effect').map((e) => (e.type === 'reaction' ? { ...e, reaction: { ...e.reaction, explain: null } } : e)) : events);
  // Thẻ kết quả dạng chữ, dùng cho báo cáo Markdown (src/core/report.js)
  let entries = [];
  const plain = (html) => String(html ?? '').replace(/<sub>(.*?)<\/sub>/g, '$1').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const textRows = (events) => events.flatMap((e) => (e.type === 'reaction'
    ? [['Hiện tượng', e.reaction.observation], ['Phương trình', e.reaction.equation], ...(e.amounts ? [['Lượng', e.amounts]] : []), ...(e.reaction.explain ? [['Giải thích', e.reaction.explain]] : [])]
    : [[e.label ?? KIND[e.type].label, e.text]]));
  const stepText = (prog) => (!prog ? '' : prog.status === 'done' ? `bước ${prog.step}` : prog.status === 'early' ? `bước ${prog.step}, sai thứ tự` : 'ngoài protocol');
  function tableData(t) {
    if (!t) return null;
    if (t.head) return { head: t.head, rows: t.rows.map((r) => r.map(String)) };
    const exp = t.expected;
    return {
      head: [`Kiểu hình (${t.subject})`, 'Quan sát', ...(exp ? ['Kỳ vọng'] : []), 'Tỉ lệ'],
      rows: t.classes.map((c, i) => [c.label, String(c.n), ...(exp ? [exp[i] == null ? '—' : exp[i].toFixed(1).replace('.', ',')] : []), `${((100 * c.n) / Math.max(1, t.total)).toFixed(1).replace('.', ',')} %`]),
    };
  }

  select.addEventListener('change', () => onSelect(select.value || null));
  $('btn-reset').addEventListener('click', () => onReset());
  $('btn-goto').addEventListener('click', () => onGoto());
  $('btn-save').addEventListener('click', () => onSave?.());
  $('btn-report').addEventListener('click', () => onReport?.());
  $('btn-exam').addEventListener('click', () => {
    exam = !exam;
    $('btn-exam').setAttribute('aria-pressed', String(exam));
    $('btn-submit').hidden = !exam;
    onExam?.(exam);
    if (tracker) renderSteps(tracker);
  });
  $('btn-submit').addEventListener('click', () => onSubmit?.());
  $('btn-assign').addEventListener('click', () => onAssign?.());
  $('btn-handin').addEventListener('click', () => onHandIn?.($('student-name').value));
  // Bật hoặc tắt chế độ kiểm tra từ ngoài (mở gói bài tập)
  function setExam(on) {
    if (exam === on) return;
    exam = on;
    $('btn-exam').setAttribute('aria-pressed', String(exam));
    $('btn-submit').hidden = !exam;
    if (tracker) renderSteps(tracker);
  }
  function classBar(title) {
    $('class-bar').hidden = !title;
    $('class-title').textContent = title ? `Bài tập: ${title}` : '';
  }
  $('btn-open').addEventListener('click', () => $('session-file').click());
  $('session-file').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) file.text().then((text) => onOpen?.(text, file.name));
    e.target.value = '';
  });
  steps.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-step]');
    if (b) onDemo(Number(b.dataset.step));
  });
  root.querySelectorAll('.machine-actions').forEach((box) => box.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-action]');
    if (b) onAction(b.dataset.action);
  }));

  // Chỉ hiện các nhóm thao tác dùng trong protocol đang chọn (chế độ tự do: hiện tất cả)
  function showGroups(ids) {
    root.querySelectorAll('[data-group]').forEach((el) => { el.hidden = !ids.includes(el.dataset.group); });
  }
  const toolRoot = (id) => root.querySelector(`.tools[data-group="${id}"]`);

  function renderSteps(tr) {
    tracker = tr;
    const p = tr.protocol;
    select.value = p ? p.id : '';
    if (!p) {
      field.textContent = 'Chế độ tự do';
      goal.textContent = 'Thử bất kỳ cặp chất nào: kéo chai trên bàn và thả vào cốc hoặc ống PCR để xem kết quả.';
      steps.hidden = true;
      steps.innerHTML = '';
      return;
    }
    field.textContent = p.field;
    goal.textContent = p.goal;
    steps.hidden = false;
    steps.innerHTML = p.steps
      .map((s, i) => {
        const st = tr.state(i);
        const mark = st === 'done' || st === 'early' ? '✓' : i + 1;
        const late = st === 'early' ? ' <span class="chip chip-react">sai thứ tự</span>' : '';
        const demo = st === 'current' && !exam ? `<button type="button" class="step-demo" data-step="${i}">${s.expect.action ? 'Làm' : 'Làm mẫu'}</button>` : '';
        return `<li class="step is-${st}"><span class="step-mark" aria-hidden="true">${mark}</span><span class="step-text">${esc(s.text)}${late}</span>${demo}</li>`;
      })
      .join('');
  }

  function row(e) {
    if (e.type === 'reaction') {
      const r = e.reaction;
      return `<dt>Hiện tượng</dt><dd>${esc(r.observation)}</dd>
        <dt>Phương trình</dt><dd><span class="eq">${chem(r.equation)}</span></dd>
        ${e.amounts ? `<dt>Lượng</dt><dd>${chemText(e.amounts)}</dd>` : ''}
        ${r.explain ? `<dt>Giải thích</dt><dd>${esc(r.explain)}</dd>` : ''}`;
    }
    return `<dt>${esc(e.label ?? KIND[e.type].label)}</dt><dd>${e.type === 'measure' ? chemText(e.text) : esc(e.text)}</dd>`;
  }

  function progress(prog) {
    if (!prog) return '';
    if (prog.status === 'done') return `<p class="card-step is-done">Hoàn thành bước ${prog.step}.</p>`;
    if (prog.status === 'early') {
      return `<p class="card-step is-early">Bước ${prog.step} làm trước bước ${prog.waiting}. ${esc(prog.text ?? 'Nên làm theo đúng thứ tự của protocol.')}</p>`;
    }
    return `<p class="card-step is-off">Thao tác này không thuộc protocol. Bước đang chờ: bước ${prog.waiting}.</p>`;
  }

  const chipsOf = (events) => [...new Set(events.map((e) => e.type))].map((k) => `<span class="chip chip-${KIND[k].cls}">${KIND[k].chip}</span>`).join('');

  function push(li, prog) {
    log.prepend(li);
    if (prog?.finished) {
      const done = document.createElement('li');
      done.className = 'card card-done';
      done.innerHTML = `<div class="card-head"><span class="chip chip-effect">Hoàn thành protocol</span><span class="card-action">${esc(tracker.protocol.title)}</span></div>${exam ? '<p>Bấm "Nộp bài" để chấm điểm.</p>' : `<p>${esc(tracker.protocol.conclusion ?? '')}</p>`}`;
      log.prepend(done);
    }
    count.textContent = String(n);
    empty.hidden = true;
    renderSteps(tracker);
  }

  // Thẻ kết quả của một thao tác máy (chạy PCR, nạp gel, điện di, chụp ảnh gel)
  function addMachine(res, prog) {
    n += 1;
    const li = document.createElement('li');
    li.className = 'card card-machine';
    li.innerHTML = `
      <div class="card-head">
        <span class="card-no">#${n}</span>
        <span class="card-action">${esc(actions[res.action])}${res.day !== undefined ? ` <span class="conc">· ngày ${res.day}</span>` : ''}</span>
        <span class="chips">${chipsOf(res.events)}</span>
      </div>
      ${progress(prog)}
      ${res.lanes && (res.action === 'gel-image' || res.gelCm) ? gelImage(res, n) : ''}
      ${res.table ? countTable(res.table) : ''}
      ${res.html ?? ''}
      <dl>${shown(res.events).map(row).join('')}</dl>`;
    if (res.action !== 'notebook') entries.push({ no: n, title: `${actions[res.action] ?? res.action ?? 'Thao tác'}${res.day !== undefined ? ` · ngày ${res.day}` : ''}`, step: stepText(prog), lines: textRows(res.events), table: tableData(res.table) });
    push(li, prog);
  }

  function addResult(res, prog) {
    n += 1;
    const chips = chipsOf(res.events);
    const amount = (a) => (a.substance.kind === 'chem' && a.n !== 1 ? ` ${(a.n * 1000).toFixed(2).replace('.', ',')} mmol` : '');
    const list = res.amounts ?? res.contents.map((substance) => ({ substance, n: 1 }));
    const inside = list.length
      ? list.map((a) => subName(a.substance) + (a.substance.precipitate ? '↓' : '') + amount(a)).join(', ')
      : 'không còn chất tan nào ngoài nước';
    const vol = res.volume ? ` (${res.volume.toFixed(1).replace('.', ',')} mL${res.showPH && res.pH !== null ? `, pH ${res.pH.toFixed(2).replace('.', ',')}` : ''})` : '';
    const li = document.createElement('li');
    li.className = 'card';
    li.innerHTML = `
      <div class="card-head">
        <span class="card-no">#${n}</span>
        <span class="card-action">${subName(res.substance, true)} <span class="arrow" aria-label="cho vào">→</span> ${esc(res.container.name)}</span>
        <span class="chips">${chips}</span>
      </div>
      ${progress(prog)}
      <dl>${shown(res.events).map(row).join('')}</dl>
      <p class="card-contents">Trong ${esc(res.container.name)}${vol}: ${inside}</p>`;
    entries.push({ no: n, title: plain(`${subName(res.substance, true)} → ${esc(res.container.name)}`), step: stepText(prog), lines: [...textRows(res.events), ['Trong cốc', plain(`${vol.trim()} ${inside}`)]], table: null });
    push(li, prog);
  }

  // Bảng đếm kiểu hình: số quan sát, tỉ lệ, số kỳ vọng theo lý thuyết
  function countTable(t) {
    if (t.head) {
      return `<div class="table-wrap"><table class="count-table">
      <thead><tr>${t.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${t.rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
    }
    const exp = t.expected;
    return `<div class="table-wrap"><table class="count-table">
      <thead><tr><th scope="col">Kiểu hình (${esc(t.subject)})</th><th scope="col">Quan sát</th>${exp ? '<th scope="col">Kỳ vọng</th>' : ''}<th scope="col">Tỉ lệ</th></tr></thead>
      <tbody>${t.classes.map((c, i) => `<tr><th scope="row">${esc(c.label)}</th><td>${c.n}</td>${exp ? `<td>${exp[i] === null || exp[i] === undefined ? '—' : exp[i].toFixed(1).replace('.', ',')}</td>` : ''}<td>${((100 * c.n) / Math.max(1, t.total)).toFixed(1).replace('.', ',')} %</td></tr>`).join('')}</tbody>
      <tfoot><tr><th scope="row">Tổng</th><td>${t.total}</td>${exp ? `<td>${t.total}</td>` : ''}<td>${esc(t.unit)}</td></tr></tfoot>
    </table></div>`;
  }

  function clear() {
    n = 0;
    entries = [];
    log.innerHTML = '';
    count.textContent = '0';
    empty.hidden = false;
  }

  // Trạng thái phiên ở thanh trên: số thao tác đã lưu, hoặc thông báo lỗi
  const sessionState = (text) => { $('session-state').textContent = text; };
  // Thêm thẻ thông báo (mở lại phiên, lỗi file…) không tính vào báo cáo
  function notice(text, type = 'info', html = '') {
    const li = document.createElement('li');
    li.className = 'card card-notice';
    li.innerHTML = `<div class="card-head"><span class="chip chip-${KIND[type].cls}">${type === 'warning' ? 'Lưu ý' : 'Phiên'}</span></div><p>${esc(text)}</p>${html}`;
    log.prepend(li);
    empty.hidden = true;
  }

  // Danh sách protocol (có sẵn và tự soạn) vẽ lại khi lưu protocol mới
  function setProtocols(list, value = select.value) {
    select.innerHTML = `${list.map((p) => `<option value="${esc(p.id)}">${p.id.startsWith('my-') ? 'Của tôi: ' : ''}${esc(p.title)}</option>`).join('')}<option value="">Tự do, không theo protocol</option>`;
    select.value = value;
  }

  return { renderSteps, addResult, addMachine, clear, showGroups, toolRoot, entries: () => entries.slice(), sessionState, notice, setProtocols, editorRoot: () => $('editor-root'), exam: () => exam, setExam, classBar };
}
