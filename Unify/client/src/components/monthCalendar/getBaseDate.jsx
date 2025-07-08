// This function takes in any display date and calculates the first date that should be displayed in the calendar for the month of the display date
export default function getBaseDate(displayDate){
    // displayDate: Any date as a Date object. For all dates within the same month (and year), the return result is the same

    let firstDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1); // Stores the first date of the month of the display date.
    let monthStart = firstDate.getDay(); // Stores the day of the week for the first date of the month (0 - 6).
    firstDate.setHours(12)
    while (monthStart > 0){
        firstDate.setDate(firstDate.getDate() - 1);
        monthStart -= 1;
    } // Reduces the Date by 1 until the starting date is Sunday (6).

    return firstDate
}


