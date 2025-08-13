import { z } from 'zod';

export const ThemeSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  cssFile: z.string()
});

export const ThemesConfigSchema = z.object({
  defaultTheme: z.string().optional(),
  themes: z.array(ThemeSchema)
});

export const NavbarLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
  position: z.string().optional(),
  ariaLabel: z.string().optional()
});

export const NavbarLinksSchema = z.object({
  links: z.array(NavbarLinkSchema)
});

export const BadgeSchema = z.object({
  name: z.string(),
  url: z.string(),
  link: z.string()
});

export const BadgeCategorySchema = z.object({
  key: z.string(),
  title: z.string(),
  icon: z.string(),
  badges: z.array(BadgeSchema)
});

export const BadgeConfigSchema = z.object({
  templateVariables: z.record(z.string(), z.string()),
  badgeCategories: z.array(BadgeCategorySchema)
});

export const GitHubUrlsSchema = z.object({
  repository: z.string().url(),
  issues: z.string().url(),
  discussions: z.string().url(),
  docs: z.string().url(),
  pages: z.string().url(),
  packages: z.string().url(),
  api: z.string().url(),
  contributors: z.string().url(),
  releases: z.string().url(),
  pulls: z.string().url(),
  actions: z.string().url(),
  readme: z.string().url(),
  avatar: z.string().url()
});

export const GitHubMetadataSchema = z.object({
  defaultBranch: z.string(),
  license: z.string(),
  topics: z.array(z.string()),
  description: z.string()
});

export const GitHubFeaturesSchema = z.object({
  enableIssueLinks: z.boolean().optional().default(true),
  enableContributorLinks: z.boolean().optional().default(true),
  enableReleaseNotes: z.boolean().optional().default(true),
  showBranchInfo: z.boolean().optional().default(false)
});

export const GitHubIntegrationsSchema = z.object({
  githubActions: z.object({
    enabled: z.boolean().optional().default(true),
    workflows: z.array(z.string()).optional().default([])
  }).optional(),
  packages: z.object({
    enabled: z.boolean().optional().default(true),
    registries: z.array(z.string()).optional().default([])
  }).optional()
});

export const GitHubConfigSchema = z.object({
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'Must be in owner/repo format'),
  organization: z.string(),
  project: z.string(),
  urls: GitHubUrlsSchema,
  metadata: GitHubMetadataSchema,
  features: GitHubFeaturesSchema.optional(),
  integrations: GitHubIntegrationsSchema.optional()
});

// Schema registry
const schemaRegistry: Record<string, z.ZodSchema> = {
  themes: ThemesConfigSchema,
  navbarLinks: NavbarLinksSchema,
  badgeConfig: BadgeConfigSchema,
  github: GitHubConfigSchema
};

// Function to validate data with appropriate schema
export function validateData<T = any>(key: string, data: any): T {
  const schema = schemaRegistry[key];
  
  if (!schema) {
    // If no schema is registered, return data as-is
    console.warn(`No Schema Found for Key: ${key}`);
    return data as T;
  }
  
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation Failed for Key "${key}": ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}

// Function to register a schema
export function registerSchema(key: string, schema: z.ZodSchema): void {
  schemaRegistry[key] = schema;
}