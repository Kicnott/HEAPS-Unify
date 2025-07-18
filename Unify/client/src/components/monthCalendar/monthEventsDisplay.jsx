
import '../../styles/glow.css'

const dragStart = (e, event) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(event));
};

// Case 1: Single day Event
const case1Event = (event, onClick) => {

    const currUserAccountId = sessionStorage.getItem("currentUserAccountId");

    return <div
        className="glow-hover"
        style={{
            fontSize: '0.9rem',
            color: 'black',
            borderRadius: '5px',
            backgroundColor: event.calendarcolour,
            borderColor: 'grey',
            borderStyle: 'solid',
            borderWidth: '1px',
            paddingLeft: '5px',
            paddingRight: '5px',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}
        draggable={currUserAccountId==event.accountid}
        onDragStart={(e) => { dragStart(e, event) }}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        key={event.eventid + " Case1"}
        onClick={(e) => {
            e.stopPropagation()

            onClick(event.eventid)
        }}    >
        {event.eventname}</div>
}

// Case 2: Multiple day Event, within same week
const case2Event = (event, diffInDays, onClick) => {

    const currUserAccountId = sessionStorage.getItem("currentUserAccountId");

    let eventOverflowCount = diffInDays;
    let eventOffset = eventOverflowCount * 8; // Reduced from 143 to 125
    return <div
        className="glow-hover"
        style={{
            fontSize: '0.9rem',
            color: 'black',
            borderRadius: '5px',
            backgroundColor: event.calendarcolour,
            borderColor: 'grey',
            borderStyle: 'solid',
            borderWidth: '1px',
            marginRight: `-${eventOffset}rem`,
            zIndex: '2',
            paddingLeft: '5px',
            paddingRight: '5px',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}
        draggable={currUserAccountId==event.accountid}
        onDragStart={(e) => { dragStart(e, event) }}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        key={event.eventid + " Case2"}
        onClick={(e) => {
            e.stopPropagation()

            onClick(event.eventid)
        }}>
        {event.eventname}</div>
}

// Case 3: Multiple day Event, crosses week edge
const case3Event = (event, diffInDays, onClick) => {

    const currUserAccountId = sessionStorage.getItem("currentUserAccountId");

    let eventOverflowCount = diffInDays;
    let eventOffset = eventOverflowCount * 8 + 0.9; // Reduced from 143 to 125
    return <div
        className="glow-hover"
        style={{
            fontSize: '0.9rem',
            color: 'black',
            borderTopLeftRadius: '5px',
            borderBottomLeftRadius: '5px',
            backgroundColor: event.calendarcolour,
            borderColor: 'grey',
            borderStyle: 'solid',
            borderWidth: '1px',
            marginRight: `-${eventOffset}rem`,
            zIndex: '2',
            paddingLeft: '5px',
            paddingRight: '5px',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}
        draggable={currUserAccountId==event.accountid}
        onDragStart={(e) => { dragStart(e, event) }}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        key={event.eventid + " Case3"}
        onClick={(e) => {
            e.stopPropagation()

            onClick(event.eventid)
        }}>
        {event.eventname}</div>
}

// Case 4: part of an event that crossed week edge, final week
const case4Event = (event, diffInDays, onClick) => {

    const currUserAccountId = sessionStorage.getItem("currentUserAccountId");

    let eventOverflowCount = diffInDays;
    let eventOffset = eventOverflowCount * 8; // Reduced from 143 to 125
    return <div
        className="glow-hover"
        style={{
            fontSize: '0.9rem',
            color: 'black',
            borderTopRightRadius: '5px',
            borderBottomRightRadius: '5px',
            backgroundColor: event.calendarcolour,
            borderColor: 'grey',
            borderStyle: 'solid',
            borderWidth: '1px',
            marginLeft: `-1rem`,
            marginRight: `-${eventOffset}rem`,
            zIndex: '2',
            paddingLeft: '5px',
            paddingRight: '5px',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}
        draggable={currUserAccountId==event.accountid}
        onDragStart={(e) => { dragStart(e, event) }}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        key={event.eventid + " Case4"}
        onClick={(e) => {
            e.stopPropagation()

            onClick(event.eventid)
        }}>
        {event.eventname}</div>
}

// Case 5: part of an event that crossed week edge, full week
const case5Event = (event, onClick) => {

    const currUserAccountId = sessionStorage.getItem("currentUserAccountId");

    return <div
        className="glow-hover"
        style={{
            fontSize: '0.9rem',
            color: 'black',
            backgroundColor: event.calendarcolour,
            borderColor: 'grey',
            borderStyle: 'solid',
            borderWidth: '1px',
            marginLeft: `-1rem`,
            marginRight: `-48.9rem`,
            zIndex: '2',
            paddingLeft: '5px',
            paddingRight: '5px',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}
        draggable={currUserAccountId==event.accountid}
        onDragStart={(e) => { dragStart(e, event) }}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        key={event.eventid + " Case5"}
        onClick={(e) => {
            e.stopPropagation()

            onClick(event.eventid)
        }}>
        {event.eventname}</div>
}

// Case 6: + more button, display excess events
const case6Event = (event, onClick) => {
    return <div 
    className="glow-hover"
    style={{
        fontSize: '0.9rem',
        color: 'black',
        display: 'fixed',
        width: '140px',
        backgroundColor: event.calendarcolour,
        borderColor: 'grey',
        borderStyle: 'solid',
        borderWidth: '1px',
        paddingLeft: '5px',
        paddingRight: '5px',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: '5px',
        }}
        key={event.eventid + " Case6"}
        onClick={(e) => {
            e.stopPropagation()

            onClick(event.eventid)
        }}>
        {event.eventname}</div>
}

// Case 7: Empty Space
const case7Event = (emptyEventSpaceCount) => {
    return (
        <div key={`empty-${emptyEventSpaceCount}`} style={{
        }}></div>
    )
}

const calenderEventsType = {
    case1Event,
    case2Event,
    case3Event,
    case4Event,
    case5Event,
    case6Event,
    case7Event
}



export default calenderEventsType