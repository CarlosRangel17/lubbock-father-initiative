import { useState } from "react";
import { SectionHead } from "../ui";
import GoogleFormEmbed from "./GoogleFormEmbed";
import IntakeWizard from "./IntakeWizard";

export default function IntakeSection({ presetSlot, referral }: { presetSlot?: string; referral?: boolean }) {
  const [path, setPath] = useState<"wizard" | "google">("wizard");
  return (
    <section id="intake" className="bg-secondary/60 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead kicker="Join a cohort" title={referral ? "Refer a dad you believe in." : "Four short steps to get started."}>
          It is free, and your progress saves on this phone if the signal drops.
        </SectionHead>
        <div className="mb-5 inline-flex rounded-lg border border-border bg-card p-1" role="group" aria-label="Intake method">
          {(
            [
              ["wizard", "Guided form"],
              ["google", "Google Form"],
            ] as const
          ).map(([id, text]) => (
            <button
              key={id}
              aria-pressed={path === id}
              onClick={() => setPath(id)}
              className={`min-h-10 rounded-md px-4 font-cond text-lg font-bold uppercase tracking-wide ${
                path === id ? "bg-navy text-white dark:bg-gold dark:text-navy" : "text-muted-foreground"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
        {path === "wizard" ? <IntakeWizard presetSlot={presetSlot} referral={referral} /> : <GoogleFormEmbed />}
      </div>
    </section>
  );
}
