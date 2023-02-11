import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { defaultKeymap } from "@codemirror/commands";
import { ditto } from "./ditto";

let startState = EditorState.create({
  doc: `module Maybe exports (..)
  
type Maybe(a) = Just(a) | Nothing
    
  `,
  extensions: [basicSetup, keymap.of(defaultKeymap), ditto()],
});

new EditorView({
  state: startState,
  parent: document.body,
});
