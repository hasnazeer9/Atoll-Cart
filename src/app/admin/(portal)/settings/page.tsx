import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "../../actions";
import { Notice, PageHeader, btnPrimary, inputClass, labelClass } from "@/components/admin/ui";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const s = getSettings();
  const field = (name: keyof typeof s, label: string, opts: { type?: string; hint?: string } = {}) => (
    <label className={labelClass}>{label}
      <input name={name} type={opts.type ?? "text"} defaultValue={String(s[name])} className={`${inputClass} mt-1`} />
      {opts.hint && <span className="mt-1 block text-xs font-normal text-ink-muted">{opts.hint}</span>}
    </label>
  );
  return (
    <>
      <PageHeader title="Settings" />
      <Notice error={error} saved={saved} />
      <form action={saveSettingsAction} className="max-w-2xl space-y-8">
        <section className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <h2 className="font-semibold">Shop</h2>
          {field("name", "Shop name")}
          <label className={labelClass}>Description
            <textarea name="description" rows={2} defaultValue={s.description} className={`${inputClass} mt-1 py-2`} />
          </label>
          {field("announcement", "Announcement bar text", { hint: "Shown at the very top of every page. Leave empty to hide it." })}
          {field("gstRate", "GST rate (%)", { type: "number", hint: "Prices are treated as GST-inclusive." })}
        </section>
        <section className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <h2 className="font-semibold">Checkout</h2>
          {field("deliveryFee", "Delivery fee (MVR)", { type: "number", hint: "Added to every online order. Use 0 for free delivery." })}
          <label className={labelClass}>Bank transfer details
            <textarea name="bankDetails" rows={4} defaultValue={s.bankDetails} placeholder={"Bank: …\nAccount name: …\nAccount number: …"} className={`${inputClass} mt-1 py-2`} />
            <span className="mt-1 block text-xs font-normal text-ink-muted">Shown to customers who choose bank transfer. Leave empty to offer cash on delivery only.</span>
          </label>
        </section>
        <section className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <h2 className="font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("email", "Email", { type: "email" })}
            {field("phone", "Phone")}
          </div>
          {field("advertisePhone", "“Advertise Here” number")}
          {field("address", "Shop address")}
          {field("mapEmbedUrl", "Map embed link", { hint: "The src of a map embed (https://…). Leave empty to hide the map." })}
        </section>
        <section className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <h2 className="font-semibold">Social links</h2>
          <p className="-mt-2 text-xs text-ink-muted">Full https:// links. Empty ones are hidden on the shop.</p>
          {field("instagram", "Instagram")}
          {field("facebook", "Facebook")}
          {field("tiktok", "TikTok")}
          {field("whatsapp", "WhatsApp")}
        </section>
        <button type="submit" className={btnPrimary}>Save settings</button>
      </form>
    </>
  );
}
