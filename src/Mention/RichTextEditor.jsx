import React, { useState } from "react";
import styled from 'styled-components';
import { Editor, EditorState, RichUtils } from "draft-js";
import { Wrapper } from "../assets/StyleIcon";
import { ReactComponent as Bold } from '../assets/bold.svg';
import { ReactComponent as Italic } from "../assets/italic.svg";
import { ReactComponent as Underline } from "../assets/underline.svg";

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
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    if (newState) {
      setEditorState(newState);
    }
  };

  const toggleBlockStyle = (style) => (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleBlockType(editorState, style);
    if (newState) {
      setEditorState(newState);
    }
  }

  const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
  ];
  
  const BlockStyleControls = () => {
    return BLOCK_TYPES.map((blockStyle) => {
      return (
        <Wrapper onMouseDown={toggleBlockStyle(blockStyle.style)}>
          {blockStyle.label}
        </Wrapper>
      )
    })
  }

  const INLINE_STYLING = [
    { style: 'BOLD', component: <Bold />},
    { style: 'ITALIC', component: <Italic />},
    { style: 'UNDERLINE', component: <Underline />}
  ];

  const InlineStyleControls = () => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return INLINE_STYLING.map((inlineStyle) => {
      return (
        <Wrapper active={currentStyle.has(inlineStyle.style)} onMouseDown={toggleInline(inlineStyle.style)}>
          {inlineStyle.component}
        </Wrapper>
      );
    });
  };

  return (
      <StyledEditor>
          <StyledBar>
              {
                <>
                  <InlineStyleControls />
                  <BlockStyleControls />
                </>
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
