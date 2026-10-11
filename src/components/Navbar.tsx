"use client";

import React from "react";
import { Logo } from "@/components/Logo";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between select-none transition-all duration-300">
      {/* Logo Area */}
      <Logo />

      {/* Center Nav Items */}
      <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest font-editorial italic text-val-gray">
        <a href="#introduction" className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all">
          INTRODUCTION
        </a>
        <a href="#domains" className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all">
          DOMAINS
        </a>
        <a href="#core-team" className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all">
          CORE TEAM
        </a>
        <a href="#past-events" className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all">
          PAST EVENTS
        </a>
      </div>


    </nav>
  );
};
