import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell, { FormMessage, fieldClass, primaryBtn } from "@/components/AuthShell";
import { getAccount } from "@/lib/customer-auth";
import { loginAction } from "../account/actions";

export const metadata: Metadata = { title: "Login", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAccount()) redirect("/account");
  const { error } = await searchParams;
  return (
    <AuthShell title="Login" subtitle="Welcome back. Log in to see your orders.">
      <form action={loginAction} className="space-y-4">
        <FormMessage error={error} />
        <label className="block text-sm font-medium">Email
          <input name="email" type="email" required autoComplete="username" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">Password
          <input name="password" type="password" required autoComplete="current-password" className={fieldClass} />
        </label>
        <button type="submit" className={primaryBtn}>Log in</button>
      </form>
      <p className="text-center text-sm text-ink-muted">
        New here? <Link href="/register" className="font-medium text-brand-dark underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
