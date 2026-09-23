"use client";

import React, { useState } from "react";
import type { TimelineEvent } from "./timelineData";

interface TimelineEventCardProps {
  event: TimelineEvent;
  /** Whether this card is on the left (true) or right (false) */
  isLeft: boolean;
  /** Whether the card has been revealed by scroll */
  isRevealed: boolean;
  /** Index for stagger delays */
  index: number;
  /** Vertical position as percentage of the canvas height */
  topPercent: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Glassmorphism holographic event card with border-draw reveal.
 * The card starts blurred and materializes like a futuristic hologram.
 */

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  event,
  isLeft,
  isRevealed,
  index,
  topPercent,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Combine main image and carousel images for the gallery
  const allImages = [event.mainImage, ...(event.carouselImages || [])].filter(Boolean);
  return (
    <div
      className={`timeline-card ${isLeft ? "timeline-card--left" : "timeline-card--right"} ${
        isRevealed ? "timeline-card--revealed" : ""
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ "--card-index": index, top: `${topPercent}%`, transform: "translateY(-50%)" } as React.CSSProperties}
    >
      {/* Oversized year watermark */}
      <div className="timeline-card__year-watermark" aria-hidden="true">
        {event.year}
      </div>

      {/* Valorant Tactical HUD Card Body */}
      <div className="timeline-card__glass group">
        {/* Top Header Tactical Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3 font-mono text-[9px] tracking-widest text-[#C4BFC9] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D83A60] rounded-none animate-pulse" />
            <span className="text-[#D83A60] font-bold">LOG // 0{index + 1}</span>
            <span className="text-[#7A7584]">|</span>
            <span className="text-white font-medium">{event.date}</span>
          </div>
          <span className="px-1.5 py-0.5 border border-[#D83A60]/40 bg-[#D83A60]/10 backdrop-blur-sm text-[#D83A60] text-[8px] tracking-[0.2em] font-bold">
            ARCHIVE // {event.year}
          </span>
        </div>

        {/* Content */}
        <div className="timeline-card__content">
          {/* Main Image Gallery */}
          {allImages.length > 0 && (
            <div className="timeline-card__gallery">
              <div className="timeline-card__image-wrapper relative overflow-hidden group/img">
                <img 
                  src={allImages[activeImageIndex]} 
                  alt={`${event.title} gallery`} 
                  className="timeline-card__image" 
                  loading="lazy"
                />
                {/* Tactical targeting overlay */}
                <div className="absolute top-2 left-2 z-10 font-mono text-[8px] text-[#D83A60] bg-black/50 backdrop-blur-sm px-1.5 py-0.5 border border-[#D83A60]/30 tracking-widest">
                  IMG_SRC // 0{activeImageIndex + 1}
                </div>
                <div className="absolute bottom-2 right-2 z-10 w-3 h-3 border-r-2 border-b-2 border-[#D83A60]" />
                <div className="absolute top-2 right-2 z-10 w-3 h-3 border-r-2 border-t-2 border-[#D83A60]" />
              </div>
              
              {allImages.length > 1 && (
                <div className="timeline-card__thumbnails">
                  {allImages.slice(0, 5).map((src, idx) => (
                    <button
                      key={idx}
                      className={`timeline-card__thumbnail ${idx === activeImageIndex ? "timeline-card__thumbnail--active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(idx);
                      }}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img src={src} alt={`Thumbnail ${idx + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="timeline-card__title font-display uppercase tracking-tight">{event.title}</h3>

          {/* Description */}
          <p className="timeline-card__desc">{event.description}</p>

          {/* Badge & Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
            <div className="timeline-card__badge">
              <span className="timeline-card__badge-icon">{event.badgeIcon}</span>
              <span className="timeline-card__badge-text">{event.badge}</span>
            </div>

            {/* Learn More Tactical Action */}
            <button className="timeline-card__btn" type="button">
              <span className="timeline-card__btn-text">INSPECT</span>
              <span className="timeline-card__btn-arrow">▶</span>
            </button>
          </div>
        </div>

        {/* Tactical Corner Bracket Accents (Valorant HUD Style) */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D83A60] pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D83A60] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D83A60] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D83A60] pointer-events-none" />

        {/* Dispersion particles on reveal */}
        <div className="timeline-card__particles" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="timeline-card__particle" style={{ "--p-i": i } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  );
};
