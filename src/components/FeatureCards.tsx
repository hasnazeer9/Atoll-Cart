import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  TouchInteraction01Icon,
  Location01Icon,
  PlusSignCircleIcon,
} from "@hugeicons/core-free-icons";

const features = [
  { icon: CheckmarkBadge01Icon, title: "Quality Products", text: "Carefully chosen items." },
  { icon: TouchInteraction01Icon, title: "Easy Shopping", text: "Simple from start to finish." },
  { icon: Location01Icon, title: "Designed for the Maldives", text: "Local pricing in MVR." },
  { icon: PlusSignCircleIcon, title: "More Coming Soon", text: "Plenty more on the way." },
];

export default function FeatureCards() {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={f.title} className={`rounded-2xl p-6 ${i % 2 === 0 ? "bg-brand-soft" : "bg-surface"}`}>
            <HugeiconsIcon icon={f.icon} size={48} strokeWidth={1} className="text-brand-dark" />
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
