"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SiteConfig, CalculationResult, LayoutResult } from "@/lib/types";
import { DEFAULT_CONFIG } from "@/lib/batteries";
import { fetchCalculation, fetchLayout } from "@/lib/api";

export interface UseConfigReturn {
  config: SiteConfig;
  setQuantity: (batteryId: string, qty: number) => void;
  calculation: CalculationResult | null;
  layout: LayoutResult | null;
  loading: boolean;
  error: string | null;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<SiteConfig>({ ...DEFAULT_CONFIG });
  const [calculation, setCalculation] = useState<CalculationResult | null>(
    null
  );
  const [layout, setLayout] = useState<LayoutResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuantity = useCallback((batteryId: string, qty: number) => {
    const clamped = Math.max(0, Math.min(500, Math.floor(qty)));
    setConfig((prev) => ({ ...prev, [batteryId]: clamped }));
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      const hasBatteries = Object.values(config).some((v) => v > 0);

      if (!hasBatteries) {
        setCalculation(null);
        setLayout(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [calc, lay] = await Promise.all([
          fetchCalculation(config),
          fetchLayout(config),
        ]);
        setCalculation(calc);
        setLayout(lay);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [config]);

  return { config, setQuantity, calculation, layout, loading, error };
}
