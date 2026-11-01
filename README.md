# Personal Website

React 19 + TypeScript + Vite 8 + Tailwind 4 single-page site, served by nginx in a Docker image. Observability goes through [Grafana Faro](https://grafana.com/oss/faro/). Gallery images come from a separate gallery-server container (see Docker).

## Requirements

- Node 24 (the same major as the Dockerfile and CI)
- npm
- Docker with Buildx (only to build the image locally)

## Local development

```sh
npm ci
npm run dev
```

| Script                 | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Vite dev server                               |
| `npm run build`        | `tsc -b` (app and node), `vite build`       |
| `npm run preview`      | Serve the production build locally            |
| `npm run lint`         | ESLint (`configs/eslint.config.js`)           |
| `npm run format`       | Prettier, write                               |
| `npm run format:check` | Prettier, check only                          |
| `npm run deps:clean`   | Remove unused dependencies with knip          |

### Environment variables

Vite reads them from the environment or from a `.env.local` file (git-ignored).

| Variable              | Purpose                                                          |
| --------------------- | ---------------------------------------------------------------- |
| `VITE_ENABLE_MOCKS`   | `true` enables the MSW mocks, dev server only                    |
| `VITE_FARO_ENABLED`   | `true` turns on Faro in the browser                              |
| `VITE_FARO_URL`       | Faro collector URL                                               |
| `FARO_API_KEY`        | Enables sourcemap upload to Faro at build time                   |
| `FARO_UPLOAD_ENDPOINT`, `FARO_APP_ID`, `FARO_STACK_ID` | Faro sourcemap upload target, used with `FARO_API_KEY` |

Without `FARO_API_KEY` the build skips sourcemaps and the upload.

## Docker

```sh
docker build -t personal-website \
  --build-arg VITE_FARO_ENABLED=false .
docker run --rm -p 8080:80 personal-website
```

To upload sourcemaps from a local build, add `--secret id=faro_api_key,env=FARO_API_KEY` and the `FARO_UPLOAD_ENDPOINT`, `FARO_APP_ID` and `FARO_STACK_ID` build args. Sourcemaps are deleted from the image after the upload.

nginx proxies `/media/` to a `gallery` container (the separate gallery-server repo) on the `hz_gallery` Docker network, so that path only works when the gallery stack runs next to the site.

## CI/CD

- **Frontend** (`.github/workflows/frontend.yml`): runs on pull requests and is reused by the deploy workflow. It runs `npm ci` and `npm run build` (type check and bundle).
- **CI/CD Pipeline** (`.github/workflows/deploy.yml`): runs on pushes to `dev` and `main`. It runs the frontend checks first, then builds the `linux/arm64` image and pushes it to Docker Hub as `<DOCKER_USERNAME>/personal-website:dev` (from `dev`) or `:prod` (from `main`).

### GitHub configuration

Set these under **Settings → Secrets and variables → Actions**.

| Type     | Name                   | Purpose                                    |
| -------- | ---------------------- | ------------------------------------------ |
| Secret   | `DOCKER_USERNAME`      | Docker Hub user, also the image namespace  |
| Secret   | `DOCKER_PASSWORD`      | Docker Hub password or access token        |
| Secret   | `FARO_API_KEY`         | Faro sourcemap upload key                  |
| Variable | `FARO_UPLOAD_ENDPOINT` | Faro sourcemap upload endpoint             |
| Variable | `FARO_APP_ID`          | Faro app ID                                |
| Variable | `FARO_STACK_ID`        | Faro stack ID                              |

`VITE_FARO_ENABLED` and `VITE_FARO_URL` are public (they end up in the bundle), so they are hardcoded in `deploy.yml`.
