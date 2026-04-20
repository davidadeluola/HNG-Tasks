import { ThemeToggle } from '../../ThemeToggle'
import Logo from "/logo.png"
export function Navbar() {
  return (
    <header className="border-b border-(--ui-border) bg-(--ui-surface)/90 backdrop-blur supports-backdrop-filter:bg-(--ui-surface)/80">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4 md:px-10 md:py-5 lg:px-16 lg:py-6 xl:px-24">
        <div className="flex items-center gap-3">
         <img src={Logo} alt="Tiny Invoice Logo" className="h-8 w-8" />
          <div>
            <p className="font-bold text-2xl text-(--ui-text)">Tiny Invoice</p>
            {/* <p className="typo-body text-[var(--ui-muted)]">Lean invoice system</p> */}
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
