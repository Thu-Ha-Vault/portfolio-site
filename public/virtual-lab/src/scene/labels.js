import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Nhãn HTML gắn vào cảnh 3D. Mỗi nhãn chỉ hiện trong một khoảng cách tới camera để cảnh không rối:
// nhãn khu hiện khi nhìn từ xa, nhãn thiết bị và nhãn đồ trên bàn hiện khi lại gần.
export class LabelSet {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.tmp = new THREE.Vector3();
  }

  add(content, position, { kind = 'sub', min = 0, max = Infinity, parent, html = false, onClick } = {}) {
    const el = document.createElement(onClick ? 'button' : 'div');
    if (onClick) {
      el.type = 'button';
      el.addEventListener('click', onClick);
    }
    el.className = `label label-${kind}`;
    if (html) el.innerHTML = content;
    else el.textContent = content;
    const obj = new CSS2DObject(el);
    obj.position.copy(position);
    (parent ?? this.scene).add(obj);
    this.items.push({ obj, min, max });
    return obj;
  }

  // Bỏ một nhãn (nhãn tạm như dấu đã quan sát trên khay mổ)
  remove(obj) {
    this.items = this.items.filter((it) => it.obj !== obj);
    obj.parent?.remove(obj);
  }

  // occluded(viTríCamera, viTríNhãn): true thì ẩn nhãn (tường che, src/scene/building.js)
  update(camera) {
    for (const it of this.items) {
      it.obj.getWorldPosition(this.tmp);
      const d = this.tmp.distanceTo(camera.position);
      it.obj.visible = d >= it.min && d <= it.max && !this.occluded?.(camera.position, this.tmp);
    }
  }
}
