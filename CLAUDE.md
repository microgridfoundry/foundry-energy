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

The site is mid-migration from Deno Deploy to Fly.io. Both hosts run the same
code until `microgridfoundry.uk` is cut over.

**Fly.io — the future home** (app `foundry-energy-mgf`, org `microgridfoundry`,
region `lhr`)

- Serves https://foundry.energy and https://www.foundry.energy (Fly certs; DNS
  in DNSimple: apex A `66.241.125.129` / AAAA `2a09:8280:1::1ff:bc4:0`, `www`
  CNAME → `foundry-energy-mgf.fly.dev`).
- Deploys are **manual** for now:
  `fly deploy -a foundry-energy-mgf --remote-only` (no GitHub Action yet).
  Merging to `main` does NOT deploy to Fly.
- Built from `Dockerfile`: Deno 2.9.7, `deno install --frozen`, then
  `deno task build`. Keep `.gitignore` in the Docker context — Tailwind uses it
  to skip `node_modules` when scanning for classes.
- No secrets yet, so the contact form returns 503 there. Plan: Doppler project
  `foundry-energy-mgf` (`local`/`prev`/`prod`) with native Fly sync.

**Deno Deploy — current public site** (app `microgridfoundry-uk`, org `simt`)

- Push / merge to `main` → production at https://www.microgridfoundry.uk/
- Push any other branch → preview at
  `https://microgridfoundry-uk--<branch>.simt.deno.net`
- Retire after cut-over: point `microgridfoundry.uk` at the Fly app with a
  path-preserving 301 to `www.foundry.energy`, then remove the Deno app.

The old Fly app `microgridfoundry-uk` was destroyed on 2026-11-12.

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
components/       # Server-side rendered components (Nav, Hero, Communities, etc.)
islands/          # Interactive client-side components (ContactForm)
lib/versions.ts   # Reads deno.json imports for the debug page
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
