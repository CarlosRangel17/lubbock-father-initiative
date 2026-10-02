import { Download, FileText, Mail } from "lucide-react";
import flyer from "../assets/flyer.png";
import { contact, resources, type Resource } from "../data/content";
import { telemetry } from "../lib/telemetry";
import { btnGhost, btnPrimary, SectionHead } from "./ui";

const thumbBg: Record<Resource["thumb"], string> = {
  flyer: "bg-white",
  navy: "bg-hero text-white",
  orange: "bg-orange text-navy",
  gold: "bg-gold text-navy",
};

export default function Resources() {
  return (
    <section id="resources" className="border-y border-border bg-secondary/60 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead kicker="Resource hub" title="Take something home.">
          Flyers and pamphlets you can print, share, or hand to a dad who needs a nudge.
        </SectionHead>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r) => (
            <article key={r.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
              <div className={`relative aspect-[4/3] overflow-hidden ${thumbBg[r.thumb]}`}>
                {r.thumb === "flyer" ? (
                  <img
                    src={flyer}
                    alt="Thumbnail of the Fatherhood Initiative program flyer"
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full flex-col justify-between p-4">
                    <FileText size={30} aria-hidden />
                    <p className="font-cond text-2xl font-extrabold uppercase leading-none">{r.title}</p>
                  </div>
                )}
                <span className="absolute right-2 top-2 rounded bg-navy px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                  {r.type}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-display text-lg font-black leading-snug">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.excerpt}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {r.provides.map((p) => (
                    <li key={p} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  {r.href ? (
                    <a
                      href={flyer}
                      download="YWCA-Lubbock-Fatherhood-Initiative-Flyer.png"
                      onClick={() => telemetry.track("resource_flyer_download", { resource_id: r.id })}
                      className={`${btnPrimary} w-full`}
                    >
                      <Download size={18} /> Download
                    </a>
                  ) : (
                    <a
                      href={`mailto:${contact.email}?subject=${encodeURIComponent(`Request: ${r.title}`)}`}
                      onClick={() => telemetry.track("resource_flyer_download", { resource_id: r.id })}
                      className={`${btnGhost} w-full`}
                    >
                      <Mail size={18} /> Request a copy
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
