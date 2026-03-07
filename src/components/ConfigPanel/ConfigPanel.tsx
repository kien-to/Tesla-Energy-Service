"use client";

import { SiteConfig, CalculationResult } from "@/lib/types";
import { BATTERY_CATALOG, TRANSFORMER } from "@/lib/batteries";
import BatteryCard from "@/components/BatteryCard/BatteryCard";
import styles from "./ConfigPanel.module.scss";

interface ConfigPanelProps {
  config: SiteConfig;
  onQuantityChange: (batteryId: string, qty: number) => void;
  calculation: CalculationResult | null;
}

export default function ConfigPanel({
  config,
  onQuantityChange,
  calculation,
}: ConfigPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Battery Configuration</h2>
      <div className={styles.grid}>
        {BATTERY_CATALOG.map((battery) => (
          <BatteryCard
            key={battery.id}
            battery={battery}
            quantity={config[battery.id] ?? 0}
            onQuantityChange={(qty) => onQuantityChange(battery.id, qty)}
          />
        ))}
        <BatteryCard
          battery={TRANSFORMER}
          quantity={calculation?.numTransformers ?? 0}
          onQuantityChange={() => {}}
          readOnly
        />
      </div>
    </section>
  );
}
