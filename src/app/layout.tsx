import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Space_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";
import { InteractiveThemeCube } from "@/components/InteractiveThemeCube";

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

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Tech Vayuna | Innovation & Technology Club",
  description: "Official website for Tech Vayuna, built with Next.js, React, GSAP ScrollTrigger, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${spaceGrotesk.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="/miraj-background/background.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b0c10] text-[#ece8e1] overflow-x-hidden font-sans">
        <ThemeProvider>
          <CustomCursor />
          <InteractiveThemeCube />
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
