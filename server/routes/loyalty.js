const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const STAMPS_FOR_FREE = 6;

function generateQrCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

async function generateUniqueQrCode() {
  for (let i = 0; i < 10; i++) {
    const code = generateQrCode();
    const existing = await prisma.customer.findUnique({ where: { qr_code: code } });
    if (!existing) return code;
  }
  throw new Error('Could not generate unique QR code');
}

// POST /api/loyalty/register — customer signs up
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, phone, birthday } = req.body;
  if (!first_name || !last_name || !email || !phone) {
    return res.status(400).json({ error: 'First name, last name, email, and phone are required' });
  }

  try {
    const qr_code = await generateUniqueQrCode();

    const customer = await prisma.customer.create({
      data: {
        first_name,
        last_name,
        email,
        phone: normalizePhone(phone),
        birthday: birthday || null,
        qr_code,
      },
    });
    res.status(201).json(customer);
  } catch (err) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.includes('email') ? 'email' : 'phone';
      return res.status(409).json({ error: `That ${field} is already registered` });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/loyalty/by-phone/:phone — public phone lookup
// Lets customers pull up their card with just their phone number
router.get('/by-phone/:phone', async (req, res) => {
  try {
    const phone = normalizePhone(req.params.phone);
    if (phone.length < 7) {
      return res.status(400).json({ error: 'Enter a valid phone number' });
    }
    const customer = await prisma.customer.findUnique({ where: { phone } });
    if (!customer) return res.status(404).json({ error: 'No loyalty account found with that phone number' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Lookup failed' });
  }
});

// GET /api/loyalty/lookup/phone/:phone — admin phone lookup (kept for back-compat)
router.get('/lookup/phone/:phone', requireAuth, async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { phone: normalizePhone(req.params.phone) },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Lookup failed' });
  }
});

// ── Wallet pass routes ──────────────────────────────────────────────
// Scaffolded: return 501 with setup instructions until Apple Developer
// certs and a Google Wallet service account are configured via env vars.
// Full setup instructions in server/wallet/SETUP.md.
function walletSetupMessage(platform) {
  return {
    error: 'Wallet pass not configured',
    platform,
    setup: platform === 'apple'
      ? 'Set APPLE_PASS_CERT_P12, APPLE_PASS_CERT_PASSWORD, APPLE_PASS_TYPE_ID, and APPLE_TEAM_ID env vars. See server/wallet/SETUP.md.'
      : 'Set GOOGLE_WALLET_SERVICE_ACCOUNT (JSON) and GOOGLE_WALLET_ISSUER_ID env vars. See server/wallet/SETUP.md.',
  };
}

router.get('/:qrCode/apple-wallet', async (req, res) => {
  const hasConfig = process.env.APPLE_PASS_CERT_P12 && process.env.APPLE_PASS_CERT_PASSWORD;
  if (!hasConfig) return res.status(501).json(walletSetupMessage('apple'));

  try {
    const customer = await prisma.customer.findUnique({ where: { qr_code: req.params.qrCode } });
    if (!customer) return res.status(404).json({ error: 'Card not found' });
    // When configured: use passkit-generator to build and sign a .pkpass,
    // then res.type('application/vnd.apple.pkpass').send(pass.getAsBuffer()).
    res.status(501).json({ error: 'Pass generator not wired. Install passkit-generator and finish implementation.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to build Apple Wallet pass' });
  }
});

router.get('/:qrCode/google-wallet', async (req, res) => {
  const hasConfig = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT && process.env.GOOGLE_WALLET_ISSUER_ID;
  if (!hasConfig) return res.status(501).json(walletSetupMessage('google'));

  try {
    const customer = await prisma.customer.findUnique({ where: { qr_code: req.params.qrCode } });
    if (!customer) return res.status(404).json({ error: 'Card not found' });
    // When configured: sign a JWT and redirect to https://pay.google.com/gp/v/save/<jwt>
    res.status(501).json({ error: 'Google Wallet JWT not wired. Install google-auth-library and finish implementation.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to build Google Wallet pass' });
  }
});

// GET /api/loyalty/:qrCode — get customer card (public)
// NOTE: Must be defined AFTER /by-phone/:phone, /lookup/phone/:phone,
// and /:qrCode/apple-wallet, /:qrCode/google-wallet so Express doesn't
// match those as a qrCode param.
router.get('/:qrCode', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { qr_code: req.params.qrCode },
    });
    if (!customer) return res.status(404).json({ error: 'Loyalty card not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loyalty card' });
  }
});

// ── Admin endpoints ─────────────────────────────────────────────────

router.post('/admin/stamp', requireAuth, async (req, res) => {
  const { qr_code } = req.body;
  if (!qr_code) return res.status(400).json({ error: 'qr_code required' });

  try {
    const customer = await prisma.customer.findUnique({ where: { qr_code } });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const updated = await prisma.customer.update({
      where: { qr_code },
      data: { stamps: customer.stamps + 1 },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add stamp' });
  }
});

router.post('/admin/redeem', requireAuth, async (req, res) => {
  const { qr_code } = req.body;
  if (!qr_code) return res.status(400).json({ error: 'qr_code required' });

  try {
    const customer = await prisma.customer.findUnique({ where: { qr_code } });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const freeDrinks = Math.floor(customer.stamps / STAMPS_FOR_FREE);
    if (freeDrinks === 0) return res.status(400).json({ error: 'No free drinks available' });

    const updated = await prisma.customer.update({
      where: { qr_code },
      data: { stamps: customer.stamps - STAMPS_FOR_FREE },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to redeem free drink' });
  }
});

// POST /api/loyalty/admin/customers — force-add a customer
router.post('/admin/customers', requireAuth, async (req, res) => {
  const { first_name, last_name, email, phone, birthday } = req.body;
  if (!first_name || !last_name || !email || !phone) {
    return res.status(400).json({ error: 'First name, last name, email, and phone are required' });
  }
  try {
    const qr_code = await generateUniqueQrCode();
    const customer = await prisma.customer.create({
      data: {
        first_name,
        last_name,
        email,
        phone: normalizePhone(phone),
        birthday: birthday || null,
        qr_code,
      },
    });
    res.status(201).json(customer);
  } catch (err) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.includes('email') ? 'email' : 'phone';
      return res.status(409).json({ error: `That ${field} is already registered` });
    }
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// DELETE /api/loyalty/admin/customers/:id — force delete a customer
router.delete('/admin/customers/:id', requireAuth, async (req, res) => {
  try {
    await prisma.customer.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// GET /api/loyalty/admin/customers — all customers
router.get('/admin/customers', requireAuth, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// POST /api/loyalty/admin/reminders/weekly — build weekly reminder batch
// Returns all members with ≥1 stamp. The admin UI uses this to open one
// big mailto: email. If SENDGRID_API_KEY is ever configured, swap in a
// SendGrid send here to fully automate.
router.post('/admin/reminders/weekly', requireAuth, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { stamps: { gte: 1 } },
      orderBy: { created_at: 'desc' },
    });

    const hasSendGrid = !!process.env.SENDGRID_API_KEY;

    res.json({
      ready: customers.length,
      delivery: hasSendGrid ? 'sendgrid' : 'mailto',
      customers,
      note: hasSendGrid
        ? 'SENDGRID_API_KEY is configured — wire the SendGrid send call to fully automate delivery.'
        : 'No SENDGRID_API_KEY set. Admin UI falls back to mailto: link batching.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to build reminder batch' });
  }
});

module.exports = router;
