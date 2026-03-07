"use client";

import { BatteryType } from "@/lib/types";
import styles from "./BatteryCard.module.scss";

interface BatteryCardProps {
  battery: BatteryType;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  readOnly?: boolean;
}

export default function BatteryCard({
  battery,
  quantity,
  onQuantityChange,
  readOnly = false,
}: BatteryCardProps) {
  return (
    <div className={styles.card}>
      <div
        className={styles.colorStripe}
        style={{ backgroundColor: battery.color }}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{battery.name}</h3>
          {battery.releaseYear && (
            <span className={styles.year}>{battery.releaseYear}</span>
          )}
        </div>
        <div className={styles.specs}>
          <span>
            {battery.width}ft x {battery.depth}ft
          </span>
          <span>{battery.energy > 0 ? "+" : ""}{battery.energy} MWh</span>
          <span>${battery.cost.toLocaleString()}</span>
        </div>
        <div className={styles.controls}>
          {readOnly ? (
            <span className={styles.readOnlyQty}>{quantity} (auto)</span>
          ) : (
            <>
              <button
                className={styles.btn}
                onClick={() => onQuantityChange(quantity - 1)}
                disabled={quantity <= 0}
                aria-label={`Decrease ${battery.name}`}
              >
                -
              </button>
              <input
                className={styles.qtyInput}
                type="number"
                min={0}
                max={500}
                value={quantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
                aria-label={`${battery.name} quantity`}
              />
              <button
                className={styles.btn}
                onClick={() => onQuantityChange(quantity + 1)}
                disabled={quantity >= 500}
                aria-label={`Increase ${battery.name}`}
              >
                +
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
