# Simplified Convention-Based Data Loading System

## Overview

The data loading system uses a simple convention-based approach to automatically load and type JSON data across the application. No more boilerplate registry code - just add JSON files and go!

## Architecture

### Core Files

- `src/data/dataLoader.ts` - Single file with all data loading logic
- `src/data/index.ts` - Public API exports for components

### How It Works
1. **Static Imports**: All JSON files are statically imported in `loader.ts`
2. **Registry System**: Each data source has a configuration entry in `registry.ts`
3. **Processing**: Optional processors transform raw JSON data
4. **Type Safety**: Full TypeScript support with proper return types

## Adding New Data Sources

### Step 1: Add JSON File
```bash
# Add your data file to the data directory
docs/data/myNewData.json
```

### Step 2: Create TypeScript Interface
```typescript
// In appropriate location (components/entities)
export interface MyNewData {
  // Define your data structure
}
```

### Step 3: Add Static Import
```typescript
// In src/data/loader.ts
import myNewDataRaw from '../../data/myNewData.json';

// Add to DATA_IMPORTS
const DATA_IMPORTS = {
  // ... existing imports
  myNewData: myNewDataRaw,
} as const;
```

### Step 4: Register Data Source
```typescript
// In src/data/registry.ts
import { MyNewData } from '../path/to/interface';

export const DATA_REGISTRY: DataRegistry = {
  // ... existing entries
  myNewData: {
    jsonPath: '', // Not used with static imports
    processor: (data): MyNewData => data, // Or custom processing
  },
};
```

### Step 5: Add Export
```typescript
// In src/data/index.ts
export const myNewData = getData('myNewData');
export type { MyNewData } from '../path/to/interface';
```

### Step 6: Use in Components
```typescript
// In any component
import { myNewData } from '../../data';
```

## Custom Data Processing

For data that needs transformation, provide a custom processor:

```typescript
// In registry.ts
themes: {
  jsonPath: '',
  processor: (data): { themes: Theme[]; defaultTheme: Theme } => {
    const themes: Theme[] = data.themes;
    const defaultTheme = themes.find(t => t.name === data.defaultTheme) || themes[0];
    return { themes, defaultTheme };
  },
}
```

## Current Data Sources

The system currently manages these data sources:

- **CV Data** (`cvData.json`) → Professional CV/resume information
- **Portfolio Data** (`portfolioData.json`) → Portfolio projects and statistics  
- **Themes** (`themes.json`) → Available UI themes with processing for default theme
- **Navbar Links** (`navbarLinks.json`) → Custom navigation links
- **Features Config** (`featuresConfig.json`) → Feature flags and configuration (accessed as `featuresConfig.enableCVPage` etc.)

## Benefits

✅ **Centralized**: All data loading logic in one place  
✅ **Type Safe**: Full TypeScript support with proper inference  
✅ **Extensible**: Easy to add new data sources  
✅ **Consistent**: Uniform API for all data access  
✅ **Processing**: Support for data transformation  
✅ **Performance**: Static imports work well with webpack bundling  
✅ **Simple**: Direct object access without complex class wrappers  

## Migration Notes

### Before (Individual Files)
```typescript
// cvData.ts
import data from '../data/cvData.json';
export const userCVData: CVData = data;

// portfolioData.ts  
import data from '../data/portfolioData.json';
export const portfolioData: PortfolioData = data;
```

### After (Centralized System)
```typescript
// All data accessed through single system
import { userCVData, portfolioData, themes, defaultTheme } from '../../data';
```

The old individual data files can be safely removed once all imports are updated.
