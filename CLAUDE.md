# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

The Foundry website (formerly Microgrid Foundry) - a Fresh 2.x (Deno) website
for a national operator of community-owned energy systems in the UK. The site
showcases energy communities (Water Lilies in Bristol, Hazelmead in Bridport)
and handles contact form submissions.

## Build and Development Commands

```bash
PORT=8770 deno task dev   # Dev server — 8770 is this site's slot in ~/DEV_PORTS.md
deno task build           # Build for production
deno task check           # fmt check, lint and type check — keep this passing
deno fmt && deno lint     # Format and lint
deno task test            # Run tests with coverage
```

Dependencies are pinned through `deno.lock` (committed). After changing
`deno.json` imports, run `deno install` and commit the updated lock file.

## Deployment

The site runs on **Fly.io** only, as two apps in org `microgridfoundry` (region
`lhr`). Deploys are **manual** — merging to `main` deploys nothing.

|         | prod                                              | prev                                                     |
| ------- | ------------------------------------------------- | -------------------------------------------------------- |
| App     | `foundry-energy-mgf`                              | `foundry-energy-mgf-prev`                                |
| URL     | https://foundry.energy (+ www)                    | https://prev.foundry.energy                              |
| Config  | `fly.toml` (`APP_ENV=prod`, 1 machine always on)  | `fly.prev.toml` (`APP_ENV=prev`, scales to zero)         |
| Deploy  | `fly deploy --remote-only` (from `main`)          | `fly deploy -c fly.prev.toml --remote-only` (any branch) |
| Doppler | `foundry-energy-mgf` → `prod`, **copied by hand** | `foundry-energy-mgf` → `prev`, **synced automatically**  |

Workflow: branch → local (`PORT=8770 deno task dev`) → deploy the branch to prev
and review at prev.foundry.energy → PR → merge → deploy `main` to prod. Prev is
shared: the last deploy wins.

`APP_ENV` (read by `lib/env.ts`) drives the differences: on prev every response
carries `X-Robots-Tag: noindex, nofollow`, `/robots.txt` disallows everything,
and the debug page shows PREVIEW.

**Prod details**

- Serves https://foundry.energy and https://www.foundry.energy (Fly certs; DNS
  in DNSimple: apex A `66.241.125.129` / AAAA `2a09:8280:1::1ff:bc4:0`, `www`
  CNAME → `foundry-energy-mgf.fly.dev`).
- `microgridfoundry.uk` and `www.microgridfoundry.uk` are DNSimple URL records
  that 301 to https://foundry.energy, keeping the path. Keep the domain
  registered — old links and mail depend on it.
- Built from `Dockerfile`: Deno 2.9.7, `deno install --frozen`, then
  `deno task build`. Keep `.gitignore` in the Docker context — Tailwind uses it
  to skip `node_modules` when scanning for classes.
- Secrets live in Doppler project `foundry-energy-mgf` (`local`/`prev`/`prod`);
  Doppler is canonical for both environments. Change values in Doppler, never on
  Fly directly.
  - **prev** syncs automatically: Doppler's Fly integration
    `fly-foundry-energy-mgf-prev` (app-scoped deploy token) pushes `prev` to
    `foundry-energy-mgf-prev` and restarts its machines.
  - **prod** is copied by hand, because the Simtricity workplace's Doppler
    Developer plan allows only 5 config syncs and they are all in use. After
    changing `prod` in Doppler, run:
    `doppler secrets download -p foundry-energy-mgf -c prod --no-file --format env | fly secrets import -a foundry-energy-mgf`
    (Fly restarts the machine). Integration `fly-foundry-energy-mgf` already
    exists in Doppler, so if a sync slot frees up or the plan is upgraded, add
    the `prod` sync and drop this step.
- Until values are in Doppler the contact form returns 503. On prev, point
  `CONTACT_EMAIL` at a test address, not the real inbox.

**Prev details:** `prev` CNAME → `foundry-energy-mgf-prev.fly.dev` in DNSimple,
with a Fly cert. The first request after idling wakes the machine (a second or
two).

History: the site ran on Deno Deploy (app `microgridfoundry-uk`, org `simt`)
until the 2026-11-12 cut-over; that app and the old Fly app of the same name
have both been deleted.

**Gotcha — build inside a dot-directory.** Fresh's build skips `static/` when
the repo path contains a folder starting with `.` (e.g. a worktree under
`.claude/worktrees/`). A production build there serves no CSS or images. Build
from a normal path (or in Docker) when testing `deno task build`.

## Architecture

### Tech Stack

- **Framework**: Fresh 2.x (Deno's full-stack framework)
- **Styling**: Tailwind CSS 4.x via `@fresh/plugin-tailwind` (configured in
  `static/styles.css`; there is no `tailwind.config.ts`)
- **Runtime**: Deno
- **Email**: Resend API (v6) for the contact form

### Fresh 2.x Handler Pattern

Handlers in Fresh 2.x accept only ONE argument (context), not two:

```typescript
import type { HandlerByMethod } from "fresh";

// ✅ CORRECT
export const handler: HandlerByMethod<unknown, unknown> = {
  async POST(ctx) {
    const req = ctx.req; // Access request via ctx.req
    // ...
  },
};

// ❌ WRONG - Don't use (req, ctx) signature
```

To set a page's status code, return `page(undefined, { status })` from a handler
(see `routes/_404.tsx`).

### Project Structure

```
routes/           # File-system based routing
  api/contact.ts  # Contact form API endpoint (Resend email)
  index.tsx       # Homepage (composes components)
  contact.tsx     # Contact page
  debug.tsx       # Debug/diagnostics page
  _404.tsx        # Not-found page (returns HTTP 404)
  robots.txt.ts   # /robots.txt — Disallow all on prev, Allow on prod
components/       # Server-side rendered components (Nav, Hero, Communities, etc.)
islands/          # Interactive client-side components (ContactForm)
lib/versions.ts   # Reads deno.json imports for the debug page
lib/env.ts        # appEnv(): prod / prev / local from APP_ENV
static/           # Static assets served at root path (/filename.jpg)
_assets_src/      # Higher-resolution image masters (not served)
```

### Static Assets

Files in `/static/` are served at the root URL path:

- `/static/wlce-droneshot.png` → accessible at `/wlce-droneshot.png`
- `/static/hazelmead-people.jpg` → accessible at `/hazelmead-people.jpg`

Keep served images web-sized (the Hazelmead JPG is 1600px wide). Higher-res
masters live in `_assets_src/` (e.g. `hazelmead-people.jpg`, 2400px). Downscale
camera originals to ~2400px JPEG before committing — never commit multi-MB
files.

## Brand and copy

The operator trades as **The Foundry** (domain foundry.energy). Rules for site
copy:

- Never say "microgrid". The legal name "Microgrid Foundry Limited" appears only
  in the footer company line ("…trading as The Foundry").
- What we help build: **smart local energy systems**. Water Lilies and Hazelmead
  may still be described in their own terms (smart grid, local grid).
- Ownership: say **locally owned** alongside **community-owned**, and name local
  authorities and housing associations as well as communities.
- Keep "South-West" unbroken (`<span className="whitespace-nowrap">`).

## Links

- Platform links ("Learn More", "Powered by") go to https://simtricity.ai —
  simtricity.io no longer resolves.
- In-page links in shared components (Nav, Footer) must use `/#anchor`, not
  `#anchor`, so they work from `/contact`.
- Open item: footer "Privacy Policy" and "Terms of Service" link to `#` — no
  pages exist yet.

## Environment Variables

Required for contact form functionality:

- `RESEND_API_KEY` - Resend API key for sending emails
- `CONTACT_EMAIL` - Recipient email (default: hello@microgridfoundry.co.uk)
- `RESEND_FROM_EMAIL` - Sender email (default: onboarding@resend.dev)
- `PORT` - Server port (default: 8000)

## Contact Form API

`POST /api/contact` - Handles contact form submissions with:

- Rate limiting: 3 requests per hour per IP
- Honeypot spam protection
- Email validation
- HTML-escapes all form fields before building the email
- Sends formatted HTML email via Resend

Visit `/debug` to check environment configuration and troubleshoot issues.

## Verifying changes

Use the chrome-devtools MCP for screenshots and browser checks, not Puppeteer or
Playwright scripts. For "no visual change" work, compare full-page screenshots
(desktop 1440 and mobile 390) before and after. The embedded Google Map on
`/contact` renders differently on every load, so ignore it in comparisons.
