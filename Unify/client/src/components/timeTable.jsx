import React from 'react'
import { DateTime } from 'luxon'


// chosenDate is the displayDate from calendardatebox
export const TimeTable = ({children, chosenDate, events}) => {

    const hoursCreator = () => {
        const hours = [];

        // set starting time to midnight 00:00
        const start = DateTime.fromObject({ hour:0, minute:0 });

        for (let i = 0; i < 24; i++) {
            // an hour variable is created with every loop from 0-23.
            // start variable outside is not affected as new datetime object is returned with plus
            const hour = start.plus({ hours: i});

            // hour is formatted to e.g. 12am because 'ha' is 'h' hours in 12 hour formatDate, 'a' is am/pm marker
            hours.push(hour.toFormat('ha').toLowerCase());
        }
        return hours;
    }

    // loop through events (list of objects), check the timeslot day month year is equal to the chosenDate, then the events will appear
    // returns array of events for chosenDate, if there is any
    const eventsInTheDay = () => {
        const jsDay = chosenDate.getDate();
        const jsMonth = chosenDate.getMonth() + 1;
        const jsYear = chosenDate.getFullYear();

        const matches = events.filter(event => {
            const timeslot = event.getTimeslots();
            const startObject = timeslot.getStartObject();
            return (
                startObject.day === jsDay && startObject.month === jsMonth && startObject.year === jsYear
            )
        })

        return matches;
    }


    const cellstyle = {
        border: '1px solid black',
        // for last box with no value to appear
        minHeight: '60px'
    }
    const hourgridstyle = {
        display: 'grid',
        gridTemplateColumns: '50px 300px',
        border: '1px solid black'
    }

    const hourWithEvent = Array(24).fill(false);

    eventsInTheDay().forEach(event => {
        const startObj = event.getTimeslots().getStartObject();
        const endObj = event.getTimeslots().getEndObject();
        const startHr = startObj.toLocal().hour;
        const endHr = endObj.toLocal().hour;

        for (let hour=startHr; hour < endHr; hour++) {
            if (hour >= 0 && hour < 24) {
                hourWithEvent[hour] = true;
            }
        }
    })


    
    //individual cell assignment
    const hourgrids = hoursCreator().map((hour, i) => {
        const contentCellStyle = {
            ...cellstyle,
            backgroundColor: hourWithEvent[i] ? 'lightblue' : 'transparent'
        };

        return (
            <React.Fragment key={i}>
                <div style={cellstyle}>{hour}</div><div style={contentCellStyle}></div>
            </React.Fragment>
        )
});
    
    //get the formatted date at head of overlayblock
    const luxonDate = DateTime.fromJSDate(chosenDate);
    const formattedDate = luxonDate.toFormat("cccc - d LLLL");

    const newEventStyle = {
        position: 'absolute',
        top: 16,
        right: 16,
        border: '1px solid black',
        background: 'white',
        padding: '4px 12px',
        fontSize: 14,
        borderRadius: '8px',
        cursor: 'pointer',
        zIndex: 2,
        pointerEvents: 'auto'
    }

    return (
        <div>
            <div style={{
                fontSize: '1rem',           // Bigger text (adjust as needed)
                fontWeight: 'bold',         // Makes it stand out
                fontFamily: 'Quicksand, Arial, sans-serif',        
                color: '#222',              // Optional: a slightly softer black
            }}>{formattedDate}</div>

            <div>
                <button style={newEventStyle}>+ New Event</button>
            </div>

            <div style={{ marginTop: '48px' }}></div> {/* Push timetable down */}

            <div style={hourgridstyle}>
                {hourgrids}
            </div>

        </div>
        
    )
}