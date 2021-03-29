import React from "react";
import styled from "styled-components";
import { ReactComponent as Bold } from "./bold.svg";
import { ReactComponent as Italic } from "./italic.svg";
import { ReactComponent as Underline } from "./underline.svg";

const Wrapper = styled.button`
  width: 16px;
  height: 16px;
  fill: ${(props) => props.theme.color.text.primary};
  background-color: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
`;

const BoldIcon = () => (
  <Wrapper>
    <Bold />
  </Wrapper>
);

const ItalicIcon = () => (
  <Wrapper>
    <Italic />
  </Wrapper>
);

const UnderlineIcon = () => (
  <Wrapper>
    <Underline />
  </Wrapper>
);

export { BoldIcon, ItalicIcon, UnderlineIcon };
