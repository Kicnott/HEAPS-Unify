import React from 'react'

// Tab that comes out from the right side of the screen
export const RightDrawer = ({ rightDrawerOpen, onClose, children }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: rightDrawerOpen ? 0 : '-400px',
        width: '400px',
        height: '100vh',
        background: 'white',
        boxShadow: '0 0 10px rgba(26, 19, 19, 0.2)',
        transition: 'right 0.3s ease',
        zIndex: 1000,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '20px',
          padding: '2px 6px',
          cursor: 'pointer',
          width: '24px',
          height: '24px',
          // borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
        }}
      >
        ×
      </button>
      {children}
    </div>
  )
}
