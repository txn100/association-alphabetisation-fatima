/**
 * Build-time FR→EN translation using the DeepL free API.
 *
 * Called during `astro build`. An in-memory cache prevents duplicate API
 * calls for repeated strings within the same build.
 *
 * Uses a two-pass approach:
 *   1. Collect all unique translatable strings from the data tree
 *   2. Send them to DeepL in a single batched API call
 *   3. Rebuild the tree with translated values
 *
 * Setup:
 *   1. Get a free key at https://www.deepl.com/pro (free plan, 500k chars/mo)
 *   2. Add  DEEPL_API_KEY=your_key  to your .env file
 *   3. Add the same variable in Cloudflare Pages → Settings → Environment variables
 *
 * If the key is missing the original French text is returned unchanged.
 */

// In-memory cache — lives for the duration of a single build/dev session.
const cache = new Map<string, string>();

// Manual overrides for strings DeepL doesn't translate well (proper nouns, etc.).
// Also used as identity mappings to prevent translation of proper nouns.
const MANUAL_OVERRIDES: Record<string, string> = {
  "Le Parcours": "Programs",
  "Accueil": "Home",
  "/mois": "/month",
  "Oui": "Yes",
};
// Pre-seed cache with manual overrides so they're never sent to DeepL.
for (const [fr, en] of Object.entries(MANUAL_OVERRIDES)) {
  cache.set(fr, en);
}

// Keys whose values must never be translated (TinaCMS internals + technical fields).
const SKIP_KEYS = new Set([
  "_sys", "_values", "__typename", "id",
  "slug", "icon", "color", "href",
  "category", "status",                          // enum values — translated via uiStrings instead
  "phone1", "phone1Link", "phone2", "phone2Link",
  "whatsappNumber", "email",
  "bankName", "accountNumberPrivate", "accountNumberCSR", "accountHolder",
  "nsifCode", "csrCode",
  "address",                                     // physical address — never translate place names
  "organizationName", "navbarTitle", "copyright", // org identity — keep French legal name
  "contactName",                                  // person names
  "president", "director",                        // person names
]);

/** Returns true if the string is natural-language text worth translating. */
function isTranslatable(str: string): boolean {
  if (!str || str.trim().length < 3) return false;
  if (cache.has(str)) return true;                   // always allow manual overrides through
  if (str.startsWith("/") && str.length > 6) return false; // file / asset paths (but allow short like "/mois")
  if (str.startsWith("http")) return false;          // full URLs
  if (str.startsWith("mailto:")) return false;       // email links
  if (str.startsWith("tel:")) return false;          // phone links
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return false; // ISO dates
  if (/^\d+$/.test(str)) return false;               // pure numeric strings
  if (/^[A-Za-z0-9+/]{20,}={0,2}$/.test(str)) return false; // base64 strings (TinaCMS IDs)
  return true;
}

// ── Pass 1: collect all unique translatable strings ──

function collectStrings(value: unknown, parentKey?: string): Set<string> {
  const strings = new Set<string>();
  if (value === null || value === undefined) return strings;
  if (typeof value === "boolean" || typeof value === "number") return strings;
  if (typeof value === "string") {
    if (isTranslatable(value) && !cache.has(value)) strings.add(value);
    return strings;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      for (const s of collectStrings(item)) strings.add(s);
    }
    return strings;
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SKIP_KEYS.has(k)) continue;
      for (const s of collectStrings(v, k)) strings.add(s);
    }
  }
  return strings;
}

// ── Batch translate via DeepL ──

const MAX_BATCH_SIZE = 50; // DeepL supports up to 50 texts per request

async function batchTranslate(texts: string[]): Promise<void> {
  const apiKey = import.meta.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.warn("[translate] DEEPL_API_KEY not found — EN pages will show French text");
    return;
  }

  // Split into chunks of MAX_BATCH_SIZE
  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batch = texts.slice(i, i + MAX_BATCH_SIZE);
    console.log(`[translate] Sending batch ${Math.floor(i / MAX_BATCH_SIZE) + 1}: ${batch.length} strings`);

    try {
      const res = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: batch,
          source_lang: "FR",
          target_lang: "EN-US",
        }),
      });

      if (!res.ok) {
        console.warn(`[translate] DeepL ${res.status} for batch — falling back to FR`);
        // On rate limit, wait and retry once
        if (res.status === 429) {
          console.log("[translate] Rate limited — waiting 2s and retrying...");
          await new Promise((r) => setTimeout(r, 2000));
          const retry = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
              Authorization: `DeepL-Auth-Key ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: batch,
              source_lang: "FR",
              target_lang: "EN-US",
            }),
          });
          if (retry.ok) {
            const json = await retry.json();
            const translations = json.translations || [];
            for (let j = 0; j < batch.length; j++) {
              cache.set(batch[j], translations[j]?.text ?? batch[j]);
            }
            continue;
          }
          console.warn("[translate] Retry also failed — using FR text for this batch");
        }
        continue;
      }

      const json = await res.json();
      const translations = json.translations || [];
      for (let j = 0; j < batch.length; j++) {
        cache.set(batch[j], translations[j]?.text ?? batch[j]);
      }
    } catch (err) {
      console.warn("[translate] DeepL fetch failed:", err);
    }
  }
}

// ── Pass 2: rebuild tree using cached translations ──

function applyTranslations(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") {
    if (!isTranslatable(value)) return value;
    return cache.get(value) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => applyTranslations(item));
  }
  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = SKIP_KEYS.has(k) ? v : applyTranslations(v);
    }
    return result;
  }
  return value;
}

/** Recursively translates all natural-language string values in any value. */
export async function translateValue(value: unknown): Promise<any> {
  // Pass 1: collect unique strings not yet cached
  const strings = collectStrings(value);
  const uncached = [...strings];

  // Pass 2: batch translate all uncached strings
  if (uncached.length > 0) {
    await batchTranslate(uncached);
  }

  // Pass 3: rebuild tree with translations
  return applyTranslations(value);
}

/**
 * Takes a TinaCMS query result, translates all content strings FR→EN,
 * and strips the query string so TinaCMS live-editing is disabled for EN.
 */
export async function withTranslation<
  T extends { data: unknown; query: string; variables: unknown },
>(result: T): Promise<T> {
  return {
    ...result,
    data: await translateValue(result.data),
    query: "", // disables useTina() live editing on the EN page
  } as T;
}
