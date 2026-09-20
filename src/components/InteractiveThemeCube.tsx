"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTheme, THEMES } from "@/context/ThemeContext";
import { gsap } from "gsap";
import { Sparkles, RefreshCw } from "lucide-react";

// Rotation angles corresponding to each face
const FACE_ROTATIONS = [
  { rx: 0, ry: 0 },       // 0: Crimson (Front)
  { rx: 0, ry: -90 },     // 1: Cyan (Right)
  { rx: 0, ry: -180 },    // 2: Emerald (Back)
  { rx: 0, ry: 90 },      // 3: Solar (Left)
  { rx: -90, ry: 0 },     // 4: Violet (Top)
  { rx: 90, ry: 0 },      // 5: Plasma (Bottom)
];

export const InteractiveThemeCube: React.FC = () => {
  const { activeTheme, themeIndex, cycleTheme } = useTheme();
  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [shockwaveKey, setShockwaveKey] = useState(0);

  // Parallax tilt angles
  const mouseTiltRef = useRef({ x: 0, y: 0 });

  // Rotate cube when themeIndex changes
  useEffect(() => {
    if (!cubeRef.current) return;
    const target = FACE_ROTATIONS[themeIndex] || FACE_ROTATIONS[0];

    gsap.to(cubeRef.current, {
      rotateX: target.rx,
      rotateY: target.ry,
      duration: 0.85,
      ease: "back.out(1.5)",
      overwrite: "auto",
    });

    // Trigger shockwave ring
    setShockwaveKey((prev) => prev + 1);
  }, [themeIndex]);

  // Subtle 3D mouse parallax on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cubeRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseTiltRef.current = { x: -y * 22, y: x * 22 };

    const target = FACE_ROTATIONS[themeIndex] || FACE_ROTATIONS[0];
    gsap.to(cubeRef.current, {
      rotateX: target.rx + mouseTiltRef.current.x,
      rotateY: target.ry + mouseTiltRef.current.y,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cubeRef.current) return;
    const target = FACE_ROTATIONS[themeIndex] || FACE_ROTATIONS[0];
    gsap.to(cubeRef.current, {
      rotateX: target.rx,
      rotateY: target.ry,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    cycleTheme();
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-[9990] flex flex-col items-center select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Shockwave expanding ring visual effect on theme rotation */}
      {shockwaveKey > 0 && (
        <span
          key={shockwaveKey}
          className="absolute top-10 w-24 h-24 rounded-full pointer-events-none -translate-y-1/2 animate-ping opacity-60"
          style={{
            borderColor: activeTheme.primary,
            borderWidth: "2px",
            boxShadow: `0 0 25px ${activeTheme.primary}`,
          }}
        />
      )}

      {/* Cyberpunk HUD Frame & Tooltip */}
      <div
        className={`mb-2 px-2.5 py-1 rounded bg-[#07070a]/90 backdrop-blur-md border border-white/10 flex items-center gap-1.5 transition-all duration-300 ${
          isHovered ? "opacity-100 -translate-y-1" : "opacity-75 translate-y-0"
        }`}
        style={{
          borderColor: isHovered ? activeTheme.primary : "rgba(255,255,255,0.1)",
          boxShadow: isHovered ? `0 0 15px ${activeTheme.glow}` : "none",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: activeTheme.primary, boxShadow: `0 0 8px ${activeTheme.primary}` }}
        />
        <span className="font-mono text-[10px] tracking-wider text-val-light uppercase">
          {activeTheme.code}
        </span>
        <RefreshCw
          className={`w-2.5 h-2.5 ml-0.5 text-val-gray transition-transform duration-500 ${
            isHovered ? "rotate-180 text-val-light" : ""
          }`}
        />
      </div>

      {/* 3D Cube Viewport Container */}
      <div
        onClick={handleClick}
        className={`cube-viewport relative w-[70px] h-[70px] flex items-center justify-center cursor-pointer transition-transform duration-200 ${
          isPressed ? "scale-90" : isHovered ? "scale-105" : "scale-100"
        }`}
        title="Click to rotate core & change website theme"
        role="button"
        aria-label="Rotate theme cube"
      >
        {/* Ambient Ground Glow beneath the cube */}
        <div
          className="absolute -bottom-2 w-14 h-3.5 rounded-full blur-md opacity-70 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: activeTheme.primary }}
        />

        {/* The 3D Cube */}
        <div
          ref={cubeRef}
          className="cube-3d relative w-[60px] h-[60px]"
          style={{ willChange: "transform" }}
        >
          {/* Internal Glowing Power Core (Suspended inside the 3D cube) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full blur-[2px] animate-pulse pointer-events-none"
            style={{
              backgroundColor: activeTheme.primary,
              boxShadow: `0 0 16px ${activeTheme.primary}, 0 0 28px ${activeTheme.primary}`,
            }}
          />

          {/* Face 0: Front (Crimson Protocol) */}
          <div
            className="cube-face cube-face-front rounded-lg bg-[#0c0d14] border flex flex-col items-center justify-center p-1.5 overflow-hidden transition-colors duration-300"
            style={{
              borderColor: THEMES[0].primary,
              boxShadow: `inset 0 0 16px ${THEMES[0].glow}, 0 0 10px ${THEMES[0].glow}`,
            }}
          >
            <div className="absolute top-1 left-1.5 text-[8px] font-mono font-bold" style={{ color: THEMES[0].primary }}>01</div>
            <div className="text-sm font-black font-display tracking-tight text-white drop-shadow-[0_0_8px_rgba(244,59,134,0.9)]">
              CRMSN
            </div>
            <div className="mt-1 w-7 h-[2px] rounded-full" style={{ backgroundColor: THEMES[0].primary }} />
            <div className="absolute bottom-1 right-1.5 text-[7px] font-mono text-white/50">SYS</div>
          </div>

          {/* Face 1: Right (Hyperdrive Cyan) */}
          <div
            className="cube-face cube-face-right rounded-lg bg-[#0c0d14] border flex flex-col items-center justify-center p-1.5 overflow-hidden transition-colors duration-300"
            style={{
              borderColor: THEMES[1].primary,
              boxShadow: `inset 0 0 16px ${THEMES[1].glow}, 0 0 10px ${THEMES[1].glow}`,
            }}
          >
            <div className="absolute top-1 left-1.5 text-[8px] font-mono font-bold" style={{ color: THEMES[1].primary }}>02</div>
            <div className="text-sm font-black font-display tracking-tight text-white drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]">
              CYAN
            </div>
            <div className="mt-1 w-7 h-[2px] rounded-full" style={{ backgroundColor: THEMES[1].primary }} />
            <div className="absolute bottom-1 right-1.5 text-[7px] font-mono text-white/50">HYPR</div>
          </div>

          {/* Face 2: Back (Matrix Emerald) */}
          <div
            className="cube-face cube-face-back rounded-lg bg-[#0c0d14] border flex flex-col items-center justify-center p-1.5 overflow-hidden transition-colors duration-300"
            style={{
              borderColor: THEMES[2].primary,
              boxShadow: `inset 0 0 16px ${THEMES[2].glow}, 0 0 10px ${THEMES[2].glow}`,
            }}
          >
            <div className="absolute top-1 left-1.5 text-[8px] font-mono font-bold" style={{ color: THEMES[2].primary }}>03</div>
            <div className="text-sm font-black font-display tracking-tight text-white drop-shadow-[0_0_8px_rgba(0,255,136,0.9)]">
              EMRLD
            </div>
            <div className="mt-1 w-7 h-[2px] rounded-full" style={{ backgroundColor: THEMES[2].primary }} />
            <div className="absolute bottom-1 right-1.5 text-[7px] font-mono text-white/50">MTRX</div>
          </div>

          {/* Face 3: Left (Solar Flare) */}
          <div
            className="cube-face cube-face-left rounded-lg bg-[#0c0d14] border flex flex-col items-center justify-center p-1.5 overflow-hidden transition-colors duration-300"
            style={{
              borderColor: THEMES[3].primary,
              boxShadow: `inset 0 0 16px ${THEMES[3].glow}, 0 0 10px ${THEMES[3].glow}`,
            }}
          >
            <div className="absolute top-1 left-1.5 text-[8px] font-mono font-bold" style={{ color: THEMES[3].primary }}>04</div>
            <div className="text-sm font-black font-display tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,184,0,0.9)]">
              SOLAR
            </div>
            <div className="mt-1 w-7 h-[2px] rounded-full" style={{ backgroundColor: THEMES[3].primary }} />
            <div className="absolute bottom-1 right-1.5 text-[7px] font-mono text-white/50">FLRE</div>
          </div>

          {/* Face 4: Top (Abyssal Violet) */}
          <div
            className="cube-face cube-face-top rounded-lg bg-[#0c0d14] border flex flex-col items-center justify-center p-1.5 overflow-hidden transition-colors duration-300"
            style={{
              borderColor: THEMES[4].primary,
              boxShadow: `inset 0 0 16px ${THEMES[4].glow}, 0 0 10px ${THEMES[4].glow}`,
            }}
          >
            <div className="absolute top-1 left-1.5 text-[8px] font-mono font-bold" style={{ color: THEMES[4].primary }}>05</div>
            <div className="text-sm font-black font-display tracking-tight text-white drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]">
              VIOLET
            </div>
            <div className="mt-1 w-7 h-[2px] rounded-full" style={{ backgroundColor: THEMES[4].primary }} />
            <div className="absolute bottom-1 right-1.5 text-[7px] font-mono text-white/50">NOVA</div>
          </div>

          {/* Face 5: Bottom (Plasma Blaze) */}
          <div
            className="cube-face cube-face-bottom rounded-lg bg-[#0c0d14] border flex flex-col items-center justify-center p-1.5 overflow-hidden transition-colors duration-300"
            style={{
              borderColor: THEMES[5].primary,
              boxShadow: `inset 0 0 16px ${THEMES[5].glow}, 0 0 10px ${THEMES[5].glow}`,
            }}
          >
            <div className="absolute top-1 left-1.5 text-[8px] font-mono font-bold" style={{ color: THEMES[5].primary }}>06</div>
            <div className="text-sm font-black font-display tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,94,54,0.9)]">
              PLSMA
            </div>
            <div className="mt-1 w-7 h-[2px] rounded-full" style={{ backgroundColor: THEMES[5].primary }} />
            <div className="absolute bottom-1 right-1.5 text-[7px] font-mono text-white/50">CORE</div>
          </div>
        </div>
      </div>

      {/* Micro-interaction prompt badge below cube */}
      <div className="mt-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Sparkles className="w-2.5 h-2.5 text-val-light/60" />
        <span className="font-mono text-[9px] tracking-widest text-val-light/70 uppercase">
          CLICK TO ROTATE
        </span>
      </div>
    </div>
  );
};

export default InteractiveThemeCube;
