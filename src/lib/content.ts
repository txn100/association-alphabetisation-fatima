/**
 * Fetch content using the TinaCMS generated client (FR) or static JSON (EN).
 * Returns { data, query, variables } for each collection,
 * which useTina() uses for live visual editing in the admin iframe.
 *
 * For EN locale, we wrap raw JSON in the same shape so useTina()
 * returns data as-is (query: "" = no live editing subscription).
 */

import type { Locale } from "./i18n";
import client from "../../tina/__generated__/client";

// ---------------------------------------------------------------------------
// Helpers to wrap static JSON in TinaCMS-compatible shape
// ---------------------------------------------------------------------------

/** Wrap a singleton JSON file so it looks like a TinaCMS query result. */
function wrapSingleton<T>(collectionName: string, data: T) {
  return {
    data: { [collectionName]: data } as any,
    query: "",
    variables: {},
  };
}

/** Wrap an array of multi-doc items as a TinaCMS Connection result. */
function wrapConnection<T extends Record<string, any>>(collectionName: string, nodes: T[]) {
  return {
    data: {
      [`${collectionName}Connection`]: {
        edges: nodes.map((node, i) => ({
          node: { ...node, _sys: { filename: `en-${i}` } },
        })),
      },
    } as any,
    query: "",
    variables: {},
  };
}

/** Dynamic import of a JSON file from src/data/en/ */
async function loadEnSingleton(name: string) {
  const mod = await import(`../data/en/${name}.json`);
  return mod.default || mod;
}

/** Dynamic import of all JSON files from a content/en/ subdirectory. */
async function loadEnCollection(dir: string): Promise<any[]> {
  // Use Vite's import.meta.glob with eager loading for each EN content dir
  const modules: Record<string, any> = import.meta.glob(
    "../content/en/**/*.json",
    { eager: true }
  );
  const prefix = `../content/en/${dir}/`;
  return Object.entries(modules)
    .filter(([path]) => path.startsWith(prefix))
    .map(([, mod]) => mod.default || mod);
}

// ---------------------------------------------------------------------------
// Singleton loaders
// ---------------------------------------------------------------------------

export async function getHeroData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("hero", await loadEnSingleton("hero"));
  return client.queries.hero({ relativePath: "hero.json" });
}

export async function getAboutData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("about", await loadEnSingleton("about"));
  return client.queries.about({ relativePath: "about.json" });
}

export async function getFooterData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("footer", await loadEnSingleton("footer"));
  return client.queries.footer({ relativePath: "footer.json" });
}

export async function getNavigationData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("navigation", await loadEnSingleton("navigation"));
  return client.queries.navigation({ relativePath: "navigation.json" });
}

export async function getImpactData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("impact", await loadEnSingleton("impact"));
  return client.queries.impact({ relativePath: "impact.json" });
}

export async function getPedagogyData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("pedagogy", await loadEnSingleton("pedagogy"));
  return client.queries.pedagogy({ relativePath: "pedagogy.json" });
}

export async function getDonateData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("donate", await loadEnSingleton("donate"));
  return client.queries.donate({ relativePath: "donate.json" });
}

export async function getSiteData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("site", await loadEnSingleton("site"));
  return client.queries.site({ relativePath: "site.json" });
}

export async function getStatsSectionData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("statsSection", await loadEnSingleton("stats-section"));
  return client.queries.statsSection({ relativePath: "stats-section.json" });
}

export async function getProgramsSectionData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("programsSection", await loadEnSingleton("programs-section"));
  return client.queries.programsSection({ relativePath: "programs-section.json" });
}

export async function getGallerySectionData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("gallerySection", await loadEnSingleton("gallery-section"));
  return client.queries.gallerySection({ relativePath: "gallery-section.json" });
}

export async function getProjectsSectionData(locale: Locale = "fr") {
  if (locale === "en") return wrapSingleton("projectsSection", await loadEnSingleton("projects-section"));
  return client.queries.projectsSection({ relativePath: "projects-section.json" });
}

// ---------------------------------------------------------------------------
// Multi-doc collection loaders
// ---------------------------------------------------------------------------

export async function getStatsData(locale: Locale = "fr") {
  if (locale === "en") return wrapConnection("stats", await loadEnCollection("stats"));
  return client.queries.statsConnection();
}

export async function getProgramsData(locale: Locale = "fr") {
  if (locale === "en") return wrapConnection("programs", await loadEnCollection("programs"));
  return client.queries.programsConnection();
}

export async function getNewsData(locale: Locale = "fr") {
  if (locale === "en") return wrapConnection("news", await loadEnCollection("news"));
  return client.queries.newsConnection();
}

export async function getTiersData(locale: Locale = "fr") {
  if (locale === "en") return wrapConnection("tiers", await loadEnCollection("tiers"));
  return client.queries.tiersConnection();
}

export async function getProjectsData(locale: Locale = "fr") {
  if (locale === "en") return wrapConnection("projects", await loadEnCollection("projects"));
  return client.queries.projectsConnection();
}

// Gallery is language-independent (images only) — always use FR/TinaCMS
export async function getGalleryData() {
  return client.queries.galleryConnection();
}

// ---------------------------------------------------------------------------
// Donate page content (static JSON — not a TinaCMS collection yet)
// ---------------------------------------------------------------------------

export async function getDonatePageData(locale: Locale = "fr") {
  if (locale === "en") return loadEnSingleton("donate-page");
  const mod = await import("../data/donate-page.json");
  return mod.default || mod;
}
