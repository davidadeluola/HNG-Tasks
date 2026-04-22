import { FileText, PieChart, MoonStar } from "lucide-react";

const features = [
  {
    title: "Effortless Invoicing",
    description: "Create, edit, and send professional invoices in seconds without fighting clunky interfaces.",
    icon: FileText,
  },
  {
    title: "Track Status Instantly",
    description: "Know exactly what's Paid, Pending, or Draft. Never lose track of your revenue again.",
    icon: PieChart,
  },
  {
    title: "Beautiful Dark Mode",
    description: "A seamless theme switcher with a premium aesthetic that respects your eyes.",
    icon: MoonStar,
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-(--ui-bg) py-20 px-6 md:px-10 lg:px-16 xl:px-24 border-t border-(--ui-border)">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
          <h2 className="typo-heading-l text-(--ui-text)">Built for freelancers and modern teams</h2>
          <p className="typo-body text-(--ui-muted)">
            Everything you need to manage your billing cycle, wrapped in a blazingly fast and beautiful application.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-(--ui-border) bg-(--ui-surface) p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(124,93,250,0.12)] transition-shadow duration-300"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-primary) text-white shadow-md">
                  <Icon size={24} />
                </div>
                <h3 className="typo-heading-s mb-2 text-(--ui-text)">{feature.title}</h3>
                <p className="typo-body text-(--ui-muted)">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
