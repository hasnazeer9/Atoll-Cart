import Link from "next/link";
import HeroPhone from "./HeroPhone";

export default function Hero() {
  return (
    <section id="about" className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-[1fr_1.5fr_1fr] lg:py-20">
        <HeroPhone src="/phone-red.webp" alt="Red foldable phone, back view" className="hidden w-full max-w-[280px] justify-self-end lg:block" />

        <div className="text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Everything You Love, <span className="text-brand-dark">Made for Island Life.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-ink-muted">
            Atoll Cart brings you hand-picked products, clear MVR prices and an easy, friendly way to shop —
            made for the Maldives.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="#preview" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-dark px-7 font-semibold text-white shadow-card transition hover:bg-brand hover:shadow-lift">
              See What&apos;s Coming
            </Link>
            <Link href="#connect" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-7 font-semibold transition hover:border-brand hover:text-brand-dark">
              Follow Our Journey
            </Link>
          </div>
        </div>

        <HeroPhone src="/phone-black.webp" alt="Black foldable phone, back view" delay="-2s" className="hidden w-full max-w-[280px] justify-self-start lg:block" />

        {/* On small screens both phones sit side by side under the text. */}
        <div className="flex justify-center gap-4 lg:hidden">
          <HeroPhone src="/phone-red.webp" alt="Red foldable phone, back view" className="w-[42%] max-w-[200px]" />
          <HeroPhone src="/phone-black.webp" alt="Black foldable phone, back view" delay="-2s" className="w-[42%] max-w-[200px]" />
        </div>
      </div>
    </section>
  );
}
