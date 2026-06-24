// Canonical profile content. Source: spec-kit 10-content.md (info only).

export const profile = {
  name: "Ahmed Mosaad",
  fullName: "Ahmed Mosaad Mohamed",
  role: "Full-Stack Developer",
  location: "Alexandria, Egypt",
  timezone: "UTC+3",
  status: "Available for work",
  email: "ahmedmosad840@gmail.com",
  tagline:
    "Building interfaces that perform beautifully — at the intersection of design, motion, and code.",
  focus: ["React", "GSAP", "Node.js"],
  cvHref: "/Ahmed_Mosaad_CV.pdf",
  about: {
    headline:
      "I'm Ahmed — a Full-Stack Developer who obsesses over every layer of the stack.",
    paragraph:
      "I work across the entire stack — from crafting fast, accessible, and visually intentional interfaces on the front-end to designing robust APIs and scalable server architectures on the back-end. My toolkit spans React, TypeScript, Node.js, and Next.js.",
    facts: [
      { k: "Currently", v: "Open to opportunities", idx: "01" },
      { k: "Based in", v: "Egypt \u{1F1EA}\u{1F1EC}", idx: "02" },
      { k: "Focus", v: "Full-stack Engineering", idx: "03" },
    ],
  },
} as const;
