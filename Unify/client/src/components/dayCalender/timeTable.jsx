import React, { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import eventService from '../../services/eventService.jsx';
import '../../styles/timetable.css';

//add drag and drop & event extension
//allow div to be created at last block 11pm-12am
    //automatically assigned endidx to be last block if endidx is ever smaller than startidx. dont think this will work for multi day events 

//make all day event block

export const TimeTable = ({ children, chosenDate, refreshTrigger, eventselector, setEventDetailsOpen }) => {
    // const [eventsForDay, setEventsForDay] = useState([]);
    const [maxLanes, setMaxLanes] = useState(1);
    const [timedEvents, setTimedEvents] = useState([]);
    const [allDayEvents, setAllDayEvents] = useState([]);


    useEffect(() => {
        setTimedEvents([]);
        setAllDayEvents([]);

        setMaxLanes(1);

        const getEvents = async () => {
            const dayStart = DateTime.fromJSDate(chosenDate).startOf('day');
            const dayEnd = dayStart.plus({ days: 1});
            try {
                const response = await eventService.getEvents();
                const eventRows = response.data.rows;

                const timed = [];
                const allDay = [];  

                eventRows.forEach(e => {
                    const start = DateTime.fromISO(e.startdt);
                    const end = DateTime.fromISO(e.enddt);

                    if (end <= dayStart || start >= dayEnd) return;

                    // 1. Single-day all-day event (12:00am to 11:45pm same day)
                    if (
                        start.equals(dayStart) &&
                        end.equals(dayStart.plus({ hours: 23, minutes: 45 })) &&
                        start.hour === 0 && start.minute === 0 &&
                        end.hour === 23 && end.minute === 45
                    ) {
                        allDay.push({
                            ...e,
                            startdt: dayStart.toISO(),
                            enddt: dayEnd.toISO(),
                            originalEvent: e
                        });
                        return;
                    }

                    // 2. In-between days of multi-day event (all-day)
                    if (start < dayStart && end > dayEnd) {
                        allDay.push({
                            ...e,
                            startdt: dayStart.toISO(),
                            enddt: dayEnd.toISO(),
                            originalEvent: e
                        });
                        return;
                    }

                    // 3. First day of multi-day event
                    if (start >= dayStart && start < dayEnd && end > dayEnd) {
                        if (
                            start.hour === 0 && start.minute === 0 &&
                            (end > dayEnd || end.equals(dayStart.plus({ hours: 23, minutes: 45 })))
                        ) {
                            allDay.push({
                                ...e,
                                startdt: dayStart.toISO(),
                                enddt: dayEnd.toISO(),
                                originalEvent: e
                            });
                        } else {
                            timed.push({
                                ...e,
                                startdt: e.startdt,
                                enddt: dayEnd.toISO(),
                                originalEvent: e
                            });
                        }
                        return;
                    }

                    // 4. Last day of multi-day event
                    if (start < dayStart && end > dayStart && end <= dayEnd) {
                        // If the event covers the whole day, treat as all-day
                        if (
                            end.equals(dayStart.plus({ hours: 23, minutes: 45 }))
                        ) {
                            allDay.push({
                                ...e,
                                startdt: dayStart.toISO(),
                                enddt: dayEnd.toISO(),
                                originalEvent: e
                            });
                        } else {
                            timed.push({
                                ...e,
                                startdt: dayStart.toISO(),
                                enddt: e.enddt,
                                originalEvent: e
                            });
                        }
                        return;
                    }

                    // 5. Single-day timed event (within this day)
                    if (start >= dayStart && end <= dayEnd) {
                        timed.push({
                            ...e,
                            originalEvent: e
                        });
                        return;
                    }
                });


                const laneCounts = Array(96).fill(0);
                timed.forEach(e => {
                    const start = DateTime.fromISO(e.startdt);
                    const end = DateTime.fromISO(e.enddt);
                    const startIdx = start.hour * 4 + Math.floor(start.minute / 15);
                    let endIdx = end.hour * 4 + Math.floor(end.minute / 15);

                    if (endIdx <= startIdx) {
                        endIdx = 96;
                    }

                    for (let i = startIdx; i < endIdx && i < 96; i++) {
                        laneCounts[i]++;
                    }
                });
                const newMaxLanes = Math.max(1, ...laneCounts);
                setMaxLanes(newMaxLanes);
                // setEventsForDay(matches);
                setTimedEvents(timed);
                setAllDayEvents(allDay);

            } catch (e) {
                console.error('error fetching events:', e);
                // setEventsForDay([]);
                setTimedEvents([]);
                setAllDayEvents([]);
            }
        };
        getEvents();
    }, [chosenDate, refreshTrigger]);

    


    const eventsWithLanes = useMemo(() => {
        const sortedEvents = [...timedEvents].sort((a, b) => {
            return DateTime.fromISO(a.startdt) - DateTime.fromISO(b.startdt);
        });

        const lanes = Array(96).fill().map(() => Array(maxLanes).fill(null));
        const assignedEvents = [];
        sortedEvents.forEach(e => {
            const start = DateTime.fromISO(e.startdt);
            const end = DateTime.fromISO(e.enddt);
            const startIdx = start.hour * 4 + Math.floor(start.minute / 15);
            let endIdx = end.hour * 4 + Math.floor(end.minute / 15);

            if (endIdx <= startIdx) {
                endIdx = 96;
            }

            let laneIndex = 0;

            while (laneIndex < maxLanes) {
                let available = true;
                for (let i = startIdx; i < endIdx && i < 96; i++) {
                    if (lanes[i][laneIndex]) {
                        available = false;
                        break;
                    }
                }
                if (available) break;
                laneIndex++;
            }

            if (laneIndex < maxLanes) {
                for (let i = startIdx; i < endIdx && i < 96; i++) {
                    lanes[i][laneIndex] = e;
                }

                assignedEvents.push({
                    ...e,
                    lane: laneIndex,
                    startIdx,
                    endIdx
                });
            }
        });

        return assignedEvents;
    }, [timedEvents, maxLanes]);

    const allDayEventsLanes = useMemo(() => {
        return allDayEvents.map((e, idx) => ({
            ...e,
            lane: idx
        }))
    }, [allDayEvents])

    const maxAllDayLanes = allDayEventsLanes.length || 1;
    const totalMaxLanes = Math.max(maxLanes, maxAllDayLanes);

    const hoursCreator = () => {
        const hours = [];
        const start = DateTime.fromObject({ hour: 0, minute: 0 });
        for (let i = 0; i < 24; i++) {
            const hour = start.plus({ hours: i });
            hours.push({
                hourLabel: hour.toFormat('ha').toLowerCase(),
                intervals: ['00', '15', '30', '45']
            });
        }
        return hours;
    };

    const MIN_TOTAL_WIDTH = 300;
    const LANE_WIDTH = 82; // Lane is 82px, event is 80px
    let gridCols = '60px ';
    if (totalMaxLanes === 1) {
        gridCols += `minmax(${MIN_TOTAL_WIDTH}px, 1fr)`;
    } else {
        const fixedLanes = Math.max(0, totalMaxLanes - 1);
        gridCols += `${`${LANE_WIDTH}px `.repeat(fixedLanes)}`;
        const lastLaneMin = Math.max(MIN_TOTAL_WIDTH - fixedLanes * LANE_WIDTH, LANE_WIDTH);
        gridCols += `minmax(${lastLaneMin}px, 1fr)`;
    }

    const gridTemplateRows = `80px repeat(96, 20px)`;
    const luxonDate = DateTime.fromJSDate(chosenDate);
    const formattedDate = luxonDate.toFormat("cccc - d LLLL");

    return (
        <div>
            <div style={dateLabelStyle}>{formattedDate}</div>
            <div style={{ marginTop: '48px' }}></div>
            <div style={{
                ...gridContainerStyle,
                gridTemplateColumns: gridCols,
                gridTemplateRows: gridTemplateRows,
                overflowX: 'auto'
            }}>
                <div
                    style={{
                        ...hourLabelStyle,
                        gridRow: '1',
                        gridColumn: '1'
                    }}>
                All Day</div>

                <div
                    style={{
                        gridRow: 1,
                        gridColumn: `2 / span ${totalMaxLanes}`
                    }}
                ></div>

                {allDayEventsLanes.map((e, eIdx) => (
                    <div key={`event-allday-${eIdx}`}
                        className='event-block'
                        style={{
                            gridRow: 1,
                            gridColumn: e.lane + 2,
                        }}
                        onClick={() => {
                            eventselector(e.originalEvent || e);
                            setEventDetailsOpen(true);
                        }}
                        >
                        {e.eventname}</div>
                ))}
                
                {hoursCreator().map((hourData, hourIdx) => (
                    <div key={`hour-${hourIdx}`}
                        style={{
                            ...hourLabelStyle,
                            gridRow: `${hourIdx * 4 + 2} / span 4`,
                            gridColumn: '1'
                        }}>     
                        {hourData.hourLabel}
                    </div>
                ))}

                {Array.from({ length: 96 }).map((_, idx) => (
                    Array.from({ length: totalMaxLanes }).map((_, laneIdx) => (
                        <div
                            key={`interval-${idx}-${laneIdx}`}
                            style={{
                                ...intervalStyle,
                                gridRow: idx + 2,
                                gridColumn: laneIdx + 2
                            }}
                        />
                    ))
                ))}

                {eventsWithLanes.map((e, eIdx) => (
                    <div key={`event-${eIdx}`}
                        className='event-block'
                        style={{
                            gridRow: `${e.startIdx + 2} / ${e.endIdx + 2}`,
                            gridColumn: e.lane + 2
                        }}
                        onClick={() => {
                            eventselector(e.originalEvent || e);
                            setEventDetailsOpen(true);
                        }}
                        >
                        {e.eventname}
                    </div>
                ))}


            </div>
        </div>
    );
};

// Styles
const dateLabelStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    fontFamily: 'Quicksand, Arial, sans-serif',
    color: '#222',
};

const hourLabelStyle = {
    border: '1px solid black',
    display: 'flex',
    background: '#fafbfc',
    zIndex: 1
};

const intervalStyle = {
    borderTop: '1px dotted rgba(0, 0, 0, 0.2)',
    borderBottom: '1px dotted rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box'
};


const gridContainerStyle = {
    display: 'grid',
    // gridAutoRows: '20px',
    position: 'relative',
    border: '1px solid black',
    background: '#fff'
};

