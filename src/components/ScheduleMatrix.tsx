import { useState } from "react";
import { ArrowRight, Check, Sun, Sunset, UserPlus } from "lucide-react";
import { tracks, type Slot } from "../data/content";
import { btnPrimary, SectionHead } from "./ui";

const periodIcon = { Evening: Sunset, Morning: Sun, "Mid-day": Sun } as const;

export default function ScheduleMatrix({ onEnroll }: { onEnroll: (slotId: string, referral: boolean) => void }) {
  const [trackId, setTrackId] = useState<"A" | "B">("A");
  const [slotId, setSlotId] = useState<string>(tracks[0].slots[0].id);
  const track = tracks.find((t) => t.id === trackId)!;
  const slot = track.slots.find((s) => s.id === slotId) ?? track.slots[0];

  const pickTrack = (id: "A" | "B") => {
    setTrackId(id);
    setSlotId(tracks.find((t) => t.id === id)!.slots[0].id);
  };

  const days = Array.from(new Set(track.slots.map((s) => s.day)));

  return (
    <section id="schedule" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHead kicker="Program dates & times" title="Pick the hour that fits your week.">
        Same 12-week curriculum on every track. Choose a session and we will take it from there.
      </SectionHead>

      <div role="tablist" aria-label="Program tracks" className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1.5">
        {tracks.map((t) => {
          const active = t.id === trackId;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => pickTrack(t.id)}
              className={`rounded-lg px-3 py-3 text-left transition ${
                active ? "bg-navy text-white shadow dark:bg-gold dark:text-navy" : "text-secondary-foreground hover:bg-card"
              }`}
            >
              <span className="block font-cond text-sm font-bold uppercase tracking-widest opacity-80">{t.label}</span>
              <span className="block font-cond text-xl font-extrabold uppercase leading-tight sm:text-2xl">{t.days}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <p className="mb-4 text-muted-foreground">{track.blurb}</p>
          <div className={`grid gap-4 ${days.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {days.map((day) => (
              <article key={day} className="overflow-hidden rounded-xl border border-border bg-card">
                <h3 className="border-b-2 border-orange bg-navy px-4 py-2 font-cond text-xl font-extrabold uppercase tracking-wide text-white dark:bg-hero">
                  {day}
                </h3>
                <ul className="divide-y divide-border">
                  {track.slots
                    .filter((s) => s.day === day)
                    .map((s) => (
                      <SlotRow key={s.id} slot={s} selected={s.id === slot.id} onSelect={() => setSlotId(s.id)} />
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-5">
          <p className="font-cond text-sm font-bold uppercase tracking-widest text-orange">Your pick</p>
          <p className="mt-1 font-cond text-3xl font-extrabold uppercase leading-none text-navy dark:text-foreground">
            {slot.day}
          </p>
          <p className="mt-1 text-lg font-semibold">{slot.time}</p>
          <p className="mt-4 text-sm text-muted-foreground">12 weeks, one group, same time each week.</p>
          <div className="mt-2 grid grid-cols-12 gap-1" aria-hidden>
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={`h-2 rounded-full ${i === 0 ? "bg-active" : "bg-border"}`} />
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold">
            <Check size={16} className="text-active" /> Childcare support available
          </p>
          <div className="mt-5 grid gap-2">
            <button className={btnPrimary} onClick={() => onEnroll(slot.id, false)}>
              Start my intake <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onEnroll(slot.id, true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold hover:border-active hover:text-active"
            >
              <UserPlus size={16} /> Refer a dad for this session
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SlotRow({ slot, selected, onSelect }: { slot: Slot; selected: boolean; onSelect: () => void }) {
  const Icon = periodIcon[slot.period];
  const open = slot.entry === "open";
  return (
    <li>
      <button
        onClick={onSelect}
        aria-pressed={selected}
        className={`flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-secondary ${
          selected ? "bg-secondary shadow-[inset_4px_0_0_var(--active)]" : ""
        }`}
      >
        <Icon size={22} className="shrink-0 text-orange" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">{slot.period}</span>
          <span className="block font-cond text-2xl font-bold leading-tight">{slot.time}</span>
        </span>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide ${
            open ? "bg-active/15 text-active" : "bg-orange/15 text-orange"
          }`}
        >
          {open ? "Open entry" : "Referral welcome"}
        </span>
      </button>
    </li>
  );
}
