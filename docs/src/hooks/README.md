# Custom Hooks

This directory contains custom React hooks for the portfolio application.

## Available Hooks

### useApi

A comprehensive hook for fetching data from API endpoints with built-in retry logic, error handling, and feature flag integration.

**Key Features:**

- **Disabled by default** for security
- Automatic retry with configurable attempts
- Loading and error state management
- Feature flag integration
- TypeScript support

**Basic Usage:**

```tsx
import { useApi } from '../hooks/useApi';

const { data, loading, error, enabled } = useApi({
  endpoint: '/api/projects',
  enabled: true // Must explicitly enable
});
```

**See:** [Documentation](../docs/hooks/useApi.md)

### useApiProjects

A specialized version of `useApi` pre-configured for project data fetching.

```tsx
import { useApiProjects } from '../hooks/useApi';

const { data, loading, error } = useApiProjects({
  enabled: true
});
```

## Configuration

All API-related hooks require the `apiDataFetching` feature flag to be enabled in `GlobalConfig.json`:

```json
{
  "features": {
    "apiDataFetching": true
  }
}
```

## Example Component

See `src/components/Examples/ApiProjectsExample.tsx` for a complete working example of how to use the API hooks.
