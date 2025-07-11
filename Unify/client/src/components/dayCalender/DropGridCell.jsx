import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { DND_ITEM_TYPE } from '../../constants/dndTypes.js';

export function DropGridCell({ idx, laneIdx, onDrop, children, style, canDropEvent, hoverRange, setHoverRange }) {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: DND_ITEM_TYPE,
    drop: (item, monitor) => {
      const gridCellHeight = 20;
      const offsetCells = Math.floor((item.initialOffsetY || 0) / gridCellHeight);
      const eventTopIdx = idx - offsetCells;
      onDrop(item, eventTopIdx >= 0 ? eventTopIdx : 0, laneIdx);
    },

    canDrop: (item, monitor) => {
      const gridCellHeight = 20;
      const offsetCells = Math.floor((item.initialOffsetY || 0) / gridCellHeight);
      const eventTopIdx = idx - offsetCells;
      // Your canDropEvent logic, but use eventTopIdx as the proposed start
      return canDropEvent ? canDropEvent(item, eventTopIdx >= 0 ? eventTopIdx : 0, laneIdx) : true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
hover: (item, monitor) => {
  const duration = item.endIdx - item.startIdx;
  const gridCellHeight = 20; // or whatever your interval height is
  const offsetCells = Math.floor((item.initialOffsetY || 0) / gridCellHeight);
  const dropStartIdx = idx - offsetCells;
  const dropEndIdx = dropStartIdx + duration;
  setHoverRange({
    start: Math.max(0, dropStartIdx),
    end: Math.min(96, dropEndIdx),
    lane: laneIdx,
  });
},
  });

  // When not hovering, reset
useEffect(() => {
  if (!isOver) {
    setHoverRange({ start: null, end: null, lane: null });
  }
}, [isOver, setHoverRange]);


const isInHoverRange =
  hoverRange.lane === laneIdx &&
  hoverRange.start != null &&
  hoverRange.end != null &&
  idx >= hoverRange.start &&
  idx < hoverRange.end;

  
  return (
    <div
      ref={dropRef}
style={{
  ...style,
  background: isInHoverRange ? '#e0ffe0' : undefined,
}}    >
      {children}
    </div>
  );
}
