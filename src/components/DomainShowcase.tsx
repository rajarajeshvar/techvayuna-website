"use client";

import React, { useState, useEffect } from "react";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";
import { MoveHorizontal } from "lucide-react";

const DOMAIN_GALLERY_ITEMS: GalleryItem[] = [
  {
    common: "Web Development",
    binomial: "NEXT-GEN PLATFORMS",
    photo: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      text: "Crafting immersive, high-performance web applications with cutting-edge modern tech stacks.",
      by: "Lead: Web Dev",
      pos: "center",
    },
  },
  {
    common: "Data Analytics",
    binomial: "ACTIONABLE INSIGHTS",
    photo: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      text: "Extracting actionable insights from complex real-time data pipelines and predictive intelligence.",
      by: "Lead: Data Analytics",
      pos: "center",
    },
  },
  {
    common: "Artificial Intelligence",
    binomial: "INTELLIGENT SYSTEMS",
    photo: {
      url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      text: "Building autonomous deep learning models, LLMs, and intelligent neural architectures.",
      by: "Lead: AI",
      pos: "center",
    },
  },
  {
    common: "Creatives",
    binomial: "VISUAL & UI/UX",
    photo: {
      url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
      text: "Transforming abstract visions into striking brand identities, UI/UX designs, and expressive art.",
      by: "Lead: Creatives",
      pos: "center",
    },
  },
  {
    common: "PR Marketing and Media",
    binomial: "GROWTH & OUTREACH",
    photo: {
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
      text: "Building community bridges, managing external communications, and driving impactful campaigns across platforms.",
      by: "Lead: PR Marketing and Media",
      pos: "center",
    },
  },
  {
    common: "Web Development",
    binomial: "NEXT-GEN PLATFORMS",
    photo: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      text: "Crafting immersive, high-performance web applications with cutting-edge modern tech stacks.",
      by: "Lead: Web Dev",
      pos: "center",
    },
  },
  {
    common: "Artificial Intelligence",
    binomial: "INTELLIGENT SYSTEMS",
    photo: {
      url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      text: "Building autonomous deep learning models, LLMs, and intelligent neural architectures.",
      by: "Lead: AI",
      pos: "center",
    },
  },
];

const DOMAIN_DETAILS: Record<string, { tags: string[]; icon: string; stats: string }> = {
  "Web Development": { tags: ["Next.js", "React", "TypeScript", "Tailwind"], icon: "🌐", stats: "12+ Live Portals" },
  "Data Analytics": { tags: ["Python", "SQL", "Tableau", "Predictive BI"], icon: "📊", stats: "10M+ Data Pts" },
  "Artificial Intelligence": { tags: ["PyTorch", "LLMs", "Computer Vision", "Transformers"], icon: "🧠", stats: "98.4% Model Acc" },
  "Creatives": { tags: ["UI/UX", "Figma", "Motion Graphics", "3D Art"], icon: "🎨", stats: "50+ Designs" },
  "PR Marketing and Media": { tags: ["Outreach", "Press", "Content Strategy", "Brand Voice"], icon: "📢", stats: "50K+ Impressions" },
};

export const DomainShowcase: React.FC = () => {
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

      {/* Header Info */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 mb-2">


        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-val-light uppercase tracking-tight font-display mb-2">
          OUR <span className="text-gradient-brand text-glow-brand">DOMAINS</span>
        </h2>

        <p className="text-val-gray font-mono text-xs sm:text-sm max-w-xl tracking-wide uppercase leading-relaxed mb-3">
          Pioneering innovation across our core pillars. Drag or scroll to orbit the 3D gallery.
        </p>

        {/* Drag / Orbit instruction pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#07070a]/80 border border-white/10 text-val-gray text-[10px] font-mono">
          <MoveHorizontal className="w-3 h-3 text-[var(--theme-primary,#ff5e36)] animate-pulse" />
          <span>DRAG OR SCROLL TO ROTATE</span>
        </div>
      </div>

      {/* 3D Circular Gallery Stage */}
      <div className="relative z-10 w-full h-[460px] md:h-[500px] flex items-center justify-center my-2 overflow-visible">
        <CircularGallery
          items={DOMAIN_GALLERY_ITEMS}
          radius={radius}
          autoRotateSpeed={0.04}
        />
      </div>
    </section>
  );
};

export default DomainShowcase;
