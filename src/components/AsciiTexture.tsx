"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ASCII characters used for the texture pattern
const ASCII_CHARS = "01xX*#@.:;+=~-|/\\<>{}[]()&%$!?";

/**
 * AsciiTexture — A lightweight fixed-position ASCII character texture
 * overlay that sits between the 3D background and page content.
 * 
 * Uses a canvas to render a grid of ASCII characters in a purplish hue,
 * then tiles it as a CSS background. Slow drift animation. Opacity is
 * driven per-section via GSAP ScrollTrigger for smooth fade transitions.
 */
export const AsciiTexture: React.FC = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const buildTexture = useCallback(() => {
    const canvas = document.createElement("canvas");
    const cellSize = 14;
    const cols = 36;
    const rows = 36;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `500 ${cellSize - 2}px "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Random character
        const char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
        // Vary opacity per character for subtle organic feel (purplish hue: #88207C / rgb(136, 32, 124))
        const alpha = 0.12 + Math.random() * 0.18;
        ctx.fillStyle = `rgba(136, 32, 124, ${alpha})`;
        ctx.fillText(
          char,
          col * cellSize + cellSize / 2,
          row * cellSize + cellSize / 2
        );
      }
    }

    canvasRef.current = canvas;
    return canvas;
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const canvas = buildTexture();
    if (!canvas) return;

    // Set as tiling background
    overlay.style.backgroundImage = `url(${canvas.toDataURL()})`;
    overlay.style.backgroundRepeat = "repeat";
    overlay.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;

    // Sections where ASCII should be hidden (text heavy typewriter / image fly-in / domain cards)
    const hideSections = ["#introduction", "#domains"];
    const triggers: ScrollTrigger[] = [];

    // Subtle target opacity when active (low opacity, purplish vibe, non-intrusive)
    const TARGET_OPACITY = 0.28;

    hideSections.forEach((selector) => {
      const el = document.querySelector(selector);
      if (!el) return;

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
          onUpdate: (self) => {
            overlay.style.opacity = String((1 - self.progress) * TARGET_OPACITY);
          },
        })
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 30%",
          end: "bottom 70%",
          onEnter: () => {
            overlay.style.opacity = "0";
          },
          onLeaveBack: () => {
            overlay.style.opacity = String(TARGET_OPACITY);
          },
        })
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "bottom 70%",
          end: "bottom 20%",
          scrub: true,
          onUpdate: (self) => {
            overlay.style.opacity = String(self.progress * TARGET_OPACITY);
          },
        })
      );
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [buildTexture]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none select-none transition-opacity duration-300"
      style={{
        zIndex: -9996, // Above 3D bg canvas (-9999) & veil (-9998), beneath main content
        opacity: 0.28,
        // Very slow drift animation
        animation: "asciiDrift 140s linear infinite",
      }}
      aria-hidden="true"
    />
  );
};
