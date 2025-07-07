
import calenderEventsType from '../monthCalendar/monthEventsDisplay.jsx'

export const ExtraEventsPopUp = ({ children, onClose, extraEvents }) => {
  // children: All the text and other elements to be displayed in the Overlay Block.
  // onClose: The function to close the overlay block - should be something that changes isHidden.
  const blockStyle = {
    width: '200px',
    height: '500px',
    padding: '24px',
    background: 'white',
    border: '3px solid #A78E72',
    borderRadius: '3px',
    textAlign: 'center',
    position: 'fixed',
    // So far just generic css stuff to make a plain box
    display: 'block', // Adds the logic to isHidden. If isHidden is true, the block is not displayed.
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centres the block or whatnot along with top and left
    overflow: 'auto',
    zIndex: 1001 // Makes the block transcend all other components
  }

  const rowStyle = {
    display: 'flex',
    alignItems: 'flex-start', // Aligns items at the top
    gap: '4px' // Optional: space between button and grid
  };

  return (
    <div style={blockStyle}>

      <div style={rowStyle}>

          <button onClick={onClose} style={{
            background: 'transparent', // No background, so it follows the background of the block
            padding: '5px',
            border: 'none', // Removes the border from the button so it fits just like an x into the block
            fontSize: 20,
            cursor: 'pointer' // Makes the cursor change from the normal cursor to the clicky hand cursor (I think)
          }}>×</button>
        {displayExtraEvents(extraEvents, calenderEventsType)}
        {children}
      </div>
    </div>
    // Creates the x button that closes the Overlay Block
    // The onClose && ... means that if onClose is not defined, the button will not appear since it is not relevant.
    // && just means the 'and' operator. Checks if onClose is defined, and since it is, it moves on the evaluate the button. Otherwise, it fails and nothing is evaluated.
  )
}

function displayExtraEvents(extraEvents, calenderEventsType){
  try {
    const displayedExtraEvents = [];
    extraEvents.forEach((event) => {
      displayedExtraEvents.push(calenderEventsType.case1Event(event))
    });

    console.log(displayedExtraEvents)

    return(
      <div>
        {displayedExtraEvents}
      </div>
    )
  } catch(e){
    console.log("error: ", e)
  }
}
