// Vercel serverless function: validates the intake JSON and forwards it to a Google Apps Script
// web app (see sheets-webhook.gs) that appends a row to the admin Google Sheet.
// Env: GOOGLE_SHEETS_WEBHOOK_URL, GOOGLE_SHEETS_WEBHOOK_SECRET

type Req = { method?: string; body?: Record<string, unknown> };
type Res = { status: (n: number) => Res; json: (b: unknown) => void };

const required = ["firstName", "lastName", "phone", "slotId", "clientId", "submittedAt"];

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const body = req.body ?? {};
  const missing = required.filter((k) => !body[k]);
  if (missing.length) return res.status(422).json({ error: "invalid", missing });

  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return res.status(500).json({ error: "sheets_not_configured" });

  const upstream = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET, row: body }),
  });
  if (!upstream.ok) return res.status(502).json({ error: "sheets_upstream_failed" });
  return res.status(200).json({ ok: true });
}
