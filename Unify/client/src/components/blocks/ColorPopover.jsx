import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import { SliderPicker } from 'react-color';
import { useRef, useState } from 'react';

const ColorCircle = React.forwardRef(({ size = 24, color = "#3498db", borderRadius='50%', ...rest }, ref) => {
    // console.log("ColorCircle color: " + color)
    return(
    <span
        ref={ref}
        style={{
            display: "inline-block",
            width: size,
            height: size,
            borderRadius: borderRadius,
            background: color,
        }}
        {...rest}
    />)
});

export function ColorPopover({ children, content, side = "right", color, setColor, colorChangeComplete, calendarid, iconSize=24, iconBorderRadius='50%',  ...props }) {
    // const [color, setColor] = useState("#3498db");
    const circleRef = useRef(null)

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <span ref={circleRef} style={{ cursor: "pointer" }} data-colorcircle="true">
                    <ColorCircle color={color} size={iconSize} borderRadius={iconBorderRadius} />
                </span>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    side={side}
                    align="center"
                    style={{
                        background: "#fff",
                        borderRadius: 8,
                        padding: 10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        zIndex: 9999,
                        width: 280,
                        minWidth: 220,
                        maxWidth: 320,
                    }}
                >
                    <SliderPicker
                        color={color}
                        onChange={c => setColor(c.hex)}
                        onChangeComplete={(c) => {
                            colorChangeComplete(c.hex, calendarid)
                        }}
                    />
                    {content}
                    <Popover.Arrow style={{ fill: "#fff" }} />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
