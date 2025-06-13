export default function getBaseDate(uCalendarDisplay){
    let displayDate = String(uCalendarDisplay.getDisplayDate())

    // let isLeapYear
    // if ((displayYear % 4 == 0 && displayYear % 100 != 0) || displayYear % 400 == 0){
    //     isLeapYear = true
    // }
    // else{
    //     isLeapYear = false
    // }

    let firstDate = new Date(displayDate)

    let monthStart = firstDate.getDay()

    while (monthStart > 0){
        firstDate.setDate(firstDate.getDate() - 1)
        monthStart -= 1
    }
    return firstDate
}


