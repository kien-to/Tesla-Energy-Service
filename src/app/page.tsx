"use client";

import { useConfig } from "@/hooks/useConfig";
import ConfigPanel from "@/components/ConfigPanel/ConfigPanel";
import SummaryPanel from "@/components/SummaryPanel/SummaryPanel";

export default function Home() {
  const { config, setQuantity, calculation, layout, loading, error } =
    useConfig();

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 32 }}>
        Tesla Energy Site Planner
      </h1>

      {error && (
        <p style={{ color: "#e31937", marginBottom: 16 }}>{error}</p>
      )}

      {loading && (
        <p style={{ color: "#a0a0a0", marginBottom: 16 }}>Calculating...</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <ConfigPanel
          config={config}
          onQuantityChange={setQuantity}
          calculation={calculation}
        />
        <SummaryPanel calculation={calculation} layout={layout} />
      </div>
    </main>
  );
}
