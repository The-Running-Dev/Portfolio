// documentation/src/components/Badges/index.tsx - Badges component
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { featuresConfig } from "../../data";
import { Badge, BadgeCategory, BadgesProps } from "./models";
import useConfig from "./useConfig";

const Badges: React.FC<BadgesProps> = () => {
  // Use custom hook to load badge configuration
  const { badgeCategories, loading } = useConfig({});

  // Don't render if disabled or no badges
  if (
    !featuresConfig.enableBadges ||
    !badgeCategories ||
    badgeCategories.length === 0
  ) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ padding: "1rem 0", textAlign: "center" }}>
        <p>Loading Badges...</p>
      </div>
    );
  }

  const Category: React.FC<BadgeCategory> = ({ title, badges, icon }) => (
    <div style={{ marginBottom: "2rem" }}>
      <h3
        style={{
          fontSize: "1.2rem",
          marginBottom: "1rem",
          color: "var(--ifm-color-primary)",
          borderBottom: "2px solid var(--ifm-color-primary-light)",
          paddingBottom: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{ color: "var(--ifm-color-primary)" }}
        />
        {title}
      </h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        {badges.map((badge: Badge, index: number) => (
          <a
            key={index}
            href={badge.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <img
              src={badge.url}
              alt={badge.name}
              style={{
                height: "20px",
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e: React.MouseEvent<HTMLImageElement>) => {
                (e.target as HTMLImageElement).style.transform = "scale(1.05)";
              }}
              onMouseOut={(e: React.MouseEvent<HTMLImageElement>) => {
                (e.target as HTMLImageElement).style.transform = "scale(1)";
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0.2rem 0' }}>
      {badgeCategories.map((category) => (
        <Category
          key={category.key}
          title={category.title}
          badges={category.badges}
          icon={category.icon}
        />
      ))}
    </div>
  );
};

export default Badges;
