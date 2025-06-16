// Class for all User Account objects. 
// As of now, Account has a list of Calendars the user follows as well as the Account's Calendar.
export class uAccount{
    constructor(id, name, description, myCalendars, followedCalendars){
        this.id = id // AccountID
        this.name = name //Account name/username
        this.description = description //Account bio/description
        this.myCalendars = myCalendars //Account's personal calendar object
        this.followedCalendars = followedCalendars //Array of followed calendars for account
    }

    // Getters
    getId(){
        return this.id
    }
    getName(){
        return this.name
    }
    getDescription(){
        return this.description
    }
    getMyCalendars(){
        return this.myCalendars
    }
    getFollowedCalendars(){
        return this.getFollowedCalendars
    }

    // Setters
    setId(id){
        this.id = id
        return this.id
    }
    setName(name){
        this.name = name
        return this.name
    }
    setDescription(description){
        this.description = description
        return this.description
    }
    setMyCalendar(myCalendar){
        this.myCalendar = myCalendar
        return this.myCalendar
    }
    setFollowedCalendars(followedCalendars){
        this.followedCalendars = followedCalendars
        return followedCalendars
    }
}
