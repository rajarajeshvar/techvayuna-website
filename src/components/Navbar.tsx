"use client";

import React, { useState } from "react";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#introduction", label: "INTRODUCTION" },
    { href: "#domains", label: "DOMAINS" },
    { href: "#core-team", label: "CORE TEAM" },
    { href: "#past-events", label: "PAST EVENTS" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#07070a]/70 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between select-none border-b border-white/[0.06] transition-all duration-300">
      {/* Logo Area */}
      <Logo />

      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest font-editorial italic text-val-gray">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-val-red transition-colors flex items-center gap-1.5 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-val-red hover:after:w-full after:transition-all"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        className="md:hidden p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-val-light border border-white/10 transition-colors focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5 text-val-red" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Nav Overlay / Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#07070a]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-5 md:hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold font-editorial italic tracking-wider text-val-light hover:text-val-red transition-colors py-2 border-b border-white/[0.05]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
