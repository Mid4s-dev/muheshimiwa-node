"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="text-right hidden sm:block">
        <div className="text-xs font-medium text-gray-600 leading-tight">Hi,</div>
        <div className="text-xs md:text-sm font-bold text-gray-900 leading-tight">{session.user.name?.split(" ")[0]}</div>
      </div>
      {session.user && (
        <Link
          href="/admin"
          className="rounded-lg bg-md-gold px-2 md:px-3 py-1 md:py-1.5 text-xs font-bold text-md-dark shadow-sm transition hover:bg-yellow-300 whitespace-nowrap"
        >
          Admin
        </Link>
      )}
      <button
        onClick={() => signOut()}
        className="rounded-lg border-2 border-md-green px-2 md:px-3 py-1 md:py-1.5 text-xs font-bold text-md-green transition hover:bg-md-green hover:text-white whitespace-nowrap"
      >
        Exit
      </button>
    </div>
  );
}
