
import calenderEventsType from '../monthCalendar/monthEventsDisplay.jsx'

export const ExtraEventsPopUp = ({ children, onClose, extraEvents }) => {
  // children: All the text and other elements to be displayed in the Overlay Block.
  // onClose: The function to close the overlay block - should be something that changes isHidden.
  const blockStyle = {
    width: '180px',
    height: 'auto',
    padding: '0px',
    background: 'white',
    border: '3px solid #A78E72',
    borderRadius: '10px',
    position: 'relative',
    textAlign: 'left',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centres the block or whatnot along with top and left
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001 // Makes the block transcend all other components
  }

  const extraEventsTopBar = {
    background: '#D3B683',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
  }

  return (
    <div style={blockStyle}>
        <div style={extraEventsTopBar}>
          <strong 
            style={{
              fontSize: 20,
              paddingLeft: '5px',
            }}>Date</strong> 
          <strong 
            onClick={onClose} 
            style={{
              background: 'transparent', // No background, so it follows the background of the block
              border: 'none', // Removes the border from the button so it fits just like an x into the block
              fontSize: 20,
              paddingRight: '5px',
              cursor: 'pointer' // Makes the cursor change from the normal cursor to the clicky hand cursor (I think)
            }}>
            ×
            </strong>
        </div>
      {displayExtraEvents(extraEvents, calenderEventsType)}
      {children}
    </div>
    // Creates the x button that closes the Overlay Block
    // The onClose && ... means that if onClose is not defined, the button will not appear since it is not relevant.
    // && just means the 'and' operator. Checks if onClose is defined, and since it is, it moves on the evaluate the button. Otherwise, it fails and nothing is evaluated.
  )
}

function displayExtraEvents(extraEvents, calenderEventsType){
  try {
    const displayedExtraEvents = [];
    if (extraEvents.length !== 0){
      extraEvents.forEach((event) => {
        displayedExtraEvents.push(calenderEventsType.case6Event(event))
      });
    }

    return(
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '8px',
        }}>
      {displayedExtraEvents}
      </div>
    )
  } catch(e){
    console.log("display extra events error: ", e)
  }
}
