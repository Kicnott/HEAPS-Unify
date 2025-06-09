import React from 'react'
import './mainCalendar.css'

export const MainCalendar = () => {
    let calendarBoxes = [];
    for (let i = 0; i < 35; i++){
        calendarBoxes.push(<button></button>) // Button functionality to be added
    }
    return (
        <div className='calendar'>
            {calendarBoxes}
        </div>
    )
}
