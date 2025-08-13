/**
 * Projects Module
 * 
 * A comprehensive project showcase component with filtering, searching, and categorization
 * 
 * Structure:
 * - components/: Reusable UI components (FilterButton, SearchBox, etc.)
 * - hooks/: Custom React hooks for state management
 * - utils/: Utility functions and calculations
 * - models.ts: Data models and interfaces
 * - useConfig.ts: Main configuration hook
 * - Projects.tsx: Main component orchestrating everything
 */

// Main component
export { default } from "./Projects";

// Models and configuration
export * from "./models";

// Hooks (for external use if needed)
export { useUrlFilter, useSearch, useScrollRefs } from "./hooks";

// Components (for external use if needed)
export { FilterButton, SearchBox, ProjectHeader, ProjectStats } from "./components";

// Utils (for external use if needed)
export { calculateCategoryResults, calculateTechnologyResults } from "./utils";