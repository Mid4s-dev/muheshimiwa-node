import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  hashAdminPassword,
  verifyAdminPassword,
} from "~/server/utils/admin-auth";
import { env } from "~/env";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    let authenticated = false;

    let adminUser = await db.user.findFirst({
      where: {
        role: "admin",
        OR: [{ name: username }, { email: username }],
      },
    });

    if (adminUser?.passwordHash && verifyAdminPassword(password, adminUser.passwordHash)) {
      authenticated = true;
    }

    if (!authenticated && env.ADMIN_USERNAME && env.ADMIN_PASSWORD) {
      if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
        return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
      }

      authenticated = true;

      // Create bootstrap admin user if not present.
      if (!adminUser) {
        adminUser = await db.user.create({
          data: {
            name: username,
            email: username.includes("@") ? username : null,
            role: "admin",
            passwordHash: hashAdminPassword(password),
          },
        });
      } else if (!adminUser.passwordHash) {
        await db.user.update({
          where: { id: adminUser.id },
          data: {
            role: "admin",
            passwordHash: hashAdminPassword(password),
          },
        });
      }
    }

    if (!authenticated) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
    }

    const sessionToken = createAdminSessionToken(username);

    // Set secure admin cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
