"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTheme, THEMES } from "@/context/ThemeContext";
import { gsap } from "gsap";
import { RefreshCw } from "lucide-react";

// Compact, sleek dimensions
const CUBE_SIZE = 48;
const HALF_SIZE = CUBE_SIZE / 2; // 24px

// Subtle isometric tilt so 3D depth and adjacent faces are always visible
const ISO_X = -14;
const ISO_Y = 22;

const FACE_ROTATIONS = [
  { rx: 0, ry: 0 },       // 0: Crimson (Front)
  { rx: 0, ry: -90 },     // 1: Cyan (Right)
  { rx: 0, ry: -180 },    // 2: Emerald (Back)
  { rx: 0, ry: 90 },      // 3: Solar (Left)
  { rx: -90, ry: 0 },     // 4: Violet (Top)
  { rx: 90, ry: 0 },      // 5: Plasma (Bottom)
];

export const InteractiveThemeCube: React.FC = () => {
  const { activeTheme, themeIndex, cycleTheme, setThemeByIndex } = useTheme();

  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Active rotation state
  const rotRef = useRef({ x: ISO_X, y: ISO_Y });
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
    (index: number, duration = 0.65) => {
      if (!cubeRef.current) return;
      if (spinTweenRef.current) {
        spinTweenRef.current.kill();
        spinTweenRef.current = null;
      }

      const target = FACE_ROTATIONS[index] || FACE_ROTATIONS[0];
      const targetX = target.rx + ISO_X;
      const targetY = target.ry + ISO_Y;

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

  // Subtle mouse parallax tilt on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPressed || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    const target = FACE_ROTATIONS[themeIndex] || FACE_ROTATIONS[0];
    const hoverX = target.rx + ISO_X - ny * 16;
    const hoverY = target.ry + ISO_Y + nx * 16;

    gsap.to(rotRef.current, {
      x: hoverX,
      y: hoverY,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: () => setTransform(rotRef.current.x, rotRef.current.y),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isPressed) {
      snapToFace(themeIndex, 0.5);
    }
  };

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
      duration: 1.5,
      ease: "none",
      repeat: -1,
      onUpdate: () => setTransform(rotRef.current.x, rotRef.current.y),
    });

    // While holding down, smoothly cycle through themes every 400ms
    pressTimerRef.current = setInterval(() => {
      cycleTheme();
    }, 420);
  };

  // Pointer Up: Stop rotation and smoothly settle onto next face
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
    if (elapsed < 250) {
      // Quick click/tap: immediately advance theme smoothly
      cycleTheme();
    } else {
      // Held down: snap smoothly to whichever theme is currently active
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
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Sleek, minimal HUD badge */}
      <div
        className={`mb-1.5 px-2 py-0.5 rounded bg-[#07070a]/90 backdrop-blur-md border flex items-center gap-1.5 transition-all duration-300 ${
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

        {/* 3D Cube Core */}
        <div
          ref={cubeRef}
          className="relative pointer-events-none"
          style={{
            width: `${CUBE_SIZE}px`,
            height: `${CUBE_SIZE}px`,
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: `rotateX(${ISO_X}deg) rotateY(${ISO_Y}deg)`,
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
                  backgroundColor: "#0c0d14",
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
