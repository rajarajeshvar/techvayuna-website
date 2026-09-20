"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Terminal, Cpu, Users, Trophy, Zap } from "lucide-react";
import InfiniteSpiral from "./ui/InfiniteSpiral";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Tech & Innovation images for the InfiniteSpiral 3D Stage
const SPIRAL_IMAGES = [
  { src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80", alt: "Matrix Cyber Code" },
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80", alt: "Abstract Neon Glow" },
  { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80", alt: "Retro Tech Setup" },
  { src: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80", alt: "Cyberpunk Visuals" },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", alt: "Microchip Hardware" },
  { src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80", alt: "Futuristic Workstation" },
  { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", alt: "Hackathon Developers" },
  { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80", alt: "Esports Arena" },
];

// Content lines for the typewriter sequence
const INTRO_LINE = "Technology is constantly evolving. Ideas become innovations, and innovators become leaders.";

const BODY_LINES = [
  "At Tech Vayuna, we believe every breakthrough begins with curiosity. We are a community of creators, developers, designers, engineers, and problem-solvers united by one purpose—to learn, build, and shape the future through technology.",
  "From hackathons and workshops to real-world projects and cutting-edge innovation, every challenge is an opportunity to rise.",
];

const CLOSING_LINES = [
  "This is where ideas take flight.",
  "This is Tech Vayuna.",
];

export const PanelReveal: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const ctx = gsap.context(() => {
      const introChars = container.querySelectorAll(".tw-intro");
      const bodyLineEls = container.querySelectorAll(".tw-body-line");
      const closingLineEls = container.querySelectorAll(".tw-closing-line");
      const closingCharsAll = container.querySelectorAll(".tw-closing");
      const statsEls = container.querySelectorAll(".stat-box");
      const cursor = container.querySelector(".tw-cursor");

      // Typewriter sequence triggered smoothly on scroll
      const typewriterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // a) Typewrite the intro line
      typewriterTl.to(introChars, {
        opacity: 1,
        duration: 0.015,
        stagger: 0.012,
        ease: "none",
      });

      // b) Reveal body paragraphs with a fade-slide
      typewriterTl.fromTo(
        bodyLineEls,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.35,
          ease: "power3.out",
        },
        "+=0.15"
      );

      // c) Typewrite closing lines
      typewriterTl.to(
        closingCharsAll,
        {
          opacity: 1,
          duration: 0.02,
          stagger: 0.025,
          ease: "none",
        },
        "+=0.2"
      );

      // d) Glow sweep on closing lines
      typewriterTl.to(
        closingLineEls,
        {
          textShadow: "0 0 20px rgba(244, 59, 134, 0.6), 0 0 50px rgba(97, 0, 148, 0.25)",
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // e) Reveal statistics cards
      typewriterTl.fromTo(
        statsEls,
        { opacity: 0, y: 15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        "-=0.2"
      );

      // f) Fade cursor
      typewriterTl.to(cursor, { opacity: 0, duration: 0.05 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="introduction"
      ref={sectionRef}
      className="relative w-full min-h-screen py-16 md:py-24 flex items-center justify-center overflow-hidden bg-transparent select-none"
    >
      {/* Ambient Radial Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#f43b86]/8 blur-[160px]" />
        <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ff5e36]/8 blur-[160px]" />
      </div>

      {/* Fully Responsive Grid Container (Fits 100% Zoom, Mobile, Tablet, PC) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: 3D Infinite Spiral Stage */}
        <div className="lg:col-span-6 w-full h-[420px] sm:h-[500px] lg:h-[560px] relative overflow-hidden flex items-center justify-center rounded-2xl bg-val-bg-card/30 border border-val-light/10 backdrop-blur-sm shadow-2xl">
          {/* Floating HUD Indicators */}
          <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-val-bg-card/80 border border-[#ff5e36]/30 backdrop-blur-md rounded-full text-[9px] font-mono text-val-light tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e36] animate-ping" />
            [ 3D_SPIRAL // 8_NODES ]
          </div>
          <div className="absolute bottom-3 right-3 z-20 px-3 py-1 bg-val-bg-card/80 border border-[#f43b86]/30 backdrop-blur-md rounded-full text-[9px] font-mono text-[#f43b86] tracking-widest uppercase animate-pulse">
            SCROLL_OR_DRAG_TO_ROTATE
          </div>

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

        {/* Right Column: Typewriter Introduction Text & Telemetry Metrics */}
        <div
          ref={containerRef}
          className="lg:col-span-6 w-full flex flex-col items-start text-left min-w-0"
        >
          {/* Section tag */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#ff5e36]/10 text-brand-orange border border-brand-orange/30 tracking-widest uppercase">
              SEC_01
            </span>
            <span className="text-[10px] font-mono tracking-[0.25em] text-val-gray/60 uppercase flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#f43b86]" />
              // ABOUT_TECH_VAYUNA
            </span>
          </div>

          {/* Intro line — word-wrapped typewriter */}
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-val-light leading-relaxed mb-4 tracking-tight font-display max-w-full break-words">
            {INTRO_LINE.split(" ").map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
                {word.split("").map((char, cIdx) => (
                  <span key={cIdx} className="tw-intro inline opacity-0">
                    {char}
                  </span>
                ))}
              </span>
            ))}
            <span className="tw-cursor inline-block font-mono text-brand-pink animate-pulse ml-0.5">_</span>
          </p>

          {/* Body paragraphs — fade-slide reveal */}
          <div className="space-y-3.5 mb-6 max-w-full">
            {BODY_LINES.map((line, i) => (
              <p
                key={i}
                className="tw-body-line text-xs sm:text-sm text-val-gray leading-relaxed opacity-0 break-words"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Separator */}
          <div className="w-16 h-px bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple mb-5 opacity-60" />

          {/* Closing lines — typewriter with glow */}
          <div className="space-y-1.5 mb-6 max-w-full">
            {CLOSING_LINES.map((line, li) => (
              <p
                key={li}
                className="tw-closing-line text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-val-light leading-tight font-display break-words"
              >
                {line.split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
                    {word.split("").map((char, cIdx) => (
                      <span key={cIdx} className="tw-closing inline opacity-0">
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            ))}
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full pt-5 border-t border-val-light/10">
            <div className="stat-box p-3 rounded-xl bg-val-bg-card/60 border border-val-light/10 backdrop-blur-md hover:border-[#ff5e36]/40 transition-colors">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Users className="w-3.5 h-3.5 text-[#ff5e36]" />
                <span className="text-lg font-black font-display text-gradient-brand">500+</span>
              </div>
              <div className="text-[9px] font-mono text-val-gray/70 uppercase tracking-wider">Innovators</div>
            </div>

            <div className="stat-box p-3 rounded-xl bg-val-bg-card/60 border border-val-light/10 backdrop-blur-md hover:border-[#f43b86]/40 transition-colors">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Trophy className="w-3.5 h-3.5 text-[#f43b86]" />
                <span className="text-lg font-black font-display text-gradient-brand">50+</span>
              </div>
              <div className="text-[9px] font-mono text-val-gray/70 uppercase tracking-wider">Hackathons</div>
            </div>

            <div className="stat-box p-3 rounded-xl bg-val-bg-card/60 border border-val-light/10 backdrop-blur-md hover:border-[#ff5e36]/40 transition-colors">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Zap className="w-3.5 h-3.5 text-[#ff5e36]" />
                <span className="text-lg font-black font-display text-gradient-brand">100%</span>
              </div>
              <div className="text-[9px] font-mono text-val-gray/70 uppercase tracking-wider">Student-Led</div>
            </div>

            <div className="stat-box p-3 rounded-xl bg-val-bg-card/60 border border-val-light/10 backdrop-blur-md hover:border-[#f43b86]/40 transition-colors">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Cpu className="w-3.5 h-3.5 text-[#f43b86]" />
                <span className="text-lg font-black font-display text-gradient-brand">24/7</span>
              </div>
              <div className="text-[9px] font-mono text-val-gray/70 uppercase tracking-wider">R&D Labs</div>
            </div>
          </div>

          {/* Decorative footer mark */}
          <div className="mt-5 font-mono text-[9px] text-val-gray/30 tracking-[0.3em]">
            [ STATE_VERIFIED // VAYUNA_CORE ]
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
