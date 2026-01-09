"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from "./featureFlags";

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  isLoading: boolean;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlags = async () => {
    try {
      const response = await fetch("/api/features/flags");
      if (response.ok) {
        const data = await response.json();
        setFlags({ ...DEFAULT_FEATURE_FLAGS, ...data });
      }
    } catch (error) {
      console.error("Failed to fetch feature flags:", error);
      // Fall back to defaults
      setFlags(DEFAULT_FEATURE_FLAGS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const refreshFlags = async () => {
    setIsLoading(true);
    await fetchFlags();
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, isLoading, refreshFlags }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider");
  }
  return context;
}

// Convenience hooks for specific features
export function useFeature(feature: keyof FeatureFlags): boolean {
  const { flags } = useFeatureFlags();
  return flags[feature];
}
