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
          <footer className="border-t border-gray-200 bg-md-dark text-white">
            <div className="mx-auto max-w-7xl px-4 py-12">
              <div className="grid gap-8 md:grid-cols-4">
                <div>
                  <h3 className="mb-4 font-bold text-md-gold">Muheshimiwa</h3>
                  <p className="text-sm text-gray-300">
                    Real Maendeleo for Embakasi Central. Vote for Hon. Mejja Donk.
                  </p>
                </div>
                <div>
                  <h4 className="mb-4 font-semibold">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      <Link href="/projects" className="hover:text-md-gold">
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link href="/bursaries" className="hover:text-md-gold">
                        Bursaries
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="hover:text-md-gold">
                        Meet the team
                      </Link>
                    </li>
                    <li>
                      <Link href="/polling-stations" className="hover:text-md-gold">
                        Polling Stations
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4 font-semibold">Get Involved</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      <Link href="/register" className="hover:text-md-gold">
                        Join Supporter List
                      </Link>
                    </li>
                    <li>
                      <Link href="/projects" className="hover:text-md-gold">
                        See Our Work
                      </Link>
                    </li>
                    <li>
                      <Link href="/bursaries" className="hover:text-md-gold">
                        Bursaries
                      </Link>
                    </li>
                    <li>
                      <a href="tel:+254712345678" className="hover:text-md-gold">
                        Call Us
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4 font-semibold">Contact</h4>
                  <p className="text-sm text-gray-300">
                    Embakasi Central<br />
                    Nairobi, Kenya<br />
                    <a href="tel:+254712345678" className="hover:text-md-gold">
                      +254 712 345 678
                    </a>
                  </p>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
                <p>&copy; 2026 Muheshimiwa Campaign. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
