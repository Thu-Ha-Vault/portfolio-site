// Kiểm tra mặt bằng phòng thí nghiệm theo chuẩn thiết kế (giai đoạn 7). Đầu vào là dữ liệu thuần: toà nhà (BUILDING trong
// src/scene/layout.js: tường, cửa, phòng, chỗ thông nhau), đồ cố định và ngưỡng có nguồn (data/facility.json), vị trí máy
// (MACHINES_3D). Không dùng Three.js, không đụng DOM. Mỗi kết quả: { rule, ok, text, detail, source, ref }.
//
// Quãng đi bộ tính trên đồ thị điểm: điểm đầu, tâm các cửa và chỗ thông nhau, điểm đích; hai điểm nối nhau khi cùng một
// phòng (đi thẳng trong phòng, không tính đồ đạc chắn đường).

// Phòng chứa điểm (x, z): phòng nhỏ nhất có hộp chứa điểm (phòng đệm nằm trong phòng chung)
export function roomAt(rooms, x, z) {
  let best = null;
  for (const r of rooms) {
    const [x0, x1, z0, z1] = r.box;
    if (x < x0 || x > x1 || z < z0 || z > z1) continue;
    const area = (x1 - x0) * (z1 - z0);
    if (!best || area < best.area) best = { id: r.id, area };
  }
  return best?.id ?? null;
}

// Tâm từng lỗ mở có cánh hoặc không cánh trên tường, kèm hai phòng hai bên (lệch 0,3 m theo pháp tuyến tường)
export function openings(building) {
  const out = [];
  for (const w of building.walls) {
    const [ax, az] = w.a;
    const [bx, bz] = w.b;
    const len = Math.hypot(bx - ax, bz - az);
    const ux = (bx - ax) / len;
    const uz = (bz - az) / len;
    const alongX = Math.abs(ux) > 0.5;
    for (const o of w.open ?? []) {
      if (o.kind === 'window') continue;
      const s = alongX ? (o.at - ax) / ux : (o.at - az) / uz;
      const x = ax + ux * s;
      const z = az + uz * s;
      const sides = [1, -1].map((k) => roomAt(building.rooms, x - uz * 0.3 * k, z + ux * 0.3 * k));
      out.push({ wall: w.id, kind: o.kind, name: o.name, exit: !!o.exit, w: o.w, x, z, half: o.w / 2, ux, uz, rooms: sides });
    }
  }
  for (const l of building.links ?? []) out.push({ wall: null, kind: 'link', x: l.at[0], z: l.at[1], rooms: l.rooms, half: 0 });
  return out;
}

// Các đoạn tường liền (bỏ cửa và lối mở, giữ cửa sổ): [ax, az, bx, bz, tường ngoài?] cho bản đồ nhỏ, sơ đồ
export function wallSpans(building) {
  const out = [];
  for (const w of building.walls) {
    const [ax, az] = w.a;
    const [bx, bz] = w.b;
    const len = Math.hypot(bx - ax, bz - az);
    const ux = (bx - ax) / len;
    const uz = (bz - az) / len;
    const alongX = Math.abs(ux) > 0.5;
    const cuts = (w.open ?? []).filter((o) => o.kind !== 'window').map((o) => { const c = alongX ? (o.at - ax) / ux : (o.at - az) / uz; return [c - o.w / 2, c + o.w / 2]; }).sort((p, q) => p[0] - q[0]);
    let s = 0;
    for (const [s0, s1] of [...cuts, [len, len]]) {
      if (s0 - s > 1e-6) out.push([ax + ux * s, az + uz * s, ax + ux * s0, az + uz * s0, !!w.ext]);
      s = s1;
    }
  }
  return out;
}

// Quãng đi bộ ngắn nhất từ a tới b ({ x, z }); door: false thì không được đi qua cửa có cánh (chất ăn mòn: cửa là vật cản).
// Trả về { d, via } (via: danh sách cửa đi qua) hoặc { d: Infinity }.
export function walkDistance(building, a, b, { doors = true } = {}) {
  const rooms = building.rooms;
  const ops = openings(building).filter((o) => doors || o.kind !== 'door');
  const nodes = [{ ...a, rooms: [roomAt(rooms, a.x, a.z)] }, { ...b, rooms: [roomAt(rooms, b.x, b.z)] }, ...ops];
  const n = nodes.length;
  const share = (p, q) => p.rooms.some((r) => r && q.rooms.includes(r));
  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  const done = new Array(n).fill(false);
  dist[0] = 0;
  for (;;) {
    let i = -1;
    for (let k = 0; k < n; k++) if (!done[k] && dist[k] < Infinity && (i < 0 || dist[k] < dist[i])) i = k;
    if (i < 0 || i === 1) break;
    done[i] = true;
    for (let k = 0; k < n; k++) {
      if (done[k] || !share(nodes[i], nodes[k])) continue;
      const d = dist[i] + Math.hypot(nodes[i].x - nodes[k].x, nodes[i].z - nodes[k].z);
      if (d < dist[k]) { dist[k] = d; prev[k] = i; }
    }
  }
  const via = [];
  for (let k = prev[1]; k > 0; k = prev[k]) via.unshift(nodes[k]);
  return { d: dist[1], via };
}

const fmt = (v) => v.toFixed(2).replace('.', ',');

// Khoảng cách từ điểm tới đoạn thẳng a–b
function distSeg(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const l2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l2));
  return Math.hypot(px - ax - t * dx, pz - az - t * dz);
}

// Tia từ (x, z) theo hướng (dx, dz) chạm tường gần nhất ở quãng bao xa (tính tới tim tường)
function rayToWall(building, x, z, dx, dz) {
  let best = Infinity;
  for (const w of building.walls) {
    const [ax, az] = w.a;
    const sx = w.b[0] - ax, sz = w.b[1] - az;
    const den = dx * sz - dz * sx;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((ax - x) * sz - (az - z) * sx) / den;
    const u = ((ax - x) * dz - (az - z) * dx) / den;
    if (t > 1e-6 && u >= 0 && u <= 1) best = Math.min(best, t);
  }
  return best;
}

const FACE = { '+x': [1, 0], '-x': [-1, 0], '+z': [0, 1], '-z': [0, -1] };

// Chạy mọi luật. facility: data/facility.json; machines: MACHINES_3D (cần id, x, z hoặc bench); benches: { A: z, B: z };
// bench: bàn trung tâm { top }. Trả về mảng kết quả.
export function checkLayout(building, facility, { machines = [], benches = {}, bench = null } = {}) {
  const R = facility.rules;
  const out = [];
  const add = (rule, ok, detail) => out.push({ rule, ok, text: R[rule].text, detail, source: R[rule].source, ref: R[rule].ref });

  add('ceilMin', building.ceil >= R.ceilMin.value, `trần ${fmt(building.ceil)} m`);

  const ops = openings(building).filter((o) => o.kind === 'door');
  const narrow = ops.filter((o) => o.w + 1e-9 < R.doorMin.value);
  add('doorMin', narrow.length === 0, narrow.length ? `cửa hẹp: ${narrow.map((o) => `${o.name ?? o.wall} ${fmt(o.w)} m`).join('; ')}` : `${ops.length} cửa, hẹp nhất ${fmt(Math.min(...ops.map((o) => o.w)))} m`);

  const cor = building.rooms.find((r) => r.id === 'corridor');
  if (cor) {
    // Thông thuỷ: trừ nửa bề dày hai tường (tường trong và tường ngoài)
    const clear = cor.box[3] - cor.box[2] - building.intT / 2 - building.extT / 2;
    add('corridor', clear >= R.corridor.min - 1e-9 && clear <= R.corridor.max + 1e-9, `hành lang thông thuỷ ${fmt(clear)} m`);
  }

  if (bench) add('benchHigh', Math.abs(bench.top - R.benchHigh.value) <= R.benchHigh.tol, `bàn trung tâm cao ${Math.round(bench.top * 1000)} mm`);

  // Vòi rửa mắt: quãng đi bộ từ mỗi chỗ nguy hiểm tới vòi gần nhất; chất ăn mòn thì không đi qua cửa có cánh
  const eyes = facility.fixtures.filter((f) => f.eyewash);
  const far = [];
  const worst = [];
  for (const h of facility.hazards) {
    let best = { d: Infinity };
    for (const e of eyes) {
      const r = walkDistance(building, h, e, { doors: !h.corrosive });
      if (r.d < best.d) best = { ...r, e };
    }
    worst.push(best.d);
    if (!(best.d <= R.eyewashWalk.value)) far.push(`${h.name}: ${Number.isFinite(best.d) ? `${fmt(best.d)} m` : h.corrosive ? 'không có vòi trong cùng phòng' : 'không tới được'}`);
  }
  add('eyewashWalk', far.length === 0, far.length ? far.join('; ') : `xa nhất ${fmt(Math.max(...worst))} m`);

  const sinks = facility.fixtures.filter((f) => /sink$/.test(f.kind));
  const dry = sinks.filter((f) => !f.eyewash);
  add('eyewashAtSinks', dry.length === 0, dry.length ? `bồn chưa có vòi rửa mắt: ${dry.map((f) => f.id).join(', ')}` : `${sinks.length} bồn đều có vòi rửa mắt`);

  // Bồn rửa tay: mỗi phòng ướt có bồn rửa tay, và bồn gần cửa ra của phòng nhất là bồn rửa tay
  const miss = [];
  for (const r of building.rooms.filter((q) => q.wet)) {
    const own = sinks.filter((f) => roomAt(building.rooms, f.x, f.z) === r.id);
    const exits = openings(building).filter((o) => o.kind === 'door' && o.rooms.includes(r.id));
    if (!own.some((f) => f.kind === 'handsink')) { miss.push(`${r.name}: không có bồn rửa tay`); continue; }
    const nearest = (o) => own.reduce((p, f) => (Math.hypot(f.x - o.x, f.z - o.z) < Math.hypot(p.x - o.x, p.z - o.z) ? f : p));
    if (!exits.some((o) => nearest(o).kind === 'handsink')) miss.push(`${r.name}: bồn rửa tay không phải bồn gần cửa nhất`);
  }
  add('handwash', miss.length === 0, miss.length ? miss.join('; ') : 'mọi phòng ướt có bồn rửa tay cạnh cửa');

  // Tủ hút: cách mép cửa gần nhất
  const hood = facility.hazards.find((h) => h.id === 'hood');
  if (hood) {
    const d = Math.min(...ops.map((o) => distSeg(hood.x, hood.z, o.x - o.ux * o.half, o.z - o.uz * o.half, o.x + o.ux * o.half, o.z + o.uz * o.half)));
    add('hoodDoor', d >= R.hoodDoor.value, `tủ hút cách cửa gần nhất ${fmt(d)} m`);
  }

  // Tủ an toàn sinh học: tường đối diện mặt trước và cửa gần nhất
  const bsc = machines.find((m) => m.id === 'bsc');
  const bscFix = facility.hazards.find((h) => h.id === 'bsc');
  if (bsc && bscFix) {
    const [fx, fz] = FACE[bsc.face ?? '-x'];
    const opp = rayToWall(building, bscFix.x, bscFix.z, fx, fz);
    add('bscOpposite', opp >= R.bscOpposite.value, `mặt trước cách tường đối diện ${fmt(opp)} m`);
    const d = Math.min(...ops.map((o) => distSeg(bscFix.x, bscFix.z, o.x - o.ux * o.half, o.z - o.uz * o.half, o.x + o.ux * o.half, o.z + o.uz * o.half)));
    add('bscDoor', d >= R.bscDoor.value, `cách cửa gần nhất ${fmt(d)} m`);
  }

  // Phòng PCR: máy sau khuếch đại nằm trong phòng sau PCR, khu pha mẫu trước PCR ở phòng khác
  const P = R.pcr;
  const where = (m) => roomAt(building.rooms, m.x, m.z ?? benches[m.bench]);
  const wrong = P.machines.map((id) => machines.find((m) => m.id === id)).filter((m) => m && where(m) !== P.postRoom);
  const preRoom = roomAt(building.rooms, P.pre[0], P.pre[1]);
  add('pcr', wrong.length === 0 && preRoom !== P.postRoom, wrong.length ? `máy ngoài phòng sau PCR: ${wrong.map((m) => m.id).join(', ')}` : preRoom === P.postRoom ? 'khu trước PCR nằm trong phòng sau PCR' : `khu trước PCR ở "${building.rooms.find((r) => r.id === preRoom)?.name}", máy khuếch đại và điện di ở phòng sau PCR`);

  return out;
}
