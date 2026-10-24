"use server";

import { redirect } from "next/navigation";
import { clearFailures, loginBlocked, recordFailure } from "@/lib/auth";
import {
  checkLogin, createCustomerSession, destroyCustomerSession, getAccount, registerAccount,
} from "@/lib/customer-auth";
import { getDb } from "@/lib/db";

const text = (f: FormData, k: string, max = 200) => String(f.get(k) ?? "").trim().slice(0, max);
const fail = (path: string, msg: string): never => redirect(`${path}?error=${encodeURIComponent(msg)}`);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function registerAction(formData: FormData) {
  const name = text(formData, "name", 120);
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone", 30);
  const password = String(formData.get("password") ?? "");
  if (name.length < 2) fail("/register", "Please enter your name.");
  if (!EMAIL.test(email)) fail("/register", "Please enter a valid email address.");
  if (phone && !/^\+?[\d\s-]{7,20}$/.test(phone)) fail("/register", "Please enter a valid phone number, or leave it empty.");
  if (password.length < 8) fail("/register", "Password must be at least 8 characters.");
  if (password !== String(formData.get("confirm") ?? "")) fail("/register", "Passwords do not match.");
  const result = registerAccount({ name, email, phone, password });
  if ("error" in result) fail("/register", result.error);
  else {
    await createCustomerSession(result.id);
    redirect("/account");
  }
}

export async function loginAction(formData: FormData) {
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const key = `c:${email}`;
  if (loginBlocked(key)) fail("/login", "Too many attempts. Try again in 15 minutes.");
  const id = checkLogin(email, password);
  if (id === null) {
    recordFailure(key);
    fail("/login", "Incorrect email or password.");
  } else {
    clearFailures(key);
    await createCustomerSession(id);
    redirect("/account");
  }
}

export async function logoutAction() {
  await destroyCustomerSession();
  redirect("/login");
}

export async function updateProfileAction(formData: FormData) {
  const account = await getAccount();
  if (!account) redirect("/login");
  const name = text(formData, "name", 120);
  const phone = text(formData, "phone", 30);
  const address = text(formData, "address", 300);
  if (name.length < 2) fail("/account", "Please enter your name.");
  if (phone && !/^\+?[\d\s-]{7,20}$/.test(phone)) fail("/account", "Please enter a valid phone number.");
  getDb().prepare("UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?").run(name, phone, address, account.id);
  redirect("/account?saved=1");
}
