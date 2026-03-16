/**
 * Build-time FR→EN translation using the DeepL free API.
 *
 * Called during `astro build`. A persistent disk cache (.translation-cache.json)
 * ensures each string is only translated once across all builds, saving API quota.
 *
 * Architecture:
 *   1. Collect all unique translatable strings from the data tree
 *   2. Send only uncached strings to DeepL in batched API calls
 *   3. Rebuild the tree with translated values
 *   4. Persist cache to disk so future builds skip the API entirely
 *
 * Key safeguards:
 *   - Mutex prevents concurrent Promise.all() calls from double-translating
 *   - String normalization (.trim()) prevents whitespace-induced cache misses
 *   - Usage logging after translation shows remaining DeepL quota
 *
 * Setup:
 *   1. Get a free key at https://www.deepl.com/pro (free plan, 500k chars/mo)
 *   2. Add  DEEPL_API_KEY=your_key  to your .env file
 *   3. Add the same variable in Cloudflare Pages → Settings → Environment variables
 *
 * If the key is missing the original French text is returned unchanged.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ── Reliable path resolution (works in CI, dev, any CWD) ──

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "../..");
const CACHE_FILE = resolve(PROJECT_ROOT, ".translation-cache.json");

// ── Persistent disk cache ──

let cacheModified = false;

/** Normalize strings before cache lookup to prevent whitespace-induced misses. */
function normalizeKey(str: string): string {
  return str.trim();
}

function loadDiskCache(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const data = JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === "string") map.set(normalizeKey(k), v);
    }
    console.log(`[translate] Loaded ${map.size} cached translations from disk`);
  } catch {
    // File doesn't exist yet or is invalid — start fresh
    console.log(`[translate] No cache file found at ${CACHE_FILE} — starting fresh`);
  }
  return map;
}

function saveDiskCache(map: Map<string, string>): void {
  try {
    const obj: Record<string, string> = {};
    const keys = [...map.keys()].sort();
    for (const k of keys) obj[k] = map.get(k)!;
    writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2) + "\n", "utf-8");
    console.log(`[translate] Saved ${map.size} translations to disk cache`);
  } catch (err) {
    console.warn("[translate] Could not save translation cache:", err);
  }
}

// In-memory cache — seeded from disk, then overlaid with manual overrides.
const cache = loadDiskCache();

// Manual overrides for strings DeepL doesn't translate well (proper nouns, etc.).
const MANUAL_OVERRIDES: Record<string, string> = {
  "Le Parcours": "Programs",
  "Accueil": "Home",
  "/mois": "/month",
  "Oui": "Yes",
};
for (const [fr, en] of Object.entries(MANUAL_OVERRIDES)) {
  cache.set(normalizeKey(fr), en);
}

// Keys whose values must never be translated (TinaCMS internals + technical fields).
const SKIP_KEYS = new Set([
  "_sys", "_values", "__typename", "id",
  "slug", "icon", "color", "href",
  "category", "status",                          // enum values — translated via uiStrings instead
  "phone1", "phone1Link", "phone2", "phone2Link",
  "phone3", "phone3Link",                          // WhatsApp mobile number
  "contactPhone", "contactPhoneLink",              // CSR contact phone
  "whatsappNumber", "email",
  "bankName", "accountNumberPrivate", "accountNumberCSR", "accountHolder",
  "nsifCode", "csrCode",
  "address", "mapUrl", "latitude", "longitude",    // physical location — never translate
  "organizationName", "navbarTitle", "copyright", // org identity — keep French legal name
  "contactName",                                  // person names
  "president", "director",                        // person names
]);

/** Returns true if the string is natural-language text worth translating. */
function isTranslatable(str: string): boolean {
  const trimmed = str.trim();
  if (!trimmed || trimmed.length < 3) return false;
  if (cache.has(normalizeKey(str))) return true;      // always allow manual overrides through
  if (trimmed.startsWith("/") && trimmed.length > 6) return false; // file / asset paths (but allow short like "/mois")
  if (trimmed.startsWith("http")) return false;       // full URLs
  if (trimmed.startsWith("mailto:")) return false;    // email links
  if (trimmed.startsWith("tel:")) return false;       // phone links
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return false; // ISO dates
  if (/^\d+$/.test(trimmed)) return false;            // pure numeric strings
  if (/^[A-Za-z0-9+/]{20,}={0,2}$/.test(trimmed)) return false; // base64 strings (TinaCMS IDs)
  return true;
}

// ── Pass 1: collect all unique translatable strings ──

function collectStrings(value: unknown): Set<string> {
  const strings = new Set<string>();
  if (value === null || value === undefined) return strings;
  if (typeof value === "boolean" || typeof value === "number") return strings;
  if (typeof value === "string") {
    const key = normalizeKey(value);
    if (isTranslatable(value) && !cache.has(key)) strings.add(key);
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
      for (const s of collectStrings(v)) strings.add(s);
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

  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batch = texts.slice(i, i + MAX_BATCH_SIZE);
    console.log(`[translate] Sending batch ${Math.floor(i / MAX_BATCH_SIZE) + 1}: ${batch.length} strings (${batch.reduce((n, s) => n + s.length, 0)} chars)`);

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
              cacheModified = true;
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
        cacheModified = true;
      }
    } catch (err) {
      console.warn("[translate] DeepL fetch failed:", err);
    }
  }
}

/** Log remaining DeepL quota after any API calls. */
async function logDeeplUsage(): Promise<void> {
  const apiKey = import.meta.env.DEEPL_API_KEY;
  if (!apiKey) return;
  try {
    const res = await fetch("https://api-free.deepl.com/v2/usage", {
      headers: { Authorization: `DeepL-Auth-Key ${apiKey}` },
    });
    if (res.ok) {
      const { character_count, character_limit } = await res.json();
      const remaining = character_limit - character_count;
      const pct = ((character_count / character_limit) * 100).toFixed(1);
      console.log(`[translate] DeepL usage: ${character_count.toLocaleString()}/${character_limit.toLocaleString()} chars (${pct}% used, ${remaining.toLocaleString()} remaining)`);
    }
  } catch { /* non-critical */ }
}

// ── Pass 2: rebuild tree using cached translations ──

function applyTranslations(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") {
    if (!isTranslatable(value)) return value;
    return cache.get(normalizeKey(value)) ?? value;
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

// ── Mutex: prevents concurrent translateValue() calls from double-translating ──
// When en/index.astro fires 17 content loaders via Promise.all(), the while-loop
// ensures each caller waits for the previous one to finish and populate the cache.
// Without `while`, all waiting callers would resume simultaneously after the first
// lock release and send duplicate strings to DeepL.

let translationLock: Promise<void> | null = null;

/** Recursively translates all natural-language string values in any value. */
export async function translateValue(value: unknown): Promise<any> {
  // Spin-wait: after a lock releases, re-check in case another caller grabbed it
  while (translationLock) await translationLock;

  // Pass 1: collect unique strings not yet cached
  const uncached = [...collectStrings(value)];

  if (uncached.length > 0) {
    console.log(`[translate] ${uncached.length} new strings to translate`);
    // Hold the lock while translating so concurrent calls wait
    let unlock!: () => void;
    translationLock = new Promise((r) => { unlock = r; });
    try {
      await batchTranslate(uncached);
      await logDeeplUsage();
    } finally {
      translationLock = null;
      unlock();
    }

    // Persist after each batch so the cache is saved even if a later call crashes
    if (cacheModified) {
      saveDiskCache(cache);
      cacheModified = false;
    }
  }

  // Pass 2: rebuild tree with translations
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
