import React from 'react'
import '../styles/mainCalendar.css'

export const MainCalendar = ({children, baseDate}) => {
    let dateIndex = new Date(baseDate)
    // console.log("baseDate:" + baseDate )
    // console.log("dateIndex" + dateIndex)
    let calendarBoxes = [];
    for (let i = 0; i < 35; i++){
        calendarBoxes.push(<button key={i}>{children}{dateIndex.toLocaleDateString()}</button>) // Button functionality to be added
        dateIndex.setDate(dateIndex.getDate() + 1)
    }
    return (
        <div className='calendar'>
            {calendarBoxes}
        </div>
    )
}
