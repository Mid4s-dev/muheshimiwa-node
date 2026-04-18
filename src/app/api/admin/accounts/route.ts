import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import {
  ADMIN_SESSION_COOKIE,
  hashAdminPassword,
  verifyAdminSessionToken,
} from "~/server/utils/admin-auth";

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return false;
  }

  return Boolean(verifyAdminSessionToken(token));
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const accounts = await db.user.findMany({
    where: { role: "admin" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ accounts });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await db.user.findFirst({
    where: {
      role: "admin",
      OR: [{ name: username }, { email: username }],
    },
  });
  if (existing) {
    return NextResponse.json({ message: "Username already exists" }, { status: 409 });
  }

  await db.user.create({
    data: {
      name: username,
      email: username.includes("@") ? username : null,
      role: "admin",
      passwordHash: hashAdminPassword(password),
    },
  });

  return NextResponse.json({ success: true });
}
