import { useState, useEffect } from 'react'

// CalendarDateBox is a component used by MainCalendar to create the boxes in the Calendar.
export const CalendarDateBox = ({ onClick, children, baseMonth, displayDate, setChosenDate, refreshEvents, setrefreshEvents, moveableEvent, setmoveableEvent }) => {
  // onClick: A function that runs when the DateBox is clicked.
  // children: Any additional labels to be stored on each DateBox.
  // baseMonth: The current month being displayed - to determine the font color
  // displayDate: The date to be displayed in the DateBox.
  let date = displayDate.getDate() // Converts the displayDate to the day number

  const eventDateUnused = () => {
    setChosenDate(displayDate);
  }


  let isBaseMonth // Stores true or false on whether the current date displayed in part of the base month.
  if (baseMonth === (displayDate.getMonth())) {
    isBaseMonth = true
  }
  else {
    isBaseMonth = false
  }

  let calendarStyle = {
    // date number 
    color: isBaseMonth ? '#5E503F' : '#A78E72', // If the date is part of the base month, the font color is black; otherwise, it is grey.
    height: '8rem', 
    width: '100%',
    position: 'relative'
  }

  let eventStyle = {
    fontSize: '0.75rem', 
    backgroundColor: 'pink',
    color: 'red',
    borderRadius: '1rem', //idk how to curve the eventbox on calendarbox slightly
    cursor: 'grab',
    opacity: 1
    
  }

const dragStart = (e) => {
  e.dataTransfer.setData('text/plain', 'dragged-event'); // can be any string since only one event
};

const dragOver = (e) => {
  e.preventDefault(); // allow drop
};

const drop = (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
  if (data === 'dragged-event') {
    console.log("Matches!")
    setmoveableEvent(displayDate); // update the event's date to the dropped calendar box
  }
};

  return (
  <button 
    id={displayDate}
    style={calendarStyle}       
    onDragOver={(e)=>dragOver(e)}
    onDrop={(e) => drop(e, date)}
    onClick={() => {
      onClick();
    }}
  >
    {children}

    {moveableEvent == displayDate && (
      <div 
        id="1"
        draggable
        onDragStart={(e) => dragStart(e)}
        style={eventStyle}
        onClick={(event) => {
          console.log("Event Clicked");
          event.stopPropagation();
        }}
      >
        Moveable Event
      </div>
    )}
    
    <span style={{
      color: isBaseMonth ? 'black' : 'grey',
      position: 'absolute',
      top: '0.2rem',
      left: '0.5rem',
    }}>
      {date}
    </span>
  </button>
  )
}


// CalendarDateHeader is a component used by MainCalendar to create the header boxes in the Calendar, to display days of the week.
export const CalendarDateHeader = ({ onClick, children }) => {
  // onClick: A function that runs when the DateHeader is clicked.
  // children: Any additional labels to be stored on each DateHeader.
  let button_style = {
    // sun mon tue etc 
    color: '#5E503F',
    backgroundColor: '#EBE6D6',
    height: '2.5rem', 
    width: '100%'
  }

  return (
    // A button is used to represent a date header
    // When clicked, the function stored in onClick is run
    // Nothing is displayed by default; Display should be added using the children variable.
    <button onClick={onClick} style={button_style}>
      {children}
    </button>
  )
}
