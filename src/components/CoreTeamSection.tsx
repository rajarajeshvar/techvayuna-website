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
        ctx.fillStyle = `rgba(255, 94, 54, ${p.opacity})`;
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
      // Base parallax effect on scroll
      gsap.to(introRef.current, {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Layered text parallax
      const title = introRef.current?.querySelector(".parallax-title");
      const role = introRef.current?.querySelector(".parallax-role");
      const tagline = introRef.current?.querySelector(".parallax-tagline");

      if (title) {
        gsap.to(title, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (role) {
        gsap.to(role, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (tagline) {
        gsap.to(tagline, {
          y: -10,
          ease: "none",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.to(imgRef.current, {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Entry animation
      gsap.fromTo(
        [introRef.current, imgRef.current],
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
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
      className="relative flex-1 p-8 md:p-12 transition-all duration-500 flex flex-col justify-center perspective-[1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={introContentRef} className="flex flex-col h-full w-full justify-center relative">
        {/* Number line */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-val-accent font-mono text-xl opacity-80">{member.number}</span>
          <div className="h-[1px] w-12 bg-val-accent/50" />
        </div>

        <h3 className="parallax-title text-3xl md:text-4xl font-bold text-white tracking-wide mb-2 uppercase text-glow-white">
          {member.name}
        </h3>
        <div className="parallax-role text-val-accent font-semibold text-sm md:text-base tracking-widest uppercase mb-6 text-glow-red">
          {member.role}
        </div>
        
        <p className="parallax-tagline text-white/70 leading-relaxed font-light text-sm md:text-base max-w-md mb-10">
          {member.tagline}
        </p>

        {/* Socials */}
        <div className="flex items-center gap-4 mt-auto">
          {member.socials.linkedin && (
            <a href={member.socials.linkedin} className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/60 hover:text-val-accent hover:border-val-accent hover:bg-val-accent/10 transition-all">
              <Link size={16} />
            </a>
          )}
          {member.socials.instagram && (
            <a href={member.socials.instagram} className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/60 hover:text-val-accent hover:border-val-accent hover:bg-val-accent/10 transition-all">
              <Globe size={16} />
            </a>
          )}
          {member.socials.github && (
            <a href={member.socials.github} className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/60 hover:text-val-accent hover:border-val-accent hover:bg-val-accent/10 transition-all">
              <Code size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const ImageBox = (
    <div
      ref={imgRef}
      className={`relative flex-1 aspect-square md:aspect-auto md:h-[450px] transition-all duration-500 flex items-center justify-center cursor-pointer group overflow-hidden ${isPlaying ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
      onClick={() => onPlayAudio(member.id, member.audioSrc)}
    >
      {member.image ? (
        <>
          <img 
            src={member.image} 
            alt={member.name} 
            className="absolute inset-0 w-full h-full object-cover z-0 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        </>
      ) : null}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {!member.image && (
          <span className="text-7xl font-bold text-white/90 drop-shadow-[0_0_15px_rgba(255,94,54,0.8)] tracking-widest mb-4">
            {member.initials}
          </span>
        )}
        <span className={`text-xs font-mono uppercase tracking-[0.3em] transition-colors duration-300 ${member.image ? 'text-white/80 group-hover:text-white mt-auto pt-40' : 'text-val-accent/70'}`}>
          {isPlaying ? "Playing Intro..." : "Play Intro"}
        </span>
      </div>
    </div>
  );

  return (
    <div ref={rowRef} className="flex flex-col md:flex-row w-full gap-8 md:gap-16 items-stretch">
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
    <section id="core-team" ref={sectionRef} className="relative w-full min-h-screen bg-val-bg py-24 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-val-accent/5 blur-[150px] rounded-full pointer-events-none z-0" />
      
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
          
          <p className="subtitle mt-8 text-white/60 max-w-2xl text-base md:text-lg font-light leading-relaxed">
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
