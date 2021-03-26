import { EditorState, SelectionState } from 'draft-js';
import getSearchTextAt, { SearchTextAtResult } from './getSearchTextAt';

const abc = (
  editorState,
  selection,
  trigger
) => {
  const anchorKey = selection.getAnchorKey();
  const anchorOffset = selection.getAnchorOffset();
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(anchorKey);
  const blockText = currentBlock.getText();
  return getSearchTextAt(blockText, anchorOffset, trigger);
};

export default abc