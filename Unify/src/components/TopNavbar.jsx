import React from 'react'

// Top Navigation Bar to hold other buttons, looks fugly, will fix later
export const TopNavbar = ({children}) => {
    return (
        <div style={{
            height: '60px',
            background: 'LightGray',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
            marginBottom: '10px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,   
        }}
        >
        {children}

        </div>
    )
}
