import React, { useState, useRef } from "react";
import { ColorPopover } from "./ColorPopover";

export const ScrollBlock = ({ buttonData, children, width = '100%', height = '100%', checkboxButton = false, checkboxName, myDisplayedCalendarIds, onCheckboxChange, accountid, refreshTrigger, maxHeight = '100%', gotColour = false }) => {
    // Store color state for each button by index
    const [colors, setColors] = useState(
        buttonData ? buttonData.map(() => "#3498db") : []
    );

    const handleColorChange = (idx, newColor) => {
        setColors(prev => {
            const updated = [...prev];
            updated[idx] = newColor;
            return updated;
        });
    };

    return (
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
                overflow: 'visible'
            }}

        >   {children}
            {Array.isArray(buttonData) && buttonData.map((btn, idx) => (
                <div key={btn.id || idx}>
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            width: "100%",
                            marginBottom: "8px",
                            padding: "12px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                        }}
                        onClick={e => {
                            // Only trigger if not clicking the color popover
                            if (e.target.dataset.colorcircle) return;
                            btn.onClick && btn.onClick(e);
                        }}
                        type="button"
                    >

                        {gotColour && (
                            <span
                                data-colorcircle="true"
                                onClick={e => e.stopPropagation()}
                                style={{ display: "flex", alignItems: "center" }}
                            >
                                <ColorPopover
                                    side="left"
                                    color={colors[idx]}
                                    setColor={c => handleColorChange(idx, c)}
                                />
                            </span>
                        )}
                        {btn.label}
                        {checkboxButton && (
                            <input
                                type='checkbox'
                                name={checkboxName}
                                value={btn.id}
                                checked={(myDisplayedCalendarIds || []).includes(btn.id)}
                                onChange={() => onCheckboxChange(btn.id, accountid)}
                                onClick={e => e.stopPropagation()}
                            />
                        )}
                    </button>
                </div>
            ))}
        </div>
    )
};

