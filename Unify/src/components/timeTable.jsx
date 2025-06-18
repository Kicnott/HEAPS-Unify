import React from 'react'
import { DateTime } from 'luxon'


export const TimeTable = ({children}) => {

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

    const cellstyle = {
        border: '1px solid black'
    }

    const hourgrids = hoursCreator().map((hour, i) => (
        <React.Fragment key={i}>
            <div style={cellstyle}>{hour}</div><div style={cellstyle}></div>
        </React.Fragment>
    ));

    const hourgridstyle = {
        display: 'grid',
        gridTemplateColumns: '50px auto',
        border: '1px solid black'
    }



    return (
        <div style={hourgridstyle}>
            {hourgrids}
        </div>
    )
}