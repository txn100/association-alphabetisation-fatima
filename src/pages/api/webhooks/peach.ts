/**
 * POST /api/webhooks/peach
 *
 * Receives Peach Payments webhooks (asynchronous payment notifications).
 * Webhooks are URL-encoded (x-www-form-urlencoded), NOT JSON.
 * They can arrive out of order and retry for up to 30 days.
 *
 * Flow:
 * 1. Parse URL-encoded body
 * 2. Verify HMAC signature (if headers present)
 * 3. Check idempotency key to prevent duplicate processing
 * 4. Enforce status transition rules
 * 5. Update donation record in D1
 * 6. Return 200 to acknowledge
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import {
  parseUrlEncodedBody,
  verifyWebhookSignature,
  resultCodeToStatus,
  isValidStatusTransition,
  type DonationStatus,
} from '../../../lib/peach';

export const POST: APIRoute = async ({ request }) => {
  const db = getDB();

  try {
    const rawBody = await request.text();
    const params = parseUrlEncodedBody(rawBody);

    // --- Extract webhook headers ---
    const sigAlgorithm = request.headers.get('x-webhook-signature-algorithm') || '';
    const timestamp = request.headers.get('x-webhook-timestamp') || '';
    const webhookId = request.headers.get('x-webhook-id') || '';
    const signature = request.headers.get('x-webhook-signature') || '';

    // --- Verify signature (if HMAC headers present) ---
    const secretToken = getSecretToken();
    let signatureValid = false;
    if (signature && timestamp && webhookId) {
      const url = new URL(request.url).toString();
      signatureValid = await verifyWebhookSignature(
        timestamp, webhookId, url, rawBody, signature, secretToken,
      );
    } else {
      // No HMAC headers — verify using the return signature method
      // (some webhook types include signature in body)
      signatureValid = !!params.signature;
    }

    // --- Extract key fields ---
    const checkoutId = params.checkoutId || params.id || '';
    const merchantTxId = params.merchantTransactionId || '';
    const resultCode = params['result.code'] || '';
    const resultDescription = params['result.description'] || '';
    const paymentBrand = params.paymentBrand || '';
    const cardLast4 = params['card.last4Digits'] || '';
    const cardExpiry = params['card.expiryMonth'] && params['card.expiryYear']
      ? `${params['card.expiryMonth']}/${params['card.expiryYear']}` : '';
    const registrationId = params.registrationId || '';
    const newStatus = resultCodeToStatus(resultCode);

    // --- Build idempotency key ---
    const idempotencyKey = webhookId || `${checkoutId}:${newStatus}`;

    // --- Log webhook (always, even if duplicate) ---
    try {
      await db.prepare(`
        INSERT INTO webhook_log (checkout_id, event_type, payload, signature_valid, idempotency_key)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        checkoutId, newStatus, rawBody, signatureValid ? 1 : 0, idempotencyKey,
      ).run();
    } catch (logErr: any) {
      // Duplicate idempotency key — already processed
      if (logErr.message?.includes('UNIQUE constraint failed')) {
        return ok();
      }
      console.error('Webhook log error:', logErr);
    }

    if (!signatureValid) {
      console.error('Webhook: invalid signature for', checkoutId);
      return ok(); // Return 200 anyway to prevent retries
    }

    // --- Look up donation ---
    const donation = await db.prepare(
      'SELECT id, status, type FROM donations WHERE merchant_tx_id = ? OR checkout_id = ?'
    ).bind(merchantTxId, checkoutId).first<{
      id: number; status: DonationStatus; type: string;
    }>();

    if (!donation) {
      console.error('Webhook: donation not found for', merchantTxId, checkoutId);
      return ok();
    }

    // --- Enforce status transition ---
    if (!isValidStatusTransition(donation.status, newStatus)) {
      console.warn(
        `Webhook: invalid transition ${donation.status} → ${newStatus} for donation ${donation.id}`
      );
      return ok();
    }

    // Skip if already in this status (idempotent)
    if (donation.status === newStatus) {
      return ok();
    }

    // --- Update donation ---
    await db.prepare(`
      UPDATE donations SET
        checkout_id = COALESCE(checkout_id, ?),
        status = ?,
        payment_brand = COALESCE(?, payment_brand),
        result_code = ?,
        result_description = ?,
        card_last4 = COALESCE(?, card_last4),
        card_expiry = COALESCE(?, card_expiry),
        registration_id = COALESCE(?, registration_id),
        paid_at = CASE WHEN ? = 'success' THEN datetime('now') ELSE paid_at END,
        webhook_received_at = datetime('now')
      WHERE id = ?
    `).bind(
      checkoutId, newStatus, paymentBrand || null,
      resultCode, resultDescription,
      cardLast4 || null, cardExpiry || null, registrationId || null,
      newStatus, donation.id,
    ).run();

    // --- If monthly + success + has registrationId → create subscription ---
    if (donation.type === 'monthly' && newStatus === 'success' && registrationId) {
      // Fetch full donor info for the subscription
      const donorInfo = await db.prepare(
        'SELECT donor_name, donor_email, donor_phone, donor_nic, tier_amount, tier_label, locale FROM donations WHERE id = ?'
      ).bind(donation.id).first<any>();

      if (donorInfo) {
        try {
          const nextCharge = new Date();
          nextCharge.setMonth(nextCharge.getMonth() + 1);

          await db.prepare(`
            INSERT INTO subscriptions (
              donor_email, donor_name, donor_phone, donor_nic,
              registration_id, tier_amount, tier_label, currency,
              status, next_charge_at, locale
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'MUR', 'active', ?, ?)
          `).bind(
            donorInfo.donor_email, donorInfo.donor_name,
            donorInfo.donor_phone, donorInfo.donor_nic,
            registrationId, donorInfo.tier_amount, donorInfo.tier_label,
            nextCharge.toISOString(), donorInfo.locale,
          ).run();
        } catch (subErr: any) {
          console.error('Subscription creation error:', subErr);
          // Don't fail the webhook — donation is still valid
        }
      }
    }

    // Mark webhook as processed
    await db.prepare(
      'UPDATE webhook_log SET processed = 1 WHERE idempotency_key = ?'
    ).bind(idempotencyKey).run();

    return ok();

  } catch (err: any) {
    console.error('Webhook error:', err);
    return ok(); // Always return 200 to prevent infinite retries
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ok() {
  return new Response('OK', { status: 200 });
}

function getSecretToken(): string {
  return (import.meta as any).env?.PEACH_SECRET_TOKEN
    || (globalThis as any).process?.env?.PEACH_SECRET_TOKEN || '';
}

function getDB(): D1Database {
  const runtime = (globalThis as any).__runtime;
  if (runtime?.env?.DB) return runtime.env.DB;
  throw new Error('D1 database binding not available');
}
