<<<<<<< HEAD:Unify/client/src/components/timeTable.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import eventService from '../services/eventService.jsx';
import '../styles/timetable.css';
=======
import React from 'react'
import { useState, useEffect} from 'react'
import { DateTime } from 'luxon'
import eventService from '../../services/eventService.jsx'
>>>>>>> main:Unify/client/src/components/dayCalender/timeTable.jsx

export const TimeTable = ({ children, chosenDate, refreshTrigger, eventselector, setEventDetailsOpen }) => {
    const [eventsForDay, setEventsForDay] = useState([]);
    const [maxLanes, setMaxLanes] = useState(1);

    useEffect(() => {
        setEventsForDay([]);
        setMaxLanes(1);

        const getEvents = async () => {
            const jsDay = chosenDate.getDate();
            const jsMonth = chosenDate.getMonth() + 1;
            const jsYear = chosenDate.getFullYear();

            try {
                const response = await eventService.getEvents();
                const eventRows = response.data.rows;
                const matches = eventRows.filter(event => {
                    const startObject = DateTime.fromISO(event.startdt);
                    return (
                        startObject.day === jsDay &&
                        startObject.month === jsMonth &&
                        startObject.year === jsYear
                    );
                });

                const laneCounts = Array(96).fill(0);
                matches.forEach(e => {
                    const start = DateTime.fromISO(e.startdt);
                    const end = DateTime.fromISO(e.enddt);
                    const startIdx = start.hour * 4 + Math.floor(start.minute / 15);
                    const endIdx = end.hour * 4 + Math.floor(end.minute / 15);
                    for (let i = startIdx; i < endIdx && i < 96; i++) {
                        laneCounts[i]++;
                    }
                });
                const newMaxLanes = Math.max(1, ...laneCounts);
                setMaxLanes(newMaxLanes);
                setEventsForDay(matches);

            } catch (e) {
                console.error('error fetching events:', e);
                setEventsForDay([]);
            }
        };
        getEvents();
    }, [chosenDate, refreshTrigger]);

    const eventsWithLanes = useMemo(() => {
        const sortedEvents = [...eventsForDay].sort((a, b) => {
            return DateTime.fromISO(a.startdt) - DateTime.fromISO(b.startdt);
        });

        const lanes = Array(96).fill().map(() => Array(maxLanes).fill(null));
        const assignedEvents = [];
        sortedEvents.forEach(e => {
            const start = DateTime.fromISO(e.startdt);
            const end = DateTime.fromISO(e.enddt);
            const startIdx = start.hour * 4 + Math.floor(start.minute / 15);
            const endIdx = end.hour * 4 + Math.floor(end.minute / 15);
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
    }, [eventsForDay, maxLanes]);

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
    if (maxLanes === 1) {
        gridCols += `minmax(${MIN_TOTAL_WIDTH}px, 1fr)`;
    } else {
        const fixedLanes = Math.max(0, maxLanes - 1);
        gridCols += `${`${LANE_WIDTH}px `.repeat(fixedLanes)}`;
        const lastLaneMin = Math.max(MIN_TOTAL_WIDTH - fixedLanes * LANE_WIDTH, LANE_WIDTH);
        gridCols += `minmax(${lastLaneMin}px, 1fr)`;
    }

    const luxonDate = DateTime.fromJSDate(chosenDate);
    const formattedDate = luxonDate.toFormat("cccc - d LLLL");

    return (
        <div>
            <div style={dateLabelStyle}>{formattedDate}</div>
            <div style={{ marginTop: '48px' }}></div>
            <div style={{
                ...gridContainerStyle,
                gridTemplateColumns: gridCols,
                overflowX: 'auto'
            }}>
                
                {hoursCreator().map((hourData, hourIdx) => (
                    <div key={`hour-${hourIdx}`}
                        style={{
                            ...hourLabelStyle,
                            gridRow: `${hourIdx * 4 + 1} / span 4`,
                            gridColumn: '1'
                        }}>
                        {hourData.hourLabel}
                    </div>
                ))}

                {Array.from({ length: 96 }).map((_, idx) => (
                    Array.from({ length: maxLanes }).map((_, laneIdx) => (
                        <div
                            key={`interval-${idx}-${laneIdx}`}
                            style={{
                                ...intervalStyle,
                                gridRow: idx + 1,
                                gridColumn: laneIdx + 2
                            }}
                        />
                    ))
                ))}

                {eventsWithLanes.map((e, eIdx) => (
                    <div key={`event-${eIdx}`}
                        className='event-block'
                        style={{
                            gridRow: `${e.startIdx + 1} / ${e.endIdx + 1}`,
                            gridColumn: e.lane + 2
                        }}
                        onClick={() => {
                            eventselector(e);
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
    gridAutoRows: '20px',
    position: 'relative',
    border: '1px solid black',
    background: '#fff'
};

