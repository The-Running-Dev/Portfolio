export interface FeaturesConfig {
  /** Whether to show Giscus comments on pages */
  enableGiscusComments: boolean;

  /** Whether to show GitHub links in navbar */
  enableGitHubLinks: boolean;

  /** Whether to show GitHub project badges */
  enableBadges: boolean;

  /** Whether to show theme switcher in navbar */
  enableThemeSwitcher: boolean;

  /** Whether to show text size switcher in navbar */
  enableTextSizeSwitcher: boolean;

  /** Whether to show reader mode toggle in navbar */
  enableReaderMode: boolean;

  /** Whether to show version display in navbar */
  enableVersionDisplay: boolean;

  /** Whether to show CV page in navbar */
  enableCVPage: boolean;

  /** Whether to show Portfolio page in navbar */
  enablePortfolioPage: boolean;

  /** Whether to use Portfolio page as the index page instead of simple welcome page */
  usePortfolioPageAsIndex: boolean;
}