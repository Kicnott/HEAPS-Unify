export class uEvent{
    constructor(timeslots, id, name, description, location){
        this.timeslots = timeslots //Array of timeslots to indicate when the eventis held
        this.id = id //Event ID
        this.name = name // Event Name
        this.description = description //Event Description
        this.location = location // Event Location
    }

    // Getters
    getTimeslots(){
        return this.timeslots
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
    getLocation(){
        return this.location
    }

    // Setters
    setTimeslots(timeslots){
        this.timeslots = timeslots
        return this.timeslots
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
    setLocation(location){
        this.location = location
        return this.location
    }
}