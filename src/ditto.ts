import { LanguageSupport, LRLanguage } from "@codemirror/language";
import { dittoParser, dittoHighlighting } from "lezer-ditto";
import { styleTags } from "@lezer/highlight";

let dittoParserWithMetadata = dittoParser.configure({
  props: [styleTags(dittoHighlighting)],
});

export const dittoLanguage = LRLanguage.define({
  parser: dittoParserWithMetadata,
  languageData: {
    commentTokens: { line: "--" },
  },
});

export function ditto() {
  return new LanguageSupport(dittoLanguage, []);
}
