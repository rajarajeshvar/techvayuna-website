import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";
import { InteractiveThemeCube } from "@/components/InteractiveThemeCube";
import { AsciiTexture } from "@/components/AsciiTexture";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VALORANT Cinematic Scroll Experience | Premium Typography Reveal",
  description: "A premium, bold, and cinematic scroll-triggered experience inspired by VALORANT, built with Next.js, React, GSAP ScrollTrigger, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="/miraj-background/background.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0D0B0F] text-[#E8E4DD] overflow-x-hidden font-sans">
        <ThemeProvider>
          <CustomCursor />
          <InteractiveThemeCube />
          <AsciiTexture />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/miraj-background/background.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
