const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// Công thức hoá học: chữ số đứng sau ký hiệu nguyên tố hoặc dấu ")" thành chỉ số dưới.
// Hệ số đứng đầu (2NaOH) giữ nguyên.
export const chem = (formula) => esc(formula).replace(/([A-Za-z)])(\d+)/g, '$1<sub>$2</sub>');

// Tên hiển thị của một chất: công thức nếu có, không thì nhãn; kèm nồng độ nếu cần.
export function subName(sub, withConc = false) {
  const base = sub.formula && !sub.solvent ? chem(sub.formula) : esc(sub.label);
  return withConc && sub.conc ? `${base} <span class="conc">${esc(sub.conc)}</span>` : base;
}
