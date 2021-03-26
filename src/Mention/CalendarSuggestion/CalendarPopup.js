import React, {useRef, useEffect} from 'react'
import styled from 'styled-components'
import {getFader} from '../../../../utils/color'
import calendarData from './calendarData'

const StyledSpan = styled.span`
    margin: ${props => props.left ? "0px 8px 0px 0px" : props => props.right ? "0px 0px 0px 8px" : "0px"};
    svg {
        vertical-align: middle;
    }
`;

const IcoChevronLeft = (props) => <StyledSpan {...props}><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></StyledSpan>
const IcoChevronRight = (props) => <StyledSpan {...props}><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></StyledSpan>

const StyledCalendar = styled.div`
    position: block;
    z-index: 999;
    width: 240px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    transition: all 1s linear;
`;
const CalendarHead = styled.div`
    width: 100%;
    background: ${props => props.theme.color.fill.primary};
    color: ${props => props.theme.color.background.primary};
    padding: 0.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${props => props.theme.textSize.medium};
    user-select: none;
`;
const StyledCalendarDate = styled.div`
    transition: all 3s linear;
`;

const StyledCalendarBar = styled.ul`
    display: flex;
    width: 100%;
    padding: 4px;
    gap: 4px;
    background: ${props => props.theme.color.background.secondary};
    justify-content: flex-start;
    flex-wrap: wrap;
    user-select: none;
`;
const CalendarContent = styled.ul`
    display: flex;
    width: 100%;
    background: ${props => props.theme.color.background.primary};
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px;
`;
const StyledLi = styled.li`
    list-style-type: none;
    //width: calc(100%/7);
    flex: 1 0 12%;
    border-radius: 99px;
    text-align: center;
    padding: 0.4rem;
    font-size: ${props => props.theme.textSize.small};
    cursor: pointer;
    user-select: none;
    &.date-item {
        background: ${props => props.selected ? props.theme.color.fill.primary : "transparent"};
        color: ${props => props.selected ? props.theme.color.background.primary : props => props.current ? props.theme.color.text.primary : getFader(props.theme.color.text.primary, 0.6)};
    }
    
    &.date-title {
        color: ${props => props.theme.color.text.primary};
        font-weight: 700;
    }
`;

function CalendarPopup(props) {
    const mouseDown = useRef(false);
    let {dayName, months} = calendarData
    const getMonthName = (id) => months.find(month => month.id === id).name
    useEffect(() => {
        mouseDown.current = false;
    });
    const onMouseUp = (day) => {
        if (mouseDown.current) {
            let newDate = new Date(props.date.getFullYear(), props.date.getMonth(), day.value)
            props.onMentionSelect(newDate)
            mouseDown.current = false;
        }
    };
    const onMouseLeave = (day) => {
        props.setSelected(new Date(1970, 0, 1))
    }
    const onMouseEnter = (day) => {
        if (day.month === "current")
            props.setSelected(new Date(props.date.getFullYear(), props.date.getMonth(), day.value))
    }

    const onMouseDown = (event) => {
        event.preventDefault();
        mouseDown.current = true;
    };

    const onMDown = (event) => event.preventDefault()
    return (
            <StyledCalendar onMouseDown={onMDown}>
                <CalendarHead>
                    <IcoChevronLeft onClick={() => props.swipe('prev')}/>
                    <StyledCalendarDate >
                        {getMonthName(props.date.getMonth()) +  " " + props.date.getFullYear()}
                    </StyledCalendarDate>
                    <IcoChevronRight onClick={() => props.swipe('next')}/>
                </CalendarHead>
                <StyledCalendarBar>
                    {dayName.map(day => <StyledLi className="date-title" key={day}>{day}</StyledLi>)}
                </StyledCalendarBar>
                <CalendarContent>
                      {props.calendarTable.map(
                        day => 
                            <StyledLi
                                current={day.month === "current"}
                                className="date-item" 
                                key={day.id}
                                onMouseDown={onMouseDown}
                                onMouseUp={() => onMouseUp(day)}
                                onMouseEnter={() => onMouseEnter(day)}
                                onMouseLeave={() => onMouseLeave(day)}
                                selected={day.value === props.selected.getDate() && day.month === "current" && props.date.getMonth() === props.selected.getMonth()}
                            >
                                {day.value}
                            </StyledLi>)
                    }
                </CalendarContent>
            </StyledCalendar>
    )
}

export default CalendarPopup
