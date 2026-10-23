import { getSettings } from "@/lib/settings";

export default function LocationSection() {
  const { mapEmbedUrl: googleMapsEmbedUrl, address } = getSettings();
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        {googleMapsEmbedUrl ? (
          <>
            <h2 className="text-3xl font-bold">Find Us</h2>
            {address && <p className="mt-2 text-ink-muted">{address}</p>}
            <iframe
              src={googleMapsEmbedUrl} title="Shop location map" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-6 h-80 w-full rounded-2xl border border-line"
            />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">Serving the Maldives</h2>
            <p className="mt-2 text-ink-muted">Shop location details will be shared closer to launch.</p>
          </>
        )}
      </div>
    </section>
  );
}
