import { approach, localize } from "@/content/portfolio";
import type { Locale } from "@/content/portfolio";

export function EngineeringFlow({ locale }: Readonly<{ locale: Locale }>) {
  return (
    <div
      className="engineering-flow reveal"
      data-reveal
      aria-label={
        locale === "ar"
          ? "مسار هندسي من النموذج الأولي إلى التشغيل الفعلي"
          : "Engineering path from prototype to production"
      }
    >
      <div className="flow-boundaries" aria-hidden="true">
        <span>{localize(approach.start, locale)}</span>
        <span>{localize(approach.end, locale)}</span>
      </div>
      <ol className="flow-track">
        {approach.steps.map((step) => (
          <li key={step.number}>
            <span className="flow-node" aria-hidden="true">
              {step.number}
            </span>
            <div>
              <h3>{localize(step.title, locale)}</h3>
              <p>{localize(step.detail, locale)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
