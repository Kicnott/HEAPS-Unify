import React, { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import { DragEventBlock } from './DragEventBlock.jsx';
import { DropGridCell } from './DropGridCell.jsx';
import eventService from '../../services/eventService.jsx';
import '../../styles/timetable.css';

export const TimeTable = ({ children, chosenDate, refreshTrigger, eventselector, setEventDetailsOpen, monthEvents, setRefreshMonthEvents, closeOthers }) => {
    const [maxLanes, setMaxLanes] = useState(1);
    const [timedEvents, setTimedEvents] = useState([]);
    const [allDayEvents, setAllDayEvents] = useState([]);
    const [eventsWithLanes, setEventsWithLanes] = useState([]);
    const [hoverRange, setHoverRange] = useState({ start: null, end: null, lane: null });



    const dayStart = DateTime.fromJSDate(chosenDate).startOf('day');
    const dayEnd = dayStart.plus({ days: 1 });

    useEffect(() => {
        setTimedEvents([]);
        setAllDayEvents([]);
        setMaxLanes(1);

        const getEvents = async () => {
            const dayStart = DateTime.fromJSDate(chosenDate).startOf('day');
            const dayEnd = dayStart.plus({ days: 1 });

            // try {
            //     const response = await eventService.getEvents();
            //     const eventRows = response.data.rows;
            monthEvents.forEach(e => { if (!e.eventid && e.id) e.eventid = e.id; });
            const { timed, allDay } = processEvents(monthEvents, dayStart, dayEnd);
            const newMaxLanes = calculateMaxLanes(timed);

            setMaxLanes(newMaxLanes);
            setTimedEvents(timed);
            setAllDayEvents(allDay);

            // Assign events to lanes (use your assignLanes function if you have one)
            const initialAssignedEvents = assignLanes(timed, newMaxLanes);
            setEventsWithLanes(initialAssignedEvents);

            // } catch (e) {
            //     console.error('error fetching events:', e);
            //     setTimedEvents([]);
            //     setAllDayEvents([]);
            //     setEventsWithLanes([]);
            // }
        };

        getEvents(); // <-- Don't forget to call the async function!

    }, [chosenDate, refreshTrigger]);



    const processEvents = (events, dayStart, dayEnd) => {
        const timed = [];
        const allDay = [];

        events.forEach(e => {
            const start = DateTime.fromISO(e.startdt);
            const end = DateTime.fromISO(e.enddt);

            if (end <= dayStart || start >= dayEnd) return;

            // 1. Single-day all-day event
            if (start.equals(dayStart) && end.equals(dayStart.plus({ hours: 23, minutes: 45 }))) {
                allDay.push({
                    ...e,
                    startdt: dayStart.toISO(),
                    enddt: dayEnd.toISO(),
                    originalEvent: e
                });
                return;
            }

            // 2. In-between days of multi-day event
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
                if (start.hour === 0 && start.minute === 0) {
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
                        originalStart: e.originalEvent ? e.originalEvent.startdt : e.startdt,
                        originalEnd: e.originalEvent ? e.originalEvent.enddt : e.enddt,
                        originalEvent: e
                    });
                }
                return;
            }

            // 4. Last day of multi-day event
            if (start < dayStart && end > dayStart && end <= dayEnd) {
                if (end.equals(dayStart.plus({ hours: 23, minutes: 45 }))) {
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
                        originalStart: e.originalEvent ? e.originalEvent.startdt : e.startdt,
                        originalEnd: e.originalEvent ? e.originalEvent.enddt : e.enddt,
                        originalEvent: e
                    });
                }
                return;
            }

            // 5. Single-day timed event
            if (start >= dayStart && end <= dayEnd) {
                timed.push({
                    ...e,
                    originalStart: e.originalEvent ? e.originalEvent.startdt : e.startdt,
                    originalEnd: e.originalEvent ? e.originalEvent.enddt : e.enddt,
                    originalEvent: e
                });
                return;
            }
        });

        return { timed, allDay };
    };

    const calculateMaxLanes = (events) => {
        const laneCounts = Array(96).fill(0);
        events.forEach(e => {
            const start = DateTime.fromISO(e.startdt);
            const end = DateTime.fromISO(e.enddt);
            const startIdx = start.hour * 4 + Math.floor(start.minute / 15);
            let endIdx = end.hour * 4 + Math.floor(end.minute / 15);

            if (endIdx <= startIdx) endIdx = 96;

            for (let i = startIdx; i < endIdx && i < 96; i++) {
                laneCounts[i]++;
            }
        });
        return Math.max(1, ...laneCounts) + 1;
    };

    const assignLanes = (events, maxLanes) => {
        const sortedEvents = [...events].sort((a, b) =>
            DateTime.fromISO(a.startdt) - DateTime.fromISO(b.startdt)
        );

        const lanes = Array(96).fill().map(() => Array(maxLanes).fill(null));
        const assignedEvents = [];

        sortedEvents.forEach(e => {
            const start = DateTime.fromISO(e.startdt);
            const end = DateTime.fromISO(e.enddt);
            const startIdx = start.hour * 4 + Math.floor(start.minute / 15);
            let endIdx = end.hour * 4 + Math.floor(end.minute / 15);

            if (endIdx <= startIdx) endIdx = 96;

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
    };

    const allDayEventsLanes = useMemo(() => {
        return allDayEvents.map((e, idx) => ({
            ...e,
            lane: idx
        }));
    }, [allDayEvents]);

    const maxAllDayLanes = allDayEventsLanes.length;
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

    function isSingleDayEvent(event, dayStart, dayEnd) {
        const start = DateTime.fromISO(event.startdt);
        const end = DateTime.fromISO(event.enddt);
        const originalStart = DateTime.fromISO(event.originalStart);
        const originalEnd = DateTime.fromISO(event.originalEnd);

        // Only allow if the event is not a fragment (its true start and end are both within the day)
        return (
            start.hasSame(end, 'day') &&
            start >= dayStart &&
            end <= dayEnd &&
            originalStart.hasSame(originalEnd, 'day') && // true event is single day
            originalStart >= dayStart &&
            originalEnd <= dayEnd &&
            !(start.hour === 0 && start.minute === 0 && end.hour === 23 && end.minute === 45)
        );
    }


    const handleEventDrop = async (item, dropIdx, dropLaneIdx) => {
        // if (item.lane !== dropLaneIdx) return;

        const duration = item.endIdx - item.startIdx;
        const newStartIdx = dropIdx;
        const newEndIdx = dropIdx + duration;

        if (newStartIdx < 0 || newEndIdx > 96) return;

        const hasOverlap = eventsWithLanes.some(e =>
            e.lane === dropLaneIdx &&
            e.eventid !== item.eventid &&
            Math.max(e.startIdx, newStartIdx) < Math.min(e.endIdx, newEndIdx)
        );

        if (hasOverlap) return;

        const dayStart = DateTime.fromJSDate(chosenDate).startOf('day');
        const newStartdt = dayStart.plus({ minutes: newStartIdx * 15 }).toISO();
        const newEnddt = dayStart.plus({ minutes: newEndIdx * 15 }).toISO();

        // Optimistically update UI (optional)
        setEventsWithLanes(prev =>
            prev.map(e =>
                e.eventid === item.eventid
                    ? { ...e, startIdx: newStartIdx, endIdx: newEndIdx }
                    : e
            )
        );

        try {
            await eventService.updateEvent({
                newStartDt: newStartdt,
                newEndDt: newEnddt,
                eventId: item.eventid
            });

            // Refresh events after update
            // const response = await eventService.getEvents();
            // const eventRows = response.data.rows;
            const updatedMonthEvents = monthEvents.map(e =>
                e.eventid === item.eventid
                    ? { ...e, startdt: newStartdt, enddt: newEnddt }
                    : e
            );
            const { timed, allDay } = processEvents(updatedMonthEvents, dayStart, dayEnd);
            const newMaxLanes = calculateMaxLanes(timed);

            setMaxLanes(newMaxLanes);
            setTimedEvents(timed);
            setAllDayEvents(allDay);

            const updatedAssignedEvents = assignLanes(timed, newMaxLanes);
            setEventsWithLanes(updatedAssignedEvents);

            setRefreshMonthEvents(prev => prev + 1)

        } catch (e) {
            console.error("Error updating event:", e);
            // Optionally revert UI
        }
    };

    const MIN_TOTAL_WIDTH = 300;
    const LANE_WIDTH = 82;
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
                width: 'fit-content',
                minWidth: '100%'
            }}>
                <div style={{ ...hourLabelStyle, gridRow: '1', gridColumn: '1' }}>
                    All Day
                </div>

                <div style={{ gridRow: 1, gridColumn: `2 / span ${totalMaxLanes}` }}></div>

                {allDayEventsLanes.map((e, eIdx) => (
                    <div key={`event-allday-${eIdx}`}
                        className='event-block'
                        style={{
                            gridRow: 1,
                            gridColumn: e.lane + 2,
                            backgroundColor: e.calendarcolour
                        }}
                        onClick={() => {
                            eventselector(e.originalEvent.eventid || e.eventid);
                            closeOthers()
                            setTimeout(() => {
                                setEventDetailsOpen(true)
                            }, 50)
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
                        <DropGridCell
                            key={`interval-${idx}-${laneIdx}`}
                            idx={idx}
                            laneIdx={laneIdx}
                            style={{
                                ...intervalStyle,
                                gridRow: idx + 2,
                                gridColumn: laneIdx + 2
                            }}
                            onDrop={handleEventDrop}
                            canDropEvent={(item, cellIdx, cellLaneIdx) => {
                                // if (item.lane !== cellLaneIdx) return false;
                                const duration = item.endIdx - item.startIdx;
                                const newStartIdx = cellIdx;
                                const newEndIdx = cellIdx + duration;
                                if (newEndIdx > 95) return false;

                                const overlap = eventsWithLanes.some(e =>
                                    e.lane === cellLaneIdx &&
                                    e.eventid !== item.eventid &&
                                    Math.max(e.startIdx, newStartIdx) < Math.min(e.endIdx, newEndIdx)
                                );

                                return !overlap;
                            }}
                            hoverRange={hoverRange}
                            setHoverRange={setHoverRange}
                        />
                    ))
                ))}



                {eventsWithLanes.map((e, eIdx) =>
                    isSingleDayEvent(e, dayStart, dayEnd) ? (
                        <DragEventBlock
                            key={`event-${eIdx}`}
                            event={e}
                            gridRow={`${e.startIdx + 2} / ${e.endIdx + 2}`}
                            gridColumn={e.lane + 2}
                            onClick={() => {
                                eventselector(e.originalEvent.eventid || e.eventid);
                                closeOthers()
                                setTimeout(() => {
                                    setEventDetailsOpen(true)
                                }, 50)
                            }}>
                            {e.eventname}
                        </DragEventBlock>
                    ) : (
                        <div
                            key={`event-${eIdx}`}
                            className="event-block"
                            style={{
                                gridRow: `${e.startIdx + 2} / ${e.endIdx + 2}`,
                                gridColumn: e.lane + 2,
                                opacity: 1,
                                pointerEvents: 'auto',
                                cursor: 'default',
                                userSelect: 'none',
                                backgroundColor: e.calendarcolour
                            }}
                            onClick={() => {
                                eventselector(e.originalEvent.eventid || e.eventid);
                                closeOthers()
                                setTimeout(() => {
                                    setEventDetailsOpen(true)
                                }, 50)
                            }}
                        >
                            {e.eventname}
                        </div>
                    )
                )}

            </div>
        </div>
    );
};

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
    position: 'relative',
    border: '1px solid black',
    background: '#fff'
};
