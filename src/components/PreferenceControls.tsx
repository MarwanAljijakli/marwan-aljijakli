import { LanguageIcon, MoonIcon, SunIcon } from "@/components/Icons";
import { interfaceCopy, localize } from "@/content/portfolio";
import type { Locale } from "@/content/portfolio";

export function PreferenceControls({ locale }: Readonly<{ locale: Locale }>) {
  const languageHref = locale === "ar" ? "/" : "/ar";
  const languageCode = locale === "ar" ? "EN" : "AR";

  return (
    <div
      className="preference-controls"
      role="group"
      aria-label={locale === "ar" ? "تفضيلات العرض" : "Display preferences"}
    >
      <a
        className="preference-button language-button"
        href={languageHref}
        hrefLang={locale === "ar" ? "en" : "ar"}
        lang={locale === "ar" ? "en" : "ar"}
        aria-label={localize(interfaceCopy.languageLabel, locale)}
      >
        <LanguageIcon />
        <span>{languageCode}</span>
      </a>
      <button
        className="preference-button theme-button"
        type="button"
        data-theme-toggle
        aria-label={localize(interfaceCopy.themeToLight, locale)}
      >
        <SunIcon className="theme-icon theme-icon-sun" />
        <MoonIcon className="theme-icon theme-icon-moon" />
      </button>
    </div>
  );
}
