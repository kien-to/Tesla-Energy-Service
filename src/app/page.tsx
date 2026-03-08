"use client";

import { useConfig } from "@/hooks/useConfig";
import ConfigPanel from "@/components/ConfigPanel/ConfigPanel";
import SummaryPanel from "@/components/SummaryPanel/SummaryPanel";
import SiteLayout from "@/components/SiteLayout/SiteLayout";
import styles from "./page.module.scss";

export default function Home() {
  const {
    config,
    setQuantity,
    resetConfig,
    calculation,
    layout,
    loading,
    error,
    copyLink,
    linkCopied,
  } = useConfig();

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tesla Energy Site Planner</h1>
        <div className={styles.headerActions}>
          <button className={styles.resetBtn} onClick={resetConfig}>
            Reset
          </button>
          <button className={styles.saveBtn} onClick={copyLink}>
            {linkCopied ? "Link copied!" : "Save & Copy Link"}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Calculating...</p>}

      <div className={styles.columns}>
        <ConfigPanel
          config={config}
          onQuantityChange={setQuantity}
        />
        <SummaryPanel calculation={calculation} layout={layout} />
      </div>

      <div className={styles.layoutSection}>
        <SiteLayout layout={layout} />
      </div>
    </main>
  );
}
