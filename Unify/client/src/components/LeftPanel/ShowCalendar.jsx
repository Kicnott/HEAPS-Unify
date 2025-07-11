import React, { useEffect, useState } from "react";
import calendarService from "../../services/calendarService.jsx";
import accountService from "../../services/accountService.jsx";
import eventService from "../../services/eventService.jsx";
import { ScrollBlock } from "../blocks/ScrollBlock.jsx";


function formatFollowerCount(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'b';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
}

export const ShowCalendar = ({ accountid, calendarid, setShowEventOpen, setShowCalendarOpen, setShowAccountOpen, setShowAccountID, setShowEventID, refreshTrigger, modifyCalendarOnClick }) => {
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

            <div>
                <h2
                    style={{
                        marginBottom: 16,
                        borderBottom: '2px solid black',
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                    }}
                >
                    {calendarData.calendarname}
                </h2>

                {calendarData.calendardescription && (
                    <div
                        style={{
                            background: "#f9fafb",
                            borderLeft: "4px solid " + calendarData.calendarcolour,
                            borderRadius: 8,
                            padding: "16px 20px",
                            marginBottom: 24,
                            fontStyle: "italic",
                            color: "#374151",
                            fontSize: 18,
                        }}
                    >
                        {calendarData.calendardescription}
                    </div>
                )}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                        gap: 16,
                    }}
                >
                    <button
                        style={{
                            background: "#f3f4f6",
                            color: "#111",
                            border: "none",
                            borderRadius: 16,
                            padding: "6px 14px",
                            fontWeight: 500,
                            fontSize: 15,
                            cursor: "pointer",
                            transition: "background 0.2s",
                        }}
                        onClick={() => {
                            setShowAccountID(accountData.accountid);
                            setTimeout(() => {
                                setShowAccountOpen(true);
                                setShowCalendarOpen(false);
                            }, 100);
                        }}
                        title="View owner profile"
                    >
                        Owned By: 👤 {accountData.accountusername}
                    </button>

                    <span
                        style={{
                            background: "#eef2ff",
                            color: "#6366f1",
                            borderRadius: 16,
                            padding: "6px 14px",
                            fontWeight: 500,
                            fontSize: 15,
                            display: "inline-block",
                        }}
                        title={calendarData.followercount + ' follower' + (calendarData.followercount == 1 ? '' : 's')}
                    >
                        👥 {formatFollowerCount(calendarData.followercount)}
                    </span>
                </div>

                <div>
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16 }}>Events</div>
                    {eventData.length === 0 ? (
                        <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
                            <ScrollBlock>
                                <div style={{ color: "#888" }}>No events</div>
                            </ScrollBlock>
                        </div>


                    ) : (
                        <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
                            <ScrollBlock
                                buttonData={eventData.map(event => ({
                                    label: event.eventname + " - " + new Date(event.startdt).toLocaleString(),
                                    onClick: () => {
                                        setShowEventID(event.eventid);
                                        setShowEventOpen(true);
                                        setShowCalendarOpen(false);
                                    }
                                }))}
                            />

                        </div>
                    )}
                </div>
            </div>

            {accountid && String(accountid) === String(calendarData.accountid) && (
                <button
                onClick={
                    modifyCalendarOnClick
                }
                >
                    Modify Calendar
                </button>
            )}

            {isFollowing !== null && isFollowing && String(accountid) !== String(calendarData.accountid) && (
                <button
                    onClick={() => {
                        calendarService.unfollowCalendar(calendarData.calendarid, accountid)
                            .then(() => {
                                setIsFollowing(false);
                                setTimeout(() => {
                                    if (refreshTrigger) refreshTrigger((prev) => prev + 1);
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
                                    if (refreshTrigger) refreshTrigger((prev) => prev + 1);
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