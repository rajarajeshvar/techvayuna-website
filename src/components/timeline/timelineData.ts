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
    year: "2024",
    date: "MAR 2024",
    title: "APP FUSION",
    description:
      "A high-stakes frontend clash testing speed and precision over three rounds, judged on pixel-perfect accuracy, interactive functionality, and elegant code craftsmanship.",
    badge: "",
    badgeIcon: "",
    mainImage: "/images/eventcardimg1.jpg",
    carouselImages: [
      "/images/altimage1.jpg"
    ]
  },
  {
    id: "evt-002",
    year: "2024",
    date: "OCT 2024",
    title: "DATA 600028",
    description:
      "An interactive deep dive into data analytics using real-world cricket metrics, combining insightful breakdown sessions with active, practical problem-solving for the audience.",
    badge: "",
    badgeIcon: "",
    mainImage: "/images/eventcardimg2.png",
    carouselImages: [
      "/images/altimage2.png"
    ]
  },
  {
    id: "evt-003",
    year: "2025",
    date: "FEB 2025",
    title: "IDEARENA",
    description:
      "Idea Arena challenges innovators to articulate their vision, testing their analytical clarity, presentation strength, and ingenuity under constructive critique.",
    badge: "",
    badgeIcon: "",
    mainImage: "/images/eventcardimg3.png",
    carouselImages: [
      "/images/altimage3.png"
    ]
  },
  {
    id: "evt-004",
    year: "2025",
    date: "AUG 2025",
    title: "QUANTUMANIA",
    description:
      "A forward-looking seminar diving beyond classical bits, giving curious minds the essential principles and real-world use cases driving modern quantum technologies.",
    badge: "",
    badgeIcon: "",
    mainImage: "/images/eventcardimg4.png",
    carouselImages: [
      "/images/altimage4.png"
    ]
  },
  {
    id: "evt-005",
    year: "2026",
    date: "FEB 2026",
    title: "DATA DETOX",
    description:
      "Tackling the unglamorous side of data science—participants dove into raw, messy tables, mastering critical techniques to filter noise and structure high-integrity data.",
    badge: "",
    badgeIcon: "",
    mainImage: "/images/IMG-20260227-WA0033.jpg",
    carouselImages: [
      "/images/IMG-20260227-WA0059.jpg"
    ]
  },
];
