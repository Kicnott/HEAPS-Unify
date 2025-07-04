import React from 'react'
import "../../styles/simpleblock.css"

// The SimpleBlock component is really just a simple block to store some text and elements nicely.
export const SimpleBlock = ({
    children,
    maxWidth = '600px',
    margin = '40px auto',
    padding = '0px',
    background = '#f9f9f9',
    border = '1px solid #EBE6D6',
    borderRadius = '10px',
    boxShadow = 'none',
    textAlign = 'center',
    style = {},
}) => {
    const blockStyle = {
        maxWidth,
        margin,
        padding,
        background,
        border,
        borderRadius,
        boxShadow,
        textAlign,
        ...style, // Allows for additional inline styles
    }
    return (
         <div className="login-box">
            {children}
        </div>

    )
}
