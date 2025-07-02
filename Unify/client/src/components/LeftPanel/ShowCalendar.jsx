import React, { useEffect, useState } from "react";
import calendarService from "../../services/calendarService.jsx";
import accountService from "../../services/accountService.jsx";
import eventService from "../../services/eventService.jsx";
import { ScrollBlock } from "../blocks/ScrollBlock.jsx";

export const ShowCalendar = ({ accountid, calendarid, setShowEventOpen, setShowCalendarOpen, setShowAccountOpen, setShowAccountID, setShowEventID, refreshFollowedCalendars }) => {
    const [calendarData, setCalendarData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);


    useEffect(() => {
        if (calendarid) {
            calendarService.getCalendar(calendarid)
                .then(res => setCalendarData(res.data))
                .catch(err => setError("Calendar not found or error loading calendar."));
        }
    }, [calendarid]);

    useEffect(() => {
        if (calendarData) {
            calendarService.checkFollowedCalendar(calendarData.calendarid, accountid)
                .then(res => setIsFollowing(res.data.status))
                .catch(err => setError("Error checking if calendar is followed."));
        }
    }, [calendarData, accountid]);

    // console.log("Is Following:", isFollowing);

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

    useEffect(() => {
        return () => setError(null);
    }, [calendarid]);

    if (error) return <div>{error}</div>;
    if (!calendarData || !accountData || !eventData) return <div>Loading...</div>;

    // console.log("Event Data:", eventData);

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
                                <div
                                    style={{ maxHeight: "200px", overflowY: "auto" }}>
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
                                </div>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            {accountid && String(accountid) === String(calendarData.accountid) && (
                <button>
                    You own this calendar
                </button>
            )}

            {isFollowing !== null && isFollowing && String(accountid) !== String(calendarData.accountid) && (
                <button
                    onClick={() => {
                        calendarService.unfollowCalendar(calendarData.calendarid, accountid)
                            .then(() => {
                                setIsFollowing(false);
                                setTimeout(() => {
                                    if (refreshFollowedCalendars) refreshFollowedCalendars();
                                }, 100);

                            })
                            .catch(err => setError("Error unfollowing calendar."));
                    }}
                >
                    Unfollow Calendar
                </button>
            )}
            {isFollowing !== null && !isFollowing && String(accountid) !== String(calendarData.accountid) && (
                <button
                    onClick={() => {
                        calendarService.followCalendar(calendarData.calendarid, accountid)
                            .then(() => {
                                setIsFollowing(true);
                                setTimeout(() => {
                                    if (refreshFollowedCalendars) refreshFollowedCalendars();
                                }, 100);

                            })
                            .catch(err => setError("Error following calendar."));
                    }}
                >
                    Follow Calendar
                </button>
            )}
        </div>
    );
}