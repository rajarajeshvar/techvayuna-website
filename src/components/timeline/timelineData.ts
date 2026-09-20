export interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  description: string;
  badge: string;
  badgeIcon: string;
  mainImage: string;
  carouselImages: string[];
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "evt-001",
    year: "2022",
    date: "SEP 2022",
    title: "THE GENESIS",
    description:
      "Tech Vayuna was born from a shared vision — a group of passionate minds committed to bridging the gap between curiosity and innovation. The founding team laid the groundwork for what would become a thriving tech community.",
    badge: "Founded",
    badgeIcon: "🔥",
    mainImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop",
    carouselImages: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "evt-002",
    year: "2023",
    date: "JAN 2023",
    title: "INAUGURAL HACKATHON",
    description:
      "Our first 36-hour hackathon brought together 120+ developers, designers, and dreamers. Teams built real-world solutions, and the winning project went on to be deployed at scale.",
    badge: "120+ Participants",
    badgeIcon: "⚡",
    mainImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
    carouselImages: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "evt-003",
    year: "2023",
    date: "AUG 2023",
    title: "WORKSHOP SERIES",
    description:
      "A semester-long deep-dive into cutting-edge technologies — from AI/ML pipelines to cloud-native architectures. Industry mentors joined hands with our community to deliver hands-on, project-based learning.",
    badge: "12 Workshops",
    badgeIcon: "🛠️",
    mainImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
    carouselImages: [
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "evt-004",
    year: "2024",
    date: "MAR 2024",
    title: "TECH SUMMIT 1.0",
    description:
      "Our flagship annual summit featured keynotes from industry leaders, panel discussions on emerging tech, and a live demo arena. Over 500 attendees experienced the future of technology firsthand.",
    badge: "500+ Attendees",
    badgeIcon: "🏆",
    mainImage: "https://images.unsplash.com/photo-1475721025592-567c9c0c69d8?q=80&w=600&auto=format&fit=crop",
    carouselImages: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "evt-005",
    year: "2025",
    date: "FEB 2025",
    title: "NATIONAL RECOGNITION",
    description:
      "Tech Vayuna was recognized among the top student-led tech communities in the country. Our projects, events, and community impact earned national acclaim and opened doors to prestigious collaborations.",
    badge: "Top Community",
    badgeIcon: "🌟",
    mainImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    carouselImages: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop"
    ]
  },
];
