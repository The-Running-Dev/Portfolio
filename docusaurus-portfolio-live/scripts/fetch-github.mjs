#!/usr/bin/env node
/**
 * scripts/fetch-github.mjs
 * Fetches recent repos for a GitHub user and writes src/data/generated/github.json
 *
 * Usage:
 *   GITHUB_USER=The-Running-Dev GITHUB_TOKEN=ghp_xxx node scripts/fetch-github.mjs
 *   # token optional (higher rate limits if set)
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const user = process.env.GITHUB_USER || 'The-Running-Dev';
const token = process.env.GITHUB_TOKEN || '';

const headers = { 'User-Agent': 'docusaurus-portfolio-fetcher' };
if (token) headers['Authorization'] = `Bearer ${token}`;

async function main() {
  const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  const repos = await res.json();

  // pick top N recently pushed, excluding forks/archived
  const filtered = repos
    .filter(r => !r.fork && !r.archived)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 8)
    .map(r => ({
      name: r.name,
      url: r.html_url,
      description: r.description || '',
      stars: r.stargazers_count,
      language: r.language,
      updatedAt: r.pushed_at
    }));

  const outDir = path.resolve('src/data/generated');
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'github.json');
  await fs.writeFile(outFile, JSON.stringify(filtered, null, 2), 'utf-8');
  console.log(`Wrote ${outFile} with ${filtered.length} repos.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
