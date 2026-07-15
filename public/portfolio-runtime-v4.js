(() => {
  "use strict";

  const root = document.documentElement;
  const locale = root.dataset.locale === "ar" ? "ar" : "en";
  const email = "marwan2004000@gmail.com";
  const copy = {
    themeToLight: { en: "Switch to light theme", ar: "التبديل إلى الوضع الفاتح" },
    themeToDark: { en: "Switch to dark theme", ar: "التبديل إلى الوضع الداكن" },
    playVideo: { en: "Play visual", ar: "تشغيل المشهد" },
    pauseVideo: { en: "Pause visual", ar: "إيقاف المشهد مؤقتًا" },
    copyEmail: { en: "Copy email", ar: "نسخ البريد" },
    copiedEmail: { en: "Email copied", ar: "تم نسخ البريد" },
    copyFailed: { en: "Copy failed — use the email link", ar: "تعذر النسخ — استخدم رابط البريد" },
  };
  const t = (value) => value[locale];

  const syncThemeControl = (theme) => {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    button.setAttribute("aria-label", t(theme === "dark" ? copy.themeToLight : copy.themeToDark));
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
    syncThemeControl(theme);
  };

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const current = root.dataset.theme === "light" ? "light" : "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });
  syncThemeControl(root.dataset.theme === "light" ? "light" : "dark");

  document.querySelectorAll("[data-menu-summary]").forEach((summary) => {
    const details = summary.closest("details");
    if (!details) return;
    const syncMenuLabel = () => {
      const label = details.open ? summary.dataset.menuCloseLabel : summary.dataset.menuOpenLabel;
      if (label) summary.setAttribute("aria-label", label);
    };
    details.addEventListener("toggle", syncMenuLabel);
    syncMenuLabel();
  });

  const copyButton = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("[data-copy-status]");
  let copyTimer = 0;

  const setCopyState = (state) => {
    if (!copyButton) return;
    copyButton.dataset.copyState = state;
    const value =
      state === "success"
        ? copy.copiedEmail
        : state === "failed"
          ? copy.copyFailed
          : copy.copyEmail;
    copyButton.setAttribute("aria-label", t(value));
    if (copyStatus) copyStatus.textContent = state === "idle" ? "" : t(value);
  };

  const copyWithSelection = () => {
    const focusedElement = document.activeElement;
    const field = document.createElement("textarea");
    field.value = email;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    field.style.pointerEvents = "none";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (copied && focusedElement instanceof HTMLElement) {
      focusedElement.focus({ preventScroll: true });
    }
    return copied;
  };

  copyButton?.addEventListener("click", async () => {
    let succeeded = false;
    try {
      await navigator.clipboard.writeText(email);
      succeeded = true;
    } catch {
      succeeded = copyWithSelection();
    }
    window.clearTimeout(copyTimer);
    setCopyState(succeeded ? "success" : "failed");
    copyTimer = window.setTimeout(() => setCopyState("idle"), 2200);
  });

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewportQuery = window.matchMedia("(max-width: 700px)");
  let reducedMotion = reducedMotionQuery.matches;
  let limitAutoplay =
    reducedMotion ||
    Boolean(navigator.connection && navigator.connection.saveData) ||
    compactViewportQuery.matches;

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -7% 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const mediaItems = Array.from(document.querySelectorAll("[data-loop-media]"));
  let currentMedia = null;
  const pendingMediaPlays = new WeakSet();

  const updateMediaControl = (media, playing) => {
    media.classList.toggle("is-playing", playing);
    media.classList.toggle("is-paused", !playing);
    const control = media.querySelector("[data-video-control]");
    if (!control) return;
    const label = media.dataset.mediaLabel || (locale === "ar" ? "المشهد" : "visual");
    control.setAttribute("aria-label", `${t(playing ? copy.pauseVideo : copy.playVideo)}: ${label}`);
    control.setAttribute("aria-pressed", playing ? "true" : "false");
  };

  const loadPoster = (media) => {
    if (media.dataset.posterLoaded === "true") return;
    const poster = media.querySelector("[data-poster-src]");
    if (poster?.dataset.posterSrc) poster.src = poster.dataset.posterSrc;
    media.dataset.posterLoaded = "true";
  };

  const loadMedia = (media) => {
    if (media.dataset.mediaLoaded === "true") return;
    const video = media.querySelector("[data-loop-video]");
    if (!video) return;
    loadPoster(media);
    video.querySelectorAll("source[data-src]").forEach((source) => {
      if (source.dataset.src) source.src = source.dataset.src;
    });
    media.dataset.mediaLoaded = "true";
    media.classList.add("is-loading");
    video.load();
  };

  const pauseMedia = (media) => {
    const video = media.querySelector("[data-loop-video]");
    if (video && !video.paused) video.pause();
    updateMediaControl(media, false);
    if (currentMedia === media) currentMedia = null;
  };

  const playMedia = async (media, userInitiated = false) => {
    if (limitAutoplay && !userInitiated) return;
    if (!userInitiated && media.dataset.mediaEager === "true" && media.dataset.eagerReleased !== "true") {
      return;
    }
    loadMedia(media);
    const video = media.querySelector("[data-loop-video]");
    if (!video || pendingMediaPlays.has(media)) return;
    if (!video.paused) {
      currentMedia = media;
      updateMediaControl(media, true);
      return;
    }
    mediaItems.forEach((candidate) => {
      if (candidate !== media) pauseMedia(candidate);
    });
    pendingMediaPlays.add(media);
    try {
      await video.play();
      currentMedia = media;
      updateMediaControl(media, true);
    } catch {
      updateMediaControl(media, false);
    } finally {
      pendingMediaPlays.delete(media);
    }
  };

  const mediaVisibilityRatio = (media) => {
    const bounds = media.getBoundingClientRect();
    const visibleHeight = Math.max(
      0,
      Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0)
    );
    return visibleHeight / Math.max(bounds.height, 1);
  };

  const syncVisibleMedia = () => {
    if (limitAutoplay) return;
    const ranked = mediaItems
      .map((media) => ({ media, ratio: mediaVisibilityRatio(media) }))
      .sort((a, b) => b.ratio - a.ratio);
    const best = ranked[0]?.ratio >= 0.22 ? ranked[0].media : null;
    mediaItems.forEach((media) => {
      if (media !== best) pauseMedia(media);
    });
    if (best) void playMedia(best);
  };

  mediaItems.forEach((media) => {
    const video = media.querySelector("[data-loop-video]");
    const control = media.querySelector("[data-video-control]");
    updateMediaControl(media, false);
    video?.addEventListener("loadeddata", () => {
      media.classList.remove("is-loading", "is-unavailable");
      media.classList.add("is-ready");
      syncVisibleMedia();
    });
    video?.addEventListener("error", () => {
      media.classList.remove("is-loading");
      media.classList.add("is-unavailable");
      updateMediaControl(media, false);
    });
    video?.addEventListener("playing", () => updateMediaControl(media, true));
    video?.addEventListener("pause", () => updateMediaControl(media, false));
    control?.addEventListener("click", () => {
      if (!video || video.paused) void playMedia(media, true);
      else pauseMedia(media);
    });
  });

  if ("IntersectionObserver" in window) {
    const mediaLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const media = entry.target;
          loadPoster(media);
          if (!limitAutoplay && media.dataset.mediaEager !== "true") loadMedia(media);
          observer.unobserve(media);
        });
      },
      { rootMargin: "320px 0px", threshold: 0 }
    );
    const mediaObserver = new IntersectionObserver(syncVisibleMedia, {
      rootMargin: "0px",
      threshold: [0, 0.12, 0.22, 0.5],
    });
    mediaItems.forEach((media) => {
      mediaLoadObserver.observe(media);
      mediaObserver.observe(media);
    });
  }

  const startEagerMedia = () => {
    const eagerMedia = mediaItems.find((item) => item.dataset.mediaEager === "true");
    if (!eagerMedia || limitAutoplay) return;
    loadMedia(eagerMedia);
    window.setTimeout(() => {
      eagerMedia.dataset.eagerReleased = "true";
      const bounds = eagerMedia.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) void playMedia(eagerMedia);
    }, 1800);
  };

  if (document.readyState === "complete") startEagerMedia();
  else window.addEventListener("load", startEagerMedia, { once: true });

  const refreshPlaybackPreference = () => {
    reducedMotion = reducedMotionQuery.matches;
    const shouldLimit =
      reducedMotion ||
      Boolean(navigator.connection && navigator.connection.saveData) ||
      compactViewportQuery.matches;
    const becameLimited = shouldLimit && !limitAutoplay;
    const becameUnrestricted = !shouldLimit && limitAutoplay;
    limitAutoplay = shouldLimit;
    if (becameLimited) mediaItems.forEach((media) => pauseMedia(media));
    if (becameUnrestricted) startEagerMedia();
  };

  reducedMotionQuery.addEventListener?.("change", refreshPlaybackPreference);
  compactViewportQuery.addEventListener?.("change", refreshPlaybackPreference);
  navigator.connection?.addEventListener?.("change", refreshPlaybackPreference);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && currentMedia) pauseMedia(currentMedia);
  });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(".mobile-nav a")) return;
    event.target.closest("details")?.removeAttribute("open");
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "portfolio-theme" && (event.newValue === "light" || event.newValue === "dark")) {
      applyTheme(event.newValue);
    }
  });

  root.classList.add("runtime-ready");
})();
