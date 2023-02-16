import "./index.css";

import { main as Main } from "./dist/Main.js";
import { CODE_QUERY_PARAM } from "./ditto-src/Main.js";
import { classHighlighter } from "@lezer/highlight";
import { themeHighlightStyle } from "./ditto-src/Editor.js";

const DEFAULT_CODE = `module Maybe exports (..)


type Maybe(a) =
    | Just(a)
    | Nothing

map = fn (mb, f) ->
    match mb with
    | Just(a) -> Just(f(a))
    | Nothing -> Nothing
    end
`;

function kebab(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function addThemeTokenStyles() {
  const style = document.createElement("style");
  for (const { tag, class: _, ...styles } of themeHighlightStyle.specs) {
    const className = Array.isArray(tag)
      ? classHighlighter.style(tag)
      : classHighlighter.style([tag]);
    if (className) {
      const rules = Object.entries(styles)
        .map(([key, value]) => `${kebab(key)}: ${value}`)
        .join(";");
      style.innerText += `.${className} { ${rules} }`;
    }
  }
  document.head.appendChild(style);
}

function main() {
  addThemeTokenStyles();

  let code = DEFAULT_CODE;

  const url = new URL(window.location);
  const codeParam = url.searchParams.get(CODE_QUERY_PARAM);
  if (codeParam) {
    try {
      code = window.atob(codeParam);
    } catch {}
  }

  const app = document.getElementById("app");
  Main(app, code)();
}
main();
