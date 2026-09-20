"use client";

import React from "react";

/**
 * Floating ember particles + radial glow blobs.
 * Pure CSS animations — no Canvas, no Three.js.
 */

const EMBER_COUNT = 28;

// Pre-generate deterministic ember data to avoid hydration mismatch
const EMBERS = Array.from({ length: EMBER_COUNT }, (_, i) => {
  // Use index-based pseudo-random distribution instead of Math.random()
  const seed = ((i * 2654435761) >>> 0) / 4294967296; // Knuth multiplicative hash
  const seed2 = (((i + 7) * 2654435761) >>> 0) / 4294967296;
  const seed3 = (((i + 13) * 2654435761) >>> 0) / 4294967296;
  const seed4 = (((i + 19) * 2654435761) >>> 0) / 4294967296;

  return {
    id: i,
    left: `${(seed * 100).toFixed(1)}%`,
    top: `${(seed2 * 100).toFixed(1)}%`,
    size: 1.5 + seed3 * 3,
    duration: 8 + seed4 * 16,
    delay: seed * 10,
    opacity: 0.15 + seed3 * 0.35,
    isLarge: i < 6, // first 6 are larger "dust" particles
  };
});

export const TimelineEmbers: React.FC = () => {
  return (
    <div className="timeline-embers" aria-hidden="true">
      {/* Radial glow blobs */}
      <div className="timeline-embers__glow timeline-embers__glow--1" />
      <div className="timeline-embers__glow timeline-embers__glow--2" />
      <div className="timeline-embers__glow timeline-embers__glow--3" />

      {/* Ember particles */}
      {EMBERS.map((ember) => (
        <div
          key={ember.id}
          className={`timeline-embers__particle ${
            ember.isLarge ? "timeline-embers__particle--dust" : ""
          }`}
          style={{
            left: ember.left,
            top: ember.top,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            animationDuration: `${ember.duration}s`,
            animationDelay: `${ember.delay}s`,
            opacity: ember.opacity,
          }}
        />
      ))}
    </div>
  );
};
