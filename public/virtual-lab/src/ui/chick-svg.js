// Ảnh phôi gà nhìn qua cửa sổ vỏ theo giai đoạn Hamburger–Hamilton (giản lược, vẽ theo hình trong HH 1951):
// HH1–HH13 nhìn từ mặt lưng trên đĩa phôi (dải nguyên thuỷ, nút Hensen, nếp đầu, đốt thân, túi não, tim);
// từ HH14 phôi nằm nghiêng sang trái, có màng ối, mầm chi, túi niệu. Màu cố định vì là ảnh chụp.

const somitePairs = (n, x, y0, dy) => Array.from({ length: n }, (_, i) => `<rect x="${x - 7}" y="${y0 + i * dy}" width="4" height="${dy * 0.8}" rx="1"/><rect x="${x + 3}" y="${y0 + i * dy}" width="4" height="${dy * 0.8}" rx="1"/>`).join('');

export function chickSvg({ stage, somites = 0, alive = true }, size = 220) {
  const W = 220;
  const H = 180;
  const cx = 110;
  const cy = 92;
  let body = '';
  if (stage <= 13) {
    const len = stage <= 4 ? 20 + stage * 10 : 70;
    const streakTop = stage <= 4 ? cy + 35 - len : cy + 10 + Math.min(30, somites * 1.4);
    body += `<ellipse cx="${cx}" cy="${cy}" rx="78" ry="64" fill="#e9d79a"/>`; // vùng tối
    body += `<ellipse cx="${cx}" cy="${cy}" rx="44" ry="${stage >= 5 ? 52 : 40}" fill="#f6efd2"/>`; // vùng sáng
    if (stage >= 2) body += `<rect x="${cx - 2.5}" y="${streakTop}" width="5" height="${cy + 38 - streakTop}" rx="2.5" fill="#c9b27a"/>`;
    if (stage >= 4) body += `<circle cx="${cx}" cy="${streakTop}" r="4.5" fill="#b89a5c"/>`;
    if (stage >= 5) body += `<rect x="${cx - 1.5}" y="${cy - 30}" width="3" height="${streakTop - cy + 30}" fill="#d8c48e"/>`;
    if (stage >= 6) body += `<path d="M${cx - 18} ${cy - 30} Q${cx} ${cy - 50} ${cx + 18} ${cy - 30}" fill="none" stroke="#b89a5c" stroke-width="4"/>`;
    if (stage >= 7) body += `<g fill="#b89a5c">${somitePairs(Math.min(somites, 19), cx, cy - 12, 2.6)}</g>`;
    if (stage >= 8) body += Array.from({ length: 10 }, (_, i) => `<circle cx="${cx - 60 + (i % 5) * 30}" cy="${cy + (i < 5 ? -46 : 50)}" r="3" fill="#c0392b" opacity="0.7"/>`).join('');
    if (stage >= 9) body += `<circle cx="${cx - 10}" cy="${cy - 34}" r="5" fill="#d8c48e" stroke="#b89a5c"/><circle cx="${cx + 10}" cy="${cy - 34}" r="5" fill="#d8c48e" stroke="#b89a5c"/>`;
    if (stage >= 10) body += `<path d="M${cx + 6} ${cy - 22} q14 6 6 18" fill="none" stroke="#c0392b" stroke-width="4"/>`;
  } else {
    const k = Math.min(1, (stage - 14) / 26);
    const r = 34 + k * 40;
    body += `<ellipse cx="${cx}" cy="${cy}" rx="96" ry="78" fill="#e9c46a"/>`; // noãn hoàng
    body += Array.from({ length: 8 }, (_, i) => `<path d="M${cx} ${cy} q${30 * Math.cos(i)} ${20 * Math.sin(i)} ${80 * Math.cos(i * 0.8)} ${60 * Math.sin(i * 0.8)}" fill="none" stroke="#b03a2e" stroke-width="1.6" opacity="0.8"/>`).join('');
    body += `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#eef3f6" opacity="0.55"/>`; // màng ối
    body += `<path d="M${cx + r * 0.2} ${cy - r * 0.6} a${r * 0.7} ${r * 0.75} 0 1 0 ${r * 0.1} ${r * 1.3}" fill="none" stroke="#e8b4a0" stroke-width="${10 + 14 * k}" stroke-linecap="round"/>`; // thân cong chữ C
    body += `<circle cx="${cx - r * 0.25}" cy="${cy - r * 0.45}" r="${8 + 10 * k}" fill="#e8b4a0"/>`; // đầu
    body += `<circle cx="${cx - r * 0.3}" cy="${cy - r * 0.5}" r="${3 + 4 * k}" fill="${stage >= 20 ? '#1d1d1d' : '#c9a08f'}"/>`; // mắt
    body += `<circle cx="${cx - r * 0.05}" cy="${cy - r * 0.05}" r="${5 + 3 * k}" fill="#c0392b"/>`; // tim
    if (stage >= 16) body += `<ellipse cx="${cx + r * 0.35}" cy="${cy - r * 0.15}" rx="${4 + 8 * k}" ry="${3 + 4 * k}" fill="#e3a58f"/>`;
    if (stage >= 17) body += `<ellipse cx="${cx + r * 0.3}" cy="${cy + r * 0.4}" rx="${4 + 9 * k}" ry="${3 + 4 * k}" fill="#e3a58f"/>`;
    if (stage >= 18) body += `<circle cx="${cx + r * 0.75}" cy="${cy + r * 0.55}" r="${4 + 16 * k}" fill="#d9e6ef" stroke="#9fb5c4"/>`; // túi niệu
    if (stage >= 28) body += `<path d="M${cx - r * 0.45} ${cy - r * 0.42} l-${6 + 6 * k} 3 l${6 + 6 * k} 3z" fill="#c9a08f"/>`; // mỏ
    if (stage >= 30) body += `<g fill="#cfa98c">${Array.from({ length: 12 }, (_, i) => `<circle cx="${cx + r * 0.6 * Math.cos(i / 2)}" cy="${cy + r * 0.6 * Math.sin(i / 2)}" r="1.4"/>`).join('')}</g>`;
  }
  if (!alive) body += `<rect width="${W}" height="${H}" fill="#3a2a2a" opacity="0.35"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${size}" role="img" aria-label="Phôi gà giai đoạn HH${stage}${somites ? `, ${somites} cặp đốt thân` : ''}${alive ? '' : ', đã chết'}"><rect width="${W}" height="${H}" rx="10" fill="#f4ecd6"/>${body}<text x="10" y="${H - 8}" font-size="12" font-family="IBM Plex Mono, ui-monospace, monospace" fill="#3a4652">HH${stage}${somites ? ` · ${somites} đốt` : ''}</text></svg>`;
}
