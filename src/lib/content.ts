/**
 * Read content files directly from the filesystem at build time.
 * Formats data to match TinaCMS GraphQL response shape so React
 * components with useTina() work both at build time (static data)
 * and in the admin iframe (live GraphQL data).
 */

import fs from "node:fs";
import path from "node:path";

function readJsonDir(dir: string) {
  const contentDir = path.resolve(dir);
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(contentDir, f), "utf-8");
      const data = JSON.parse(raw);
      return {
        ...data,
        _sys: { filename: f.replace(".json", ""), relativePath: f },
      };
    });
}

function toConnection(collectionName: string, items: any[]) {
  return {
    data: {
      [`${collectionName}Connection`]: {
        edges: items.map((item) => ({ node: item })),
      },
    },
    query: `{ ${collectionName}Connection { edges { node { ... } } } }`,
    variables: {},
  };
}

export function getStatsData() {
  return toConnection("stats", readJsonDir("src/content/stats"));
}

export function getProgramsData() {
  return toConnection("programs", readJsonDir("src/content/programs"));
}

export function getNewsData() {
  return toConnection("news", readJsonDir("src/content/news"));
}

export function getGalleryData() {
  return toConnection("gallery", readJsonDir("src/content/gallery"));
}
