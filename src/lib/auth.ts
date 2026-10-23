import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./db";

const COOKIE = "atollcart_admin";
const SESSION_DAYS = 7;

export type Admin = { id: number; email: string; name: string };

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, keyHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export async function createSession(adminId: number) {
  const token = randomBytes(32).toString("base64url");
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  getDb().prepare("INSERT INTO sessions (token_hash, admin_id, expires_at) VALUES (?, ?, ?)").run(sha(token), adminId, expires);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  });
}

export async function getAdmin(): Promise<Admin | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      "SELECT a.id, a.email, a.name FROM sessions s JOIN admins a ON a.id = s.admin_id WHERE s.token_hash = ? AND s.expires_at > ?",
    )
    .get(sha(token), Date.now()) as Admin | undefined;
  return row ?? null;
}

// Call at the top of every admin page AND every admin server action.
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha(token));
  jar.delete(COOKIE);
  getDb().prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
}

// First-time setup lock. On a live server set ADMIN_SETUP_TOKEN; whoever creates
// the first admin account must type it. Without it, production refuses setup.
export function setupLockMessage(): string | null {
  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_SETUP_TOKEN) {
    return "Setup is locked. Set the ADMIN_SETUP_TOKEN environment variable on the server, then reload this page.";
  }
  return null;
}

export function setupTokenRequired(): boolean {
  return Boolean(process.env.ADMIN_SETUP_TOKEN);
}

export function setupTokenValid(given: string): boolean {
  const expected = process.env.ADMIN_SETUP_TOKEN;
  if (!expected) return true; // dev only: setupLockMessage() blocks production
  return timingSafeEqual(createHash("sha256").update(given).digest(), createHash("sha256").update(expected).digest());
}

export function adminExists(): boolean {
  const { n } = getDb().prepare("SELECT COUNT(*) AS n FROM admins").get() as { n: number };
  return n > 0;
}

// Basic brute-force protection: 5 failed attempts per email per 15 minutes.
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 15 * 60_000;

export function loginBlocked(email: string): boolean {
  const a = attempts.get(email);
  if (!a) return false;
  if (Date.now() - a.first > WINDOW) {
    attempts.delete(email);
    return false;
  }
  return a.count >= 5;
}

export function recordFailure(email: string) {
  const a = attempts.get(email);
  if (!a || Date.now() - a.first > WINDOW) attempts.set(email, { count: 1, first: Date.now() });
  else a.count += 1;
}

export function clearFailures(email: string) {
  attempts.delete(email);
}
