import { CalendarDateBox } from './CalendarDateBox.jsx'
import { CalendarDateHeader } from './CalendarDateBox.jsx'
import getBaseDate from '../functions/getBaseDate.jsx'
import '../styles/MainCalendar.css'

export const MainCalendar = ({children, displayDate, onButtonClick}) => {
    let baseDate = getBaseDate(displayDate)
    let dateIndex = new Date(baseDate)
    // console.log("baseDate:" + baseDate + ", baseMonth:" + baseDate.getMonth() )
    // console.log("dateIndex" + dateIndex)
    let calendarBoxes = [];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    for (let i = 0; i < 7; i++){
        calendarBoxes.push(<CalendarDateHeader key={days[i]}>{days[i]}</CalendarDateHeader>) // Add Day Names on the top row
    }

    for (let i = 0; i < 42; i++){
        let date = dateIndex.toLocaleDateString()
        calendarBoxes.push(<CalendarDateBox key={date} baseMonth={displayDate.getMonth()} displayDate={new Date(dateIndex)} onClick={onButtonClick}>{children}</CalendarDateBox>) // Button functionality to be added
        dateIndex.setDate(dateIndex.getDate() + 1)
    }
    // console.log(calendarBoxes)
    return (
        <div className='calendar'>
            {calendarBoxes}
        </div>
    )
}
