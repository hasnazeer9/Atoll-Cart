import { redirect } from "next/navigation";
import { adminExists, setupLockMessage, setupTokenRequired } from "@/lib/auth";
import { setupAction } from "../actions";
import { Notice, inputClass, labelClass, btnPrimary } from "@/components/admin/ui";

// Only works while no admin exists. After the first account is created it
// redirects to the login page and can't be used to add another admin.
export default async function SetupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (adminExists()) redirect("/admin/login");
  const { error } = await searchParams;
  const locked = setupLockMessage();
  const needsToken = setupTokenRequired();
  if (locked) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
        <h1 className="text-2xl font-bold">Admin setup</h1>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{locked}</p>
      </main>
    );
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-10">
      <h1 className="text-2xl font-bold">Create your admin account</h1>
      <p className="mt-1 text-sm text-ink-muted">First-time setup. This page locks itself once an account exists.</p>
      <form action={setupAction} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6 shadow-card">
        <Notice error={error} />
        {needsToken && (
          <label className={labelClass}>Setup token<input name="token" type="password" required autoComplete="off" className={`${inputClass} mt-1`} />
            <span className="mt-1 block text-xs font-normal text-ink-muted">The ADMIN_SETUP_TOKEN value from the server settings.</span>
          </label>
        )}
        <label className={labelClass}>Your name<input name="name" required autoComplete="name" className={`${inputClass} mt-1`} /></label>
        <label className={labelClass}>Email<input name="email" type="email" required autoComplete="username" className={`${inputClass} mt-1`} /></label>
        <label className={labelClass}>Password (10+ characters)<input name="password" type="password" required minLength={10} autoComplete="new-password" className={`${inputClass} mt-1`} /></label>
        <label className={labelClass}>Confirm password<input name="confirm" type="password" required minLength={10} autoComplete="new-password" className={`${inputClass} mt-1`} /></label>
        <button type="submit" className={`${btnPrimary} w-full`}>Create account</button>
      </form>
    </main>
  );
}
