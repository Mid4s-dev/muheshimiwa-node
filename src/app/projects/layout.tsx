import { type Metadata } from "next";
import { env } from "~/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://mejjadonk.mid4s.site";

export const metadata: Metadata = {
  title: "Projects & Development Blog",
  description: "Explore ongoing and completed infrastructure, education, and community projects across Embakasi Central. Real maendeleo with measurable impact.",
  keywords: [
    "projects",
    "infrastructure",
    "development",
    "bursaries",
    "community",
    "Embakasi Central",
  ],
  alternates: {
    canonical: `${siteUrl}/projects`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/projects`,
    title: "Development Projects - Embakasi Central",
    description: "Ongoing and completed projects delivering real change in the constituency",
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "Muheshimiwa Projects",
      },
    ],
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
