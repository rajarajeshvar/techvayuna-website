"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTheme, THEMES } from "@/context/ThemeContext";
import { gsap } from "gsap";
import { Sparkles, RefreshCw, Zap } from "lucide-react";

// Cube face configurations (size: 68px, half: 34px)
const CUBE_SIZE = 68;
const HALF_SIZE = 34;

// Isometric resting offsets so 3D depth and multiple faces are always visible
const ISO_TILT_X = -18;
const ISO_TILT_Y = 28;

// Primary face alignments (when front-and-center, with isometric offset added)
const FACE_BASE_ROTATIONS = [
  { rx: 0, ry: 0 },       // 0: Crimson (Front)
  { rx: 0, ry: -90 },     // 1: Cyan (Right)
  { rx: 0, ry: -180 },    // 2: Emerald (Back)
  { rx: 0, ry: 90 },      // 3: Solar (Left)
  { rx: -90, ry: 0 },     // 4: Violet (Top)
  { rx: 90, ry: 0 },      // 5: Plasma (Bottom)
];

export const InteractiveThemeCube: React.FC = () => {
  const { activeTheme, themeIndex, setThemeByIndex, cycleTheme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  // States for interactions
  const [isHovered, setIsHovered] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [shockwaveKey, setShockwaveKey] = useState(0);

  // Continuous rotation & physics refs
  const rotRef = useRef({ x: ISO_TILT_X, y: ISO_TILT_Y });
  const isPressingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const spinVelocityRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const idleTimeRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Apply target rotation to the cube element
  const applyRotation = (rx: number, ry: number) => {
    if (!cubeRef.current) return;
    cubeRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  // Animate smoothly to a specific theme face
  const snapToTheme = useCallback((targetIndex: number) => {
    if (!cubeRef.current) return;
    if (tweenRef.current) tweenRef.current.kill();

    const target = FACE_BASE_ROTATIONS[targetIndex] || FACE_BASE_ROTATIONS[0];
    const targetX = target.rx + ISO_TILT_X;
    const targetY = target.ry + ISO_TILT_Y;

    // Normalize current Y to avoid multi-spin unwinding
    let currentY = rotRef.current.y;
    const diff = (targetY - currentY) % 360;
    const shortestDiff = ((diff + 540) % 360) - 180;
    const finalY = currentY + shortestDiff;

    tweenRef.current = gsap.to(rotRef.current, {
      x: targetX,
      y: finalY,
      duration: 0.75,
      ease: "back.out(1.4)",
      onUpdate: () => {
        applyRotation(rotRef.current.x, rotRef.current.y);
      },
      onComplete: () => {
        rotRef.current.y = targetY;
        applyRotation(rotRef.current.x, rotRef.current.y);
      },
    });

    setShockwaveKey((k) => k + 1);
  }, []);

  // Update cube when themeIndex changes externally
  useEffect(() => {
    if (!isPressingRef.current) {
      snapToTheme(themeIndex);
    }
  }, [themeIndex, snapToTheme]);

  // Main continuous press & idle animation loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (isPressingRef.current) {
        // CONTINUOUS ROTATION WHILE PRESSED!
        // Rotates smoothly around Y and slight tumbling around X
        const spinSpeedY = 220; // degrees per second
        const spinSpeedX = 65;

        rotRef.current.y += spinSpeedY * dt;
        rotRef.current.x += Math.sin(timestamp * 0.003) * spinSpeedX * dt;

        applyRotation(rotRef.current.x, rotRef.current.y);
      } else if (!isHovered && !tweenRef.current?.isActive()) {
        // Subtle ambient floating wobble at idle
        idleTimeRef.current += dt;
        const target = FACE_BASE_ROTATIONS[themeIndex] || FACE_BASE_ROTATIONS[0];
        const wobbleX = Math.sin(idleTimeRef.current * 1.8) * 3;
        const wobbleY = Math.cos(idleTimeRef.current * 1.4) * 4;

        rotRef.current.x = target.rx + ISO_TILT_X + wobbleX;
        rotRef.current.y = target.ry + ISO_TILT_Y + wobbleY;

        applyRotation(rotRef.current.x, rotRef.current.y);
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [themeIndex, isHovered]);

  // Pointer Down (Press start)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Capture pointer so dragging outside the element still works
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (tweenRef.current) tweenRef.current.kill();
    isPressingRef.current = true;
    setIsPressing(true);

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    spinVelocityRef.current = { x: 0, y: 0 };
  };

  // Pointer Move (Drag to rotate in 3D while pressing)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPressingRef.current) {
      // Subtle 3D mouse parallax on hover when not pressing
      if (containerRef.current && !tweenRef.current?.isActive()) {
        const rect = containerRef.current.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        const target = FACE_BASE_ROTATIONS[themeIndex] || FACE_BASE_ROTATIONS[0];
        const hoverTiltX = target.rx + ISO_TILT_X - ny * 20;
        const hoverTiltY = target.ry + ISO_TILT_Y + nx * 20;

        rotRef.current.x += (hoverTiltX - rotRef.current.x) * 0.2;
        rotRef.current.y += (hoverTiltY - rotRef.current.y) * 0.2;
        applyRotation(rotRef.current.x, rotRef.current.y);
      }
      return;
    }

    // Interactive 3D manual dragging
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      rotRef.current.y += dx * 0.85;
      rotRef.current.x -= dy * 0.85;
      applyRotation(rotRef.current.x, rotRef.current.y);
    }

    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  // Pointer Up (Release)
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPressingRef.current) return;
    isPressingRef.current = false;
    setIsPressing(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }

    const elapsed = performance.now() - pointerStartRef.current.time;
    const totalDist = Math.hypot(
      e.clientX - pointerStartRef.current.x,
      e.clientY - pointerStartRef.current.y
    );

    // If it was a quick click/tap (under 250ms & minimal drag), advance to next theme!
    if (elapsed < 260 && totalDist < 8) {
      cycleTheme();
      return;
    }

    // If it was pressed/rotated continuously: calculate which face is closest to front
    // and activate that theme!
    const normY = ((rotRef.current.y - ISO_TILT_Y) % 360 + 360) % 360;
    const normX = ((rotRef.current.x - ISO_TILT_X) % 360 + 360) % 360;

    let closestTheme = 0;

    // Check top/bottom faces if X tilt is strong
    if (normX >= 45 && normX <= 135) {
      closestTheme = 5; // Bottom (Plasma)
    } else if (normX >= 225 && normX <= 315) {
      closestTheme = 4; // Top (Violet)
    } else {
      // Horizontal face checks based on Y rotation
      if (normY >= 315 || normY < 45) {
        closestTheme = 0; // Front (Crimson)
      } else if (normY >= 45 && normY < 135) {
        closestTheme = 3; // Left (Solar)
      } else if (normY >= 135 && normY < 225) {
        closestTheme = 2; // Back (Emerald)
      } else {
        closestTheme = 1; // Right (Cyan)
      }
    }

    setThemeByIndex(closestTheme);
    snapToTheme(closestTheme);
  };

  // Face definitions with explicit inline 3D positioning
  const FACES = [
    {
      id: 0,
      label: "01",
      code: "CRMSN",
      sub: "SYS",
      color: THEMES[0].primary,
      glow: THEMES[0].glow,
      transform: `rotateY(0deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 1,
      label: "02",
      code: "CYAN",
      sub: "HYPR",
      color: THEMES[1].primary,
      glow: THEMES[1].glow,
      transform: `rotateY(90deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 2,
      label: "03",
      code: "EMRLD",
      sub: "MTRX",
      color: THEMES[2].primary,
      glow: THEMES[2].glow,
      transform: `rotateY(180deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 3,
      label: "04",
      code: "SOLAR",
      sub: "FLRE",
      color: THEMES[3].primary,
      glow: THEMES[3].glow,
      transform: `rotateY(-90deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 4,
      label: "05",
      code: "VIOLET",
      sub: "NOVA",
      color: THEMES[4].primary,
      glow: THEMES[4].glow,
      transform: `rotateX(90deg) translateZ(${HALF_SIZE}px)`,
    },
    {
      id: 5,
      label: "06",
      code: "PLSMA",
      sub: "CORE",
      color: THEMES[5].primary,
      glow: THEMES[5].glow,
      transform: `rotateX(-90deg) translateZ(${HALF_SIZE}px)`,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-[9990] flex flex-col items-center select-none group touch-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shockwave expanding ring visual effect on theme rotation */}
      {shockwaveKey > 0 && (
        <span
          key={shockwaveKey}
          className="absolute top-12 w-28 h-28 rounded-full pointer-events-none -translate-y-1/2 animate-ping opacity-60"
          style={{
            borderColor: activeTheme.primary,
            borderWidth: "2px",
            boxShadow: `0 0 30px ${activeTheme.primary}`,
          }}
        />
      )}

      {/* Cyberpunk HUD Frame & Tooltip */}
      <div
        className={`mb-3 px-3 py-1.5 rounded-md bg-[#07070a]/92 backdrop-blur-md border flex items-center gap-2 transition-all duration-300 shadow-xl ${
          isPressing
            ? "scale-105 border-white"
            : isHovered
            ? "opacity-100 -translate-y-1"
            : "opacity-85 translate-y-0"
        }`}
        style={{
          borderColor: isPressing
            ? "#ffffff"
            : isHovered
            ? activeTheme.primary
            : "rgba(255,255,255,0.14)",
          boxShadow: isPressing
            ? `0 0 25px ${activeTheme.primary}, 0 0 10px #ffffff`
            : isHovered
            ? `0 0 18px ${activeTheme.glow}`
            : "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        <span
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isPressing ? "scale-150 animate-ping" : "animate-pulse"
          }`}
          style={{
            backgroundColor: activeTheme.primary,
            boxShadow: `0 0 10px ${activeTheme.primary}`,
          }}
        />
        <span className="font-mono text-[11px] font-bold tracking-wider text-val-light uppercase">
          {isPressing ? "SPINNING // CORE" : activeTheme.code}
        </span>
        {isPressing ? (
          <Zap className="w-3 h-3 text-yellow-300 animate-bounce" />
        ) : (
          <RefreshCw
            className={`w-3 h-3 text-val-gray transition-transform duration-500 ${
              isHovered ? "rotate-180 text-val-light" : ""
            }`}
          />
        )}
      </div>

      {/* 3D Cube Viewport Container */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-150 select-none ${
          isPressing ? "scale-110" : isHovered ? "scale-105" : "scale-100"
        }`}
        style={{
          width: `${CUBE_SIZE + 24}px`,
          height: `${CUBE_SIZE + 24}px`,
          perspective: "800px",
          perspectiveOrigin: "50% 50%",
        }}
        title="Press & hold to continuously rotate in 3D, or drag to rotate!"
        role="button"
        aria-label="Interactive 3D theme cube"
      >
        {/* Ambient Ground Glow beneath the cube */}
        <div
          className={`absolute -bottom-1 w-16 h-4 rounded-full blur-md pointer-events-none transition-all duration-300 ${
            isPressing ? "opacity-100 scale-125" : "opacity-60 scale-100"
          }`}
          style={{
            backgroundColor: activeTheme.primary,
            boxShadow: `0 0 20px ${activeTheme.primary}`,
          }}
        />

        {/* The 3D Rotating Cube Container */}
        <div
          ref={cubeRef}
          className="relative pointer-events-auto"
          style={{
            width: `${CUBE_SIZE}px`,
            height: `${CUBE_SIZE}px`,
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: `rotateX(${ISO_TILT_X}deg) rotateY(${ISO_TILT_Y}deg)`,
          }}
        >
          {/* Internal Glowing Power Core (Suspended in the 3D center) */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-200 ${
              isPressing ? "w-10 h-10 blur-[3px]" : "w-7 h-7 blur-[2px] animate-pulse"
            }`}
            style={{
              transform: "translate(-50%, -50%) translateZ(0px)",
              backgroundColor: activeTheme.primary,
              boxShadow: isPressing
                ? `0 0 24px ${activeTheme.primary}, 0 0 45px #ffffff, 0 0 60px ${activeTheme.primary}`
                : `0 0 16px ${activeTheme.primary}, 0 0 28px ${activeTheme.primary}`,
            }}
          />

          {/* 6 Rigid 3D Cube Faces */}
          {FACES.map((face) => {
            const isFaceActive = themeIndex === face.id;
            return (
              <div
                key={face.id}
                className="absolute rounded-xl overflow-hidden flex flex-col items-center justify-center select-none"
                style={{
                  width: `${CUBE_SIZE}px`,
                  height: `${CUBE_SIZE}px`,
                  top: 0,
                  left: 0,
                  transform: face.transform,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  backgroundColor: "rgba(10, 11, 18, 0.92)",
                  border: `2px solid ${isFaceActive ? "#ffffff" : face.color}`,
                  boxShadow: isFaceActive
                    ? `inset 0 0 18px ${face.color}, 0 0 16px ${face.color}, 0 0 6px #ffffff`
                    : `inset 0 0 14px ${face.glow}, 0 0 10px ${face.glow}`,
                }}
              >
                {/* Tech corner accent indicator */}
                <div
                  className="absolute top-1 left-1.5 text-[8px] font-mono font-bold leading-none"
                  style={{ color: face.color }}
                >
                  {face.label}
                </div>

                {/* Sub-label */}
                <div className="absolute top-1 right-1.5 text-[7px] font-mono text-white/40 leading-none">
                  {face.sub}
                </div>

                {/* Main face text */}
                <div
                  className="text-xs font-black font-display tracking-tight text-white transition-all duration-200"
                  style={{
                    textShadow: `0 0 10px ${face.color}, 0 0 20px ${face.color}`,
                  }}
                >
                  {face.code}
                </div>

                {/* Cyberpunk accent bar */}
                <div
                  className="mt-1.5 w-6 h-[2.5px] rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: face.color,
                    boxShadow: `0 0 6px ${face.color}`,
                  }}
                />

                {/* Grid dot matrix background texture inside face */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    backgroundImage: `radial-gradient(${face.color} 1px, transparent 1px)`,
                    backgroundSize: "8px 8px",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Micro-interaction prompt badge below cube */}
      <div
        className={`mt-2 flex items-center gap-1.5 transition-all duration-300 pointer-events-none ${
          isPressing
            ? "opacity-100 scale-105"
            : isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-70 translate-y-0.5"
        }`}
      >
        <Sparkles className="w-2.5 h-2.5 text-yellow-400 animate-spin" />
        <span className="font-mono text-[9px] tracking-widest text-val-light uppercase font-semibold">
          {isPressing ? "HOLDING // ROTATING" : "PRESS & HOLD TO ROTATE"}
        </span>
      </div>
    </div>
  );
};

export default InteractiveThemeCube;
