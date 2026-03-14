/**
 * Peach Payments API wrapper.
 * Pure fetch() calls — no npm package needed.
 *
 * Hosted Checkout flow:
 * 1. Server signs checkout params with HMAC SHA256
 * 2. Client submits hidden form to Peach Hosted Checkout URL
 * 3. Peach POSTs back to shopperResultUrl after payment
 * 4. Webhook arrives separately (URL-encoded, not JSON)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckoutParams {
  amount: string;           // e.g. "800.00"
  currency: string;         // "MUR"
  merchantTransactionId: string;
  shopperResultUrl: string;
  notificationUrl: string;
  defaultPaymentMethod?: string;
  forceDefaultMethod?: string;
  createRegistration?: string; // "true" for recurring tokenization
  shopperEmail?: string;
  shopperName?: string;
}

export interface WebhookPayload {
  checkoutId?: string;
  merchantTransactionId?: string;
  amount?: string;
  currency?: string;
  paymentBrand?: string;
  paymentType?: string;
  'result.code'?: string;
  'result.description'?: string;
  'card.last4Digits'?: string;
  'card.expiryMonth'?: string;
  'card.expiryYear'?: string;
  registrationId?: string;
  timestamp?: string;
  signature?: string;
  id?: string;
  [key: string]: string | undefined;
}

export type DonationStatus = 'pending' | 'success' | 'failed' | 'refunded';

// ---------------------------------------------------------------------------
// Signature generation & verification
// ---------------------------------------------------------------------------

/**
 * Create HMAC SHA256 signature for Hosted Checkout redirect.
 * Peach expects: sort params alphabetically, concatenate values, HMAC with secret.
 */
export async function createCheckoutSignature(
  params: Record<string, string>,
  secretToken: string,
): Promise<string> {
  // Sort keys alphabetically, concatenate all values
  const sortedKeys = Object.keys(params).sort();
  const dataToSign = sortedKeys.map(k => params[k]).join('');

  return hmacSha256(dataToSign, secretToken);
}

/**
 * Verify the signature on Peach's POST-back to shopperResultUrl.
 * Peach signs the response params the same way: sorted keys, concat values, HMAC.
 */
export async function verifyReturnSignature(
  params: Record<string, string>,
  secretToken: string,
): Promise<boolean> {
  const receivedSig = params.signature;
  if (!receivedSig) return false;

  // Remove 'signature' from params before verification
  const { signature: _, ...rest } = params;
  const expectedSig = await createCheckoutSignature(rest, secretToken);
  return timingSafeEqual(receivedSig, expectedSig);
}

/**
 * Verify webhook HMAC signature.
 * Message format: ${timestamp}.${webhookId}.${url}.${payload}
 */
export async function verifyWebhookSignature(
  timestamp: string,
  webhookId: string,
  url: string,
  payload: string,
  signature: string,
  secretToken: string,
): Promise<boolean> {
  const message = `${timestamp}.${webhookId}.${url}.${payload}`;
  const expectedSig = await hmacSha256(message, secretToken);
  return timingSafeEqual(signature, expectedSig);
}

// ---------------------------------------------------------------------------
// Webhook parsing
// ---------------------------------------------------------------------------

/**
 * Parse URL-encoded webhook body into key-value object.
 * Peach webhooks are x-www-form-urlencoded, NOT JSON.
 */
export function parseUrlEncodedBody(body: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = body.split('&');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = decodeURIComponent(pair.slice(0, idx));
    const value = decodeURIComponent(pair.slice(idx + 1).replace(/\+/g, ' '));
    params[key] = value;
  }
  return params;
}

/**
 * Determine donation status from Peach result code.
 * See: https://developer.peachpayments.com/docs/checkout-result-codes
 */
export function resultCodeToStatus(resultCode: string): DonationStatus {
  if (!resultCode) return 'pending';

  // Success: codes starting with 000
  if (resultCode.startsWith('000')) return 'success';

  // Pending: codes starting with 100 (pending), 800 (waiting)
  if (resultCode.startsWith('100') || resultCode.startsWith('800')) return 'pending';

  // Everything else is a failure
  return 'failed';
}

// ---------------------------------------------------------------------------
// Status transition rules (idempotency)
// ---------------------------------------------------------------------------

const VALID_TRANSITIONS: Record<DonationStatus, DonationStatus[]> = {
  pending: ['success', 'failed'],
  success: ['refunded'],
  failed: [],       // terminal state
  refunded: [],     // terminal state
};

/**
 * Check if a status transition is valid.
 * Prevents replayed webhooks from corrupting data.
 */
export function isValidStatusTransition(
  current: DonationStatus,
  incoming: DonationStatus,
): boolean {
  // Same status = no-op, still valid (idempotent)
  if (current === incoming) return true;
  return VALID_TRANSITIONS[current]?.includes(incoming) ?? false;
}

// ---------------------------------------------------------------------------
// Transaction ID generation
// ---------------------------------------------------------------------------

/**
 * Generate a short fixed-width merchant transaction ID.
 * Format: F{YYMMDD}{4-char hex} → 11 chars, e.g. "F260314A1B2"
 */
export function generateMerchantTxId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `F${yy}${mm}${dd}${rand}`;
}

/**
 * Generate a public-safe ID for URLs (not the merchant TX ID).
 * 12-char hex string.
 */
export function generatePublicId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a unique nonce for checkout session.
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Hosted Checkout form params builder
// ---------------------------------------------------------------------------

/**
 * Build the signed form params for Hosted Checkout redirect.
 * The frontend will create a hidden <form> and auto-submit it to Peach.
 */
export async function buildHostedCheckoutParams(opts: {
  entityId: string;
  secretToken: string;
  checkoutUrl: string;
  amount: number;        // in MUR (e.g. 800)
  currency?: string;
  merchantTransactionId: string;
  shopperResultUrl: string;
  notificationUrl: string;
  shopperEmail?: string;
  shopperName?: string;
  createRegistration?: boolean;
}): Promise<{ formAction: string; fields: Record<string, string> }> {
  const params: Record<string, string> = {
    entityId: opts.entityId,
    amount: opts.amount.toFixed(2),
    currency: opts.currency || 'MUR',
    paymentType: 'DB',   // Debit (immediate charge)
    merchantTransactionId: opts.merchantTransactionId,
    'shopper.resultUrl': opts.shopperResultUrl,
    notificationUrl: opts.notificationUrl,
    nonce: generateNonce(),
  };

  if (opts.shopperEmail) params['customer.email'] = opts.shopperEmail;
  if (opts.shopperName) params['customer.givenName'] = opts.shopperName;
  if (opts.createRegistration) params.createRegistration = 'true';

  // Sign the params
  const signature = await createCheckoutSignature(params, opts.secretToken);
  params.signature = signature;

  return {
    formAction: opts.checkoutUrl,
    fields: params,
  };
}

// ---------------------------------------------------------------------------
// Crypto helpers (Web Crypto API — works in Cloudflare Workers)
// ---------------------------------------------------------------------------

async function hmacSha256(message: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );

  const sig = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
