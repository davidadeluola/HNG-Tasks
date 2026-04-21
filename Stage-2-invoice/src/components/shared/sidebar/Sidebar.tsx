import { twMerge } from "tailwind-merge";
import { ThemeToggle } from "../../ThemeToggle";

import Logo from "/logo-hite.svg";
import Potrait from "/potrait.png";

export function Sidebar() {
  return (
    <aside
      className={twMerge(
        "fixed left-0 top-0 z-40 hidden h-screen w-24 flex-col overflow-hidden rounded-r-[28px] bg-(--color-surface-dark-hover)  lg:flex",
       
      )}
    >
      {/* Top Logo Section */}
      <div className="group relative flex h-25.75 w-full cursor-pointer items-center justify-center overflow-hidden rounded-r-[20px] bg-[#7C5DFA] transition-all duration-300 ease-out hover:brightness-110">
        {/* The bottom lighter purple overlap */}
        <div className="absolute bottom-0 left-0 h-1/2 w-full rounded-tl-[20px] bg-[#9277FF] transition-all duration-300 ease-out" />

        {/* The Logo Icon */}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 ease-out">
          <img src={Logo} className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div className="grow" />

      {/* Bottom Section */}
      <div className="flex flex-col items-center">
        {/* Theme Toggle */}
        <div className="p-6 transition-transform duration-300 ease-out cursor-pointer hover:-translate-y-0.5">
          <ThemeToggle />
        </div>

        {/* User Profile */}
        <div className="w-full py-12 border-t border-[#494E6E] flex justify-center">
          <button
            type="button"
            aria-label="Open profile"
            className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 ease-out hover:-translate-y-0.5"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full opacity-85 blur-[1px] transition-all duration-300 ease-out group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0.5 rounded-full ]"
            />
            <img
              src={Potrait}
              alt="User avatar"
              className="relative z-10 h-11 w-11 rounded-full object-cover object-center transition-all duration-300 ease-out group-hover:scale-105"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
