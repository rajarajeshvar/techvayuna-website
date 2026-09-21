import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PanelReveal } from "@/components/PanelReveal";
import { DomainShowcase } from "@/components/DomainShowcase";
import { CoreTeamSection } from "@/components/CoreTeamSection";
import { PastEventsTimeline } from "@/components/timeline/PastEventsTimeline";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent w-full overflow-hidden">

      {/* Premium Top Navigation */}
      <Navbar />

      {/* Intro Hero Area */}
      <HeroSection />

      {/* Section 1: Matte Black Split-Panel Reveal with Typewriter */}
      <PanelReveal />

      {/* Section 2: Domain Showcase Carousel */}
      <DomainShowcase />

      {/* Section 3: Core Team */}
      <CoreTeamSection />

      {/* Section 4: Past Events Timeline */}
      <PastEventsTimeline />
    </main>
  );
}


