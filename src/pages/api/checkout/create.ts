/**
 * POST /api/checkout/create
 *
 * Creates a Peach Hosted Checkout session.
 * 1. Validates donor form data
 * 2. Inserts a pending donation row in D1
 * 3. Returns signed form params for the Hosted Checkout redirect
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import {
  buildHostedCheckoutParams,
  generateMerchantTxId,
  generatePublicId,
} from '../../../lib/peach';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // --- Validate required fields ---
    const { amount, type, donorName, donorEmail, locale } = body;
    const donorPhone = body.donorPhone || null;
    const donorNic = body.donorNic || null;
    const taxReceiptRequested = body.taxReceiptRequested ? 1 : 0;
    const tierAmount = body.tierAmount || null;
    const tierLabel = body.tierLabel || null;

    if (!amount || amount <= 0) {
      return json({ error: 'Invalid amount' }, 400);
    }
    if (!donorName?.trim()) {
      return json({ error: 'Donor name is required' }, 400);
    }
    if (!donorEmail?.trim() || !donorEmail.includes('@')) {
      return json({ error: 'Valid email is required' }, 400);
    }
    if (!['one-time', 'monthly'].includes(type)) {
      return json({ error: 'Type must be one-time or monthly' }, 400);
    }
    if (taxReceiptRequested && !donorNic?.trim()) {
      return json({ error: 'NIC/passport required for tax receipt' }, 400);
    }

    // --- Get env vars and D1 binding ---
    const env = getEnv();
    const db = getDB();

    // --- Generate IDs ---
    const merchantTxId = generateMerchantTxId();
    const publicId = generatePublicId();

    // --- Determine locale-aware URLs ---
    const baseUrl = new URL(request.url).origin;
    const langPrefix = locale === 'en' ? '/en' : '';
    const shopperResultUrl = `${baseUrl}/api/checkout/return`;
    const notificationUrl = `${baseUrl}/api/webhooks/peach`;

    // --- Build signed checkout params ---
    const isMonthly = type === 'monthly';
    const checkout = await buildHostedCheckoutParams({
      entityId: env.PEACH_ENTITY_ID,
      secretToken: env.PEACH_SECRET_TOKEN,
      checkoutUrl: env.PEACH_CHECKOUT_URL,
      amount: Number(amount),
      merchantTransactionId: merchantTxId,
      shopperResultUrl,
      notificationUrl,
      shopperEmail: donorEmail,
      shopperName: donorName,
      createRegistration: isMonthly,
    });

    // --- Insert pending donation into D1 ---
    await db.prepare(`
      INSERT INTO donations (
        merchant_tx_id, public_id, type, amount, currency, status,
        donor_name, donor_email, donor_phone, donor_nic, tax_receipt_requested,
        tier_amount, tier_label, locale
      ) VALUES (?, ?, ?, ?, 'MUR', 'pending', ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      merchantTxId, publicId, type, Math.round(amount * 100),
      donorName.trim(), donorEmail.trim(), donorPhone, donorNic,
      taxReceiptRequested, tierAmount, tierLabel, locale || 'fr',
    ).run();

    // --- Return checkout form params ---
    return json({
      formAction: checkout.formAction,
      fields: checkout.fields,
      publicId,
      merchantTransactionId: merchantTxId,
    });

  } catch (err: any) {
    console.error('Checkout create error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getEnv() {
  // Cloudflare Workers environment — accessed via the module-level env
  // In Astro + Cloudflare adapter, env vars are available via process.env
  // or the Cloudflare Workers env binding
  const PEACH_ENTITY_ID = (import.meta as any).env?.PEACH_ENTITY_ID
    || (globalThis as any).process?.env?.PEACH_ENTITY_ID || '';
  const PEACH_SECRET_TOKEN = (import.meta as any).env?.PEACH_SECRET_TOKEN
    || (globalThis as any).process?.env?.PEACH_SECRET_TOKEN || '';
  const PEACH_CHECKOUT_URL = (import.meta as any).env?.PEACH_CHECKOUT_URL
    || (globalThis as any).process?.env?.PEACH_CHECKOUT_URL
    || 'https://testsecure.peachpayments.com/checkout';

  if (!PEACH_ENTITY_ID || !PEACH_SECRET_TOKEN) {
    throw new Error('Missing Peach Payments credentials');
  }

  return { PEACH_ENTITY_ID, PEACH_SECRET_TOKEN, PEACH_CHECKOUT_URL };
}

function getDB(): D1Database {
  // D1 binding is available via Astro's Cloudflare runtime
  const runtime = (globalThis as any).__runtime;
  if (runtime?.env?.DB) return runtime.env.DB;

  // Fallback: try import from cloudflare:workers (Astro 5 + Cloudflare adapter)
  throw new Error('D1 database binding not available');
}
