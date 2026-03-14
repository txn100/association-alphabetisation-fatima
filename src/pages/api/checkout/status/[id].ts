/**
 * GET /api/checkout/status/:id
 *
 * Returns the current status of a donation by its public ID.
 * Used by the success/failure pages to display confirmation.
 * Uses publicId (safe for URLs) — never exposes merchantTransactionId.
 */
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  try {
    const publicId = params.id;
    if (!publicId || publicId.length < 8) {
      return json({ error: 'Invalid ID' }, 400);
    }

    const db = getDB();

    const donation = await db.prepare(`
      SELECT
        public_id, type, amount, currency, status,
        donor_name, donor_email, payment_brand,
        tier_label, tax_receipt_requested, locale,
        created_at, paid_at
      FROM donations
      WHERE public_id = ?
    `).bind(publicId).first<any>();

    if (!donation) {
      return json({ error: 'Donation not found' }, 404);
    }

    return json({
      publicId: donation.public_id,
      type: donation.type,
      amount: donation.amount / 100, // cents → MUR
      currency: donation.currency,
      status: donation.status,
      donorName: donation.donor_name,
      donorEmail: donation.donor_email,
      paymentBrand: donation.payment_brand,
      tierLabel: donation.tier_label,
      taxReceiptRequested: !!donation.tax_receipt_requested,
      locale: donation.locale,
      createdAt: donation.created_at,
      paidAt: donation.paid_at,
    });

  } catch (err: any) {
    console.error('Status check error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function getDB(): D1Database {
  const runtime = (globalThis as any).__runtime;
  if (runtime?.env?.DB) return runtime.env.DB;
  throw new Error('D1 database binding not available');
}
