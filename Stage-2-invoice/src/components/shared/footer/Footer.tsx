export function Footer() {
  return (
    <footer className="border-t border-(--ui-border) bg-(--ui-surface)">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 px-6 py-8 text-base text-(--ui-muted) md:flex-row md:items-center md:justify-between md:px-10 md:py-10 lg:px-16 xl:px-24">
        <p>Tiny Invoice is built with React, TypeScript, and a context-based theme system.</p>
        <p>Light and dark mode follow the same design tokens from the global system.</p>
      </div>
    </footer>
  )
}
