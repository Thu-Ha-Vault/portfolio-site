// Service worker của bản web: lấy từ mạng trước, mất mạng thì dùng bản đã lưu.
// Mỗi file app tải về (mã, dữ liệu, Three.js trong vendor/, hình đã mở, font) được lưu lại,
// nên sau một lần mở đầy đủ, app mở lại được khi không có Internet. Mạng có thì luôn lấy bản mới
// (không bị kẹt mã cũ khi sửa app). Bản cài trên máy (giao thức app://) không dùng file này.
const CACHE = 'virtual-lab-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !/^https?:/.test(req.url)) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    } catch (err) {
      const hit = await caches.match(req, { ignoreSearch: req.mode === 'navigate' });
      if (hit) return hit;
      throw err;
    }
  })());
});
