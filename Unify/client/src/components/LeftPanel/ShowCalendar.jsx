import React, { useEffect, useState } from "react";
import calendarService from "../../services/calendarService.jsx";
import accountService from "../../services/accountService.jsx";
import eventService from "../../services/eventService.jsx";
import { ScrollBlock } from "../blocks/ScrollBlock.jsx";

export const ShowCalendar = ({ calendarid, setShowEventOpen, setShowCalendarOpen, setShowAccountOpen, setShowAccountID, setShowEventID }) => {
    const [calendarData, setCalendarData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (calendarid) {
            calendarService.getCalendar(calendarid)
                .then(res => setCalendarData(res.data))
                .catch(err => setError("Calendar not found or error loading calendar."));
        }
    }, [calendarid]);

    useEffect(() => {
        if (calendarData) {
            accountService.getAccount(calendarData.accountid)
                .then(res => setAccountData(res.data))
                .catch(err => setError("Account not found or error loading account."));

            eventService.getMyEvents(calendarData.calendarid)
                .then(res => setEventData(res.data.rows))
                .catch(err => setError("Events not found or error loading events."));
        }
    }, [calendarData]);

    if (error) return <div>{error}</div>;
    if (!calendarData || !accountData || !eventData) return <div>Loading...</div>;

    console.log("Event Data:", eventData);

    return (
        <div>
            <h2>Calendar Details</h2>
            <table border={1} cellPadding={10} cellSpacing={0}>
                <tbody>
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
                    <tr>
                        <th>Owned By</th>
                        <td><button
                            onClick={() => {
                                setShowAccountID(accountData.accountid);
                                setTimeout(() => {
                                    setShowAccountOpen(true);
                                    setShowCalendarOpen(false);
                                }, 100);
                            }}
                        >{accountData.accountusername}</button></td>
                    </tr>
                    <tr>
                        <th>Events</th>
                        <td>
                            {eventData.length === 0 ? (
                                <div>No events</div>
                            ) : (
                                <ScrollBlock
                                    buttonData={eventData.map(event => ({
                                        label: event.eventname,
                                        onClick: () => {
                                            setShowEventID(event.eventid);
                                            setShowEventOpen(true);
                                            setShowCalendarOpen(false);
                                        }
                                    }))}
                                />
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}