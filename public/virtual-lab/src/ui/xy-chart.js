// Đồ thị điểm và đường thẳng (đường chuẩn): trục tuyến tính, đường hồi quy y = a + b·x hoặc đường cong bất kỳ (curve), điểm mẫu chưa biết.
// Màu theo token giao diện (lớp tc-* trong styles.css).

export function xyChart({ points, fit, curve = null, unknown = null, xLabel, yLabel }) {
  if (!points.length) return '';
  const W = 320;
  const H = 180;
  const L = 40;
  const B = 28;
  const T = 10;
  const R = 12;
  const xs = points.map((p) => p[0]).concat(unknown ? [unknown[0]] : []);
  const ys = points.map((p) => p[1]).concat(unknown ? [unknown[1]] : []);
  const xMax = Math.max(...xs) * 1.08 || 1;
  const yMax = Math.max(...ys) * 1.1 || 1;
  const x = (v) => L + ((W - L - R) * v) / xMax;
  const y = (v) => T + (H - T - B) * (1 - Math.max(0, v) / yMax);
  const nice = (m) => [0, m / 2, m].map((v) => +v.toPrecision(2));
  const gy = nice(yMax).map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="tc-grid"/><text x="${L - 6}" y="${y(v) + 3.5}" text-anchor="end" class="tc-tick">${String(v).replace('.', ',')}</text>`).join('');
  const gx = nice(xMax).map((v) => `<text x="${x(v)}" y="${H - B + 14}" text-anchor="${x(v) > W - R - 12 ? 'end' : 'middle'}" class="tc-tick">${String(v).replace('.', ',')}</text>`).join('');
  const path = curve ? `<path d="M${curve.map((p) => `${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join('L')}" class="tc-line" fill="none"/>` : '';
  const line = fit ? `<line x1="${x(0)}" y1="${y(fit.a)}" x2="${x(xMax)}" y2="${y(fit.a + fit.b * xMax)}" class="tc-line"/>` : '';
  const dots = points.map((p) => `<circle cx="${x(p[0]).toFixed(1)}" cy="${y(p[1]).toFixed(1)}" r="3.5" class="tc-dot"/>`).join('');
  const unk = unknown ? `<circle cx="${x(unknown[0]).toFixed(1)}" cy="${y(unknown[1]).toFixed(1)}" r="5" class="tc-unknown"/><line x1="${x(unknown[0])}" x2="${x(unknown[0])}" y1="${y(unknown[1])}" y2="${H - B}" class="tc-eq"/>` : '';
  return `<figure class="tc"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${yLabel} theo ${xLabel}, ${points.length} điểm chuẩn">
    ${gy}${gx}<line x1="${L}" x2="${L}" y1="${T}" y2="${H - B}" class="tc-axis"/><line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" class="tc-axis"/>
    ${path}${line}${dots}${unk}
    <text x="${(W + L) / 2}" y="${H - 2}" text-anchor="middle" class="tc-tick">${xLabel}</text>
    <text x="10" y="${T + (H - T - B) / 2}" transform="rotate(-90 10 ${T + (H - T - B) / 2})" text-anchor="middle" class="tc-tick">${yLabel}</text>
  </svg></figure>`;
}
