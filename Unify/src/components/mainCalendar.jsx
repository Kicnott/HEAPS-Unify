import React from 'react'
import '../styles/mainCalendar.css'

export const MainCalendar = ({children, baseDate}) => {
    let dateIndex = new Date(baseDate)
    // console.log("baseDate:" + baseDate )
    // console.log("dateIndex" + dateIndex)
    let calendarBoxes = [];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    for (let i = 0; i < 7; i++){
        calendarBoxes.push(<button key={days[1]}>{days[i]}</button>) // Add Day Names on the top row
    }

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
