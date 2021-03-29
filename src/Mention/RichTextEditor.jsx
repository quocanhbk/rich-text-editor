import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import { BoldIcon, ItalicIcon } from "../assets/StyleIcon";
import styled from 'styled-components'

const StyledEditor = styled.div`
    border: 1px solid ${props => props.theme.color.border.primary};


`
const StyledBar = styled.div`
  display: flex;
  background: ${props => props.theme.color.background.secondary};
  gap: 0.5rem;
  padding: 0.5rem;
`

const StyledBody = styled.div`
  padding: 0.5rem;
`
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
      { style: 'ITALIC', component: <ItalicIcon />}
  ]

  return (
      <StyledEditor>
          <StyledBar>
              {
              INLINE_STYLING.map((inlineStyle) => {
                  return (
                      <div onMouseDown={toggleInline(inlineStyle.style)}>
                        {inlineStyle.component}
                      </div>
                  )
              })
              }
          </StyledBar>
          <StyledBody>
              <Editor
                  editorState={editorState}
                  handleKeyCommand={handleKeyCommand}
                  onChange={setEditorState}
              />
          </StyledBody>

      </StyledEditor>
  );
};

export default RichTextEditor;
