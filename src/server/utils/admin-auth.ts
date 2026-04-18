import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { env } from "~/env";

const KEY_LENGTH = 64;
const ADMIN_SESSION_TTL_SECONDS = 24 * 60 * 60;

export const ADMIN_SESSION_COOKIE = "admin_session";

export function hashAdminPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyAdminPassword(password: string, storedHash: string): boolean {
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !hashHex) return false;

  const derived = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hashHex, "hex");

  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

function getAdminSessionSecret(): string {
  return env.AUTH_SECRET ?? "";
}

export function createAdminSessionToken(username: string): string {
  const secret = getAdminSessionSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET must be set to issue admin sessions");
  }

  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = `${username}:${expiresAt}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");

  return Buffer.from(`${payload}:${signature}`, "utf8").toString("base64url");
}

export function verifyAdminSessionToken(token: string): { username: string } | null {
  const secret = getAdminSessionSecret();
  if (!secret) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [username, expiresAtRaw, signature] = decoded.split(":");
    if (!username || !expiresAtRaw || !signature) {
      return null;
    }

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    const payload = `${username}:${expiresAt}`;
    const expectedSignature = createHmac("sha256", secret).update(payload).digest("hex");
    const expected = Buffer.from(expectedSignature, "hex");
    const provided = Buffer.from(signature, "hex");

    if (expected.length !== provided.length) {
      return null;
    }

    if (!timingSafeEqual(expected, provided)) {
      return null;
    }

    return { username };
  } catch {
    return null;
  }
}
