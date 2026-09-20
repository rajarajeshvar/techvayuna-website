"use client";

import React from "react";

interface TimelineNodeProps {
  /** 0 = inactive, 1 = active, 2 = completed */
  state: 0 | 1 | 2;
  /** Absolute x position (center) */
  cx: number;
  /** Absolute y position (center) */
  cy: number;
  /** Event index for stagger offsets */
  index: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Futuristic energy-core node rendered on the timeline path.
 * Three visual states: inactive / active / completed.
 * Pure CSS animations for orbit, pulse, breathe.
 */
export const TimelineNode: React.FC<TimelineNodeProps> = ({
  state,
  cx,
  cy,
  index,
  onMouseEnter,
  onMouseLeave,
}) => {
  const stateClass =
    state === 2
      ? "timeline-node--completed"
      : state === 1
      ? "timeline-node--active"
      : "timeline-node--inactive";

  return (
    <div
      className={`timeline-node ${stateClass}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        animationDelay: `${index * 0.15}s`,
      }}
    >
      {/* Outer glowing ring */}
      <div className="timeline-node__ring" />

      {/* Rotating halo */}
      <div className="timeline-node__halo" />

      {/* Orbiting spark particles */}
      <div className="timeline-node__orbit">
        <span className="timeline-node__spark" style={{ "--spark-i": 0 } as React.CSSProperties} />
        <span className="timeline-node__spark" style={{ "--spark-i": 1 } as React.CSSProperties} />
        <span className="timeline-node__spark" style={{ "--spark-i": 2 } as React.CSSProperties} />
        <span className="timeline-node__spark" style={{ "--spark-i": 3 } as React.CSSProperties} />
      </div>

      {/* Energy ripple (active state) */}
      <div className="timeline-node__ripple" />

      {/* Glassmorphism center core */}
      <div className="timeline-node__core" />
    </div>
  );
};
