
const dragStart = (e, event) => {
  e.dataTransfer.setData('text/plain', JSON.stringify(event));
};

// Case 1: Single day Event
const case1Event = (event) => {
    return <div style={{
        fontSize: '0.9rem',
        color: 'blue', 
        backgroundColor: 'pink', 
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        }} 
        draggable
        onDragStart = {(e) => {dragStart(e, event)}}
        event={event}
        key={event.eventid}>
    {event.eventname}</div>
}

// Case 2: Multiple day Event, within same week
const case2Event = (event, diffInDays) => { 
    let eventOverflowCount = diffInDays;
    let eventOffset = eventOverflowCount * 143;
    return <div style={{
        fontSize: '0.9rem',
        color: 'blue', 
        backgroundColor: 'pink', 
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        marginRight: `-${eventOffset}px`,
        zIndex: '2',
        textAlign: 'left',
        paddingLeft: '25px',
        }}
        draggable
        onDragStart = {(e) => {dragStart(e, event)}}
        event={event}
        key={event.eventid}>
    {event.eventname}</div> 
}

// Case 4: Multiple day Event, crosses week edge
const case3Event = (event, diffInDays) => {
    let eventOverflowCount = diffInDays;
    let eventOffset = eventOverflowCount * 143 + 10;
    return <div style={{
        fontSize: '0.9rem',
        color: 'blue', 
        backgroundColor: 'pink', 
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        marginRight: `-${eventOffset}px`,
        zIndex: '2',
        textAlign: 'left',
        paddingLeft: '25px',
    }} 
    key={event.eventid} id={event.eventid}>{event.eventname}</div>
}

// Case 4: part of an event that crossed week edge, ends on Sun
const case4Event = (event) => {
    return <div style={{
        fontSize: '0.9rem',
        color: 'blue', 
        backgroundColor: 'pink', 
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        marginLeft: `-10px`,
        zIndex: '2',
        textAlign: 'left',
        paddingLeft: '25px',
        }} 
    key={event.eventid} id={event.eventid}>{event.eventname}</div>
}

// Case 5: part of an event that crossed week edge, ends on a Non-Sun
const case5Event = (event, endDate) => { 
    let eventOverflowCount = new Date(endDate).getDate() - new Date(event.startdt).getDate();
    let eventOffset = eventOverflowCount * 143;
    return <div style={{
        fontSize: '0.9rem',
        color: 'blue', 
        backgroundColor: 'pink', 
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        marginLeft: `-10px`,
        marginRight: `-${eventOffset}px`,
        zIndex: '2',
        textAlign: 'left',
        paddingLeft: '25px',
        }} 
    key={event.eventid}>{event.eventname}</div> 
}

// Case 6: part of an event that crossed week edge, and passed the next week edge, occupying the whole week
const case6Event = (event) => { 
    let eventOffset = 6 * 143;
    return <div style={{
        fontSize: '0.9rem',
        color: 'blue', 
        backgroundColor: 'pink', 
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        marginLeft: `-10px`,
        marginRight: `-${eventOffset}px`,
        zIndex: '2',
        textAlign: 'left',
        paddingLeft: '25px',
        }} 
    key={event.eventid}>{event.eventname}</div> 
}

// Case 8: Empty Space
const case8Event = (emptyEventSpaceCount) => {
    return(
    <div key={`empty-${emptyEventSpaceCount}`} style={{
        fontSize: '0.9rem',
        color: 'blue', 
        backgroundColor: 'brown', 
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
    }}></div>
)}

const calenderEventsType = {
    case1Event,
    case2Event,
    case3Event,
    case4Event,
    case5Event,
    case8Event
}

export default calenderEventsType