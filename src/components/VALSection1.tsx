"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AccordionText } from "./AccordionText";
import { Activity, ShieldCheck, Cpu } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const VALSection1: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);
  const fgContentRef = useRef<HTMLDivElement>(null);
  const sideCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Pin the parent section during the scroll reveal
      ScrollTrigger.create({
        trigger: section,
        start: "top top", // pin when top reaches top of viewport
        end: "+=100%", // pin for 100% of viewport height scroll
        pin: true,
        scrub: true,
      });

      // Background text parallax
      gsap.fromTo(
        bgTextRef.current,
        { y: 60 },
        {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 1,
          },
        }
      );

      // Background grid lines parallax
      gsap.fromTo(
        bgGridRef.current,
        { y: -40 },
        {
          y: 40,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 1.5,
          },
        }
      );

      // Foreground content parallax (subtle vertical shift during pin)
      gsap.fromTo(
        fgContentRef.current,
        { y: 40 },
        {
          y: -40,
          ease: "power1.out",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 0.8,
          },
        }
      );

      // 2. Client Side Reveal for Side Details card (fade & slide once when pinning starts)
      gsap.fromTo(
        sideCardRef.current,
        {
          opacity: 0,
          x: 40,
          rotateY: 20,
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            toggleActions: "play none none none",
          },
        }
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="reveal"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-val-bg py-32 px-6 md:px-12 xl:px-24"
    >
      {/* 1. Background Layer (Deepest) */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />
      
      {/* 2. Parallax Background Grid Lines */}
      <div 
        ref={bgGridRef}
        className="absolute inset-0 flex items-center justify-between px-16 pointer-events-none opacity-20"
      >
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-val-light/30 to-transparent" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-val-red/30 to-transparent" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-val-light/30 to-transparent" />
      </div>

      {/* 3. Parallax Giant Outlined Text */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        style={{ perspective: "1000px" }}
      >
        <span 
          className="text-[20vw] font-black uppercase text-transparent tracking-widest leading-none block font-display opacity-15"
          style={{
            WebkitTextStroke: "1.5px rgba(236, 232, 225, 0.15)",
          }}
        >
          SECTOR_01
        </span>
      </div>

      {/* Diagonal Warning Stripe Detail */}
      <div className="absolute top-0 right-0 w-[500px] h-[8px] bg-gradient-to-l from-val-red via-transparent to-transparent -rotate-12 transform translate-x-44 translate-y-16 opacity-30 pointer-events-none" />

      {/* 4. Foreground Content (Animated via GSAP and ScrollTrigger) */}
      <div 
        ref={fgContentRef}
        className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        {/* Left Column: Big Bold Text Reveal */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <AccordionText
            text={"WE CRASH\nTHE LIMITS\nOF REALITY"}
            tag="TV_INIT"
            subtitle="PROTOCOL // ACCORDION_10_FOLD"
            glow="red"
            foldsCount={10}
          />
        </div>

        {/* Right Column: Premium Stencil Card & Metrics */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div
            ref={sideCardRef}
            className="w-full max-w-sm bg-val-bg-card/70 border border-val-light/10 hover:border-val-red/30 transition-colors duration-500 p-6 clip-corner backdrop-blur-md relative transform-style-3d group"
          >
            {/* Top red bar indicator */}
            <div className="absolute top-0 left-0 w-2/3 h-[2px] bg-val-red" />
            <div className="absolute top-0 right-0 w-1/4 h-[2px] bg-val-blue" />

            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-val-gray tracking-widest uppercase">MODULE // 01_SPECS</span>
              <Cpu className="w-4 h-4 text-val-red animate-pulse" />
            </div>

            <h3 className="text-xl font-bold uppercase tracking-tight text-val-light font-display mb-2">
              MECHANICAL UNFOLDING
            </h3>

            <p className="text-xs text-val-gray font-mono leading-relaxed mb-6">
              This animation uses 3D GSAP transforms coupled with CSS perspective. The lines rotate on the X-axis from a collapsed state, replicating a geometric fold-out.
            </p>

            {/* Diagnostic stats */}
            <div className="space-y-3 font-mono border-t border-val-light/10 pt-4">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-val-gray flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-val-red" />
                  EASE TYPE
                </span>
                <span className="text-val-light font-bold">POWER4.OUT</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-val-gray flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-val-blue" />
                  PERSPECTIVE
                </span>
                <span className="text-val-light font-bold">1000PX</span>
              </div>
            </div>

            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-val-red/0 via-val-red/5 to-val-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none clip-corner" />
          </div>
        </div>
      </div>

      {/* Decorative Corner Borders */}
      <div className="absolute bottom-12 left-12 w-6 h-6 border-b-2 border-l-2 border-val-light/20" />
      <div className="absolute bottom-12 right-12 w-6 h-6 border-b-2 border-r-2 border-val-light/20" />
    </section>
  );
};
