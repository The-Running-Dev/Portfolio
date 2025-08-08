/**
 * Version Configuration
 * Configure how version information is displayed in the navbar
 */
export class VersionConfig {
  /** Version string to display (if not provided, will use version from package.json) */
  static version?: string = undefined; // Uses package.json version if not set
  
  /** URL to link to when version is clicked (optional) */
  static href?: string = 'https://github.com/your-org/your-repo/releases';
  
  /** Prefix text before version (e.g., 'v', 'Version ') */
  static prefix?: string = 'v';
  
  /** Whether to show as a badge style */
  static badge?: boolean = true;
  
  /** Custom CSS class for styling */
  static className?: string = undefined;
  
  /** Tooltip text on hover */
  static title?: string = 'View release notes and changelog';
}
