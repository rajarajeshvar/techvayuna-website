"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Volume2, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardSocials = {
  github?: string;
  linkedin?: string;
  instagram?: string;
};

export type CardType = {
  title?: string;
  name?: string;
  role?: string;
  src: string;
  audioSrc?: string;
  socials?: CardSocials;
};

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72-.77-1.72-1.72s.77-1.72 1.72-1.72 1.73.77 1.73 1.72c0 .95-.78 1.72-1.73 1.72m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    isPlaying,
    onToggleAudio,
  }: {
    card: CardType;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    isPlaying?: boolean;
    onToggleAudio?: (index: number, src: string) => void;
  }) => {
    const isHovered = hovered === index;
    const displayName = card.name || card.title;

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setHovered(isHovered ? null : index)}
        className={cn(
          "rounded-xl relative bg-neutral-900 overflow-hidden h-72 md:h-96 w-full transition-all duration-300 ease-out border group cursor-pointer",
          isPlaying
            ? "border-val-red ring-2 ring-val-red/50 shadow-[0_0_30px_rgba(244,59,134,0.45)] scale-[1.01]"
            : "border-white/10 hover:border-white/30",
          hovered !== null && !isHovered && "md:blur-sm md:scale-[0.98] md:opacity-75"
        )}
      >
        <Image
          src={card.src}
          alt={displayName || "Team member"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-[center_15%] absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Voice Intro Badge */}
        {card.audioSrc && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAudio?.(index, card.audioSrc!);
            }}
            className={cn(
              "absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 font-mono text-xs uppercase tracking-wider select-none",
              isPlaying
                ? "bg-val-red text-black font-bold shadow-[0_0_20px_rgba(244,59,134,0.8)] scale-105"
                : "bg-black/60 hover:bg-val-red hover:text-black text-white/90 border border-white/20 hover:border-val-red backdrop-blur-md"
            )}
            title={isPlaying ? "Pause voice intro" : "Play voice intro"}
            aria-label={isPlaying ? "Pause voice intro" : "Play voice intro"}
          >
            {isPlaying ? (
              <>
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-black animate-[pulse_0.4s_ease-in-out_infinite] h-3" />
                  <span className="w-0.5 bg-black animate-[pulse_0.6s_ease-in-out_infinite_0.15s] h-2" />
                  <span className="w-0.5 bg-black animate-[pulse_0.5s_ease-in-out_infinite_0.1s] h-3.5" />
                </span>
                <span className="text-[10px] font-bold">PLAYING</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-val-red group-hover:text-black transition-colors" />
                <span className="text-[10px] font-semibold">INTRO</span>
              </>
            )}
          </button>
        )}

        {/* Overlay Content */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end py-5 px-5 sm:py-6 sm:px-6 transition-all duration-300",
            isHovered
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-95 md:opacity-0 translate-y-0 md:translate-y-2 pointer-events-auto md:pointer-events-none"
          )}
        >
          {card.role && (
            <div className="text-xs font-mono font-bold tracking-[0.2em] text-val-red uppercase mb-1">
              {card.role}
            </div>
          )}

          {displayName && (
            <div className="text-xl md:text-2xl font-black tracking-wide text-white drop-shadow-md uppercase">
              {displayName}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3 pointer-events-auto">
            {/* Audio Toggle in Details */}
            {card.audioSrc && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAudio?.(index, card.audioSrc!);
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 backdrop-blur-sm",
                  isPlaying
                    ? "bg-val-red text-black shadow-[0_0_15px_rgba(244,59,134,0.6)]"
                    : "bg-white/10 hover:bg-val-red hover:text-black text-white"
                )}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>PAUSE INTRO</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>PLAY INTRO</span>
                  </>
                )}
              </button>
            )}

            {/* Social Links */}
            {card.socials && (
              <div className="flex items-center gap-2">
                {card.socials.github && (
                  <a
                    href={card.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 hover:bg-val-red hover:text-black text-white transition-all duration-200 backdrop-blur-sm"
                    aria-label="GitHub profile"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {card.socials.linkedin && (
                  <a
                    href={card.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 hover:bg-val-red hover:text-black text-white transition-all duration-200 backdrop-blur-sm"
                    aria-label="LinkedIn profile"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {card.socials.instagram && (
                  <a
                    href={card.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 hover:bg-val-red hover:text-black text-white transition-all duration-200 backdrop-blur-sm"
                    aria-label="Instagram profile"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: CardType[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggleAudio = (index: number, src: string) => {
    if (playingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingIndex(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const audio = new Audio(src);
      audioRef.current = audio;
      setPlayingIndex(index);

      audio.play().catch((err) => {
        console.warn("Audio playback error:", err);
        setPlayingIndex(null);
      });

      audio.onended = () => {
        setPlayingIndex(null);
      };
    } catch (e) {
      console.warn("Audio init error:", e);
      setPlayingIndex(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 md:px-6 w-full">
      {cards.map((card, index) => (
        <Card
          key={`${card.name || card.title || "card"}-${index}`}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          isPlaying={playingIndex === index}
          onToggleAudio={handleToggleAudio}
        />
      ))}
    </div>
  );
}
