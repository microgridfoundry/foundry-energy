/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { App, staticFiles } from "fresh";
import { isPrev } from "./lib/env.ts";

export const app = new App();

// prev: tell search engines not to index anything (pages, images, CSS)
app.use(async (ctx) => {
  const res = await ctx.next();
  if (!isPrev()) return res;
  const tagged = new Response(res.body, res);
  tagged.headers.set("X-Robots-Tag", "noindex, nofollow");
  return tagged;
});

// Request logging middleware
app.use(async (ctx) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${ctx.req.method} ${ctx.req.url}`);
  const res = await ctx.next();
  const ms = Date.now() - start;
  console.log(
    `[${
      new Date().toISOString()
    }] ${ctx.req.method} ${ctx.req.url} - ${res.status} ${ms}ms`,
  );
  return res;
});

// Set up static files middleware
app.use(staticFiles());

// Set up file-system based routing
app.fsRoutes();

// Start server if running directly (not via dev.ts)
if (import.meta.main) {
  const port = parseInt(Deno.env.get("PORT") || "8000");
  const hostname = "0.0.0.0";
  console.log(
    `Starting The Foundry website on http://${hostname}:${port}`,
  );
  await app.listen({ port, hostname });
}
