"use client";

import React from "react";

export const PhoenixIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff5e36" />
        <stop offset="50%" stopColor="#f43b86" />
        <stop offset="100%" stopColor="#610094" />
      </linearGradient>
    </defs>
    
    {/* Stylized Head */}
    <path 
      d="M50,30 C49,27 46,24 43,25 C40.5,25.8 38,27 36,25.5 C39,23.5 42.5,22.5 45.5,22 C49,21.5 53,23 54.5,26.5 C55.5,29 52.5,30 50,30 Z" 
      fill="url(#logo-brand-gradient)" 
    />
    
    {/* Stylized Body & Center Tail */}
    <path 
      d="M50,30 C49.5,37 47,44 43.5,49 C39,55.5 35,63.5 35,72 C43.5,66 48,58.5 50,51 C52,58.5 56.5,66 65,72 C65,63.5 61,55.5 56.5,49 C53,44 50.5,37 50,30 Z" 
      fill="url(#logo-brand-gradient)" 
    />
    
    {/* Outer Tail Feathers */}
    <path 
      d="M50,51 C48,61 45,71 37.5,82 C45.5,77 48.5,71 50,63.5 C51.5,71 54.5,77 62.5,82 C55,71 52,61 50,51 Z" 
      fill="url(#logo-brand-gradient)" 
    />
    
    {/* Left Wing (majestic crescent curves) */}
    <path 
      d="M43.5,40 C31.5,34 19,21 16,9 C19.5,17 26.5,26.5 33.5,30 C27.5,24.5 22,17 19.5,9 C24,15.5 31,22.5 39,26 C35,18.5 31,11 30.5,3 C34.5,10.5 40.5,18.5 46.5,24 C42,30.5 42.5,35.5 43.5,40 Z" 
      fill="url(#logo-brand-gradient)" 
    />
    
    {/* Right Wing (symmetrical to Left Wing) */}
    <path 
      d="M56.5,40 C68.5,34 81,21 84,9 C80.5,17 73.5,26.5 66.5,30 C72.5,24.5 78,17 80.5,9 C76,15.5 69,22.5 61,26 C65,18.5 69,11 69.5,3 C65.5,10.5 59.5,18.5 53.5,24 C58,30.5 57.5,35.5 56.5,40 Z" 
      fill="url(#logo-brand-gradient)" 
    />
  </svg>
);

export const FeatherIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="feather-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff5e36" />
        <stop offset="50%" stopColor="#f43b86" />
        <stop offset="100%" stopColor="#610094" />
      </linearGradient>
    </defs>
    <path 
      d="M10,88 Q20,78 30,68 C45,53 58,37 72,17 C68,23 60,31 52,37 Q42,44.5 32,52 C22.5,59 16,66 10,75 C9,76 8.5,77 8,78 C7,79.5 7.5,84.5 10,88 Z" 
      fill="url(#feather-brand-gradient)" 
    />
    {/* Barbs */}
    <path 
      d="M42,44.5 L36,36 M52,37 L45,28 M62,29 L55,20 M28,55 L22,46 M20,62 L15,53" 
      stroke="url(#feather-brand-gradient)" 
      strokeWidth="2.5" 
      strokeLinecap="round"
      opacity="0.75"
    />
  </svg>
);

export const Logo: React.FC<{ className?: string; iconOnly?: boolean }> = ({ 
  className = "", 
  iconOnly = false 
}) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Phoenix Icon */}
      <PhoenixIcon className="w-12 h-12 md:w-14 h-14" />
      
      {!iconOnly && (
        <div className="flex flex-col ml-1 leading-none font-display skew-x-[-10deg]">
          {/* Top Line: TECH */}
          <span 
            className="text-base md:text-lg font-black tracking-widest text-[#ece8e1]"
          >
            TECH
          </span>
          {/* Bottom Line: VAYUNA + Feather */}
          <div className="flex items-center gap-0.5">
            <span 
              className="text-lg md:text-xl font-black tracking-wider text-[#ff5e36]"
            >
              VAYUNA
            </span>
            <div className="w-6 h-6 rotate-[15deg] translate-y-[-4px]">
              <FeatherIcon className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
