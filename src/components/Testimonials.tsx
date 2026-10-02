import { Quote } from "lucide-react";
import { testimonials } from "../data/content";
import { SectionHead } from "./ui";

export default function Testimonials() {
  return (
    <section id="stories" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHead kicker="In their words" title="What changes when dads show up together.">
        Reflections, group moments, and cohort summaries.
      </SectionHead>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {testimonials.map((t, i) => {
          const summary = t.kind === "Cohort summary";
          return (
            <figure
              key={i}
              className={`break-inside-avoid rounded-xl border p-6 ${
                summary ? "border-transparent bg-hero text-white" : "border-border bg-card"
              }`}
            >
              <Quote size={24} className={summary ? "text-gold" : "text-orange"} aria-hidden />
              <blockquote
                className={`mt-3 leading-relaxed ${
                  i === 0 ? "font-display text-xl font-bold" : "text-base"
                }`}
              >
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 border-t border-current/15 pt-3 text-sm">
                <span className="font-bold">{t.who}</span>
                <span className={summary ? "text-white/70" : "text-muted-foreground"}> · {t.meta}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Sample wording shown as placeholders. Replace with approved quotes from graduates before publishing.
      </p>
    </section>
  );
}
