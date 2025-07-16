import React from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

export const MthYrArrow = ({children, backOne, frontOne}) => {

    return (
        <div style={{ 
            display: 'flex',
            alignItems: 'center',
            width: '300px',
            justifyContent: 'space-between',
            margin: '0 auto 0 calc(50% - 73px)', /* Move 77px right from center */
        }}>
            <ArrowLeftIcon fontSize="large" style={{cursor: 'pointer', transform: 'translateY(-47px)'}} onClick={backOne}/>
            <div style={{flex: '0 0 auto'}}>
                {children}
            </div>
            <ArrowRightIcon fontSize="large" style={{cursor: 'pointer', transform: 'translateY(-47px)'}} onClick={frontOne}/>
        </div>
    )
}