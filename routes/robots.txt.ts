import type { HandlerByMethod } from "fresh";
import { isPrev } from "../lib/env.ts";

// prev: keep every crawler out. prod and local: allow everything.
export const handler: HandlerByMethod<unknown, unknown> = {
  GET() {
    const body = isPrev()
      ? "User-agent: *\nDisallow: /\n"
      : "User-agent: *\nAllow: /\n";
    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
};
