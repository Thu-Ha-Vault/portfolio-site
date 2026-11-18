// Đường tín hiệu theo thời gian (sắc ký đồ): trục thời gian và cường độ, nhãn thời gian lưu ở các pic.

export function traceChart(points, { peaks = [], xLabel = 'thời gian (phút)', yLabel = 'mAU' } = {}) {
  if (!points?.length) return '';
  const W = 320;
  const H = 170;
  const L = 36;
  const B = 28;
  const T = 14;
  const R = 10;
  const xMax = points.at(-1)[0];
  const yMax = Math.max(1, ...points.map((p) => p[1])) * 1.12;
  const x = (v) => L + ((W - L - R) * v) / xMax;
  const y = (v) => T + (H - T - B) * (1 - Math.max(-0.05 * yMax, v) / yMax);
  const path = `M${points.map((p) => `${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join('L')}`;
  const ticks = [0, xMax / 2, xMax].map((v) => `<text x="${x(v)}" y="${H - B + 14}" text-anchor="middle" class="tc-tick">${v.toFixed(1).replace('.', ',')}</text>`).join('');
  const marks = peaks.map((p) => `<text x="${x(p.tR)}" y="${Math.max(T + 8, y(p.height) - 4)}" text-anchor="middle" class="tc-tick">${p.tR.toFixed(2).replace('.', ',')}</text>`).join('');
  return `<figure class="tc"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sắc ký đồ, ${peaks.length} pic">
    <line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" class="tc-grid"/>
    <line x1="${L}" x2="${L}" y1="${T}" y2="${H - B}" class="tc-axis"/><line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" class="tc-axis"/>
    <path d="${path}" class="tc-line"/>${ticks}${marks}
    <text x="${(W + L) / 2}" y="${H - 2}" text-anchor="middle" class="tc-tick">${xLabel}</text>
    <text x="10" y="${T + (H - T - B) / 2}" transform="rotate(-90 10 ${T + (H - T - B) / 2})" text-anchor="middle" class="tc-tick">${yLabel}</text>
  </svg></figure>`;
}
