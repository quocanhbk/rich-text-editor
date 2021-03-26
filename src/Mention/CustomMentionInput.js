import {useState, useRef, useMemo, useCallback, useEffect} from 'react'
import {convertToRaw, EditorState, getDefaultKeyBinding} from 'draft-js'
import createMentionPlugin, {defaultSuggestionsFilter} from '@draft-js-plugins/mention'
import Editor from '@draft-js-plugins/editor'
import styled from 'styled-components'
import '@draft-js-plugins/mention/lib/plugin.css';
import PropTypes from 'prop-types'
import CalendarSuggestion from './CalendarSuggestion/CalendarSuggestion'

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
        color: ${props => props.theme.color.fill.info};
        background: transparent;
        font-style: italic;
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

const CustomMentionInput = (props) => {
    const ref = useRef()
    const containerRef = useRef()
    const {getMention} = props
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [suggestions, setSuggestions] = useState(props.data)
    const [mentions, setMentions] = useState([])

    const {DateSuggestions, MentionSuggestions , plugins} = useMemo(() => {
        const datePlugin = createMentionPlugin({
            entityMutability: "IMMUTABLE", 
            mentionTrigger: "#", 
            mentionSuggestionsComponent: CalendarSuggestion
        })
        const DateSuggestions = datePlugin.MentionSuggestions

        const mentionPlugin = createMentionPlugin({mentionTrigger: "@"})
        const MentionSuggestions = mentionPlugin.MentionSuggestions
        const plugins = [datePlugin, mentionPlugin]
        return {DateSuggestions, MentionSuggestions, plugins}
    }, [])

    const onOpenChange1 = useCallback((open) => setOpen1(open), [])
    const onOpenChange2 = useCallback((open) => setOpen2(open), [])
    const onSearchChange = useCallback(({value}) => setSuggestions(defaultSuggestionsFilter(value, props.data)), [props.data])

    useEffect(() => {
        let contentState = convertToRaw(editorState.getCurrentContent())
        let models = contentState.entityMap
        let text = contentState.blocks[0].text
        
        let dateData = Object.values(models).filter(_ => _.type === "//mention").map(_ => _.data.mention.name)
        let mentionData = Object.values(models).filter(_ => _.type === "mention").map(_ => _.data.mention.name)

        dateData.forEach(item => {
            text = text.replace(item, '')
        });
        mentionData.forEach(item => {
            text = text.replace(item, '')
        })
        text = text.trimEnd()
        let data = {
            text: text,
            date: dateData,
            people: mentionData
        }
        console.log(data)
        setMentions(data)
    }, [setMentions, editorState])

    useEffect(() => {
        getMention(mentions)
    })
    const handleReturn = (e) => {
        if (!open1 && !open2)
            return 'handled'
        return getDefaultKeyBinding(e)
    }

    return (
        <Container demo={props.demo} onClick={() => ref.current.focus()} ref={containerRef}>
            <Editor 
                editorKey="editor" 
                editorState={editorState} 
                onChange={setEditorState} 
                plugins={plugins} 
                ref={ref}
                handleReturn={handleReturn}
            />
            <DateSuggestions
                inputRef={containerRef.current}
                open={open1}
                onOpenChange={onOpenChange1}
            />
            <MentionSuggestions
                open={open2}
                onOpenChange={onOpenChange2} 
                suggestions={suggestions} 
                onSearchChange={onSearchChange}
            />
        </Container>
    )
}

CustomMentionInput.propTypes = {
    trigger: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    getMention: PropTypes.func,
    getPlainText: PropTypes.func
}
CustomMentionInput.defaultProps = {
    trigger: "@",
    data: [],
    getMention: (x) => {},
    getPlainText: (x) => {}
}
export default CustomMentionInput