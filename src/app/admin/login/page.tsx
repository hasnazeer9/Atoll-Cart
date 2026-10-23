import { redirect } from "next/navigation";
import { adminExists, getAdmin } from "@/lib/auth";
import { loginAction } from "../actions";
import { Notice, inputClass, labelClass, btnPrimary } from "@/components/admin/ui";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!adminExists()) redirect("/admin/setup");
  if (await getAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-bold">Admin login</h1>
      <form action={loginAction} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6 shadow-card">
        <Notice error={error} />
        <label className={labelClass}>Email<input name="email" type="email" required autoComplete="username" className={`${inputClass} mt-1`} /></label>
        <label className={labelClass}>Password<input name="password" type="password" required autoComplete="current-password" className={`${inputClass} mt-1`} /></label>
        <button type="submit" className={`${btnPrimary} w-full`}>Log in</button>
      </form>
    </main>
  );
}
