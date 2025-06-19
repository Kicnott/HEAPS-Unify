// Class for all Calendar objects. 
// As of now, Calendars are an array of Event objects to be displayed in CalendarDisplay. 
export class uCalendar{
    constructor(events, id, name, description, colour){
        this.events = events //Array of events in the calendar
        this.id = id //Calendar ID
        this.name = name //Calendar name
        this.description = description //Calendar description
        this.colour = colour //Default colour of calendar, to be used in CalendarDisplay
    }

    // Getters
    getEvents(){
        return this.events
    }
    getId(){
        return this.id
    }
    getName(){
        return this.name
    }
    getDescription(){
        return this.description
    }
    getColour(){
        return this.colour
    }

    // Setters
    setEvents(events){
        this.events = events
        return this.events
    }
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
    setColour(colour){
        this.colour = colour
        return this.colour
    }
}
