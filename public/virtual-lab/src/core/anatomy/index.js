// Hình học giải phẫu của các mẫu mổ (xem kit.js về hệ toạ độ). Mỗi loài một module, trả về:
//   frame   [x0, x1, y0, y1] vùng vẽ (gồm cả chi, vạt da, hình phóng to khoang miệng)
//   stretch giãn ngang trên hình SVG (giun dài mảnh), 3D không giãn
//   closed(side)  mặt ngoài khi chưa mổ; side 'up' là mặt bài yêu cầu, 'down' là mặt kia (đặt sai)
//   opened  { body, flaps, cavity, deep }: phần thân còn thấy, vạt thành cơ thể phanh ra, đáy khoang, lớp sát lưng
//   organs  { id: { parts, anchor, when } } theo thứ tự vẽ (sâu trước); id trùng data/dissection.json
//   pins    { 2: [...], 4: [...] } vị trí đinh ghim; cut(line) đường cắt; spill chỗ dịch tràn; note chú thích hình
import frog from './frog.js';
import mouse from './mouse.js';
import carp from './carp.js';
import shrimp from './shrimp.js';
import earthworm from './earthworm.js';
import ascaris from './ascaris.js';
import snail from './snail.js';
import cockroach from './cockroach.js';

const ART = { frog, mouse, carp, shrimp, earthworm, ascaris, snail, cockroach };

export const hasAnatomy = (id) => Boolean(ART[id]);

// f: DissectLab.figureData() (cần male, open, removed)
export function anatomyOf(id, f = {}) {
  const make = ART[id];
  return make ? make(f) : null;
}
