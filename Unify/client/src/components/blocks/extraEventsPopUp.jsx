
import calenderEventsType from '../monthCalendar/monthEventsDisplay.jsx'

export const ExtraEventsPopUp = ({ children, onClose, extraEvents, popUpPosition }) => {
  // children: All the text and other elements to be displayed in the Overlay Block.
  // onClose: The function to close the overlay block - should be something that changes isHidden.
  
  const displayDate = formatDateWithOrdinal(extraEvents[0].startdt);

  const blockStyle = {
    width: '180px',
    height: 'auto',
    minHeight: '130px',
    padding: '0px',
    paddingBottom: '8px',
    background: 'white',
    border: '3px solid #A78E72',
    position: 'fixed',
    top: popUpPosition.y,
    left: popUpPosition.x,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001 // Makes the block transcend all other components
  }

  const extraEventsTopBar = {
    background: '#D3B683',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  }

  return (
    <div style={{display: 'relative'}}>
      <div style={blockStyle}>
        <div style={extraEventsTopBar}>
            <strong 
            style={{
              fontSize: 20,
              paddingLeft: '5px',
              }}>{displayDate}</strong> 
            <strong 
            onClick={onClose} 
            style={{
              background: 'transparent', // No background, so it follows the background of the block
              border: 'none', // Removes the border from the button so it fits just like an x into the block
              fontSize: 20,
              paddingRight: '5px',
              marginBottom: '4px',
              cursor: 'pointer' // Makes the cursor change from the normal cursor to the clicky hand cursor (I think)
              }}>×</strong>
          </div>
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
        paddingLeft: '8px',
        paddingRight: '8px',
        }}>
      <strong>{displayedExtraEvents}</strong>
      </div>
    )
  } catch(e){
    console.log("display extra events error: ", e)
  }
}

// Gets date string from ISO string from events
function formatDateWithOrdinal(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });

  return `${getOrdinal(day)} ${month}`;
}

// add st, nd or th
function getOrdinal(n) {
  if (n > 3 && n < 21) return `${n}th`; // special case for 11th-13th
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}