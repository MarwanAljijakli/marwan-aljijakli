import { LanguageIcon, MoonIcon, SunIcon } from "@/components/Icons";

const copy = {
  language: { en: "Switch language", ar: "تبديل اللغة" },
  themeToLight: {
    en: "Dark theme active; switch to light theme",
    ar: "الوضع الداكن مفعّل؛ التبديل إلى الوضع الفاتح",
  },
} as const;

export function PreferenceControls() {
  return (
    <div className="preference-controls" role="group" aria-label="Display preferences / تفضيلات العرض">
      <button
        className="preference-button language-button"
        type="button"
        data-locale-toggle
        aria-label={`AR / EN — ${copy.language.en} / ${copy.language.ar}`}
      >
        <LanguageIcon />
        <span className="language-code language-code-en">AR</span>
        <span className="language-code language-code-ar">EN</span>
      </button>
      <button
        className="preference-button theme-button"
        type="button"
        data-theme-toggle
        aria-label={`${copy.themeToLight.en} / ${copy.themeToLight.ar}`}
      >
        <SunIcon className="theme-icon theme-icon-sun" />
        <MoonIcon className="theme-icon theme-icon-moon" />
      </button>
    </div>
  );
}
