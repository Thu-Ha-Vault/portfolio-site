// rehype plugin: notes sometimes link to a dev server on the author's machine (http://localhost:8000).
// On the public site such a link goes nowhere, so render it as inline code instead of a dead <a>.
const LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/i;

export default function rehypeLocalLinks() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((c) => {
        if (c.type === 'element' && c.tagName === 'a' && LOCAL.test(String(c.properties?.href || ''))) {
          return { type: 'element', tagName: 'code', properties: {}, children: c.children };
        }
        walk(c);
        return c;
      });
    };
    walk(tree);
  };
}
