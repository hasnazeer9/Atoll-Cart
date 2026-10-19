import Image from "next/image";

// Decorative, illustrative phone screens. All content is sample data.
function Phone({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <div className={`absolute aspect-[9/18.5] rounded-[2rem] border-[6px] border-ink bg-white shadow-lift ${className}`}>
      <div className="absolute left-1/2 top-1.5 z-10 h-3 w-1/3 -translate-x-1/2 rounded-full bg-ink" />
      <div className="h-full overflow-hidden rounded-[1.5rem]" style={{ containerType: "inline-size" }}>
        {children}
      </div>
    </div>
  );
}

function Thumb({ src, off, price }: { src: string; off?: string; price: string }) {
  return (
    <div className="overflow-hidden rounded-[3cqw] border border-line bg-white">
      <div className="relative aspect-square bg-surface">
        <Image src={src} alt="" fill unoptimized sizes="120px" className="object-cover" />
        {off && <span className="absolute left-[2cqw] top-[2cqw] rounded bg-brand-dark px-[1.5cqw] text-[4cqw] font-bold text-white">{off}</span>}
      </div>
      <div className="p-[2cqw]">
        <div className="h-[2cqw] w-4/5 rounded bg-line" />
        <div className="mt-[1.5cqw] text-[5cqw] font-extrabold text-brand-dark">{price}</div>
      </div>
    </div>
  );
}

export default function PhoneMockups() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-md">
      <Phone className="left-[2%] top-0 w-[48%] animate-float-a motion-reduce:animate-none">
        <div className="px-[5cqw] pt-[12cqw]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4cqw] bg-surface">
            <Image src="/products/p2.svg" alt="" fill unoptimized sizes="200px" className="object-cover" />
          </div>
          <p className="mt-[4cqw] text-[5.5cqw] font-semibold leading-tight">Sample product</p>
          <p className="mt-[1cqw] text-[8cqw] font-extrabold text-brand-dark">MVR 399</p>
          <span className="mt-[2cqw] inline-block rounded-full bg-brand-soft px-[3cqw] py-[1cqw] text-[4cqw] font-medium text-brand-dark">Preview only</span>
          <p className="mt-[4cqw] text-[4cqw] text-ink-muted">Sample price history</p>
          <svg viewBox="0 0 100 40" className="mt-[1cqw] w-full rounded-[3cqw] bg-brand-soft">
            <polyline
              points="4,30 16,26 28,28 40,18 52,20 64,10 76,14 88,8 96,12"
              fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              pathLength={100} strokeDasharray={100}
              className="animate-draw motion-reduce:animate-none"
            />
          </svg>
          <div className="mt-[6cqw] rounded-full bg-brand-dark py-[3cqw] text-center text-[5cqw] font-semibold text-white">Coming soon</div>
        </div>
      </Phone>
      <Phone className="bottom-0 right-[2%] w-[48%] animate-float-b motion-reduce:animate-none">
        <div className="px-[5cqw] pt-[12cqw]">
          <p className="text-[6cqw] font-bold">Find a product</p>
          <div className="mt-[3cqw] rounded-full border border-line bg-surface px-[4cqw] py-[2.5cqw] text-[4.5cqw] text-ink-muted">Search…</div>
          <div className="mt-[4cqw] h-[100cqw] overflow-hidden">
            {/* The list is repeated so the -50% scroll loops seamlessly. */}
            <div className="grid animate-scroll-y grid-cols-2 gap-[3cqw] pb-[3cqw] motion-reduce:animate-none">
              {[0, 1].map((n) => (
                <div key={n} className="contents">
                  <Thumb src="/products/p1.svg" off="-29%" price="MVR 249" />
                  <Thumb src="/products/p3.svg" off="-19%" price="MVR 129" />
                  <Thumb src="/products/p4.svg" price="MVR 189" />
                  <Thumb src="/products/p5.svg" off="-18%" price="MVR 899" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Phone>
    </div>
  );
}
