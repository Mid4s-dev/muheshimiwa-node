import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";
import { env } from "~/env";
import { hashAdminPassword, verifyAdminPassword } from "~/server/utils/admin-auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      phone?: string;
      ward?: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        email: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawIdentifier = credentials?.identifier ?? credentials?.email;
        const rawPassword = credentials?.password;

        if (typeof rawIdentifier !== "string" || typeof rawPassword !== "string") {
          return null;
        }

        const usernameOrEmail = rawIdentifier.trim();
        const password = rawPassword;

        if (!usernameOrEmail || !password) {
          return null;
        }

        let authenticated = false;

        let adminUser = await db.user.findFirst({
          where: {
            role: "admin",
            OR: [{ email: usernameOrEmail }, { name: usernameOrEmail }],
          },
        });

        if (adminUser?.passwordHash && verifyAdminPassword(password, adminUser.passwordHash)) {
          authenticated = true;
        }

        if (!authenticated && env.ADMIN_USERNAME && env.ADMIN_PASSWORD) {
          if (
            usernameOrEmail.toLowerCase() === env.ADMIN_USERNAME.toLowerCase() &&
            password === env.ADMIN_PASSWORD
          ) {
            authenticated = true;

            if (!adminUser) {
              adminUser = await db.user.create({
                data: {
                  name: usernameOrEmail,
                  email: usernameOrEmail.includes("@") ? usernameOrEmail : null,
                  role: "admin",
                  passwordHash: hashAdminPassword(password),
                },
              });
            } else if (!adminUser.passwordHash) {
              adminUser = await db.user.update({
                where: { id: adminUser.id },
                data: {
                  role: "admin",
                  passwordHash: hashAdminPassword(password),
                },
              });
            }
          }
        }

        if (!authenticated) {
          return null;
        }

        const user = adminUser ?? (await db.user.findFirst({
          where: {
            role: "admin",
            OR: [{ email: usernameOrEmail }, { name: usernameOrEmail }],
          },
        }));

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          ward: user.ward,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  // Credentials auth is most reliable with JWT sessions in NextAuth v4.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const phone = "phone" in user && typeof user.phone === "string" ? user.phone : undefined;
        const ward = "ward" in user && typeof user.ward === "string" ? user.ward : undefined;

        token.phone = phone;
        token.ward = ward;
      }

      return token;
    },
    session: async ({ session, token, user }) => {
      const userPhone =
        user && "phone" in user && typeof user.phone === "string" ? user.phone : undefined;
      const userWard =
        user && "ward" in user && typeof user.ward === "string" ? user.ward : undefined;
      const tokenPhone = typeof token.phone === "string" ? token.phone : undefined;
      const tokenWard = typeof token.ward === "string" ? token.ward : undefined;

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? session.user?.email ?? "",
          phone: tokenPhone ?? userPhone,
          ward: tokenWard ?? userWard,
        },
      };
    },
    signIn: async () => true,
  },
  pages: {
    signIn: "/admin-login",
    error: "/admin-login",
  },
  secret: env.AUTH_SECRET,
} satisfies NextAuthOptions;
