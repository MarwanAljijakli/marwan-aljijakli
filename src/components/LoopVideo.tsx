import { PauseIcon, PlayIcon } from "@/components/Icons";
import { interfaceCopy, localize } from "@/content/portfolio";
import type { Locale, MediaAsset } from "@/content/portfolio";

type LoopVideoProps = Readonly<{
  asset: MediaAsset;
  locale: Locale;
  className?: string;
  eager?: boolean;
  compactCaption?: boolean;
}>;

export function LoopVideo({
  asset,
  locale,
  className = "",
  eager = false,
  compactCaption = false,
}: LoopVideoProps) {
  const label = localize(asset.label, locale);

  return (
    <figure
      className={`loop-media ${className}`.trim()}
      data-loop-media
      data-media-eager={eager ? "true" : "false"}
      data-media-label={label}
    >
      {/* Fixed-dimension WebP posters reserve layout; video sources attach only near the viewport. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="loop-media-poster"
        src={eager ? asset.poster : undefined}
        data-poster-src={eager ? undefined : asset.poster}
        width={asset.width}
        height={asset.height}
        alt=""
        aria-hidden="true"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
      <video
        className="loop-media-video"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        data-loop-video
      >
        <source data-src={asset.mp4} type="video/mp4" />
      </video>

      <span className="loop-media-shade" aria-hidden="true" />

      <figcaption className={compactCaption ? "media-caption media-caption-compact" : "media-caption"}>
        <span className="media-caption-label">
          <span className="media-live-mark" aria-hidden="true" />
          {label}
        </span>
        <span className="media-caption-note">{localize(asset.note, locale)}</span>
      </figcaption>

      <button
        className="media-control"
        type="button"
        aria-label={`${localize(interfaceCopy.playVideo, locale)}: ${label}`}
        aria-pressed="false"
        data-video-control
      >
        <PauseIcon className="media-control-pause" />
        <PlayIcon className="media-control-play" />
      </button>

      <p className="media-unavailable" role="status">
        {localize(interfaceCopy.videoUnavailable, locale)}
      </p>
    </figure>
  );
}
