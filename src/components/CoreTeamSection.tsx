"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, Mail, Globe, Code } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Placeholder Data ── */
interface TeamMember {
  id: string;
  name: string;
  role: string;
  tagline: string;
  initials: string;
  number: string;
  socials: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    instagram?: string;
  };
  audioSrc?: string;
  image?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "arjun",
    name: "ARJUN RAJ",
    role: "PRESIDENT",
    tagline: "Leading the vision and direction of Tech Vayuna. Passionate about building communities and driving innovation that creates real world impact.",
    initials: "AR",
    number: "01",
    socials: { linkedin: "#", github: "#", instagram: "#" },
    audioSrc: "/intro.mp3",
    image: "/arjun.png",
  },
  {
    id: "megha",
    name: "MEGHA SHREE",
    role: "VICE PRESIDENT",
    tagline: "Bridging ideas and people. Ensures every initiative we take is aligned with our mission and values.",
    initials: "MS",
    number: "02",
    socials: { linkedin: "#", github: "#", instagram: "#" },
    audioSrc: "/intro.mp3",
  },
  {
    id: "vikram",
    name: "VIKRAM DEV",
    role: "TECHNICAL LEAD",
    tagline: "The architect behind our tech. Loves solving complex problems and building scalable solutions that power our ideas.",
    initials: "VD",
    number: "03",
    socials: { linkedin: "#", github: "#", instagram: "#" },
    audioSrc: "/intro.mp3",
  },
  {
    id: "ananya",
    name: "ANANYA IYER",
    role: "DESIGN & OPERATIONS LEAD",
    tagline: "Designs experiences that inspire and operations that keep everything running smoothly behind the scenes.",
    initials: "AI",
    number: "04",
    socials: { linkedin: "#", github: "#", instagram: "#" },
    audioSrc: "/intro.mp3",
  },
];

/* ── Ember Particles Component ── */
const EmberParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      opacity: number;
    }[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 1) * 1.5 - 0.5, // moving upwards
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(216, 58, 96, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        
        // slight flicker
        p.opacity += (Math.random() - 0.5) * 0.05;
        p.opacity = Math.max(0.1, Math.min(0.6, p.opacity));
      }
      animFrame = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

/* ── Individual Team Row ── */
interface TeamRowProps {
  member: TeamMember;
  index: number;
  onPlayAudio: (id: string, src?: string) => void;
  playingId: string | null;
}

const TeamRow: React.FC<TeamRowProps> = ({ member, index, onPlayAudio, playingId }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const introContentRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const isEven = index % 2 === 0;
  const isPlaying = playingId === member.id;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const statusIndicator = introRef.current?.querySelector(".agent-status-badge");
      const statusText = introRef.current?.querySelector(".agent-status-text");
      const statusDot = introRef.current?.querySelector(".agent-status-dot");
      const scanReticle = imgRef.current?.querySelector(".agent-scan-reticle");

      // Initial standby / queueing state before reaching trigger
      gsap.set([introRef.current, imgRef.current], {
        opacity: 0.65,
        scale: 0.96,
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      });

      if (scanReticle) {
        gsap.set(scanReticle, { opacity: 0.2 });
      }

      // Snappy Queue Pop / Perk Up Animation Function (like League of Legends / Valorant queue ready check)
      const triggerQueuePop = () => {
        const sweepElements = rowRef.current?.querySelectorAll(".queue-pop-sweep");
        if (sweepElements && sweepElements.length > 0) {
          gsap.fromTo(
            sweepElements,
            { x: "-120%", opacity: 0.8 },
            { x: "140%", opacity: 0, duration: 0.65, ease: "power2.out" }
          );
        }

        const tl = gsap.timeline();

        // 1. Snappy PERK UP / EXCITED POP (Pure hardware-accelerated transform + opacity)
        tl.to([introRef.current, imgRef.current], {
          opacity: 1,
          scale: 1.045, // Excited surge!
          borderColor: "#D83A60",
          boxShadow: "0 0 45px rgba(216, 58, 96, 0.65), 0 20px 50px rgba(0,0,0,0.9)",
          duration: 0.22,
          ease: "power3.out",
          onStart: () => {
            if (statusText) statusText.textContent = "MATCH FOUND // LOCKED IN";
            if (statusIndicator) {
              statusIndicator.className =
                "agent-status-badge flex items-center gap-1.5 px-2.5 py-0.5 border border-[#D83A60] bg-[#D83A60] text-[#0D0B0F] text-[9px] font-black font-mono tracking-wider transition-colors shadow-[0_0_20px_rgba(216,58,96,0.8)]";
            }
            if (statusDot) {
              statusDot.className = "agent-status-dot w-2 h-2 bg-white rounded-none animate-ping";
            }
            if (scanReticle) {
              gsap.to(scanReticle, { opacity: 1, duration: 0.2 });
            }
          },
        })
        // 2. Smoothly settle back to normal resting deployed state right after perking up
        .to([introRef.current, imgRef.current], {
          scale: 1.0, // Back to standard resting scale
          borderColor: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0 24px 60px -15px rgba(0,0,0,0.85), inset 0 0 25px rgba(216, 58, 96, 0.05)",
          duration: 0.45,
          ease: "back.out(1.3)",
          onComplete: () => {
            if (statusText) statusText.textContent = "COMBAT READY // DEPLOYED";
            if (statusIndicator) {
              statusIndicator.className =
                "agent-status-badge flex items-center gap-1.5 px-2.5 py-0.5 border border-[#D83A60]/40 bg-[#D83A60]/15 text-[#D83A60] text-[9px] font-bold font-mono transition-colors shadow-[0_0_12px_rgba(216,58,96,0.3)]";
            }
            if (statusDot) {
              statusDot.className = "agent-status-dot w-2 h-2 bg-[#D83A60] rounded-none animate-ping";
            }
          },
        });
      };

      // Reset to standby when scrolled back above
      const resetToStandby = () => {
        gsap.to([introRef.current, imgRef.current], {
          opacity: 0.65,
          scale: 0.96,
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          duration: 0.35,
          ease: "power2.out",
        });

        if (statusText) statusText.textContent = "STANDBY // QUEUEING";
        if (statusIndicator) {
          statusIndicator.className =
            "agent-status-badge flex items-center gap-1.5 px-2.5 py-0.5 border border-white/10 bg-white/5 text-[#B5B0BC] text-[9px] font-bold font-mono transition-colors";
        }
        if (statusDot) {
          statusDot.className = "agent-status-dot w-2 h-2 bg-val-gray/40 rounded-none";
        }
        if (scanReticle) {
          gsap.to(scanReticle, { opacity: 0.2, duration: 0.2 });
        }
      };

      ScrollTrigger.create({
        trigger: rowRef.current,
        start: "top 78%",
        onEnter: () => triggerQueuePop(),
        onEnterBack: () => triggerQueuePop(),
        onLeaveBack: () => resetToStandby(),
      });
    }, rowRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!introContentRef.current || !introRef.current) return;
    const rect = introRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate movement (max 20px)
    const moveX = ((x - centerX) / centerX) * 20;
    const moveY = ((y - centerY) / centerY) * 20;

    gsap.to(introContentRef.current, {
      x: moveX,
      y: moveY,
      rotateX: -moveY * 0.5,
      rotateY: moveX * 0.5,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (!introContentRef.current) return;
    gsap.to(introContentRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 1,
      ease: "elastic.out(1, 0.3)"
    });
  };

  const IntroBox = (
    <div
      ref={introRef}
      className="relative flex-1 p-6 md:p-10 transition-all duration-500 flex flex-col justify-center perspective-[1000px] border border-white/15 bg-[#120E18]/65 backdrop-blur-md rounded-none clip-corner-sm overflow-hidden"
      style={{
        boxShadow: "0 24px 60px -15px rgba(0,0,0,0.85), inset 0 0 25px rgba(216, 58, 96, 0.05)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tactical Queue Pop Light Sweep */}
      <div className="queue-pop-sweep absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-[#D83A60]/35 to-transparent -translate-x-full z-20 skew-x-12" />

      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 font-mono text-[10px] tracking-widest text-[#C4BFC9] uppercase">
        <div className="flex items-center gap-2">
          <span className="agent-status-dot w-2 h-2 bg-[#D83A60] rounded-none animate-ping" />
          <span className="text-[#D83A60] font-bold">AGENT // {member.number}</span>
          <span className="text-[#6A6675]">|</span>
          <span className="text-white font-medium">CLASS // LEADERSHIP</span>
        </div>
        <div className="agent-status-badge flex items-center gap-1.5 px-2.5 py-0.5 border border-[#D83A60]/40 text-[#D83A60] text-[9px] font-bold">
          <span className="agent-status-text">COMBAT READY // DEPLOYED</span>
        </div>
      </div>

      <div ref={introContentRef} className="flex flex-col h-full w-full justify-center relative">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#D83A60] tracking-[0.25em] font-bold uppercase select-none">
          <span className="w-1.5 h-1.5 bg-[#D83A60]" />
          <span>CODENAME</span>
        </div>

        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3 uppercase font-display">
          {member.name}
        </h3>
        
        <div className="inline-block text-xs md:text-sm font-mono tracking-[0.2em] uppercase mb-5 px-2.5 py-1 bg-[#D83A60]/15 text-[#D83A60] border border-[#D83A60]/40 w-fit">
          ROLE // {member.role}
        </div>
        
        <p className="text-white font-normal leading-relaxed font-sans text-sm md:text-base max-w-lg mb-8 border-l-2 border-[#D83A60]/50 pl-4 py-1">
          {member.tagline}
        </p>

        {/* Tactical Stencil Specs */}
        <div className="grid grid-cols-2 gap-3 mb-8 max-w-md font-mono text-[10px] uppercase">
          <div className="p-2 border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <div className="text-[#B5B0BC]">CLEARANCE</div>
            <div className="text-white font-bold tracking-wider">LEVEL 05 // OMNI</div>
          </div>
          <div className="p-2 border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <div className="text-[#B5B0BC]">DEPLOYMENT</div>
            <div className="text-[#D83A60] font-bold tracking-wider">ACTIVE PROTOCOL</div>
          </div>
        </div>

        {/* Socials & Audio Action */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {member.socials.linkedin && (
              <a href={member.socials.linkedin} className="flex items-center justify-center w-9 h-9 border border-white/20 text-white hover:text-[#D83A60] hover:border-[#D83A60] hover:bg-[#D83A60]/10 transition-all clip-corner-sm">
                <Link size={14} />
              </a>
            )}
            {member.socials.instagram && (
              <a href={member.socials.instagram} className="flex items-center justify-center w-9 h-9 border border-white/20 text-white hover:text-[#D83A60] hover:border-[#D83A60] hover:bg-[#D83A60]/10 transition-all clip-corner-sm">
                <Globe size={14} />
              </a>
            )}
            {member.socials.github && (
              <a href={member.socials.github} className="flex items-center justify-center w-9 h-9 border border-white/20 text-white hover:text-[#D83A60] hover:border-[#D83A60] hover:bg-[#D83A60]/10 transition-all clip-corner-sm">
                <Code size={14} />
              </a>
            )}
          </div>

          <button
            onClick={() => onPlayAudio(member.id, member.audioSrc)}
            className="flex items-center gap-2 px-3.5 py-1.5 border border-[#D83A60] bg-[#D83A60]/20 hover:bg-[#D83A60] hover:text-[#0D0B0F] text-[#D83A60] text-xs font-mono font-bold tracking-wider uppercase transition-all clip-corner-sm cursor-pointer"
          >
            <span className="w-1.5 h-1.5 bg-current rounded-full" />
            <span>{isPlaying ? "HALT INTRO" : "PLAY VOICE"}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ImageBox = (
    <div
      ref={imgRef}
      className={`relative flex-1 aspect-square md:aspect-auto md:h-[500px] transition-all duration-500 flex items-center justify-center cursor-pointer group overflow-hidden border border-white/15 bg-[#14111A]/65 backdrop-blur-md clip-corner-sm ${isPlaying ? 'ring-2 ring-[#D83A60]' : 'hover:border-[#D83A60]/60'}`}
      onClick={() => onPlayAudio(member.id, member.audioSrc)}
    >
      {/* Tactical Queue Pop Light Sweep */}
      <div className="queue-pop-sweep absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-[#D83A60]/35 to-transparent -translate-x-full z-20 skew-x-12" />
      {/* Background Valorant Grid Pattern & Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0F]/90 via-transparent to-[#D83A60]/10 z-0" />
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(216, 58, 96, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(216, 58, 96, 0.3) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Tactical Agent Background Silhouette Watermark */}
      <div className="absolute -right-8 -bottom-10 font-display font-black text-8xl md:text-9xl text-white/[0.04] pointer-events-none select-none tracking-tighter">
        {member.number}
      </div>

      {member.image ? (
        <>
          <img 
            src={member.image} 
            alt={member.name} 
            className="absolute inset-0 w-full h-full object-cover z-0 grayscale contrast-125 opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0D0B0F] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
        </>
      ) : null}

      {/* Tactical HUD Overlay Brackets */}
      <div className="absolute top-4 left-4 z-10 w-4 h-4 border-t-2 border-l-2 border-[#D83A60]" />
      <div className="absolute top-4 right-4 z-10 w-4 h-4 border-t-2 border-r-2 border-[#D83A60]" />
      <div className="absolute bottom-4 left-4 z-10 w-4 h-4 border-b-2 border-l-2 border-[#D83A60]" />
      <div className="absolute bottom-4 right-4 z-10 w-4 h-4 border-b-2 border-r-2 border-[#D83A60]" />

      {/* Target Crosshair Badge */}
      <div className="agent-scan-reticle absolute top-4 left-10 z-10 font-mono text-[9px] text-[#D83A60] tracking-widest uppercase transition-opacity">
        LOC // RADAR_0{member.number}
      </div>

      {/* Center Initials if no image */}
      <div className="relative z-10 flex flex-col items-center">
        {!member.image && (
          <div className="relative mb-4 flex items-center justify-center">
            <span className="text-8xl md:text-9xl font-black font-display text-white/90 tracking-widest drop-shadow-[0_0_25px_rgba(216,58,96,0.6)] group-hover:scale-110 transition-transform duration-500">
              {member.initials}
            </span>
            <div className="absolute -inset-4 border border-[#D83A60]/30 rounded-full animate-spin pointer-events-none" style={{ animationDuration: "12s" }} />
          </div>
        )}

        <div className={`mt-auto px-4 py-1.5 border border-white/10 bg-black/60 backdrop-blur-sm font-mono text-[10px] tracking-[0.25em] uppercase text-white group-hover:border-[#D83A60] group-hover:text-[#D83A60] transition-colors ${member.image ? 'mt-72' : ''}`}>
          {isPlaying ? "TRANSMITTING INTRO..." : "[ CLICK TO LISTEN ]"}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={rowRef} className="flex flex-col md:flex-row w-full gap-8 md:gap-12 items-stretch">
      {isEven ? (
        <>
          {IntroBox}
          {ImageBox}
        </>
      ) : (
        <>
          <div className="order-last md:order-first flex-1 w-full flex">
            {ImageBox}
          </div>
          {IntroBox}
        </>
      )}
    </div>
  );
};

/* ── Main Section Component ── */
export const CoreTeamSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Audio state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = useCallback((id: string, src?: string) => {
    if (playingId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingId(id);

    if (src) {
      audioRef.current = new Audio(src);
      audioRef.current.play().catch(e => console.warn("Audio play failed:", e));
      
      audioRef.current.onended = () => {
        setPlayingId(null);
      };
    } else {
      setTimeout(() => {
        setPlayingId((current) => current === id ? null : current);
      }, 3000);
    }
  }, [playingId]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const ctx = gsap.context(() => {
      const titleLines = header.querySelectorAll(".title-line");
      gsap.fromTo(
        titleLines,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        header.querySelector(".subtitle"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <section id="core-team" ref={sectionRef} className="relative w-full min-h-screen bg-transparent py-24 md:py-32 overflow-hidden">
      {/* Subtle Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <EmberParticles />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-24">
          <div className="text-val-accent font-mono text-sm tracking-[0.2em] mb-4 opacity-80 uppercase">
            Core Team
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 uppercase tracking-wider title-line text-glow-white">
            The Minds Behind
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-val-accent uppercase tracking-wider title-line text-glow-red">
            Tech Vayuna
          </h2>
          
          <p className="subtitle mt-8 text-[#E8E4DD] max-w-2xl text-base md:text-lg font-normal leading-relaxed">
            A group of passionate innovators, builders and dreamers united by the vision to create impact through technology.
          </p>
        </div>

        {/* Team List (Vertical Alternating) */}
        <div className="flex flex-col gap-16 md:gap-32 w-full">
          {TEAM_MEMBERS.map((member, index) => (
            <TeamRow 
              key={member.id} 
              member={member} 
              index={index} 
              onPlayAudio={handlePlayAudio}
              playingId={playingId}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
