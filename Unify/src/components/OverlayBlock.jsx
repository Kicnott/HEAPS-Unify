import React from 'react'

export const OverlayBlock = ({ children, onClose, isHidden }) => {
    const blockStyle = {
        maxWidth: '320px',
        margin: '40px auto',
        padding: '24px',
        background: '#f9f9f9',
        border: '1px solid rgb(0, 0, 0)',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,1)',
        textAlign: 'center',
        display: isHidden ? 'none' : 'block',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centres the block or whatnot
        zIndex: 1001 // Makes the block transcend all other components
    }

    return (
        <div style={blockStyle}>

      {onClose && (
        <button onClick={onClose} style={{
          position: 'relative',
          top: 10,
          right: 10,
          background: 'transparent',
          border: 'none',
          fontSize: 20,
          cursor: 'pointer'
        }}>×</button>
      )}
      {children}
    </div>
    )
}
