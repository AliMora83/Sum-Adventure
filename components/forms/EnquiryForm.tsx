"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui/Button";
import { tours } from "@/data/tours";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";

const initialState: EnquiryState = { status: "idle" };

/**
 * text-base (16px), not 15px: iOS Safari zooms the viewport when a focused
 * input's font-size is below 16px, and it does not zoom back out. That is a
 * one-pixel change with a disproportionate mobile cost.
 *
 * The placeholder is #5F7671, not #8AA09C. The old value measured 2.77:1 on
 * white and failed AA outright; this one is 4.86:1. Placeholder text is real
 * text and is held to the 4.5:1 threshold like any other.
 *
 * The border is `teal-deep/65`, up from /30, and it is load-bearing rather
 * than decoration: the white field is 1.10:1 against the ice page background,
 * so with no border there is effectively no visible edge at all and SC 1.4.11
 * has nothing to measure.
 *
 * The border has TWO adjacent surfaces and they do not measure the same.
 * Tailwind v4 resolves the alpha in oklab, so these are sampled off a real
 * composited pixel rather than derived by sRGB arithmetic. At /65 the border
 * renders rgb(103,155,151) — `background-clip` defaults to `border-box`, so
 * the field's own white paints underneath the border, which is why the
 * rendered value is the same on both sides:
 *
 *   vs the white field interior   3.13:1   clears 3:1
 *   vs the ice page background    2.84:1   does NOT clear 3:1
 *
 * The inner boundary passes and the outer one is 0.16 short. Recorded rather
 * than silently fixed: /70 is the first step that clears both (3.46 inner,
 * 3.14 outer) and is the change to make if the outer edge is ruled in scope.
 * Do not lower below /65 — /30 was 1.60:1 and 1.46:1, i.e. no measurable edge
 * on either side.
 */
const fieldClass =
  "mt-2 w-full rounded-sm border border-teal-deep/65 bg-white px-4 py-3 text-base text-surface-dark placeholder:text-[#5F7671] focus-visible:border-teal-deep";
const labelClass = "block font-mono text-[11px] uppercase tracking-[0.14em] text-[#586A67]";
const errorClass = "mt-1.5 text-[13px] text-teal-deep";

export function EnquiryForm({ defaultTourSlug }: { defaultTourSlug?: string }) {
  const [state, formAction, isPending] = useActionState(submitEnquiry, initialState);
  const honeypotId = useId();

  if (state.status === "success") {
    return (
      <div className="mt-10 border border-teal-deep/20 bg-white rounded-md p-8">
        <p className="type-display text-xl text-surface-dark">Thanks — enquiry sent</p>
        <p className="mt-3 text-[15px] text-[#2F3E3C]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-10 space-y-5">
      {/* Honeypot — hidden from sighted and keyboard users, bots tend to fill it anyway. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={honeypotId}>Leave this field blank</label>
        <input type="text" id={honeypotId} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Name *
        </label>
        <input id="name" name="name" type="text" required className={fieldClass} />
        {state.fieldErrors?.name && <p className={errorClass}>{state.fieldErrors.name}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone / WhatsApp *
          </label>
          <input id="phone" name="phone" type="tel" required className={fieldClass} />
          {state.fieldErrors?.phone && <p className={errorClass}>{state.fieldErrors.phone}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input id="email" name="email" type="email" required className={fieldClass} />
          {state.fieldErrors?.email && <p className={errorClass}>{state.fieldErrors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="tour" className={labelClass}>
          Tour of interest
        </label>
        <select
          id="tour"
          name="tour"
          defaultValue={defaultTourSlug ?? ""}
          className={fieldClass}
        >
          <option value="">General enquiry</option>
          {tours.map((tour) => (
            <option key={tour.slug} value={tour.slug}>
              {tour.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="dates" className={labelClass}>
            Preferred dates
          </label>
          <input
            id="dates"
            name="dates"
            type="text"
            placeholder="e.g. mid-August"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="groupSize" className={labelClass}>
            Group size
          </label>
          <input
            id="groupSize"
            name="groupSize"
            type="text"
            placeholder="e.g. 4 adults"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message *
        </label>
        <textarea id="message" name="message" required rows={5} className={fieldClass} />
        {state.fieldErrors?.message && <p className={errorClass}>{state.fieldErrors.message}</p>}
      </div>

      {state.status === "error" && state.message && (
        <p className="text-[14px] text-teal-deep">{state.message}</p>
      )}

      {state.status === "fallback" && (
        <div className="border border-dashed border-teal-deep/50 p-5">
          <p className="text-[14.5px] text-surface-dark">{state.message}</p>
          {state.whatsappHref && (
            <Button href={state.whatsappHref} external className="mt-4">
              Continue on WhatsApp
            </Button>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-surface-dark px-7 py-4 text-[13px] uppercase tracking-[0.1em] text-white transition-transform duration-200 ease-alt hover:-translate-y-0.5 hover:bg-teal-deep disabled:opacity-60 disabled:hover:translate-y-0 [font-variation-settings:'wdth'_100,'wght'_700]"
      >
        {isPending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
