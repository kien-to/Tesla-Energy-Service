import { SiteConfig, LayoutItem, LayoutResult } from "./types";
import { BATTERY_CATALOG, TRANSFORMER, SITE_MAX_WIDTH } from "./batteries";
import { computeTransformerCount } from "./calculations";

interface PlacementEntry {
  typeId: string;
  label: string;
  width: number;
  height: number;
  color: string;
}

/**
 * Expand the user config into a flat list of individual devices to place,
 * sorted by width descending for first-fit-decreasing packing.
 */
function buildItemList(config: SiteConfig): PlacementEntry[] {
  const items: PlacementEntry[] = [];

  for (const battery of BATTERY_CATALOG) {
    const qty = config[battery.id] ?? 0;
    for (let i = 0; i < qty; i++) {
      items.push({
        typeId: battery.id,
        label: battery.name,
        width: battery.width,
        height: battery.depth,
        color: battery.color,
      });
    }
  }

  const totalBatteries = items.length;
  const numTransformers = computeTransformerCount(totalBatteries);

  for (let i = 0; i < numTransformers; i++) {
    items.push({
      typeId: TRANSFORMER.id,
      label: TRANSFORMER.name,
      width: TRANSFORMER.width,
      height: TRANSFORMER.depth,
      color: TRANSFORMER.color,
    });
  }

  items.sort((a, b) => b.width - a.width);

  return items;
}

interface Row {
  y: number;
  usedWidth: number;
  height: number;
}

/**
 * Row-based first-fit-decreasing bin packing.
 * Places items left-to-right into rows, each capped at SITE_MAX_WIDTH (100ft).
 * All devices are 10ft deep so rows are uniform height.
 */
export function packLayout(config: SiteConfig): LayoutResult {
  const entries = buildItemList(config);

  if (entries.length === 0) {
    return { siteWidth: 0, siteHeight: 0, items: [] };
  }

  const rows: Row[] = [];
  const placed: LayoutItem[] = [];
  const instanceCount: Record<string, number> = {};

  for (const entry of entries) {
    let placedInRow = false;

    for (const row of rows) {
      if (row.usedWidth + entry.width <= SITE_MAX_WIDTH) {
        const idx = (instanceCount[entry.typeId] ?? 0);
        instanceCount[entry.typeId] = idx + 1;

        placed.push({
          id: `${entry.typeId}-${idx}`,
          type: entry.typeId,
          label: entry.label,
          x: row.usedWidth,
          y: row.y,
          width: entry.width,
          height: entry.height,
          color: entry.color,
        });

        row.usedWidth += entry.width;
        placedInRow = true;
        break;
      }
    }

    if (!placedInRow) {
      const newY = rows.length > 0
        ? rows[rows.length - 1].y + rows[rows.length - 1].height
        : 0;

      const row: Row = { y: newY, usedWidth: 0, height: entry.height };
      rows.push(row);

      const idx = (instanceCount[entry.typeId] ?? 0);
      instanceCount[entry.typeId] = idx + 1;

      placed.push({
        id: `${entry.typeId}-${idx}`,
        type: entry.typeId,
        label: entry.label,
        x: 0,
        y: row.y,
        width: entry.width,
        height: entry.height,
        color: entry.color,
      });

      row.usedWidth = entry.width;
    }
  }

  const siteWidth = Math.max(...rows.map((r) => r.usedWidth));
  const lastRow = rows[rows.length - 1];
  const siteHeight = lastRow.y + lastRow.height;

  return { siteWidth, siteHeight, items: placed };
}
