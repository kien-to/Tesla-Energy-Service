import { SiteConfig, CalculationResult } from "./types";
import { BATTERY_CATALOG, TRANSFORMER } from "./batteries";

export function computeTransformerCount(totalBatteries: number): number {
  if (totalBatteries <= 0) return 0;
  return Math.ceil(totalBatteries / 2);
}

export function computeTotals(config: SiteConfig): CalculationResult {
  let totalBatteries = 0;
  let batteryCost = 0;
  let totalEnergy = 0;

  for (const battery of BATTERY_CATALOG) {
    const qty = config[battery.id] ?? 0;
    totalBatteries += qty;
    batteryCost += qty * battery.cost;
    totalEnergy += qty * battery.energy;
  }

  const numTransformers = computeTransformerCount(totalBatteries);
  const transformerCost = numTransformers * TRANSFORMER.cost;

  totalEnergy += numTransformers * TRANSFORMER.energy;

  return {
    totalCost: batteryCost + transformerCost,
    batteryCost,
    transformerCost,
    totalEnergy,
    numTransformers,
    totalBatteries,
  };
}

export function validateConfig(
  body: unknown
): { valid: true; config: SiteConfig } | { valid: false; error: string } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const config: SiteConfig = {};
  const record = body as Record<string, unknown>;
  const validIds = new Set(BATTERY_CATALOG.map((b) => b.id));

  for (const [key, value] of Object.entries(record)) {
    if (!validIds.has(key)) {
      return { valid: false, error: `Unknown battery type: ${key}` };
    }
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      return {
        valid: false,
        error: `${key} must be a non-negative integer`,
      };
    }
    if (value > 500) {
      return {
        valid: false,
        error: `${key} exceeds maximum quantity of 500`,
      };
    }
    config[key] = value;
  }

  for (const id of validIds) {
    if (!(id in config)) {
      config[id] = 0;
    }
  }

  return { valid: true, config };
}
