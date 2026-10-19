import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  delay?: string; // e.g. "-2s" so two phones don't jump in sync
  className?: string;
};

// A transparent phone image that hops slowly, with a soft shadow on the "ground".
export default function HeroPhone({ src, alt, delay = "0s", className = "" }: Props) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-jump motion-reduce:animate-none" style={{ animationDelay: delay }}>
        <Image src={src} alt={alt} width={475} height={836} className="h-auto w-full drop-shadow-xl" />
      </div>
      <div aria-hidden="true" className="mx-auto -mt-1 h-3 w-2/3 rounded-full bg-ink/10 blur-md" />
    </div>
  );
}
