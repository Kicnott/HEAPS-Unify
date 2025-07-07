import * as Popover from '@radix-ui/react-popover';
import React from 'react';

const ColorCircle = React.forwardRef(({ size = 24, color = "#3498db" }, ref) => (
  <span
    ref={ref}
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
    }}
  />
));

export function SimplePopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <span style={{ cursor: "pointer" }}>
          <ColorCircle />
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 9999,
          }}
        >
          This is your mini text bubble!
          <Popover.Arrow style={{ fill: "#fff" }} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
