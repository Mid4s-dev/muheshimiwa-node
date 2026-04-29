import { type Metadata } from "next";
import { env } from "~/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://mejjadonk.mid4s.site";

export const metadata: Metadata = {
  title: "Polling Stations - Embakasi Central",
  description: "Find your polling station quickly with school names, codes, and locations. Get directions to vote in Embakasi Central with Google Maps integration.",
  keywords: [
    "polling stations",
    "voting",
    "election",
    "schools",
    "Embakasi Central",
  ],
  alternates: {
    canonical: `${siteUrl}/polling-stations`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/polling-stations`,
    title: "Polling Stations - Find Your Voting Location",
    description: "Quick access to polling station information and directions",
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "Polling Stations",
      },
    ],
  },
};

export default function PollingStationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
