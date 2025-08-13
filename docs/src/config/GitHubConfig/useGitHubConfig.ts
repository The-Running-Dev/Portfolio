import { useMemo } from "react";

import { getData } from "../../data/dataLoader";
import type { GitHubConfig } from "./models";
import { GitHub as configData } from '../../../data';

// GitHub configuration hook
export function useGitHubConfig(): GitHubConfig {
  return useMemo(() => {
    try {
      const config = getData<GitHubConfig>(configData);

      // Validate required fields
      if (!config.repo || !config.organization || !config.project) {
        throw new Error("Missing Required GitHub Configuration Fields");
      }

      // Ensure immutability
      return Object.freeze({
        ...config,
        urls: Object.freeze(config.urls),
        metadata: Object.freeze({
          ...config.metadata,
          topics: Object.freeze(config.metadata.topics),
        }),
        features: config.features ? Object.freeze(config.features) : undefined,
        integrations: config.integrations
          ? Object.freeze(config.integrations)
          : undefined,
      });
    } catch (error) {
      console.error("Failed to Load GitHub Configuration:", error);

      throw new Error("GitHub Configuration Failed to Load");
    }
  }, []);
}