import { Bilingual } from "@/components/Bilingual";
import { CheckIcon, CopyIcon } from "@/components/Icons";
import { interfaceCopy } from "@/content/portfolio";

export function CopyEmailButton() {
  return (
    <>
      <button
        className="contact-action contact-copy"
        type="button"
        data-copy-email
        data-copy-state="idle"
        aria-label={`${interfaceCopy.copyEmail.en} / ${interfaceCopy.copyEmail.ar}`}
      >
        <CopyIcon className="copy-icon copy-icon-idle" />
        <CheckIcon className="copy-icon copy-icon-success" />
        <span className="copy-state copy-state-idle">
          <Bilingual text={interfaceCopy.copyEmail} />
        </span>
        <span className="copy-state copy-state-success">
          <Bilingual text={interfaceCopy.copiedEmail} />
        </span>
        <span className="copy-state copy-state-failed">
          <Bilingual text={interfaceCopy.copyFailed} />
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite" data-copy-status />
    </>
  );
}
