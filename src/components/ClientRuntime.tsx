"use client";

import { useEffect, useRef, useState } from "react";
import { Bilingual } from "@/components/Bilingual";
import {
  CheckIcon,
  CopyIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
} from "@/components/Icons";

const email = "marwan2004000@gmail.com";
const clientCopy = {
  language: { en: "Switch language", ar: "تبديل اللغة" },
  themeToLight: {
    en: "Dark theme active; switch to light theme",
    ar: "الوضع الداكن مفعّل؛ التبديل إلى الوضع الفاتح",
  },
  themeToDark: {
    en: "Light theme active; switch to dark theme",
    ar: "الوضع الفاتح مفعّل؛ التبديل إلى الوضع الداكن",
  },
  copyEmail: { en: "Copy email", ar: "نسخ البريد" },
  copiedEmail: { en: "Email copied", ar: "تم نسخ البريد" },
  copyFailed: { en: "Select the email above", ar: "حدد البريد أعلاه" },
} as const;

function applyLocale(locale: "en" | "ar") {
  const root = document.documentElement;
  root.dataset.locale = locale;
  root.lang = locale;
  root.dir = locale === "ar" ? "rtl" : "ltr";
  window.localStorage.setItem("portfolio-locale", locale);
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  window.localStorage.setItem("portfolio-theme", theme);
  syncThemeControl(theme);
}

function syncThemeControl(theme: "light" | "dark") {
  const button = document.querySelector<HTMLButtonElement>(".theme-button");
  if (!button) return;
  const label = theme === "dark" ? clientCopy.themeToLight : clientCopy.themeToDark;
  button.setAttribute("aria-label", `${label.en} / ${label.ar}`);
}

export function PreferenceControls() {
  const toggleLocale = () => {
    const current = document.documentElement.dataset.locale === "ar" ? "ar" : "en";
    applyLocale(current === "en" ? "ar" : "en");
  };

  const toggleTheme = () => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  };

  return (
    <div
      className="preference-controls"
      role="group"
      aria-label="Display preferences / تفضيلات العرض"
    >
      <button
        className="preference-button language-button"
        type="button"
        onClick={toggleLocale}
        aria-label={`AR / EN — ${clientCopy.language.en} / ${clientCopy.language.ar}`}
      >
        <LanguageIcon />
        <span className="language-code language-code-en">AR</span>
        <span className="language-code language-code-ar">EN</span>
      </button>
      <button
        className="preference-button theme-button"
        type="button"
        onClick={toggleTheme}
        aria-label={`${clientCopy.themeToLight.en} / ${clientCopy.themeToLight.ar}`}
      >
        <SunIcon className="theme-icon theme-icon-sun" />
        <MoonIcon className="theme-icon theme-icon-moon" />
      </button>
    </div>
  );
}

export function CopyEmailButton() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copyEmail = async () => {
    const setTemporaryStatus = (nextStatus: "copied" | "failed") => {
      setStatus(nextStatus);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("idle"), 2200);
    };

    const copyWithSelection = () => {
      const focusedElement = document.activeElement as HTMLElement | null;
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      field.style.pointerEvents = "none";
      document.body.appendChild(field);
      field.select();
      const copiedWithFallback = document.execCommand("copy");
      field.remove();
      focusedElement?.focus({ preventScroll: true });
      return copiedWithFallback;
    };

    try {
      await navigator.clipboard.writeText(email);
      setTemporaryStatus("copied");
    } catch {
      setTemporaryStatus(copyWithSelection() ? "copied" : "failed");
    }
  };

  const visibleCopy =
    status === "copied"
      ? clientCopy.copiedEmail
      : status === "failed"
        ? clientCopy.copyFailed
        : clientCopy.copyEmail;

  return (
    <>
      <button className="contact-action contact-copy" type="button" onClick={copyEmail}>
        {status === "copied" ? <CheckIcon /> : <CopyIcon />}
        <Bilingual text={visibleCopy} />
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {status === "idle" ? null : <Bilingual text={visibleCopy} />}
      </span>
    </>
  );
}

export function ClientRuntime() {
  useEffect(() => {
    const root = document.documentElement;
    syncThemeControl(root.dataset.theme === "light" ? "light" : "dark");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | null = null;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const activeObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add("is-visible");
              activeObserver.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
      observer = activeObserver;
      revealItems.forEach((item) => activeObserver.observe(item));
    }

    const closeMenu = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".mobile-nav a")) return;
      const details = target.closest("details");
      if (details) details.removeAttribute("open");
    };

    document.addEventListener("click", closeMenu);

    const syncPreference = (event: StorageEvent) => {
      if (event.key === "portfolio-locale" && (event.newValue === "en" || event.newValue === "ar")) {
        applyLocale(event.newValue);
      }
      if (event.key === "portfolio-theme" && (event.newValue === "light" || event.newValue === "dark")) {
        applyTheme(event.newValue);
      }
    };

    window.addEventListener("storage", syncPreference);
    root.classList.add("runtime-ready");

    return () => {
      observer?.disconnect();
      document.removeEventListener("click", closeMenu);
      window.removeEventListener("storage", syncPreference);
    };
  }, []);

  return null;
}
