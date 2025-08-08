import { BadgeCategory } from 'src/components/Badges';

export interface TemplateVariables {
  demoUrl: string;
  docsUrl: string;
  user: string;
  repository: string;
}

export class BadgeConfig {
  static templateVariables: TemplateVariables = null;

  static badgeCategories: BadgeCategory[] = [];
}