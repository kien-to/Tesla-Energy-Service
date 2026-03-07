import { BatteryType } from "./types";

export const BATTERY_CATALOG: BatteryType[] = [
  {
    id: "megapackXL",
    name: "Megapack XL",
    width: 40,
    depth: 10,
    energy: 4,
    cost: 120_000,
    releaseYear: 2022,
    color: "#3b82f6",
  },
  {
    id: "megapack2",
    name: "Megapack 2",
    width: 30,
    depth: 10,
    energy: 3,
    cost: 80_000,
    releaseYear: 2021,
    color: "#8b5cf6",
  },
  {
    id: "megapack",
    name: "Megapack",
    width: 30,
    depth: 10,
    energy: 2,
    cost: 50_000,
    releaseYear: 2005,
    color: "#06b6d4",
  },
  {
    id: "powerpack",
    name: "PowerPack",
    width: 10,
    depth: 10,
    energy: 1,
    cost: 10_000,
    releaseYear: 2000,
    color: "#22c55e",
  },
];

export const TRANSFORMER: BatteryType = {
  id: "transformer",
  name: "Transformer",
  width: 10,
  depth: 10,
  energy: -0.5,
  cost: 10_000,
  releaseYear: null,
  color: "#f59e0b",
};

export const SITE_MAX_WIDTH = 100; // feet

export const DEFAULT_CONFIG: Record<string, number> = Object.fromEntries(
  BATTERY_CATALOG.map((b) => [b.id, 0])
);

export function getBatteryById(id: string): BatteryType | undefined {
  if (id === "transformer") return TRANSFORMER;
  return BATTERY_CATALOG.find((b) => b.id === id);
}
