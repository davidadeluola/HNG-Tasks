import { ThemeToggle } from "../../ThemeToggle";

import Logo from "/logo-hite.svg";
import Potrait from "/potrait.png";

function LogoBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`group relative flex cursor-pointer items-center justify-center overflow-hidden bg-[#7C5DFA] transition-all duration-300 ease-out hover:brightness-110 ${className}`}
    >
      <div className="absolute bottom-0 left-0 h-1/2 w-full rounded-tl-[20px] bg-[#9277FF] transition-all duration-300 ease-out" />
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 ease-out">
        <img
          src={Logo}
          alt="Logo"
          className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
        />
      </div>
    </div>
  );
}

function AvatarButton() {
  return (
    <button
      type="button"
      aria-label="Open profile"
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 ease-out hover:-translate-y-0.5 lg:h-14 lg:w-14"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-85 blur-[1px] transition-all duration-300 ease-out group-hover:opacity-100"
      />
      <span aria-hidden="true" className="absolute inset-0.5 rounded-full" />
      <img
        src={Potrait}
        alt="User avatar"
        className="relative z-10 h-8 w-8 rounded-full object-cover object-center transition-all duration-300 ease-out group-hover:scale-105 lg:h-11 lg:w-11"
      />
    </button>
  );
}

export function Sidebar() {
  return (
    <>
      {/* ── Mobile / Tablet: horizontal top bar ── */}
      <header className="fixed left-0 top-0 z-40 flex h-20 w-full items-center bg-(--color-surface-dark-hover) lg:hidden">
        <LogoBlock className="h-full w-20 rounded-r-[20px]" />

        <div className="flex flex-1 items-center justify-end gap-6 px-6">
          <ThemeToggle />
          <div className="h-8 w-px bg-[#494E6E]" />
          <AvatarButton />
        </div>
      </header>

      {/* ── Desktop: vertical sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-24 flex-col overflow-hidden rounded-r-[28px] bg-(--color-surface-dark-hover) lg:flex">
        <LogoBlock className="h-25.75 w-full rounded-r-[20px]" />

        <div className="grow" />

        <div className="flex flex-col items-center">
          <div className="cursor-pointer p-6 transition-transform duration-300 ease-out hover:-translate-y-0.5">
            <ThemeToggle />
          </div>

          <div className="flex w-full justify-center border-t border-[#494E6E] py-12">
            <AvatarButton />
          </div>
        </div>
      </aside>
    </>
  );
}

