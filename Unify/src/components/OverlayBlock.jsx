import React from 'react'

// OverlayBlock is a simple block that will be in the frontmost layer of the web page, covering the other parts in a grey background.
export const OverlayBlock = ({ children, isHidden, onClose }) => {
  // children: All the text and other elements to be displayed in the Overlay Block.
  // isHidden: A boolean variable to determine whether the OverlayBlock should be shown.
  // onClose: The function to close the overlay block - should be something that changes isHidden.
  const blockStyle = {
    maxWidth: '320px',
    margin: '40px auto',
    padding: '24px',
    background: '#f9f9f9',
    border: '1px solid rgb(0, 0, 0)',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,1)',
    textAlign: 'center',
    position: 'fixed',
    // So far just generic css stuff to make a plain box
    display: isHidden ? 'none' : 'block', // Adds the logic to isHidden. If isHidden is true, the block is not displayed.
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centres the block or whatnot along with top and left
    zIndex: 1001 // Makes the block transcend all other components
  }

  return (
    <div style={blockStyle}>

      {onClose && (
        <button onClick={onClose} style={{
          position: 'relative', // Makes the button relative to the size of the block (hopefully)
          top: 10, // Moves the button 10 pixels down
          right: 10, // Moves the button 10 pixels to the left
          background: 'transparent', // No background, so it follows the background of the block
          border: 'none', // Removes the border from the button so it fits just like an x into the block
          fontSize: 20,
          cursor: 'pointer' // Makes the cursor change from the normal cursor to the clicky hand cursor (I think)
        }}>×</button>
      )}
      {children}
    </div>
    // Creates the x button that closes the Overlay Block
    // The onClose && ... means that if onClose is not defined, the button will not appear since it is not relevant.
    // && just means the 'and' operator. Checks if onClose is defined, and since it is, it moves on the evaluate the button. Otherwise, it fails and nothing is evaluated.
  )
}
