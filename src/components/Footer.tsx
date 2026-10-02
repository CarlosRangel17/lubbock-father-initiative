import { Mail, MapPin } from "lucide-react";
import { contact } from "../data/content";

export default function Footer() {
  return (
    <footer className="bg-hero text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange text-navy">
            <MapPin />
          </span>
          <p>
            <span className="block text-lg font-bold">{contact.address}</span>
            <span className="text-white/80">{contact.site}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange text-navy">
            <Mail />
          </span>
          <p className="min-w-0">
            <span className="block font-bold">Contact {contact.name} for more info:</span>
            <a href={`mailto:${contact.email}`} className="break-all text-white/80 underline-offset-2 hover:underline">
              {contact.email}
            </a>
          </p>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center font-cond text-sm font-bold uppercase tracking-widest text-white/60">
        Strong fathers. Strong families. Strong communities.
      </p>
    </footer>
  );
}
