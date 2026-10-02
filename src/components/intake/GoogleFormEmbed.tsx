import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { telemetry } from "../../lib/telemetry";
import { btnGhost } from "../ui";

const FORM_URL: string | undefined = import.meta.env.VITE_GOOGLE_FORM_URL;

// Accepts a normal share link or an /viewform URL; always renders the embeddable variant.
function toEmbedUrl(url: string) {
  const u = new URL(url);
  u.searchParams.set("embedded", "true");
  return u.toString();
}

export default function GoogleFormEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!FORM_URL) {
      telemetry.track("intake_config_error", { code: "missing_google_form_url" });
      return;
    }
    if (!started.current) {
      started.current = true;
      telemetry.track("intake_form_start", { path: "google_form" });
    }
    const t = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!FORM_URL) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <p className="font-display text-xl font-black">Google Form not connected yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Set <code className="rounded bg-muted px-1.5 py-0.5">VITE_GOOGLE_FORM_URL</code> to your form&apos;s share
          link and it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative h-[80vh] min-h-[560px]">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="animate-spin" />
            <p className="text-sm">Loading form...</p>
          </div>
        )}
        <iframe
          title="Fatherhood Initiative intake form"
          src={toEmbedUrl(FORM_URL)}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          referrerPolicy="strict-origin-when-cross-origin"
          className={`h-full w-full border-0 bg-white transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          Loading…
        </iframe>
      </div>
      {(slow || loaded) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-3 text-sm">
          <span className="text-muted-foreground">Trouble viewing the form on your phone?</span>
          <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className={`${btnGhost} !min-h-10 !py-1.5 !text-base`}>
            Open in new tab <ExternalLink size={16} />
          </a>
        </div>
      )}
    </div>
  );
}
