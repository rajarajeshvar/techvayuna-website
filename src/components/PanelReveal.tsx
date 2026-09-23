"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Terminal, Cpu, Users, Trophy, Zap } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Tech & Innovation images for the fly-through experience
const FLY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=75&auto=format",
    alt: "Matrix Cyber Code",
    // Starting trajectory & depth profile
    startX: -55,
    startY: -35,
    startRot: -18,
    endX: 60,
    endY: -45,
    endRot: 22,
    zIndex: 15,
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=75&auto=format",
    alt: "Abstract Neon Glow",
    startX: 65,
    startY: 20,
    startRot: 16,
    endX: -70,
    endY: 40,
    endRot: -20,
    zIndex: 14,
  },
  {
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=75&auto=format",
    alt: "Retro Tech Setup",
    startX: -60,
    startY: 40,
    startRot: 22,
    endX: 50,
    endY: 50,
    endRot: -15,
    zIndex: 13,
  },
  {
    src: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=75&auto=format",
    alt: "Cyberpunk Visuals",
    startX: 55,
    startY: -40,
    startRot: -14,
    endX: -55,
    endY: -30,
    endRot: 18,
    zIndex: 12,
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=75&auto=format",
    alt: "Microchip Hardware",
    startX: -40,
    startY: 0,
    startRot: -10,
    endX: 45,
    endY: -15,
    endRot: 12,
    zIndex: 11,
  },
  {
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=75&auto=format",
    alt: "Futuristic Workstation",
    startX: 45,
    startY: -10,
    startRot: 15,
    endX: -40,
    endY: 20,
    endRot: -14,
    zIndex: 10,
  },
];

// Content lines for the typewriter sequence
const INTRO_LINE = "Ideas become innovations. Innovators become leaders.";

const BODY_LINES = [
  "A community of creators, developers, and engineers united by one purpose \u2014 to build and shape the future through technology.",
];

const CLOSING_LINES = [
  "This is where ideas take flight.",
  "This is Tech Vayuna.",
];

export const PanelReveal: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const textCenterRef = useRef<HTMLDivElement>(null);
  const imageCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    const textCenter = textCenterRef.current;
    if (!section || !pinContainer || !textCenter) return;

    const ctx = gsap.context(() => {
      const introChars = textCenter.querySelectorAll(".tw-intro");
      const bodyLineEls = textCenter.querySelectorAll(".tw-body-line");
      const closingCharsAll = textCenter.querySelectorAll(".tw-closing");
      const closingLineEls = textCenter.querySelectorAll(".tw-closing-line");
      const statsEls = textCenter.querySelectorAll(".stat-box");
      const cursor = textCenter.querySelector(".tw-cursor");

      // Initial state: Set images in deep 3D perspective space (scaled down, distance away)
      imageCardsRef.current.forEach((card, i) => {
        if (!card) return;
        const config = FLY_IMAGES[i];
        gsap.set(card, {
          xPercent: config.startX,
          yPercent: config.startY,
          scale: 0.15,
          z: -800,
          rotation: config.startRot,
          opacity: 0,
          transformPerspective: 1200,
        });
      });

      // Master Pinned Scroll-Driven Timeline
      // The section pins for 300vh of vertical scroll so you pass right through the images
      // while the text remains centered, static & readable
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=260%",
          pin: pinContainer,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // PHASE 1: Text Typewriter / Reveal Sequence (First 20% of pinned scroll)
      masterTl.to(
        introChars,
        {
          opacity: 1,
          duration: 0.04,
          stagger: 0.008,
          ease: "none",
        },
        0
      );

      masterTl.fromTo(
        bodyLineEls,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
        0.08
      );

      masterTl.to(
        closingCharsAll,
        {
          opacity: 1,
          duration: 0.04,
          stagger: 0.01,
          ease: "none",
        },
        0.14
      );

      masterTl.to(
        closingLineEls,
        {
          textShadow:
            "0 0 25px rgba(216, 58, 96, 0.7), 0 0 50px rgba(136, 32, 124, 0.35)",
          duration: 0.1,
          stagger: 0.05,
          ease: "power2.out",
        },
        0.18
      );

      masterTl.fromTo(
        statsEls,
        { opacity: 0, y: 20, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.12,
          stagger: 0.03,
          ease: "back.out(1.2)",
        },
        0.2
      );

      if (cursor) {
        masterTl.to(cursor, { opacity: 0, duration: 0.05 }, 0.22);
      }

      // PHASE 2: 3D Fly-Through Effect (from 0.05 to 1.0 of the pinned scroll)
      // Images fly forward towards camera, passing around and through the static centered text
      const totalImages = FLY_IMAGES.length;
      const flyStart = 0.08;
      const flySpan = 0.88;
      const step = flySpan / totalImages;

      imageCardsRef.current.forEach((card, i) => {
        if (!card) return;
        const config = FLY_IMAGES[i];
        const cardStart = flyStart + i * (step * 0.7);
        const cardDuration = step * 1.5;

        // Scale up from distance (0.15 -> 1.0 -> 2.5), fly forward through screen, then exit past camera
        masterTl
          .fromTo(
            card,
            {
              scale: 0.2,
              z: -600,
              opacity: 0,
              xPercent: config.startX,
              yPercent: config.startY,
              rotation: config.startRot,
            },
            {
              opacity: 0.35,
              duration: cardDuration * 0.3,
              ease: "power1.in",
            },
            cardStart
          )
          .to(
            card,
            {
              scale: 1.45,
              z: 200,
              xPercent: (config.startX + config.endX) * 0.5,
              yPercent: (config.startY + config.endY) * 0.5,
              rotation: (config.startRot + config.endRot) * 0.5,
              duration: cardDuration * 0.5,
              ease: "none",
            },
            cardStart + cardDuration * 0.3
          )
          .to(
            card,
            {
              scale: 2.8,
              z: 600,
              xPercent: config.endX * 1.3,
              yPercent: config.endY * 1.3,
              rotation: config.endRot,
              opacity: 0,
              duration: cardDuration * 0.2,
              ease: "power2.in",
            },
            cardStart + cardDuration * 0.8
          );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="introduction"
      ref={sectionRef}
      className="relative w-full bg-transparent select-none"
    >
      {/* Pinned Stage Container: Stays 100vh static while vertical scrolling scrub plays */}
      <div
        ref={pinContainerRef}
        className="w-full h-screen relative overflow-hidden flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* Subtle vignette layer around the arena */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-[#0D0B0F]/30 to-[#0D0B0F]/80 z-[5]" />

        {/* 3D Fly-Through Images Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          {FLY_IMAGES.map((img, i) => (
            <div
              key={i}
              ref={(el) => {
                imageCardsRef.current[i] = el;
              }}
              className="absolute w-[260px] h-[170px] sm:w-[340px] sm:h-[220px] md:w-[440px] md:h-[280px] rounded-2xl overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.85)] will-change-transform"
              style={{
                zIndex: img.zIndex,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Cinematic Edge Tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0F]/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Centered Static Text Content Layer (Main Feature) */}
        <div
          ref={textCenterRef}
          className="relative z-30 max-w-4xl mx-auto px-6 flex flex-col items-center text-center py-8 rounded-3xl"
        >
          {/* Section badge tag */}
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 text-[11px] font-mono font-bold bg-[#D83A60]/15 text-brand-orange border border-brand-orange/40 tracking-widest uppercase rounded">
              SEC_01
            </span>
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#C4BFC9] uppercase flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#D83A60]" />
              // ABOUT_TECH_VAYUNA
            </span>
          </div>

          {/* Intro line - centered typewriter */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight font-display max-w-3xl">
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
          </h2>

          {/* Body paragraph - centered */}
          <div className="max-w-2xl mb-6">
            {BODY_LINES.map((line, i) => (
              <p
                key={i}
                className="tw-body-line text-sm sm:text-base text-[#FFFFFF] font-normal leading-relaxed opacity-0"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Separator */}
          <div className="w-20 h-px bg-[#D83A60]/60 mb-6" />

          {/* Closing lines - Bold impactful declaration */}
          <div className="space-y-2 mb-8">
            {CLOSING_LINES.map((line, li) => (
              <p
                key={li}
                className="tw-closing-line text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight font-display"
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

          {/* Telemetry Metrics Grid - Centered Below */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl pt-6 border-t border-val-light/10">
            <div className="stat-box p-3 rounded-xl bg-[#14111A]/90 border border-white/[0.08] backdrop-blur-md hover:border-[#D83A60]/40 transition-colors">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Users className="w-3.5 h-3.5 text-[#D83A60]" />
                <span className="text-xl font-black font-display text-gradient-brand">500+</span>
              </div>
              <div className="text-[10px] font-mono text-[#B5B0BC] uppercase tracking-wider">Innovators</div>
            </div>

            <div className="stat-box p-3 rounded-xl bg-[#14111A]/90 border border-white/[0.08] backdrop-blur-md hover:border-[#D83A60]/40 transition-colors">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Trophy className="w-3.5 h-3.5 text-[#D83A60]" />
                <span className="text-xl font-black font-display text-gradient-brand">50+</span>
              </div>
              <div className="text-[10px] font-mono text-[#B5B0BC] uppercase tracking-wider">Hackathons</div>
            </div>

            <div className="stat-box p-3 rounded-xl bg-[#14111A]/90 border border-white/[0.08] backdrop-blur-md hover:border-[#D83A60]/40 transition-colors">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Zap className="w-3.5 h-3.5 text-[#D83A60]" />
                <span className="text-xl font-black font-display text-gradient-brand">100%</span>
              </div>
              <div className="text-[10px] font-mono text-[#B5B0BC] uppercase tracking-wider">Student-Led</div>
            </div>

            <div className="stat-box p-3 rounded-xl bg-[#14111A]/90 border border-white/[0.08] backdrop-blur-md hover:border-[#D83A60]/40 transition-colors">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Cpu className="w-3.5 h-3.5 text-[#D83A60]" />
                <span className="text-xl font-black font-display text-gradient-brand">24/7</span>
              </div>
              <div className="text-[10px] font-mono text-[#B5B0BC] uppercase tracking-wider">R&D Labs</div>
            </div>
          </div>

          {/* Live status badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-[#A09BA8] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D83A60] animate-ping" />
            [ PROTOCOL_ACTIVE // SCROLL_PASS_THROUGH ]
          </div>
        </div>

        {/* Minimal Corner Stencil Marks */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-val-light/10 hidden md:block" />
        <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-val-light/10 hidden md:block" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-val-light/10 hidden md:block" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-val-light/10 hidden md:block" />
      </div>
    </section>
  );
};
