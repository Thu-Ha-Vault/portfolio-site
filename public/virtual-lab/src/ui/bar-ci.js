import { esc } from './format.js';

// Biểu đồ cột trung bình kèm thanh sai số 95 % CI, mỗi đặc điểm một ô (như biểu đồ của bài 03 Evolutionary Biology).
// bars: [{ trait, group, mean, ci, unit }], hai nhóm liên tiếp cho mỗi đặc điểm.
export function barCi(bars) {
  const traits = [...new Set(bars.map((b) => b.trait))];
  const W = 150;
  const H = 150;
  const cells = traits.map((t) => {
    const pair = bars.filter((b) => b.trait === t);
    const hi = Math.max(...pair.map((b) => b.mean + b.ci));
    const lo = Math.min(...pair.map((b) => b.mean - b.ci));
    const pad = (hi - lo) * 0.6 || 1;
    const y0 = lo - pad;
    const y1 = hi + pad * 0.3;
    const y = (v) => 18 + (1 - (v - y0) / (y1 - y0)) * (H - 46);
    const bar = (b, i) => {
      const x = 30 + i * 55;
      return `<rect x="${x}" y="${y(b.mean).toFixed(1)}" width="38" height="${(H - 28 - y(b.mean)).toFixed(1)}" fill="var(--chart-${i ? 'b' : 'a'}, ${i ? '#2e7d4f' : '#b4532a'})" opacity="0.85"/>
        <line x1="${x + 19}" x2="${x + 19}" y1="${y(b.mean + b.ci).toFixed(1)}" y2="${y(b.mean - b.ci).toFixed(1)}" stroke="currentColor" stroke-width="1.5"/>
        <line x1="${x + 12}" x2="${x + 26}" y1="${y(b.mean + b.ci).toFixed(1)}" y2="${y(b.mean + b.ci).toFixed(1)}" stroke="currentColor"/>
        <line x1="${x + 12}" x2="${x + 26}" y1="${y(b.mean - b.ci).toFixed(1)}" y2="${y(b.mean - b.ci).toFixed(1)}" stroke="currentColor"/>
        <text x="${x + 19}" y="${H - 14}" text-anchor="middle">${i ? 'sống' : 'chết'}</text>`;
    };
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t)}: trung bình ± 95 % CI, nhóm chết ${pair[0].mean.toFixed(2)}, nhóm sống ${pair[1].mean.toFixed(2)} ${esc(pair[0].unit)}">
      <text x="${W / 2}" y="11" text-anchor="middle" font-weight="600" font-size="9">${esc(t)}</text>
      <text x="4" y="24" font-size="8" opacity="0.7">${esc(pair[0].unit)}</text>
      <line x1="24" x2="${W - 6}" y1="${H - 28}" y2="${H - 28}" stroke="currentColor" opacity="0.4"/>${pair.map(bar).join('')}</svg>`;
  });
  return `<div class="ci-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:6px;font:10px 'IBM Plex Mono',ui-monospace,monospace;color:var(--ink)">${cells.join('')}</div>`;
}
