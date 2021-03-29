import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import { BoldIcon, ItalicIcon } from "../assets/StyleIcon";

const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInline = (style) => (e) => {
    e.preventDefault();
    console.log(style)
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    if (newState) {
      setEditorState(newState);
    }
  };

  const INLINE_STYLING = [
    { style: 'BOLD', component: <BoldIcon />},
    { style: 'Italic', component: <ItalicIcon />}
  ]

  return (
    <div>
      <div>
        {
          INLINE_STYLING.map((inlineStyle) => {
            return (
              <div onMouseDown={toggleInline(inlineStyle.style)}>
                {inlineStyle.component}
              </div>
            )
          })
        }
      </div>
      <Editor
        style={{ backgroundColor: "#fffff" }}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
      />
    </div>
  );
};

export default RichTextEditor;
