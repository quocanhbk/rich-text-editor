import styled from 'styled-components';
import {  ReactComponent as Bold } from './bold.svg'; 
import {  ReactComponent as Italic } from './italic.svg'; 

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  fill: #ffffff;
`;

const BoldCursor = styled(Bold)`
  cursor: url(bold.svg) 2 2, pointer;
`

const BoldIcon = () => 
  <Wrapper>
    <BoldCursor />
  </Wrapper>


export { BoldIcon }