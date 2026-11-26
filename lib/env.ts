/**
 * Which environment this instance is running in.
 *
 * Set APP_ENV in fly.toml (prod) and fly.prev.toml (prev). Locally it is unset.
 */
export type AppEnv = "prod" | "prev" | "local";

export function appEnv(): AppEnv {
  const value = Deno.env.get("APP_ENV");
  if (value === "prod" || value === "prev" || value === "local") return value;
  // fallback: APP_ENV unset — treat any Fly machine as prod, anything else as local
  return Deno.env.get("FLY_APP_NAME") ? "prod" : "local";
}

/** Prev must never be indexed by search engines. */
export function isPrev(): boolean {
  return appEnv() === "prev";
}
