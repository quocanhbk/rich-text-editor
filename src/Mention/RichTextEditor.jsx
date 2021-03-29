import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "../assets/StyleIcon";

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
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    if (newState) {
      setEditorState(newState);
    }
  };

  const INLINE_STYLING = [
    { style: 'BOLD', component: <BoldIcon />},
    { style: 'ITALIC', component: <ItalicIcon />},
    { style: 'UNDERLINE', component: <UnderlineIcon />}
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
