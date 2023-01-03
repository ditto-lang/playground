import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { defaultKeymap } from "@codemirror/commands";

let startState = EditorState.create({
  doc: `module Maybe exports (..);
  
type Maybe(a) = Just(a) | Nothing;
    
  `,
  extensions: [keymap.of(defaultKeymap)],
});

new EditorView({
  state: startState,
  parent: document.body,
  extensions: [basicSetup],
});
