import React, { useEffect, useState } from "react";
import eventService from "../../services/eventService.jsx";
import calendarService from "../../services/calendarService.jsx";

export const ShowEvent = ({ eventid, setShowCalendarOpen, setShowCalendarID, setShowEventOpen, currentAccountid, onModifyEventClick }) => {
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

    useEffect(() => {
        return () => setError(null);
    }, [eventid]);

    if (error) return <div>{error}</div>;
    if (!eventData || !calendarData) return <div>Loading...</div>;

    const startDateObj = new Date(eventData.startdt);
    const endDateObj = new Date(eventData.enddt);
    return (
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
                {eventData.eventname}
            </h2>

            <div
                style={{
                    maxWidth: 500,
                    margin: "2rem auto",
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    background: "#fff",
                    padding: 28,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    textAlign: 'center'
                }}
            >

                {eventData.eventdescription && (
                    <div style={{
                        background: "#f9fafb",
                        borderLeft: "4px solid #6366f1",
                        borderRadius: 8,
                        padding: "12px 18px",
                        marginBottom: 20,
                        color: "#374151",
                        fontSize: 16,
                        fontStyle: "italic"
                    }}>
                        {eventData.eventdescription}
                    </div>
                )}

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    fontSize: 16,
                    color: "#444",
                    marginBottom: 16
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span role="img" aria-label="Location" style={{ fontSize: 20 }} title="Location">📍</span>
                        <span style={{ color: eventData.eventlocation ? "#444" : "#bbb" }}>
                            {eventData.eventlocation || "No location"}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span role="img" aria-label="Start" style={{ fontSize: 20 }} title="Start Time">🕒</span>
                        <span>
                            {startDateObj.toLocaleString()}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span role="img" aria-label="End" style={{ fontSize: 20 }} title="End Time">🏁</span>
                        <span>
                            {endDateObj.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div>
                    <button
                        style={{
                            background: "#f3f4f6",
                            color: "#2563eb",
                            border: "none",
                            borderRadius: 14,
                            padding: "6px 16px",
                            fontWeight: 500,
                            fontSize: 15,
                            cursor: "pointer",
                            transition: "background 0.2s",
                        }}
                        onClick={() => {
                            setShowCalendarID(calendarData.calendarid);
                            setTimeout(() => {
                                setShowCalendarOpen(true);
                                setShowEventOpen(false);
                            }, 100);
                        }}
                        title="View calendar"
                    >
                        📅 {calendarData.calendarname}
                    </button>
                </div>
            </div>
            {currentAccountid && String(currentAccountid) === String(calendarData.accountid) && (
                <button
                onClick={onModifyEventClick}
                >
                    Modify Event
                </button>
            )}
        </div>
    );

}
