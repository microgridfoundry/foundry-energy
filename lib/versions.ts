/**
 * Utility module for extracting component versions from deno.json
 * This ensures the debug page always shows current dependency versions
 * without manual updates.
 */

interface DenoJson {
  imports?: Record<string, string>;
}

interface ComponentVersions {
  [key: string]: string;
}

/**
 * Read and parse deno.json to extract component versions
 * This function is cached at module load time for performance.
 */
async function loadComponentVersions(): Promise<ComponentVersions> {
  try {
    // Construct path to deno.json relative to this module
    const denoJsonPath = new URL("../deno.json", import.meta.url);

    // Read and parse deno.json
    const content = await Deno.readTextFile(denoJsonPath);
    const denoJson: DenoJson = JSON.parse(content);

    if (!denoJson.imports) {
      console.warn("No imports found in deno.json");
      return {};
    }

    // Extract versions from import specifiers
    const versions: ComponentVersions = {};

    for (const [key, value] of Object.entries(denoJson.imports)) {
      // Skip subpath imports (those ending with /)
      if (key.endsWith("/")) {
        continue;
      }

      // Create friendly display name
      const displayName = key === "fresh"
        ? "Fresh"
        : key === "preact"
        ? "Preact"
        : key === "tailwindcss"
        ? "Tailwind CSS"
        : key === "postcss"
        ? "PostCSS"
        : key;

      versions[displayName] = value;
    }

    return versions;
  } catch (error) {
    console.error("Failed to load component versions from deno.json:", error);

    // fallback: Return empty object on error
    return {};
  }
}

// Load versions at module initialization (cached)
const componentVersionsPromise = loadComponentVersions();

/**
 * Get component versions extracted from deno.json
 * This is cached at module load time, so subsequent calls are instant.
 *
 * @returns Object mapping component names to their version specifiers
 */
export async function getComponentVersions(): Promise<ComponentVersions> {
  return await componentVersionsPromise;
}

/**
 * Get a single component version by name
 *
 * @param name - The component name (e.g., "Fresh", "Preact")
 * @returns The version string, or undefined if not found
 */
export async function getComponentVersion(
  name: string,
): Promise<string | undefined> {
  const versions = await getComponentVersions();
  return versions[name];
}
