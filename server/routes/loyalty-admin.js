const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { sendPromoEmail } = require('../utils/email');

const router = express.Router();
const prisma = new PrismaClient();

const MemberSchema = z.object({
  email: z.string().email().max(150),
  name: z.string().min(1).max(150),
  phone: z.string().max(30).optional().nullable(),
  points: z.number().int().min(0).optional(),
});

// GET /api/admin/loyalty  — list all members with search
router.get('/', requireAuth, async (req, res) => {
  const { search } = req.query;
  try {
    const members = await prisma.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { created_at: 'desc' },
      include: {
        _count: { select: { orders: true } },
      },
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// POST /api/admin/loyalty  — manually add a member
router.post('/', requireAuth, async (req, res) => {
  const parse = MemberSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const { email, name, phone, points } = parse.data;
  try {
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'A member with this email already exists' });

    const member = await prisma.customer.create({
      data: { email, name, phone: phone ?? null, points: points ?? 0 },
    });
    res.status(201).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// PUT /api/admin/loyalty/:id  — update member
router.put('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const parse = MemberSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  try {
    const member = await prisma.customer.update({
      where: { id },
      data: parse.data,
    });
    res.json(member);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Member not found' });
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// DELETE /api/admin/loyalty/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.customer.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Member not found' });
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

// POST /api/admin/loyalty/send-promo  — email a promotion to selected members
router.post('/send-promo', requireAuth, async (req, res) => {
  const schema = z.object({
    customer_ids: z.array(z.number().int().positive()).min(1),
    promotion_id: z.number().int().positive(),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const { customer_ids, promotion_id } = parse.data;
  try {
    const [customers, promo] = await Promise.all([
      prisma.customer.findMany({ where: { id: { in: customer_ids } } }),
      prisma.promotion.findUnique({ where: { id: promotion_id } }),
    ]);

    if (!promo) return res.status(404).json({ error: 'Promotion not found' });

    const results = await Promise.allSettled(
      customers.map((c) => sendPromoEmail(c, promo))
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    const errors = results
      .filter((r) => r.status === 'rejected')
      .map((r, i) => ({ customer: customers[i]?.email, error: r.reason?.message }));

    res.json({ sent, failed, errors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to send emails' });
  }
});

module.exports = router;
