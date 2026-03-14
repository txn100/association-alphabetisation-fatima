/**
 * Fetch content using the TinaCMS generated client.
 *
 * For EN locale the same FR data is fetched from TinaCMS and translated to
 * English at build time using the DeepL API (see src/lib/translate.ts).
 *
 * Returns { data, query, variables } for each collection, which useTina()
 * uses for live visual editing in the admin iframe.
 * query: "" on EN results disables TinaCMS live editing for the EN page.
 */

import type { Locale } from "./i18n";
import client from "../../tina/__generated__/client";
import { withTranslation, translateValue } from "./translate";

// ---------------------------------------------------------------------------
// Singleton loaders
// ---------------------------------------------------------------------------

export async function getHeroData(locale: Locale = "fr") {
  const data = await client.queries.hero({ relativePath: "hero.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getAboutData(locale: Locale = "fr") {
  const data = await client.queries.about({ relativePath: "about.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getFooterData(locale: Locale = "fr") {
  const data = await client.queries.footer({ relativePath: "footer.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getNavigationData(locale: Locale = "fr") {
  const data = await client.queries.navigation({ relativePath: "navigation.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getImpactData(locale: Locale = "fr") {
  const data = await client.queries.impact({ relativePath: "impact.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getPedagogyData(locale: Locale = "fr") {
  const data = await client.queries.pedagogy({ relativePath: "pedagogy.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getDonateData(locale: Locale = "fr") {
  const data = await client.queries.donate({ relativePath: "donate.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getSiteData(locale: Locale = "fr") {
  const data = await client.queries.site({ relativePath: "site.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getStatsSectionData(locale: Locale = "fr") {
  const data = await client.queries.statsSection({ relativePath: "stats-section.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getProgramsSectionData(locale: Locale = "fr") {
  const data = await client.queries.programsSection({ relativePath: "programs-section.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getGallerySectionData(locale: Locale = "fr") {
  const data = await client.queries.gallerySection({ relativePath: "gallery-section.json" });
  return locale === "en" ? withTranslation(data) : data;
}

export async function getProjectsSectionData(locale: Locale = "fr") {
  const data = await client.queries.projectsSection({ relativePath: "projects-section.json" });
  return locale === "en" ? withTranslation(data) : data;
}

// ---------------------------------------------------------------------------
// Multi-doc collection loaders
// ---------------------------------------------------------------------------

export async function getStatsData(locale: Locale = "fr") {
  const data = await client.queries.statsConnection();
  return locale === "en" ? withTranslation(data) : data;
}

export async function getProgramsData(locale: Locale = "fr") {
  const data = await client.queries.programsConnection();
  return locale === "en" ? withTranslation(data) : data;
}

export async function getNewsData(locale: Locale = "fr") {
  const data = await client.queries.newsConnection();
  return locale === "en" ? withTranslation(data) : data;
}

export async function getTiersData(locale: Locale = "fr") {
  const data = await client.queries.tiersConnection();
  return locale === "en" ? withTranslation(data) : data;
}

export async function getProjectsData(locale: Locale = "fr") {
  const data = await client.queries.projectsConnection();
  return locale === "en" ? withTranslation(data) : data;
}

// ---------------------------------------------------------------------------
// Standalone page content loaders (static JSON only, no TinaCMS collection)
// ---------------------------------------------------------------------------

// Gallery is language-independent (images only) — always use FR/TinaCMS
export async function getGalleryData() {
  return client.queries.galleryConnection();
}
