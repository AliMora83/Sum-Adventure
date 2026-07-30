"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui/Button";
import { tours } from "@/data/tours";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";

const initialState: EnquiryState = { status: "idle" };

const fieldClass =
  "mt-2 w-full border border-contour/30 bg-white px-4 py-3 text-[15px] text-senqu placeholder:text-[#8a9ab0] focus-visible:border-minowane";
const labelClass = "block font-mono text-[11px] uppercase tracking-[0.14em] text-[#5B6C90]";
const errorClass = "mt-1.5 text-[13px] text-minowane-deep";

export function EnquiryForm({ defaultTourSlug }: { defaultTourSlug?: string }) {
  const [state, formAction, isPending] = useActionState(submitEnquiry, initialState);
  const honeypotId = useId();

  if (state.status === "success") {
    return (
      <div className="mt-10 border border-contour/20 bg-white p-8">
        <p className="type-display text-xl text-senqu">Thanks — enquiry sent</p>
        <p className="mt-3 text-[15px] text-[#33456B]">{state.message}</p>
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
        <p className="text-[14px] text-minowane-deep">{state.message}</p>
      )}

      {state.status === "fallback" && (
        <div className="border border-dashed border-minowane/50 p-5">
          <p className="text-[14.5px] text-senqu">{state.message}</p>
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
        className="inline-flex items-center gap-2 rounded-sm bg-minowane-deep px-7 py-4 text-[13px] uppercase tracking-[0.1em] text-white transition-transform duration-200 ease-alt hover:-translate-y-0.5 hover:bg-minowane disabled:opacity-60 disabled:hover:translate-y-0 [font-variation-settings:'wdth'_100,'wght'_700]"
      >
        {isPending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
