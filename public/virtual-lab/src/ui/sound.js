// Âm thanh phòng thí nghiệm sinh bằng Web Audio (giai đoạn 7), không dùng file âm thanh: quạt tủ hút (tiếng ồn lọc
// dải), máy nén tủ lạnh và tủ đông (tiếng ù trầm), máy ly tâm đang quay (tiếng rít), quạt máy PCR đang chạy, tiếng bíp
// khi máy chạy xong, tiếng chảy khi rót. Âm lượng giảm theo khoảng cách từ người nghe (camera) tới máy. Mặc định tắt;
// trình duyệt chỉ cho bật âm thanh sau một lần bấm của người dùng. Cường độ, cao độ là minh hoạ.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function createSound({ listener, sources }) {
  let ctx = null;
  let master = null;
  let on = false;
  const live = [];

  function noiseBuffer() {
    const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  // Một nguồn: kind fan | hum | whine; vị trí [x, z]; active() cho biết máy đang chạy
  function makeSource(src, noise) {
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(master);
    if (src.kind === 'hum') {
      for (const [f, a] of [[100, 0.6], [200, 0.25], [300, 0.1]]) {
        const o = ctx.createOscillator();
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = a;
        o.connect(g).connect(gain);
        o.start();
      }
    } else if (src.kind === 'whine') {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = src.freq ?? 250;
      const g = ctx.createGain();
      g.gain.value = 0.35;
      o.connect(g).connect(gain);
      o.start();
      const n = ctx.createBufferSource();
      n.buffer = noise;
      n.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 900;
      n.connect(f).connect(gain);
      n.start();
    } else {
      const n = ctx.createBufferSource();
      n.buffer = noise;
      n.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = src.freq ?? 420;
      f.Q.value = 0.7;
      n.connect(f).connect(gain);
      n.start();
    }
    return { src, gain };
  }

  function start() {
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    const noise = noiseBuffer();
    for (const s of sources) live.push(makeSource(s, noise));
    return true;
  }

  // Cập nhật âm lượng theo khoảng cách và trạng thái máy
  function update() {
    if (!on || !ctx) return;
    const [lx, , lz] = listener();
    for (const { src, gain } of live) {
      const d = Math.hypot(src.pos[0] - lx, src.pos[1] - lz);
      const near = clamp(1 - d / (src.range ?? 8), 0, 1);
      const want = (src.active?.() ?? true) ? (src.level ?? 0.05) * near * near : 0;
      gain.gain.setTargetAtTime(want, ctx.currentTime, 0.15);
    }
  }
  const timer = setInterval(update, 250);

  return {
    set(v) {
      on = v;
      if (on && !ctx && !start()) return false;
      if (ctx) (on ? ctx.resume() : ctx.suspend());
      update();
      return on;
    },
    isOn: () => on,
    // Hai tiếng bíp ngắn khi máy chạy xong
    beep() {
      if (!on || !ctx) return;
      for (const k of [0, 0.22]) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = 1760;
        g.gain.setValueAtTime(0, ctx.currentTime + k);
        g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + k + 0.01);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + k + 0.15);
        o.connect(g).connect(master);
        o.start(ctx.currentTime + k);
        o.stop(ctx.currentTime + k + 0.2);
      }
    },
    dispose() { clearInterval(timer); ctx?.close(); },
  };
}
