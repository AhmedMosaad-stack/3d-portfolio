// Skills. Source: spec-kit 10-content.md — extended with short descriptors so
// the Stack chamber can actually say what each tool is used for.

export type Skill = { name: string; note: string };
export type SkillPlane = {
  id: string;
  title: string;
  blurb: string;
  items: Skill[];
};

export const skillPlanes: SkillPlane[] = [
  {
    id: "front",
    title: "Front-End",
    blurb: "Where I live — interfaces that look intentional and perform.",
    items: [
      { name: "React", note: "Component architecture, hooks, RSC" },
      { name: "Next.js", note: "App Router, SSR / SSG, routing" },
      { name: "TypeScript", note: "Strict types across the codebase" },
      { name: "GSAP", note: "Scroll-driven cinematic motion" },
      { name: "Tailwind CSS", note: "Design-token styling at speed" },
    ],
  },
  {
    id: "back",
    title: "Back-End",
    blurb: "Equally fluent on the server when a project calls for it.",
    items: [
      { name: "Node.js", note: "APIs, services, tooling" },
      { name: "Express", note: "REST endpoints & middleware" },
      { name: "PostgreSQL", note: "Relational data & queries" },
      { name: "MongoDB", note: "Document stores & aggregation" },
      { name: "REST APIs", note: "Auth, validation, integration" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    blurb: "The kit that keeps everything shipping.",
    items: [
      { name: "Git / GitHub", note: "Branching, reviews, CI" },
      { name: "Figma", note: "Design handoff & specs" },
      { name: "VS Code", note: "Daily driver, tuned" },
      { name: "Vite", note: "Fast builds & dev server" },
    ],
  },
];

export const skillsClosingLine =
  "— and a stubborn refusal to ship slow interfaces.";
