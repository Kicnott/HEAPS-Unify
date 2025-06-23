
// CalendarDateBox is a component used by MainCalendar to create the boxes in the Calendar.
export const CalendarDateBox = ({ onClick, children, baseMonth, displayDate, setChosenDate }) => {
  // onClick: A function that runs when the DateBox is clicked.
  // children: Any additional labels to be stored on each DateBox.
  // baseMonth: The current month being displayed - to determine the font color
  // displayDate: The date to be displayed in the DateBox.
  let date = displayDate.toLocaleDateString() // Converts the displayDate to a string so it can be displayed.

  const eventDate = () => {
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
    color: isBaseMonth ? 'black' : 'grey' // If the date is part of the base month, the font color is black; otherwise, it is grey.
  }

  return (
    // A button is used to represent a date box.
    // When clicked, the function stored in onClick is run.
    // The date is displayed by default. Additional information can be displayed by using the children variable.
    <button onClick={() => {
      onClick();
      eventDate();
    }} style={calendarStyle}>
      {children}
      {date}
    </button>
  )
}

// CalendarDateHeader is a component used by MainCalendar to create the header boxes in the Calendar, to display days of the week.
export const CalendarDateHeader = ({ onClick, children }) => {
  // onClick: A function that runs when the DateHeader is clicked.
  // children: Any additional labels to be stored on each DateHeader.
  let button_style = {
    color: 'white',
    'backgroundColor': '#1d6b94'
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
