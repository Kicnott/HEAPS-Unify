import React from 'react';
import "../styles/TopNavbar.css";

export const TopNavbar = ({ children }) => {
    return (
        <div className="topnavbar">
            {children}
        </div>
    );
};
