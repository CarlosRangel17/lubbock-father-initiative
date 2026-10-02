import { useCallback, useEffect, useState } from "react";

export type IntakePayload = Record<string, unknown> & { submittedAt: string; clientId: string };

const QUEUE_KEY = "fi:intake-queue";
const DRAFT_KEY = "fi:intake-draft";
const ENDPOINT = import.meta.env.VITE_INTAKE_ENDPOINT || "/api/intake";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: submission still attempts live */
  }
};

export const draftStore = {
  load: <T,>() => read<{ step: number; values: T } | null>(DRAFT_KEY, null),
  save: (step: number, values: unknown) => write(DRAFT_KEY, { step, values }),
  clear: () => localStorage.removeItem(DRAFT_KEY),
};

export class ValidationRejected extends Error {}

async function send(payload: IntakePayload) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 400 || res.status === 422) throw new ValidationRejected(await res.text());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function submitIntake(
  payload: IntakePayload,
): Promise<{ queued: boolean; reason?: string }> {
  try {
    await send(payload);
    return { queued: false };
  } catch (err) {
    if (err instanceof ValidationRejected) throw err;
    write(QUEUE_KEY, [...read<IntakePayload[]>(QUEUE_KEY, []), payload]);
    notify();
    return { queued: true, reason: err instanceof Error ? err.message : "network" };
  }
}

export async function flushQueue() {
  const queue = read<IntakePayload[]>(QUEUE_KEY, []);
  const remaining: IntakePayload[] = [];
  for (const item of queue) {
    try {
      await send(item);
    } catch (err) {
      if (!(err instanceof ValidationRejected)) remaining.push(item);
    }
  }
  write(QUEUE_KEY, remaining);
  notify();
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function useQueuedCount() {
  const [count, setCount] = useState(() => read<IntakePayload[]>(QUEUE_KEY, []).length);
  const refresh = useCallback(() => setCount(read<IntakePayload[]>(QUEUE_KEY, []).length), []);
  useEffect(() => {
    listeners.add(refresh);
    const onOnline = () => void flushQueue();
    window.addEventListener("online", onOnline);
    if (navigator.onLine) void flushQueue();
    return () => {
      listeners.delete(refresh);
      window.removeEventListener("online", onOnline);
    };
  }, [refresh]);
  return count;
}
