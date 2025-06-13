
export const CalendarDateBox = ({ onClick, children, baseMonth, displayDate }) => {

  let date = displayDate.toLocaleDateString()
  // console.log(date)

  let isBaseMonth
  if (baseMonth === (displayDate.getMonth()-1)) {
    isBaseMonth = true
  }
  else {
    isBaseMonth = false
  }
  console.log(baseMonth)

  let calendarStyle = {
    color: isBaseMonth ? 'black' : 'grey'
  }

  return (
    <button onClick={onClick} style={calendarStyle}>
      {children}
      {date}
    </button>
  )
}

export const CalendarDateHeader = ({ onClick, children }) => {
  let button_style = {
    color: 'yellow',
    'background-color': 'brown'
  }

  return (
    <button onClick={onClick} style={button_style}>
      {children}
    </button>
  )
}
