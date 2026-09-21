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
                key={item.photo.url} 
                role="group"
                aria-label={item.common}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasDraggedRef.current && onItemClick) {
                    onItemClick(item);
                  }
                }}
                className="absolute w-[300px] sm:w-[360px] md:w-[410px] h-[260px] sm:h-[290px] md:h-[320px] pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 backface-hidden"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-150px',
                  marginTop: '-130px',
                  opacity: opacity,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transition: 'opacity 0.3s linear, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="relative w-full h-full rounded-2xl shadow-[0_20px_45px_-12px_rgba(0,0,0,0.85)] overflow-hidden group border border-white/[0.08] hover:border-[#ff5e36]/60 bg-[#0d0c14]/95 backdrop-blur-xl transition-all duration-300">
                  {/* Matte top accent bar */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ff5e36]/80 z-10" />

                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />

                  {/* Matte dark overlay with cyber details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a10] via-[#0b0a10]/65 to-transparent text-white flex flex-col justify-end p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono tracking-widest text-[#ff5e36] uppercase bg-[#14121c]/90 px-2 py-0.5 rounded border border-[#ff5e36]/30">
                        {item.binomial}
                      </span>
                      <span className="text-[9px] font-mono text-white/60">// SEC_0{i + 1}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white group-hover:text-[#f43b86] transition-colors duration-300">
                      {item.common}
                    </h3>

                    <p className="text-xs mt-1 line-clamp-2 text-white/85 leading-relaxed font-sans max-w-md">
                      {item.photo.text}
                    </p>

                    <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <p className="text-[11px] font-mono text-white/70">{item.photo.by}</p>
                      <span className="text-[10px] font-mono font-bold text-[#f43b86] tracking-wider uppercase group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>INSPECT</span>
                        <span>&rarr;</span>
                      </span>
                    </div>
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
