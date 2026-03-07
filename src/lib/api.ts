import { SiteConfig, CalculationResult, LayoutResult } from "./types";

export async function fetchCalculation(
  config: SiteConfig
): Promise<CalculationResult> {
  const res = await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Calculation failed");
  }

  return res.json();
}

export async function fetchLayout(config: SiteConfig): Promise<LayoutResult> {
  const res = await fetch("/api/layout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Layout generation failed");
  }

  return res.json();
}
