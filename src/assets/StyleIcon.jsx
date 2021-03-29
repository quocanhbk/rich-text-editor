import styled from "styled-components";

const Wrapper = styled.button`
  height: 16px;
  min-width: 16px;
  fill: ${(props) => props.active ? props.theme.color.text.info : props.theme.color.text.primary};
  color: ${(props) => props.active ? props.theme.color.text.info : props.theme.color.text.primary};
  background-color: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
`;

export { Wrapper };
