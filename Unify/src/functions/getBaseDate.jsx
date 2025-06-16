export default function getBaseDate(displayDate){
    // let displayDate = uCalendarDisplay.getDisplayDate()

    // let isLeapYear
    // if ((displayYear % 4 == 0 && displayYear % 100 != 0) || displayYear % 400 == 0){
    //     isLeapYear = true
    // }
    // else{
    //     isLeapYear = false
    // }

    let firstDate = new Date(2025, displayDate.getMonth(), 1) 
    let monthStart = firstDate.getDay()

    while (monthStart > 0){
        firstDate.setDate(firstDate.getDate() - 1)
        monthStart -= 1
    }
    // console.log(firstDate)
    return firstDate
}


