import React from 'react'
import { useState, useEffect} from 'react'
import { DateTime } from 'luxon'
import eventService from '../services/eventService.jsx'


// chosenDate is the displayDate from calendardatebox
export const TimeTable = ({children, chosenDate, refreshTrigger}) => {
    const [eventsForDay, setEventsForDay] = useState([]);

    useEffect(() => {
        setEventsForDay([]);

        const getEvents = async () => {
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
                setEventsForDay(matches);
                
            } catch (e) {
                console.error('error fetching events:', e);
                setEventsForDay([]);
            }
        }
        getEvents();
    }, [chosenDate, refreshTrigger]);
        

    const hoursCreator = () => {
        const hours = [];

        // set starting time to midnight 00:00
        const start = DateTime.fromObject({ hour:0, minute:0 });
        for (let i = 0; i < 24; i++) {
            // an hour variable is created with every loop from 0-23.
            // start variable outside is not affected as new datetime object is returned with plus
            const hour = start.plus({ hours: i});

            // hour is formatted to e.g. 12am because 'ha' is 'h' hours in 12 hour formatDate, 'a' is am/pm marker
            hours.push({
                hourLabel : hour.toFormat('ha').toLowerCase(),
                intervals : ['00', '15', '30', '45']
            });
        }
        return hours;
    }

    //individual cell assignment
    const getEventPosition = (start, end) => {
        const startRow = start.hour * 4 + Math.floor(start.minute / 15) + 1;
        const endRow = end.hour * 4 + Math.floor(end.minute / 15) + 1;
        return { gridRow: `${startRow} / ${endRow}`, gridColumn: '2'};
    }
    
    
    //get the formatted date at head of overlayblock
    const luxonDate = DateTime.fromJSDate(chosenDate);
    const formattedDate = luxonDate.toFormat("cccc - d LLLL");

    return (
        <div>
            <div style={dateLabelStyle}>{formattedDate}</div>

            <div style={{ marginTop: '48px' }}></div> {/* Push timetable down */}

            <div style={gridContainerStyle}>

                {hoursCreator().map((hourData, hourIdx) => (
                    <div key={`hour-${hourIdx}`}
                        style={{
                            ...hourLabelStyle,
                            gridRow: `${hourIdx * 4 + 1} / span 4`
                        }}>
                            {hourData.hourLabel}
                    </div>
                ))}

                {Array.from({length:96}).map((_ , idx) => (
                    <div
                        key={`interval-${idx}`}
                        style={{
                            ...intervalStyle,
                            gridRow: idx + 1
                        }}
                    />
                ))}

                {eventsForDay.map((e, eIdx) => {
                    const start = DateTime.fromISO(e.startdt);
                    const end = DateTime.fromISO(e.enddt);
                    const position = getEventPosition(start, end);

                    return (
                        <div key={`event-${eIdx}`}
                            style={{
                                ...eventBlockStyle,
                                ...position
                            }}>
                            {e.eventname}
                        </div>
                    )
                })}
                
            </div>

        </div>
        
    )
}

const dateLabelStyle = {
    fontSize: '1rem',           
    fontWeight: 'bold',         
    fontFamily: 'Quicksand, Arial, sans-serif',        
    color: '#222',              
}

const hourLabelStyle = {
    border: '1px solid black',
    display: 'flex'
}

const intervalStyle = {
    border: '1px dotted rgba(0, 0, 0, 0.2)',
    gridColumn: '2',
    minWidth: '300px'
}

const eventBlockStyle = {
    backgroundColor: 'lightblue',
    borderRadius: '4px',
    margin: '1px',
    padding: '2px 8px',
    zIndex: 2,
    fontSize: '0.8rem',
    overflow: 'hidden',
    gridColumn: '2',
    maxWidth: '80px'
}

const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '60px 1fr',
    gridAutoRows: '20px',
    position: 'relative',
    border: '1px solid black'
}





