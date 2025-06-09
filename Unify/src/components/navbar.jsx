import React from 'react'

export const Navbar = () => {
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
            <p>Unify</p>

        </div>
    )
}
