import { CheckIcon, CopyIcon } from "@/components/Icons";
import { interfaceCopy, localize } from "@/content/portfolio";
import type { Locale } from "@/content/portfolio";

export function CopyEmailButton({ locale }: Readonly<{ locale: Locale }>) {
  return (
    <>
      <button
        className="contact-action contact-copy-button"
        type="button"
        data-copy-email
        data-copy-state="idle"
        aria-label={localize(interfaceCopy.copyEmail, locale)}
      >
        <CopyIcon className="copy-icon copy-icon-idle" />
        <CheckIcon className="copy-icon copy-icon-success" />
        <span className="copy-state copy-state-idle">{localize(interfaceCopy.copyEmail, locale)}</span>
        <span className="copy-state copy-state-success">{localize(interfaceCopy.copiedEmail, locale)}</span>
        <span className="copy-state copy-state-failed">{localize(interfaceCopy.copyFailed, locale)}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite" data-copy-status />
    </>
  );
}
