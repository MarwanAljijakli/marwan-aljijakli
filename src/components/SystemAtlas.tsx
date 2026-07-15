import type { CSSProperties } from "react";
import { Bilingual } from "@/components/Bilingual";
import { systemAtlas } from "@/content/portfolio";

type AtlasStyle = CSSProperties & {
  "--layer-index": number;
};

export function SystemAtlas() {
  return (
    <div
      className="system-atlas"
      data-system-atlas
      role="img"
      aria-label="Five connected product layers: model inference, data pipelines, secure APIs, product experience, release and observability / خمس طبقات مترابطة للمنتج: استدلال النموذج وخطوط البيانات والواجهات الآمنة وتجربة المنتج والإصدار والمراقبة"
    >
      <div className="atlas-scene" aria-hidden="true">
        <span className="atlas-axis atlas-axis-x" />
        <span className="atlas-axis atlas-axis-y" />
        <span className="atlas-core">MA</span>
        {systemAtlas.layers.map((layer, index) => (
          <div
            className="atlas-layer"
            style={{ "--layer-index": index } as AtlasStyle}
            key={layer.number}
          >
            <span className="atlas-layer-number">{layer.number}</span>
            <strong>
              <Bilingual text={layer.title} />
            </strong>
            <small>
              <Bilingual text={layer.detail} />
            </small>
          </div>
        ))}
      </div>
      <span className="atlas-hint" aria-hidden="true">
        MOVE / EXPLORE
      </span>
    </div>
  );
}
