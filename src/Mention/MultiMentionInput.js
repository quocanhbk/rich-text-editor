import {useState, useRef, useMemo, useCallback, useEffect} from 'react'
import {convertToRaw, EditorState} from 'draft-js'
import createMentionPlugin, {defaultSuggestionsFilter} from '@draft-js-plugins/mention'
import Editor from '@draft-js-plugins/editor'
import styled from 'styled-components'
import '@draft-js-plugins/mention/lib/plugin.css';
import {getFader} from '../../utils/color'
import PropTypes from 'prop-types'

const ItemStyle = props => `
    border-bottom: 1px solid ${props.theme.color.border.primary};
    font-size: ${props.theme.textSize.medium};
`

const Container = styled.div`
    margin: ${props => props.demo ? "1rem" : "0"};
    border: 1px solid ${props => props.theme.color.border.primary};
    cursor: text;
    padding: 6px 8px;
    border-radius: 4px;
    background: transparent;
    //mention
    .m6zwb4v {
        color: ${props => props.theme.color.fill.primary};
        background: ${props => getFader(props.theme.color.fill.primary, 0.1)};
    }
    //popup item
    .m1ymsnxd {
        ${ItemStyle}
    }
    //popup item on hover
    .m126ak5t {
        ${ItemStyle};
        background-color: ${props => props.theme.color.border.primary};
    }
    //popup container
    .mnw6qvm {
        border: 1px solid ${props => props.theme.color.border.primary};
        box-shadow: ${props => props.theme.shadow};
        background: ${props => props.theme.color.background.secondary};
    }
    
`

const MentionInput = (props) => {
    const ref = useRef()
    const {getMention} = props
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [suggestions1, setSuggestions1] = useState(props.data1)
    const [suggestions2, setSuggestions2] = useState(props.data2)
    const [mentions, setMentions] = useState([])
    const mentionLength = useRef(0)

    const {MentionSuggestions1, MentionSuggestions2, plugins} = useMemo(() => {
        const mentionPlugin1 = createMentionPlugin({mentionTrigger: "@", mentionPrefix: "@"})
        const mentionPlugin2 = createMentionPlugin({mentionTrigger: "#", mentionPrefix: "#"})
        const MentionSuggestions1 = mentionPlugin1.MentionSuggestions
        const MentionSuggestions2 = mentionPlugin2.MentionSuggestions
        const plugins = [mentionPlugin1, mentionPlugin2]
        return {MentionSuggestions1, MentionSuggestions2, plugins}
    },[])
    

    const onOpenChange1 = useCallback((open) => setOpen1(open), [])
    const onOpenChange2 = useCallback((open) => setOpen2(open), [])
    const onSearchChange1 = useCallback(({value}) => setSuggestions1(defaultSuggestionsFilter(value, props.data1)), [props.data1])
    const onSearchChange2 = useCallback(({value}) => setSuggestions2(defaultSuggestionsFilter(value, props.data2)), [props.data2])

    useEffect(() => {
        let contentState = convertToRaw(editorState.getCurrentContent())
        let models = contentState.entityMap
        let data = Object.values(models).filter(_ => _.type === "mention").map(_ => _.data.mention)
        if (data.length !== mentionLength.current) {
            mentionLength.current = data.length
            setMentions(data)
        }
    }, [setMentions, editorState])

    useEffect(() => {
        getMention(mentions)
    })

    return (
        <Container {...props} onClick={() => ref.current.focus()}>
            <Editor 
                editorKey="editor" 
                editorState={editorState} 
                onChange={setEditorState} 
                plugins={plugins} 
                ref={ref}
            />
            <MentionSuggestions1 
                open={open1} 
                onOpenChange={onOpenChange1} 
                suggestions={suggestions1} 
                onSearchChange={onSearchChange1}
            />
            <MentionSuggestions2
                open={open2} 
                onOpenChange={onOpenChange2} 
                suggestions={suggestions2} 
                onSearchChange={onSearchChange2}
            />
        </Container>
    )
}

MentionInput.propTypes = {
    trigger: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    getMention: PropTypes.func,
    getPlainText: PropTypes.func
}
MentionInput.defaultProps = {
    trigger: "@",
    data: [],
    getMention: (x) => {},
    getPlainText: (x) => {}
}
export default MentionInput