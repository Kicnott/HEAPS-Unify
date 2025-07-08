import { CalendarDateBox } from './CalendarDateBox.jsx'
import { CalendarDateHeader } from './CalendarDateBox.jsx'
import { useRef, useState, useEffect } from 'react'
import calenderEventsType from './monthEventsDisplay.jsx'
import getBaseDate from './getBaseDate.jsx'
import '../../styles/MainCalendar.css'


// MainCalendar component used to display the big calendar in the Home page.
export const MainCalendar = ({children, displayDate, onDateBoxClick, refreshEvents, setrefreshEvents, refreshMonthEvents,setRefreshMonthEvents, monthEvents, setChosenDate, setMonthEvents, isOverlayBackgroundHidden, hideOverlayBackground, setExtraEventsPopUp, setExtraEvents, setPopUpPosition, extraEvents}) => {
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

    const baseDate = new Date(getBaseDate(displayDate)) // baseDate; needed to determine all sats in the month and currComparedDate ('1st displayed' day of the month)
    let currComparedDate = new Date(baseDate) // currComparedDate: copy of baseDate. Serves an index/pointer that goes thru all displayed days in the chosen month. After getBaseDate and new Date(), it becomes a date of the '1st displayed' day of the month. For eg, in july 2025, the value -> Sun Jun 29 2025 00:00:00 GMT+0800 (Singapore Standard Time)
    let sundaysOfTheMonth = []; // sundaysOfTheMonth; used to store all sun (Digit)
    let currSunDate = new Date(baseDate); // currSunDate; copy of baseDate. Used to populate sundaysOfTheMonth
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
    for (let i = 0; i < cellCount / 7 ; i++){
        sundaysOfTheMonth.push([new Date(currSunDate).getDate(), new Date(currSunDate).getMonth() + 1]);
        currSunDate.setDate(currSunDate.getDate() + 7);
    }

    // filter events for each day into masterarray and return that day's calendar box display
    for (let dateIndex = 0; dateIndex < cellCount; dateIndex++){ 

        // Update boxref for extra events box
        useEffect(() => {
                const boxRef = boxRefArray.current[selectedDateExtraEventsIndex];
            if (boxRef) {
                const { x, y } = boxRef.getBoundingClientRect();
                setPopUpPosition({ x, y });
            }
        }, [extraEvents]); 

        let innerArrayIndex = 0;
        let store4thEvent = ''; // needed to be replaced by extra events button if events >= 5

        // Intial filter of events for that day (currComparedDate)
        const comparedDate = currComparedDate.getDate();
        const comparedMonth = currComparedDate.getMonth();

        const dayEventsArray = monthEvents.filter((event)=>{
            const dbComparedEventDate = new Date(event.startdt).getDate();
            const dbComparedEventMonth = new Date(event.startdt).getMonth();
            return (dbComparedEventDate === comparedDate) && (dbComparedEventMonth === comparedMonth);
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
            const msInDay = 24 * 60 * 60 * 1000; // milliseconds in a day

            const diffInDays =  Math.floor((new Date(event.enddt) - new Date(event.startdt)) / msInDay);

            // If innerArrayIndex is 4 or more, all displayable divs are occupied. Transfer the remaining events in sortedEventsInCurrDate to the 5th element in monthEventsArray (it stores extra events objects for that day)


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
                monthEventsArray[dateIndex][innerArrayIndex] = calenderEventsType.case1Event(event);
            } else if (diffInDays != 0){
                const noSunsPassed = noOfWeekEdgePasses(event, sundaysOfTheMonth);

                if (noSunsPassed == 0){ // case 2: multi day event, within the week
                    monthEventsArray[dateIndex][innerArrayIndex] = calenderEventsType.case2Event(event, diffInDays);
                    for (let emptyPopulator = 1; emptyPopulator < diffInDays + 1; emptyPopulator++){
                        if (dateIndex + emptyPopulator == cellCount) { break; } // prevents index overflow
                        monthEventsArray[dateIndex + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                        emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                    }
                } else { // case 3: multi day event, crosses week, first week
                    const diffInDaysToSatStart = noOfDaysToNextClosestSat(event.startdt);
                    const diffInDaysToSunStart = noOfDaysToNextClosestSun(event.startdt);
                    const diffInDaysToSunEnd = noOfDaysToNextClosestSun(event.enddt);

                    monthEventsArray[dateIndex][innerArrayIndex] = calenderEventsType.case3Event(event, diffInDaysToSatStart);
                    for (let emptyPopulator = 1; emptyPopulator < diffInDays + 1; emptyPopulator++){
                        if (dateIndex + emptyPopulator == cellCount) { break; } // prevents index overflow
                        monthEventsArray[dateIndex + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                        emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                    }

                    for (let passedEdge = 1; passedEdge < noSunsPassed + 1; passedEdge++){ 
                        const workingIndexSun = dateIndex - diffInDaysToSunStart + (passedEdge * 7);
                        if (dateIndex - diffInDaysToSunStart + (passedEdge * 7) >= cellCount){ break; } // prevents index overflow
                        if (passedEdge == noSunsPassed){ // case 4: passed edge, final week
                            monthEventsArray[workingIndexSun][innerArrayIndex] = calenderEventsType.case4Event(event, diffInDaysToSunEnd);
                            const noOfEmptyDivFinalWeek = diffInDays - (diffInDaysToSatStart + 1) - ((noSunsPassed - 1) * 7);
                            for (let emptyPopulator = 1; emptyPopulator < noOfEmptyDivFinalWeek; emptyPopulator++){
                                if (workingIndexSun + emptyPopulator == cellCount) { break; } // prevents index overflow
                                monthEventsArray[workingIndexSun + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
                            }
                        } else { // case 5: passed edge, full week
                            monthEventsArray[workingIndexSun][innerArrayIndex] = calenderEventsType.case5Event(event);
                            for (let emptyPopulator = 1; emptyPopulator < diffInDaysToSatStart + 1; emptyPopulator++){
                                if (workingIndexSun + emptyPopulator == cellCount) { break; } // prevents index overflow
                                monthEventsArray[workingIndexSun + emptyPopulator][innerArrayIndex] = calenderEventsType.case7Event(emptyEventSpaceCount);
                                emptyEventSpaceCount += 1; // increments emptyEventSpaceCount to set keys
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
            setChosenDate={setChosenDate} 
            refreshEvents = {refreshEvents} 
            setrefreshEvents = {setrefreshEvents}
            refreshMonthEvents = {refreshMonthEvents}
            setRefreshMonthEvents = {setRefreshMonthEvents}>
            <div style={{
                display: 'grid',
                gap: '3px',
                padding: '0px',
                margin: '0px',
                gridAutoRows: '20px',
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
                color: 'black', 
                backgroundColor: 'grey', 
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: '1px',
                display: 'flex',
                paddingLeft: '5px',
                textAlign: 'left',
                alignItems: 'center',
                width: `25px`,
                borderRadius: '10px'
            }} 
            onClick={(e) => {
                    setExtraEvents(currDayExtraEvents);
                    setExtraEventsPopUp(true);
                    setSelectedDateExtraEventsIndex(dateIndex);
                    e.stopPropagation();
                }               
            }>
        +{noOfExtraDays}
        </div>
    )
}

// Returns number of times an event passes the week edge into the next week
function noOfWeekEdgePasses(event, sundaysOfTheMonth) {
    const eventStartDate = new Date(event.startdt).getDate();
    const eventStartMonth = new Date(event.startdt).getMonth() + 1;
    const eventEndDate = new Date(event.enddt).getDate();
    const eventEndMonth = new Date(event.enddt).getMonth() + 1;
    let noOfWeekEdgePasses = 0;
    sundaysOfTheMonth.forEach((sun) => {
        if ((eventStartDate < sun[0] && eventStartMonth == sun[1]) && (sun[0] <= eventEndDate && eventEndMonth == sun[1])) {
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