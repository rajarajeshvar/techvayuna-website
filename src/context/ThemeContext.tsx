"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface ThemeConfig {
  id: string;
  name: string;
  code: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  glowRgb: string;
  bgTint: string;
  gridDot: string;
  faceLabel: string;
  audioFreq: number;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "crimson",
    name: "CRIMSON PROTOCOL",
    code: "01 // CRMSN",
    primary: "#f43b86",
    secondary: "#ff5e36",
    accent: "#610094",
    glow: "rgba(244, 59, 134, 0.45)",
    glowRgb: "244, 59, 134",
    bgTint: "rgba(244, 59, 134, 0.06)",
    gridDot: "rgba(244, 59, 134, 0.22)",
    faceLabel: "01",
    audioFreq: 523.25, // C5
  },
  {
    id: "cyan",
    name: "HYPERDRIVE CYAN",
    code: "02 // CYAN",
    primary: "#00f0ff",
    secondary: "#0070f3",
    accent: "#002b5b",
    glow: "rgba(0, 240, 255, 0.45)",
    glowRgb: "0, 240, 255",
    bgTint: "rgba(0, 240, 255, 0.06)",
    gridDot: "rgba(0, 240, 255, 0.22)",
    faceLabel: "02",
    audioFreq: 659.25, // E5
  },
  {
    id: "emerald",
    name: "MATRIX EMERALD",
    code: "03 // EMRLD",
    primary: "#00ff88",
    secondary: "#059669",
    accent: "#064e3b",
    glow: "rgba(0, 255, 136, 0.45)",
    glowRgb: "0, 255, 136",
    bgTint: "rgba(0, 255, 136, 0.06)",
    gridDot: "rgba(0, 255, 136, 0.22)",
    faceLabel: "03",
    audioFreq: 783.99, // G5
  },
  {
    id: "gold",
    name: "SOLAR FLARE",
    code: "04 // SOLAR",
    primary: "#ffb800",
    secondary: "#ff5e36",
    accent: "#78350f",
    glow: "rgba(255, 184, 0, 0.45)",
    glowRgb: "255, 184, 0",
    bgTint: "rgba(255, 184, 0, 0.06)",
    gridDot: "rgba(255, 184, 0, 0.22)",
    faceLabel: "04",
    audioFreq: 880.0, // A5
  },
  {
    id: "violet",
    name: "ABYSSAL VIOLET",
    code: "05 // VIOLET",
    primary: "#c084fc",
    secondary: "#a855f7",
    accent: "#3b0764",
    glow: "rgba(192, 132, 252, 0.45)",
    glowRgb: "192, 132, 252",
    bgTint: "rgba(192, 132, 252, 0.06)",
    gridDot: "rgba(192, 132, 252, 0.22)",
    faceLabel: "05",
    audioFreq: 987.77, // B5
  },
  {
    id: "orange",
    name: "PLASMA BLAZE",
    code: "06 // PLSMA",
    primary: "#ff5e36",
    secondary: "#ff2a00",
    accent: "#450a0a",
    glow: "rgba(255, 94, 54, 0.45)",
    glowRgb: "255, 94, 54",
    bgTint: "rgba(255, 94, 54, 0.06)",
    gridDot: "rgba(255, 94, 54, 0.22)",
    faceLabel: "06",
    audioFreq: 1046.5, // C6
  },
];

interface ThemeContextType {
  activeTheme: ThemeConfig;
  themeIndex: number;
  setThemeByIndex: (index: number) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: THEMES[0],
  themeIndex: 0,
  setThemeByIndex: () => {},
  cycleTheme: () => {},
});

// Synthesize a brief sci-fi frequency chime without any audio files
function playThemeChime(freq: number) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch {
    // AudioContext autoplay restrictions are harmlessly ignored
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeIndex, setThemeIndex] = useState<number>(0);

  const applyThemeToDOM = useCallback((theme: ThemeConfig) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.setAttribute("data-theme", theme.id);
    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-secondary", theme.secondary);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-glow", theme.glow);
    root.style.setProperty("--theme-glow-rgb", theme.glowRgb);
    root.style.setProperty("--theme-bg-tint", theme.bgTint);
    root.style.setProperty("--theme-grid-dot", theme.gridDot);

    // Synchronize Tailwind palette variables to ensure instant dynamic reaction
    root.style.setProperty("--color-val-red", theme.primary);
    root.style.setProperty("--color-brand-pink", theme.primary);
    root.style.setProperty("--color-brand-orange", theme.secondary);
    root.style.setProperty("--color-val-blue", theme.secondary);
    root.style.setProperty("--color-brand-purple", theme.accent);
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tv_theme_index");
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < THEMES.length) {
          setThemeIndex(parsed);
          applyThemeToDOM(THEMES[parsed]);
          return;
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    applyThemeToDOM(THEMES[0]);
  }, [applyThemeToDOM]);

  const setThemeByIndex = useCallback(
    (index: number) => {
      const safeIndex = (index % THEMES.length + THEMES.length) % THEMES.length;
      setThemeIndex(safeIndex);
      const targetTheme = THEMES[safeIndex];
      applyThemeToDOM(targetTheme);
      playThemeChime(targetTheme.audioFreq);
      try {
        localStorage.setItem("tv_theme_index", safeIndex.toString());
      } catch {
        // Ignore
      }
    },
    [applyThemeToDOM]
  );

  const cycleTheme = useCallback(() => {
    setThemeByIndex(themeIndex + 1);
  }, [themeIndex, setThemeByIndex]);

  return (
    <ThemeContext.Provider
      value={{
        activeTheme: THEMES[themeIndex],
        themeIndex,
        setThemeByIndex,
        cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
