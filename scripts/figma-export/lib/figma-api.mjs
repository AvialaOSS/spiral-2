const FIGMA_API = "https://api.figma.com/v1";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createFigmaClient(token) {
  if (!token) {
    throw new Error("FIGMA_ACCESS_TOKEN is required");
  }

  async function figmaFetch(path, attempt = 0) {
    const res = await fetch(`${FIGMA_API}${path}`, {
      headers: { "X-Figma-Token": token },
    });

    if (res.status === 429 && attempt < 6) {
      const wait = Math.min(30_000, 2_000 * 2 ** (attempt + 1));
      console.warn(`  Figma rate limit on ${path.split("?")[0]}, retry in ${wait}ms (${attempt + 1}/6)`);
      await sleep(wait);
      return figmaFetch(path, attempt + 1);
    }

    if (!res.ok) {
      throw new Error(`Figma API ${res.status} ${path}: ${await res.text()}`);
    }

    return res.json();
  }

  async function listComponents(fileKey) {
    const data = await figmaFetch(`/files/${fileKey}/components`);
    return data.meta?.components ?? [];
  }

  async function listComponentSets(fileKey) {
    const data = await figmaFetch(`/files/${fileKey}/component_sets`);
    return data.meta?.component_sets ?? [];
  }

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

  async function fetchSvgUrls(fileKey, nodeIds, batchSize = 40) {
    const urls = new Map();

    for (let i = 0; i < nodeIds.length; i += batchSize) {
      const batch = nodeIds.slice(i, i + batchSize);
      const data = await figmaFetch(
        `/images/${fileKey}?ids=${encodeURIComponent(batch.join(","))}&format=svg`
      );

      for (const [id, url] of Object.entries(data.images ?? {})) {
        if (url) urls.set(id, url);
      }

      if (i + batchSize < nodeIds.length) await sleep(350);
    }

    return urls;
  }

  return {
    figmaFetch,
    listComponents,
    listComponentSets,
    fetchNodes,
    fetchSvgUrls,
  };
}
