export class uCalendarDisplay{
    constructor(displayMonth, displayYear, calendars, currentAccount){
        this.displayMonth = displayMonth //Month to be displayed
        this.calendars = calendars //Array of calendar objects to be displayed and overlayed
        this.currentAccount = currentAccount //Current account using display, for authentication
        this.displayYear = displayYear // Year to be displayed
    }
    
    // Getters
    getDisplayMonth(){
        return this.displayMonth
    }
    getCalendars(){
        return this.calendars
    }
    getCurrentAccount(){
        return this.currentAccount
    }
    getDisplayYear(){
        return this.displayYear
    }
    // Setters
    setDisplayMonth(displayMonth){
        this.displayMonth = displayMonth
        return this.displayMonth
    }
    setCalendars(calendars){
        this.calendars = calendars
        return this.calendars
    }
    setCurrentAccount(currentAccount){
        this.currentAccount = currentAccount
        return this.currentAccount
    }
    setDisplayYear(displayYear){
        this.displayYear = displayYear
        return this.displayYear
    }
}
