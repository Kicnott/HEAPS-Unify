import { DateTime } from 'luxon';

export const EventDisplay = ({displayedEvent}) => {
    const start = DateTime.fromISO(displayedEvent.startdt);
    const end = DateTime.fromISO(displayedEvent.enddt);

    const startStr = start.toFormat('hh:mm a');
    const endStr = end.toFormat('hh:mm a');    
    
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