export class uCalendarDisplay{
    constructor(displayDate, calendars, currentAccount){
        this.displayDate = displayDate //Date to be displayed
        this.calendars = calendars //Array of calendar objects to be displayed and overlayed
        this.currentAccount = currentAccount //Current account using display, for authentication
    }
    
    // Getters
    getDisplayDate(){
        return this.displayDate
    }
    getCalendars(){
        return this.calendars
    }
    getCurrentAccount(){
        return this.currentAccount
    }

    // Setters
    setDisplayMonth(displayDate){
        this.displayMonth = displayDate
        return this.displayDate
    }
    setCalendars(calendars){
        this.calendars = calendars
        return this.calendars
    }
    setCurrentAccount(currentAccount){
        this.currentAccount = currentAccount
        return this.currentAccount
    }

}
