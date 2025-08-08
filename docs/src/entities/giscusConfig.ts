export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  reactionsEnabled: boolean;
  emitMetadata: boolean;
  inputPosition: string;
  lang: string;
  loading: string;
  theme: {
    light: string;
    dark: string;
  };
}