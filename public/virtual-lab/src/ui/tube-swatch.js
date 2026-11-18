import { esc } from './format.js';

// Các ống nghiệm cạnh nhau để so màu (thí nghiệm cân bằng, chỉ thị). tubes: [{ label, color (hex hoặc null = không màu), name, ppt, ring }]
// ring: màu chỉ ở một vòng giữa hai lớp chất lỏng (vòng nâu), phần còn lại không màu
// Nền và viền theo token giao diện; màu dung dịch cố định vì là màu thật của chất.

export function tubeSwatch(tubes) {
  const w = 92;
  const H = 150;
  const items = tubes.map((t, i) => {
    const x = i * w + w / 2;
    const fill = t.ring ? 'var(--tube-clear, #eef3f6)' : t.color ?? 'var(--tube-clear, #eef3f6)';
    const ring = t.ring && t.color ? `<rect x="${x - 12}" y="${H - 72}" width="24" height="7" fill="${t.color}"/>` : '';
    const ppt = t.ppt ? `<ellipse cx="${x}" cy="${H - 34}" rx="10" ry="5" fill="#f4f4f0" stroke="#bbb" stroke-width="0.6"/>` : '';
    return `<g><rect x="${x - 13}" y="14" width="26" height="${H - 40}" rx="13" fill="none" class="ts-glass"/>
      <path d="M ${x - 12} 60 L ${x - 12} ${H - 39} a 12 12 0 0 0 24 0 L ${x + 12} 60 Z" fill="${fill}" stroke="none"/>${ring}${ppt}
      <text x="${x}" y="${H - 4}" text-anchor="middle" class="ts-name">${esc(t.name)}</text></g>`;
  }).join('');
  const labels = tubes.map((t) => `<li>${esc(t.label)}: ${esc(t.name)}</li>`).join('');
  // Mỗi ống rộng tối đa 92 px: một hay hai ống không bị phóng to hết bề ngang thẻ
  return `<figure class="tube-swatch"><svg viewBox="0 0 ${tubes.length * w} ${H}" style="max-width:${Math.min(280, tubes.length * w)}px" role="img" aria-label="${esc(tubes.map((t) => `${t.label}: ${t.name}`).join('; '))}">${items}</svg><figcaption><ul>${labels}</ul></figcaption></figure>`;
}
