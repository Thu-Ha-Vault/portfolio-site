import { esc } from './format.js';

// Trình soạn protocol trong nửa phải: điền tên, mục tiêu, kết luận; bấm "Ghi thao tác" rồi làm thí nghiệm, mỗi thao tác
// thành một bước; sửa chữ từng bước, đổi thứ tự, xoá; lưu vào danh sách "Của tôi" (trình duyệt), tải hoặc mở file JSON.
// callbacks: onRecord(on) → khi tắt trả về { steps, skipped }; onSave(p) → mảng lỗi; onDelete(id); onLoad(id) → protocol
export function createProtocolEditor(root, { zones, onRecord, onSave, onDelete, mine }) {
  let steps = [];
  let recording = false;
  let editingId = null;
  root.innerHTML = `
    <details class="editor">
      <summary class="section-title">Soạn protocol</summary>
      <div class="editor-body">
        <div class="g-row"><label class="g-label" for="ed-mine">Của tôi</label><select id="ed-mine" aria-label="Protocol đã soạn"></select><button type="button" class="btn btn-ghost btn-sm" id="ed-edit">Sửa</button><button type="button" class="btn btn-ghost btn-sm" id="ed-del">Xoá</button><button type="button" class="btn btn-ghost btn-sm" id="ed-new">Soạn mới</button></div>
        <label class="ed-field">Tên<input id="ed-title" type="text" maxlength="120"></label>
        <label class="ed-field">Lĩnh vực<input id="ed-field" type="text" maxlength="60" value="Tự soạn"></label>
        <label class="ed-field">Khu<select id="ed-zone">${zones.map((z) => `<option value="${esc(z.id)}">${esc(z.name)}</option>`).join('')}</select></label>
        <label class="ed-field">Mục tiêu<textarea id="ed-goal" rows="2"></textarea></label>
        <div class="g-row"><button type="button" class="btn" id="ed-rec" aria-pressed="false">Ghi thao tác</button><span class="session-state" id="ed-hint">Bấm ghi, làm thí nghiệm như bình thường, rồi bấm dừng: mỗi thao tác thành một bước.</span></div>
        <ol class="ed-steps" id="ed-steps"></ol>
        <label class="ed-field">Kết luận<textarea id="ed-concl" rows="2"></textarea></label>
        <div class="g-row"><button type="button" class="btn" id="ed-save">Lưu vào danh sách</button><button type="button" class="btn btn-ghost btn-sm" id="ed-json">Tải JSON</button><button type="button" class="btn btn-ghost btn-sm" id="ed-open">Mở JSON</button><input type="file" id="ed-file" accept=".json,application/json" hidden></div>
        <p class="ed-errors" id="ed-errors" role="alert"></p>
      </div>
    </details>`;
  const $ = (id) => root.querySelector(`#${id}`);
  const list = $('ed-steps');

  function renderSteps() {
    list.innerHTML = steps.map((s, i) => `<li class="ed-step">
      <textarea data-i="${i}" rows="2" aria-label="Chữ của bước ${i + 1}">${esc(s.text)}</textarea>
      <code class="ed-expect">${esc(JSON.stringify(s.expect))}</code>
      <span class="ed-btns"><button type="button" class="btn btn-ghost btn-sm" data-up="${i}" aria-label="Đưa bước ${i + 1} lên">↑</button><button type="button" class="btn btn-ghost btn-sm" data-down="${i}" aria-label="Đưa bước ${i + 1} xuống">↓</button><button type="button" class="btn btn-ghost btn-sm" data-del="${i}" aria-label="Xoá bước ${i + 1}">×</button></span>
    </li>`).join('');
  }
  list.addEventListener('input', (e) => {
    const i = e.target.dataset.i;
    if (i !== undefined) steps[Number(i)].text = e.target.value;
  });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const swap = (i, j) => { if (j >= 0 && j < steps.length) [steps[i], steps[j]] = [steps[j], steps[i]]; };
    if (b.dataset.up) swap(Number(b.dataset.up), Number(b.dataset.up) - 1);
    if (b.dataset.down) swap(Number(b.dataset.down), Number(b.dataset.down) + 1);
    if (b.dataset.del) steps.splice(Number(b.dataset.del), 1);
    renderSteps();
  });
  $('ed-rec').addEventListener('click', () => {
    recording = !recording;
    $('ed-rec').setAttribute('aria-pressed', String(recording));
    $('ed-rec').textContent = recording ? 'Dừng ghi' : 'Ghi thao tác';
    const res = onRecord(recording);
    if (!recording && res) {
      steps.push(...res.steps);
      $('ed-hint').textContent = `Thêm ${res.steps.length} bước.${res.skipped.length ? ` Bỏ qua ${res.skipped.length} thao tác chỉnh cài đặt (khí hậu, phôi cá): ghi vào mục tiêu nếu cần.` : ''}`;
      renderSteps();
    } else if (recording) $('ed-hint').textContent = 'Đang ghi: các thao tác từ giờ sẽ thành bước.';
  });
  const current = () => ({
    id: editingId,
    title: $('ed-title').value.trim(),
    field: $('ed-field').value.trim() || 'Tự soạn',
    zone: $('ed-zone').value,
    goal: $('ed-goal').value.trim(),
    steps: steps.map((s) => ({ text: s.text.trim(), expect: s.expect })),
    conclusion: $('ed-concl').value.trim(),
  });
  function fill(p) {
    editingId = p?.id ?? null;
    $('ed-title').value = p?.title ?? '';
    $('ed-field').value = p?.field ?? 'Tự soạn';
    $('ed-zone').value = p?.zone ?? zones[0].id;
    $('ed-goal').value = p?.goal ?? '';
    $('ed-concl').value = p?.conclusion ?? '';
    steps = (p?.steps ?? []).map((s) => ({ text: s.text, expect: { ...s.expect } }));
    renderSteps();
    $('ed-errors').textContent = '';
  }
  function refreshMine() {
    const m = mine();
    $('ed-mine').innerHTML = m.length ? m.map((p) => `<option value="${esc(p.id)}">${esc(p.title)}</option>`).join('') : '<option value="">(chưa có)</option>';
  }
  $('ed-save').addEventListener('click', () => {
    const errors = onSave(current());
    $('ed-errors').textContent = errors.length ? errors.join(' ') : 'Đã lưu: chọn trong danh sách Protocol ở trên (mục "Của tôi").';
    if (!errors.length) refreshMine();
  });
  $('ed-json').addEventListener('click', () => {
    const p = current();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' }));
    a.download = `${p.id ?? 'protocol'}.json`;
    document.body.append(a);
    a.click();
    a.remove();
  });
  $('ed-open').addEventListener('click', () => $('ed-file').click());
  $('ed-file').addEventListener('change', (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    f.text().then((t) => {
      try {
        fill({ ...JSON.parse(t), id: null });
      } catch {
        $('ed-errors').textContent = 'File không phải JSON.';
      }
    });
    e.target.value = '';
  });
  $('ed-edit').addEventListener('click', () => fill(mine().find((p) => p.id === $('ed-mine').value)));
  $('ed-del').addEventListener('click', () => { if ($('ed-mine').value) { onDelete($('ed-mine').value); refreshMine(); } });
  $('ed-new').addEventListener('click', () => fill(null));
  refreshMine();
  return { refreshMine };
}
