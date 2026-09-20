"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export const CustomCursor: React.FC = () => {
  const { activeTheme } = useTheme();
  const dotRef = useRef<HTMLDivElement>(null);
  const phoenixContainerRef = useRef<HTMLDivElement>(null);
  const phoenixImgRef = useRef<HTMLImageElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth physics state
  const mouseRef = useRef({ x: -100, y: -100 });
  const dotPosRef = useRef({ x: -100, y: -100 });
  const phoenixPosRef = useRef({ x: -100, y: -100 });
  const angleRef = useRef(0);
  const bankingRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    let prevX = -100;
    let prevY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        dotPosRef.current = { x: e.clientX, y: e.clientY };
        phoenixPosRef.current = { x: e.clientX - 40, y: e.clientY - 40 };
        prevX = e.clientX - 40;
        prevY = e.clientY - 40;
      }
    };

    // Hover detection for buttons / links
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = !!target.closest("a, button, input, select, textarea, [role='button'], .clickable");
      setIsHovered(isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Continuous 60fps-144fps smooth aerodynamic physics loop
    const updatePhysics = (timestamp: number) => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 1. Core Dot: Snappy, ultra-responsive glide
      dotPosRef.current.x += (mx - dotPosRef.current.x) * 0.45;
      dotPosRef.current.y += (my - dotPosRef.current.y) * 0.45;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPosRef.current.x - 6}px, ${dotPosRef.current.y - 6}px, 0)`;
      }

      // 2. Trailing Phoenix: Inertial fluid flight physics
      const targetX = mx - 40;
      const targetY = my - 40;

      // Smooth lag follow (fluid spring-damped motion)
      phoenixPosRef.current.x += (targetX - phoenixPosRef.current.x) * 0.085;
      phoenixPosRef.current.y += (targetY - phoenixPosRef.current.y) * 0.085;

      // Velocity of the bird
      const vx = phoenixPosRef.current.x - prevX;
      const vy = phoenixPosRef.current.y - prevY;
      const speed = Math.hypot(vx, vy);

      prevX = phoenixPosRef.current.x;
      prevY = phoenixPosRef.current.y;

      let hoverY = 0;
      let hoverRotate = 0;

      if (speed > 0.45) {
        // Flight trajectory angle (0 deg = facing up)
        const targetDeg = (Math.atan2(vy, vx) * 180) / Math.PI + 90;

        // Shortest-arc angular interpolation
        let diff = (targetDeg - angleRef.current) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // Smooth orientation turn
        angleRef.current += diff * 0.12;

        // Aerodynamic banking roll
        const targetBank = Math.max(-24, Math.min(24, diff * 0.6));
        bankingRef.current += (targetBank - bankingRef.current) * 0.15;
      } else {
        // Resting hover: gentle breathing oscillation
        hoverY = Math.sin(timestamp * 0.003) * 4;
        hoverRotate = Math.sin(timestamp * 0.002) * 2;
        bankingRef.current += (0 - bankingRef.current) * 0.08;
      }

      if (phoenixContainerRef.current) {
        phoenixContainerRef.current.style.transform = `translate3d(${phoenixPosRef.current.x}px, ${phoenixPosRef.current.y + hoverY}px, 0)`;
      }

      if (phoenixImgRef.current) {
        phoenixImgRef.current.style.transform = `rotate(${angleRef.current + hoverRotate}deg) skewX(${bankingRef.current}deg)`;
      }

      rafIdRef.current = requestAnimationFrame(updatePhysics);
    };

    rafIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isVisible]);

  return (
    <>
      {/* 1. Glowing Cursor Core Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[10000] w-3 h-3 rounded-full transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovered ? "scale-150" : "scale-100"}`}
        style={{
          willChange: "transform",
          backgroundColor: isHovered ? activeTheme.primary : activeTheme.secondary,
          boxShadow: `0 0 14px ${activeTheme.secondary}, 0 0 28px ${activeTheme.primary}`,
          transition: "background-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
        }}
      />

      {/* 2. Trailing Phoenix Graphic (Aerodynamic gliding physics) */}
      <div
        ref={phoenixContainerRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] w-[80px] h-[80px] flex items-center justify-center transition-opacity duration-300 ${
          isVisible ? "opacity-90" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <img
          ref={phoenixImgRef}
          src="/chatgpt-image-aug-3-2026-07-36-47-pm-vectorized.svg"
          alt="Phoenix Follower"
          className="w-full h-full object-contain transition-all duration-500"
          style={{
            willChange: "transform",
            filter: `drop-shadow(0 0 20px ${activeTheme.secondary}) drop-shadow(0 0 35px ${activeTheme.primary})`,
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
