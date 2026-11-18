// Sinh học phân tử với plasmid (data/molbio.json): tách plasmid bằng cột (miniprep), cắt bằng enzyme giới hạn theo
// trình tự thật của pUC19 (GenBank L09137, vị trí nhận biết tìm trực tiếp trên trình tự vòng), điện di gel agarose
// dùng mô hình của figures/electrophoresis/model.mjs và lập bản đồ cắt. Dạng siêu xoắn, vòng hở, thẳng, vòng sợi đơn
// biến tính và DNA genome lẫn vào chạy ở vị trí biểu kiến khác nhau (bài 11). Không phụ thuộc DOM.

import { rng } from './random.js';
import { Notebook } from './notebook.js';
import { GEL, LADDER, bpbAfter, distanceOf } from '../../figures/electrophoresis/model.mjs';

export const MO_ACTIONS = {
  'mo-miniprep': 'Tách plasmid',
  'mo-digest': 'Cắt bằng enzyme giới hạn',
  'mo-gel': 'Điện di plasmid',
};
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');
const kb = (bp) => (bp >= 1000 ? `${fmt(bp / 1000, bp % 1000 ? 2 : 0)} kb` : `${Math.round(bp)} bp`);
// Kích thước biểu kiến so với DNA thẳng (minh hoạ)
const APPARENT = { sc: 0.9, nicked: 1.9, linear: 1, ss: 0.45 }; // siêu xoắn 0,9: bài 11 thấy plasmid khoảng 4 kb chạy như 3,5 kb

// Vị trí cắt (0-based, sau nucleotide thứ pos) của một enzyme trên trình tự vòng
export function cutSites(seq, enzyme) {
  const { site, cut } = enzyme;
  const ring = seq + seq.slice(0, site.length - 1);
  const out = [];
  for (let i = ring.indexOf(site); i !== -1 && i < seq.length; i = ring.indexOf(site, i + 1)) out.push((i + cut) % seq.length);
  return out;
}

// Độ dài các đoạn khi cắt plasmid vòng tại các vị trí đã cho (giảm dần)
export function fragments(length, cuts) {
  const c = [...new Set(cuts)].sort((a, b) => a - b);
  if (!c.length) return [];
  return c.map((p, i) => (i + 1 < c.length ? c[i + 1] - p : length - p + c[0])).sort((a, b) => b - a);
}

export class MolbioLab {
  constructor(data, { seed = Date.now() } = {}) {
    this.data = data;
    this.notebook = new Notebook();
    this.plasmids = this.#build();
    this.reset(seed);
  }

  // pUC19 và pUC19 mang đoạn chèn 1 kb giữa EcoRI và HindIII (đoạn chèn sinh giả ngẫu nhiên, không chứa vị trí nhận biết nào)
  #build() {
    const puc = this.data.pUC19;
    const E = this.data.enzymes;
    const [a] = cutSites(puc, E[this.data.insert.site[0]]);
    const [b] = cutSites(puc, E[this.data.insert.site[1]]);
    const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
    const r = rng(19);
    const sites = Object.values(E).map((e) => e.site);
    let ins = '';
    while (ins.length < this.data.insert.length) {
      const next = ins + 'ACGT'[Math.floor(r() * 4)];
      if (!sites.some((s) => next.endsWith(s))) ins = next;
    }
    return {
      pUC19: { name: 'pUC19', seq: puc },
      // Giữ nguyên hai vị trí nhận biết hai đầu đoạn chèn: G^AATTC … A^AGCTT
      'pUC19-ins': { name: 'pUC19 + đoạn chèn 1 kb', seq: puc.slice(0, lo) + puc.slice(lo, lo + E[this.data.insert.site[0]].site.length - E[this.data.insert.site[0]].cut) + ins + puc.slice(hi - E[this.data.insert.site[1]].cut, hi) + puc.slice(hi) },
    };
  }

  reset(seed = Date.now()) {
    this.random = rng(seed);
    this.prep = null;
    this.digests = [];
    this.notebook.clear();
  }

  do(action, params = {}) {
    const fn = { 'mo-miniprep': () => this.miniprep(params), 'mo-digest': () => this.digest(params), 'mo-gel': () => this.gel(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  // Tách plasmid bằng cột: ly giải kiềm (NaOH/SDS) quá 5 phút làm plasmid biến tính không hồi phục; lắc mạnh sau ly giải
  // làm đứt DNA genome và lẫn vào dịch; thiếu RNase thì có RNA. Lượng thu được từ dịch nuôi cấy qua đêm (minh hoạ).
  miniprep({ plasmid = 'pUC19-ins', cultureMl = 3, lysisMin = 3, mix = 'invert', rnase = true, elutionUl = 50 }) {
    const p = this.plasmids[plasmid];
    const yieldUg = 4 * Number(cultureMl) * Math.exp(0.15 * this.random.normal()); // khoảng 12 µg từ 3 mL (cột tối đa khoảng 20 µg)
    const ss = Math.min(0.7, Math.max(0, (Number(lysisMin) - 5) / 12));
    const g = mix === 'vortex' ? 0.35 : 0.06;
    const nicked = 0.1 + (mix === 'vortex' ? 0.1 : 0);
    const topo = { sc: Math.max(0, 1 - ss - nicked - 0.02), nicked, linear: 0.02, ss };
    const conc = (yieldUg * 1000) / Number(elutionUl);
    const rna = rnase ? 0 : 0.6;
    const r260280 = 1.86 + (rna ? 0.18 : 0) - (mix === 'vortex' ? 0.06 : 0) + 0.02 * this.random.normal();
    this.prep = { plasmid, length: p.seq.length, topo, genomic: g, rna, conc: conc * (1 + rna) };
    const events = [{ type: 'machine', label: 'Miniprep', text: `${cultureMl} mL dịch nuôi qua đêm: ly giải kiềm ${lysisMin} phút, trung hoà, ${mix === 'vortex' ? 'lắc vortex' : 'đảo nhẹ 6 lần'}, ly tâm, qua cột silica, rửa, thôi bằng ${elutionUl} µL EB. Đo được ${fmt(this.prep.conc, 0)} ng/µL, A260/A280 = ${fmt(r260280, 2)}.` }];
    const bad = [];
    if (ss > 0.05) bad.push(`ly giải ${lysisMin} phút (quá 5 phút): một phần plasmid biến tính thành vòng sợi đơn, chạy nhanh nhất trên gel`);
    if (mix === 'vortex') bad.push('lắc vortex sau khi cho dung dịch ly giải: DNA genome bị đứt thành mảnh, lẫn vào plasmid');
    if (!rnase) bad.push('thiếu RNase A: RNA lẫn vào, nồng độ đo ở 260 nm cao giả, A260/A280 trên 2');
    events.push(bad.length ? { type: 'warning', label: 'Chưa đúng', text: `${bad.join('; ')}.` } : { type: 'effect', label: 'Tác dụng', text: 'NaOH/SDS phá màng và làm biến tính DNA; trung hoà nhanh thì plasmid nhỏ, vòng kín hồi tính lại còn DNA genome dài kết tủa cùng protein và SDS. Plasmid gắn lên silica khi có muối chaotropic và được thôi ra bằng đệm muối thấp.' });
    this.notebook.add({ day: '', experiment: 'Plasmid', action: MO_ACTIONS['mo-miniprep'], subject: p.name, result: `${fmt(this.prep.conc, 0)} ng/µL`, A260_280: fmt(r260280, 2), lysisMin });
    return { ok: !bad.length, conc: this.prep.conc, events };
  }

  // Cắt 1 µg plasmid bằng một hoặc hai enzyme: units × giờ đủ thì cắt hết (1 đơn vị cắt hết 1 µg DNA λ trong 1 giờ, NEB)
  digest({ enzymes = ['EcoRI', 'HindIII'], units = 10, hours = 1, ug = 1 }) {
    if (!this.prep) return { ok: false, events: [{ type: 'warning', text: 'Chưa tách plasmid.' }] };
    const list = (Array.isArray(enzymes) ? enzymes : [enzymes]).filter((e) => this.data.enzymes[e]);
    const seq = this.plasmids[this.prep.plasmid].seq;
    const sites = list.flatMap((e) => cutSites(seq, this.data.enzymes[e]).map((pos) => ({ e, pos })));
    const frags = fragments(seq.length, sites.map((s) => s.pos));
    const done = 1 - Math.exp(-(Number(units) * Number(hours)) / (2 * Number(ug)));
    const d = { enzymes: list, sites, frags, done, ug: Number(ug), length: seq.length };
    this.digests.push(d);
    const events = [{ type: 'machine', label: 'Cắt', text: `${ug} µg plasmid + ${list.join(' + ')} (${units} đơn vị mỗi enzyme), 37 °C ${hours} giờ.` }];
    events.push(sites.length
      ? { type: 'effect', label: 'Vị trí cắt', text: `${sites.map((s) => `${s.e} ở ${s.pos}`).join(', ')}: ${frags.length} đoạn ${frags.map(kb).join(', ')}.` }
      : { type: 'info', label: 'Vị trí cắt', text: `${list.join(', ')} không có vị trí nhận biết trên plasmid này: plasmid giữ nguyên.` });
    if (done < 0.95 && sites.length) events.push({ type: 'warning', label: 'Chưa đúng', text: `Cắt chưa hết (khoảng ${fmt(done * 100, 0)} %): còn plasmid nguyên và các đoạn cắt dở, thêm băng lạ trên gel. Tăng enzyme hoặc thời gian.` });
    this.notebook.add({ day: '', experiment: 'Plasmid', action: MO_ACTIONS['mo-digest'], subject: list.join('+'), result: frags.map(kb).join(', '), done: fmt(done, 2) });
    return { ok: sites.length > 0 && done >= 0.95, frags, events };
  }

  // Băng của plasmid chưa cắt theo dạng cấu hình, cộng DNA genome lẫn và RNA
  #uncut(w = 1) {
    const p = this.prep;
    const L = p.length;
    const out = [];
    for (const [k, f] of Object.entries(p.topo)) if (f > 0.03) out.push({ bp: L * APPARENT[k], w: Math.min(1, f * 1.2) * w, note: { sc: 'siêu xoắn', nicked: 'vòng hở', linear: 'dạng thẳng', ss: 'vòng sợi đơn biến tính' }[k] });
    if (p.genomic > 0.03) out.push({ bp: 6000, w: Math.min(1, p.genomic * 2.5) * w, note: 'DNA genome đứt gãy' });
    if (p.rna) out.push({ bp: 150, w: 0.8 * w, note: 'RNA' });
    return out;
  }

  // lanes: các mã làn 'L' (ladder), 'P' (plasmid chưa cắt), 'RE1', 'RE2'… (lần cắt thứ n)
  gel({ lanes = ['L', 'P', 'RE1'], volts = 100, minutes = 40 }) {
    if (!this.prep) return { ok: false, events: [{ type: 'warning', text: 'Chưa có plasmid để điện di.' }] };
    const V = Math.min(GEL.vMax, Math.max(GEL.vMin, Number(volts)));
    const dye = Math.min(GEL.length, bpbAfter((V * Number(minutes)) / 60));
    const out = lanes.map((id) => {
      if (id === 'L') return { name: 'L', title: 'Ladder', bands: LADDER.map((bp) => ({ bp, w: [6000, 3000, 1000].includes(bp) ? 1 : 0.55 })) };
      if (id === 'P') return { name: 'P', title: 'Plasmid chưa cắt', bands: this.#uncut() };
      const d = this.digests[Number(id.replace('RE', '')) - 1];
      if (!d) return { name: id, title: id, bands: [] };
      const bands = d.frags.map((bp) => ({ bp, w: Math.min(1, (0.5 + (bp / d.length) * 1.2) * d.done), note: 'đoạn cắt' }));
      if (d.done < 0.95) bands.push(...this.#uncut(1 - d.done), ...(d.frags.length > 1 ? [{ bp: d.frags[0] + d.frags[d.frags.length - 1], w: 0.4 * (1 - d.done), note: 'cắt dở' }] : []));
      if (!d.frags.length) bands.push(...this.#uncut());
      return { name: id, title: `${d.enzymes.join(' + ')}`, bands };
    }).map((l) => ({ ...l, bands: l.bands.map((b) => ({ ...b, cm: distanceOf(b.bp, dye) })).filter((b) => b.cm <= GEL.length) }));
    const events = [{ type: 'machine', label: 'Điện di', text: `Gel agarose 1 %, ${V} V, ${minutes} phút: bromophenol blue đi được ${fmt(dye, 1)} cm.` }];
    for (const l of out.filter((x) => x.name !== 'L')) events.push({ type: 'info', label: `Làn ${l.name}`, text: l.bands.length ? l.bands.map((b) => `${kb(b.bp)}${b.note ? ` (${b.note})` : ''}`).join(', ') : 'không có băng' });
    if (dye >= GEL.length * 0.98) events.push({ type: 'warning', label: 'Chưa đúng', text: 'Chạy quá lâu: các đoạn nhỏ đã chạy ra khỏi gel.' });
    this.lastGel = { lanes: out, dyeCm: dye };
    return { ok: true, lanes: out, gelCm: GEL.length, dyeCm: dye, events };
  }

  figureData() {
    return this.lastGel ? { done: true, V: 100, lanes: this.lastGel.lanes.map((l) => ({ name: l.name, bands: l.bands.map(({ bp, w }) => ({ bp, w })) })) } : null;
  }
}
