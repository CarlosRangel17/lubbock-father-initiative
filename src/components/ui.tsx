import type { ReactNode } from "react";

export function SectionHead({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div id={id} className="mb-8 max-w-2xl">
      <p className="font-cond text-sm font-bold uppercase tracking-[0.2em] text-orange">{kicker}</p>
      <h2 className="mt-2 font-display text-3xl font-black leading-tight text-navy dark:text-foreground sm:text-4xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-base leading-relaxed text-muted-foreground">{children}</p>}
    </div>
  );
}

export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange px-5 py-2.5 font-cond text-lg font-bold uppercase tracking-wide text-navy transition hover:brightness-110 active:translate-y-px";
export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 font-cond text-lg font-bold uppercase tracking-wide text-card-foreground transition hover:border-active hover:text-active";
