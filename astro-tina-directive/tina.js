/**
 * Custom Astro client directive that only hydrates React components
 * when the page is loaded inside the TinaCMS admin iframe.
 * In production (normal browsing), no JavaScript is loaded.
 *
 * @type {import('astro').ClientDirective}
 */
export default async (load, options, el) => {
  let isInIframe = false;
  try {
    isInIframe = window.self !== window.top;
  } catch (e) {
    // Cross-origin SecurityError means we ARE in an iframe
    isInIframe = true;
  }
  if (!isInIframe) {
    return;
  }
  try {
    const hydrate = await load();
    await hydrate();
  } catch (error) {
    console.error("Tina client directive hydration error:", error);
  }
};
