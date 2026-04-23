import type { ReactNode } from 'react'
import { Footer } from '../../components/shared/footer/Footer'
import { Navbar } from '../../components/shared/nav/Navbar'

type AppLayoutProps = {
  children: ReactNode
  showChrome?: boolean
}

export function AppLayout({ children, showChrome = true }: AppLayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col bg-[var(--ui-bg)] text-[var(--ui-text)] transition-colors duration-300">
      {showChrome ? <Navbar /> : null}
      <main className="flex-1">{children}</main>
      {showChrome ? <Footer /> : null}
    </div>
  )
}
