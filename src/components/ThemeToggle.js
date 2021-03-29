import React from "react";
import PropTypes from "prop-types";
import styled from 'styled-components'

const Icon = styled.span`
    color: ${props => props.theme.color.background.primary};   
`

const LabelToggle = styled.label`
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 8px 4px 0;
    pointer-events: ${props => props.displayMode !== "edit" ? "none" : "auto"};
`;
const ToggleSpan = styled.span`
    position: relative;
    display:block;
    width: 2.8rem;
    height: 1.2rem;
`;
const StyleInput = styled.input`
    display: none;
    &:checked + .toggle-switch:before{
        transform: translateX(1.6rem);
    }
    &:checked ~ .toggle-switch{
        transition: 0.4s;
    }
`;
//the toggle
const StyleSpan = styled.span`
    display:flex;
    justify-content: space-between;
    padding: 0 0.1rem;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.color.fill.primary};
    transition: .4s;
    border-radius: 999px;
    box-shadow: ${props => props.theme.shadow};
    //overflow: hidden;

    //the dotted
    &:before{
        position: absolute;
        content: "";
        height: 1.4rem;
        width: 1.4rem;
        top: -0.1rem;
        left: -0.1rem;
        border-radius:999px;
        bottom: 0.05rem;
        background-color: ${props => props.theme.color.background.primary};
        box-shadow: 0px 0px 4px rgba(0,0,0,0.64);
        -webkit-transition: .4s;
        transition: .4s;
    }
`;
const LightIcon = () => 
    <Icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
    </Icon>
const DarkIcon = () => 
    <Icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    </Icon>
const ThemeToggle = (props) => {

    const handleSelect = (e) => {
        props.onSelect(e.target.checked)
    }

    return(  
        <LabelToggle {...props}>
            <ToggleSpan>
                <StyleInput
                type="checkbox"
                name={props.name} 
                checked={props.value}
                onChange={handleSelect} 
                />
                <StyleSpan className="toggle-switch">
                    <DarkIcon/>
                    <LightIcon/>
                </StyleSpan>
            </ToggleSpan>
        </LabelToggle>
    )
}
ThemeToggle.propTypes = {
    disabled:PropTypes.bool,
    default:PropTypes.bool,
    className: PropTypes.string,
    onSelect: PropTypes.func,
    name:PropTypes.string,
    displayMode: PropTypes.oneOf(["edit", "view", "disabled"]),
    theme:PropTypes.string
}
ThemeToggle.defaultProps = {
    onSelect: (x) => {},
    default: false,
    displayMode: "edit",
    disabled:false
}

export default ThemeToggle;
