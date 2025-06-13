export default function getBaseDate(uCalendarDisplay){
    let displayDate = uCalendarDisplay.getDisplayDate()

    // let isLeapYear
    // if ((displayYear % 4 == 0 && displayYear % 100 != 0) || displayYear % 400 == 0){
    //     isLeapYear = true
    // }
    // else{
    //     isLeapYear = false
    // }

    let basedate = new Date(2025, displayDate.getMonth(), 1) 

    return basedate
}


