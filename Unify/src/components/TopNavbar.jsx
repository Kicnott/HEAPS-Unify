import React from 'react'

// TopNavBar is a grey bar at the top of the screen to hold other buttons
export const TopNavbar = ({children}) => {
    // children: The text and elements to be displayed inside the nav bar.
    return (
        <div style={{
            height: '60px',
            background: 'LightGray',
            borderBottom: '1px solid #ddd',
            display: 'flex', // No idea what flex actually does
            alignItems: 'center', // Something to do wiht flex
            justifyContent: 'center', // Something to do with flex
            padding: '0 20px', // Adds 20 pixels of padding to the left and right so the text and elements are not at the edges of the screen
            marginBottom: '10px', // Creates a 10 pixel gap between the nav bar and elements below it
            position: 'fixed', // So the nav bar does not move around when you scroll up or down
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000, // Makes the nav bar overlayed on top of other elements.
        }}
        >
        {children}

        </div>
    )
}
