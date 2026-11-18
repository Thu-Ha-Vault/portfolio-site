// Đường cong chuẩn độ: pH theo thể tích NaOH đã nhỏ. Màu lấy theo token giao diện nên đọc được ở cả sáng và tối.

export function titrationChart(points, { vEq = null, reading = null } = {}) {
  if (!points.length) return '';
  const W = 320;
  const H = 180;
  const L = 34;
  const B = 26;
  const T = 10;
  const R = 10;
  const vMax = Math.max(5, Math.ceil(Math.max(...points.map((p) => p[0])) / 5) * 5);
  const x = (v) => L + ((W - L - R) * v) / vMax;
  const y = (ph) => T + ((H - T - B) * (14 - Math.max(0, Math.min(14, ph)))) / 14;
  const grid = [0, 7, 14].map((p) => `<line x1="${L}" x2="${W - R}" y1="${y(p)}" y2="${y(p)}" class="tc-grid"/><text x="${L - 6}" y="${y(p) + 3.5}" text-anchor="end" class="tc-tick">${p}</text>`).join('');
  const xt = Array.from({ length: vMax / 5 + 1 }, (_, i) => i * 5).map((v) => `<text x="${x(v)}" y="${H - B + 14}" text-anchor="middle" class="tc-tick">${v}</text>`).join('');
  const path = `M${points.map(([v, p]) => `${x(v).toFixed(1)} ${y(p).toFixed(1)}`).join('L')}`;
  const eq = vEq !== null ? `<line x1="${x(vEq)}" x2="${x(vEq)}" y1="${T}" y2="${H - B}" class="tc-eq"/><text x="${x(vEq) - 4}" y="${T + 10}" text-anchor="end" class="tc-tick">điểm tương đương</text>` : '';
  const rd = reading !== null ? `<circle cx="${x(reading)}" cy="${y(points[points.length - 1][1])}" r="3.5" class="tc-dot"/>` : '';
  return `<figure class="tc"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Đường cong chuẩn độ: pH theo thể tích NaOH, ${points.length} điểm đo">
    ${grid}${xt}
    <line x1="${L}" x2="${L}" y1="${T}" y2="${H - B}" class="tc-axis"/><line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" class="tc-axis"/>
    ${eq}<path d="${path}" class="tc-line"/>${rd}
    <text x="${(W + L) / 2}" y="${H - 2}" text-anchor="middle" class="tc-tick">V NaOH (mL)</text>
    <text x="10" y="${T + (H - T - B) / 2}" transform="rotate(-90 10 ${T + (H - T - B) / 2})" text-anchor="middle" class="tc-tick">pH</text>
  </svg></figure>`;
}
