import styled from "styled-components";

const StyledContainer = styled.div`
  border: 1px solid ${(props) => props.theme.color.border.primary};
  margin-bottom: 1rem;
`;
const StyledHeader = styled.div`
  padding: 0.4rem;
  border-bottom: 1px solid ${(props) => props.theme.color.border.primary};
  background: ${(props) => props.theme.color.background.secondary};
`;
const StyledBody = styled.div`
  padding: 0.4rem;
`;
const Box = (props) => {
  return (
    <StyledContainer>
      <StyledHeader>{props.headline}</StyledHeader>
      <StyledBody>{props.children}</StyledBody>
    </StyledContainer>
  );
};

export default Box;
