import { Notebook } from './notebook.js';

// Bản đồ vệ tinh quần đảo Cát Bà: đổi toạ độ địa lý ↔ UTM 48N, đọc độ cao Copernicus DEM GLO-30 và mặt nạ đất/nước
// Sentinel-2 đã cắt sẵn trong data/catba/ (script tools/catba/fetch.py), tính đường chim bay và mặt cắt địa hình
// giữa hai điểm. Điểm khảo sát lấy từ data/catba.json (toạ độ GPS trong báo cáo thực tập, hoặc OpenStreetMap).
// Không đụng DOM: main.js giải mã data/catba/height.png thành mảng rồi đưa vào bằng setGrid().

export const GEO_ACTIONS = {
  'geo-site': 'Xem điểm khảo sát trên bản đồ',
  'geo-pick': 'Đọc toạ độ và độ cao một điểm',
  'geo-route': 'Đo đường chim bay, mặt cắt địa hình',
  'geo-layer': 'Đổi lớp bản đồ',
};

// ---- UTM trên ellipsoid WGS84 (Snyder 1987, Map Projections – A Working Manual, công thức 8-9 đến 8-25) ----
const A = 6378137.0;
const F = 1 / 298.257223563;
const E2 = F * (2 - F);
const EP2 = E2 / (1 - E2);
const K0 = 0.9996;
const R_MEAN = 6371008.8; // bán kính trung bình của Trái Đất (IUGG), cho đường tròn lớn
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;
const lon0 = (zone) => rad((zone - 1) * 6 - 180 + 3);

export function ll2utm(lat, lon, zone = 48) {
  const phi = rad(lat);
  const s = Math.sin(phi);
  const c0 = Math.cos(phi);
  const n = A / Math.sqrt(1 - E2 * s * s);
  const t = Math.tan(phi) ** 2;
  const c = EP2 * c0 * c0;
  const a = c0 * (rad(lon) - lon0(zone));
  const m = A * ((1 - E2 / 4 - (3 * E2 ** 2) / 64 - (5 * E2 ** 3) / 256) * phi
    - ((3 * E2) / 8 + (3 * E2 ** 2) / 32 + (45 * E2 ** 3) / 1024) * Math.sin(2 * phi)
    + ((15 * E2 ** 2) / 256 + (45 * E2 ** 3) / 1024) * Math.sin(4 * phi)
    - ((35 * E2 ** 3) / 3072) * Math.sin(6 * phi));
  const x = K0 * n * (a + ((1 - t + c) * a ** 3) / 6 + ((5 - 18 * t + t * t + 72 * c - 58 * EP2) * a ** 5) / 120) + 500000;
  const y = K0 * (m + n * Math.tan(phi) * ((a * a) / 2 + ((5 - t + 9 * c + 4 * c * c) * a ** 4) / 24
    + ((61 - 58 * t + t * t + 600 * c - 330 * EP2) * a ** 6) / 720));
  return { x, y };
}

export function utm2ll(x, y, zone = 48) {
  const xx = x - 500000;
  const mu = y / K0 / (A * (1 - E2 / 4 - (3 * E2 ** 2) / 64 - (5 * E2 ** 3) / 256));
  const e1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2));
  const p1 = mu + ((3 * e1) / 2 - (27 * e1 ** 3) / 32) * Math.sin(2 * mu) + ((21 * e1 ** 2) / 16 - (55 * e1 ** 4) / 32) * Math.sin(4 * mu)
    + ((151 * e1 ** 3) / 96) * Math.sin(6 * mu) + ((1097 * e1 ** 4) / 512) * Math.sin(8 * mu);
  const s = Math.sin(p1);
  const n1 = A / Math.sqrt(1 - E2 * s * s);
  const t1 = Math.tan(p1) ** 2;
  const c1 = EP2 * Math.cos(p1) ** 2;
  const r1 = (A * (1 - E2)) / (1 - E2 * s * s) ** 1.5;
  const d = xx / (n1 * K0);
  const lat = p1 - ((n1 * Math.tan(p1)) / r1) * ((d * d) / 2 - ((5 + 3 * t1 + 10 * c1 - 4 * c1 * c1 - 9 * EP2) * d ** 4) / 24
    + ((61 + 90 * t1 + 298 * c1 + 45 * t1 * t1 - 252 * EP2 - 3 * c1 * c1) * d ** 6) / 720);
  const lon = lon0(zone) + (d - ((1 + 2 * t1 + c1) * d ** 3) / 6 + ((5 - 2 * c1 + 28 * t1 - 3 * c1 * c1 + 8 * EP2 + 24 * t1 * t1) * d ** 5) / 120) / Math.cos(p1);
  return { lat: deg(lat), lon: deg(lon) };
}

// Khoảng cách đường tròn lớn (haversine, bán kính trung bình); vài km thì sai khác với đường trắc địa trên ellipsoid
// chỉ cỡ 0,1–0,5 %
export function greatCircle(a, b) {
  const dphi = rad(b.lat - a.lat);
  const dl = rad(b.lon - a.lon);
  const h = Math.sin(dphi / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dl / 2) ** 2;
  return 2 * R_MEAN * Math.asin(Math.min(1, Math.sqrt(h)));
}

// 20°47′23″ B, 107°00′09″ Đ
export function dms(lat, lon) {
  const one = (v, pos, neg, w) => {
    const a = Math.abs(v);
    let d = Math.floor(a);
    let m = Math.floor((a - d) * 60);
    let s = Math.round(((a - d) * 60 - m) * 60);
    if (s === 60) { s = 0; m += 1; }
    if (m === 60) { m = 0; d += 1; }
    return `${String(d).padStart(w, '0')}°${String(m).padStart(2, '0')}′${String(s).padStart(2, '0')}″ ${v >= 0 ? pos : neg}`;
  };
  return `${one(lat, 'B', 'N', 2)}, ${one(lon, 'Đ', 'T', 3)}`;
}

// Giải mã height.png (RGBA của canvas): R × 256 + G = độ cao theo dm, B = phần đất trong ô (0 biển … 255 đất)
export function decodeHeight(rgba, w, h) {
  const elev = new Float32Array(w * h);
  const land = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    elev[i] = (rgba[4 * i] * 256 + rgba[4 * i + 1]) / 10;
    land[i] = rgba[4 * i + 2];
  }
  return { w, h, elev, land };
}

const dec = (v, d = 0) => Number(v).toFixed(d).replace('.', ',');

export class GeoLab {
  // data: data/catba.json; meta: data/catba/grid.json; grid: decodeHeight(...) hoặc null khi chưa tải được ảnh độ cao
  constructor(data, meta, grid = null) {
    this.data = data;
    this.meta = meta;
    this.grid = grid;
    this.sites = new Map(data.sites.map((s) => [s.id, s]));
    this.reset();
  }

  setGrid(grid) { this.grid = grid; }

  reset() {
    this.notebook = new Notebook();
    this.layer = 'sat';
    this.lastPick = null;
    this.lastRoute = null;
  }

  // Vị trí trên bản đồ: u từ mép tây (0) sang mép đông (1), v từ mép bắc (0) xuống mép nam (1)
  toMap(lat, lon) {
    const g = this.meta.utm;
    const { x, y } = ll2utm(lat, lon, g.zone);
    return { u: (x - g.x0) / (g.x1 - g.x0), v: (g.y1 - y) / (g.y1 - g.y0), x, y };
  }

  fromMap(u, v) {
    const g = this.meta.utm;
    return utm2ll(g.x0 + u * (g.x1 - g.x0), g.y1 - v * (g.y1 - g.y0), g.zone);
  }

  inside(lat, lon) {
    const { u, v } = this.toMap(lat, lon);
    return u >= 0 && u <= 1 && v >= 0 && v <= 1;
  }

  // Độ cao (m, nội suy song tuyến giữa tâm 4 ô lưới 50 m) và phần đất tại một điểm
  sample(lat, lon) {
    const G = this.grid;
    if (!G || !this.inside(lat, lon)) return { elev: null, land: null };
    const { u, v } = this.toMap(lat, lon);
    const fx = Math.min(Math.max(u * G.w - 0.5, 0), G.w - 1.001);
    const fy = Math.min(Math.max(v * G.h - 0.5, 0), G.h - 1.001);
    const i = Math.floor(fx);
    const j = Math.floor(fy);
    const tx = fx - i;
    const ty = fy - j;
    const at = (arr, ii, jj) => arr[jj * G.w + ii];
    const bil = (arr) => at(arr, i, j) * (1 - tx) * (1 - ty) + at(arr, i + 1, j) * tx * (1 - ty) + at(arr, i, j + 1) * (1 - tx) * ty + at(arr, i + 1, j + 1) * tx * ty;
    const landFrac = bil(G.land) / 255;
    return { elev: bil(G.elev), land: landFrac >= 0.5, landFrac };
  }

  do(action, params = {}) {
    const fn = { 'geo-site': () => this.site(params), 'geo-pick': () => this.pick(params), 'geo-route': () => this.route(params), 'geo-layer': () => this.setLayer(params) }[action];
    if (!fn) throw new Error(`Không có thao tác "${action}"`);
    return { action, ...fn() };
  }

  #where(s) {
    const r = this.sample(s.lat, s.lon);
    const h = r.elev === null ? 'chưa tải được lớp độ cao' : r.land ? `độ cao bề mặt ${dec(r.elev)} m (Copernicus DEM)` : 'mặt biển hoặc bãi ngập triều';
    return { r, h };
  }

  site({ site = 'trungtrang' }) {
    const s = this.sites.get(site);
    if (!s) return { ok: false, events: [{ type: 'warning', text: `Không có điểm "${site}" trên bản đồ.` }] };
    const { r, h } = this.#where(s);
    const src = this.data.sources[s.source] ?? s.source;
    const events = [{ type: 'machine', label: s.name, text: `${dms(s.lat, s.lon)} · ${h}. Toạ độ: ${src}.` }];
    if (s.lesson) events.push({ type: 'effect', label: 'Bài thực tập', text: s.lesson });
    // So độ cao trong báo cáo (GPS cầm tay) với mô hình bề mặt: DEM gồm cả tán rừng, nên thường cao hơn mặt đất
    if (s.alt != null && r.elev !== null) {
      const lo = s.altRange?.[0] ?? s.alt;
      const hi = s.altRange?.[1] ?? s.alt;
      const diff = r.elev < lo ? r.elev - lo : r.elev > hi ? r.elev - hi : 0;
      const range = lo === hi ? `${lo} m` : `${lo}–${hi} m`;
      events.push({ type: 'effect', label: 'Độ cao', text: `Báo cáo ghi ${range}; bản đồ cho ${dec(r.elev)} m (${diff === 0 ? 'nằm trong khoảng báo cáo' : `${diff > 0 ? 'cao hơn' : 'thấp hơn'} ${dec(Math.abs(diff), Math.abs(diff) < 10 ? 1 : 0)} m`}). ${this.data.notes.dem}` });
    }
    if (s.note) events.push({ type: 'effect', label: 'Ghi chú', text: s.note });
    this.lastPick = { lat: s.lat, lon: s.lon, elev: r.elev, site: s.id };
    this.notebook.add({ day: '', experiment: 'Bản đồ Cát Bà', action: GEO_ACTIONS['geo-site'], subject: s.name, result: r.elev === null ? '' : `${dec(r.elev)} m`, lat: s.lat.toFixed(5), lon: s.lon.toFixed(5), report_alt: s.alt ?? '' });
    return { ok: true, site: s.id, lat: s.lat, lon: s.lon, elev: r.elev, events };
  }

  // Một điểm bất kỳ (bấm trên bản đồ 3D hoặc chọn trong bảng): toạ độ, độ cao, đất hay biển
  pick({ lat, lon, place = null }) {
    lat = Number(lat);
    lon = Number(lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !this.inside(lat, lon)) return { ok: false, events: [{ type: 'warning', text: 'Điểm nằm ngoài khung bản đồ Cát Bà.' }] };
    const name = place ? this.sites.get(place)?.name ?? place : 'Điểm vừa chọn';
    const { r, h } = this.#where({ lat, lon });
    this.lastPick = { lat, lon, elev: r.elev, site: place };
    this.notebook.add({ day: '', experiment: 'Bản đồ Cát Bà', action: GEO_ACTIONS['geo-pick'], subject: name, result: r.elev === null ? '' : r.land ? `${dec(r.elev)} m` : 'biển', lat: lat.toFixed(5), lon: lon.toFixed(5) });
    return { ok: true, lat, lon, elev: r.elev, land: r.land, events: [{ type: 'machine', label: name, text: `${dms(lat, lon)} · ${h}.` }] };
  }

  // Đường chim bay giữa hai điểm và mặt cắt địa hình dọc đường đó (lấy mẫu mỗi khoảng 50 m, bằng ô lưới DEM)
  route({ from = 'vqg', to = 'aoech' }) {
    const a = this.sites.get(from);
    const b = this.sites.get(to);
    if (!a || !b || a === b) return { ok: false, events: [{ type: 'warning', text: 'Chọn hai điểm khác nhau.' }] };
    const dist = greatCircle(a, b);
    const pa = this.toMap(a.lat, a.lon);
    const pb = this.toMap(b.lat, b.lon);
    const n = Math.max(2, Math.ceil(dist / (this.meta.height?.res_m ?? 50)));
    const pts = [];
    let climb = 0;
    let fall = 0;
    let sea = 0;
    let top = -Infinity;
    let prev = null;
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      const ll = this.fromMap(pa.u + (pb.u - pa.u) * t, pa.v + (pb.v - pa.v) * t);
      const r = this.sample(ll.lat, ll.lon);
      const e = r.elev ?? 0;
      if (r.land === false) sea += 1;
      if (prev !== null) { if (e > prev) climb += e - prev; else fall += prev - e; }
      top = Math.max(top, e);
      prev = e;
      pts.push([+(t * dist / 1000).toFixed(3), +e.toFixed(1)]);
    }
    const seaFrac = sea / (n + 1);
    const events = [
      { type: 'machine', label: 'Đường chim bay', text: `${a.name} → ${b.name}: ${dec(dist / 1000, 2)} km, cao nhất ${dec(top)} m, tổng lên ${dec(climb)} m, tổng xuống ${dec(fall)} m${seaFrac > 0.02 ? `, ${dec(seaFrac * 100)} % chiều dài đi qua mặt biển` : ''}.` },
      { type: 'effect', label: 'Lưu ý', text: this.data.notes.route },
    ];
    this.lastRoute = { from, to, dist, climb, top };
    this.notebook.add({ day: '', experiment: 'Bản đồ Cát Bà', action: GEO_ACTIONS['geo-route'], subject: `${a.name} → ${b.name}`, result: `${dec(dist / 1000, 2)} km`, climb_m: Math.round(climb), max_m: Math.round(top) });
    return { ok: true, from, to, dist, climb, fall, top, seaFrac, series: [{ name: 'độ cao bề mặt', points: pts }], events };
  }

  setLayer({ layer = 'sat' }) {
    this.layer = layer === 'height' ? 'height' : 'sat';
    const L = this.data.layers[this.layer];
    return { ok: true, layer: this.layer, events: [{ type: 'machine', label: L.name, text: L.text }] };
  }

  figureData() {
    return { layer: this.layer, pick: this.lastPick, route: this.lastRoute };
  }
}
