import { useEffect, useRef, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { CheckCircle2, CloudOff, Loader2 } from "lucide-react";
import { allSlots } from "../../data/content";
import { draftStore, submitIntake, useQueuedCount, ValidationRejected } from "../../lib/intakeQueue";
import { telemetry } from "../../lib/telemetry";
import { btnGhost, btnPrimary } from "../ui";

export type IntakeValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactPref: "text" | "call" | "email";
  childCount: string;
  childAges: string;
  needsChildcare: boolean;
  referredBy: string;
  slotId: string;
  notes: string;
  consent: boolean;
};

const defaults: IntakeValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  contactPref: "text",
  childCount: "1",
  childAges: "",
  needsChildcare: false,
  referredBy: "",
  slotId: "",
  notes: "",
  consent: false,
};

const steps: { name: string; title: string; fields: FieldPath<IntakeValues>[] }[] = [
  { name: "about_you", title: "About you", fields: ["firstName", "lastName", "phone", "email", "contactPref"] },
  { name: "family", title: "Your family", fields: ["childCount", "childAges", "needsChildcare", "referredBy"] },
  { name: "schedule", title: "Your session", fields: ["slotId"] },
  { name: "review", title: "Review", fields: ["consent"] },
];

const input =
  "mt-1 block w-full min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground/70";
const label = "block text-sm font-bold";
const err = "mt-1 text-sm font-semibold text-coral";

export default function IntakeWizard({ presetSlot, referral }: { presetSlot?: string; referral?: boolean }) {
  const saved = useRef(draftStore.load<IntakeValues>());
  const [step, setStep] = useState(saved.current?.step ?? 0);
  const [done, setDone] = useState<null | { queued: boolean }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const started = useRef(false);
  const queued = useQueuedCount();

  const form = useForm<IntakeValues>({
    mode: "onTouched",
    defaultValues: { ...defaults, ...saved.current?.values },
  });
  const { register, trigger, handleSubmit, watch, setValue, getValues, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    if (presetSlot) setValue("slotId", presetSlot, { shouldDirty: true });
    if (referral) setValue("referredBy", getValues("referredBy") || "Referred on behalf of a dad", { shouldDirty: true });
  }, [presetSlot, referral, setValue, getValues]);

  useEffect(() => {
    const sub = watch((values) => {
      if (!started.current) {
        started.current = true;
        telemetry.track("intake_form_start", { path: "wizard" });
      }
      draftStore.save(step, { ...values, consent: false });
    });
    return () => sub.unsubscribe();
  }, [watch, step]);

  const next = async () => {
    if (!(await trigger(steps[step].fields))) return;
    telemetry.track("intake_step_complete", { step_index: step, step_name: steps[step].name });
    setStep((s) => s + 1);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setServerError("");
    const slot = allSlots.find((s) => s.id === values.slotId);
    try {
      const result = await submitIntake({
        ...values,
        track: slot?.track ?? "",
        sessionLabel: slot ? `${slot.day} ${slot.time}` : "",
        submittedAt: new Date().toISOString(),
        clientId: crypto.randomUUID(),
        source: "web-wizard",
      });
      telemetry.track("intake_step_complete", { step_index: 3, step_name: "review" });
      telemetry.track("intake_form_submit_success", { track: slot?.track ?? "", queued: result.queued });
      draftStore.clear();
      setDone({ queued: result.queued });
    } catch (e) {
      const reason = e instanceof ValidationRejected ? "validation_rejected" : "unknown";
      telemetry.track("intake_form_submit_error", { reason });
      setServerError("We could not accept that submission. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  });

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center" role="status">
        {done.queued ? (
          <CloudOff className="mx-auto text-orange" size={44} />
        ) : (
          <CheckCircle2 className="mx-auto text-active" size={44} />
        )}
        <h3 className="mt-4 font-display text-2xl font-black">
          {done.queued ? "Saved on this device" : "You are in. Welcome."}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          {done.queued
            ? "Your connection looks shaky. We will send your form automatically as soon as you are back online. You can close this page."
            : "Tyson will reach out using your preferred contact method to confirm your session."}
        </p>
      </div>
    );
  }

  const slotId = watch("slotId");

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <ol className="mb-6 grid grid-cols-4 gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s.name} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-active" : "bg-border"}`} />
            <span
              className={`mt-1.5 block font-cond text-sm font-bold uppercase tracking-wide ${
                i === step ? "text-foreground" : "text-muted-foreground"
              } ${i === step ? "" : "max-sm:hidden"}`}
            >
              {i + 1}. {s.title}
            </span>
          </li>
        ))}
      </ol>

      {queued > 0 && (
        <p className="mb-4 flex items-center gap-2 rounded-lg bg-orange/15 px-3 py-2 text-sm font-semibold">
          <CloudOff size={16} /> {queued} submission{queued > 1 ? "s" : ""} waiting to sync
        </p>
      )}

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="firstName">First name</label>
            <input id="firstName" autoComplete="given-name" className={input} {...register("firstName", { required: "Required" })} />
            {errors.firstName && <p className={err}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="lastName">Last name</label>
            <input id="lastName" autoComplete="family-name" className={input} {...register("lastName", { required: "Required" })} />
            {errors.lastName && <p className={err}>{errors.lastName.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="phone">Mobile phone</label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={input}
              {...register("phone", { required: "Required", pattern: { value: /^[\d\s().+-]{10,}$/, message: "Enter a 10-digit number" } })}
            />
            {errors.phone && <p className={err}>{errors.phone.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="email">Email (optional)</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={input}
              {...register("email", { pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })}
            />
            {errors.email && <p className={err}>{errors.email.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="contactPref">Best way to reach you</label>
            <select id="contactPref" className={input} {...register("contactPref")}>
              <option value="text">Text message</option>
              <option value="call">Phone call</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="childCount">Number of children</label>
            <select id="childCount" className={input} {...register("childCount")}>
              {["1", "2", "3", "4", "5+"].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="childAges">Children&apos;s ages</label>
            <input id="childAges" placeholder="e.g. 4, 9" className={input} {...register("childAges", { required: "Required" })} />
            {errors.childAges && <p className={err}>{errors.childAges.message}</p>}
          </div>
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-border px-3 py-2 sm:col-span-2">
            <input type="checkbox" className="h-5 w-5 accent-[var(--orange)]" {...register("needsChildcare")} />
            <span className="font-semibold">I would like childcare support during sessions</span>
          </label>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="referredBy">How did you hear about us?</label>
            <input id="referredBy" placeholder="Flyer, caseworker, friend..." className={input} {...register("referredBy")} />
          </div>
        </div>
      )}

      {step === 2 && (
        <fieldset>
          <legend className={label}>Choose a session</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {allSlots.map((s) => (
              <label
                key={s.id}
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 ${
                  slotId === s.id ? "border-active bg-active/10" : "border-border"
                }`}
              >
                <input type="radio" value={s.id} className="h-5 w-5 accent-[var(--orange)]" {...register("slotId", { required: "Pick a session" })} />
                <span>
                  <span className="block font-cond text-xl font-bold uppercase leading-tight">
                    {s.day} · {s.period}
                  </span>
                  <span className="text-sm text-muted-foreground">{s.time}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.slotId && <p className={err}>{errors.slotId.message}</p>}
          <label className={`${label} mt-4`} htmlFor="notes">Anything we should know? (optional)</label>
          <textarea id="notes" rows={3} className={input} {...register("notes")} />
        </fieldset>
      )}

      {step === 3 && (
        <div>
          <dl className="grid gap-x-6 gap-y-2 rounded-lg bg-secondary p-4 text-sm sm:grid-cols-2">
            {(
              [
                ["Name", `${getValues("firstName")} ${getValues("lastName")}`],
                ["Phone", getValues("phone")],
                ["Children", `${getValues("childCount")} (${getValues("childAges")})`],
                ["Childcare", getValues("needsChildcare") ? "Yes" : "No"],
                [
                  "Session",
                  (() => {
                    const s = allSlots.find((x) => x.id === getValues("slotId"));
                    return s ? `${s.day} ${s.time}` : "";
                  })(),
                ],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="font-bold text-muted-foreground">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <label className="mt-4 flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[var(--orange)]" {...register("consent", { required: "Please confirm to continue" })} />
            <span className="text-sm">
              I agree to be contacted by the YWCA Lubbock Fatherhood Initiative about this program.
            </span>
          </label>
          {errors.consent && <p className={err}>{errors.consent.message}</p>}
          {serverError && <p className={err} role="alert">{serverError}</p>}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" className={btnGhost} onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button type="button" className={btnPrimary} onClick={next}>
            Continue
          </button>
        ) : (
          <button type="submit" className={btnPrimary} disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" size={18} />} Submit
          </button>
        )}
      </div>
    </form>
  );
}
