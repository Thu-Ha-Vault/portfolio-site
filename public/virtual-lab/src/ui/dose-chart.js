// Đường liều – đáp ứng: tỉ lệ chết (%) theo nồng độ (trục log), kèm LC50. Màu theo token giao diện.

// ll: đường logistic 4 tham số đã khớp ({ f(c) → tỉ lệ 0–1, e }), vẽ nét đứt
export function doseChart({ rows, lc50, unit, ll = null }) {
  const pts = rows.filter((r) => r.c > 0);
  if (!pts.length) return '';
  const W = 320;
  const H = 170;
  const L = 36;
  const B = 28;
  const T = 10;
  const R = 12;
  const lo = Math.log10(Math.min(...pts.map((p) => p.c))) - 0.2;
  const hi = Math.log10(Math.max(...pts.map((p) => p.c))) + 0.2;
  const x = (c) => L + ((W - L - R) * (Math.log10(c) - lo)) / (hi - lo);
  const y = (p) => T + (H - T - B) * (1 - p);
  const grid = [0, 0.5, 1].map((p) => `<line x1="${L}" x2="${W - R}" y1="${y(p)}" y2="${y(p)}" class="tc-grid"/><text x="${L - 6}" y="${y(p) + 3.5}" text-anchor="end" class="tc-tick">${p * 100}</text>`).join('');
  const ticks = pts.map((p) => `<text x="${x(p.c)}" y="${H - B + 14}" text-anchor="middle" class="tc-tick">${String(p.c).replace('.', ',')}</text>`).join('');
  const dots = pts.map((p) => `<circle cx="${x(p.c).toFixed(1)}" cy="${y(p.dead / p.n).toFixed(1)}" r="3.5" class="tc-dot"/>`).join('');
  const line = `<path d="M${pts.map((p) => `${x(p.c).toFixed(1)} ${y(p.dead / p.n).toFixed(1)}`).join('L')}" class="tc-line"/>`;
  const curve = ll
    ? `<path d="M${Array.from({ length: 41 }, (_, i) => lo + ((hi - lo) * i) / 40).map((lg) => `${x(10 ** lg).toFixed(1)} ${y(Math.max(0, Math.min(1, ll.f(10 ** lg)))).toFixed(1)}`).join('L')}" class="tc-line cc-alt" fill="none" stroke-dasharray="4 3"><title>Logistic 4 tham số</title></path>`
    : '';
  const mark = lc50 && Math.log10(lc50) > lo && Math.log10(lc50) < hi
    ? `<line x1="${x(lc50)}" x2="${x(lc50)}" y1="${T}" y2="${H - B}" class="tc-eq"/><text x="${x(lc50) + 4}" y="${T + 10}" class="tc-tick">LC50</text>`
    : '';
  return `<figure class="tc"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tỉ lệ chết theo nồng độ${lc50 ? `, LC50 ${lc50.toFixed(2)} ${unit}` : ''}">
    ${grid}${ticks}<line x1="${L}" x2="${L}" y1="${T}" y2="${H - B}" class="tc-axis"/><line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" class="tc-axis"/>
    ${mark}${curve}${line}${dots}
    <text x="${(W + L) / 2}" y="${H - 2}" text-anchor="middle" class="tc-tick">nồng độ (${unit}, thang log)</text>
    <text x="10" y="${T + (H - T - B) / 2}" transform="rotate(-90 10 ${T + (H - T - B) / 2})" text-anchor="middle" class="tc-tick">% chết</text>
  </svg></figure>`;
}
