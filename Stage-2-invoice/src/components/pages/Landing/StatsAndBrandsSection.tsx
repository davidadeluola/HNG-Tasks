export function StatsAndBrandsSection() {
  const stats = [
    { label: "Active Users", value: "10,000+" },
    { label: "Businesses Helped", value: "500+" },
    { label: "Invoices Processed", value: "$2M+" },
  ];

  const brands = [
    "Acme Corp",
    "GlobalTech",
    "Studio Design",
    "Nexus Industries",
    "Apex Solutions",
  ];

  return (
    <section className="bg-(--ui-bg) py-16 px-6 md:px-10 lg:px-16 xl:px-24 border-t border-(--ui-border)">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <h3 className="typo-heading-l text-(--color-primary) font-black text-3xl md:text-4xl">
                  {stat.value}
                </h3>
                <p className="typo-body text-(--ui-text) font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Brands */}
          <div className="rounded-2xl border-2 border-(--ui-border) bg-(--ui-surface) p-8 shadow-[8px_8px_0_var(--ui-border)]">
            <p className="typo-body-variant text-(--ui-muted) mb-6 uppercase tracking-widest font-bold text-center lg:text-left">
              Trusted by innovative teams
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="text-(--ui-text) font-black text-xl opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-default"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
