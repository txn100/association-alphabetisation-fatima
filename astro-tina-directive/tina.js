/**
 * Custom Astro client directive that only hydrates React components
 * when the page is loaded inside the TinaCMS admin iframe.
 * In production (normal browsing), no JavaScript is loaded.
 *
 * @type {import('astro').ClientDirective}
 */
export default async (load, options, el) => {
  try {
    const isInIframe = window.self !== window.top;
    if (!isInIframe) {
      return;
    }
    const hydrate = await load();
    await hydrate();
  } catch (error) {
    console.error("An error occurred in the Tina client directive:", error);
  }
};
