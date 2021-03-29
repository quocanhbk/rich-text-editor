import React, { useState } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import { BoldIcon } from '../assets/Bold';

const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(() => 
    EditorState.createEmpty(),
  );
  
  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  const toggleBold = (event) => {
    event.preventDefault();
    const newState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
    if (newState) {
      setEditorState(newState);
    }
  }
  
  return (
    <div>
      <div>
        <BoldIcon onMouseDown={toggleBold} />
      </div>
      <Editor style={{ backgroundColor: '#fffff' }} editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={setEditorState} />
    </div>
    
  )
};

export default RichTextEditor