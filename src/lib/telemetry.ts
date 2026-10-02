export type TelemetryEvents = {
  intake_form_start: { path: "wizard" | "google_form" };
  intake_step_complete: { step_index: number; step_name: string };
  intake_form_submit_success: { track: string; queued: boolean };
  intake_form_submit_error: { reason: string };
  intake_config_error: { code: string };
  zoom_link_clicked: { group_id: string };
  resource_flyer_download: { resource_id: string };
};

export interface TelemetryService {
  track<K extends keyof TelemetryEvents>(name: K, params: TelemetryEvents[K]): void;
}

type Pending = { name: string; params: Record<string, unknown> };
type LogFn = (name: string, params?: Record<string, unknown>) => void;

const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};
const isConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let sink: LogFn | null = null;
let booting: Promise<void> | null = null;
const buffer: Pending[] = [];

// Firebase is loaded lazily so it never blocks first paint or breaks the app when unconfigured.
function boot() {
  if (booting) return booting;
  booting = (async () => {
    if (!isConfigured) {
      console.warn("[telemetry] Firebase env vars missing; events are logged locally only.");
      return;
    }
    try {
      const [{ initializeApp }, analytics] = await Promise.all([
        import("firebase/app"),
        import("firebase/analytics"),
      ]);
      if (!(await analytics.isSupported())) return;
      const instance = analytics.getAnalytics(initializeApp(config));
      sink = (name, params) => analytics.logEvent(instance, name, params);
      buffer.splice(0).forEach((e) => sink?.(e.name, e.params));
    } catch (err) {
      console.warn("[telemetry] Firebase failed to initialise", err);
    }
  })();
  return booting;
}

export const telemetry: TelemetryService = {
  track(name, params) {
    const payload = params as Record<string, unknown>;
    if (env.DEV) console.debug("[telemetry]", name, payload);
    if (sink) sink(name, payload);
    else {
      buffer.push({ name, params: payload });
      if (buffer.length > 50) buffer.shift();
      void boot();
    }
  },
};

export const telemetryConfigured = isConfigured;
