import React from 'react'
import './mainCalendar.css'

export const MainCalendar = ({children}) => {
    let calendarBoxes = [];
    for (let i = 0; i < 35; i++){
        calendarBoxes.push(<button>{children}</button>) // Button functionality to be added
    }
    return (
        <div className='calendar'>
            {calendarBoxes}
        </div>
    )
}
