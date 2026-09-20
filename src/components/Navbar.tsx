"use client";

import React from "react";
import { Logo } from "@/components/Logo";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-val-light/10 bg-val-bg/80 backdrop-blur-md px-6 py-3 flex items-center justify-between select-none">
      {/* Logo Area */}
      <Logo />

      {/* Center Nav Items */}
      <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest font-mono text-val-gray">
        <a href="#introduction" className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all">
          <span className="text-val-red text-[10px]">//</span> INTRODUCTION
        </a>
        <a href="#domains" className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all">
          <span className="text-val-red text-[10px]">//</span> DOMAINS
        </a>
        <a href="#core-team" className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all">
          <span className="text-val-red text-[10px]">//</span> CORE TEAM
        </a>
        <a href="#past-events" className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all">
          <span className="text-val-red text-[10px]">//</span> PAST EVENTS
        </a>
      </div>

      {/* Right Side Stats */}
      <div className="flex items-center gap-4 text-right">
        <div className="hidden sm:flex flex-col">
          <span className="text-[10px] font-mono text-val-gray">SYS_STATUS</span>
          <span className="text-xs font-mono font-bold text-val-blue animate-pulse">ACTIVE // ONLINE</span>
        </div>
        <div className="h-8 w-[1px] bg-val-light/10 hidden sm:block" />
        <button className="px-4 py-1.5 bg-transparent border border-val-red/50 hover:bg-val-red hover:text-val-dark text-val-red text-xs font-black tracking-widest uppercase transition-all duration-300 clip-corner-sm font-mono">
          INITIATE
        </button>
      </div>
    </nav>
  );
};
