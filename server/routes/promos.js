const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const mailer = require('../mailer');

const router = express.Router();
const prisma = new PrismaClient();

const PromoSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  discount_type: z.enum(['percent', 'amount', 'item']),
  discount_value: z.number().nonnegative(),
  item_name: z.string().max(100).optional().nullable(),
});

// All promo routes require admin auth
router.use(requireAuth);

// GET /api/promos — list all promos
router.get('/', async (req, res) => {
  try {
    const promos = await prisma.promo.findMany({
      orderBy: { created_at: 'desc' },
      include: { _count: { select: { sends: true } } },
    });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch promos' });
  }
});

// POST /api/promos — create a promo
router.post('/', async (req, res) => {
  const parse = PromoSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  try {
    const promo = await prisma.promo.create({ data: parse.data });
    res.status(201).json(promo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create promo' });
  }
});

// PATCH /api/promos/:id — toggle active state or update fields
router.patch('/:id', async (req, res) => {
  try {
    const promo = await prisma.promo.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(promo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update promo' });
  }
});

// DELETE /api/promos/:id — delete a promo
router.delete('/:id', async (req, res) => {
  try {
    await prisma.promo.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Promo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete promo' });
  }
});

// GET /api/promos/:id/recipients — customer list with send-tracking
// Ensures a PromoSend row exists for every active customer so the admin
// UI can show a checklist even before any sends have happened.
router.get('/:id/recipients', async (req, res) => {
  const promoId = parseInt(req.params.id);
  try {
    const [customers, existingSends] = await Promise.all([
      prisma.customer.findMany({ orderBy: { first_name: 'asc' } }),
      prisma.promoSend.findMany({ where: { promo_id: promoId } }),
    ]);

    const sendsByCustomer = new Map(existingSends.map((s) => [s.customer_id, s]));

    const recipients = customers.map((c) => {
      const send = sendsByCustomer.get(c.id);
      return {
        customer: c,
        email_sent: send?.email_sent || false,
        sms_sent: send?.sms_sent || false,
        sent_at: send?.sent_at || null,
      };
    });

    res.json(recipients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipients' });
  }
});

// PATCH /api/promos/:id/recipients/:customerId — mark email or SMS as sent
router.patch('/:id/recipients/:customerId', async (req, res) => {
  const promo_id = parseInt(req.params.id);
  const customer_id = parseInt(req.params.customerId);
  const { email_sent, sms_sent } = req.body;

  try {
    const existing = await prisma.promoSend.findUnique({
      where: { promo_id_customer_id: { promo_id, customer_id } },
    });

    const data = {
      email_sent: email_sent ?? existing?.email_sent ?? false,
      sms_sent: sms_sent ?? existing?.sms_sent ?? false,
      sent_at: new Date(),
    };

    const updated = existing
      ? await prisma.promoSend.update({
          where: { promo_id_customer_id: { promo_id, customer_id } },
          data,
        })
      : await prisma.promoSend.create({
          data: { promo_id, customer_id, ...data },
        });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update send status' });
  }
});

// POST /api/promos/:id/recipients/:customerId/email — send promo email via SMTP
router.post('/:id/recipients/:customerId/email', async (req, res) => {
  const promoId = parseInt(req.params.id);
  const customerId = parseInt(req.params.customerId);

  try {
    const [promo, customer] = await Promise.all([
      prisma.promo.findUnique({ where: { id: promoId } }),
      prisma.customer.findUnique({ where: { id: customerId } }),
    ]);

    if (!promo || !customer) return res.status(404).json({ error: 'Not found' });

    const v = Number(promo.discount_value);
    const offer =
      promo.discount_type === 'percent' ? `${v}% off`
      : promo.discount_type === 'amount' ? `$${v.toFixed(2)} off`
      : `$${v.toFixed(2)} off ${promo.item_name || 'item'}`;

    await mailer.sendMail({
      from: `"Coffee Christopher" <${process.env.SMTP_USER}>`,
      to: customer.email,
      subject: `☕ ${promo.title} — just for you, ${customer.first_name}!`,
      text: `Hey ${customer.first_name},\n\n${promo.description || `Here's a special offer: ${offer}`}\n\nShow this email (or your loyalty card) at the counter to redeem.\n\n— Coffee Christopher`,
    });

    // Auto-mark email as sent
    const existing = await prisma.promoSend.findUnique({
      where: { promo_id_customer_id: { promo_id: promoId, customer_id: customerId } },
    });
    const updated = existing
      ? await prisma.promoSend.update({
          where: { promo_id_customer_id: { promo_id: promoId, customer_id: customerId } },
          data: { email_sent: true, sent_at: new Date() },
        })
      : await prisma.promoSend.create({
          data: { promo_id: promoId, customer_id: customerId, email_sent: true, sms_sent: false, sent_at: new Date() },
        });

    res.json({ sent: true, email_sent: updated.email_sent, sms_sent: updated.sms_sent, sent_at: updated.sent_at });
  } catch (err) {
    console.error('POST /promos email failed:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
