import { DateTime } from 'luxon';
import eventService from '../services/eventService';

export const EventDisplay = ({displayedEvent, onClose, onDelete}) => {
    const start = DateTime.fromISO(displayedEvent.startdt);
    const end = DateTime.fromISO(displayedEvent.enddt);

    const sameDay = start.hasSame(end, 'day');

    const startStr = start.toFormat('d LLLL h:mm a'); // e.g., 9 July 4:15 PM
    const endStr = sameDay
    ? end.toFormat('h:mm a') // just time if same day
    : end.toFormat('d LLLL h:mm a'); // full date+time if different day

    const deleteTs = async () => {
        try {
            const res = await eventService.deleteEvent(displayedEvent.eventid);
            console.log("Event status:", res.data.status);
            onClose();
            onDelete();
        } catch (e) {
            console.error("Error deleting events", e);
        }
    }

//add modify function 
    
    return (
        <div style={containerStyle}>
        <div style={rowStyle}>
            <span style={labelStyle}>Event Name:</span> {displayedEvent.eventname}
        </div>
        <div style={rowStyle}>
            <span style={labelStyle}>Description:</span> {displayedEvent.eventdescription}
        </div>
        <div style={rowStyle}>
            <span style={labelStyle}>Location:</span> {displayedEvent.eventlocation}
        </div>
        <div style={rowStyle}>
            <span style={labelStyle}>Duration:</span> {startStr} - {endStr}
        </div>
        <div style={rowStyle}>
            <button onClick={deleteTs}>Delete</button>
            <button>Modify</button>
        </div>
        </div>
    )
}

const containerStyle = {
    padding: '1rem 0',
    maxWidth: 480,
    margin: '1.5rem 0',
    color: '#5E503F',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    textAlign: 'left',
    fontSize: '1rem',
    lineHeight: 1.6,
    overflowX: 'hidden',         
    wordBreak: 'break-word'
};

const labelStyle = {
    color: '#A78E72',
    fontWeight: 700,
    fontSize: '1em',
    marginRight: '0.5em',
};

const rowStyle = {
    marginBottom: '0.7em',
    textAlign: 'left',
    wordBreak: 'break-word'
};