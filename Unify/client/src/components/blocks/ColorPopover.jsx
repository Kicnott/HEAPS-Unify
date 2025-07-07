import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import { SliderPicker } from 'react-color';
import { useRef, useState } from 'react';

const ColorCircle = React.forwardRef(({ size = 24, color = "#3498db", ...rest }, ref) => {
    console.log("ColorCircle color: " + color)
    return(
    <span
        ref={ref}
        style={{
            display: "inline-block",
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
        }}
        {...rest}
    />)
});

export function ColorPopover({ children, content, side = "right", color, setColor, ...props }) {
    // const [color, setColor] = useState("#3498db");
    const circleRef = useRef(null)

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <span ref={circleRef} style={{ cursor: "pointer" }} data-colorcircle="true">
                    <ColorCircle color={color} />
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
                    />
                    {content}
                    <Popover.Arrow style={{ fill: "#fff" }} />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
