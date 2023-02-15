import { parser } from "@lezer/javascript";
import { highlightTree, classHighlighter } from "@lezer/highlight";

/**
 * @template Html
 * @param {string} source
 * @param {(classes: string[], text: string) => Html} mk_span
 * @param {(text: string) => Html} mk_text
 * @returns {Html[]}
 */
export function highlight_js_impl(source, mk_span, mk_text) {
  const tree = parser.parse(source);
  const elements = [];
  let index = 0;

  highlightTree(tree, classHighlighter, (from, to, classes) => {
    if (from > index) {
      // children.push({ type: "text", value: source.slice(index, from) });
      elements.push(mk_text(source.slice(index, from)));
    }
    elements.push(mk_span(classes.split(/\s+/), source.slice(from, to)));
    index = to;
  });

  if (index < source.length) {
    elements.push(mk_text(source.slice(index)));
  }

  return elements;
}
