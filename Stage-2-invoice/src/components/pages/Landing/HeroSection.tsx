import { Link } from "react-router-dom";
import {CheckCircle2 } from "lucide-react";
import Button from "../../ui/Button";
import { ROUTES } from "../../../routes/paths";

const highlights = [
  "Create professional invoices",
  "Track Paid & Pending status",
  "Save reusable drafts",
  "Beautiful Dark & Light modes",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-(--ui-bg)">
      {/* Non-generic Brutalist Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--ui-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--ui-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)] opacity-40" />
      
      <div className="mx-auto grid w-full max-w-screen-2xl gap-16 px-6 py-20 md:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20 lg:px-16 lg:py-28 xl:px-24">
        <div className="flex flex-col justify-center gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-(--color-primary) bg-(--ui-surface) px-4 py-2 text-sm font-bold text-(--color-primary) shadow-[4px_4px_0_var(--color-primary)]">
            <CheckCircle2 size={16} />
            The simplest way to get paid.
          </div>

          <div className="space-y-5">
            <p className="typo-heading-s uppercase tracking-[0.22em] text-(--color-primary)">
              Tiny Invoice
            </p>
            <h1 className="typo-heading-l max-w-2xl text-(--ui-text) md:text-[64px] md:leading-[2.05] font-black tracking-tight">
              Manage your invoices without the headache.
            </h1>
            <p className="typo-body max-w-3xl text-(--ui-muted) text-lg">
              Tiny Invoice is a lightweight, blazing-fast application designed for freelancers and small teams. Create beautiful invoices, track your pending payments, and keep your business organized—all in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link to={ROUTES.accounts}>
              <Button className="px-8 py-6 text-base shadow-[4px_4px_0_var(--color-surface-dark)] dark:shadow-[4px_4px_0_var(--color-primary-hover)] hover:-translate-y-1 transition-transform">
                Create an Invoice
              </Button>
            </Link>
            <Link to={ROUTES.accounts}>
              <Button
                variant="ghost"
                className="border-2 border-(--ui-border) bg-(--ui-surface) text-(--ui-text) px-8 py-6 text-base shadow-[4px_4px_0_var(--ui-border)] hover:-translate-y-1 transition-transform"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <ul className="flex flex-wrap gap-3 text-sm font-bold text-(--ui-text) mt-6">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-lg border-2 border-(--ui-border) bg-(--ui-surface) px-4 py-2"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative rounded-3xl border-4 border-(--ui-border) bg-(--ui-surface) p-8 shadow-[12px_12px_0_var(--color-primary)] transition-transform hover:-translate-y-2 hover:-translate-x-2 duration-300">
            <div className="mb-8 flex items-center justify-between border-b-2 border-(--ui-border) pb-4">
              <div>
                <p className="typo-heading-s text-(--ui-text)">Invoice #RT3080</p>
                <p className="typo-body-variant text-(--ui-muted) mt-1">
                  Due 23 April 2026
                </p>
              </div>
              <div className="rounded-xl border-2 border-(--color-primary) bg-[rgba(124,93,250,0.1)] px-4 py-2 font-bold text-(--color-primary)">
                Pending
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="typo-body font-bold text-(--ui-text)">Alex Grim</span>
                <span className="typo-heading-s text-(--ui-text)">£ 556.00</span>
              </div>

               <div className="flex justify-between items-center">
                <span className="typo-body font-bold text-(--ui-text)">David Adeluola</span>
                <span className="typo-heading-s text-(--ui-text)">£ 5356.00</span>
              </div>
              
              <div className="h-2 w-full bg-(--ui-border) rounded-full overflow-hidden">
                <div className="h-full bg-(--color-primary) w-2/3"></div>
              </div>
              
              <p className="typo-body text-(--ui-muted) text-center italic mt-4">
                "Creating professional invoices has never been this easy."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

