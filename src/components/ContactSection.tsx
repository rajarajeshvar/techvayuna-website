"use client";

import React, { useState } from "react";
import { Terminal, Send, CheckCircle2, Shield, Radio } from "lucide-react";

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setIsSent(false), 5000);
    }, 900);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-24 md:py-32 bg-transparent select-none overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Valorant Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#D83A60]/15 text-[#D83A60] border border-[#D83A60]/40 tracking-widest uppercase">
              SEC_05
            </span>
            <span className="text-[10px] font-mono tracking-[0.25em] text-val-gray/70 uppercase flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#D83A60]" />
              // TRANSMIT_PROTOCOL
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-val-light uppercase tracking-tight font-display mb-3">
            CONNECT WITH <span className="text-[#D83A60]">VAYUNA</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-val-gray tracking-widest uppercase max-w-md">
            Direct secure communication uplink // Questions, collaborations & partnerships
          </p>
          <div className="w-16 h-0.5 bg-[#D83A60]/50 mt-5" />
        </div>

        {/* Tactical Contact Terminal Container */}
        <div
          className="relative bg-[#120E18]/90 border border-white/10 p-8 sm:p-12 clip-corner-sm backdrop-blur-md"
          style={{
            boxShadow:
              "0 24px 60px -15px rgba(0, 0, 0, 0.9), inset 0 0 24px rgba(216, 58, 96, 0.04)",
          }}
        >
          {/* Top Tactical Status Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 font-mono text-[10px] tracking-widest text-val-gray/80 uppercase">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#D83A60] rounded-none animate-ping" />
              <span className="text-[#D83A60] font-bold">ENCRYPTED // CHANNEL_01</span>
              <span className="text-white/20">|</span>
              <span className="text-white/70">STATUS: READY</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-[#D83A60]">
              <Shield className="w-3 h-3" />
              <span>TLS_256</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-xs text-[#E8E4DD] tracking-wider uppercase"
                >
                  <span className="text-[#D83A60] mr-1.5">//</span>OPERATOR NAME
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="IDENTIFIER"
                  className="w-full bg-[#14111A]/95 border border-white/10 px-4 py-3 font-mono text-xs sm:text-sm text-[#E8E4DD] placeholder:text-val-gray/40 focus:outline-none focus:border-[#D83A60] focus:ring-1 focus:ring-[#D83A60]/40 transition-all clip-corner-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-xs text-[#E8E4DD] tracking-wider uppercase"
                >
                  <span className="text-[#D83A60] mr-1.5">//</span>COMM FREQUENCY (EMAIL)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  placeholder="OPERATOR@DOMAIN.COM"
                  className="w-full bg-[#14111A]/95 border border-white/10 px-4 py-3 font-mono text-xs sm:text-sm text-[#E8E4DD] placeholder:text-val-gray/40 focus:outline-none focus:border-[#D83A60] focus:ring-1 focus:ring-[#D83A60]/40 transition-all clip-corner-sm"
                />
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="block font-mono text-xs text-[#E8E4DD] tracking-wider uppercase"
              >
                <span className="text-[#D83A60] mr-1.5">//</span>TRANSMISSION PAYLOAD (MESSAGE)
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                placeholder="STATE YOUR PURPOSE OR INQUIRY..."
                className="w-full bg-[#14111A]/95 border border-white/10 p-4 font-mono text-xs sm:text-sm text-[#E8E4DD] placeholder:text-val-gray/40 focus:outline-none focus:border-[#D83A60] focus:ring-1 focus:ring-[#D83A60]/40 transition-all clip-corner-sm resize-none"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 font-mono text-[10px] text-val-gray tracking-widest uppercase">
                <Radio className="w-3.5 h-3.5 text-[#D83A60] animate-pulse" />
                <span>SECURE_UPLINK_READY</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#D83A60] hover:bg-[#E04A70] text-[#0D0B0F] font-mono text-xs font-black tracking-[0.25em] uppercase transition-all duration-200 clip-corner-sm flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(216,58,96,0.35)] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-2 h-2 bg-[#0D0B0F] rounded-full animate-ping" />
                    <span>TRANSMITTING...</span>
                  </>
                ) : isSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#0D0B0F]" />
                    <span>PAYLOAD DELIVERED</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tactical Corner Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D83A60] pointer-events-none" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D83A60] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D83A60] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D83A60] pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
