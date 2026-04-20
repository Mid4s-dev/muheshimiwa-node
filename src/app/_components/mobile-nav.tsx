"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Maendeleo" },
  { href: "/bursaries", label: "Bursaries" },
  { href: "/polling-stations", label: "Find Station" },
  { href: "/register", label: "Uko Kadi?" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden inline-flex flex-col gap-1.5 p-2 text-gray-700 hover:text-md-green transition"
        aria-label="Toggle menu"
      >
        <span className={`h-0.5 w-6 bg-current transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`h-0.5 w-6 bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`} />
        <span className={`h-0.5 w-6 bg-current transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white shadow-lg md:hidden">
          <div className="flex flex-col divide-y divide-gray-100 px-2 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-md-green transition rounded"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {session?.user && (
              <>
                <div className="px-3 py-3 text-xs text-gray-500">
                  Signed in as: <span className="font-semibold text-gray-700">{session.user.name}</span>
                </div>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-md-dark bg-md-gold/20 hover:bg-md-gold/30 rounded transition"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    void signOut();
                    setIsOpen(false);
                  }}
                  className="px-3 py-3 text-sm font-medium text-md-green hover:bg-red-50 transition rounded text-left"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
