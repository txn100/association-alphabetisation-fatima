/**
 * GET /api/admin/donations
 *
 * Export donation records as CSV or JSON.
 * Protected by ADMIN_API_KEY bearer token.
 *
 * Query params:
 *   format=csv|json (default: json)
 *   from=YYYY-MM-DD (filter start date)
 *   to=YYYY-MM-DD (filter end date)
 *   status=success|failed|pending|refunded (filter by status)
 *   type=one-time|monthly (filter by type)
 *   limit=100 (max rows, default 1000)
 */
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // --- Auth check ---
    const authHeader = request.headers.get('Authorization') || '';
    const expectedKey = getAdminApiKey();

    if (!expectedKey || !authHeader.startsWith('Bearer ')) {
      return unauthorized();
    }

    const providedKey = authHeader.slice(7);
    if (providedKey !== expectedKey) {
      return unauthorized();
    }

    // --- Parse query params ---
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'json';
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '1000'), 5000);

    // --- Build query ---
    const conditions: string[] = [];
    const bindings: any[] = [];

    if (from) {
      conditions.push('created_at >= ?');
      bindings.push(from);
    }
    if (to) {
      conditions.push('created_at <= ?');
      bindings.push(to + 'T23:59:59');
    }
    if (status) {
      conditions.push('status = ?');
      bindings.push(status);
    }
    if (type) {
      conditions.push('type = ?');
      bindings.push(type);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    bindings.push(limit);

    const query = `
      SELECT
        id, merchant_tx_id, public_id, type, amount, currency, status,
        donor_name, donor_email, donor_phone, donor_nic, tax_receipt_requested,
        payment_brand, result_code, tier_amount, tier_label, locale,
        created_at, paid_at
      FROM donations
      ${where}
      ORDER BY created_at DESC
      LIMIT ?
    `;

    const db = getDB();
    const stmt = db.prepare(query);
    const bound = bindings.length > 0 ? stmt.bind(...bindings) : stmt;
    const result = await bound.all();
    const rows = result.results || [];

    // --- Convert amount from cents ---
    const donations = rows.map((row: any) => ({
      ...row,
      amount: row.amount / 100,
      tax_receipt_requested: !!row.tax_receipt_requested,
    }));

    // --- Return in requested format ---
    if (format === 'csv') {
      return csv(donations);
    }

    return new Response(JSON.stringify({ donations, count: donations.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Admin donations error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function csv(rows: any[]) {
  if (rows.length === 0) {
    return new Response('No data', {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="donations.csv"',
      },
    });
  }

  const headers = [
    'date', 'type', 'amount_mur', 'status', 'donor_name', 'donor_email',
    'donor_phone', 'donor_nic', 'tax_receipt', 'payment_method',
    'tier', 'locale', 'reference',
  ];

  const csvRows = rows.map((r: any) => [
    r.paid_at || r.created_at,
    r.type,
    r.amount,
    r.status,
    `"${(r.donor_name || '').replace(/"/g, '""')}"`,
    r.donor_email,
    r.donor_phone || '',
    r.donor_nic || '',
    r.tax_receipt_requested ? 'yes' : 'no',
    r.payment_brand || '',
    r.tier_label || '',
    r.locale,
    r.public_id,
  ].join(','));

  const content = [headers.join(','), ...csvRows].join('\n');

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="donations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function getAdminApiKey(): string {
  return (import.meta as any).env?.ADMIN_API_KEY
    || (globalThis as any).process?.env?.ADMIN_API_KEY || '';
}

function getDB(): D1Database {
  const runtime = (globalThis as any).__runtime;
  if (runtime?.env?.DB) return runtime.env.DB;
  throw new Error('D1 database binding not available');
}
