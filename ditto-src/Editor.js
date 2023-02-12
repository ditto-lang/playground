import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { defaultKeymap } from "@codemirror/commands";
import { LanguageSupport, LRLanguage } from "@codemirror/language";
import { dittoParser, dittoHighlighting } from "lezer-ditto";
import { styleTags } from "@lezer/highlight";

const dittoParserWithMetadata = dittoParser.configure({
  props: [styleTags(dittoHighlighting)],
});

const dittoLanguage = LRLanguage.define({
  parser: dittoParserWithMetadata,
  languageData: {
    commentTokens: { line: "--" },
  },
});

function ditto() {
  return new LanguageSupport(dittoLanguage, []);
}

/**
 * @param {string} doc
 * @param {Element} parent
 * @returns {() => EditorView}
 */
export function init_impl(doc, parent) {
  return () => {
    const state = EditorState.create({
      doc,
      extensions: [basicSetup, keymap.of(defaultKeymap), ditto()],
    });
    const editor = new EditorView({
      state: state,
      parent,
    });
    return editor;
  };
}

/**
 * @param {EditorView} editor
 * @returns {() => string}
 */
export function get_text_impl(editor) {
  return () => {
    return editor.state.doc.toString();
  };
}

/**
 * @param {EditorView} editor
 * @returns {() => void}
 */
export function destroy_impl(editor) {
  return () => {
    editor.destroy();
  };
}
