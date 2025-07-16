
import eventService from '../../services/eventService.jsx';
import { forwardRef, useState, useRef } from 'react';


// CalendarDateBox is a component used by MainCalendar to create the boxes in the Calendar.
export const CalendarDateBox = forwardRef(({ onClick, children, baseMonth, displayDate, refreshMonthEvents, setRefreshMonthEvents}, ref) => {
  // onClick: A function that runs when the DateBox is clicked.
  // children: Any additional labels to be stored on each DateBox.
  // baseMonth: The current month being displayed - to determine the font color
  // displayDate: The date to be displayed in the DateBox.
  let date = displayDate.getDate() // Converts the displayDate to the day number
  let displayCurrentDayIndicator = '' // If the day matches current day, displays a circle on that date
  const now = new Date(); // the current time, day and month

  // colour dragging functionality
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  if (now.getDate() === displayDate.getDate() && now.getMonth() === displayDate.getMonth()){
    displayCurrentDayIndicator = '#D3B683'
  }

  let isBaseMonth // Stores true or false on whether the current date displayed in part of the base month.
  if (baseMonth === (displayDate.getMonth())) {
    isBaseMonth = true
  }
  else {
    isBaseMonth = false
  }

  let calendarStyle = {
    color: isBaseMonth ? '#5E503F' : '#A78E72',
    backgroundColor: isDraggingOver ? '#EBE6D6' : 'white',
    height: 'calc(9.5vw - 5px)',
    minHeight: '47px',
    maxHeight: '115px',
    width: '100%',
    margin: '0px',
    padding: '1.8vw 1vw 0 1vw', // Increased top padding from 1.1vw to 1.8vw
    position: 'relative',
    borderRadius: '2px',
    fontSize: '1rem', // slightly larger font
    transition: 'height 0.2s, padding 0.2s, font-size 0.2s',
  }

const dragOver = (e) => {
    setIsDraggingOver(true);

    e.preventDefault(); // allow drop
};

const drop = (e, displayDate) => {
  e.preventDefault();

  dragCounter.current = 0
  setIsDraggingOver(false);

  const data = e.dataTransfer.getData('text/plain');
  const draggedEvent = JSON.parse(data);
  let newStartDateValue = 0;
  let startHours = displayDate.toISOString().substring(11,13);
  let startMin = draggedEvent.startdt.substring(14,16);
  let startSec = draggedEvent.startdt.substring(17,19);
  let endHours = displayDate.toISOString().substring(11,13);
  let endMin = draggedEvent.enddt.substring(14,16);
  let endSec = draggedEvent.enddt.substring(17,19);

  // account for timezone
  if (Number(draggedEvent.startdt.substring(8,10)) === new Date(draggedEvent.newStartDt).getDate()){ 
    newStartDateValue = displayDate.toISOString().substring(8,10);
  } else{
    newStartDateValue = displayDate.getDate();
  }

  const draggedEventStartDt = new Date(draggedEvent.startdt);
  const draggedEventEndDt = new Date(draggedEvent.enddt);

  const eventid = draggedEvent.eventid;

  const msInDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  let diffInDays =  Math.floor((draggedEventEndDt - draggedEventStartDt) / msInDay);

  const newStartDt = 
  draggedEvent.startdt.substring(0, 5) + String(displayDate.getMonth() + 1).padStart(2, '0') +    
  draggedEvent.startdt.substring(7, 8) + String(newStartDateValue).padStart(2, '0') +   
  draggedEvent.startdt.substring(10, 11) + String(startHours).padStart(2, '0') + ':' + String(startMin).padStart(2, '0') + ':' + String(startSec).padStart(2, '0');

  // Following code allows draggedEvent to be dragged to previous months
  const yearCheck = new Date(draggedEventStartDt).getYear()
  const monthCheck = displayDate.getMonth() + 1;
  let newEndDtValue = displayDate.getUTCDate() + diffInDays;
  let newEndMonthValue = displayDate.getMonth() + 1;

  if ([2].includes(monthCheck) && !isLeapYear(yearCheck) && newEndDtValue > 28){ // 28 days, Feb
    newEndMonthValue += 1;
    newEndDtValue = newEndDtValue - 28;
  } else if ([2].includes(monthCheck) && isLeapYear(yearCheck) && newEndDtValue > 28){ // 29 days, Feb, Leap Year
    newEndMonthValue += 1;
    newEndDtValue = newEndDtValue - 29;
  } else if ([4, 6, 9, 11].includes(monthCheck) && newEndDtValue > 30){ // 30 days, Apr Jun Sep Nov
    newEndMonthValue += 1;
    newEndDtValue = newEndDtValue - 30;
  } else if ([1, 3, 5, 7, 8, 10, 12].includes(monthCheck) && newEndDtValue > 31){ // 31 days, Jan Mar May Jul Aug Oct Dec
    newEndMonthValue += 1;
    newEndDtValue = newEndDtValue - 31;
  }

  const newEndDt = 
  draggedEvent.enddt.substring(0, 5) + String(newEndMonthValue).padStart(2, '0') +    
  draggedEvent.enddt.substring(7, 8) + String(newEndDtValue).padStart(2, '0') +   
  draggedEvent.enddt.substring(10, 11) + String(endHours).padStart(2, '0') + ':' + String(endMin).padStart(2, '0') + ':' + String(endSec).padStart(2, '0');

  try {
    const result = eventService.updateEvent({
      eventId : eventid,
      newStartDt : newStartDt,
      newEndDt : newEndDt
    });
    setRefreshMonthEvents(refreshMonthEvents+1);
    if (result){
      console.log("Dragged Event updated!")
    } else {
      console.log("Dragged Event fail to update")
    }
  } catch (err) {
    console.log("Error Updating dragged draggedEvent: ", err)
  }
}

const handleDragLeave = (e) => {
  dragCounter.current -= 1;
  if (dragCounter.current === 0) {
    setIsDraggingOver(false);
  }
};

const handleDragEnter = (e) => {
  e.preventDefault();
  dragCounter.current += 1;
  setIsDraggingOver(true);
};
          
  return (
  <button 
    ref={ref}
    key={displayDate}
    style={calendarStyle}       
    onDragOver={(e)=>dragOver(e)}
    onDrop={(e) => drop(e, displayDate)}
    onDragLeave={handleDragLeave} 
    onDragEnter={handleDragEnter} 
    onClick={() => {
      onClick(displayDate);
    }}
  >
    {children}

    <div style={{
      color: isBaseMonth ? 'black' : 'grey',
      position: 'absolute',
      top: '0.2rem',
      left: '0.5rem',
      background: `${displayCurrentDayIndicator}`,
      borderRadius: '7px',
      paddingLeft: '4px',
      paddingRight: '4px',
    }}>
      {date}
    </div>

  </button>
  )
})


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

function isLeapYear(year){
  if ((year % 4 == 0 & year % 100 != 0) || (year % 400 == 0)){
    return true;
  } else {
    return false;
  }
}