import ThemeToggle from "./ThemeToggle";
import { btnPrimary } from "./ui";

const links = [
  ["Schedule", "#schedule"],
  ["Join", "#intake"],
  ["Stories", "#stories"],
  ["Resources", "#resources"],
  ["Zoom", "#zoom"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="min-w-0 leading-none">
          <span className="block font-cond text-xs font-extrabold uppercase tracking-[0.12em] text-orange sm:text-sm">
            YWCA Lubbock
          </span>
          <span className="block font-display text-xl font-black text-navy dark:text-foreground sm:text-2xl">
            Fatherhood Initiative
          </span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-cond text-lg font-bold uppercase tracking-wide text-muted-foreground hover:text-active"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#intake" className={`${btnPrimary} hidden !min-h-10 !py-1.5 sm:inline-flex`}>
            Join a cohort
          </a>
          <ThemeToggle />
        </div>
      </div>
      <nav
        className="scroll-quiet flex gap-2 overflow-x-auto border-t border-border px-4 py-2 lg:hidden"
        aria-label="Sections"
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="shrink-0 rounded-full bg-secondary px-4 py-1.5 font-cond text-base font-bold uppercase tracking-wide text-secondary-foreground"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
