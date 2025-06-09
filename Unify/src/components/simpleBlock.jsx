import React from 'react'

export const SimpleBlock = ({ children }) => {
    const blockStyle = {
        maxWidth: '320px',
        margin: '40px auto',
        padding: '24px',
        background: '#f9f9f9',
        border: '1px solid rgb(0, 0, 0)',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,1)',
        textAlign: 'center'
    }
    return (
        <div style = {blockStyle}>
            {children}
        </div>
    
  )
}
