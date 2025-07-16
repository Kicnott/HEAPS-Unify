import { CalendarDateBox } from './CalendarDateBox.jsx'
import { CalendarDateHeader } from './CalendarDateBox.jsx'
import { useRef, useState, useEffect } from 'react'
import calenderEventsType from './monthEventsDisplay.jsx'
import getBaseDate from './getBaseDate.jsx'
import '../../styles/mainCalendar.css'


// MainCalendar component used to display the big calendar in the Home page.
export const MainCalendar = ({children, displayDate, onDateBoxClick, refreshMonthEvents,setRefreshMonthEvents, monthEvents, setExtraEventsPopUp, setExtraEvents, setPopUpPosition, extraEvents, onMonthEventClick}) => {
    // children: Any additional labels to be stored on each DateBox. To be passed to the children variable in CalendarDateBox
    // displayDate: The date the user wants to display. As of now, the month of that date will be displayed by the calendar.
    // onDateBoxClick: The function to be run when a DateBox is clicked. To be passed to the onClick variable in CalendarDateBox.

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const boxRefArray = useRef([]); // used to store calendarBox, mainly for extra events display
    const [selectedDateExtraEventsIndex, setSelectedDateExtraEventsIndex] = useState(null); // used to store dateIndex for extra events box

    let monthEventsArray = [] // master array
    let calendarBoxes = [] // used as the final return
    let emptyEventSpaceCount = 0; // give the keys of empty divs an incremental value

    let baseStartDate = new Date(getBaseDate(displayDate)) // baseStartDate; needed to determine all sats in the month and currComparedDate ('1st displayed' day of the month)

    let baseEndDate = new Date(baseStartDate);
    baseEndDate = new Date(baseEndDate.setDate(new Date(baseStartDate).getDate() + cellCount)); // last displayed date of the month, e.g. in July 2025, the last displayed date is 2nd July

    let currComparedDate = new Date(baseStartDate) // currComparedDate: copy of baseStartDate. Serves an index/pointer that goes thru all displayed days in the chosen month. After getBaseDate and new Date(), it becomes a date of the '1st displayed' day of the month. For eg, in july 2025, the value -> Sun Jun 29 2025 00:00:00 GMT+0800 (Singapore Standard Time)
    let sundaysOfTheMonth = []; // sundaysOfTheMonth; used to store all sun (Digit)
    let currSunDate = new Date(baseStartDate); // currSunDate; copy of baseStartDate. Used to populate sundaysOfTheMonth
    currSunDate.setDate(currSunDate.getDate()); // allows the code to include events 1 week before (cross-ed over)
    let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] // Defining the calendar headers.

    for (let i = 0; i < 7; i++){
        calendarBoxes.push(<CalendarDateHeader key={days[i]}>{days[i]}</CalendarDateHeader>) // Add Day Headers
    } 

    // initilize master month array
    for (let i = 0; i < cellCount; i++){
        monthEventsArray.push([null, null, null, null, []])
    }

    // Gets the first displayed date of that week (not necessarily 1st)
    while (currComparedDate.getDay() !== 0){ 
        currComparedDate.setDate(currComparedDate.getDate() - 1);
    }

    // sundaysOfTheMonth; stores [[sun Date A, sun Month A], [sun Date B, sun Month B],...]
    for (let i = 0; i < (cellCount / 7) + 1; i++){
        sundaysOfTheMonth.push([new Date(currSunDate).getDate(), new Date(currSunDate).getMonth() + 1]);
        currSunDate.setDate(currSunDate.getDate() + 7);
    }

    // Update boxref for extra events box
    useEffect(() => {
            const boxRef = boxRefArray.current[selectedDateExtraEventsIndex];
        if (boxRef) {
            const { x, y } = boxRef.getBoundingClientRect();
            setPopUpPosition({ x, y });
        }
    }, [extraEvents]); 


    // filter events for each day into masterarray and return that day's calendar box display
    for (let dateIndex = 0; dateIndex < cellCount; dateIndex++){ 

        let innerArrayIndex = 0;
        let store4thEvent = ''; // needed to be replaced by extra events button if events >= 5

        // Intial filter of events for that day (currComparedDate)
        const comparedDate = currComparedDate.getDate();
        const comparedMonth = currComparedDate.getMonth();
        const comparedYear = currComparedDate.getFullYear();

        const dayEventsArray = monthEvents.filter((event)=>{
            const eventBegin = new Date(event.startdt);
            const eventStop = new Date(event.enddt);
            const dbComparedEventDate = eventBegin.getDate();
            const dbComparedEventMonth = eventBegin.getMonth();
            const dbComparedEventYear = eventBegin.getFullYear();
            let dbCheckEventsStartBeforeMonthEndWithin = false
            let dbCheckEventsStartBeforeMonthEndAfter = false

            if (dateIndex === 0){
                dbCheckEventsStartBeforeMonthEndWithin = (eventBegin < baseStartDate.setHours(0)) && (baseStartDate.setHours(0) < eventStop) && (eventStop <= baseEndDate)
                dbCheckEventsStartBeforeMonthEndAfter = (eventBegin < baseStartDate.setHours(0)) && (baseEndDate.setHours(23) <= eventStop)
            }

            return ((dbComparedEventDate === comparedDate) && (dbComparedEventMonth === comparedMonth)) && (dbComparedEventYear === comparedYear) || dbCheckEventsStartBeforeMonthEndWithin || dbCheckEventsStartBeforeMonthEndAfter;
        })

        // sorts the events in the box
        const sortedEventsInCurrDate = [...dayEventsArray].sort((a, b) => {
            const aDuration = (new Date(a.enddt) - new Date(a.startdt)) / (1000 * 60 * 60 * 24);
            const bDuration = (new Date(b.enddt) - new Date(b.startdt)) / (1000 * 60 * 60 * 24);

            // Push multi-day events to the front
            const aIsMultiDay = aDuration >= 1;
            const bIsMultiDay = bDuration >= 1;
            if (aIsMultiDay !== bIsMultiDay) {
                return bIsMultiDay - aIsMultiDay; 
            }

            // sort multi day by duration
            if (aIsMultiDay && bIsMultiDay) {
                return bDuration - aDuration;
            }

            // Push ealierest event to the front
            return new Date(a.startdt) - new Date(b.startdt);
        });

        sortedEventsInCurrDate.forEach(event => {
            const startdt = new Date(event.startdt)
            const enddt = new Date(event.enddt)
            const msInDay = 24 * 60 * 60 * 1000; // milliseconds in a day
            const diffInDays =  Math.floor((enddt - startdt) / msInDay);

            // checks if event is across the entire month, first month
            const isEventStartAcrossMonth = (
                ((baseStartDate.setHours(0) <= startdt) && (startdt.setHours(0) <= new Date(baseEndDate))) 
                && 
                (new Date(baseEndDate) < enddt)
            );

            // checks if event is across the entire month, middle months
            const isEventMiddleAcrossMonth = (
                ((startdt <= new Date(baseStartDate.setHours(0)))) 
                && 
                (new Date(baseEndDate) < enddt)
            );
3
            // checks if event is across the month and ends this month, ending month
            const isEventAcrossAndEndsThisMonth = (
                ((startdt <= baseStartDate.setHours(0))) 
                && 
                (enddt < new Date(baseEndDate))
            );

            // Checks for an index that contains a null (not modified into Case 8 by previous multi day events)
            while (monthEventsArray[dateIndex][innerArrayIndex] !== null){
                innerArrayIndex += 1;
                if (innerArrayIndex >= 4){
                    monthEventsArray[dateIndex][4].push(event);
                    return;
                }
            }

            // saves the 4th event in memory in case we need to pass it to the extra events button
            if (innerArrayIndex == 3){
                store4thEvent = event; 
            }

            if (diffInDays == 0){ // case 1: single day event
                monthEventsArray[dateIndex][innerArrayIndex] = calenderEventsType.case1Event(event, onMonthEventClick);
            } else if (diffInDays != 0){
                const noSunsPassed = noOfWeekEdgePasses(event, sundaysOfTheMonth);

                if (noSunsPassed == 0){ // case 2: multi day event, within the week
                    monthEventsArray[dateIndex][innerArrayIndex] = calenderEventsType.case2Event(event, diffInDays, onMonthEventClick);
                    for (let emptyPopulator = 1; emptyPopulator < diffInDays + 1; emptyPopulator++){
                        if (dateIndex + emptyPopulator == cellCount) { break; } // prevents index overflow
                        monthEventsArray[dateIndex + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                        emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                    }
                } else { 
                    const diffInDaysToSatStart = noOfDaysToNextClosestSat(event.startdt);
                    const diffInDaysToSunStart = noOfDaysToNextClosestSun(event.startdt);
                    const diffInDaysToSunEnd = noOfDaysToNextClosestSun(event.enddt);

                    // When an event crosses the entire month, we populate with case 5
                    if (isEventStartAcrossMonth){
                        // case 3: multi day event, crosses week, first week
                        monthEventsArray[dateIndex][innerArrayIndex] = calenderEventsType.case3Event(event, diffInDaysToSatStart, onMonthEventClick);
                        for (let emptyPopulator = 1; emptyPopulator < diffInDays + 1; emptyPopulator++){
                            if (dateIndex + emptyPopulator == cellCount) { break; } // prevents index overflow
                                monthEventsArray[dateIndex + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                        }

                        for (let passedEdge = 1; passedEdge < noSunsPassed + 1; passedEdge++){ 
                            const workingIndexSun = dateIndex - diffInDaysToSunStart + (passedEdge * 7);
                            if (dateIndex - diffInDaysToSunStart + (passedEdge * 7) >= cellCount){ break; } // prevents index overflow
                            
                            // case 5: passed edge, full week
                            monthEventsArray[workingIndexSun][innerArrayIndex] = calenderEventsType.case5Event(event, onMonthEventClick);

                            for (let emptyPopulator = 1; emptyPopulator < diffInDaysToSatStart + 1; emptyPopulator++){
                                if (workingIndexSun + emptyPopulator == cellCount) { break; } // prevents index overflow
                                monthEventsArray[workingIndexSun + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                            }
                        }
                    } else if (isEventMiddleAcrossMonth){
                        // case 3: multi day event, crosses week, first 
                        
                        for (let passedEdge = 1; passedEdge < noSunsPassed + 1; passedEdge++){ 
                            const workingIndexSun = dateIndex + (passedEdge * 7) - 7;
                            if (dateIndex + (passedEdge * 7) > cellCount){ break; } // prevents index overflow
                            monthEventsArray[workingIndexSun][innerArrayIndex] = calenderEventsType.case5Event(event); // case 5: passed edge, full week
                            for (let emptyPopulator = 1; emptyPopulator < diffInDaysToSatStart + 1; emptyPopulator++){
                                if (workingIndexSun + emptyPopulator == cellCount) { break; } // prevents index overflow
                                monthEventsArray[workingIndexSun + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                            }                        
                        }
                    } else if (isEventAcrossAndEndsThisMonth) { // event started before curr month and ends in this month
                        let eventPartition = {...event};
                        eventPartition.startdt = baseStartDate.toISOString()

                        const diffInDaysPartition =  Math.ceil((new Date(eventPartition.enddt) - baseStartDate) / (1000 * 60 * 60 * 24));
                        let noOfSunPassedPartition = Math.floor(diffInDaysPartition / 7);
                        const diffInDaysToSatStartPartition = noOfDaysToNextClosestSat(eventPartition.startdt);
                        const diffInDaysToSunEndPartition = noOfDaysToNextClosestSun(eventPartition.enddt);

                        if (diffInDaysPartition % 7 === 0) {noOfSunPassedPartition -= 1};

                        for (let passedEdge = 0; passedEdge < noOfSunPassedPartition + 1; passedEdge++){ 
                            const workingIndexSun = (passedEdge * 7);
                            if ((passedEdge * 7) > cellCount){ break; } // prevents index overflow
                            if (passedEdge == noOfSunPassedPartition){ // case 4: passed edge, final week
                                monthEventsArray[workingIndexSun][innerArrayIndex] = calenderEventsType.case4Event(event, diffInDaysToSunEndPartition, onMonthEventClick);
                                const noOfEmptyDivFinalWeek = diffInDaysPartition - (diffInDaysToSatStartPartition + 1) - ((noOfSunPassedPartition - 1) * 7);
                                for (let emptyPopulator = 1; emptyPopulator < noOfEmptyDivFinalWeek; emptyPopulator++){
                                    if (workingIndexSun + emptyPopulator == cellCount) { break; } // prevents index overflow
                                    monthEventsArray[workingIndexSun + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                    emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                                }
                            } else { // case 5: passed edge, full week
                                monthEventsArray[workingIndexSun][innerArrayIndex] = calenderEventsType.case5Event(event, onMonthEventClick);
                                for (let emptyPopulator = 1; emptyPopulator < diffInDaysToSatStartPartition + 1; emptyPopulator++){
                                    if (workingIndexSun + emptyPopulator == cellCount) { break; } // prevents index overflow
                                    monthEventsArray[workingIndexSun + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                    emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                                }                        
                            }
                        }
                    } else {
                        // case 3: multi day event, crosses week, first week
                        monthEventsArray[dateIndex][innerArrayIndex] = calenderEventsType.case3Event(event, diffInDaysToSatStart, onMonthEventClick);
                        for (let emptyPopulator = 1; emptyPopulator < diffInDays + 1; emptyPopulator++){
                            if (dateIndex + emptyPopulator == cellCount) { break; } // prevents index overflow
                            monthEventsArray[dateIndex + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                            emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                        }

                        for (let passedEdge = 1; passedEdge < noSunsPassed + 1; passedEdge++){ 
                            const workingIndexSun = dateIndex - diffInDaysToSunStart + (passedEdge * 7);
                            if (dateIndex - diffInDaysToSunStart + (passedEdge * 7) >= cellCount){ break; } // prevents index overflow
                            if (passedEdge == noSunsPassed){ // case 4: passed edge, final week
                                monthEventsArray[workingIndexSun][innerArrayIndex] = calenderEventsType.case4Event(event, diffInDaysToSunEnd, onMonthEventClick);
                                const noOfEmptyDivFinalWeek = diffInDays - (diffInDaysToSatStart + 1) - ((noSunsPassed - 1) * 7);
                                for (let emptyPopulator = 1; emptyPopulator < noOfEmptyDivFinalWeek; emptyPopulator++){
                                    if (workingIndexSun + emptyPopulator == cellCount) { break; } // prevents index overflow
                                    monthEventsArray[workingIndexSun + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                    emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                                }
                            } else { // case 5: passed edge, full week
                                monthEventsArray[workingIndexSun][innerArrayIndex] = calenderEventsType.case5Event(event, onMonthEventClick);
                                for (let emptyPopulator = 1; emptyPopulator < diffInDaysToSatStart + 1; emptyPopulator++){
                                    if (workingIndexSun + emptyPopulator == cellCount) { break; } // prevents index overflow
                                    monthEventsArray[workingIndexSun + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                    emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                                }                        
                            }
                        }
                    }
                }
            }
            innerArrayIndex += 1;
        });

        // if all 4 positions of the currComparedDate in monthEventsArray is non-null, and the fifth element array is not empty (contains the 5th event), we push the fourth event into the fifth element array and replace it with a button that displays (+..) all extra events
        if (monthEventsArray[dateIndex][4].length !== 0 && monthEventsArray[dateIndex][0] !== null && monthEventsArray[dateIndex][1] !== null && monthEventsArray[dateIndex][2] !== null && monthEventsArray[dateIndex][3] !== null){
            monthEventsArray[dateIndex][4].push(store4thEvent);
            const currDayExtraEvents = monthEventsArray[dateIndex][4];
            monthEventsArray[dateIndex][3] = extraEventsPopUpCall(dateIndex, currDayExtraEvents, setExtraEvents, setExtraEventsPopUp, setSelectedDateExtraEventsIndex);
        } else {
            // if there are nulls left after event populating, replace them with empty divs
            for (let checkForNull = 0; checkForNull < 4; checkForNull++){
                if (monthEventsArray[dateIndex][checkForNull] == null){
                    monthEventsArray[dateIndex][checkForNull] = calenderEventsType.case7Event(emptyEventSpaceCount);
                    emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                }
            }
        }

        let displayEvents = monthEventsArray[dateIndex].slice(0,4);

        calendarBoxes.push(
        <CalendarDateBox 
            ref={(el) => (boxRefArray.current[dateIndex] = el)}
            key={currComparedDate} 
            baseMonth={displayDate.getMonth()} 
            displayDate={new Date(currComparedDate)} 
            onClick={onDateBoxClick} 
            refreshMonthEvents = {refreshMonthEvents}
            setRefreshMonthEvents = {setRefreshMonthEvents}>
                <div style={{
                display: 'grid',
                gap: '3px',
                padding: '0px',
                margin: '0px',
                gridAutoRows: '1em',
                }}>
                {displayEvents}
                {children}
            </div>
        </CalendarDateBox>)

        currComparedDate.setDate(currComparedDate.getDate() + 1);
    }
    // Simply displays the calendarBoxes in the style defined in MainCalendar.css.
    return (
        <div className='calendar'>
            {calendarBoxes}
        </div>
    )
}

// Returns a clickable div to store extra events
function extraEventsPopUpCall(dateIndex, currDayExtraEvents, setExtraEvents, setExtraEventsPopUp, setSelectedDateExtraEventsIndex){
    const noOfExtraDays = currDayExtraEvents.length;
    
    return (
        <div 
            key = {`${dateIndex} ` + "extraButton"}
            style={{
                fontSize: '12px',
                color: 'black', 
                display: 'flex',
                textAlign: 'left',
                alignItems: 'center',
                width: `60px`,
                height: `18px`,
                paddingLeft: '2px',
                borderRadius: '7px',
            }} 
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "lightgray")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "")}
            onClick={(e) => {
                    setExtraEvents(currDayExtraEvents);
                    setExtraEventsPopUp(true);
                    setSelectedDateExtraEventsIndex(dateIndex);
                    e.stopPropagation();
                }               
            }>
        +{noOfExtraDays} more
        </div>
    )
}

// Returns number of times an event passes the week edge into the next week
function noOfWeekEdgePasses(event, sundaysOfTheMonth) {
    let noOfWeekEdgePasses = 0;

    const localEventStart = new Date(event.startdt)
    const localEventEnd = new Date(event.enddt)
    const year = sessionStorage.getItem("currYear");

    const sundaysOfTheMonthConverted = sundaysOfTheMonth.map((sun) =>{
        return new Date(year, sun[1] - 1, sun[0], 0);
    })

    sundaysOfTheMonthConverted.forEach((sun) => {
        if (localEventStart < sun && sun < localEventEnd) {
            noOfWeekEdgePasses += 1;
        }
    });

    return noOfWeekEdgePasses;
}

// Returns the next closest Sat
function noOfDaysToNextClosestSat(dt) {
    const eventStartDate = new Date(dt).getDay();

    let diffInDaysToSat = 6 - eventStartDate; // sat (6) - currentDay (?) = diffInDays

    return diffInDaysToSat;
}

// Returns the next closest Sun
function noOfDaysToNextClosestSun(dt) {
    const eventEndDate = new Date(dt).getDay();

    let diffInDaysToSun = eventEndDate; // sun (6) - currentDay (?) = diffInDays

    return diffInDaysToSun;
}