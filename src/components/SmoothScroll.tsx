"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis with snappy, responsive glide
    const lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // 2. Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Sync GSAP ticker with Lenis raf with named callback for clean teardown
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    
    // 4. Enable GSAP lag smoothing to absorb frame stutters smoothly
    gsap.ticker.lagSmoothing(500, 33);

    // 5. Global Parallax Engine setup
    const parallaxElements = document.querySelectorAll("[data-speed]");
    
    const ctx = gsap.context(() => {
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-speed") || "0");
        if (speed === 0) return;
        
        // Element moves slower or faster depending on speed factor
        gsap.to(el, {
          yPercent: -30 * speed, // Adjust multiplier for strength of effect
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2, // Smoother scrub follow
          }
        });
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
