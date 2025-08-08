
# Live GitHub integration for Docusaurus Portfolio

This adds an optional **Projects** section populated from the GitHub API.

## Two ways to load data

### 1) Build-time (recommended)
- Uses a Node script to fetch your repos and write `src/data/generated/github.json`.
- Avoids exposing a token in the browser and keeps the page static.

**Setup**

1. Save a classic token or fine-grained PAT in `GITHUB_TOKEN` (scopes: public_repo).  
2. Add npm script:
   ```json
   {
     "scripts": {
       "prebuild": "node ./scripts/fetch-github.mjs"
     }
   }
   ```
3. Optional: set user (defaults to `The-Running-Dev`):
   ```bash
   GITHUB_USER=The-Running-Dev GITHUB_TOKEN=ghp_*** npm run build
   ```
4. The script writes `src/data/generated/github.json`.
5. `docs/portfolio-live.mdx` imports that file and passes it to the component.

### 2) Runtime (client-side fetch)
- No token required (limited rate).  
- Pass a `projectsUrl` to `<Portfolio />` pointing to a JSON endpoint returning the shape:
  ```json
  [
    { "name": "...", "url": "https://...", "description": "...", "stars": 0, "language": "C#", "updatedAt": "2025-01-01T00:00:00Z" }
  ]
  ```

## Files
- `src/components/Portfolio.tsx` — updated to accept `projects` or `projectsUrl`.
- `src/css/portfolio.css` — styles (merge or import).
- `scripts/fetch-github.mjs` — build-time fetcher.
- `src/data/generated/github.json` — output (generated).
- `docs/portfolio-live.mdx` — example page that prefers build-time data and falls back to runtime.

## Security notes
- **Do not** commit your GitHub token. Provide it via env var (CI secrets).
- Build-time approach is safer and more reliable.
