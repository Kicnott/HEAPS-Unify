export default function displayBase(uCalendarDisplay){
    let displayMonth = String(uCalendarDisplay.getDisplayMonth())
    let displayYear = String(uCalendarDisplay.getDisplayYear())

    let isLeapYear
    if ((displayYear % 4 == 0 && displayYear % 100 != 0) || displayYear % 400 == 0){
        isLeapYear = true
    }
    else{
        isLeapYear = false
    }

    let firstDate = new Date(displayYear.concat('-').concat(displayMonth).concat('-').concat(1))

    let monthStart = firstDate.getDay()

    console.log(monthStart, firstDate)

}


