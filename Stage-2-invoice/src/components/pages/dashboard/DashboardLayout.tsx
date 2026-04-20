import type { ReactNode } from "react";
import { Sidebar } from "../../shared/sidebar/Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-10 lg:px-16 lg:pl-[12.5rem] xl:px-24">
      <Sidebar />

      <div className="flex min-w-0 flex-col gap-8">
        {children}
      </div>
    </section>
  );
}
