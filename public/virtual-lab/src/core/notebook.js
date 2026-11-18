// Sổ thí nghiệm: ghi lại mọi thao tác và số đếm theo ngày ảo, xuất CSV để phân tích ngoài (Excel, R).

export class Notebook {
  constructor() {
    this.rows = [];
  }

  // row: { day, experiment, action, subject, result, ...số đếm (cột tuỳ ý) }
  add(row) {
    this.rows.push({ ...row });
  }

  clear() {
    this.rows = [];
  }

  toCSV() {
    const base = ['day', 'experiment', 'action', 'subject', 'result'];
    const extra = [...new Set(this.rows.flatMap((r) => Object.keys(r)))].filter((k) => !base.includes(k));
    const cols = [...base, ...extra];
    const cell = (v) => {
      const s = v === undefined || v === null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return [cols.join(','), ...this.rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n');
  }
}
