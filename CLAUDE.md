# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Microgrid Foundry website - a Fresh 2.x (Deno) website for a national operator
of community-owned energy systems in the UK. The site showcases energy
communities (Water Lilies in Bristol, Hazelmead in Bridport) and handles contact
form submissions.

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

Production is hosted on **Deno Deploy** (app `microgridfoundry-uk`, org `simt`).

- Push / merge to `main` → production at https://www.microgridfoundry.uk/
- Push any other branch → preview at
  `https://microgridfoundry-uk--<branch>.simt.deno.net`
- Test changes on a branch preview before opening a PR to `main`.

The Fly.io files (`Dockerfile`, `fly.toml`, `deno task deploy`) are deprecated
but deliberately kept — don't remove them.

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
