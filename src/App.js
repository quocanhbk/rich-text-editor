import styled, { ThemeProvider } from "styled-components";
import MentionInput from "./Mention/MentionInput";
import theme from './utils/theme'
const ComboxData = [
  {id: 1, name: "La Quoc Anh", job: "Staff", display: "La Quoc Anh", avatar: "https://ttgvncom.sharepoint.com/sites/CommandCenter/_layouts/15/UserPhoto.aspx?Size=L&AccountName=anh.lq@ttgvn.com"},
  {id: 2, name: "Tran Thach Thao", job: "Staff", display: "Tran Thach Thao", avatar: "https://ttgvncom.sharepoint.com/sites/CommandCenter/_layouts/15/UserPhoto.aspx?Size=L&AccountName=thao.tt@ttgvn.com"},
  {id: 3, name: "Le Hoang Vu", job: "Staff", display: "Le Hoang Vu", avatar: "https://ttgvncom.sharepoint.com/sites/CommandCenter/_layouts/15/UserPhoto.aspx?Size=L&AccountName=vu.lh@ttgvn.com"},
  {id: 4, name: "Nguyen Hoang Tan", job: "Lead", display: "Nguyen Hoang Tan", avatar: "https://ttgvncom.sharepoint.com/sites/CommandCenter/_layouts/15/UserPhoto.aspx?Size=L&AccountName=tan.nh@ttgvn.com"},
  {id: 5, name: "Ngo Kim Son", job: "Staff", display: "Nguyen Hoang Tan", avatar: "https://ttgvncom.sharepoint.com/sites/CommandCenter/_layouts/15/UserPhoto.aspx?Size=L&AccountName=son.nk@ttgvn.com"},
  {id: 6, name: "Nguyen Quoc Dat", job: "Intern", display: "Nguyen Quoc Dat", avatar: "https://ttgvncom.sharepoint.com/sites/CommandCenter/_layouts/15/UserPhoto.aspx?Size=L&AccountName=dat.nq@ttgvn.com"},
  {id: 7, name: "Van Thuan Quan", job: "Intern", display: "Van Thuan Quan", avatar: "https://ttgvncom.sharepoint.com/sites/CommandCenter/_layouts/15/UserPhoto.aspx?Size=L&AccountName=quan.vt@ttgvn.com"}
]
const StyledContainer = styled.div`
  background: ${props => props.theme.color.background.primary};
  height: 100vh;
  color: ${props => props.theme.color.text.primary};
`
function App() {
  return (
    <ThemeProvider theme={theme.dark}>
      <StyledContainer>
        <MentionInput data={ComboxData} />
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
