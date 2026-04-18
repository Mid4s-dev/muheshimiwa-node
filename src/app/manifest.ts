import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muheshimiwa - Embakasi Central Campaign",
    short_name: "Muheshimiwa",
    description: "Vote for Real Change. Hon. Mejja Donk for Embakasi Central MP",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#016629",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile.svg",
        sizes: "540x720",
        type: "image/svg+xml",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/desktop.svg",
        sizes: "1280x720",
        type: "image/svg+xml",
        form_factor: "wide",
      },
    ],
    categories: ["productivity", "government"],
    shortcuts: [
      {
        name: "Join Supporter List",
        short_name: "Uko Kadi",
        description: "Join the Muheshimiwa mailing list for campaign updates",
        url: "/register",
        icons: [
          {
            src: "/icons/register.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
    ],
  };
}
