import React from 'react'

// The SimpleBlock component is really just a simple block to store some text and elements nicely.
export const SimpleBlock = ({
    children,
    maxWidth = '600px',
    margin = '40px auto',
    padding = '24px',
    background = '#f9f9f9',
    border = '1px solid rgb(0, 0, 0)',
    borderRadius = '8px',
    boxShadow = '0 2px 8px rgba(0,0,0,1)',
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
        <div style={blockStyle}>
            {children}
        </div>

    )
}
