"use client";

import React, { useMemo } from "react";
import { CanvasFractalGrid } from "./ui/canvas-fractal-grid";
import { useTheme } from "@/context/ThemeContext";

export function CanvasFractalGridExample() {
  const { activeTheme } = useTheme();

  const gradients = useMemo(() => {
    const rgb = activeTheme.glowRgb;
    return [
      {
        stops: [
          { color: `rgba(${rgb}, 0.35)`, position: 0 },
          { color: `rgba(${rgb}, 0.20)`, position: 30 },
          { color: `rgba(${rgb}, 0.08)`, position: 60 },
          { color: "transparent", position: 80 },
        ],
        centerX: 25,
        centerY: 65,
      },
      {
        stops: [
          { color: `rgba(${rgb}, 0.30)`, position: 0 },
          { color: `rgba(${rgb}, 0.16)`, position: 35 },
          { color: `rgba(${rgb}, 0.06)`, position: 65 },
          { color: "transparent", position: 80 },
        ],
        centerX: 75,
        centerY: 35,
      },
      {
        stops: [
          { color: `rgba(${rgb}, 0.25)`, position: 0 },
          { color: `rgba(${rgb}, 0.12)`, position: 40 },
          { color: "transparent", position: 75 },
        ],
        centerX: 50,
        centerY: 50,
      },
    ];
  }, [activeTheme.glowRgb]);

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 transition-opacity duration-700">
      <CanvasFractalGrid
        dotSize={4}
        dotSpacing={26}
        dotOpacity={0.25}
        gradientAnimationDuration={8}
        waveIntensity={30}
        waveRadius={220}
        dotColor={activeTheme.gridDot}
        glowColor={activeTheme.glow}
        enableNoise={true}
        noiseOpacity={0.02}
        enableMouseGlow={true}
        initialPerformance="high"
        gradients={gradients}
      />
    </div>
  );
}

export default CanvasFractalGridExample;
