
import eventService from '../../services/eventService.jsx';


// CalendarDateBox is a component used by MainCalendar to create the boxes in the Calendar.
export const CalendarDateBox = ({ onClick, children, baseMonth, displayDate, setChosenDate, refreshEvents, setrefreshEvents, refreshMonthEvents, setRefreshMonthEvents }) => {
  // onClick: A function that runs when the DateBox is clicked.
  // children: Any additional labels to be stored on each DateBox.
  // baseMonth: The current month being displayed - to determine the font color
  // displayDate: The date to be displayed in the DateBox.
  let date = displayDate.getDate() // Converts the displayDate to the day number


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
    margin: '0px',
    padding: '20px 10px 0px 10px',
    position: 'relative',
    borderRadius: '2px'
  }

  let eventStyle = {
    fontSize: '0.8rem', 
    backgroundColor: 'pink',
    color: 'red',
    borderRadius: '1rem', //idk how to curve the eventbox on calendarbox slightly
    cursor: 'grab',
    opacity: 1
  }

const dragOver = (e) => {
  e.preventDefault(); // allow drop
};

const drop = (e, displayDate) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
  const event = JSON.parse(data);

  const eventid = event.eventid;
  let diffInDays = new Date(event.enddt).getDate() - new Date(event.startdt).getDate();

  const newStartDt = 
  event.startdt.substring(0, 5) + String(displayDate.getMonth() + 1).padStart(2, '0') +    
  event.startdt.substring(7, 8) + String(displayDate.getDate()).padStart(2, '0') +   
  event.startdt.substring(10);

  // Following code allows event to be dragged to previous months
  const yearCheck = new Date(event.enddt).getYear()
  const monthCheck = displayDate.getMonth() + 1;
  let newEndDtValue = displayDate.getDate() + diffInDays;

  if ([2].includes(monthCheck) && !isLeapYear(yearCheck) && newEndDtValue > 28){ // 28 days, Feb
    newEndDtValue = newEndDtValue - 28;
  } else if ([2].includes(monthCheck) && isLeapYear(yearCheck) && newEndDtValue > 28){ // 29 days, Feb, Leap Year
    newEndDtValue = newEndDtValue - 29;
  } else if ([4, 6, 9, 11].includes(monthCheck) && newEndDtValue > 30){ // 30 days, Apr Jun Sep Nov
    newEndDtValue = newEndDtValue - 30;
  } else if ([1, 3, 5, 7, 8, 10, 12].includes(monthCheck) && newEndDtValue > 31){ // 31 days, Jan Mar May Jul Aug Oct Dec
    newEndDtValue = newEndDtValue - 31;
  }

  const newEndDt = 
  event.enddt.substring(0, 5) + String(displayDate.getMonth() + 1).padStart(2, '0') +    
  event.enddt.substring(7, 8) + String(newEndDtValue).padStart(2, '0') +   
  event.enddt.substring(10);

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
    console.log("Error Updating dragged event: ", err)
  }
}
          
  return (
  <button 
    id={displayDate}
    style={calendarStyle}       
    onDragOver={(e)=>dragOver(e)}
    onDrop={(e) => drop(e, displayDate)}
    onClick={() => {
      onClick && onClick(displayDate);
    }}
  >
    {children}
    
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

function isLeapYear(year){
  if ((year % 4 == 0 & year % 100 != 0) || (year % 400 == 0)){
    return true;
  } else {
    return false;
  }
}