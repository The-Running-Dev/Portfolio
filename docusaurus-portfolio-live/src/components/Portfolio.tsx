import React, { useEffect, useState } from 'react';

type Link = { label: string; href: string };
type Badge = { alt: string; src: string };
type Bullet = string;

type Role = {
  icon?: string;
  company: string;
  title: string;
  location?: string;
  period: string;
  website?: string;
  summary?: string;
  achievements?: Bullet[];
  tech?: string;
};

type Education = {
  school: string;
  degree: string;
  details?: string;
};

type Project = {
  name: string;
  url: string;
  description?: string;
  stars?: number;
  language?: string;
  updatedAt?: string;
};

type CVData = {
  header: {
    title: string;
    email?: string;
    phone?: string;
    links?: Link[];
  };
  about: {
    title: string;
    body: string;
  };
  badges?: Badge[];
  chips?: string[];
  timelineTitle: string;
  roles: Role[];
  educationTitle?: string;
  education?: Education[];
  quote?: string;
};

export default function Portfolio({
  data,
  projects: projectsProp,
  projectsUrl
}: {
  data: CVData;
  /** Optional pre-fetched projects (preferred when using a build-time script) */
  projects?: Project[];
  /** Optional client-side URL to fetch projects JSON at runtime */
  projectsUrl?: string;
}) {
  const { header, about, badges, chips, timelineTitle, roles, educationTitle, education, quote } = data;
  const [projects, setProjects] = useState<Project[] | undefined>(projectsProp);

  useEffect(() => {
    if (!projectsProp && projectsUrl) {
      (async () => {
        try {
          const res = await fetch(projectsUrl);
          if (res.ok) {
            const json = await res.json();
            setProjects(json);
          }
        } catch (e) {
          // ignore
        }
      })();
    }
  }, [projectsProp, projectsUrl]);

  return (
    <div className="cv-wrap">
      {/* Header */}
      <header className="cv-header">
        <h1>{header.title}</h1>

        <div className="cv-row cv-muted">
          {header.email && (
            <>
              📧 <a href={`mailto:${header.email}`}>{header.email}</a>
            </>
          )}
          {header.phone && (
            <>
              <span aria-hidden> · </span> 📱 {header.phone}
            </>
          )}
        </div>

        {header.links?.length ? (
          <div className="cv-links">
            {header.links.map((l, i) => (
              <a key={i} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>
        ) : null}
      </header>

      {/* About */}
      <section className="cv-section">
        <h2>{about.title}</h2>
        <p dangerouslySetInnerHTML={{ __html: about.body }} />
      </section>

      {/* Badges / Chips */}
      {(badges?.length || chips?.length) ? (
        <section className="cv-section">
          <h2>🛠️ Tech Stack at a Glance</h2>

          {badges?.length ? (
            <div className="cv-badges" aria-label="Technology badges">
              {badges.map((b, i) => (
                <img key={i} src={b.src} alt={b.alt} loading="lazy" />
              ))}
            </div>
          ) : null}

          {chips?.length ? (
            <div className="cv-row" style={{ marginTop: badges?.length ? '0.5rem' : 0 }}>
              {chips.map((c, i) => (
                <span className="cv-chip" key={i}>{c}</span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Timeline */}
      <section className="cv-section">
        <h2>{timelineTitle}</h2>

        <div className="cv-grid">
          {roles.map((r, i) => (
            <article className="career-card" key={`${r.company}-${r.title}-${i}`}>
              <h3>
                {r.icon ? <span style={{ fontSize: '1.1em' }}>{r.icon}</span> : null}
                <span>{r.company} — {r.title}</span>
              </h3>

              <div className="role-range cv-muted">
                {r.period}
                {r.location ? <> · {r.location}</> : null}
                {r.website ? <> · <a href={r.website} target="_blank" rel="noreferrer">Company Site</a></> : null}
              </div>

              {r.summary ? <p dangerouslySetInnerHTML={{ __html: r.summary }} /> : null}

              {r.achievements?.length ? (
                <ul>
                  {r.achievements.map((a, j) => <li key={j} dangerouslySetInnerHTML={{ __html: a }} />)}
                </ul>
              ) : null}

              {r.tech ? (
                <p className="tech"><strong>Tech:</strong> {r.tech}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* Projects (optional) */}
      {projects?.length ? (
        <section className="cv-section">
          <h2>🧩 Recent Projects</h2>
          <div className="cv-grid">
            {projects.map((p, i) => (
              <article className="career-card" key={i}>
                <h3><a href={p.url} target="_blank" rel="noreferrer">{p.name}</a></h3>
                {p.description ? <p>{p.description}</p> : null}
                <p className="cv-muted">
                  {p.language ? <>Language: {p.language}</> : null}
                  {(p.language && (p.stars || p.updatedAt)) ? ' · ' : ''}
                  {typeof p.stars === 'number' ? <>⭐ {p.stars}</> : null}
                  {(typeof p.stars === 'number' && p.updatedAt) ? ' · ' : ''}
                  {p.updatedAt ? <>Updated: {new Date(p.updatedAt).toLocaleDateString()}</> : null}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Education */}
      {education?.length ? (
        <section className="cv-section">
          <h2>{educationTitle ?? '🎓 Education & Growth'}</h2>
          <ul>
            {education.map((e, i) => (
              <li key={i}>
                <strong>{e.degree}</strong> — {e.school}
                {e.details ? <> — <span className="cv-muted">{e.details}</span></> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Quote */}
      {quote ? (
        <section className="cv-section">
          <div className="cv-quote" dangerouslySetInnerHTML={{ __html: quote }} />
        </section>
      ) : null}
    </div>
  );
}
