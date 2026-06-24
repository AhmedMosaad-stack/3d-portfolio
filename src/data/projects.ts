// Projects. Source: spec-kit 10-content.md. Screenshots auto-captured into
// /public/screenshots/<id>.webp (Phase 4).

export type Project = {
  id: string;
  number: string;
  name: string;
  category: string;
  brief: string;
  stack: string[];
  liveUrl: string;
  screenshot: string;
};

export const projects: Project[] = [
  {
    id: "re-travel",
    number: "01",
    name: "RE Travel Dashboard",
    category: "Admin Dashboard",
    brief:
      "A full-featured travel agency admin dashboard with 5 dedicated modules — Overview, Bookings, Destinations, Customers, and Revenue. Built with Shadcn UI for a clean, accessible component system and role-based layout with Super Admin controls.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
    liveUrl: "https://re-dashboard-nine.vercel.app/dashboard/overview",
    screenshot: "/screenshots/re-travel.webp",
  },
  {
    id: "al-saad",
    number: "02",
    name: "Al-Saad Construction",
    category: "Corporate Website",
    brief:
      "A premium bilingual (AR/EN) corporate website for a 30-year-old Alexandria construction company. Animated stats counters, full project gallery, and a rich legacy section.",
    stack: ["Next.js", "Tailwind CSS", "GSAP"],
    liveUrl: "https://al-saad-constructions.vercel.app/",
    screenshot: "/screenshots/al-saad.webp",
  },
  {
    id: "exclusive",
    number: "03",
    name: "Exclusive E-Commerce",
    category: "E-Commerce Store",
    brief:
      "A fully functional storefront with flash sales, countdown timers, filtering, cart management, authentication, and a complete checkout flow.",
    stack: ["React", "Next.js", "REST API", "Tailwind CSS"],
    liveUrl: "https://e-commerce-theta-virid-32.vercel.app/",
    screenshot: "/screenshots/exclusive.webp",
  },
  {
    id: "el-sherouq",
    number: "04",
    name: "El-Sherouq Hospital",
    category: "Healthcare Platform",
    brief:
      "Bilingual hospital platform with department listings, doctor profiles with booking, appointments, and a 24/7 emergency section — designed for clarity and trust.",
    stack: ["Next.js", "Tailwind CSS", "TypeScript"],
    liveUrl: "https://hospital-demo-ten.vercel.app/",
    screenshot: "/screenshots/el-sherouq.webp",
  },
  {
    id: "social-median",
    number: "05",
    name: "Social Median",
    category: "Social Media App",
    brief:
      "Full-stack social application — post, follow, like, and interact in real time. Authentication, dynamic feed, and a responsive UI mirroring modern social platforms.",
    stack: ["React", "Node.js", "MongoDB", "Express"],
    liveUrl: "https://my-social-app-kyvc.vercel.app/",
    screenshot: "/screenshots/social-median.webp",
  },
];
