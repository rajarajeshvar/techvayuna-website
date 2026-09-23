"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE_EVENTS, TimelineEvent } from "./timelineData";
import { TimelineEmbers } from "./TimelineEmbers";
import { TimelineNode } from "./TimelineNode";
import { TimelineEventCard } from "./TimelineEventCard";
import { TimelineFinale } from "./TimelineFinale";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SVG PATH â€” smooth phoenix flight curves
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const EVENTS = TIMELINE_EVENTS;
const EVENT_COUNT = EVENTS.length;
// Vertical spacing between events in the SVG coordinate space
const EVENT_GAP = 500;
const SVG_WIDTH = 800;
const SVG_HEIGHT = EVENT_COUNT * EVENT_GAP + 400; // padding top/bottom
const PATH_X_CENTER = SVG_WIDTH / 2;
const CURVE_AMP = 160; // horizontal amplitude of the S-curves

// Build a smooth S-curve path through event nodes
function buildPathD(): string {
  const points: { x: number; y: number }[] = [];

  // Starting point (top center)
  points.push({ x: PATH_X_CENTER, y: 100 });

  for (let i = 0; i < EVENT_COUNT; i++) {
    const y = 200 + i * EVENT_GAP;
    // Alternate left/right for the S-curve peaks
    const isLeft = i % 2 === 0;
    const peakX = isLeft
      ? PATH_X_CENTER - CURVE_AMP
      : PATH_X_CENTER + CURVE_AMP;

    // Control point before the node
    points.push({ x: peakX, y: y - EVENT_GAP * 0.25 });
    // Node position (back to center-ish, slightly offset)
    const nodeX = isLeft
      ? PATH_X_CENTER - 20
      : PATH_X_CENTER + 20;
    points.push({ x: nodeX, y });
    // Control point after the node
    const afterX = isLeft
      ? PATH_X_CENTER + CURVE_AMP * 0.5
      : PATH_X_CENTER - CURVE_AMP * 0.5;
    points.push({ x: afterX, y: y + EVENT_GAP * 0.25 });
  }

  // End point (bottom center)
  points.push({ x: PATH_X_CENTER, y: SVG_HEIGHT - 100 });

  // Build cubic bezier path string
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 2; i += 3) {
    const cp1 = points[i];
    const p = points[i + 1];
    const cp2 = points[i + 2];
    d += ` C ${cp1.x} ${cp1.y}, ${p.x} ${p.y}, ${cp2.x} ${cp2.y}`;
  }
  // Smoothly connect to final point
  const last = points[points.length - 1];
  const secondLast = points[points.length - 2];
  d += ` Q ${secondLast.x} ${(secondLast.y + last.y) / 2}, ${last.x} ${last.y}`;

  return d;
}

// Compute node positions along the path (at each event's Y center)
function getNodePositions(): { x: number; y: number }[] {
  return EVENTS.map((_, i) => {
    const y = 200 + i * EVENT_GAP;
    const isLeft = i % 2 === 0;
    const x = isLeft ? PATH_X_CENTER - 20 : PATH_X_CENTER + 20;
    return { x, y };
  });
}

const PATH_D = buildPathD();
const NODE_POSITIONS = getNodePositions();

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   MAIN COMPONENT
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const PastEventsTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const bgPathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const [revealedCards, setRevealedCards] = useState<boolean[]>(
    new Array(EVENT_COUNT).fill(false)
  );
  const [nodeStates, setNodeStates] = useState<(0 | 1 | 2)[]>(
    new Array(EVENT_COUNT).fill(0)
  );
  const [finaleActive, setFinaleActive] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((index: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 200);
  }, []);

  // Memoized state updaters to avoid re-creating on every render
  const updateNodeState = useCallback(
    (index: number, state: 0 | 1 | 2) => {
      setNodeStates((prev) => {
        if (prev[index] === state) return prev;
        const next = [...prev];
        next[index] = state;
        return next;
      });
    },
    []
  );

  const revealCard = useCallback((index: number) => {
    setRevealedCards((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    const activePath = activePathRef.current;
    const bgPath = bgPathRef.current;
    const pulse = pulseRef.current;
    if (!section || !svg || !activePath || !bgPath || !pulse) return;

    // Measure path length
    const pathLength = activePath.getTotalLength();
    activePath.style.strokeDasharray = `${pathLength}`;
    activePath.style.strokeDashoffset = `${pathLength}`;

    const ctx = gsap.context(() => {
      // Main scroll-linked timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // 1. Animate the stroke fill along the path
      tl.to(
        activePath,
        { strokeDashoffset: 0, ease: "none" },
        0
      );

      // 2. Move the energy pulse along the path
      tl.to(
        {},
        {
          duration: 1,
          ease: "none",
          onUpdate: function () {
            const progress = this.progress();
            const point = activePath.getPointAtLength(progress * pathLength);
            pulse.setAttribute("cx", String(point.x));
            pulse.setAttribute("cy", String(point.y));
          },
        },
        0
      );

      // 3. Per-event ScrollTriggers for card reveals and node state transitions
      EVENTS.forEach((_, i) => {
        const eventProgress = (i + 0.5) / EVENT_COUNT;
        const triggerY = eventProgress * 100;

        ScrollTrigger.create({
          trigger: section,
          start: `top+=${triggerY - 15}% center`,
          end: `top+=${triggerY + 15}% center`,
          onEnter: () => {
            updateNodeState(i, 1); // active
            revealCard(i);
          },
          onLeave: () => {
            updateNodeState(i, 2); // completed
            setRevealedCards((prev) => {
              const next = [...prev];
              next[i] = false;
              return next;
            });
          },
          onEnterBack: () => {
            updateNodeState(i, 1); // re-active when scrolling back
            revealCard(i);
          },
          onLeaveBack: () => {
            updateNodeState(i, 0); // inactive again
            setRevealedCards((prev) => {
              const next = [...prev];
              next[i] = false;
              return next;
            });
          },
        });
      });

      // 4. Finale trigger
      ScrollTrigger.create({
        trigger: section,
        start: "bottom-=30% bottom",
        onEnter: () => setFinaleActive(true),
        onLeaveBack: () => setFinaleActive(false),
      });
    }, section);

    return () => ctx.revert();
  }, [updateNodeState, revealCard]);

  return (
    <section
      id="past-events"
      ref={sectionRef}
      className="timeline-section"
      style={{ height: `${SVG_HEIGHT + 200}px` }}
    >
      {/* â”€â”€ Background â”€â”€ */}
      <div data-speed="0.5" className="timeline-section__bg">
        <TimelineEmbers />
      </div>

      {/* â”€â”€ Section Header â”€â”€ */}
      <div className="timeline-section__header">
        <div className="timeline-section__tag">
          <span className="timeline-section__tag-label">SEC_04</span>
          <span className="timeline-section__tag-comment">// PAST_EVENTS_TIMELINE</span>
        </div>
        <h2 className="timeline-section__title">OUR JOURNEY</h2>
        <p className="timeline-section__subtitle">
          The phoenix&apos;s trail through milestones that shaped Tech Vayuna
        </p>
        <div className="timeline-section__separator" />
      </div>

      {/* â”€â”€ SVG Timeline Path + Nodes â”€â”€ */}
      <div className="timeline-section__canvas">
        <svg
          ref={svgRef}
          className="timeline-section__svg"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          {/* Gradient for active path */}
          <defs>
            <linearGradient id="tl-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D83A60" />
              <stop offset="70%" stopColor="#D83A60" />
              <stop offset="100%" stopColor="#88207C" />
            </linearGradient>
            <filter id="tl-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="tl-pulse-glow">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background dim path */}
          <path
            ref={bgPathRef}
            d={PATH_D}
            stroke="rgba(236, 232, 225, 0.06)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Active path */}
          <path
            ref={activePathRef}
            d={PATH_D}
            stroke="#D83A60"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#tl-glow)"
          />

          {/* Energy pulse traveling along the path */}
          <circle
            ref={pulseRef}
            cx={PATH_X_CENTER}
            cy={100}
            r="8"
            fill="#D83A60"
            filter="url(#tl-pulse-glow)"
            opacity="0.9"
          />
        </svg>

        {/* â”€â”€ Energy Core Nodes (percentage-positioned) â”€â”€ */}
        {NODE_POSITIONS.map((pos, i) => (
          <TimelineNode
            key={EVENTS[i].id}
            state={nodeStates[i]}
            cx={(pos.x / SVG_WIDTH) * 100}
            cy={(pos.y / SVG_HEIGHT) * 100}
            index={i}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          />
        ))}

        {/* â”€â”€ Event Cards â”€â”€ */}
        {EVENTS.map((event, i) => {
          const isLeft = i % 2 === 0;
          const topPercent = (NODE_POSITIONS[i].y / SVG_HEIGHT) * 100;
          return (
            <TimelineEventCard
              key={event.id}
              event={event}
              isLeft={isLeft}
              isRevealed={hoveredIndex === i || revealedCards[i]}
              index={i}
              topPercent={topPercent}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </div>

      {/* â”€â”€ Finale â”€â”€ */}
      <TimelineFinale isActive={finaleActive} />

      {/* â”€â”€ Footer mark â”€â”€ */}
      <div className="timeline-section__footer">
        <span className="timeline-section__footer-text">
          [ PHOENIX_TRAIL_COMPLETE ]
        </span>
      </div>
    </section>
  );
};
