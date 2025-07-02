import { CalendarDateBox } from './CalendarDateBox.jsx'
import { CalendarDateHeader } from './CalendarDateBox.jsx'
import { useState, useEffect } from 'react'
import getBaseDate from './getBaseDate.jsx'
import '../../styles/MainCalendar.css'

// MainCalendar component used to display the big calendar in the Home page.
export const MainCalendar = ({children, displayDate, onDateBoxClick, setChosenDate, refreshEvents, setrefreshEvents, refreshMonthEvents,setRefreshMonthEvents, monthEvents, setMonthEvents}) => {
    // children: Any additional labels to be stored on each DateBox. To be passed to the children variable in CalendarDateBox
    // displayDate: The date the user wants to display. As of now, the month of that date will be displayed by the calendar.
    // onDateBoxClick: The function to be run when a DateBox is clicked. To be passed to the onClick variable in CalendarDateBox.

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    let newDatesThatPassSunday = []; // array to store events that passed Sun

        const [moveableEvent, setmoveableEvent] = useState("Sun Jun 01 2025 00:00:00 GMT+0800 (Singapore Standard Time)"); //test moveable event

    let emptyEventSpaceCount = 0; //for empty events divs 

    let baseDate = getBaseDate(displayDate) // Stores the first date that the calendar should display for the displayDate
    let dateIndex = new Date(baseDate) // Creates a new Date object so that the baseDate is remembered but the dateIndex can be modified. 
    // This is because Date is an object and modifying a copy of baseDate will change it for the rest.

    // The 1st does not show the first displayed day of that week. For example, on July 2025, 1st July on a Tuesday, but 29th June is the first displayed day of that week.
    while (dateIndex.getDay() !== 0){
        dateIndex.setDate(dateIndex.getDate() - 1);
    }

    let firstDisplayedDateOfTheMonth = new Date(dateIndex); //firstDisplayedDateOfTheMonth; used to display events across months

    let countMutiDayEvents = 0 //determines no of multiple day events in one calendar box, and passes the info to the next calendar box to generate empty space for UI readability 

    let sundaysOfTheMonth = []; //sundaysOfTheMonth; used to display events across weeks
    let currSunDate = new Date(firstDisplayedDateOfTheMonth);
    for (let i = 0; i < cellCount / 7 ; i++){
        sundaysOfTheMonth.push(new Date(currSunDate));
        currSunDate.setDate(currSunDate.getDate() + 7);
    }

    let calendarBoxes = [] // Creates an empty array to store the calendar boxes that will later be displayed.
    let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] // Defining the calendar headers.
    let displayEventsInCurrBox = [];

    for (let i = 0; i < 7; i++){
        calendarBoxes.push(<CalendarDateHeader key={days[i]}>{days[i]}</CalendarDateHeader>) // Add Day Names on the top row
    } // First, the CalendarDateHeaders, mapped to their corresponding days are pushed into the the calendarBoxes array.
    // According to AI, the key specified here is to uniquely identify the CalendarDateHeaders, so that they can be updated efficiently. Code **should** still work without defining the keys.

    for (let i = 0; i < cellCount; i++){ // eventsInCurrBox; filter events for that day into eventsInCurrBox
        let date = dateIndex.toLocaleDateString()
        let eventsInCurrBox = monthEvents.filter((event)=>{
            const eventDate = new Date(event.startdt).toLocaleDateString();
            return eventDate === date;
        })

        // adds empty space from previous multiple-days events
        for (let i = 0; i < countMutiDayEvents; i++){
            displayEventsInCurrBox.push(<div key={`empty-${emptyEventSpaceCount}`} style={{
                fontSize: '0.9rem',
                color: 'blue', 
                backgroundColor: 'brown', 
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: '1px',
            }}>Empty</div>);
            emptyEventSpaceCount = emptyEventSpaceCount + 1;
        }

        // Counts the number of muti days in currCalendarBox
        countMutiDayEvents = eventsInCurrBox.filter(event => {
            const start = new Date(event.startdt);
            const end = new Date(event.enddt);

            // Strip time portion
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            
            const duration = (end - start) / (1000 * 60 * 60 * 24); // duration in days
            console.log("event name: ", event.eventname)
            console.log("end: ", end)
            console.log("start: ", start)
            console.log(duration >= 1)
            return duration >= 1;
        }).length;

        console.log("multiple days: ", countMutiDayEvents)

        // sorts the events in the box
        const sortedEventsInCurrBox = [...eventsInCurrBox].sort((a, b) => {
            const aDuration = (new Date(a.enddt) - new Date(a.startdt)) / (1000 * 60 * 60 * 24);
            const bDuration = (new Date(b.enddt) - new Date(b.startdt)) / (1000 * 60 * 60 * 24);
            // Push multi-day events to the front
            const aIsMultiDay = aDuration >= 1;
            const bIsMultiDay = bDuration >= 1;
            if (aIsMultiDay !== bIsMultiDay) {
                return bIsMultiDay - aIsMultiDay; 
            }
            // Push ealierest event to the front
            return new Date(a.startdt) - new Date(b.startdt);
            });

        displayEventsInCurrBox = displayEventsInCurrBox.concat(sortedEventsInCurrBox.map((event) => {
            let startDayValue = new Date(event.startdt).getDate() + new Date(event.startdt).getMonth() + new Date().getFullYear(); //gets day + month + year of startdt
            let endDayValue = new Date(event.enddt).getDate() + new Date(event.enddt).getMonth() + new Date(event.enddt).getFullYear(); //gets day + month + year of enddt
            let diffInDays = endDayValue - startDayValue;
            let moreThanOneDay = diffInDays !== 0 ? true : false; // if startdt and enddt are on the same day, the value should be zero. moreThanOnday determines if the event is multi-dayed

            let checkIfEventPassWeekEdge = new Date(event.startdt); // checkIfEventPassWeekEdge; some events will    cross from sat into sun, this variable compares whether 'Sun' is passed, which shows that the event across the week

            let passesSunday = false;
            let currSundayPassed = ""            //
            for (let i = 0; i < diffInDays; i++){
                checkIfEventPassWeekEdge.setDate(checkIfEventPassWeekEdge.getDate() + 1);
                for (let j = 0; j < sundaysOfTheMonth.length; j++){
                    if (sundaysOfTheMonth[j].getDate() === checkIfEventPassWeekEdge.getDate()){
                        currSundayPassed = checkIfEventPassWeekEdge.getDate()
                    }
                };
            }

            // Returns respective divs if the event is 1 day, or more than 1 day
            if (currSundayPassed & event.enddt > currSundayPassed){
                newDatesThatPassSunday.push(event);
                return <div style={{
                    fontSize: '0.9rem',
                    color: 'blue', 
                    backgroundColor: 'pink', 
                    borderColor: 'black',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    marginRight: `-10px`,
                    zIndex: '2',
                    textAlign: 'left',
                    paddingLeft: '25px',
                }}
                key={checkIfEventPassWeekEdge}>{event.eventname}</div>
            } else if (currSundayPassed) {
                return <div style={{
                    fontSize: '0.9rem',
                    color: 'blue', 
                    backgroundColor: 'pink', 
                    borderColor: 'black',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    marginRight: `-10px`,
                    zIndex: '2',
                    textAlign: 'left',
                    paddingLeft: '25px',
                }}
                key={checkIfEventPassWeekEdge}>{event.eventname}</div>
            } else if (moreThanOneDay) {
                let eventOverflowCount = new Date(event.enddt).getDate() - new Date(event.startdt).getDate();
                let eventOffset = eventOverflowCount * 143;
                return <div style={{
                    fontSize: '0.9rem',
                    color: 'blue', 
                    backgroundColor: 'pink', 
                    borderColor: 'black',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    marginRight: `-${eventOffset}px`,
                    zIndex: '2',
                    textAlign: 'left',
                    paddingLeft: '25px',
                }} 
                key={event.eventid}>{event.eventname}</div>
            } else {
                return <div style={{
                    fontSize: '0.9rem',
                    color: 'blue', 
                    backgroundColor: 'pink', 
                    borderColor: 'black',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                }} 
                key={event.eventid}>{event.eventname}</div>
            }
        }))

        // adds events to fill up the calendar box
        while (displayEventsInCurrBox.length < 4){ 
             displayEventsInCurrBox.push(<div key={`empty-${emptyEventSpaceCount}`} style={{
                fontSize: '0.9rem',
                color: 'blue', 
                backgroundColor: 'brown', 
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: '1px',
            }}>Empty</div>);
            emptyEventSpaceCount = emptyEventSpaceCount + 1;
        }

        calendarBoxes.push(
        <CalendarDateBox 
            key={date} 
            baseMonth={displayDate.getMonth()} 
            displayDate={new Date(dateIndex)} 
            onClick={onDateBoxClick} 
            setChosenDate={setChosenDate} 
            refreshEvents = {refreshEvents} 
            setrefreshEvents = {setrefreshEvents}
            moveableEvent = {moveableEvent}
            setmoveableEvent = {setmoveableEvent}>
            <div style={{
                display: 'grid',
                gap: '3px',
                padding: '0px',
                margin: '0px',
                gridAutoRows: '20px',
                }}>
                {displayEventsInCurrBox}
                {children}
            </div>
        </CalendarDateBox>) // Button functionality to be added
        dateIndex.setDate(dateIndex.getDate() + 1)
        displayEventsInCurrBox = [] //resets eventsInCurrBox
        newDatesThatPassSunday = [] //reset the values
    } // Next, the CalendarDateBoxes, each displaying the date from the baseDate and incrementally increasing until all 6 rows are filled, are pushed into the calendarBoxes array.
    // According to AI, the key specified here is to uniquely identify the CalendarDateHeaders, so that they can be updated efficiently. Code **should** still work without defining the keys.

    return (
        <div className='calendar'>
            {calendarBoxes}
        </div>
    ) // Simply displays the calendarBoxes in the style defined in MainCalendar.css.
}
