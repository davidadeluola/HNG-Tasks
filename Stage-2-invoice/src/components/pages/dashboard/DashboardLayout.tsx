import type { ReactNode } from "react";
import { Sidebar } from "../../shared/sidebar/Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-screen-xl px-8 pt-36 pb-8 lg:pt-8 lg:px-16 lg:pl-[12.5rem]">
      <Sidebar />

      <div className="flex min-w-0 flex-col gap-8">
        {children}
      </div>
    </section>
  );
}
