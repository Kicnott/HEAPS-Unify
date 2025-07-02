import React, { useEffect, useState } from "react";
import eventService from "../../services/eventService.jsx";
import calendarService from "../../services/calendarService.jsx";

export const ShowEvent = ({ eventid }) => {
    const [eventData, setEventData] = useState(null);
    const [calendarData, setCalendarData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (eventid) {
            eventService.getEvent(eventid)
                .then(res => setEventData(res.data))
                .catch(err => setError("Event not found or error loading event."));
        }
    }, [eventid]);

    useEffect(() => {
        if (eventData && eventData.calendarid) {
            calendarService.getCalendar(eventData.calendarid)
                .then(res => setCalendarData(res.data))
                .catch(err => setError("Error loading calendar for this event."));
        }
    }, [eventData]);

    if (error) return <div>{error}</div>;
    if (!eventData || !calendarData) return <div>Loading...</div>;

    // console.log("eventstarttime:", eventData.startdt);
    // console.log("eventendtime:", eventData.enddt);

    // const rawStartDate = eventData.eventstarttime;
    // const isoStartDate = rawStartDate.replace(" ", "T");
    // const startDateObj = new Date(isoStartDate);

    // const rawEndDate = eventData.eventendtime;
    // const isoEndDate = rawEndDate.replace(" ", "T");
    // const endDateObj = new Date(isoEndDate);

    const startDateObj = new Date(eventData.startdt);
    const endDateObj = new Date(eventData.enddt);
    return (
        <div>
            <h2>Event Details</h2>
            <table border={1} cellPadding={10} cellSpacing={0}>
                <tbody>
                    <tr>
                        <th>Event ID</th>
                        <td>{eventData.eventid}</td>
                    </tr>
                    <tr>
                        <th>Event Name</th>
                        <td>{eventData.eventname}</td>
                    </tr>
                    <tr>
                        <th>Event Description</th>
                        <td>{eventData.eventdescription}</td>
                    </tr>
                    <tr>
                        <th>Event Location</th>
                        <td>{eventData.eventlocation}</td>
                    </tr>
                    <tr>
                        <th>Start Time</th>
                        <td>{startDateObj.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th>End Time</th>
                        <td>{endDateObj.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th>In Calendar</th>
                        <td>{calendarData.calendarname}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

}
