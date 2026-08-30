const FIGMA_API = "https://api.figma.com/v1";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Thrown when Figma returns 429 and retries are exhausted. Callers should hard-fail. */
export class RateLimitExhaustedError extends Error {
  constructor(path, attempts) {
    super(
      `Figma rate limit exhausted after ${attempts} retries on ${path.split("?")[0]}`
    );
    this.name = "RateLimitExhaustedError";
    this.path = path;
    this.attempts = attempts;
  }
}

function parseRetryAfterMs(res, attempt) {
  const header = res.headers.get("retry-after");
  if (header) {
    const seconds = Number(header);
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(60_000, Math.max(1_000, seconds * 1_000));
    }
  }
  return Math.min(30_000, 2_000 * 2 ** (attempt + 1));
}

/**
 * @param {string} token
 * @param {{ maxRetries?: number }} [options]
 */
export function createFigmaClient(token, options = {}) {
  if (!token) {
    throw new Error("FIGMA_ACCESS_TOKEN is required");
  }

  const maxRetries = options.maxRetries ?? 6;

  async function figmaFetch(path, attempt = 0) {
    const res = await fetch(`${FIGMA_API}${path}`, {
      headers: { "X-Figma-Token": token },
    });

    if (res.status === 429) {
      if (attempt >= maxRetries) {
        throw new RateLimitExhaustedError(path, attempt);
      }
      const wait = parseRetryAfterMs(res, attempt);
      console.warn(
        `  Figma rate limit on ${path.split("?")[0]}, retry in ${wait}ms (${attempt + 1}/${maxRetries})`
      );
      await sleep(wait);
      return figmaFetch(path, attempt + 1);
    }

    if (!res.ok) {
      throw new Error(`Figma API ${res.status} ${path}: ${await res.text()}`);
    }

    return res.json();
  }

  /**
   * Published components in this file's library (not unpublished/local-only nodes).
   * Requires library_content:read. New icons appear only after Publish library.
   */
  async function listComponents(fileKey) {
    const data = await figmaFetch(`/files/${fileKey}/components`);
    return data.meta?.components ?? [];
  }

  /**
   * Published component sets in this file's library (not unpublished/local-only sets).
   * Requires library_content:read. New sets appear only after Publish library.
   */
  async function listComponentSets(fileKey) {
    const data = await figmaFetch(`/files/${fileKey}/component_sets`);
    return data.meta?.component_sets ?? [];
  }

  /** Live file nodes for the given ids (current file content, not publish snapshot). */
  async function fetchNodes(fileKey, nodeIds, depth = 2, batchSize = 40) {
    const nodes = {};

    for (let i = 0; i < nodeIds.length; i += batchSize) {
      const batch = nodeIds.slice(i, i + batchSize);
      const data = await figmaFetch(
        `/files/${fileKey}/nodes?ids=${encodeURIComponent(batch.join(","))}&depth=${depth}`
      );
      Object.assign(nodes, data.nodes ?? {});
      if (i + batchSize < nodeIds.length) await sleep(200);
    }

    return nodes;
  }

  /**
   * Request SVG render URLs for node ids (live file render).
   * Returns urls Map plus missingNodeIds where Figma returned null / omitted the id.
   * Default batch size 20 to reduce Tier-1 rate-limit pressure.
   *
   * @returns {Promise<{ urls: Map<string, string>, missingNodeIds: string[] }>}
   */
  async function fetchSvgUrls(fileKey, nodeIds, batchSize = 20) {
    const urls = new Map();
    const missingNodeIds = [];

    for (let i = 0; i < nodeIds.length; i += batchSize) {
      const batch = nodeIds.slice(i, i + batchSize);
      const data = await figmaFetch(
        `/images/${fileKey}?ids=${encodeURIComponent(batch.join(","))}&format=svg`
      );

      const images = data.images ?? {};
      for (const id of batch) {
        const url = images[id];
        if (url) urls.set(id, url);
        else missingNodeIds.push(id);
      }

      if (i + batchSize < nodeIds.length) await sleep(500);
    }

    return { urls, missingNodeIds };
  }

  return {
    figmaFetch,
    listComponents,
    listComponentSets,
    fetchNodes,
    fetchSvgUrls,
    maxRetries,
  };
}
