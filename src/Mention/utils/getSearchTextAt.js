export default function getSearchTextAt(blockText,position,triggers) {
  const str = blockText.substr(0, position);
  const { begin, index } = triggers
    .map((trigger, triggerIndex) => ({
      begin: trigger.length === 0 ? 0 : str.lastIndexOf(trigger),
      index: triggerIndex,
    }))
    .reduce((left, right) => (left.begin >= right.begin ? left : right));
  const matchingString =
    triggers[index].length === 0
      ? str
      : str.slice(begin + triggers[index].length);
  const end = str.length;

  return {
    begin,
    end,
    matchingString,
  };
}