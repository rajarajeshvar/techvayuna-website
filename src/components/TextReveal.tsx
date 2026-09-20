"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  /**
   * The text content. Use '\n' to separate lines.
   */
  text: string;
  /**
   * CSS class for the outermost container.
   */
  className?: string;
  /**
   * Class name for each line's wrapper.
   */
  lineClassName?: string;
  /**
   * Stagger duration between lines/words.
   */
  stagger?: number;
  /**
   * Animation duration for each item.
   */
  duration?: number;
  /**
   * Initial delay before starting the animation.
   */
  delay?: number;
  /**
   * Optional glowing style.
   */
  glow?: "red" | "white" | "blue" | "none";
  /**
   * Subtitle text to appear above the main text.
   */
  subtitle?: string;
  /**
   * Stencil number or decorative tag (e.g. '01', 'SYS_LOCK').
   */
  tag?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  lineClassName = "",
  stagger = 0.1,
  duration = 1.2,
  delay = 0,
  glow = "none",
  subtitle,
  tag,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);

  // Split text by lines
  const lines = text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create GSAP Context for easy cleanup
    const ctx = gsap.context(() => {
      const lineElements = container.querySelectorAll(".reveal-line");
      
      // 1. Reveal Animation (triggers once when section enters viewport)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%", // starts when the top of container hits 80% of viewport
          toggleActions: "play none none none", // play once
        },
        delay: delay,
      });

      // Animate Tag & Subtitle if present
      if (tagRef.current || subtitleRef.current) {
        tl.fromTo(
          [tagRef.current, subtitleRef.current].filter(Boolean),
          {
            opacity: 0,
            y: 15,
            skewX: -10,
          },
          {
            opacity: 1,
            y: 0,
            skewX: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0 // start at 0
        );
      }

      // Animate Lines folding out
      // We start with 3D rotation, translation downward, and 0 opacity
      tl.fromTo(
        lineElements,
        {
          opacity: 0,
          y: "110%", // translate below the overflow mask
          rotateX: -85, // rotate backwards
          transformOrigin: "50% 0%", // transform from top edge
        },
        {
          opacity: 1,
          y: "0%",
          rotateX: 0,
          duration: duration,
          stagger: stagger,
          ease: "power4.out", // bold cinematic ease
        },
        tagRef.current || subtitleRef.current ? 0.2 : 0 // offset slightly if there is subtitle
      );

      // Add a subtle shine sweep animation across text after reveal
      tl.to(
        lineElements,
        {
          textShadow: glow === "red" 
            ? "0 0 15px rgba(255, 70, 85, 0.6), 0 0 30px rgba(255, 70, 85, 0.3)"
            : glow === "blue"
            ? "0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.3)"
            : glow === "white"
            ? "0 0 15px rgba(236, 232, 225, 0.4), 0 0 30px rgba(236, 232, 225, 0.2)"
            : "none",
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      );

    }, container);

    return () => ctx.revert(); // revert animations on unmount
  }, [delay, duration, glow, stagger]);

  // Set glow classes
  let glowClass = "";
  if (glow === "red") glowClass = "text-glow-red text-val-red";
  else if (glow === "blue") glowClass = "text-glow-blue text-val-blue";
  else if (glow === "white") glowClass = "text-glow-white text-val-light";

  return (
    <div
      ref={containerRef}
      className={`flex flex-col select-none relative ${className}`}
    >
      {/* Decorative tag and subtitle */}
      {(tag || subtitle) && (
        <div className="flex items-center gap-3 mb-2 md:mb-4 overflow-hidden py-1">
          {tag && (
            <span
              ref={tagRef}
              className="px-2 py-0.5 text-xs font-mono font-bold bg-val-red text-val-dark tracking-widest clip-corner-sm"
            >
              {tag}
            </span>
          )}
          {subtitle && (
            <div
              ref={subtitleRef}
              className="text-xs md:text-sm font-mono tracking-widest text-val-gray uppercase flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-val-red inline-block" />
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* Main text heading with lines */}
      <div className="flex flex-col gap-1 md:gap-2">
        {lines.map((line, index) => (
          <div
            key={index}
            className="overflow-hidden block py-1 perspective-1000 transform-style-3d"
          >
            <h2
              className={`reveal-line text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-[0.85] transform-style-3d backface-hidden ${glowClass} ${lineClassName}`}
            >
              {line}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};
