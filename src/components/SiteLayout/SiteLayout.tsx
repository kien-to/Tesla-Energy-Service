"use client";

import { LayoutResult } from "@/lib/types";
import styles from "./SiteLayout.module.scss";

interface SiteLayoutProps {
  layout: LayoutResult | null;
}

export default function SiteLayout({ layout }: SiteLayoutProps) {
  if (!layout || layout.items.length === 0) {
    return (
      <section className={styles.panel}>
        <h2 className={styles.title}>Site Layout</h2>
        <div className={styles.empty}>
          Add batteries above to generate a site layout.
        </div>
      </section>
    );
  }

  const scale = Math.min(1, 800 / layout.siteWidth);

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Site Layout</h2>
      <p className={styles.dimensions}>
        {layout.siteWidth}ft x {layout.siteHeight}ft &middot; Max width 100ft
      </p>
      <div className={styles.canvasWrapper}>
        <div
          className={styles.canvas}
          style={{
            width: layout.siteWidth * scale,
            height: layout.siteHeight * scale,
          }}
        >
          {layout.items.map((item) => (
            <div
              key={item.id}
              className={styles.device}
              style={{
                left: item.x * scale,
                top: item.y * scale,
                width: item.width * scale,
                height: item.height * scale,
                backgroundColor: item.color,
              }}
              title={`${item.label} (${item.width}x${item.height}ft)`}
            >
              <span className={styles.deviceLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.legend}>
        {Array.from(new Set(layout.items.map((i) => i.type))).map((type) => {
          const item = layout.items.find((i) => i.type === type)!;
          return (
            <div key={type} className={styles.legendItem}>
              <span
                className={styles.legendSwatch}
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
