import React, { useEffect, useState } from "react";
import calendarService from "../../services/calendarService.jsx";

export const ShowCalendar = ({ calendarid }) => {
    const [calendarData, setCalendarData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (calendarid) {
            calendarService.getCalendar(calendarid)
                .then(res => setCalendarData(res.data))
                .catch(err => setError("Calendar not found or error loading calendar."));
        }
    }, [calendarid]);

    if (error) return <div>{error}</div>;
    if (!calendarData) return <div>Loading...</div>;

    return (
        <div>
            <h2>Calendar Details</h2>
            <table border={1} cellPadding={10} cellSpacing={0}>
                <tr>
                    <th>Calendar ID</th>
                    <td>{calendarData.calendarid}</td>
                </tr>
                <tr>
                    <th>Calendar Name</th>
                    <td>{calendarData.calendarname}</td>
                </tr>
                <tr>
                    <th>Calendar Description</th>
                    <td>{calendarData.calendardescription}</td>
                </tr>
                <tr>
                    <th>Privacy</th>
                    <td>{calendarData.calendarprivacy}</td>
                </tr>
            </table>
        </div>
    );
}