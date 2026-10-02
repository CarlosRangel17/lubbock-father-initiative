import { useEffect, useMemo, useState } from "react";
import { Search, Video } from "lucide-react";
import { zoomGroups, type ZoomGroup } from "../data/content";
import { telemetry } from "../lib/telemetry";
import { btnPrimary, SectionHead } from "./ui";

type Status = "live" | "soon" | "scheduled";

function lubbockNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, min: Number(get("hour")) * 60 + Number(get("minute")) };
}

function statusOf(g: ZoomGroup, now: { day: number; min: number }): Status {
  if (g.day !== now.day) return "scheduled";
  if (now.min >= g.startMin && now.min < g.endMin) return "live";
  if (now.min >= g.startMin - 15 && now.min < g.startMin) return "soon";
  return "scheduled";
}

const statusUI: Record<Status, { text: string; dot: string }> = {
  live: { text: "Live now", dot: "bg-green-500 animate-pulse" },
  soon: { text: "Opens soon", dot: "bg-gold" },
  scheduled: { text: "Scheduled", dot: "bg-muted-foreground/50" },
};

export default function ZoomDirectory() {
  const [q, setQ] = useState("");
  const [now, setNow] = useState(lubbockNow);
  useEffect(() => {
    const t = setInterval(() => setNow(lubbockNow()), 30000);
    return () => clearInterval(t);
  }, []);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return zoomGroups.filter((g) => !term || `${g.name} ${g.label} ${g.focus} ${g.host}`.toLowerCase().includes(term));
  }, [q]);

  return (
    <section id="zoom" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHead kicker="Zoom directory" title="Can't make it in person? Join from anywhere.">
        Find your group and jump straight in when the room opens.
      </SectionHead>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-coral" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="ml-2 font-cond text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Group directory
          </span>
        </div>
        <div className="p-4 sm:p-6">
          <label className="relative block">
            <span className="sr-only">Search groups</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Search by day, time, or track"
              className="min-h-11 w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3"
            />
          </label>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {list.map((g) => {
              const s = statusOf(g, now);
              return (
                <li key={g.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                      <span className={`h-2.5 w-2.5 rounded-full ${statusUI[s].dot}`} />
                      {statusUI[s].text}
                      <span className="text-muted-foreground">· {g.focus}</span>
                    </p>
                    <p className="mt-1 font-cond text-2xl font-extrabold uppercase leading-tight">{g.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {g.label} · Host: {g.host}
                    </p>
                  </div>
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => telemetry.track("zoom_link_clicked", { group_id: g.id })}
                    className={`${btnPrimary} shrink-0 !px-4 ${s === "scheduled" ? "!bg-secondary !text-secondary-foreground" : ""}`}
                    aria-label={`Join ${g.name} on Zoom`}
                  >
                    <Video size={18} /> Join
                  </a>
                </li>
              );
            })}
          </ul>
          {list.length === 0 && <p className="py-8 text-center text-muted-foreground">No groups match that search.</p>}
          <p className="mt-4 text-xs text-muted-foreground">
            Meeting links are placeholders. Swap in the real Zoom URLs in the data file. Times are Lubbock (Central).
          </p>
        </div>
      </div>
    </section>
  );
}
