// Ảnh phôi cá ngựa vằn dưới kính soi nổi (nền sáng như ảnh chụp), vẽ theo giờ phát triển chuẩn (Kimmel 1995):
// phân cắt, phôi nang, phôi vị (lan phủ), phân đốt (thể tiết), pharyngula (mắt, sắc tố, tim), ấu thể đã nở;
// và các dạng chết, dị dạng theo OECD 236. Màu cố định vì đây là một tấm ảnh.

const C = { field: '#eef1ea', chorion: '#9aa79a', yolk: '#e9cf8d', yolkEdge: '#b99b55', cell: '#f6efe0', body: '#e8dcc4', edge: '#7d6f57', eye: '#2b2622', pig: '#3a3330', heart: '#c23b2e', dead: '#5b554c', deadLight: '#8d867a', edema: '#d9ecf2' };

function chorion(cx, cy) {
  return `<circle cx="${cx}" cy="${cy}" r="40" fill="none" stroke="${C.chorion}" stroke-width="1.2"/>`;
}

// devH: giờ phát triển chuẩn; fate: { dead, endpoint, hatched, malformed }
export function embryoSvg(devH, fate = {}, size = 92) {
  const cx = 46;
  const cy = 46;
  let g = '';
  if (fate.dead && (fate.endpoint === 'coagulated' || devH < 10)) {
    g = `${chorion(cx, cy)}<circle cx="${cx}" cy="${cy + 2}" r="28" fill="${C.dead}"/><circle cx="${cx - 7}" cy="${cy - 6}" r="9" fill="${C.deadLight}" opacity="0.6"/>`;
  } else if (devH < 2.25) {
    // Phân cắt: đĩa phôi trên noãn hoàng, số tế bào gấp đôi mỗi 15 phút
    const n = Math.min(64, 2 ** Math.max(0, Math.floor((devH - 0.5) / 0.25) + 1));
    const cols = Math.min(8, Math.ceil(Math.sqrt(n)));
    const w = 30;
    const cells = Array.from({ length: Math.min(n, cols * 2) }, (_, i) => `<rect x="${cx - w / 2 + (i % cols) * (w / cols)}" y="${cy - 26 + Math.floor(i / cols) * 7}" width="${w / cols - 0.8}" height="6.2" rx="2" fill="${C.cell}" stroke="${C.edge}" stroke-width="0.5"/>`).join('');
    g = `${chorion(cx, cy)}<circle cx="${cx}" cy="${cy + 8}" r="24" fill="${C.yolk}" stroke="${C.yolkEdge}" stroke-width="0.8"/>${cells}`;
  } else if (devH < 10) {
    // Phôi nang rồi phôi vị: lớp tế bào lan phủ dần xuống noãn hoàng
    const epi = devH < 5.25 ? 0.3 : 0.5 + (0.5 * (devH - 5.25)) / 4.75;
    const a = Math.PI * epi;
    const x1 = cx + 26 * Math.sin(a);
    const x0 = cx - 26 * Math.sin(a);
    const y = cy + 4 - 26 * Math.cos(a);
    const dots = Array.from({ length: 18 }, (_, i) => `<circle cx="${cx - 14 + (i % 6) * 5.6}" cy="${cy - 18 + Math.floor(i / 6) * 4}" r="1.4" fill="${C.edge}" opacity="0.35"/>`).join('');
    const shield = devH >= 6 ? `<ellipse cx="${x1 - 3}" cy="${cy - 2}" rx="4" ry="12" fill="${C.cell}" stroke="${C.edge}" stroke-width="0.6"/>` : '';
    g = `${chorion(cx, cy)}<circle cx="${cx}" cy="${cy + 4}" r="26" fill="${C.yolk}" stroke="${C.yolkEdge}" stroke-width="0.8"/>
      <path d="M${x0} ${y} A26 26 0 ${epi > 0.5 ? 1 : 0} 1 ${x1} ${y} Z" fill="${C.cell}" stroke="${C.edge}" stroke-width="0.8"/>${dots}${shield}`;
  } else if (!fate.hatched) {
    // Phân đốt và pharyngula: thân uốn quanh noãn hoàng trong màng phôi
    const noSomites = fate.dead && fate.endpoint === 'somites';
    const tailFree = devH >= 17 && !(fate.dead && fate.endpoint === 'tail');
    const somites = noSomites ? 0 : Math.min(30, Math.max(0, Math.floor((devH - 10.33) * 3)));
    const ticks = Array.from({ length: Math.min(somites, 24) }, (_, i) => {
      const t = Math.PI * (1.05 + (i / 24) * 0.85);
      const r1 = 25;
      const r2 = 31;
      return `<line x1="${cx + r1 * Math.cos(t)}" y1="${cy + 4 + r1 * Math.sin(t)}" x2="${cx + r2 * Math.cos(t)}" y2="${cy + 4 + r2 * Math.sin(t)}" stroke="${C.edge}" stroke-width="0.6"/>`;
    }).join('');
    // Đuôi không tách: đầu đuôi dính sát noãn hoàng
    const stuck = fate.dead && fate.endpoint === 'tail' ? `<path d="M${cx + 30} ${cy + 10} A24 24 0 0 1 ${cx + 8} ${cy + 27}" fill="none" stroke="${C.deadLight}" stroke-width="5" stroke-linecap="round"/>` : '';
    const tail = !tailFree ? stuck : `<path d="M${cx + 30} ${cy + 10} Q${cx + 34} ${cy + 26} ${cx + 16} ${cy + 33}" fill="none" stroke="${C.body}" stroke-width="6" stroke-linecap="round"/><path d="M${cx + 30} ${cy + 10} Q${cx + 34} ${cy + 26} ${cx + 16} ${cy + 33}" fill="none" stroke="${C.edge}" stroke-width="0.6"/>`;
    const late = devH >= 22;
    const dead = fate.dead;
    const eye = late ? `<circle cx="${cx - 22}" cy="${cy - 10}" r="5" fill="${devH >= 30 ? C.eye : C.cell}" stroke="${C.edge}" stroke-width="0.6"/>` : '';
    const pig = devH >= 26 ? Array.from({ length: 9 }, (_, i) => { const t = Math.PI * (1.15 + i * 0.09); return `<circle cx="${cx + 29 * Math.cos(t)}" cy="${cy + 4 + 29 * Math.sin(t)}" r="1.1" fill="${C.pig}"/>`; }).join('') : '';
    const heart = devH >= 24 ? `<circle cx="${cx - 16}" cy="${cy + 10}" r="3" fill="${dead ? C.deadLight : C.heart}"/>` : '';
    const edema = fate.malformed === 'edema' ? `<circle cx="${cx - 14}" cy="${cy + 12}" r="8" fill="${C.edema}" stroke="${C.edge}" stroke-width="0.6"/>` : '';
    const bodyCol = dead ? C.deadLight : C.body;
    g = `${chorion(cx, cy)}<circle cx="${cx}" cy="${cy + 4}" r="${devH >= 24 ? 20 : 23}" fill="${dead ? '#cfc6ad' : C.yolk}" stroke="${C.yolkEdge}" stroke-width="0.8"/>
      <path d="M${cx - 27} ${cy - 2} A28 28 0 0 1 ${cx + 30} ${cy + 10}" fill="none" stroke="${bodyCol}" stroke-width="7" stroke-linecap="round"/>
      <path d="M${cx - 27} ${cy - 2} A28 28 0 0 1 ${cx + 30} ${cy + 10}" fill="none" stroke="${C.edge}" stroke-width="0.6"/>${ticks}${tail}${pig}${eye}${edema}${heart}`;
  } else {
    // Ấu thể đã nở: thân thẳng (hoặc cong khi dị dạng), noãn hoàng thu nhỏ, mắt đen, sắc tố dọc thân
    const curve = fate.malformed === 'curve';
    const spine = curve ? `M10 ${cy - 2} Q${cx} ${cy + 22} ${86} ${cy - 14}` : `M10 ${cy} Q${cx} ${cy - 3} ${86} ${cy + 2}`;
    const yolkR = Math.max(5, 13 - (devH - 48) / 6);
    const pig = Array.from({ length: 12 }, (_, i) => `<circle cx="${22 + i * 5}" cy="${cy - 2 + (curve ? Math.sin(i / 3) * 6 : 0)}" r="0.9" fill="${C.pig}"/>`).join('');
    const bladder = devH >= 90 ? `<ellipse cx="${cx - 2}" cy="${cy - 4}" rx="4" ry="2.6" fill="#8a8f86"/>` : '';
    const edema = fate.malformed === 'edema' ? `<circle cx="20" cy="${cy + 9}" r="8" fill="${C.edema}" stroke="${C.edge}" stroke-width="0.6"/>` : '';
    g = `<path d="${spine}" fill="none" stroke="${C.body}" stroke-width="8" stroke-linecap="round"/><path d="${spine}" fill="none" stroke="${C.edge}" stroke-width="0.6"/>
      <ellipse cx="${26}" cy="${cy + 6}" rx="${yolkR}" ry="${yolkR * 0.6}" fill="${C.yolk}" stroke="${C.yolkEdge}" stroke-width="0.6"/>
      <circle cx="13" cy="${cy - 2}" r="4" fill="${C.eye}"/>${pig}${bladder}${edema}<circle cx="18" cy="${cy + 6}" r="2.2" fill="${C.heart}"/>`;
  }
  return `<svg viewBox="0 0 92 92" width="${size}" height="${size}" aria-hidden="true"><rect width="92" height="92" rx="46" fill="${C.field}"/>${g}</svg>`;
}

// Một hàng ảnh: mỗi giếng một phôi tiêu biểu (theo số đông trong giếng) kèm chú thích
export function embryoRow(obs, label) {
  return `<div class="embryo-row">${obs.rows
    .map((r) => {
      const deadMost = r.dead > r.n / 2;
      const pick = r.sample.find((f) => (deadMost ? f.dead : !f.dead)) ?? r.sample[0];
      return `<figure class="embryo">${embryoSvg(obs.devH, pick)}<figcaption>${label(r)}<br><span>${r.n - r.dead}/${r.n} sống</span></figcaption></figure>`;
    })
    .join('')}</div>`;
}
