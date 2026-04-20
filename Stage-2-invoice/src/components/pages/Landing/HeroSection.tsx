import {
  ArrowRight,
  CheckCircle2,
  MoonStar,
  Sparkles,
  WalletCards,
} from "lucide-react";
import Button from "../../ui/Button";

const features = [
  {
    title: "Context-driven theme",
    description:
      "Switch between light and dark mode with one global state, no Redux overhead.",
    icon: MoonStar,
  },
  {
    title: "Reusable UI system",
    description:
      "Buttons, inputs, and form shells are built as shared components for consistency.",
    icon: Sparkles,
  },
  {
    title: "Invoice-first workflow",
    description:
      "Designed for clean invoicing flows, fast navigation, and a clear data model.",
    icon: WalletCards,
  },
];

const highlights = [
  "Create invoices",
  "Save drafts",
  "Mark as paid",
  "Responsive from mobile to desktop",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,93,250,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(146,119,255,0.14),transparent_26%),linear-gradient(180deg,var(--ui-surface),var(--ui-bg))]" />
      <div className="mx-auto grid w-full max-w-screen-2xl gap-16 px-6 py-20 md:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20 lg:px-16 lg:py-28 xl:px-24">
        <div className="flex flex-col justify-center gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-(--ui-border) bg-(--ui-surface) px-4 py-2 text-sm font-semibold text-(--ui-muted) shadow-[0_8px_24px_rgba(72,84,159,0.08)]">
            <CheckCircle2 size={16} className="text-(--color-primary)" />
            Context-powered theme, reusable components, lean structure
          </div>

          <div className="space-y-5">
            <p className="typo-heading-s uppercase tracking-[0.22em] text-(--color-primary)">
              Tiny Invoice
            </p>
            <h1 className="typo-heading-l max-w-2xl text-(--ui-text) md:text-[60px] md:leading-[1.04]">
              Build and manage invoices with a clean, fast, and modern interface.
            </h1>
            <p className="typo-body max-w-3xl text-(--ui-muted)">
              A lightweight invoice system built with React, TypeScript, and context for global
              theme control. The experience follows your design system with reusable inputs,
              forms, and shared components.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
              <Button variant="ghost">Get Started</Button>
            <Button
              variant="ghost"
                className="border-(--ui-border) bg-(--ui-surface) text-(--ui-text)"
            >
              View Features
            </Button>
          </div>

          <ul className="flex flex-wrap gap-3 text-sm text-(--ui-muted)">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-(--ui-border) bg-(--ui-surface) px-4 py-2"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-8 h-24 w-24 rounded-full bg-[rgba(124,93,250,0.16)] blur-3xl" />
          <div className="absolute right-6 top-2 h-28 w-28 rounded-full bg-[rgba(146,119,255,0.14)] blur-3xl" />
          <div className="relative rounded-[28px] border border-(--ui-border) bg-(--ui-surface) p-6 shadow-[0_24px_60px_rgba(72,84,159,0.18)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="typo-heading-s text-(--ui-text)">Dashboard Preview</p>
                <p className="typo-body-variant text-(--ui-muted)">
                  Simple, focused, ready for invoices
                </p>
              </div>
              <div className="rounded-2xl bg-(--color-primary) p-3 text-white">
                <ArrowRight size={20} />
              </div>
            </div>

            <div className="grid gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-(--ui-border) bg-[linear-gradient(180deg,rgba(248,248,251,0.9),rgba(255,255,255,0.96))] p-4 dark:bg-[linear-gradient(180deg,rgba(30,33,57,0.9),rgba(37,41,69,0.96))]"
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(124,93,250,0.12)] text-(--color-primary)">
                      <Icon size={18} />
                    </div>
                    <h2 className="typo-heading-s mb-1 text-(--ui-text)">{feature.title}</h2>
                    <p className="typo-body text-(--ui-muted)">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
