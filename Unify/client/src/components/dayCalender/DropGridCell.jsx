import React from 'react';
import { useDrop } from 'react-dnd';
import { DND_ITEM_TYPE } from '../../constants/dndTypes.js';

export function DropGridCell({ idx, laneIdx, onDrop, children, style, canDropEvent }) {
  const [{ isOver, canDrop }, dropRef] = useDrop({
      accept: DND_ITEM_TYPE,
      drop: (item) => onDrop(item, idx, laneIdx),
      canDrop: (item) => canDropEvent ? canDropEvent(item, idx, laneIdx) : true,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });


  return (
    <div
      ref={dropRef}
      style={{
        ...style,
        background:
          isOver && canDrop ? '#e0ffe0' :
          isOver && !canDrop ? '#ffe0e0' : undefined
      }}
    >
      {children}
    </div>
  );
}
