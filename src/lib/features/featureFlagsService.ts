import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from "./featureFlags";
import FeatureFlag from "../models/FeatureFlag";

export const featureFlagsService = {
  // Get all feature flags from database
  getFlags: async (): Promise<FeatureFlags> => {
    try {
      const dbFlags = await FeatureFlag.findAll();
      
      // Convert database flags to FeatureFlags object
      const flags: Partial<FeatureFlags> = {};
      dbFlags.forEach((flag) => {
        flags[flag.flag_key as keyof FeatureFlags] = flag.flag_value;
      });
      
      // Merge with defaults to ensure all flags exist
      return { ...DEFAULT_FEATURE_FLAGS, ...flags };
    } catch (error) {
      console.error("Error fetching feature flags from database:", error);
      return DEFAULT_FEATURE_FLAGS;
    }
  },

  // Get a specific feature flag
  getFlag: async (key: keyof FeatureFlags): Promise<boolean> => {
    try {
      const flag = await FeatureFlag.findOne({ where: { flag_key: key } });
      return flag?.flag_value ?? DEFAULT_FEATURE_FLAGS[key];
    } catch (error) {
      console.error(`Error fetching feature flag ${key}:`, error);
      return DEFAULT_FEATURE_FLAGS[key];
    }
  },

  // Validate if a feature is enabled
  isFeatureEnabled: async (feature: keyof FeatureFlags): Promise<boolean> => {
    return await featureFlagsService.getFlag(feature);
  },
};
