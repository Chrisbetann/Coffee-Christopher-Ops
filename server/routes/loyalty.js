const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { sendWelcomeEmail } = require('../utils/email');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/loyalty/signup
router.post('/signup', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(1).max(150),
    phone: z.string().max(30).optional(),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const { email, name, phone } = parse.data;
  try {
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return res.json({ customer: existing, created: false });
    }
    const customer = await prisma.customer.create({ data: { email, name, phone } });
    // Fire welcome email — don't await so signup isn't blocked by email errors
    sendWelcomeEmail(customer).catch((err) => console.error('Welcome email failed:', err.message));
    res.status(201).json({ customer, created: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create loyalty account' });
  }
});

// GET /api/loyalty/lookup?email=
router.get('/lookup', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
      include: {
        loyalty_txns: {
          orderBy: { created_at: 'desc' },
          take: 10,
        },
      },
    });
    if (!customer) return res.status(404).json({ error: 'No loyalty account found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to look up account' });
  }
});

// POST /api/loyalty/apply-promo  — validate a promo code before checkout
router.post('/apply-promo', async (req, res) => {
  const schema = z.object({
    code: z.string().min(1),
    subtotal: z.number().positive(),
    item_ids: z.array(z.number().int().positive()).optional(),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const { code, subtotal, item_ids = [] } = parse.data;
  try {
    const promo = await prisma.promotion.findUnique({ where: { code: code.toUpperCase() } });
    if (!promo) return res.status(404).json({ error: 'Promo code not found' });
    if (!promo.active) return res.status(400).json({ error: 'This promo code is no longer active' });
    if (promo.expires_at && new Date() > new Date(promo.expires_at)) {
      return res.status(400).json({ error: 'This promo code has expired' });
    }
    if (promo.min_order_amount && subtotal < Number(promo.min_order_amount)) {
      return res.status(400).json({
        error: `Minimum order of $${Number(promo.min_order_amount).toFixed(2)} required`,
      });
    }

    let discount = 0;

    if (promo.applies_to === 'all') {
      if (promo.type === 'percent_off') {
        discount = subtotal * (Number(promo.value) / 100);
      } else {
        discount = Math.min(Number(promo.value), subtotal);
      }
    } else {
      // specific_items — only discount qualifying items
      const promoItemIds = promo.item_ids || [];
      const matchingItemCount = item_ids.filter((id) => promoItemIds.includes(id)).length;
      if (matchingItemCount === 0) {
        return res.status(400).json({ error: 'This promo does not apply to any items in your cart' });
      }
      // For simplicity: apply discount to the whole subtotal proportionally
      // (front-end sends per-item breakdown if needed)
      if (promo.type === 'percent_off') {
        discount = subtotal * (Number(promo.value) / 100);
      } else {
        discount = Math.min(Number(promo.value), subtotal);
      }
    }

    discount = Math.round(discount * 100) / 100;

    res.json({
      valid: true,
      promo: {
        id: promo.id,
        code: promo.code,
        name: promo.name,
        type: promo.type,
        value: Number(promo.value),
        applies_to: promo.applies_to,
      },
      discount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply promo code' });
  }
});

module.exports = router;
