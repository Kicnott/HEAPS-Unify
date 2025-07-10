import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { DND_ITEM_TYPE } from '../../constants/dndTypes.js';
import '../../styles/timetable.css';

export function DragEventBlock({ event, gridRow, gridColumn, children, onClick }) {
  const dragStarted = useRef(false);

  const [{ isDragging }, dragRef] = useDrag({
    type: DND_ITEM_TYPE,
item: () => {
  dragStarted.current = true;
  return { eventid: event.eventid, ...event };
},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      // Reset drag flag after drag ends
      setTimeout(() => {
        dragStarted.current = false;
      }, 0);
    },
  });

  const handleClick = (e) => {
    if (!dragStarted.current && typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <div
      ref={dragRef}
      className="event-block"
      onClick={handleClick}
      style={{
        gridRow,
        gridColumn,
        opacity: isDragging ? 0.5 : 1,
        pointerEvents: isDragging ? 'none' : 'auto',
        cursor: 'move',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
}
