import { useMemo } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCogs,
  faBoxOpen,
  faBook,
  faShieldAlt,
  faUsers,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { badgesConfig } from '../../data';
import { UseBadgeConfigProps, UseBadgeConfigResult } from './models';

export default function useConfig({
  user,
  repository,
  groups
}: UseBadgeConfigProps = {}): UseBadgeConfigResult {
  const iconMap: Record<string, IconDefinition> = {
    faCogs,
    faBoxOpen,
    faBook,
    faShieldAlt,
    faUsers,
    faChartLine
  };

  // Compute badge sections based on config and props
  const badgeCategories = useMemo(() => {
    const replacements: Record<string, string> = {
      ...badgesConfig.templateVariables,
      user: user || badgesConfig.templateVariables.user,
      repository: repository || badgesConfig.templateVariables.repository
    };

    return badgesConfig.badgeCategories
      .filter((category) => !groups || groups.includes(category.key))
      .map((category) => ({
        key: category.key,
        title: category.title,
        icon: iconMap[category.icon] || faCogs,
        badges: category.badges.map((badge) => ({
          name: badge.name,
          url: badge.url.replace(/\{(\w+)\}/g, (_, k) => replacements[k] || ''),
          link: badge.link.replace(
            /\{(\w+)\}/g,
            (_, k) => replacements[k] || ''
          )
        }))
      }));
  }, [user, repository, groups]);

  return { badgeCategories, loading: false };
}
