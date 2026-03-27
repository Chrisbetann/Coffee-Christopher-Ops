const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const PromotionSchema = z.object({
  code: z.string().min(1).max(50).transform((v) => v.toUpperCase()),
  name: z.string().min(1).max(150),
  description: z.string().optional(),
  type: z.enum(['percent_off', 'dollar_off']),
  value: z.number().positive(),
  applies_to: z.enum(['all', 'specific_items']).default('all'),
  item_ids: z.array(z.number().int().positive()).optional(),
  min_order_amount: z.number().min(0).optional(),
  active: z.boolean().default(true),
  expires_at: z.string().datetime().optional().nullable(),
});

// GET /api/admin/promotions
router.get('/', requireAuth, async (req, res) => {
  try {
    const promos = await prisma.promotion.findMany({ orderBy: { created_at: 'desc' } });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

// POST /api/admin/promotions
router.post('/', requireAuth, async (req, res) => {
  const parse = PromotionSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const { code, name, description, type, value, applies_to, item_ids, min_order_amount, active, expires_at } = parse.data;
  try {
    const existing = await prisma.promotion.findUnique({ where: { code } });
    if (existing) return res.status(409).json({ error: 'Promo code already exists' });

    const promo = await prisma.promotion.create({
      data: {
        code,
        name,
        description,
        type,
        value,
        applies_to,
        item_ids: item_ids ?? null,
        min_order_amount: min_order_amount ?? null,
        active,
        expires_at: expires_at ? new Date(expires_at) : null,
      },
    });
    res.status(201).json(promo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create promotion' });
  }
});

// PUT /api/admin/promotions/:id
router.put('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const parse = PromotionSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  try {
    const data = { ...parse.data };
    if (data.expires_at !== undefined) {
      data.expires_at = data.expires_at ? new Date(data.expires_at) : null;
    }
    const promo = await prisma.promotion.update({ where: { id }, data });
    res.json(promo);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Promotion not found' });
    console.error(err);
    res.status(500).json({ error: 'Failed to update promotion' });
  }
});

// PATCH /api/admin/promotions/:id/toggle
router.patch('/:id/toggle', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const promo = await prisma.promotion.findUnique({ where: { id } });
    if (!promo) return res.status(404).json({ error: 'Promotion not found' });
    const updated = await prisma.promotion.update({ where: { id }, data: { active: !promo.active } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle promotion' });
  }
});

// DELETE /api/admin/promotions/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.promotion.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Promotion not found' });
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
});

// GET /api/admin/promotions/customers  — list loyalty members
router.get('/customers', requireAuth, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { points: 'desc' },
      include: {
        _count: { select: { orders: true } },
      },
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

module.exports = router;
