import Image from "next/image";
import { LoopVideo } from "@/components/LoopVideo";
import { localize } from "@/content/portfolio";
import type { Locale, ProjectImage, ProjectVideo } from "@/content/portfolio";

export function ProjectVisual({
  visual,
  locale,
}: Readonly<{
  visual: ProjectImage | ProjectVideo;
  locale: Locale;
}>) {
  if (visual.type === "video") {
    return (
      <div className="project-video-frame">
        <LoopVideo asset={visual.asset} locale={locale} className="project-video" />
      </div>
    );
  }

  return (
    <figure className="browser-frame">
      <figcaption className="browser-bar">
        <span className="browser-controls" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-address">{localize(visual.browserLabel, locale)}</span>
        <span className="browser-secure" aria-hidden="true">
          TLS
        </span>
      </figcaption>
      <div className="browser-viewport">
        <Image
          src={localize(visual.src, locale)}
          alt={localize(visual.alt, locale)}
          width={visual.width}
          height={visual.height}
          sizes="(max-width: 900px) 100vw, 58vw"
          quality={86}
        />
      </div>
    </figure>
  );
}
