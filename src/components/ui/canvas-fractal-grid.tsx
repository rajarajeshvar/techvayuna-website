"use client";

import React, { useEffect, useRef } from "react";

export interface GradientStop {
  color: string;
  position: number; // 0 to 100
}

export interface GradientConfig {
  stops: GradientStop[];
  centerX: number; // percentage 0 to 100
  centerY: number; // percentage 0 to 100
}

export interface CanvasFractalGridProps {
  dotSize?: number;
  dotSpacing?: number;
  dotOpacity?: number;
  gradientAnimationDuration?: number;
  waveIntensity?: number;
  waveRadius?: number;
  dotColor?: string;
  glowColor?: string;
  enableNoise?: boolean;
  noiseOpacity?: number;
  enableMouseGlow?: boolean;
  initialPerformance?: "low" | "medium" | "high";
  gradients?: GradientConfig[];
  className?: string;
}

export const CanvasFractalGrid: React.FC<CanvasFractalGridProps> = ({
  dotSize = 4,
  dotSpacing = 24,
  dotOpacity = 0.8,
  gradientAnimationDuration = 5,
  waveIntensity = 30,
  waveRadius = 250,
  dotColor = "rgba(255, 60, 60, 0.25)",
  glowColor = "rgba(255, 94, 54, 0.9)",
  enableNoise = true,
  noiseOpacity = 0.05,
  enableMouseGlow = true,
  gradients = [
    {
      stops: [
        { color: "#ff2a2a", position: 0 },
        { color: "#d32f2f", position: 25 },
        { color: "#ff5e36", position: 50 },
        { color: "transparent", position: 75 },
      ],
      centerX: 30,
      centerY: 70,
    },
    {
      stops: [
        { color: "#e50914", position: 0 },
        { color: "#b71c1c", position: 25 },
        { color: "#ff1744", position: 50 },
        { color: "transparent", position: 75 },
      ],
      centerX: 70,
      centerY: 30,
    },
  ],
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let startTime = performance.now();

    // Noise canvas caching for high performance
    let noiseCanvas: HTMLCanvasElement | null = null;
    if (enableNoise) {
      noiseCanvas = document.createElement("canvas");
      noiseCanvas.width = 128;
      noiseCanvas.height = 128;
      const nCtx = noiseCanvas.getContext("2d");
      if (nCtx) {
        const imgData = nCtx.createImageData(128, 128);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = Math.floor(Math.random() * 255);
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          data[i + 3] = Math.floor(noiseOpacity * 255);
        }
        nCtx.putImageData(imgData, 0, 0);
      }
    }

    const handleResize = () => {
      const parent = containerRef.current || canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Main render loop
    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      // 1. Draw animated radial background gradients
      gradients.forEach((grad, index) => {
        const cycle = (elapsed / Math.max(0.1, gradientAnimationDuration)) * Math.PI * 2;
        const offsetX = Math.sin(cycle + index) * 5; // gentle orbit
        const offsetY = Math.cos(cycle * 0.8 + index) * 5;

        const cx = (grad.centerX + offsetX) * 0.01 * width;
        const cy = (grad.centerY + offsetY) * 0.01 * height;
        const radius = Math.max(width, height) * 0.55;

        const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.stops.forEach((stop) => {
          radial.addColorStop(Math.min(1, Math.max(0, stop.position / 100)), stop.color);
        });

        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      });

      // 2. Mouse glow spotlight if enabled
      if (enableMouseGlow && mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const mouseGlow = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          waveRadius * 1.2
        );
        mouseGlow.addColorStop(0, glowColor);
        mouseGlow.addColorStop(0.5, "rgba(255, 60, 60, 0.15)");
        mouseGlow.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Render grid dots with wave displacement
      const cols = Math.ceil(width / dotSpacing) + 2;
      const rows = Math.ceil(height / dotSpacing) + 2;

      ctx.fillStyle = dotColor;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          let baseX = c * dotSpacing;
          let baseY = r * dotSpacing;

          // Calculate distance to mouse
          const dx = baseX - mouseRef.current.x;
          const dy = baseY - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let offsetX = 0;
          let offsetY = 0;
          let currentDotSize = dotSize;
          let alphaMultiplier = 1;

          if (dist < waveRadius) {
            const factor = 1 - dist / waveRadius;
            const wave = Math.sin(dist * 0.04 - elapsed * 4) * waveIntensity * factor;

            // Displace dots radially from mouse cursor
            const angle = Math.atan2(dy, dx);
            offsetX = Math.cos(angle) * wave;
            offsetY = Math.sin(angle) * wave;

            currentDotSize += factor * 2.5;
            alphaMultiplier += factor * 1.5;
          }

          // Subtle global wave ambient movement
          const ambientWave = Math.sin(baseX * 0.01 + baseY * 0.01 + elapsed * 1.5) * 1.5;
          const posX = baseX + offsetX + ambientWave;
          const posY = baseY + offsetY + ambientWave;

          ctx.beginPath();
          ctx.arc(posX, posY, Math.max(0.5, currentDotSize / 2), 0, Math.PI * 2);
          ctx.globalAlpha = Math.min(1, dotOpacity * alphaMultiplier);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      // 4. Render noise texture overlay
      if (enableNoise && noiseCanvas) {
        const pattern = ctx.createPattern(noiseCanvas, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, width, height);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    dotSize,
    dotSpacing,
    dotOpacity,
    gradientAnimationDuration,
    waveIntensity,
    waveRadius,
    dotColor,
    glowColor,
    enableNoise,
    noiseOpacity,
    enableMouseGlow,
    gradients,
  ]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block absolute inset-0 pointer-events-none w-full h-full" />
    </div>
  );
};
