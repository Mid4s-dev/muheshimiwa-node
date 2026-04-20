import "../styles/globals.css";

import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Providers } from "./_components/providers";
import { VisitTracker } from "./_components/visit-tracker";
import { auth } from "~/server/auth";
import { AuthNav } from "./_components/auth-nav";
import { MobileNav } from "./_components/mobile-nav";

export const metadata: Metadata = {
  title: "Muheshimiwa - Embakasi Central Campaign",
  description: "Vote for Real Change. Hon. Mejja Donk for Embakasi Central MP",
  icons: [{ rel: "icon", url: "/icons/logo.png" }],
  openGraph: {
    title: "Muheshimiwa Campaign",
    description: "Real Maendeleo for Embakasi Central",
    images: [{ url: "/og-image.svg" }],
  },
};

const footerLinks = [
  { href: "/projects", label: "Maendeleo" },
  { href: "/bursaries", label: "Bursaries" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/about", label: "About" },
  { href: "/polling-stations", label: "Polling Stations" },
  { href: "/register", label: "Join Supporter List" },
];

const socialLinks = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: FacebookIcon,
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://x.com",
    label: "X",
    icon: XIcon,
  },
];

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#016629" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
      </head>
      <body suppressHydrationWarning className="bg-white font-sans">
        <Providers session={session}>
          <VisitTracker />
          {/* Navigation Header */}
          <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 md:px-4 md:py-3">
              {/* Logo & Brand */}
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-md-green transition hover:opacity-75 flex-shrink-0"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-200 shadow-sm md:h-10 md:w-10 flex-shrink-0">
                  <Image
                    src="/icons/logo.png"
                    alt="Mejja Donk logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="hidden xs:flex flex-col">
                  <span className="text-xs md:text-sm font-bold leading-tight">Muheshimiwa</span>
                  <span className="text-xs text-gray-500 leading-tight">Embakasi</span>
                </div>
              </Link>

              {/* Main Navigation - Desktop */}
              <div className="hidden lg:flex items-center gap-1">
                <Link href="/" className="px-3 py-2 text-xs md:text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition whitespace-nowrap">
                  Home
                </Link>
                <Link href="/projects" className="px-3 py-2 text-xs md:text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition whitespace-nowrap">
                  Maendeleo
                </Link>
                <Link href="/bursaries" className="px-3 py-2 text-xs md:text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition whitespace-nowrap">
                  Bursaries
                </Link>
                <Link href="/polling-stations" className="px-3 py-2 text-xs md:text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition whitespace-nowrap">
                  Find Station
                </Link>
                <Link href="/register" className="px-3 py-2 text-xs md:text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition whitespace-nowrap">
                  Uko Kadi?
                </Link>
              </div>

              {/* Auth & Mobile Menu Container */}
              <div className="flex items-center gap-2 md:gap-3">
                <AuthNav />
                <MobileNav />
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex min-h-screen flex-col">{children}</main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-gradient-to-br from-md-dark via-slate-950 to-md-green text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
              <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full border border-md-gold/30 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-md-gold">
                    Embakasi Central
                  </div>
                  <h3 className="text-2xl font-black text-white md:text-3xl">Muheshimiwa</h3>
                  <p className="max-w-sm text-sm leading-6 text-white/75">
                    Real Maendeleo for Embakasi Central. Vote for Hon. Mejja Donk and stay connected
                    to projects, bursaries, and community updates.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/register"
                      className="rounded-full bg-md-gold px-4 py-2 text-sm font-semibold text-md-dark transition hover:scale-[1.02]"
                    >
                      Join Supporter List
                    </Link>
                    <Link
                      href="/manifesto"
                      className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Read Manifesto
                    </Link>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-md-gold">
                    Explore
                  </h4>
                  <ul className="space-y-2 text-sm text-white/75">
                    {footerLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="transition hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-md-gold">
                    Get Involved
                  </h4>
                  <ul className="space-y-2 text-sm text-white/75">
                    <li>
                      <Link href="/projects" className="transition hover:text-white">
                        See Our Work
                      </Link>
                    </li>
                    <li>
                      <Link href="/bursaries" className="transition hover:text-white">
                        Bursary Support
                      </Link>
                    </li>
                    <li>
                      <Link href="/polling-stations" className="transition hover:text-white">
                        Find Polling Stations
                      </Link>
                    </li>
                    <li>
                      <a href="tel:+254712345678" className="transition hover:text-white">
                        Call Us
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-md-gold">
                    Contact & Social
                  </h4>
                  <div className="space-y-4 text-sm text-white/75">
                    <p>
                      Embakasi Central<br />
                      Nairobi, Kenya<br />
                      <a href="tel:+254712345678" className="transition hover:text-white">
                        +254 712 345 678
                      </a>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map((social) => {
                        const Icon = social.icon;

                        return (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.label}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-md-gold"
                          >
                            <Icon />
                            <span>{social.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/60">
                <p>&copy; 2026 Muheshimiwa Campaign. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5a24 24 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.1v8h3.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm5-2.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M18.9 2H22l-7.8 8.9L23 22h-6.7l-5.2-6.8L5.1 22H2l8.3-9.5L1 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.7L7 3.9H5.2L17.7 20Z" />
    </svg>
  );
}
