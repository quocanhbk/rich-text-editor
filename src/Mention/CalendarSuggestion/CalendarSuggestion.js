import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {genKey} from 'draft-js';
import escapeRegExp from 'lodash/escapeRegExp';
import addMention from '../modifiers/addMention';
import decodeOffsetKey from '../utils/decodeOffsetKey';
import positionSuggestions from '../utils/positionSuggestion'
import CalendarPopup from './CalendarPopup'
import styled from 'styled-components'
import getSearchText from '../utils/getSearchText';

const StyledPopover = styled.div`
    border: 0 !important;
    background: transparent !important;
    padding: 0 !important;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transform-origin: 50% 0%;
    transform: scaleY(0);
    position: absolute;
`

export class CalendarSuggestion extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    entityMutability: PropTypes.oneOf(['SEGMENTED', 'IMMUTABLE', 'MUTABLE']),
    entryComponent: PropTypes.func,
    onAddMention: PropTypes.func
  };

  state = {
    focusedDate: new Date(),
    calendarTable: []
  };

  key = genKey();
  popover;
  activeOffsetKey;
  lastSearchValue;
  lastSelectionIsInsideWord;
  date = new Date();
  constructor(props) {
    super(props);
    this.date = new Date()
    this.setState({calendarTable: this.updateCalendarTable()})
    this.setState({focusedDate: new Date()})
    this.props.callbacks.onChange = this.onEditorStateChange;
  }
  getDaysInMonth = (m, y) => {
    m += 1;
    return /8|3|5|10/.test(--m)?30:m===1?(!(y%4)&&y%100)||!(y%400)?29:28:31;
  }
  componentDidMount() {
    this.setState({calendarTable: this.updateCalendarTable()})
  }
  updateCalendarTable = () => {
    var dayofmonth = []
    let id = 0;
    let previousNumDate = this.getDaysInMonth(this.date.getMonth() - 1)
    //get day of week of the first day of the month
    var x = new Date(this.date.getFullYear(),this.date.getMonth(), 1).getDay()

    for (var i = 1 - (x + 6 ) % 7; i <= this.getDaysInMonth(this.date.getMonth(), this.date.getFullYear()); i++) {
        if (i <= 0) { dayofmonth.push({id: id, month: "previous", value: previousNumDate + i}) }
        else { dayofmonth.push({id: id, month: "current", value: i}) }
        id++
    }
    for (var j = 0; j < dayofmonth.length % 7; j++) {
        dayofmonth.push({id: id, month: "next", value: j + 1})
        id++
    }
    return dayofmonth
  }
  swipe = (direction) => {
    this.date.setMonth(this.date.getMonth() + (direction === "next" ? 1 : -1), 1)
    this.setState({calendarTable: this.updateCalendarTable()})
}
  componentDidUpdate() {
    if (this.popover) {
      // Note: this is a simple protection for the error when componentDidUpdate
      // try to get new getPortalClientRect, but the key already was deleted by
      // previous action. (right now, it only can happened when set the mention
      // trigger to be multi-characters which not supported anyway!)
      if (!this.props.store.getAllSearches().has(this.activeOffsetKey)) {
        return;
      }
      const decoratorRect = this.props.store.getPortalClientRect(this.activeOffsetKey)
      const newStyles = positionSuggestions({
        decoratorRect,
        props: this.props,
        popover: this.popover,
        inputRef: this.props.inputRef
      });
      for (const [key, value] of Object.entries(newStyles)) {
        (this.popover.style)[key] = value;
      }
    }
  }

  componentWillUnmount() {
    this.props.callbacks.onChange = undefined;
  }

  onEditorStateChange = (editorState) => {
    const searches = this.props.store.getAllSearches();
    // if no search portal is active there is no need to show the popover
    if (searches.size === 0) {
      return editorState;
    }

    const removeList = () => {
      this.props.store.resetEscapedSearch();
      this.closeDropdown();
      return editorState;
    };

    // get the current selection
    const selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const anchorOffset = selection.getAnchorOffset();

    // the list should not be visible if a range is selected or the editor has no focus
    if (!selection.isCollapsed() || !selection.getHasFocus())
      return removeList();

    // identify the start & end positon of each search-text
    const offsetDetails = searches.map((offsetKey) =>
      decodeOffsetKey(offsetKey)
    );

    // a leave can be empty when it is removed due event.g. using backspace
    // do not check leaves, use full decorated portal text
    const leaves = offsetDetails
      .filter((offsetDetail) => offsetDetail.blockKey === anchorKey)
      .map((offsetDetail) =>
        editorState
          .getBlockTree(offsetDetail.blockKey)
          .getIn([offsetDetail.decoratorKey])
      );

    // if all leaves are undefined the popover should be removed
    if (leaves.every((leave) => leave === undefined)) {
      return removeList();
    }

    // Checks that the cursor is after the @ character but still somewhere in
    // the word (search term). Setting it to allow the cursor to be left of
    // the @ causes troubles due selection confusion.
    const blockText = editorState
      .getCurrentContent()
      .getBlockForKey(anchorKey)
      .getText();
    const triggerForSelectionInsideWord = leaves
      .filter((leave) => leave !== undefined)
      .map(
        ({ start, end }) =>
          this.props.mentionTriggers
            .map((trigger) =>
              // @ is the first character
              (start === 0 &&
                blockText.substr(0, trigger.length) === trigger &&
                anchorOffset <= end) ||
              // @ is in the text or at the end, multi triggers
              (this.props.mentionTriggers.length > 1 &&
                anchorOffset >= start + trigger.length &&
                (blockText.substr(start + 1, trigger.length) === trigger || blockText.substr(start, trigger.length) === trigger) &&
                anchorOffset <= end) ||
              // @ is in the text or at the end, single trigger
              (this.props.mentionTriggers.length === 1 &&
                anchorOffset >= start + trigger.length &&
                anchorOffset <= end)
                ? trigger
                : undefined
            )
            .filter((trigger) => trigger !== undefined)[0]
      )
      .filter((trigger) => trigger !== undefined);

    if (triggerForSelectionInsideWord.isEmpty()) return removeList();

    const [
      activeOffsetKey,
      activeTrigger,
    ] = triggerForSelectionInsideWord.entrySeq().first();

    const lastActiveOffsetKey = this.activeOffsetKey;
    this.activeOffsetKey = activeOffsetKey;

    this.onSearchChange(
      editorState,
      selection,
      this.activeOffsetKey,
      lastActiveOffsetKey,
      activeTrigger
    );

    // make sure the escaped search is reseted in the cursor since the user
    // already switched to another mention search
    if (!this.props.store.isEscaped(this.activeOffsetKey || '')) {
      this.props.store.resetEscapedSearch();
    }

    // If none of the above triggered to close the window, it's safe to assume
    // the dropdown should be open. This is useful when a user focuses on another
    // input field and then comes back: the dropdown will show again.
    if (
      !this.props.open &&
      !this.props.store.isEscaped(this.activeOffsetKey || '')
    ) {
      this.openDropdown();
    }

    // makes sure the focused index is reseted every time a new selection opens
    // or the selection was moved to another mention search
    if (lastActiveOffsetKey !== this.activeOffsetKey) {
      this.setState({
        focusedOptionIndex: 0,
      });
    }

    return editorState;
  };

  onSearchChange = (editorState, selection) => {
    const { matchingString: searchValue } = getSearchText(
      editorState,
      selection,
      this.props.mentionTrigger
    );
    if (searchValue && this.props.open) {
      this.closeDropdown()
    }
    return searchValue

  };
  onDownArrow = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    const newDate = new Date(this.state.focusedDate.getFullYear(), this.state.focusedDate.getMonth(), this.state.focusedDate.getDate() + 7)
    if (newDate.getMonth() !== this.state.focusedDate.getMonth()) {
      //Swipe Next
      this.swipe('next')
    }
    this.setState({focusedDate: newDate})
  };


  onUpArrow = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    const newDate = new Date(this.state.focusedDate.getFullYear(), this.state.focusedDate.getMonth(), this.state.focusedDate.getDate() - 7)
    if (newDate.getMonth() !== this.state.focusedDate.getMonth()) {
      //Swipe Prev
      this.swipe('previous')
    }
    this.setState({focusedDate: newDate})
  };

  onNextArrow = (keyboardEvent) => {
    keyboardEvent.preventDefault()
    const newDate = new Date(this.state.focusedDate.getFullYear(), this.state.focusedDate.getMonth(), this.state.focusedDate.getDate() + 1)
    if (newDate.getMonth() !== this.state.focusedDate.getMonth()) {
      //Swipe Next
      this.swipe('next')
    }
    this.setState({focusedDate: newDate})
  }

  onPrevArrow = (keyboardEvent) => {
    keyboardEvent.preventDefault()
    // this.closeDropdown()
    const newDate = new Date(this.state.focusedDate.getFullYear(), this.state.focusedDate.getMonth(), this.state.focusedDate.getDate() - 1)
    if (newDate.getMonth() !== this.state.focusedDate.getMonth()) {
      //Swipe Next
      this.swipe('prev')
    }
    this.setState({focusedDate: newDate})
  }

  onTab = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    this.commitSelection();
  };

  onEscape = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    this.closeDropdown();
  };

  onMentionSelect = (mention) => {
    // Note: This can happen in case a user typed @xxx (invalid mention) and
    // then hit Enter. Then the mention will be undefined.
    if (!mention) {
      return;
    }
    // if (this.props.onAddMention) {
    //   this.props.onAddMention(mention);
    // }
    const dateString = mention.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2}) + "/" + (mention.getMonth()+1).toLocaleString(undefined, {minimumIntegerDigits: 2}) +  "/" + mention.getFullYear()
    if (dateString === "01/01/1970") {
      this.closeDropdown()
      return
    }
    const dateData = {id: mention.getTime(), name: dateString, value: mention}
    this.closeDropdown();

    const newEditorState = addMention(
      this.props.store.getEditorState(),
      dateData,
      this.props.mentionPrefix,
      this.props.mentionTrigger,
      this.props.entityMutability
    );
    this.props.store.setEditorState(newEditorState);
  };

  commitSelection = () => {
    if (!this.props.store.getIsOpened()) {
      return 'not-handled';
    }

    this.onMentionSelect(this.state.focusedDate);
    return 'handled';
  };

  openDropdown = () => {
    // This is a really nasty way of attaching & releasing the key related functions.
    // It assumes that the keyFunctions object will not loose its reference and
    // by this we can replace inner parameters spread over different modules.
    // This better be some registering & unregistering logic. PRs are welcome :)
    this.date = new Date()
    this.setState({calendarTable: this.updateCalendarTable()})
    this.setState({focusedDate: new Date()})
    this.props.callbacks.handleReturn = this.commitSelection;
    this.props.callbacks.keyBindingFn = (keyboardEvent) => {
      // arrow down
      if (keyboardEvent.keyCode === 40) {
        this.onDownArrow(keyboardEvent);
      }
      // arrow up
      if (keyboardEvent.keyCode === 38) {
        this.onUpArrow(keyboardEvent);
      }
      // arrow next
      if (keyboardEvent.keyCode === 39) {
        this.onNextArrow(keyboardEvent)
      }
      //arror prev
      if (keyboardEvent.keyCode === 37) {
        this.onPrevArrow(keyboardEvent)
      }
      // escape
      if (keyboardEvent.keyCode === 27) {
        this.onEscape(keyboardEvent);
      }
      // tab
      if (keyboardEvent.keyCode === 9) {
        this.onTab(keyboardEvent);
      }
      return undefined;
    };

    const descendant = `mention-option-${this.key}-${this.state.focusedOptionIndex}`;
    this.props.ariaProps.ariaActiveDescendantID = descendant;
    this.props.ariaProps.ariaOwneeID = `mentions-list-${this.key}`;
    this.props.ariaProps.ariaHasPopup = 'true';
    this.props.ariaProps.ariaExpanded = true;
    this.props.onOpenChange(true);
  };

  closeDropdown = () => {
    // make sure none of these callbacks are triggered
    this.props.callbacks.handleReturn = undefined;
    this.props.callbacks.keyBindingFn = undefined;
    this.props.ariaProps.ariaHasPopup = 'false';
    this.props.ariaProps.ariaExpanded = false;
    this.props.ariaProps.ariaActiveDescendantID = undefined;
    this.props.ariaProps.ariaOwneeID = undefined;
    this.props.onOpenChange(false);
  };
  setFocusDate = (day) => {
    this.setState({focusedDate: day})
  }
  render() {
    if (!this.props.open) {
      return null;
    }

    const {
      onOpenChange,
      onAddMention,
      ariaProps,
      callbacks,
      store,
      entityMutability,
      positionSuggestions,
      mentionTrigger,
      mentionPrefix,
      ...elementProps
    } = this.props;

    return React.cloneElement(
      <StyledPopover />,
      {
        ...elementProps,
        role: 'listbox',
        id: `mentions-list-${this.key}`,
        ref: (element) => {
          this.popover = element;
        },
      },
      <CalendarPopup 
        onMentionSelect={this.onMentionSelect} 
        selected={this.state.focusedDate} 
        setSelected={this.setFocusDate}
        calendarTable={this.state.calendarTable}
        swipe={this.swipe}
        date={this.date}
      />
    );
  }
}

export default CalendarSuggestion