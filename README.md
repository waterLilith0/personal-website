# Personal Website

React 19 + TypeScript + Vite 8 + Tailwind 4 single-page site, served by nginx in a Docker image. Observability goes through [Grafana Faro](https://grafana.com/oss/faro/). Gallery images come from a separate gallery-server container (see Docker).

## Requirements

- Node 26 LTS (the same major as the Dockerfile and CI)
- npm
- Docker with Buildx (only to build the image locally)

## Local development

```sh
npm ci
npm run dev
```

| Script                 | What it does                          |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Vite dev server                       |
| `npm run build`        | `tsc -b` (app and node), `vite build` |
| `npm run preview`      | Serve the production build locally    |
| `npm run lint`         | ESLint (`configs/eslint.config.js`)   |
| `npm run format`       | Prettier, write                       |
| `npm run format:check` | Prettier, check only                  |
| `npm run deps:clean`   | Remove unused dependencies with knip  |

### Environment variables

Vite reads them from the environment or from a `.env.local` file (git-ignored).

| Variable                                               | Purpose                                                |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `VITE_ENABLE_MOCKS`                                    | `true` enables the MSW mocks, dev server only          |
| `VITE_FARO_ENABLED`                                    | `true` turns on Faro in the browser                    |
| `VITE_FARO_URL`                                        | Faro collector URL                                     |
| `VITE_APP_ENV`                                         | Faro `environment` label, defaults to the Vite mode    |
| `VITE_DASHBOARD_URL`                                   | Optional dashboard URL used by site links              |
| `FARO_API_KEY`                                         | Enables sourcemap upload to Faro at build time         |
| `FARO_UPLOAD_ENDPOINT`, `FARO_APP_ID`, `FARO_STACK_ID` | Faro sourcemap upload target, used with `FARO_API_KEY` |

Without `FARO_API_KEY` the build skips sourcemaps and the upload.

## Docker

```sh
docker build -t personal-website \
  --build-arg VITE_FARO_ENABLED=false .
docker run --rm -p 8080:80 personal-website
```

To upload sourcemaps from a local build, add `--secret id=faro_api_key,env=FARO_API_KEY` and the `FARO_UPLOAD_ENDPOINT`, `FARO_APP_ID` and `FARO_STACK_ID` build args. In Docker builds, sourcemap files are removed from the build output before it is copied into the runtime image.

nginx proxies `/media/` to a `gallery` container (the separate gallery-server repo) on the `hz_gallery` Docker network, so that path only works when the gallery stack runs next to the site.

### Running with the gallery server

The gallery is a separate, private service. Follow the [gallery-server README](https://github.com/waterLilith0/gallery-server) to configure its image directory and deploy its Compose stack. That stack joins the external `hz_gallery` network and gives its web service the `gallery` network alias expected by this site's nginx configuration.

For a staging website deployment, use a Compose file like this:

```yaml
name: personal-website-staging

services:
  web:
    image: waterlilith0/personal-website:${IMAGE_TAG:-staging}
    container_name: personal-website-staging
    restart: unless-stopped
    labels:
      - com.centurylinklabs.watchtower.enable=${WATCHTOWER_ENABLE:-false}
    networks:
      - hz_web_staging
      - hz_gallery

networks:
  hz_web_staging:
    external: true
  hz_gallery:
    external: true
```

Deploy the gallery stack first, then the website. Both external networks must already exist: the gallery-server setup documents creating `hz_gallery`; create or manage `hz_web_staging` for your web ingress. This website Compose service does not publish a host port; access it through a proxy or ingress attached to `hz_web_staging`. `IMAGE_TAG` defaults to `staging`, and `WATCHTOWER_ENABLE` defaults to `false`.

## CI/CD

Branch flow: `dev` → PR → `staging` → PR → `main`.

- **Frontend** (`.github/workflows/frontend.yml`): runs on pull requests, on pushes to `dev`, and is reused by the deploy workflow. It runs the build, lint and Prettier checks. `dev` never builds an image.
- **CI/CD Pipeline** (`.github/workflows/deploy.yml`): runs on pushes to `staging` and `main`. It runs the frontend checks first, then builds the `linux/arm64` image and pushes it to Docker Hub as `<DOCKER_USERNAME>/personal-website:staging` (from `staging`, GitHub environment `staging`) or `:prod` (from `main`, GitHub environment `master`).

`VITE_APP_ENV` is set to `prod` on `main` and `staging` on `staging`.

### Dependency updates

Dependabot checks npm packages, GitHub Actions and Docker images weekly. npm
version updates have a seven-day cooldown and group minor and patch updates
separately for production and development dependencies; security updates are
not delayed by the cooldown.

Node and `@types/node` updates are restricted to the approved Node 26 major.
Dependabot cannot automatically identify LTS releases, so when moving to a
newer LTS, update the Dockerfile, CI, Node types, and the restrictions in
`.github/dependabot.yml` together. Review the
[Node.js release schedule](https://nodejs.org/en/about/previous-releases)
before Node 26 reaches end of life. Other dependencies receive normal updates
and are not filtered by LTS status. Ignored versions can also prevent security
updates, so review any outstanding alerts when changing this restriction.

### GitHub configuration

Set these under **Settings → Secrets and variables → Actions**.

| Type     | Name                   | Purpose                                   |
| -------- | ---------------------- | ----------------------------------------- |
| Secret   | `DOCKER_USERNAME`      | Docker Hub user, also the image namespace |
| Secret   | `DOCKER_PASSWORD`      | Docker Hub password or access token       |
| Secret   | `FARO_API_KEY`         | Faro sourcemap upload key                 |
| Variable | `FARO_UPLOAD_ENDPOINT` | Faro sourcemap upload endpoint            |
| Variable | `FARO_APP_ID`          | Faro app ID                               |
| Variable | `FARO_STACK_ID`        | Faro stack ID                             |
| Variable | `VITE_DASHBOARD_URL`   | Optional dashboard URL used by site links |

`VITE_FARO_ENABLED` and `VITE_FARO_URL` are public (they end up in the bundle), so they are hardcoded in `deploy.yml`. The workflow sets `VITE_APP_ENV` there and reads `VITE_DASHBOARD_URL` from GitHub Actions variables.

## License and Copyright

**Source Code:**
The source code for this website (HTML, CSS, JavaScript) is licensed under the [GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.html). This project incorporates lightgallery.js, which is also licensed under the GPLv3.

**Art, Images, and Assets:**
All images, photographs, VRChat avatar designs, and commission showcases contained in this repository and on the live website are **Copyright © waterLilith0 - All Rights Reserved.**

The GPLv3 license applies **ONLY** to the website's code. You may not download, copy, modify, distribute, or reuse any of the images, avatar designs, or VRChat assets from this website without explicit written permission.
