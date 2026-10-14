"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowDown, Radio } from "lucide-react";

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const decorationRef = useRef<HTMLDivElement>(null);
  const phoenixRef = useRef<HTMLImageElement>(null);
  const treeRef1 = useRef<HTMLDivElement>(null);
  const treeRef2 = useRef<HTMLDivElement>(null);
  const treeRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero enter animation
      const tl = gsap.timeline();

      tl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          scale: 0.95,
          y: 40,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
        }
      );

      tl.fromTo(
        decorationRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.8"
      );

      // Subtle natural floating levitation on Hero Phoenix
      if (phoenixRef.current) {
        gsap.to(phoenixRef.current, {
          y: "-=12",
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Smooth 60fps-144fps mouse parallax using quickTo setters
      const pX = phoenixRef.current ? gsap.quickTo(phoenixRef.current, "x", { duration: 0.9, ease: "power2.out" }) : null;
      const pRotY = phoenixRef.current ? gsap.quickTo(phoenixRef.current, "rotationY", { duration: 0.9, ease: "power2.out" }) : null;
      const pRotX = phoenixRef.current ? gsap.quickTo(phoenixRef.current, "rotationX", { duration: 0.9, ease: "power2.out" }) : null;

      const t1X = treeRef1.current ? gsap.quickTo(treeRef1.current, "x", { duration: 1.1, ease: "power2.out" }) : null;
      const t2X = treeRef2.current ? gsap.quickTo(treeRef2.current, "x", { duration: 1.1, ease: "power2.out" }) : null;
      const t3X = treeRef3.current ? gsap.quickTo(treeRef3.current, "x", { duration: 1.1, ease: "power2.out" }) : null;

      const handleMouseMove = (e: MouseEvent) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 40;

        if (pX) pX(xPos);
        if (pRotY) pRotY(xPos * 0.7);
        if (pRotX) pRotX(-yPos * 0.7);

        if (t1X) t1X(xPos * -0.1);
        if (t2X) t2X(xPos * -0.25);
        if (t3X) t3X(xPos * -0.5);
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full h-screen min-h-[600px] flex flex-col justify-center items-center overflow-hidden bg-transparent bg-grid-pattern px-6"
    >
      {/* Parallax Dense Forest Background (Red Tinted) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep background forest layer */}
        <div 
          ref={treeRef1}
          data-speed="0.2"
          className="absolute bottom-0 left-[-50px] w-[150vw] h-[50vh] opacity-40 bg-gradient-to-t from-[#3d0000] to-[#ff2a00]"
          style={{ 
            WebkitMaskImage: "url('https://lottie.host/5c1921cf-b0aa-4b98-83a3-1aa952f789e6/rueynWTPCm.svg')",
            WebkitMaskSize: "300px auto",
            WebkitMaskPosition: "bottom",
            WebkitMaskRepeat: "repeat-x",
            maskImage: "url('https://lottie.host/5c1921cf-b0aa-4b98-83a3-1aa952f789e6/rueynWTPCm.svg')",
            maskSize: "300px auto",
            maskPosition: "bottom",
            maskRepeat: "repeat-x"
          }}
        />
        {/* Mid-ground forest layer */}
        <div 
          ref={treeRef2}
          data-speed="0.6"
          className="absolute -bottom-10 left-[-100px] w-[150vw] h-[60vh] opacity-70 bg-gradient-to-t from-[#5c0000] to-[#ff5e36]"
          style={{ 
            WebkitMaskImage: "url('https://lottie.host/5c1921cf-b0aa-4b98-83a3-1aa952f789e6/rueynWTPCm.svg')",
            WebkitMaskSize: "450px auto",
            WebkitMaskPosition: "bottom",
            WebkitMaskRepeat: "repeat-x",
            maskImage: "url('https://lottie.host/5c1921cf-b0aa-4b98-83a3-1aa952f789e6/rueynWTPCm.svg')",
            maskSize: "450px auto",
            maskPosition: "bottom",
            maskRepeat: "repeat-x"
          }}
        />
        {/* Foreground forest layer */}
        <div 
          ref={treeRef3}
          data-speed="1.1"
          className="absolute -bottom-20 left-[-150px] w-[150vw] h-[70vh] opacity-90 drop-shadow-[0_0_15px_rgba(255,94,54,0.3)] bg-gradient-to-t from-[#1a0000] via-[#8a0000] to-[#ff5e36]"
          style={{ 
            WebkitMaskImage: "url('https://lottie.host/5c1921cf-b0aa-4b98-83a3-1aa952f789e6/rueynWTPCm.svg')",
            WebkitMaskSize: "600px auto",
            WebkitMaskPosition: "bottom",
            WebkitMaskRepeat: "repeat-x",
            maskImage: "url('https://lottie.host/5c1921cf-b0aa-4b98-83a3-1aa952f789e6/rueynWTPCm.svg')",
            maskSize: "600px auto",
            maskPosition: "bottom",
            maskRepeat: "repeat-x"
          }}
        />
      </div>

      
      <div className="text-center z-10 flex flex-col items-center mt-6 sm:mt-12">

        {/* Main Title */}
        <div data-speed="1.2" ref={titleRef} className="flex flex-col items-center">
          <img 
            ref={phoenixRef}
            src="https://lottie.host/868902d8-2ea0-4537-a9f9-7de6896fce86/wmLLX1SXsI.svg"
            alt="Phoenix"
            className="w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 mt-2 sm:mt-8 mb-3 sm:mb-6 object-contain drop-shadow-[0_0_30px_rgba(244,59,134,0.3)]"
          />
          <h1
            className="text-4xl sm:text-7xl md:text-9xl font-editorial italic font-bold tracking-tight uppercase leading-[0.9] sm:leading-[0.85] text-val-light max-w-4xl text-center px-2"
          >
          TECH <span className="text-gradient-brand text-glow-brand font-editorial italic">VAYUNA</span>
          </h1>
        </div>

        <div
          ref={decorationRef}
          className="mt-4 sm:mt-8 flex flex-col items-center gap-4"
        >
          {/* Call to Scroll Action */}
          <a
            href="#introduction"
            className="mt-4 sm:mt-8 group flex flex-col items-center gap-2 cursor-pointer transition-all text-val-light/50 hover:text-brand-pink"
          >
            <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase">SCROLL DOWN</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-val-light/20 flex items-center justify-center group-hover:border-brand-pink/50 transition-all animate-bounce">
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit" />
            </div>
          </a>
        </div>
      </div>

      {/* Tech border details */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple opacity-40" />
    </section>
  );
};
