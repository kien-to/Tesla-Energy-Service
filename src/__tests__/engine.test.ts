import { packLayout } from "@/lib/engine";

describe("packLayout", () => {
  it("returns empty layout for zero config", () => {
    const result = packLayout({
      megapackXL: 0,
      megapack2: 0,
      megapack: 0,
      powerpack: 0,
    });
    expect(result.siteWidth).toBe(0);
    expect(result.siteHeight).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it("places a single battery with its transformer", () => {
    const result = packLayout({
      megapackXL: 1,
      megapack2: 0,
      megapack: 0,
      powerpack: 0,
    });
    // 1 battery + 1 transformer
    expect(result.items).toHaveLength(2);
    expect(result.items.find((i) => i.type === "megapackXL")).toBeDefined();
    expect(result.items.find((i) => i.type === "transformer")).toBeDefined();
  });

  it("never exceeds 100ft width", () => {
    const result = packLayout({
      megapackXL: 5,
      megapack2: 5,
      megapack: 5,
      powerpack: 10,
    });
    expect(result.siteWidth).toBeLessThanOrEqual(100);

    for (const item of result.items) {
      expect(item.x + item.width).toBeLessThanOrEqual(100);
    }
  });

  it("includes correct number of transformers", () => {
    const result = packLayout({
      megapackXL: 2,
      megapack2: 1,
      megapack: 0,
      powerpack: 3,
    });
    const transformers = result.items.filter((i) => i.type === "transformer");
    // 6 batteries -> ceil(6/2) = 3 transformers
    expect(transformers).toHaveLength(3);
  });

  it("fits 2 MegapackXLs in one row (80ft <= 100ft)", () => {
    const result = packLayout({
      megapackXL: 2,
      megapack2: 0,
      megapack: 0,
      powerpack: 0,
    });
    const xls = result.items.filter((i) => i.type === "megapackXL");
    // Both should be on the same row (y=0)
    expect(xls[0].y).toBe(0);
    expect(xls[1].y).toBe(0);
  });

  it("wraps 3 MegapackXLs to multiple rows (120ft > 100ft)", () => {
    const result = packLayout({
      megapackXL: 3,
      megapack2: 0,
      megapack: 0,
      powerpack: 0,
    });
    const xls = result.items.filter((i) => i.type === "megapackXL");
    // First two on row 0, third on row 1
    expect(xls[0].y).toBe(0);
    expect(xls[1].y).toBe(0);
    expect(xls[2].y).toBe(10);
  });

  it("has no overlapping items", () => {
    const result = packLayout({
      megapackXL: 3,
      megapack2: 4,
      megapack: 2,
      powerpack: 8,
    });

    for (let i = 0; i < result.items.length; i++) {
      for (let j = i + 1; j < result.items.length; j++) {
        const a = result.items[i];
        const b = result.items[j];
        const overlaps =
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
        expect(overlaps).toBe(false);
      }
    }
  });
});
