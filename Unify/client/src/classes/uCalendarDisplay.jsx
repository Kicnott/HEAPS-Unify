// Class for displaying Calendar in the website.
// As of now, this is the object the website will use to read what should be displayed.
// Should be configurable for different dates and calendars.
export class uCalendarDisplay{
    constructor(displayDate, calendars, currentAccount){
        this.displayDate = new Date(displayDate) //Date to be displayed
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
    setDisplayDate(displayDate){
        this.displayDate = displayDate
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
