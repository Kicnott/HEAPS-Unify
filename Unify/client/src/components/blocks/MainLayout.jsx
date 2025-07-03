import React from "react";
import '../../styles/MainLayout.css'

export default function MainLayout({ header, leftPanel, mainContent }) {
  return (
    <div className="main-layout">
      <div className="main-layout-header">
        {header}
      </div>
      <div className="left-panel">
        {leftPanel}
      </div>
      <div className="calendar-wrapper">
        {mainContent}
      </div>
    </div>
  );
}