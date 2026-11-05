# CLAUDE.md - Microgrid Foundry Website

## Deployment

Production is hosted on **Deno Deploy** (not Fly.io).

- **Deploy**: `git push` to main branch triggers automatic deployment
- **Production URL**: https://www.microgridfoundry.uk/

## Development

- **Dev server**: `deno task dev` (uses random port 8100-8900 to avoid
  conflicts)
- **Build**: `deno task build`
- **Lint/Format**: `deno fmt && deno lint`

## Static Assets

Images are stored in `/static/` and served at the root path:

- `/static/wlce-droneshot.png` → `/wlce-droneshot.png`
- `/static/hazelmead-people.jpg` → `/hazelmead-people.jpg`
