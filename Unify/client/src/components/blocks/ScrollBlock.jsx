import React from "react";
import { PhotoshopPicker } from "react-color";

export const ScrollBlock = ({ buttonData, children, width = '100%', height = '100%', checkboxButton = false, checkboxName, myDisplayedCalendarIds, onCheckboxChange, accountid, refreshTrigger, maxHeight='100%' }) => {
    
    return(
    <div
        style={{
            //   height: "100%",   
            flex: '1',
            overflowY: "auto",
            width: width,
            height: height,
            maxHeight: maxHeight,
            border: "1px solid #ccc",
            padding: "8px",
            boxSizing: "border-box",
        }}

    >   {children}
        {Array.isArray(buttonData) && buttonData.map((btn, idx) => (
            <button
                key={btn.id || idx}
                style={{ width: "100%", marginBottom: "8px", padding: "12px", textOverflow: "ellipsis", whiteSpace: "nowrap",   overflow: "hidden", }}
                onClick={btn.onClick}
            >
                {/* <PhotoshopPicker></PhotoshopPicker> */}
                {btn.label}
                {checkboxButton && (
                    <input
                        type='checkbox'
                        name={checkboxName}
                        value={btn.id}
                        checked={(myDisplayedCalendarIds || []).includes(btn.id)}
                        onChange={() => onCheckboxChange(btn.id, accountid)}
                        onClick={(e) => {
                            e.stopPropagation()
                            
                        }}
                    ></input>
                )}
            </button>
        ))}
    </div>
)};

