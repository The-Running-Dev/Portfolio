// Define interfaces for JSON data structures
export interface BadgeConfigData {
    templateVariables: {
        demoUrl: string;
        docsUrl: string;
        user: string;
        repository: string;
    };
    badgeCategories: Array<{
        key: string;
        title: string;
        icon: string;
        badges: Array<{
            name: string;
            url: string;
            link: string;
        }>;
    }>;
}

export interface GiscusConfigData {
    enabled: boolean;
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: string;
    strict: string;
    reactionsEnabled: string;
    emitMetadata: string;
    inputPosition: string;
    theme: string;
    lang: string;
    loading: string;
}

export interface GitHubLinksConfigData {
    dropdown: boolean;
    className: string;
    dropdownLabel: string;
    showIcons: string;
    links: Array<{
        href: string;
        label: string;
        position: string;
        ariaLabel: string;
    }>;
}

export interface VersionConfigData {
    version: string;
    href: string;
    prefix: string;
    badge: boolean;
    className: string;
    title: string;
}

export interface GitHubConfigData {
    repo: string;
    organization: string;
    project: string;
    urls: {
        repository: string;
        issues: string;
        discussions: string;
        docs: string;
        pages: string;
        packages: string;
        api: string;
        contributors: string;
    };
}