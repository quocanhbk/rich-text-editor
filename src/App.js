import styled, { ThemeProvider } from "styled-components";
import MentionInput from "./Mention/MentionInput";
import MultiMentionInput from './Mention/MultiMentionInput'
import CustomMentionInput from './Mention/CustomMentionInput'
import BasicMentionInput from './Mention/BasicMentionInput'
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
const hashTagData = [
  {id: 1, name: "Calm"},
  {id: 2, name: "Energetic"},
  {id: 3, name: "Elegant"},
  {id: 4, name: "Consistent"},
  {id: 5, name: "Confidence"},
]
const StyledContainer = styled.div`
  background: ${props => props.theme.color.background.primary};
  height: 100vh;
  padding: 1rem;
  color: ${props => props.theme.color.text.primary};
`
function App() {
  return (
    <ThemeProvider theme={theme.dark}>
      <StyledContainer>
        <label>Mention Input</label>
        <MentionInput data={ComboxData} />
        <label>Multi Mention Input (use @ or #)</label>
        <MultiMentionInput data1={ComboxData} data2={hashTagData}/>
        <label>People and Date Input</label>
        <CustomMentionInput data={ComboxData}/>
        <label>Long Popup Mention Input</label>
        <BasicMentionInput data={ComboxData}/>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
