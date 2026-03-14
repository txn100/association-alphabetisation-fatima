/**
 * POST /api/checkout/return
 *
 * Peach POSTs here after payment completion (shopperResultUrl).
 * This is NOT a page — it's a POST endpoint that:
 * 1. Parses the URL-encoded response body
 * 2. Verifies the Peach signature
 * 3. Updates the donation record in D1
 * 4. 303 redirects to the success or failure page
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import {
  parseUrlEncodedBody,
  verifyReturnSignature,
  resultCodeToStatus,
  isValidStatusTransition,
  type DonationStatus,
} from '../../../lib/peach';

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.text();
    const params = parseUrlEncodedBody(rawBody);

    // --- Get env and D1 ---
    const secretToken = getSecretToken();
    const db = getDB();

    // --- Verify signature ---
    const signatureValid = await verifyReturnSignature(params, secretToken);

    // --- Extract key fields ---
    const merchantTxId = params.merchantTransactionId || '';
    const checkoutId = params.id || params.checkoutId || '';
    const resultCode = params['result.code'] || '';
    const resultDescription = params['result.description'] || '';
    const paymentBrand = params.paymentBrand || '';
    const cardLast4 = params['card.last4Digits'] || '';
    const cardExpiry = params['card.expiryMonth'] && params['card.expiryYear']
      ? `${params['card.expiryMonth']}/${params['card.expiryYear']}` : '';
    const registrationId = params.registrationId || '';

    // --- Look up the donation ---
    const donation = await db.prepare(
      'SELECT id, status, locale, public_id FROM donations WHERE merchant_tx_id = ?'
    ).bind(merchantTxId).first<{
      id: number; status: DonationStatus; locale: string; public_id: string;
    }>();

    if (!donation) {
      console.error('Return: donation not found for', merchantTxId);
      return redirect('/donate/failed');
    }

    // --- Determine new status ---
    const newStatus = resultCodeToStatus(resultCode);

    // --- Update donation if transition is valid ---
    if (signatureValid && isValidStatusTransition(donation.status, newStatus)) {
      await db.prepare(`
        UPDATE donations SET
          checkout_id = ?,
          status = ?,
          payment_brand = ?,
          result_code = ?,
          result_description = ?,
          card_last4 = ?,
          card_expiry = ?,
          registration_id = ?,
          paid_at = CASE WHEN ? = 'success' THEN datetime('now') ELSE paid_at END
        WHERE id = ?
      `).bind(
        checkoutId, newStatus, paymentBrand,
        resultCode, resultDescription,
        cardLast4, cardExpiry, registrationId,
        newStatus, donation.id,
      ).run();
    }

    // --- Redirect to human-readable page ---
    const langPrefix = donation.locale === 'en' ? '/en' : '';
    if (newStatus === 'success') {
      return redirect(`${langPrefix}/donate/success?ref=${donation.public_id}`);
    } else {
      return redirect(`${langPrefix}/donate/failed?ref=${donation.public_id}`);
    }

  } catch (err: any) {
    console.error('Checkout return error:', err);
    return redirect('/donate/failed');
  }
};

// Also handle GET in case of browser back/refresh
export const GET: APIRoute = async () => {
  return redirect('/donate');
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function redirect(url: string) {
  return new Response(null, {
    status: 303,
    headers: { Location: url },
  });
}

function getSecretToken(): string {
  const token = (import.meta as any).env?.PEACH_SECRET_TOKEN
    || (globalThis as any).process?.env?.PEACH_SECRET_TOKEN || '';
  if (!token) throw new Error('Missing PEACH_SECRET_TOKEN');
  return token;
}

function getDB(): D1Database {
  const runtime = (globalThis as any).__runtime;
  if (runtime?.env?.DB) return runtime.env.DB;
  throw new Error('D1 database binding not available');
}
