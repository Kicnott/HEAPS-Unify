import React from 'react'
import { useState, useEffect} from 'react'
import { DateTime } from 'luxon'
import eventService from '../services/eventService.jsx'


// chosenDate is the displayDate from calendardatebox
export const TimeTable = ({children, chosenDate, refreshTrigger}) => {
    const [hoursWithEvents, sethoursWithEvents] = useState("");

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
    useEffect(() => {

        sethoursWithEvents(Array(24).fill(false));
        const editHourGrid = async () => {
            const jsDay = chosenDate.getDate();
            const jsMonth = chosenDate.getMonth() + 1;
            const jsYear = chosenDate.getFullYear();
            
            try {
                const response = await eventService.getEvents();
                const eventRows = response.data.rows;

                const matches = eventRows.filter(event => {
                    //these are luxon datetime objects
                    const startObject = DateTime.fromISO(event.startdt);
                    return (
                        startObject.day === jsDay && startObject.month === jsMonth && startObject.year === jsYear
                    )
                })

                const newHoursWithEvents = Array(24).fill(false);
                matches.forEach(event => {
                    const startObj = DateTime.fromISO(event.startdt);
                    const endObj = DateTime.fromISO(event.enddt);
                    const startHr = startObj.toLocal().hour;
                    const endHr = endObj.toLocal().hour;

                    for (let hour=startHr; hour < endHr; hour++) {
                        if (hour >= 0 && hour < 24) {
                            newHoursWithEvents[hour] = true;
                        }
                    }
                })
                sethoursWithEvents(newHoursWithEvents);
                
            } catch (e) {
                console.error('error fetching events:', e);
                sethoursWithEvents(Array(24).fill(false));
            }
        }
        editHourGrid();
    }, [chosenDate, refreshTrigger]);
        
    
    //individual cell assignment
    const hourgrids = hoursCreator().map((hour, i) => {
        const contentCellStyle = {
            ...cellstyle,
            backgroundColor: hoursWithEvents[i] ? 'lightblue' : 'transparent'
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

    return (
        <div>
            <div style={{
                fontSize: '1rem',           // Bigger text (adjust as needed)
                fontWeight: 'bold',         // Makes it stand out
                fontFamily: 'Quicksand, Arial, sans-serif',        
                color: '#222',              // Optional: a slightly softer black
            }}>{formattedDate}</div>

            <div style={{ marginTop: '48px' }}></div> {/* Push timetable down */}

            <div style={hourgridstyle}>
                {hourgrids}
            </div>

        </div>
        
    )
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
