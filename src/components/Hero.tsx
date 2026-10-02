import { Baby, CalendarRange, Clock, MapPin } from "lucide-react";
import flyer from "../assets/flyer.png";
import { highlights } from "../data/content";
import { btnPrimary } from "./ui";

const icons = [CalendarRange, MapPin, Baby, Clock];

export default function Hero() {
  return (
    <section id="top" className="border-b-4 border-orange">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        <p className="font-cond text-lg font-bold uppercase tracking-wide text-navy dark:text-foreground sm:text-2xl">
          Strong <span className="text-orange">Fathers.</span> Strong <span className="text-orange">Families.</span>{" "}
          Strong <span className="text-orange">Communities.</span>
        </p>
      </div>

      <div className="mx-auto mt-5 grid max-w-6xl overflow-hidden sm:px-6 lg:grid-cols-2 lg:gap-1">
        <div className="bg-hero px-6 py-10 text-white sm:px-10 sm:py-14 lg:rounded-none">
          <h1>
            <span className="block font-cond text-5xl font-extrabold uppercase leading-none tracking-tight sm:text-7xl">
              Be a stronger
            </span>
            <span className="brand-gradient -ml-1 mt-1 block font-script text-7xl leading-[1.15] sm:text-8xl">
              Father
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg font-bold leading-snug sm:text-xl">
            A 12-week cohort designed to support dads with practical tools, parenting strategies, and community
            connection.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
            Based on the 24/7 Dad curriculum. Sessions are led by the Fatherhood Director with support from a Childhood
            Specialist.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#intake" className={btnPrimary}>
              Start intake
            </a>
            <a
              href="#schedule"
              className="inline-flex min-h-11 items-center rounded-lg border border-white/40 px-5 py-2.5 font-cond text-lg font-bold uppercase tracking-wide text-white hover:bg-white/10"
            >
              See the schedule
            </a>
          </div>
        </div>
        <div
          role="img"
          aria-label="A smiling father and his young son look at each other outdoors"
          className="aspect-[512/420] min-h-72 bg-navy bg-no-repeat lg:aspect-auto"
          style={{ backgroundImage: `url(${flyer})`, backgroundSize: "200% auto", backgroundPosition: "100% 26.8%" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => {
            const Icon = icons[i];
            return (
              <li
                key={h.title}
                className={`flex flex-col gap-2 border-border px-3 py-6 sm:px-5 ${i % 2 === 1 ? "border-l" : ""} ${
                  i > 0 ? "lg:border-l" : ""
                } ${i > 1 ? "border-t lg:border-t-0" : ""}`}
              >
                <Icon className="text-orange" size={26} strokeWidth={2.2} aria-hidden />
                <p className="font-cond text-2xl font-extrabold uppercase leading-[1.05] text-navy dark:text-foreground">
                  {h.title}
                </p>
                <p className="text-sm text-muted-foreground">{h.note}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bg-orange">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-navy sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-cond text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
            New sessions start Wednesday, September 30th
          </p>
          <span className="w-fit -rotate-2 bg-navy px-5 py-2 font-script text-2xl text-white">Free session!</span>
        </div>
      </div>
    </section>
  );
}
