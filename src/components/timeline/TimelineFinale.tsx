"use client";

import React from "react";

interface TimelineFinaleProps {
  isActive: boolean;
}

/**
 * Final centered message with masked text reveal.
 * Triggers when the user reaches the last event.
 */
export const TimelineFinale: React.FC<TimelineFinaleProps> = ({ isActive }) => {
  return (
    <div className={`timeline-finale ${isActive ? "timeline-finale--active" : ""}`}>
      <div className="timeline-finale__line" />
      <p className="timeline-finale__text">
        <span className="timeline-finale__word">Every</span>{" "}
        <span className="timeline-finale__word">milestone</span>{" "}
        <span className="timeline-finale__word">fuels</span>{" "}
        <span className="timeline-finale__word">our</span>{" "}
        <span className="timeline-finale__word">next</span>{" "}
        <span className="timeline-finale__word timeline-finale__word--accent">flight.</span>
      </p>
      <div className="timeline-finale__line" />
    </div>
  );
};
