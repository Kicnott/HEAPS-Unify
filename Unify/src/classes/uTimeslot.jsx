// Class for Timeslots, that will be used by Event objects.
// Timeslots are a continuous time from StartDT to EndDT.
export class uTimeslot{
    constructor(startDT, endDT){
        this.startDT = startDT //Starting Datetime
        this.endDT = endDT //Ending Datetime
    }

    // Getters
    getStartDT(){
        return this.startDT
    }
    getEndDT(){
        return this.endDT
    }
    
    // Setters
    setStartT(startDT){
        this.startDT = startDT
        return this.startDT
    }
    setEndDT(endDT){
        this.endDT = endDT
        return this.endDT
    }
}
