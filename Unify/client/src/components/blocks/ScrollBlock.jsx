import React from "react";


export const ScrollBlock = ({buttonData, children, width='100%', height='100%'}) => (
    <div
        style={{
            //   height: "100%",   
            flex: '1',
            overflowY: "auto",
            width: width,
            height: height,
            border: "1px solid #ccc",
            padding: "8px",
            boxSizing: "border-box",
        }}

    >   {children}
        {Array.isArray(buttonData) && buttonData.map((btn, idx) => (
            <button
                key={idx}
                style={{ width: "100%", marginBottom: "8px", padding: "12px" }}
                onClick={btn.onClick}
            >
                {btn.label}
            </button>
        ))}
    </div>
);

