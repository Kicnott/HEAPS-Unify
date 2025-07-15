import React from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

export const MthYrArrow = ({children, backOne, frontOne}) => {

    return (
        <div style={{ 
            display: 'flex',
            alignItems: 'center',
        }}>
            <ArrowLeftIcon fontSize="large" style={{cursor: 'pointer'}} onClick={backOne}/>
            {children}
            <ArrowRightIcon fontSize="large" style={{marginLeft: '45px', cursor: 'pointer'}} onClick={frontOne}/>
        </div>
    )
}