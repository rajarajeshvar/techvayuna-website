"use client";

import React from "react";
import { FocusCards } from "@/components/ui/focus-cards";

export function FocusCardsDemo() {
  const cards = [
    {
      role: "PRESIDENT",
      name: "PRABODH RAJ U R",
      title: "PRABODH RAJ U R",
      src: "/images/prabodh.jpeg",
      audioSrc: "/audio/prabodh.m4a",
      socials: {
        github: "https://github.com/Prabodh-dev",
        linkedin: "https://www.linkedin.com/in/prabodhrajur/",
        instagram: "https://www.instagram.com/_prabodh_pf_?stkn=MTZ0aHhucnBtNm9uZA%3D%3D&utm_source=qr",
      },
    },
    {
      role: "VICE PRESIDENT",
      name: "G. K. AKASHGAUTHAM",
      title: "G. K. AKASHGAUTHAM",
      src: "/images/akashgautham.jpeg",
      audioSrc: "/audio/akashgautham.mp3",
      socials: {
        github: "https://github.com/Akashgautham",
        linkedin: "https://www.linkedin.com/in/g-k-akashgautham-a7a37932b",
        instagram: "https://www.instagram.com/gautham__offl/",
      },
    },
    {
      role: "TECHNICAL HEAD",
      name: "GAYATHRI M",
      title: "GAYATHRI M",
      src: "/images/gayathri.jpeg",
      audioSrc: "/audio/gayathri.mp3",
      socials: {
        github: "https://github.com/gayathri-manoj",
        linkedin: "https://www.linkedin.com/in/gayathri-m-427948398/",
        instagram: "https://www.instagram.com/_gayathri_06_?stkn=enZjdmk4YjRoanll",
      },
    },
    {
      role: "WEB DEVELOPMENT LEAD",
      name: "KRISHNAN.D",
      title: "KRISHNAN.D",
      src: "/krishnan.jpg",
      audioSrc: "/audio/krishnan.ogg",
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        instagram: "https://instagram.com",
      },
    },
    {
      role: "NON-TECH LEAD",
      name: "BHARGAV.M",
      title: "BHARGAV.M",
      src: "/images/bhargav.jpg",
      audioSrc: "/audio/bhargav.wav",
      socials: {
        linkedin: "https://www.linkedin.com/in/bhargav-m-124ab432b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        instagram: "https://www.instagram.com/dude.bhargav?stkn=MXFtYXVpOGp3ajF3eA==",
      },
    },
    {
      role: "DATA ANALYTICS LEAD",
      name: "S SRISANTOSHI",
      title: "S SRISANTOSHI",
      src: "/images/srisantoshi.jpeg",
      audioSrc: "/audio/srisantoshi.m4a",
      socials: {
        github: "https://github.com/SSRISANTOSHI/",
        linkedin: "https://www.linkedin.com/in/s-srisantoshi-b2b148326",
      },
    },
    {
      role: "AI DOMAIN LEAD",
      name: "SOFIA JASMINE",
      title: "SOFIA JASMINE",
      src: "/images/sofia.jpeg",
      audioSrc: "/audio/sofia.mp3",
      socials: {
        github: "https://github.com/Sofia-Jasmine",
        linkedin: "https://www.linkedin.com/in/sofia-jasmine-08598631b/",
        instagram: "https://www.instagram.com/sofiajasmine_15?stkn=ZnJodWN3NnN0cHFi",
      },
    },
    {
      role: "CREATIVES LEAD",
      name: "K. CHARUNETHRA",
      title: "K. CHARUNETHRA",
      src: "/images/charunethra.jpg",
      audioSrc: "/audio/charunethra.m4a",
      socials: {
        linkedin: "https://www.linkedin.com/in/charu-nethra-7b62a3336?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        instagram: "https://www.instagram.com/charunethrakannan?stkn=MXF2aHNkY2F5ZTF0eQ==",
      },
    },
    {
      role: "PR & MEDIA LEAD",
      name: "R. GUNASEKARAN",
      title: "R. GUNASEKARAN",
      src: "/images/gunasekaran.jpg",
      audioSrc: "/audio/gunasekaran.m4a",
      socials: {
        github: "https://github.com/dunkydood",
        linkedin: "https://www.linkedin.com/in/gunasekaran777",
        instagram: "https://www.instagram.com/guna.tf?stkn=MTA1eGt2ZHBpNXN2OQ==",
      },
    },
    {
      role: "PR & MARKETING LEAD",
      name: "A.L. AMIRTHA KRISHNA",
      title: "A.L. AMIRTHA KRISHNA",
      src: "/images/amirthakrishna.jpg",
      audioSrc: "/audio/amirthakrishna.m4a",
      socials: {
        linkedin: "https://www.linkedin.com/in/amirtha-krishna-a-l-191128331?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      },
    },
  ];

  return <FocusCards cards={cards} />;
}

export const CoreTeamSection: React.FC = () => {
  return (
    <section id="core-team" className="relative w-full min-h-screen bg-transparent py-24 md:py-32 overflow-hidden">
      {/* Subtle Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="text-val-red font-mono text-sm tracking-[0.2em] mb-3 uppercase">
            Core Team
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 uppercase tracking-wider">
            The Minds Behind
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-editorial italic text-val-red uppercase tracking-wider">
            Tech Vayuna
          </h2>
          
          <p className="mt-4 text-white/60 max-w-2xl text-base md:text-lg font-light leading-relaxed">
            A group of passionate innovators, builders and dreamers united by the vision to create impact through technology.
          </p>
        </div>

        {/* Focus Cards Grid */}
        <FocusCardsDemo />
      </div>
    </section>
  );
};

export default CoreTeamSection;
