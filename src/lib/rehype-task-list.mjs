// rehype plugin: GFM task lists render as <li class="task-list-item"><input type="checkbox" disabled> text</li>,
// and the checkbox has no accessible name (WCAG 4.1.2), so screen readers announce "checkbox, checked" alone.
// Name each checkbox after its own item text (nested sub-lists excluded).
const isEl = (n, tag) => n && n.type === 'element' && (!tag || n.tagName === tag);
const ownText = (node) =>
  (node.children || [])
    .map((c) => (c.type === 'text' ? c.value : isEl(c) && !['ul', 'ol', 'input'].includes(c.tagName) ? ownText(c) : ''))
    .join('');

export default function rehypeTaskList() {
  return (tree) => {
    const walk = (node) => {
      for (const child of node.children || []) {
        if (isEl(child, 'li') && [].concat(child.properties?.className || []).includes('task-list-item')) {
          const box = (child.children || []).concat(...(child.children || []).filter((c) => isEl(c, 'p')).map((p) => p.children || []))
            .find((c) => isEl(c, 'input') && c.properties?.type === 'checkbox');
          const label = ownText(child).replace(/\s+/g, ' ').trim().slice(0, 160);
          if (box && label && !box.properties.ariaLabel) box.properties.ariaLabel = label;
        }
        walk(child);
      }
    };
    walk(tree);
  };
}
