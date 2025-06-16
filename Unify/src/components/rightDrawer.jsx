import React from 'react'

// RightDrawer is the tab that comes out from the right side of the screen
export const RightDrawer = ({ children, rightDrawerOpen, onClose }) => {
  // children: All the text and other elements to be displayed in the right drawer.
  // rightDrawerOpen: A boolean variable to determine whether the right drawer is open.
  // onClose: The function to close the right drawer - should be something that changes rightDrawerOpen.
  return (
    <div
      style={{
        position: 'fixed', // So the drawer does not shift around when you scroll down or up.
        top: 0,
        right: rightDrawerOpen ? 0 : '-400px', // Gives logic to rightDrawerOpen. If rightDrawer is true, then the drawer is in position. Else, it is off the screen by 400 pixels.
        width: '400px',
        height: '100vh', // vh is viewport height, which is the percentage height of the visible part of the browser. Makes the drawer scale accordingly to various display sizes.
        background: 'white',
        boxShadow: '0 0 10px rgba(26, 19, 19, 0.2)',
        transition: 'right 0.3s ease', // Makes the drawer transition visible as it pops from the right
        zIndex: 1000, // Makes the drawer be in front of other elements.
      }}
    >
      {onClose && 
      (<button
        onClick={onClose}
        style={{
          position: 'absolute', // Drawer does not need to be configured to change in size, so position of the x button is absolute.
          top: '10px', // Moves the button 10 pixels down
          left: '10px', // Moves the button 10 pixels to the right
          background: 'transparent', // No background, so it follows the background of the right drawer
          border: 'none', // No border so it's just an x
          fontSize: '20px',
          padding: '2px 6px', // Adds 2 pixels of padding to the top and bottom, 6 pixels of padding to the left and right. To adjust the click-box of the button.
          cursor: 'pointer', // Makes the cursor the clicky one when hovering over it
          width: '24px',
          height: '24px',
          display: 'flex', // No clue man, I still do not understand flex
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          outline: 'none' // Removes the outline when the button is clicked. (It looks ugly with the padding)
        }}
      >
        ×
      </button>)}
      {children}
    </div>
    // Creates the x button that closes the Right Drawer
    // The onClose && ... means that if onClose is not defined, the button will not appear since it is not relevant.
    // && just means the 'and' operator. Checks if onClose is defined, and since it is, it moves on the evaluate the button. Otherwise, it fails and nothing is evaluated.
  )
}
