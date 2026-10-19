import SocialLinks, { hasSocialLinks } from "./SocialLinks";

export default function SocialSection() {
  return (
    <section id="connect" className="py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        <h2 className="text-3xl font-bold">Stay Connected</h2>
        {hasSocialLinks() ? (
          <>
            <p className="mb-6 mt-2 text-ink-muted">Follow our journey as we get ready to launch.</p>
            <SocialLinks />
          </>
        ) : (
          <p className="mt-2 text-ink-muted">Our social channels will appear here soon.</p>
        )}
      </div>
    </section>
  );
}
