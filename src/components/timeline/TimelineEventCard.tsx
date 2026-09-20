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
      <div className="timeline-card__year-watermark" style={{ color: "red" }} aria-hidden="true">
        {event.year}
      </div>

      {/* Glass card body */}
      <div className="timeline-card__glass">
        {/* Animated border (SVG stroke draw) */}
        <svg className="timeline-card__border-svg" viewBox="0 0 400 280" preserveAspectRatio="none">
          <rect
            className="timeline-card__border-rect"
            x="1"
            y="1"
            width="398"
            height="278"
            rx="14"
            ry="14"
            fill="none"
            strokeWidth="1"
          />
        </svg>

        {/* Content */}
        <div className="timeline-card__content">
          {/* Main Image Gallery */}
          {allImages.length > 0 && (
            <div className="timeline-card__gallery">
              <div className="timeline-card__image-wrapper">
                <img 
                  src={allImages[activeImageIndex]} 
                  alt={`${event.title} gallery`} 
                  className="timeline-card__image" 
                  loading="lazy"
                />
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

          {/* Date */}
          <div className="timeline-card__date">
            <span className="timeline-card__date-dot" />
            {event.date}
          </div>

          {/* Title */}
          <h3 className="timeline-card__title">{event.title}</h3>

          {/* Description */}
          <p className="timeline-card__desc">{event.description}</p>

          {/* Badge */}
          <div className="timeline-card__badge">
            <span className="timeline-card__badge-icon">{event.badgeIcon}</span>
            <span className="timeline-card__badge-text">{event.badge}</span>
          </div>

          {/* Learn More */}
          <button className="timeline-card__btn" type="button">
            <span className="timeline-card__btn-text">Learn More</span>
            <span className="timeline-card__btn-arrow">→</span>
          </button>
        </div>

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
