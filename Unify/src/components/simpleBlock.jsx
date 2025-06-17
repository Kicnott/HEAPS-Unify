import React from 'react'

// The SimpleBlock component is really just a simple block to store some text and elements nicely.
export const SimpleBlock = ({ children }) => {
    // children: The text and elements to be displayed inside the block.
    const blockStyle = {
        maxWidth: '320px',
        margin: '40px auto',
        padding: '24px',
        background: '#f9f9f9',
        border: '1px solid rgb(0, 0, 0)',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,1)',
        textAlign: 'center'
        // Most basic simple block css here
    }
    return (
        <div style = {blockStyle}>
            {children}
        </div>
    
  )
}
