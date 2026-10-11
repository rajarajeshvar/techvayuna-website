"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfiniteSpiral from "./ui/InfiniteSpiral";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Community & Event images for the InfiniteSpiral 3D Stage from spiral folder
const SPIRAL_IMAGES = [
  { src: "/images/spiral/spiral-1.jpeg", alt: "TechVayuna Event & Community 1" },
  { src: "/images/spiral/spiral-2.jpeg", alt: "TechVayuna Event & Community 2" },
  { src: "/images/spiral/spiral-3.jpeg", alt: "TechVayuna Event & Community 3" },
  { src: "/images/spiral/spiral-4.jpeg", alt: "TechVayuna Event & Community 4" },
  { src: "/images/spiral/spiral-1.jpeg", alt: "TechVayuna Event & Community 1" },
  { src: "/images/spiral/spiral-2.jpeg", alt: "TechVayuna Event & Community 2" },
  { src: "/images/spiral/spiral-3.jpeg", alt: "TechVayuna Event & Community 3" },
  { src: "/images/spiral/spiral-4.jpeg", alt: "TechVayuna Event & Community 4" },
];

// Content lines for the typewriter sequence
const INTRO_LINE = "Founded in 2016 at SRMIST Ramapuram, TechVayuna is where raw ideas transform into real-world impact.";

const BODY_LINES = [
  "We are a multi-domain tech collective built for creators, coders, and innovators ready to push boundaries.",
  "Beyond building code and engineering solutions, we cultivate the leadership, vision, and adaptability essential for industry leaders. By fusing cutting-edge tech expertise with critical soft skills, we build not just great projects, but the next generation of tech leaders.",
];

const CLOSING_LINES = [
  "This is where ideas take flight.",
  "This is TechVayuna.",
];

export const PanelReveal: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const ctx = gsap.context(() => {
      const revealElements = container.querySelectorAll(".reveal-block");

      gsap.from(revealElements, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="introduction"
      ref={sectionRef}
      className="relative w-full min-h-screen py-16 md:py-24 flex items-center justify-center overflow-hidden bg-transparent select-none"
    >

      {/* Fully Responsive Grid Container (Fits 100% Zoom, Mobile, Tablet, PC) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: 3D Infinite Spiral Stage */}
        <div className="lg:col-span-6 w-full h-[420px] sm:h-[500px] lg:h-[560px] relative overflow-hidden flex items-center justify-center rounded-2xl bg-transparent">
          <InfiniteSpiral
            items={SPIRAL_IMAGES}
            animationMode="all"
            speed={0.55}
            radius={180}
            cardWidth={240}
            cardHeight={150}
            verticalSpacing={68}
            perspective={1000}
            cardRadius={14}
            centerScale={1.25}
            edgeBlur={3}
            cardsPerTurn={6}
            pauseOnHover
          />
        </div>

        {/* Right Column: Introduction Narrative */}
        <div
          ref={containerRef}
          className="lg:col-span-6 w-full flex flex-col items-start text-left min-w-0"
        >
          {/* Intro headline */}
          <p className="reveal-block text-xl sm:text-2xl lg:text-3xl font-bold font-editorial italic text-white leading-snug mb-5 tracking-tight max-w-full">
            {INTRO_LINE}
          </p>

          {/* Body paragraphs */}
          <div className="space-y-4 mb-6 max-w-full">
            {BODY_LINES.map((line, i) => (
              <p
                key={i}
                className="reveal-block text-sm sm:text-base text-[#e8e4ee] leading-relaxed break-words font-normal"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Separator */}
          <div className="reveal-block w-16 h-[2px] bg-gradient-to-r from-[#ff5e36] to-[#f43b86] mb-6" />

          {/* Closing punchlines */}
          <div className="space-y-1.5 mb-6 max-w-full">
            {CLOSING_LINES.map((line, li) => (
              <p
                key={li}
                className={`reveal-block text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight leading-tight break-words ${
                  li === 1
                    ? "font-editorial italic font-bold text-gradient-brand"
                    : "font-black font-display text-white"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Corner marks */}
      <div className="absolute top-16 left-8 w-6 h-6 border-t border-l border-val-light/5 hidden md:block" />
      <div className="absolute top-16 right-8 w-6 h-6 border-t border-r border-val-light/5 hidden md:block" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-val-light/5 hidden md:block" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-val-light/5 hidden md:block" />
    </section>
  );
};
