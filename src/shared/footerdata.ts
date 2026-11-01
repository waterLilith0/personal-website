import {
  faBluesky,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

export const footerRows = [
  {
    links: [
      {
        url: "/",
        text: "Home",
      },
      {
        url: "/about-contact",
        text: "About Me & Contact",
      },
    ],
  },
  {
    links: [
      {
        url: "/privacy",
        text: "Privacy Policy",
      },
      {
        url: "/impressum",
        text: "Impressum",
      },
      {
        url: "https://dashboard.waterlilith.space",
        text: "Dashboard",
      },
      {
        url: "https://github.com/waterlilith0",
        text: "GitHub",
        icon: faGithub,
      },
      {
        url: "https://bsky.app/profile/waterlilith.space",
        text: "Bluesky",
        icon: faBluesky,
      },
      {
        url: "https://www.linkedin.com/in/miriam-fix-0b96b12aa/",
        text: "LinkedIn",
        icon: faLinkedin,
      },
    ],
  },
];
