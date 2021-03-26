const getRelativeParent = (element) => {
  if (!element) {
    return null;
    }

  const position = window.getComputedStyle(element).getPropertyValue('position')

  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};


export default function positionSuggestions({decoratorRect, popover, props, inputRef}) {
  const relativeParent = getRelativeParent(popover.parentElement);
  const viewport = {width: window.innerWidth, height: window.innerHeight}
  
  let relativeRect = {}
  let popoverRect = popover.getBoundingClientRect()
  if (relativeParent) {
    const relativeParentRect = relativeParent.getBoundingClientRect();
    relativeRect = {
      scrollLeft: relativeParent.scrollLeft,
      scrollTop: relativeParent.scrollTop,
      left: decoratorRect.left - relativeParentRect.left,
      top: decoratorRect.bottom - relativeParentRect.top,
    };
  } else {
    relativeRect = {
      scrollTop: window.pageYOffset || document.documentElement.scrollTop,
      scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
      top: decoratorRect.bottom,
      left: decoratorRect.left,
    };
  }
  let left = relativeRect.left + relativeRect.scrollLeft;
  left = viewport.width - relativeRect.left - 24 < popoverRect.width ? viewport.width - popoverRect.width - 24 : left
  let top
  let condition
  if (inputRef) {
    const container = inputRef.getBoundingClientRect()
    condition = viewport.height - relativeRect.top - 24 < 220
    top = relativeRect.top + relativeRect.scrollTop - (condition ? container.height : 0);
  } else {
    condition = false
    top = relativeRect.top + relativeRect.scrollTop;
  }
  
  let transform;
  let transition;
  if (props.open) {
      transform = condition ? 'translateY(-100%) scale(1)' : 'scale(1)';
      transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
    transform,
    transformOrigin: '1em 0%',
    transition,
  };
}