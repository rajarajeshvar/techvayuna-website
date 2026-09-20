"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AccordionTextProps {
  /**
   * The text line to fold.
   */
  text: string;
  className?: string;
  lineClassName?: string;
  /**
   * Number of folds (default is 10).
   */
  foldsCount?: number;
  glow?: "red" | "white" | "blue" | "none";
  subtitle?: string;
  tag?: string;
}

export const AccordionText: React.FC<AccordionTextProps> = ({
  text,
  className = "",
  lineClassName = "",
  foldsCount = 10,
  glow = "none",
  subtitle,
  tag,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const lines = text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Unfolding animation bound to scroll position (scrubbed)
      const parentSection = container.closest("section") || container;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: parentSection,
          start: "top top", // sync with pinned parent start
          end: "+=100%", // sync with pinned parent duration
          scrub: 0.8, // smooth scrub follow
        },
      });

      // Animate metadata elements
      if (tagRef.current || subtitleRef.current) {
        tl.fromTo(
          [tagRef.current, subtitleRef.current].filter(Boolean),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, ease: "none" },
          0
        );
      }

      // Select all even/odd slice layers across all lines
      for (let f = 0; f < foldsCount; f++) {
        const slices = container.querySelectorAll(`.slice-level-${f}`);
        const shadows = container.querySelectorAll(`.shadow-level-${f}`);

        // Alternating accordion folds start state
        // Level 0: -75deg
        // Level 1: 150deg
        // Level 2: -150deg
        // Level 3: 150deg
        // etc.
        const startAngle = f === 0 ? -70 : (f % 2 === 0 ? -140 : 140);

        tl.fromTo(
          slices,
          {
            rotateX: startAngle,
            opacity: f === 0 ? 0.1 : 1, // fade in parent slice
          },
          {
            rotateX: 0,
            opacity: 1,
            ease: "none", // scrub animations should be linear/none
          },
          0 // all folds unfold in sync based on scroll!
        );

        // Shadows fade out as the folds open flat
        if (shadows.length > 0) {
          tl.fromTo(
            shadows,
            { opacity: f === 0 ? 0 : 0.6 },
            { opacity: 0, ease: "none" },
            0
          );
        }
      }

      // 2. Glow effect sweep at the end of the scroll trigger
      const glowElements = container.querySelectorAll(".slice-text");
      gsap.fromTo(
        glowElements,
        {
          textShadow: "none",
        },
        {
          textShadow: glow === "red" 
            ? "0 0 15px rgba(244, 59, 134, 0.6), 0 0 30px rgba(97, 0, 148, 0.3)"
            : glow === "blue"
            ? "0 0 15px rgba(97, 0, 148, 0.6), 0 0 30px rgba(63, 0, 113, 0.3)"
            : glow === "white"
            ? "0 0 15px rgba(236, 232, 225, 0.4), 0 0 30px rgba(236, 232, 225, 0.2)"
            : "none",
          scrollTrigger: {
            trigger: parentSection,
            start: "top+=60% top",
            end: "top+=90% top",
            scrub: true,
          }
        }
      );

    }, container);

    return () => ctx.revert();
  }, [foldsCount, glow]);

  // Styling properties
  let glowClass = "";
  if (glow === "red") glowClass = "text-brand-pink text-glow-brand";
  else if (glow === "blue") glowClass = "text-brand-purple text-glow-blue";
  else if (glow === "white") glowClass = "text-val-light text-glow-white";

  // Height configs using responsive text sizing
  // Total height of a line box is 1.15em (including line spacing)
  const H = 1.15; 
  const h = H / foldsCount;

  // Recursive slice renderer to build a nested 3D forward-kinematics chain
  const renderSlices = (line: string, index: number): React.ReactNode => {
    if (index >= foldsCount) return null;

    return (
      <div
        className={`slice-level-${index} absolute left-0 w-full transform-style-3d backface-hidden`}
        style={{
          height: `${h}em`,
          top: index === 0 ? "0" : `${h}em`, // attach bottom of parent
          transformOrigin: "50% 0%", // fold along top edge
        }}
      >
        {/* Clipped text stripe */}
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ height: `${h}em` }}
        >
          <div
            style={{
              transform: `translateY(-${index * h}em)`,
              height: `${H}em`,
            }}
            className="flex items-center"
          >
            <h2
              className={`slice-text text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-none ${glowClass} ${lineClassName}`}
              style={{ height: `${H}em`, display: "block" }}
            >
              {line}
            </h2>
          </div>
        </div>

        {/* Crease shadow for 3D depth */}
        {index > 0 && (
          <div 
            className={`shadow-level-${index} absolute top-0 left-0 w-full h-[4px] bg-black/80 blur-[2px] pointer-events-none transform -translate-y-1/2 z-20`} 
          />
        )}

        {/* Nest next slice inside this one */}
        {renderSlices(line, index + 1)}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col select-none relative ${className}`}
      style={{ perspective: "1500px" }} // high perspective for deep 3D folding
    >
      {/* Tags and Subtitles */}
      {(tag || subtitle) && (
        <div className="flex items-center gap-3 mb-4 md:mb-6 overflow-hidden py-1">
          {tag && (
            <div
              ref={tagRef}
              className="px-2 py-0.5 text-xs font-mono font-bold bg-gradient-to-r from-brand-orange to-brand-pink text-val-dark tracking-widest clip-corner-sm"
            >
              {tag}
            </div>
          )}
          {subtitle && (
            <div
              ref={subtitleRef}
              className="text-xs md:text-sm font-mono tracking-widest text-val-gray uppercase flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-brand-pink inline-block animate-pulse" />
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* Accordion Lines Wrapper */}
      <div className="flex flex-col gap-6 md:gap-10">
        {lines.map((line, index) => (
          <div
            key={index}
            className="relative block transform-style-3d overflow-visible"
            style={{ height: `${H}em` }} // hold full height block for text
          >
            {renderSlices(line, 0)}
          </div>
        ))}
      </div>
    </div>
  );
};
