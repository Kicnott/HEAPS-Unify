import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { DND_ITEM_TYPE } from '../../constants/dndTypes.js';
import '../../styles/timetable.css';

export function DragEventBlock({ event, gridRow, gridColumn, children, onClick }) {
  const dragStarted = useRef(false);
  const nodeRef = useRef();

  const [{ isDragging }, dragRef] = useDrag({
    type: DND_ITEM_TYPE,
    item: (monitor) => {
      dragStarted.current = true;
      // Calculate the offset from the top of the event block to the mouse
      const node = nodeRef.current;
      let initialOffsetY = 0;
      if (node && monitor) {
        const boundingRect = node.getBoundingClientRect();
        const clientOffset = monitor.getInitialClientOffset();
        if (clientOffset) {
          initialOffsetY = clientOffset.y - boundingRect.top;
        }
      }
      return { eventid: event.eventid, ...event, initialOffsetY };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
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

  // Attach both refs to the div
  const setRefs = (node) => {
    nodeRef.current = node;
    dragRef(node);
  };

  return (
    <div
      ref={setRefs}
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
