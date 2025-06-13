import { Calender_Date_Box } from './Calender_Date_Box.jsx'
import { Calender_Date_Headers } from './Calender_Date_Box.jsx'
import '../styles/mainCalendar.css'

export const MainCalendar = ({children, baseDate}) => {
    let dateIndex = new Date(baseDate)
    // console.log("baseDate:" + baseDate )
    // console.log("dateIndex" + dateIndex)
    let calendarBoxes = [];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    for (let i = 0; i < 7; i++){
        calendarBoxes.push(<Calender_Date_Headers key={days[i]}>{days[i]}</Calender_Date_Headers>) // Add Day Names on the top row
    }

    for (let i = 0; i < 42; i++){
        let date = dateIndex.toLocaleDateString()
        calendarBoxes.push(<Calender_Date_Box key={date} baseMonth={baseDate.getMonth()} displayDate={new Date(dateIndex)}>{children}</Calender_Date_Box>) // Button functionality to be added
        dateIndex.setDate(dateIndex.getDate() + 1)
    }
    console.log(calendarBoxes)
    return (
        <div className='calendar'>
            {calendarBoxes}
        </div>
    )
}
