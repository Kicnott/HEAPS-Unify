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
        hours.push('');
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
    
    //individual cell assignment
    const hourgrids = hoursCreator().map((hour, i) => (
        <React.Fragment key={i}>
            <div style={cellstyle}>{hour}</div><div style={cellstyle}></div>
        </React.Fragment>
    ));
    
    //get the formatted date at head of overlayblock
    const luxonDate = DateTime.fromJSDate(chosenDate);
    const formattedDate = luxonDate.toFormat("cccc - d LLLL");

    return (
        <div>
            <div>{formattedDate}</div>
            <div style={hourgridstyle}>
                {hourgrids}
            </div>


<ul>
  {eventsInTheDay().map((event, idx) => (
    <li key={event.id || idx}>
      <div>Event: {event.getName()}</div>
      <div>
        Start: {event.getTimeslots().getStartObject().toISO()}
      </div>
      {/* Add more properties as needed */}
    </li>
  ))}
</ul>


        </div>
        
    )
}