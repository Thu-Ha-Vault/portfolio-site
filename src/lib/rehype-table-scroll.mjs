// rehype plugin: wraps every Markdown <table> in a focusable horizontal scroller (spec §6, "Tables (in prose)"),
// so wide tables scroll inside the column instead of widening the page, and keyboard users can scroll them
// with the arrow keys. The label is bilingual through the data-aria-vi / data-aria-en attributes that the
// language script in Base.astro copies into aria-label.
const LABEL = { vi: 'Bảng (cuộn ngang)', en: 'Table (scrolls sideways)' };

const isScroller = (n) =>
  n && n.type === 'element' && n.tagName === 'div' && [].concat(n.properties?.className || []).includes('table-scroll');

export default function rehypeTableScroll() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type !== 'element') return child;
        if (child.tagName === 'table' && !isScroller(node)) {
          return {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-scroll'],
              tabIndex: 0,
              role: 'region',
              ariaLabel: LABEL.vi,
              dataAriaVi: LABEL.vi,
              dataAriaEn: LABEL.en,
            },
            children: [child],
          };
        }
        walk(child);
        return child;
      });
    };
    walk(tree);
  };
}
