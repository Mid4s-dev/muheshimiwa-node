import "server-only";

import NextAuth from "next-auth";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";

import { authConfig } from "./config";

export const authOptions: NextAuthOptions = authConfig;

export async function auth() {
  return getServerSession(authOptions);
}

// NextAuth v4 returns a broadly typed handler here.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const authHandler: ReturnType<typeof NextAuth> = NextAuth(authOptions);

// Server-side signIn/signOut are NextAuth v5 APIs.
// In v4, use signIn from "next-auth/react" client-side.
export const signIn = async () => ({ error: "UNSUPPORTED_SERVER_SIGNIN" });
export const signOut = async () => ({ ok: true });
