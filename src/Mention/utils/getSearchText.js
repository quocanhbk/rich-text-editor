import getSearchTextAt from "./getSearchTextAt";

const getSearchText = (editorState, selection, triggers) => {
  const anchorKey = selection.getAnchorKey();
  const anchorOffset = selection.getAnchorOffset();
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(anchorKey);
  const blockText = currentBlock.getText();
  return getSearchTextAt(blockText, anchorOffset, triggers);
};

export default getSearchText;
