import React, {  } from 'react';

function DefaultEntryComponent(
  props
) {
  const {
    mention,
    theme,
    isFocused,
    searchValue,
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <span className={theme.mentionSuggestionsEntryText}>
        {props.mention.name}
      </span>
    </div>
  );
}

export default DefaultEntryComponent