# Portfolio Documentation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator with TypeScript support and advanced component integration.

## 🚀 Quick Start

### Installation

```bash
# Navigate to docs directory
cd docs

# Install dependencies with pnpm (recommended)
pnpm install
```

### Local Development

```bash
# Start development server with hot reload
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Production Build

```bash
# Build for production
pnpm build:prod
```

This command generates static content into the `artifacts` directory and can be served using any static contents hosting service.

## 🔧 Development Workflow

### Code Quality

The project includes comprehensive code quality tooling:

```bash
# Run all quality checks (formatting, linting, type checking)
pnpm run check-all

# Individual checks
pnpm run format:check    # Check code formatting
pnpm run lint           # ESLint validation
pnpm run typecheck      # TypeScript compilation
```

### GitHub Configuration Validation

```bash
# Validate GitHub configuration system
tsx ./scripts/validate-github-config.ts
```

### Security Audit

```bash
# Check for dependency vulnerabilities
pnpm audit --audit-level moderate
```

## 🤖 Continuous Integration

The project uses GitHub Actions for automated validation:

- **CI Workflow**: Validates code quality, builds documentation, and runs security audits on PRs and feature branches
- **Release Workflow**: Deploys to GitHub Pages on main branch pushes
- **Caching**: Optimized with pnpm dependency caching for faster builds
- **Security**: Regular dependency vulnerability scanning

### CI Features

- ✅ TypeScript compilation validation
- ✅ Code formatting and linting checks  
- ✅ GitHub configuration system validation
- ✅ Docusaurus build validation
- ✅ Security vulnerability scanning
- ✅ Build artifact validation
- ✅ Performance optimization with caching

## 📦 Deployment

### Using SSH

```bash
USE_SSH=true pnpm deploy
```

### Not using SSH

```bash
GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## 🏗️ Project Structure

```text
docs/
├── src/                    # React components and pages
├── static/                 # Static assets
├── docs/                   # Documentation content
├── config/                 # YAML configuration files
├── scripts/                # Build and validation scripts
└── artifacts/              # Production build output
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm start` | Start development server |
| `pnpm build:prod` | Production build |
| `pnpm check-all` | Run all quality checks |
| `pnpm lint` | ESLint validation |
| `pnpm format:check` | Check code formatting |
| `pnpm typecheck` | TypeScript validation |
| `pnpm test` | Run tests with Vitest |
