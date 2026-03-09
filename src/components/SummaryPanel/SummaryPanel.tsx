"use client";

import { CalculationResult, LayoutResult } from "@/lib/types";
import styles from "./SummaryPanel.module.scss";

interface SummaryPanelProps {
  calculation: CalculationResult | null;
  layout: LayoutResult | null;
}

export default function SummaryPanel({
  calculation,
  layout,
}: SummaryPanelProps) {
  if (!calculation) {
    return (
      <section className={styles.panel}>
        <h2 className={styles.title}>Site Summary</h2>
        <p className={styles.empty}>Add batteries to see summary.</p>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Site Summary</h2>
      <div className={styles.grid}>
        <div className={styles.metric}>
          <span className={styles.label}>Total Cost</span>
          <span className={styles.value}>
            ${calculation.totalCost.toLocaleString()}
          </span>
          <span className={styles.breakdown}>
            Batteries: ${calculation.batteryCost.toLocaleString()}
            {" · "}
            Transformers: ${calculation.transformerCost.toLocaleString()}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Net Energy</span>
          <span className={styles.value}>{Math.round(calculation.totalEnergy * 10) / 10} MWh</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Land Size</span>
          <span className={styles.value}>
            {layout ? `${layout.siteWidth} x ${layout.siteHeight} ft` : "—"}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Batteries</span>
          <span className={styles.value}>{calculation.totalBatteries}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Transformers</span>
          <span className={styles.value}>{calculation.numTransformers}</span>
        </div>
      </div>
    </section>
  );
}
