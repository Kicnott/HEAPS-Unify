export class uAccount{
    constructor(id, name, description, myCalendar, followedCalendars){
        this.id = id // AccountID
        this.name = name //Account name/username
        this.description = description //Account bio/description
        this.myCalendar = myCalendar //Account's personal calendar object
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
    getMyCalendar(){
        return this.myCalendar
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
