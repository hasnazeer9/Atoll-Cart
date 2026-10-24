import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell, { FormMessage, fieldClass, primaryBtn } from "@/components/AuthShell";
import { getAccount } from "@/lib/customer-auth";
import { registerAction } from "../account/actions";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAccount()) redirect("/account");
  const { error } = await searchParams;
  return (
    <AuthShell title="Create account" subtitle="Save your details and see your orders in one place.">
      <form action={registerAction} className="space-y-4">
        <FormMessage error={error} />
        <label className="block text-sm font-medium">Full name
          <input name="name" required autoComplete="name" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">Email
          <input name="email" type="email" required autoComplete="email" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">Phone <span className="font-normal text-ink-muted">(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">Password <span className="font-normal text-ink-muted">(8+ characters)</span>
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">Confirm password
          <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={fieldClass} />
        </label>
        <button type="submit" className={primaryBtn}>Create account</button>
      </form>
      <p className="text-center text-sm text-ink-muted">
        Already have an account? <Link href="/login" className="font-medium text-brand-dark underline">Log in</Link>
      </p>
    </AuthShell>
  );
}
