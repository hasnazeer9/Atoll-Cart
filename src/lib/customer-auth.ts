import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "./auth";
import { getDb } from "./db";

// Shop customer accounts. They live in the `customers` table (rows that have a
// password) and use their own session cookie, separate from the admin login.
const COOKIE = "atollcart_customer";
const SESSION_DAYS = 30;
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export type Account = { id: number; name: string; email: string; phone: string; address: string };

export async function createCustomerSession(customerId: number) {
  const token = randomBytes(32).toString("base64url");
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  getDb().prepare("INSERT INTO customer_sessions (token_hash, customer_id, expires_at) VALUES (?, ?, ?)").run(sha(token), customerId, expires);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  });
}

export async function getAccount(): Promise<Account | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      "SELECT c.id, c.name, c.email, c.phone, c.address FROM customer_sessions s JOIN customers c ON c.id = s.customer_id WHERE s.token_hash = ? AND s.expires_at > ? AND c.password_hash IS NOT NULL",
    )
    .get(sha(token), Date.now()) as Account | undefined;
  // Plain object: DB rows can't be passed straight to client components.
  return row ? { ...row } : null;
}

export async function requireAccount(): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect("/login");
  return account;
}

export async function destroyCustomerSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM customer_sessions WHERE token_hash = ?").run(sha(token));
  jar.delete(COOKIE);
  getDb().prepare("DELETE FROM customer_sessions WHERE expires_at < ?").run(Date.now());
}

export function registerAccount(input: { name: string; email: string; phone: string; password: string }): { id: number } | { error: string } {
  const db = getDb();
  const taken = db.prepare("SELECT id FROM customers WHERE email = ? AND password_hash IS NOT NULL").get(input.email);
  if (taken) return { error: "An account with this email already exists. Try logging in." };
  const r = db
    .prepare("INSERT INTO customers (name, email, phone, address, password_hash, created_at) VALUES (?, ?, ?, '', ?, ?)")
    .run(input.name, input.email, input.phone, hashPassword(input.password), Date.now());
  return { id: Number(r.lastInsertRowid) };
}

export function checkLogin(email: string, password: string): number | null {
  const row = getDb().prepare("SELECT id, password_hash FROM customers WHERE email = ? AND password_hash IS NOT NULL").get(email) as
    | { id: number; password_hash: string }
    | undefined;
  return row && verifyPassword(password, row.password_hash) ? row.id : null;
}
