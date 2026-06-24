// Socials. Source: spec-kit 10-content.md.

export type Social = {
  label: string;
  handle: string;
  href: string;
  icon: "github" | "linkedin" | "facebook" | "mail";
};

export const socials: Social[] = [
  {
    label: "GitHub",
    handle: "@AhmedMosaad-stack",
    href: "https://github.com/AhmedMosaad-stack",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "Ahmed Mosaad Mohamed",
    href: "https://www.linkedin.com/in/ahmed-mosaad-mohamed-690234364",
    icon: "linkedin",
  },
  {
    label: "Facebook",
    handle: "ahmed.mosad.397948",
    href: "https://www.facebook.com/ahmed.mosad.397948",
    icon: "facebook",
  },
  {
    label: "Email",
    handle: "ahmedmosad840@gmail.com",
    href: "mailto:ahmedmosad840@gmail.com",
    icon: "mail",
  },
];
