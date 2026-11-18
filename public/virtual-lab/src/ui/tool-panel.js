import { esc } from './format.js';

// Bảng điều khiển dùng chung cho các máy ở Khu máy móc: các hàng gồm ô chọn và nút thao tác, một dòng trạng thái.
// config: { id, title, rows: [{ label, items: [{ select: id, options: [[giá trị, nhãn]], value } | { button: nhãn, action, params?: (get) => ({}) }] }] }
// onAction(action, params) chạy thao tác; get(id) đọc giá trị ô chọn.

export function createToolPanel(root, { id, title, rows, onAction, onNotebook, onFigure }) {
  root.innerHTML = `
    <div class="garden-head">
      <h2 class="section-title" id="${id}-title">${esc(title)}</h2>
      <span class="day" id="${id}-status"></span>
    </div>
    <div class="garden-grid">
      ${rows
        .map((r, i) => `<div class="g-row" role="group" aria-label="${esc(r.label)}">
          <span class="g-label">${esc(r.label)}</span>
          ${r.items
            .map((it, j) => (it.select
              ? `<select id="${id}-${it.select}" aria-label="${esc(it.aria ?? r.label)}">${it.options.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(it.value) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`
              : `<button type="button" class="btn btn-ghost" data-row="${i}" data-item="${j}">${esc(it.button)}</button>`))
            .join('')}
        </div>`)
        .join('')}
    </div>
    <div class="g-row">
      ${onFigure ? `<button type="button" class="btn btn-ghost" id="${id}-fig">Xem máy cận cảnh</button>` : ''}
      ${onNotebook ? `<button type="button" class="btn btn-ghost" id="${id}-csv">Sổ thí nghiệm (CSV)</button>` : ''}
    </div>`;
  const get = (sel) => {
    const el = root.querySelector(`#${id}-${sel}`);
    return el && /^-?\d+(\.\d+)?$/.test(el.value) ? Number(el.value) : el?.value;
  };
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-row]');
    if (!b) return;
    const it = rows[Number(b.dataset.row)].items[Number(b.dataset.item)];
    onAction(it.action, it.params ? it.params(get) : {});
  });
  root.querySelector(`#${id}-csv`)?.addEventListener('click', () => onNotebook());
  root.querySelector(`#${id}-fig`)?.addEventListener('click', () => onFigure());
  return {
    get,
    status(text) {
      root.querySelector(`#${id}-status`).textContent = text;
    },
    set(sel, v) {
      const el = root.querySelector(`#${id}-${sel}`);
      if (el) el.value = String(v);
    },
    // Đổi danh sách lựa chọn của một ô chọn (ví dụ các cột của bộ số liệu vừa nạp)
    setOptions(sel, options, value) {
      const el = root.querySelector(`#${id}-${sel}`);
      if (!el) return;
      el.innerHTML = options.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('');
      if (value != null) el.value = String(value);
    },
  };
}
