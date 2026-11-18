// Nhiều đường trên cùng một trục (đường khuếch đại qPCR, đường nóng chảy, phổ hấp thụ).
// series: [{ name, points: [[x, y], …], kind: 'main' | 'alt' | 'bad' | 'dots' }]; ngưỡng vẽ nét đứt; 'dots' vẽ điểm rời.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const num = (v, d) => v.toFixed(d).replace('.', ',');

// zero: false thì trục y bám theo khoảng số liệu thay vì bắt đầu từ 0 (ví dụ nhiệt độ quanh 25 °C)
export function curvesChart(series, { threshold = null, xLabel = '', yLabel = '', marks = [], xDigits = 0, aria = 'Đồ thị', zero = true } = {}) {
  const all = series.flatMap((s) => s.points);
  if (!all.length) return '';
  const W = 320;
  const H = 180;
  const L = 46;
  const B = 28;
  const T = 14;
  const R = 10;
  const xMin = Math.min(...all.map((p) => p[0]));
  const xMax = Math.max(...all.map((p) => p[0]));
  const ys = all.map((p) => p[1]);
  const pad = zero ? 0 : (Math.max(...ys) - Math.min(...ys)) * 0.08 || 0.1;
  const yLo = zero ? Math.min(0, ...ys) : Math.min(...ys) - pad;
  // Mọi giá trị âm (ví dụ lg của số nhỏ hơn 1) thì trục y dừng ở 0
  const top = Math.max(zero ? threshold ?? 0 : -Infinity, ...ys);
  const yMax = !zero ? top + pad : top > 0 ? top * 1.1 : yLo < 0 ? 0 : 1e-9;
  const x = (v) => L + ((W - L - R) * (v - xMin)) / (xMax - xMin || 1);
  const y = (v) => T + (H - T - B) * (1 - (v - yLo) / (yMax - yLo));
  const path = (pts) => `M${pts.map((p) => `${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join('L')}`;
  const ticks = [xMin, (xMin + xMax) / 2, xMax].map((v) => `<text x="${x(v)}" y="${H - B + 14}" text-anchor="${x(v) > W - R - 12 ? 'end' : x(v) < L + 12 ? 'start' : 'middle'}" class="tc-tick">${num(v, xDigits)}</text>`).join('');
  const yTop = zero ? yMax / 1.1 : yMax - pad;
  const y0 = !zero ? yLo + pad : yLo < 0 && -yLo < 0.1 * yMax ? 0 : yLo;
  const yt = [y0, (y0 + yTop) / 2, yTop].map((v) => +v.toPrecision(zero ? 2 : 3));
  // Số lớn: ghi thừa số chung 10ⁿ ở nhãn trục cho gọn
  const ex = yTop >= 1e4 ? Math.floor(Math.log10(yTop)) : 0;
  const sup = (n) => String(n).replace(/[0-9-]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(c)]);
  const yName = ex ? `${yLabel} (×10${sup(ex)})` : yLabel;
  const yTicks = [...new Set(yt)].map((v) => `<text x="${L - 4}" y="${y(v) + 3.5}" text-anchor="end" class="tc-tick">${String(+(v / 10 ** ex).toPrecision(zero ? 2 : 3)).replace('.', ',')}</text>`).join('');
  const thr = threshold == null ? '' : `<line x1="${L}" x2="${W - R}" y1="${y(threshold)}" y2="${y(threshold)}" class="tc-eq"/>`;
  const lines = series.map((s) => (s.kind === 'dots'
    ? `<g><title>${esc(s.name)}</title>${s.points.map((p) => `<circle cx="${x(p[0]).toFixed(1)}" cy="${y(p[1]).toFixed(1)}" r="3.5" class="tc-dot"/>`).join('')}</g>`
    : `<path d="${path(s.points)}" class="tc-line cc-${s.kind ?? 'main'}"><title>${esc(s.name)}</title></path>`)).join('');
  const labels = marks.map((m) => `<text x="${x(m.x)}" y="${Math.max(T + 8, y(m.y) - 4)}" text-anchor="middle" class="tc-tick">${esc(m.text)}</text>`).join('');
  const kinds = [...new Map(series.map((s) => [s.kind ?? 'main', s.legend ?? s.name])).entries()];
  const legend = kinds.length > 1 ? `<figcaption class="cc-legend">${kinds.map(([k, n]) => `<span><i class="cc-key cc-${k}"></i>${esc(n)}</span>`).join('')}</figcaption>` : '';
  return `<figure class="tc"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(aria)}">
    ${yLo <= 0 && yMax >= 0 ? `<line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" class="tc-grid"/>` : ''}
    <line x1="${L}" x2="${L}" y1="${T}" y2="${H - B}" class="tc-axis"/><line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" class="tc-axis"/>
    ${thr}${lines}${ticks}${yTicks}${labels}
    <text x="${(W + L) / 2}" y="${H - 2}" text-anchor="middle" class="tc-tick">${esc(xLabel)}</text>
    <text x="9" y="${T + (H - T - B) / 2}" transform="rotate(-90 9 ${T + (H - T - B) / 2})" text-anchor="middle" class="tc-tick">${esc(yName)}</text>
  </svg>${legend}</figure>`;
}
