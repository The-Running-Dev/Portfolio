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

## Configuration

All API-related hooks are available by default. To use them, simply pass `enabled: true` in the hook configuration.

## Example Component

See `src/components/Examples/ApiProjectsExample.tsx` for a complete working example of how to use the API hooks.
