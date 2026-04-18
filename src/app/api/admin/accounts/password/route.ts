import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import {
  ADMIN_SESSION_COOKIE,
  hashAdminPassword,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from "~/server/utils/admin-auth";

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return verifyAdminSessionToken(token);
}

export async function POST(request: NextRequest) {
  const adminSession = await isAdminAuthenticated();

  if (!adminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { username, currentPassword, newPassword } = (await request.json()) as {
    username?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  if (!username || !currentPassword || !newPassword) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  if (username !== adminSession.username) {
    return NextResponse.json({ message: "You can only update your own password" }, { status: 403 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ message: "New password must be at least 8 characters" }, { status: 400 });
  }

  const account = await db.user.findFirst({
    where: {
      role: "admin",
      OR: [{ name: username }, { email: username }],
    },
  });
  if (!account) {
    return NextResponse.json({ message: "Admin account not found" }, { status: 404 });
  }

  if (!account.passwordHash || !verifyAdminPassword(currentPassword, account.passwordHash)) {
    return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 });
  }

  await db.user.update({
    where: { id: account.id },
    data: { passwordHash: hashAdminPassword(newPassword) },
  });

  return NextResponse.json({ success: true });
}
