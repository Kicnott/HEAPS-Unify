import { CalendarDateBox } from './CalendarDateBox.jsx'
import { CalendarDateHeader } from './CalendarDateBox.jsx'
import { useState, useEffect } from 'react'
import getBaseDate from '../functions/getBaseDate.jsx'
import '../styles/MainCalendar.css'

// MainCalendar component used to display the big calendar in the Home page.
export const MainCalendar = ({children, displayDate, onDateBoxClick, setChosenDate, refreshEvents, setrefreshEvents, nDateHeaderClick}) => {
    // children: Any additional labels to be stored on each DateBox. To be passed to the children variable in CalendarDateBox
    // displayDate: The date the user wants to display. As of now, the month of that date will be displayed by the calendar.
    // onDateBoxClick: The function to be run when a DateBox is clicked. To be passed to the onClick variable in CalendarDateBox.
    // onDateHeaderClick: The function to be run when a DateHeader is clicked. To be passed to the onClick variable in CalendarDateHeader. (CURRENTLY NOT BEING USED IN home.jsx)

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstDay + daysInMonth) / 7) * 7;

            const [moveableEvent, setmoveableEvent] = useState("Sun Jun 01 2025 00:00:00 GMT+0800 (Singapore Standard Time)"); //test moveable event



    let baseDate = getBaseDate(displayDate) // Stores the first date that the calendar should display for the displayDate
    let dateIndex = new Date(baseDate) // Creates a new Date object so that the baseDate is remembered but the dateIndex can be modified. 
    // This is because Date is an object and modifying a copy of baseDate will change it for the rest.

    let calendarBoxes = [] // Creates an empty array to store the calendar boxes that will later be displayed.
    let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] // Defining the calendar headers.

    for (let i = 0; i < 7; i++){
        calendarBoxes.push(<CalendarDateHeader key={days[i]}>{days[i]}</CalendarDateHeader>) // Add Day Names on the top row
    } // First, the CalendarDateHeaders, mapped to their corresponding days are pushed into the the calendarBoxes array.
    // According to AI, the key specified here is to uniquely identify the CalendarDateHeaders, so that they can be updated efficiently. Code **should** still work without defining the keys.

    for (let i = 0; i < cellCount; i++){
        let date = dateIndex.toLocaleDateString()
        calendarBoxes.push(
        <CalendarDateBox 
            key={date} 
            baseMonth={displayDate.getMonth()} 
            displayDate={new Date(dateIndex)} 
            onClick={onDateBoxClick} 
            setChosenDate={setChosenDate} 
            refreshEvents = {refreshEvents} 
            setrefreshEvents = {setrefreshEvents}
            moveableEvent = {moveableEvent}
            setmoveableEvent = {setmoveableEvent}>
                {children}
        </CalendarDateBox>) // Button functionality to be added
        dateIndex.setDate(dateIndex.getDate() + 1)
    } // Next, the CalendarDateBoxes, each displaying the date from the baseDate and incrementally increasing until all 6 rows are filled, are pushed into the calendarBoxes array.
    // According to AI, the key specified here is to uniquely identify the CalendarDateHeaders, so that they can be updated efficiently. Code **should** still work without defining the keys.

    return (
        <div className='calendar'>
            {calendarBoxes}
        </div>
    ) // Simply displays the calendarBoxes in the style defined in MainCalendar.css.
}
