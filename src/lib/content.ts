/**
 * Fetch content using the TinaCMS generated client.
 * Returns { data, query, variables } for each collection,
 * which useTina() uses for live visual editing in the admin iframe.
 */

import client from "../../tina/__generated__/client";

export async function getHeroData() {
  return client.queries.hero({ relativePath: "hero.json" });
}
export async function getAboutData() {
  return client.queries.about({ relativePath: "about.json" });
}
export async function getFooterData() {
  return client.queries.footer({ relativePath: "footer.json" });
}
export async function getNavigationData() {
  return client.queries.navigation({ relativePath: "navigation.json" });
}
export async function getImpactData() {
  return client.queries.impact({ relativePath: "impact.json" });
}
export async function getPedagogyData() {
  return client.queries.pedagogy({ relativePath: "pedagogy.json" });
}
export async function getDonateData() {
  return client.queries.donate({ relativePath: "donate.json" });
}
export async function getSiteData() {
  return client.queries.site({ relativePath: "site.json" });
}
export async function getStatsSectionData() {
  return client.queries.statsSection({ relativePath: "stats-section.json" });
}
export async function getProgramsSectionData() {
  return client.queries.programsSection({ relativePath: "programs-section.json" });
}
export async function getGallerySectionData() {
  return client.queries.gallerySection({ relativePath: "gallery-section.json" });
}
export async function getProjectsSectionData() {
  return client.queries.projectsSection({ relativePath: "projects-section.json" });
}

export async function getStatsData() {
  return client.queries.statsConnection();
}
export async function getProgramsData() {
  return client.queries.programsConnection();
}
export async function getNewsData() {
  return client.queries.newsConnection();
}
export async function getGalleryData() {
  return client.queries.galleryConnection();
}
export async function getTiersData() {
  return client.queries.tiersConnection();
}
export async function getProjectsData() {
  return client.queries.projectsConnection();
}
