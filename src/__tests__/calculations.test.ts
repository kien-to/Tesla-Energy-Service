import {
  computeTransformerCount,
  computeTotals,
  validateConfig,
} from "@/lib/calculations";

describe("computeTransformerCount", () => {
  it("returns 0 for 0 batteries", () => {
    expect(computeTransformerCount(0)).toBe(0);
  });

  it("returns 1 for 1 battery", () => {
    expect(computeTransformerCount(1)).toBe(1);
  });

  it("returns 1 for 2 batteries", () => {
    expect(computeTransformerCount(2)).toBe(1);
  });

  it("returns 2 for 3 batteries", () => {
    expect(computeTransformerCount(3)).toBe(2);
  });

  it("returns 5 for 10 batteries", () => {
    expect(computeTransformerCount(10)).toBe(5);
  });
});

describe("computeTotals", () => {
  it("returns zeros for empty config", () => {
    const result = computeTotals({
      megapackXL: 0,
      megapack2: 0,
      megapack: 0,
      powerpack: 0,
    });
    expect(result.totalCost).toBe(0);
    expect(result.totalEnergy).toBe(0);
    expect(result.totalBatteries).toBe(0);
    expect(result.numTransformers).toBe(0);
  });

  it("calculates correctly for a single MegapackXL", () => {
    const result = computeTotals({
      megapackXL: 1,
      megapack2: 0,
      megapack: 0,
      powerpack: 0,
    });
    expect(result.totalBatteries).toBe(1);
    expect(result.numTransformers).toBe(1);
    // 120000 (battery) + 10000 (transformer)
    expect(result.totalCost).toBe(130000);
    // 4 MWh - 0.5 MWh (transformer)
    expect(result.totalEnergy).toBe(3.5);
  });

  it("calculates correctly for a mixed config", () => {
    const result = computeTotals({
      megapackXL: 2,
      megapack2: 1,
      megapack: 0,
      powerpack: 3,
    });
    expect(result.totalBatteries).toBe(6);
    expect(result.numTransformers).toBe(3);
    // (2*120000) + (1*80000) + (3*10000) + (3*10000 transformers)
    expect(result.totalCost).toBe(380000);
    // (2*4) + (1*3) + (3*1) + (3*-0.5)
    expect(result.totalEnergy).toBe(12.5);
  });
});

describe("validateConfig", () => {
  it("accepts valid config", () => {
    const result = validateConfig({ megapackXL: 2, powerpack: 1 });
    expect(result.valid).toBe(true);
  });

  it("rejects non-object input", () => {
    const result = validateConfig("invalid");
    expect(result.valid).toBe(false);
  });

  it("rejects negative values", () => {
    const result = validateConfig({ megapackXL: -1 });
    expect(result.valid).toBe(false);
  });

  it("rejects values over 500", () => {
    const result = validateConfig({ megapackXL: 501 });
    expect(result.valid).toBe(false);
  });

  it("rejects unknown battery types", () => {
    const result = validateConfig({ unknownBattery: 1 });
    expect(result.valid).toBe(false);
  });

  it("rejects non-integer values", () => {
    const result = validateConfig({ megapackXL: 1.5 });
    expect(result.valid).toBe(false);
  });

  it("fills missing battery types with 0", () => {
    const result = validateConfig({ megapackXL: 2 });
    if (result.valid) {
      expect(result.config.megapack2).toBe(0);
      expect(result.config.megapack).toBe(0);
      expect(result.config.powerpack).toBe(0);
    }
  });
});
