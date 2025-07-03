import React from "react"
import { useState } from "react"
import "../../styles/LeftTabPanel.css"

export const LeftTabPanel = ({ tabContents, tabs, initialTab = '1' }) => {
    const [activeTab, setActiveTab] = useState(initialTab)
    return (

            <div className="left-tab-panel">
                <div className="tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="panel-content">
                    {tabContents[activeTab] || <div>No content for this tab.</div>}
                </div>
            </div>
    )
}