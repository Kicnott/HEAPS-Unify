
export const Calender_Date_Box = ({onClick, children}) => {
  let button_style = {
    color : 'pink'
  }

  return (
    <button onClick={onClick} style={button_style}>
        {children}
    </button>
  )
}
