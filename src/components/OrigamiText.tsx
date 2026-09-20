"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface OrigamiTextProps {
  /**
   * Text to reveal. Use '\n' to split lines.
   */
  text: string;
  className?: string;
  lineClassName?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  glow?: "red" | "white" | "blue" | "none";
  subtitle?: string;
  tag?: string;
}

export const OrigamiText: React.FC<OrigamiTextProps> = ({
  text,
  className = "",
  lineClassName = "",
  stagger = 0.15,
  duration = 1.4,
  delay = 0,
  glow = "none",
  subtitle,
  tag,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const lines = text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const uppers = container.querySelectorAll(".origami-upper");
      const lowers = container.querySelectorAll(".origami-lower");
      const creases = container.querySelectorAll(".origami-crease-shadow");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        delay: delay,
      });

      // Animate metadata tags
      if (tagRef.current || subtitleRef.current) {
        tl.fromTo(
          [tagRef.current, subtitleRef.current].filter(Boolean),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0
        );
      }

      // Origami folding timeline
      // Upper panel rotates down from top edge (rotateX: -90 to 0)
      tl.fromTo(
        uppers,
        {
          rotateX: -90,
          opacity: 0,
          y: "30%", // slide down slightly as it unfolds
        },
        {
          rotateX: 0,
          opacity: 1,
          y: "0%",
          duration: duration,
          stagger: stagger,
          ease: "power4.out",
        },
        tagRef.current || subtitleRef.current ? 0.2 : 0
      );

      // Lower panel unfolds relative to the upper panel (rotateX: 95 to 0)
      tl.fromTo(
        lowers,
        {
          rotateX: 95,
        },
        {
          rotateX: 0,
          duration: duration,
          stagger: stagger,
          ease: "elastic.out(1, 0.75)", // add a subtle organic bounce as paper snaps open!
        },
        tagRef.current || subtitleRef.current ? 0.3 : 0.1 // stagger offset
      );

      // Crease shadow fades out as panels flatten
      tl.fromTo(
        creases,
        {
          opacity: 0.7,
        },
        {
          opacity: 0,
          duration: duration * 0.7,
          stagger: stagger,
          ease: "power2.out",
        },
        tagRef.current || subtitleRef.current ? 0.25 : 0.05
      );

      // Final branding glow sweep
      tl.to(
        [uppers, lowers],
        {
          textShadow: glow === "red" 
            ? "0 0 15px rgba(244, 59, 134, 0.6), 0 0 30px rgba(97, 0, 148, 0.3)"
            : glow === "blue"
            ? "0 0 15px rgba(97, 0, 148, 0.6), 0 0 30px rgba(63, 0, 113, 0.3)"
            : glow === "white"
            ? "0 0 15px rgba(236, 232, 225, 0.4), 0 0 30px rgba(236, 232, 225, 0.2)"
            : "none",
          duration: 0.5,
          ease: "power2.out",
        },
        `-=${duration * 0.5}`
      );

    }, container);

    return () => ctx.revert();
  }, [delay, duration, glow, stagger]);

  // Set glow classes
  let glowClass = "";
  if (glow === "red") glowClass = "text-brand-pink";
  else if (glow === "blue") glowClass = "text-brand-purple";
  else if (glow === "white") glowClass = "text-val-light";

  return (
    <div
      ref={containerRef}
      className={`flex flex-col select-none relative ${className}`}
    >
      {/* Decorative metadata tag and subtitle */}
      {(tag || subtitle) && (
        <div className="flex items-center gap-3 mb-3 md:mb-5 overflow-hidden py-1">
          {tag && (
            <span
              ref={tagRef}
              className="px-2 py-0.5 text-xs font-mono font-bold bg-gradient-to-r from-brand-orange to-brand-pink text-val-dark tracking-widest clip-corner-sm"
            >
              {tag}
            </span>
          )}
          {subtitle && (
            <div
              ref={subtitleRef}
              className="text-xs md:text-sm font-mono tracking-widest text-val-gray uppercase flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-brand-pink inline-block" />
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* Main Text Heading with Origami Lines */}
      <div className="flex flex-col gap-3 md:gap-4">
        {lines.map((line, index) => (
          <div
            key={index}
            className="relative overflow-visible block h-[55px] sm:h-[90px] md:h-[130px] xl:h-[170px] perspective-1000 transform-style-3d"
          >
            {/* Upper Panel (Rotates around Top Edge) */}
            <div className="origami-upper absolute inset-0 origin-top transform-style-3d backface-hidden opacity-0">
              {/* Upper half of text (Clip top 50%) */}
              <div 
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }} 
                className="absolute inset-0 flex items-center"
              >
                <h2
                  className={`text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-none ${glowClass} ${lineClassName}`}
                >
                  {line}
                </h2>
              </div>

              {/* Lower Panel (Nested inside Upper, rotates around Crease Line) */}
              <div 
                className="origami-lower absolute inset-0 transform-style-3d backface-hidden"
                style={{ transformOrigin: "50% 50%" }} // 50% line is the center folding point
              >
                {/* Lower half of text (Clip bottom 50%) */}
                <div 
                  style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }} 
                  className="absolute inset-0 flex items-center"
                >
                  <h2
                    className={`text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-none ${glowClass} ${lineClassName}`}
                  >
                    {line}
                  </h2>
                </div>

                {/* Dark crease shadow overlay at the fold crease */}
                <div 
                  className="origami-crease-shadow absolute top-[50%] left-0 w-full h-[3px] bg-black/60 blur-[1px] pointer-events-none transform -translate-y-[50%] z-20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
