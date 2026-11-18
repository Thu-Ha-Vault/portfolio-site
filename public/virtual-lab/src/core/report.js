// Báo cáo thí nghiệm dạng Markdown theo mẫu lab-report của vault: frontmatter, rồi Mục đích, Nguyên lý,
// Vật liệu & phương pháp, Kết quả chính, Kết luận, và dữ liệu thô (CSV của sổ thí nghiệm). Bullet thụt lề bằng Tab.
// Không phụ thuộc DOM: nhận các thẻ kết quả đã chuyển thành chữ.

const STATE_MARK = { done: '✓', early: '✓ (sai thứ tự)', current: '…', todo: '·' };

const yamlText = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const oneLine = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const cell = (s) => oneLine(s).replace(/\|/g, '\\|');

function table(t) {
  if (!t?.head?.length) return [];
  return [
    `| ${t.head.map(cell).join(' | ')} |`,
    `| ${t.head.map(() => '---').join(' | ')} |`,
    ...t.rows.map((r) => `| ${r.map(cell).join(' | ')} |`),
  ];
}

// protocol: { title, field, goal, conclusion } hoặc null (chế độ tự do)
// steps: [{ text, state }] theo ProtocolTracker.state(i); entries: [{ no, title, step, lines: [[nhãn, chữ]], table }]
// notebooks: [{ name, file, csv }]; date: 'YYYY-MM-DD'
export function labReport({ protocol = null, steps = [], entries = [], notebooks = [], date, finished = false }) {
  const title = protocol ? protocol.title : 'Thí nghiệm tự do';
  const out = [
    '---',
    `title: ${yamlText(`Báo cáo: ${title}`)}`,
    'source: "Virtual Lab (phòng thí nghiệm ảo)"',
    'type: "lab-report"',
    `course: ${yamlText(protocol?.field ?? 'Thí nghiệm tự do')}`,
    `date: ${date}`,
    'tags:',
    '  - virtual-lab',
    '  - lab-report',
    '---',
    `# Báo cáo: ${title}`,
    '',
    '## Mục đích',
    `- ${oneLine(protocol?.goal ?? 'Thử các thao tác tự chọn trong phòng thí nghiệm ảo.')}`,
    '',
    '## Nguyên lý',
  ];
  // Nguyên lý: các dòng "Tác dụng", "Giải thích", "Phương trình" khác nhau trong các thẻ kết quả
  const seen = new Set();
  for (const e of entries) {
    for (const [label, text] of e.lines) {
      if (!/^(Tác dụng|Giải thích|Phương trình|Chỉ thị)$/.test(label)) continue;
      const t = oneLine(text);
      if (!t || seen.has(t)) continue;
      seen.add(t);
      out.push(`- **${label}**: ${t}`);
    }
  }
  if (!seen.size) out.push('- (chưa có thẻ kết quả nào giải thích nguyên lý)');
  out.push('', '## Vật liệu & phương pháp');
  if (steps.length) steps.forEach((s, i) => out.push(`- ${STATE_MARK[s.state] ?? '·'} Bước ${i + 1}: ${oneLine(s.text)}`));
  else out.push('- Chế độ tự do, không theo protocol.');
  out.push('', '## Kết quả chính');
  if (!entries.length) out.push('- Chưa có thao tác nào.');
  for (const e of entries) {
    out.push(`- **#${e.no} ${oneLine(e.title)}**${e.step ? ` (${oneLine(e.step)})` : ''}`);
    for (const [label, text] of e.lines) out.push(`\t- **${label}**: ${oneLine(text)}`);
    const rows = table(e.table);
    if (rows.length) out.push('', ...rows, '');
  }
  out.push('', '## Kết luận');
  const done = steps.filter((s) => s.state === 'done' || s.state === 'early').length;
  const early = steps.filter((s) => s.state === 'early').length;
  const warnings = entries.reduce((n, e) => n + e.lines.filter(([l]) => /^(Lưu ý|Nguy hiểm|Chưa đúng|Sai thùng|Chưa chắc)$/.test(l)).length, 0);
  if (steps.length) out.push(`- Làm xong ${done}/${steps.length} bước${early ? `, ${early} bước làm sai thứ tự` : ''}.`);
  out.push(`- ${entries.length} thao tác, ${warnings} cảnh báo trong thẻ kết quả.`);
  if (finished && protocol?.conclusion) out.push(`- ${oneLine(protocol.conclusion)}`);
  else if (protocol) out.push('- Protocol chưa hoàn thành: kết luận cần đối chiếu lại sau khi làm hết các bước.');
  const books = notebooks.filter((b) => b.csv && b.csv.split('\n').length > 1);
  if (books.length) {
    out.push('', '## Dữ liệu thô');
    for (const b of books) out.push(`### ${b.name}`, '', '```csv', b.csv.trim(), '```', '');
  }
  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

// Tên file gợi ý: "Báo cáo - <tên protocol> - YYYY-MM-DD.md", bỏ ký tự không hợp lệ trong tên file
export function reportFileName(protocol, date) {
  const name = (protocol?.title ?? 'Thí nghiệm tự do').replace(/[\\/:*?"<>|#^[\]]/g, '').replace(/\s+/g, ' ').trim();
  return `Báo cáo - ${name} - ${date}.md`;
}
