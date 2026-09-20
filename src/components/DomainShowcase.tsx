"use client";

import React, { useState, useEffect } from "react";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";
import { Sparkles, MoveHorizontal, X, ArrowUpRight, ShieldCheck, Tag } from "lucide-react";

const DOMAIN_GALLERY_ITEMS: GalleryItem[] = [
  {
    common: "Media & Design",
    binomial: "VISUAL STORYTELLING",
    photo: {
      url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
      text: "Capturing moments and crafting compelling visual narratives. We are the storytellers of the digital age.",
      by: "Lead: Aarav Sharma",
      pos: "center",
    },
  },
  {
    common: "Web Engineering",
    binomial: "NEXT-GEN PLATFORMS",
    photo: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      text: "Crafting immersive, high-performance web applications with cutting-edge animation engines.",
      by: "Lead: Riya Verma",
      pos: "center",
    },
  },
  {
    common: "Artificial Intelligence",
    binomial: "INTELLIGENT SYSTEMS",
    photo: {
      url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      text: "Building autonomous deep learning models, LLMs, and neural perception architectures.",
      by: "Lead: Karan Patel",
      pos: "center",
    },
  },
  {
    common: "Data Science",
    binomial: "PREDICTIVE ANALYTICS",
    photo: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      text: "Extracting actionable insights from complex real-time data pipelines and big data architectures.",
      by: "Lead: Ananya Gupta",
      pos: "center",
    },
  },
  {
    common: "Cyber Security",
    binomial: "SYSTEM DEFENSE",
    photo: {
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      text: "Securing modern infrastructure with zero-trust architectures, penetration testing, and threat telemetry.",
      by: "Lead: Vikram Malhotra",
      pos: "center",
    },
  },
  {
    common: "Cloud & DevOps",
    binomial: "SCALABLE CLOUD",
    photo: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      text: "Automating cloud deployment pipelines, Kubernetes orchestration, and serverless compute grids.",
      by: "Lead: Neha Joshi",
      pos: "center",
    },
  },
  {
    common: "Robotics & Hardware",
    binomial: "EMBEDDED SYSTEMS",
    photo: {
      url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      text: "Designing custom microcontrollers, IoT sensor grids, and real-time physical computing modules.",
      by: "Lead: Rohan Das",
      pos: "center",
    },
  },
];

const DOMAIN_DETAILS: Record<string, { tags: string[]; icon: string; stats: string }> = {
  "Media & Design": { tags: ["Cinematography", "UI/UX", "3D Motion", "Blender"], icon: "🎨", stats: "40+ Productions" },
  "Web Engineering": { tags: ["Next.js", "WebGL", "TypeScript", "Tailwind"], icon: "🌐", stats: "12+ Live Portals" },
  "Artificial Intelligence": { tags: ["PyTorch", "LLMs", "Computer Vision", "Transformers"], icon: "🧠", stats: "98.4% Model Acc" },
  "Data Science": { tags: ["Spark", "Pandas", "ETL", "Predictive ML"], icon: "📊", stats: "10M+ Data Pts" },
  "Cyber Security": { tags: ["PenTesting", "ZeroTrust", "DevSecOps", "CTF"], icon: "🛡️", stats: "0 Zero-Days" },
  "Cloud & DevOps": { tags: ["Docker", "Kubernetes", "AWS", "CI/CD"], icon: "☁️", stats: "99.99% Uptime" },
  "Robotics & Hardware": { tags: ["Arduino", "ESP32", "ROS2", "PCB Design"], icon: "⚙️", stats: "15+ Hardware Prototypes" },
};

export const DomainShowcase: React.FC = () => {
  const [activeModal, setActiveModal] = useState<GalleryItem | null>(null);
  const [radius, setRadius] = useState(600);

  // Responsive radius calculation: balances wide cinematic cards with dramatic 3D side angles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(300);
      } else if (window.innerWidth < 1024) {
        setRadius(380);
      } else {
        setRadius(440);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="domains"
      className="relative w-full min-h-[780px] md:min-h-[860px] py-16 overflow-hidden flex flex-col items-center justify-between"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--theme-primary,rgba(244,59,134,0.06))] blur-[150px] transition-colors duration-700" />
      </div>

      {/* Header Info */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 mb-2">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[var(--theme-primary,rgba(255,94,54,0.15))] text-[var(--theme-primary,#ff5e36)] border border-[var(--theme-primary,rgba(255,94,54,0.4))] tracking-widest uppercase">
            SEC_02
          </span>
          <span className="text-[10px] font-mono tracking-[0.25em] text-val-gray/70 uppercase">
            // 3D_PANORAMIC_CYLINDER
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-val-light uppercase tracking-tight font-display mb-2">
          OUR <span className="text-gradient-brand text-glow-brand">DOMAINS</span>
        </h2>

        <p className="text-val-gray font-mono text-xs sm:text-sm max-w-xl tracking-wide uppercase leading-relaxed mb-3">
          Pioneering innovation across seven technological pillars. Drag or scroll to orbit the 3D gallery.
        </p>

        {/* Drag / Orbit instruction pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#07070a]/80 border border-white/10 text-val-gray text-[10px] font-mono">
          <MoveHorizontal className="w-3 h-3 text-[var(--theme-primary,#ff5e36)] animate-pulse" />
          <span>DRAG OR SCROLL TO ROTATE // CLICK TO INSPECT</span>
        </div>
      </div>

      {/* 3D Circular Gallery Stage */}
      <div className="relative z-10 w-full h-[460px] md:h-[500px] flex items-center justify-center my-2 overflow-visible">
        <CircularGallery
          items={DOMAIN_GALLERY_ITEMS}
          radius={radius}
          autoRotateSpeed={0.04}
          onItemClick={(item) => setActiveModal(item)}
        />
      </div>

      {/* Detail Modal Dialog when card is clicked */}
      {activeModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0c0d14] border border-white/20 rounded-2xl overflow-hidden shadow-2xl p-6 select-none"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderColor: "var(--theme-primary, #ff5e36)",
              boxShadow: "0 0 35px var(--theme-glow, rgba(255,94,54,0.3))",
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest text-[var(--theme-primary,#ff5e36)] border border-[var(--theme-primary,#ff5e36)]/30 rounded uppercase">
                  {activeModal.binomial}
                </span>
                <h3 className="text-2xl font-black font-display text-white mt-1.5 flex items-center gap-2">
                  <span>{DOMAIN_DETAILS[activeModal.common]?.icon}</span>
                  <span>{activeModal.common}</span>
                </h3>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 border border-white/10">
              <img
                src={activeModal.photo.url}
                alt={activeModal.photo.text}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-xs font-mono text-white/80">
                {activeModal.photo.by}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-val-light/80 font-sans leading-relaxed mb-5">
              {activeModal.photo.text}
            </p>

            {/* Domain Tech Stack Tags */}
            <div className="mb-5">
              <div className="text-[10px] font-mono uppercase text-val-gray mb-2 flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-[var(--theme-primary,#ff5e36)]" />
                <span>TECH ARSENAL & FRAMEWORKS</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {DOMAIN_DETAILS[activeModal.common]?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-white/5 border border-white/10 text-val-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{DOMAIN_DETAILS[activeModal.common]?.stats}</span>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-[var(--theme-primary,#ff5e36)] text-black text-xs font-mono font-bold tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                <span>ACKNOWLEDGE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DomainShowcase;
