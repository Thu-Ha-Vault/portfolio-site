// Chia màn hình làm hai phần, kéo thanh giữa để đổi kích thước (chuột, cảm ứng hoặc phím mũi tên).
// Màn hình hẹp thì xếp dọc: phòng thí nghiệm ở trên, protocol ở dưới.

export function createSplit({ root, divider, storageKey = 'vlab.split', initial = 0.62, min = 0.28, max = 0.8, onResize }) {
  const narrow = matchMedia('(max-width: 760px)');
  let ratio = read() ?? initial;

  function read() {
    try {
      const v = parseFloat(localStorage.getItem(storageKey));
      return Number.isFinite(v) ? v : null;
    } catch {
      return null;
    }
  }
  function save() {
    try {
      localStorage.setItem(storageKey, String(ratio));
    } catch {
      // Không lưu được thì lần sau dùng tỉ lệ mặc định
    }
  }

  function apply() {
    ratio = Math.min(max, Math.max(min, ratio));
    const stacked = narrow.matches;
    root.style.setProperty('--split', ratio.toFixed(4));
    root.classList.toggle('is-stacked', stacked);
    divider.setAttribute('aria-orientation', stacked ? 'horizontal' : 'vertical');
    divider.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    onResize?.();
  }

  divider.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    divider.setPointerCapture(e.pointerId);
    divider.classList.add('is-dragging');
    const move = (ev) => {
      const r = root.getBoundingClientRect();
      ratio = narrow.matches ? (ev.clientY - r.top) / r.height : (ev.clientX - r.left) / r.width;
      apply();
    };
    const up = () => {
      divider.classList.remove('is-dragging');
      divider.removeEventListener('pointermove', move);
      divider.removeEventListener('pointerup', up);
      divider.removeEventListener('pointercancel', up);
      save();
    };
    divider.addEventListener('pointermove', move);
    divider.addEventListener('pointerup', up);
    divider.addEventListener('pointercancel', up);
  });

  divider.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.1 : 0.03;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ratio -= step;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ratio += step;
    else if (e.key === 'Home') ratio = min;
    else if (e.key === 'End') ratio = max;
    else return;
    e.preventDefault();
    apply();
    save();
  });

  divider.addEventListener('dblclick', () => {
    ratio = initial;
    apply();
    save();
  });

  narrow.addEventListener('change', apply);
  apply();
}
