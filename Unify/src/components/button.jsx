import React from 'react'

// Generic Button Component idk
export const Button = ({onClick, children}) => {
  return (
    <button onClick={onClick}>
        {children}
    </button>
  )
}
