"use client";

import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial: string;
  emoji?: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
    by: string;
  };
}

// Define the props for the CircularGallery component
export interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** Optional callback when a card is clicked */
  onItemClick?: (item: GalleryItem) => void;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 330, autoRotateSpeed = 0.05, onItemClick, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const startXRef = useRef(0);
    const startRotRef = useRef(0);
    const hasDraggedRef = useRef(false);

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Effect for auto-rotation when not scrolling and not dragging
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && !isDragging) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, isDragging, autoRotateSpeed]);

    // Drag to rotate handlers
    const handlePointerDown = (e: React.PointerEvent) => {
      setIsDragging(true);
      hasDraggedRef.current = false;
      startXRef.current = e.clientX;
      startRotRef.current = rotation;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startXRef.current;
      if (Math.abs(deltaX) > 3) {
        hasDraggedRef.current = true;
      }
      setRotation(startRotRef.current + deltaX * 0.22);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    const anglePerItem = 360 / items.length;
    
    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn(
          "relative w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing",
          className
        )}
        style={{ perspective: '2000px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        {...props}
      >
        <div
          className="relative w-full h-full pointer-events-none"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.25, 1 - (normalizedAngle / 170));

            return (
              <div
                key={`${item.common}-${i}`} 
                role="group"
                aria-label={item.common}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasDraggedRef.current && onItemClick) {
                    onItemClick(item);
                  }
                }}
                className={cn(
                  "absolute w-[260px] sm:w-[350px] md:w-[410px] h-[250px] sm:h-[290px] md:h-[320px] pointer-events-auto transition-transform duration-300 hover:scale-105 backface-hidden",
                  onItemClick ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
                )}
                style={{
                  transform: `translate(-50%, -50%) rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  opacity: opacity,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transition: 'opacity 0.3s linear, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="relative w-full h-full rounded-2xl shadow-[0_20px_45px_-12px_rgba(0,0,0,0.85)] overflow-hidden group border border-white/[0.08] hover:border-[#ff5e36]/60 bg-gradient-to-b from-[#13111c] via-[#0d0c15] to-[#07060a] p-5 sm:p-6 flex flex-col justify-between backdrop-blur-xl transition-all duration-300">
                  {/* Top brand accent bar */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff5e36] via-[#f43b86] to-transparent z-10" />

                  {/* Subtle ambient interior glow */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#f43b86]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#f43b86]/20 transition-all duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#ff5e36] uppercase bg-[#14121c] px-2.5 py-0.5 rounded border border-[#ff5e36]/30">
                        {item.binomial}
                      </span>
                      {item.emoji && (
                        <span className="text-2xl sm:text-3xl select-none transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                          {item.emoji}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white group-hover:text-[#f43b86] transition-colors duration-300 mb-2">
                      {item.common}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans line-clamp-3">
                      {item.photo.text}
                    </p>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-white/10 flex items-center">
                    <p className="text-[11px] sm:text-xs font-mono text-white/70">{item.photo.by}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
