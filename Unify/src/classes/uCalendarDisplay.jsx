class uCalendarDisplay{
    constructor(month, calendars, currentAccount){
        this.month = month //Month to be displayed
        this.calendars = calendars //Array of calendar objects to be displayed and overlayed
        this.currentAccount = currentAccount //Current account using display, for authentication
    }
    
    // Getters
    getMonth(){
        return this.month
    }
    getCalendars(){
        return this.calendars
    }
    getCurrentAccount(){
        return this.currentAccount
    }

    // Setters
    setMonth(month){
        this.month = month
        return this.month
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