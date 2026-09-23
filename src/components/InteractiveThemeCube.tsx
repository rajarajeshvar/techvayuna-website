"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTheme, THEMES } from "@/context/ThemeContext";
import { gsap } from "gsap";
import { RefreshCw } from "lucide-react";

// Compact, sleek dimensions
const CUBE_SIZE = 48;
const HALF_SIZE = CUBE_SIZE / 2; // 24px

// Looking directly at the user (0deg offset)
const ISO_X = 0;
const ISO_Y = 0;

// Angles to bring each face straight towards the user's gaze
const FACE_ROTATIONS = [
  { rx: 0, ry: 0 },       // 0: Crimson (Front) -> looks straight at user
  { rx: 0, ry: -90 },     // 1: Cyan (Right)    -> looks straight at user
  { rx: 0, ry: 180 },     // 2: Emerald (Back)  -> looks straight at user
  { rx: 0, ry: 90 },      // 3: Solar (Left)    -> looks straight at user
  { rx: -90, ry: 0 },     // 4: Violet (Top)    -> looks straight at user
  { rx: 90, ry: 0 },      // 5: Plasma (Bottom) -> looks straight at user
];

export const InteractiveThemeCube: React.FC = () => {
  const { activeTheme, themeIndex, cycleTheme } = useTheme();

  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Active rotation state & gaze tracking
  const rotRef = useRef({ x: 0, y: 0 });
  const gazeRef = useRef({ x: 0, y: 0 });
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartTimeRef = useRef(0);

  // Apply transform directly to cube
  const setTransform = (x: number, y: number) => {
    if (!cubeRef.current) return;
    cubeRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  };

  // Smoothly transition to active theme face
  const snapToFace = useCallback(
    (index: number, duration = 0.6) => {
      if (!cubeRef.current) return;
      if (spinTweenRef.current) {
        spinTweenRef.current.kill();
        spinTweenRef.current = null;
      }

      const target = FACE_ROTATIONS[index] || FACE_ROTATIONS[0];
      const targetX = target.rx + gazeRef.current.x;
      const targetY = target.ry + gazeRef.current.y;

      // Find shortest rotational path around Y
      let currentY = rotRef.current.y;
      const diffY = ((targetY - currentY) % 360 + 540) % 360 - 180;
      const finalY = currentY + diffY;

      gsap.to(rotRef.current, {
        x: targetX,
        y: finalY,
        duration,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => setTransform(rotRef.current.x, rotRef.current.y),
        onComplete: () => {
          rotRef.current.x = targetX;
          rotRef.current.y = targetY;
          setTransform(targetX, targetY);
        },
      });
    },
    []
  );

  // Sync with theme changes
  useEffect(() => {
    if (!isPressed) {
      snapToFace(themeIndex);
    }
  }, [themeIndex, isPressed, snapToFace]);

  // "Look Into Me" Screen Mouse-Gaze Tracking:
  // Subtly turns the cube's face to track the user's cursor across the screen
  useEffect(() => {
    let ticking = false;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPressed || ticking) return;
      if (!containerRef.current) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const cubeCenterX = rect.left + rect.width / 2;
        const cubeCenterY = rect.top + rect.height / 2;

        // Vector from cube to cursor
        const dx = (e.clientX - cubeCenterX) / window.innerWidth;
        const dy = (e.clientY - cubeCenterY) / window.innerHeight;

        // Subtle look-at angles (max ~14 degrees)
        const lookY = Math.max(-14, Math.min(14, dx * 22));
        const lookX = Math.max(-14, Math.min(14, -dy * 22));

        gazeRef.current = { x: lookX, y: lookY };

        const target = FACE_ROTATIONS[themeIndex] || FACE_ROTATIONS[0];
        const destX = target.rx + lookX;
        const destY = target.ry + lookY;

        gsap.to(rotRef.current, {
          x: destX,
          y: destY,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
          onUpdate: () => setTransform(rotRef.current.x, rotRef.current.y),
        });
      });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [themeIndex, isPressed]);

  // Pointer Down: Start continuous smooth rotation while pressed
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsPressed(true);
    pressStartTimeRef.current = Date.now();

    // Kill any existing tween
    if (spinTweenRef.current) spinTweenRef.current.kill();

    // Start continuous butter-smooth 3D spin with GSAP
    spinTweenRef.current = gsap.to(rotRef.current, {
      y: "+=360",
      duration: 1.4,
      ease: "none",
      repeat: -1,
      onUpdate: () => setTransform(rotRef.current.x, rotRef.current.y),
    });

    // While holding down, smoothly cycle through themes every 400ms
    pressTimerRef.current = setInterval(() => {
      cycleTheme();
    }, 400);
  };

  // Pointer Up: Stop rotation and smoothly settle onto active face looking at user
  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    setIsPressed(false);

    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
      spinTweenRef.current = null;
    }

    const elapsed = Date.now() - pressStartTimeRef.current;
    if (elapsed < 240) {
      // Quick click/tap: advance theme smoothly
      cycleTheme();
    } else {
      // Held down: snap smoothly to current active theme face
      snapToFace(themeIndex, 0.6);
    }
  };

  // 6 Face definitions
  const FACES = [
    {
      id: 0,
      code: "CRMSN",
      num: "01",
      color: THEMES[0].primary,
      glow: THEMES[0].glow,
      transform: `rotateY(0deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 1,
      code: "CYAN",
      num: "02",
      color: THEMES[1].primary,
      glow: THEMES[1].glow,
      transform: `rotateY(90deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 2,
      code: "EMRLD",
      num: "03",
      color: THEMES[2].primary,
      glow: THEMES[2].glow,
      transform: `rotateY(180deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 3,
      code: "SOLAR",
      num: "04",
      color: THEMES[3].primary,
      glow: THEMES[3].glow,
      transform: `rotateY(-90deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 4,
      code: "VIOLET",
      num: "05",
      color: THEMES[4].primary,
      glow: THEMES[4].glow,
      transform: `rotateX(90deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 5,
      code: "PLSMA",
      num: "06",
      color: THEMES[5].primary,
      glow: THEMES[5].glow,
      transform: `rotateX(-90deg) translateZ(${HALF_SIZE}px)`,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-[9990] flex flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sleek, minimal HUD badge */}
      <div
        className={`mb-1.5 px-2 py-0.5 rounded bg-[#0D0B0F]/90 backdrop-blur-md border flex items-center gap-1.5 transition-all duration-300 ${
          isPressed
            ? "scale-105 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            : isHovered
            ? "opacity-100 -translate-y-0.5"
            : "opacity-80 translate-y-0"
        }`}
        style={{
          borderColor: isPressed
            ? "#ffffff"
            : isHovered
            ? activeTheme.primary
            : "rgba(255,255,255,0.12)",
          boxShadow: isHovered ? `0 0 10px ${activeTheme.glow}` : "none",
        }}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${isPressed ? "animate-ping" : "animate-pulse"}`}
          style={{
            backgroundColor: activeTheme.primary,
            boxShadow: `0 0 6px ${activeTheme.primary}`,
          }}
        />
        <span className="font-mono text-[9px] font-semibold tracking-wider text-val-light uppercase">
          {activeTheme.code}
        </span>
        <RefreshCw
          className={`w-2.5 h-2.5 text-val-gray transition-transform duration-500 ${
            isPressed ? "animate-spin text-white" : isHovered ? "rotate-180 text-val-light" : ""
          }`}
        />
      </div>

      {/* 3D Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
          isPressed ? "scale-95" : isHovered ? "scale-105" : "scale-100"
        }`}
        style={{
          width: `${CUBE_SIZE + 12}px`,
          height: `${CUBE_SIZE + 12}px`,
          perspective: "600px",
          perspectiveOrigin: "50% 50%",
        }}
        role="button"
        aria-label="Interactive 3D theme cube"
      >
        {/* Soft ground glow beneath the cube */}
        <div
          className={`absolute -bottom-1 w-11 h-2.5 rounded-full blur-sm pointer-events-none transition-all duration-300 ${
            isPressed ? "opacity-90 scale-110" : "opacity-60 scale-100"
          }`}
          style={{ backgroundColor: activeTheme.primary }}
        />

        {/* 3D Cube Core - facing straight at user */}
        <div
          ref={cubeRef}
          className="relative pointer-events-none"
          style={{
            width: `${CUBE_SIZE}px`,
            height: `${CUBE_SIZE}px`,
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: "rotateX(0deg) rotateY(0deg)",
          }}
        >
          {/* Inner Glowing Plasma Sphere */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-200"
            style={{
              width: isPressed ? "22px" : "16px",
              height: isPressed ? "22px" : "16px",
              backgroundColor: activeTheme.primary,
              boxShadow: `0 0 12px ${activeTheme.primary}, 0 0 20px ${activeTheme.primary}`,
              filter: "blur(1.5px)",
            }}
          />

          {/* 6 Cube Faces */}
          {FACES.map((face) => {
            const isActive = themeIndex === face.id;
            return (
              <div
                key={face.id}
                className="absolute rounded-lg flex flex-col items-center justify-center p-1 overflow-hidden transition-colors duration-200"
                style={{
                  width: `${CUBE_SIZE}px`,
                  height: `${CUBE_SIZE}px`,
                  top: 0,
                  left: 0,
                  transform: face.transform,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  backgroundColor: "#14111A",
                  border: `1.5px solid ${isActive ? "#ffffff" : face.color}`,
                  boxShadow: isActive
                    ? `inset 0 0 12px ${face.color}, 0 0 10px ${face.color}`
                    : `inset 0 0 8px ${face.glow}, 0 0 6px ${face.glow}`,
                }}
              >
                {/* Micro corner number */}
                <div
                  className="absolute top-1 left-1.5 text-[7px] font-mono font-bold leading-none"
                  style={{ color: face.color }}
                >
                  {face.num}
                </div>

                {/* Main face text */}
                <div
                  className="text-[11px] font-black font-display tracking-tight text-white"
                  style={{
                    textShadow: `0 0 6px ${face.color}`,
                  }}
                >
                  {face.code}
                </div>

                {/* Accent line */}
                <div
                  className="mt-1 w-5 h-[2px] rounded-full"
                  style={{ backgroundColor: face.color }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InteractiveThemeCube;
