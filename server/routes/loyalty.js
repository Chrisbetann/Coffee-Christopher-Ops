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

// POST /api/loyalty/register — customer signs up
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, phone, birthday } = req.body;
  if (!first_name || !last_name || !email || !phone) {
    return res.status(400).json({ error: 'First name, last name, email, and phone are required' });
  }

  try {
    let qr_code;
    let unique = false;
    while (!unique) {
      qr_code = generateQrCode();
      const existing = await prisma.customer.findUnique({ where: { qr_code } });
      if (!existing) unique = true;
    }

    const customer = await prisma.customer.create({
      data: { first_name, last_name, email, phone, birthday: birthday || null, qr_code },
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

// GET /api/loyalty/:qrCode — get customer card (public)
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

// GET /api/loyalty/lookup/phone/:phone — lookup by phone (admin)
router.get('/lookup/phone/:phone', requireAuth, async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { phone: req.params.phone },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Lookup failed' });
  }
});

// POST /api/loyalty/admin/stamp — add a stamp (admin only)
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

// POST /api/loyalty/admin/redeem — redeem a free drink (admin only)
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

// GET /api/loyalty/admin/customers — all customers (admin only)
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

module.exports = router;
