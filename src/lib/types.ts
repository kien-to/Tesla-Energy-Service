export interface BatteryType {
  id: string;
  name: string;
  width: number; // feet
  depth: number; // feet
  energy: number; // MWh (negative for transformers)
  cost: number; // USD
  releaseYear: number | null;
  color: string; // hex color for layout visualization
}

export interface SiteConfig {
  [batteryId: string]: number; // quantity per battery type
}

export interface CalculationResult {
  totalCost: number;
  batteryCost: number;
  transformerCost: number;
  totalEnergy: number;
  numTransformers: number;
  totalBatteries: number;
}

export interface LayoutItem {
  id: string; // unique instance id, e.g. "megapackXL-0"
  type: string; // battery type id
  label: string; // display name
  x: number; // feet from left
  y: number; // feet from top
  width: number; // feet
  height: number; // feet
  color: string;
}

export interface LayoutResult {
  siteWidth: number; // bounding box width in feet
  siteHeight: number; // bounding box height in feet
  items: LayoutItem[];
}
