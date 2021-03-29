import {useState, useRef, useMemo, useCallback, useEffect} from 'react'
import {convertToRaw, EditorState} from 'draft-js'
import createMentionPlugin, {defaultSuggestionsFilter} from '@draft-js-plugins/mention'
import customSuggestionsFilter from './customerSuggestionsFilter'
import Editor from '@draft-js-plugins/editor'
import styled from 'styled-components'
import '@draft-js-plugins/mention/lib/plugin.css';
import {getFader} from '../utils/color'
import PropTypes from 'prop-types'
import MentionSuggestionsComp from './MentionSuggestions'

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

const BasicMentionInput = (props) => {
    const ref = useRef()
    const {getMention} = props
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const [open, setOpen] = useState(false)
    const [suggestions, setSuggestions] = useState(props.data)
    const [mentions, setMentions] = useState([])
    const mentionLength = useRef(0)

    const {MentionSuggestions, plugins} = useMemo(() => {
        const mentionPlugin = createMentionPlugin({
            entityMutability: "SEGMENTED", 
            mentionTrigger: "@"
        })
        const {MentionSuggestions} = mentionPlugin
        const plugins = [mentionPlugin]
        return {MentionSuggestions, plugins}
    }, [])
   

    const onOpenChange = useCallback((open) => setOpen(open), [])
    const onSearchChange = useCallback(({value}) => setSuggestions(customSuggestionsFilter(value, props.data)), [props.data])

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
            <MentionSuggestions
                open={open} 
                onOpenChange={onOpenChange} 
                suggestions={suggestions} 
                onSearchChange={onSearchChange}
            />
        </Container>
    )
}

BasicMentionInput.propTypes = {
    trigger: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    getMention: PropTypes.func,
    getPlainText: PropTypes.func
}
BasicMentionInput.defaultProps = {
    trigger: "@",
    data: [],
    getMention: (x) => {},
    getPlainText: (x) => {}
}
export default BasicMentionInput