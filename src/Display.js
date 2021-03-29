import styled, { ThemeProvider } from "styled-components";
import Box from './Box'
import MentionInput from "./Mention/MentionInput";
import MultiMentionInput from './Mention/MultiMentionInput'
import CustomMentionInput from './Mention/CustomMentionInput'
import BasicMentionInput from './Mention/BasicMentionInput'
import theme from './utils/theme'
import ThemeToggle from "./components/ThemeToggle";
import {useState} from 'react'
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
const StyledTitle = styled.div`
    padding: 0.4rem;
    display: flex;
    justify-content: space-between;
`
function Display() {
    const [isDark, setIsDark] = useState(true)
    return (
        <ThemeProvider theme={isDark ? theme.dark : theme.light}>
            <StyledContainer>
                <StyledTitle><h3>rich-text-editor</h3><ThemeToggle value={isDark} onSelect={() => setIsDark(!isDark)}/></StyledTitle>
                <div>
                    <Box headline="Mention Input (use @)">
                        <MentionInput data={ComboxData} />
                    </Box>
                    <Box headline="Multi Mention Input (use @ or #)">
                        <MultiMentionInput data1={ComboxData} data2={hashTagData}/>
                    </Box>
                    <Box headline="People and Date Input (use @ or /)">
                        <CustomMentionInput data={ComboxData}/>
                    </Box>
                    <Box headline="Long Popup Mention Input (use @)">
                        <BasicMentionInput data={ComboxData}/>
                    </Box>   
                </div>
     
            </StyledContainer>
        </ThemeProvider>
    );
}

export default Display;
