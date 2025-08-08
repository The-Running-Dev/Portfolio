import { GitHubLink } from '../components/GitHubLinks/models';

export class GitHubLinksConfig {
  /** Whether to show as dropdown menu */
  static dropdown?: boolean = false;

  /** Custom CSS class for the container */
  static className?: string = undefined;

  /** Dropdown label (only used if dropdown is true) */
  static dropdownLabel?: string = 'GitHub';

  /** Whether to show icons alongside labels */
  static showIcons?: boolean = true;

  static links: GitHubLink[] = [];
}
