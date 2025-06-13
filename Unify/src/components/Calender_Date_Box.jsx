
export const Calender_Date_Box = ({onClick, children, currentMonth, displayDate}) => {

  let date = displayDate.toLocaleDateString()
  console.log(date)

  let isCurrentMonth
  if (currentMonth === displayDate.getMonth()){
    isCurrentMonth = true
  }
  else{
    isCurrentMonth = false
  }
    let calendarStyle = {
    color: isCurrentMonth ? 'black' : 'grey'
  }

  return (
    <button onClick={onClick} style={calendarStyle}>
        {children}
        {date}
    </button>
  )
}

export const Calender_Date_Headers = ({onClick, children}) => {
  let button_style = {
    color : 'yellow',
    'background-color': 'brown'
  }

  return (
    <button onClick={onClick} style={button_style}>
        {children}
    </button>
  )
}
