"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SiteConfig, CalculationResult, LayoutResult } from "@/lib/types";
import { BATTERY_CATALOG, DEFAULT_CONFIG } from "@/lib/batteries";
import { fetchCalculation, fetchLayout } from "@/lib/api";

const STORAGE_KEY = "tesla_site_config";
const URL_PARAM = "c";
const BATTERY_IDS = BATTERY_CATALOG.map((b) => b.id);

function encodeConfig(config: SiteConfig): string {
  return BATTERY_IDS.map((id) => config[id] ?? 0).join("-");
}

function decodeConfig(encoded: string): SiteConfig | null {
  const parts = encoded.split("-");
  if (parts.length !== BATTERY_IDS.length) return null;

  const config: SiteConfig = {};
  for (let i = 0; i < BATTERY_IDS.length; i++) {
    const num = parseInt(parts[i], 10);
    if (isNaN(num) || num < 0 || num > 500) return null;
    config[BATTERY_IDS[i]] = num;
  }
  return config;
}

function loadInitialConfig(): SiteConfig {
  if (typeof window === "undefined") return { ...DEFAULT_CONFIG };

  const params = new URLSearchParams(window.location.search);
  const urlConfig = params.get(URL_PARAM);
  if (urlConfig) {
    const decoded = decodeConfig(urlConfig);
    if (decoded) return decoded;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    }
  } catch {}

  return { ...DEFAULT_CONFIG };
}

export interface UseConfigReturn {
  config: SiteConfig;
  setQuantity: (batteryId: string, qty: number) => void;
  resetConfig: () => void;
  calculation: CalculationResult | null;
  layout: LayoutResult | null;
  loading: boolean;
  error: string | null;
  copyLink: () => void;
  linkCopied: boolean;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<SiteConfig>({ ...DEFAULT_CONFIG });
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [layout, setLayout] = useState<LayoutResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialized = useRef(false);

  // Load saved config after mount to avoid hydration mismatch
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const saved = loadInitialConfig();
      const hasValues = Object.values(saved).some((v) => v > 0);
      if (hasValues) {
        setConfig(saved);
      }
    }
  }, []);

  const setQuantity = useCallback((batteryId: string, qty: number) => {
    const clamped = Math.max(0, Math.min(500, Math.floor(qty)));
    setConfig((prev) => ({ ...prev, [batteryId]: clamped }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG });
  }, []);

  // Auto-sync config to URL and localStorage
  useEffect(() => {
    const encoded = encodeConfig(config);
    const url = new URL(window.location.href);
    url.searchParams.set(URL_PARAM, encoded);
    window.history.replaceState({}, "", url.toString());

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  // Debounced API calls
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

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
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [config]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, []);

  return {
    config,
    setQuantity,
    resetConfig,
    calculation,
    layout,
    loading,
    error,
    copyLink,
    linkCopied,
  };
}
