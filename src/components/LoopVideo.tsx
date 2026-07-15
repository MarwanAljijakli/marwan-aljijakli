import { Bilingual } from "@/components/Bilingual";
import { PauseIcon, PlayIcon } from "@/components/Icons";
import { interfaceCopy } from "@/content/portfolio";
import type { MediaAsset } from "@/content/portfolio";

type LoopVideoProps = Readonly<{
  asset: MediaAsset;
  className?: string;
  eager?: boolean;
  compactCaption?: boolean;
}>;

export function LoopVideo({
  asset,
  className = "",
  eager = false,
  compactCaption = false,
}: LoopVideoProps) {
  return (
    <figure
      className={`loop-media ${className}`.trim()}
      data-loop-media
      data-media-eager={eager ? "true" : "false"}
      data-media-label-en={asset.label.en}
      data-media-label-ar={asset.label.ar}
    >
      {/* Posters are pre-compressed WebP files with fixed dimensions; the hero is fetched at high priority. */}
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
      <span className="loop-media-grid" aria-hidden="true" />

      <figcaption className={compactCaption ? "media-caption media-caption-compact" : "media-caption"}>
        <span className="media-caption-label">
          <span className="media-live-mark" aria-hidden="true" />
          <Bilingual text={asset.label} />
        </span>
        <span className="media-caption-note">
          <Bilingual text={asset.note} />
        </span>
      </figcaption>

      <button
        className="media-control"
        type="button"
        aria-label={`${interfaceCopy.playVideo.en}: ${asset.label.en} / ${interfaceCopy.playVideo.ar}: ${asset.label.ar}`}
        aria-pressed="false"
        data-video-control
      >
        <PauseIcon className="media-control-pause" />
        <PlayIcon className="media-control-play" />
      </button>

      <p className="media-unavailable" role="status">
        <Bilingual text={interfaceCopy.videoUnavailable} />
      </p>
    </figure>
  );
}
