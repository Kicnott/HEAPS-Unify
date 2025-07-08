import React, { useState, useRef, useEffect } from "react";
import { ColorPopover } from "./ColorPopover";

export const ScrollBlock = ({
    buttonData,
    children,
    width = '100%',
    height = '100%',
    checkboxButton = false,
    checkboxName,
    myDisplayedCalendarIds,
    onCheckboxChange, accountid,
    maxHeight = '100%',
    gotColour = false,
    refreshTrigger,
    colorChangeComplete }) => {
    // Store color state for each button by index

    const [colors, setColors] = useState(() =>
        (buttonData && buttonData.length > 0)
            ? buttonData.map(btn => btn.color || "#3498db")
            : []
    );
    const [pendingColorChanges, setPendingColorChanges] = useState({});

    const handleColorChange = (idx, newColor, calendarId) => {
        setColors(prev => {
            const updated = [...prev];
            updated[idx] = newColor;
            return updated;
        });
        setPendingColorChanges(prev => ({ ...prev, [calendarId]: newColor }));
    };

    useEffect(() => {
        if (buttonData && buttonData.length > 0) {
            setColors(prevColors =>
                buttonData.map((btn, idx) =>
                    pendingColorChanges[btn.id] !== undefined
                        ? pendingColorChanges[btn.id]
                        : btn.color || "#3498db"
                )
            );
        }
    }, [buttonData, pendingColorChanges]);

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
                overflowX: 'hidden'
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
                                    calendarid={btn.id}
                                    side="left"
                                    color={colors[idx]}
                                    setColor={c => handleColorChange(idx, c, btn.id)}
                                    colorChangeComplete={colorChangeComplete}
                                    refreshTrigger={refreshTrigger}
                                />
                            </span>
                        )}
                        <span
                            style={{
                                flex: 1,          
                                minWidth: 0,          
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                textAlign: "left",
                            }}
                        >
                            {btn.label}
                        </span>
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

