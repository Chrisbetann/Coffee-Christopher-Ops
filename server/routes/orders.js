const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

// 1 point per $1 spent (rounded down)
const POINTS_PER_DOLLAR = 1;

const OrderItemSchema = z.object({
  item_id: z.number().int().positive(),
  quantity: z.number().int().min(1).max(10),
  unit_price: z.number().positive(),
  modifiers: z.record(z.any()).nullable().optional(),
});

const OrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  promo_code: z.string().max(50).optional().nullable(),
  customer_email: z.string().email().optional().nullable(),
});

function generateOrderNum() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// POST /api/orders
router.post('/', async (req, res) => {
  const parse = OrderSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const { items, subtotal, tax, discount, total, promo_code, customer_email } = parse.data;

  try {
    let order_num;
    let unique = false;
    while (!unique) {
      order_num = generateOrderNum();
      const existing = await prisma.order.findUnique({ where: { order_num } });
      if (!existing) unique = true;
    }

    // Resolve customer if email provided
    let customer = null;
    if (customer_email) {
      customer = await prisma.customer.findUnique({ where: { email: customer_email } });
    }

    // Validate promo code server-side if provided
    let verifiedDiscount = 0;
    let resolvedPromoCode = null;
    if (promo_code) {
      const promoCodeUpper = promo_code.toUpperCase();
      const promo = await prisma.promotion.findUnique({ where: { code: promoCodeUpper } });
      if (promo && promo.active && (!promo.expires_at || new Date() <= new Date(promo.expires_at))) {
        resolvedPromoCode = promoCodeUpper;
        if (promo.type === 'percent_off') {
          verifiedDiscount = subtotal * (Number(promo.value) / 100);
        } else {
          verifiedDiscount = Math.min(Number(promo.value), subtotal);
        }
        verifiedDiscount = Math.round(verifiedDiscount * 100) / 100;
      }
    }

    // Use the server-verified discount
    const finalDiscount = verifiedDiscount;
    const pointsEarned = customer ? Math.floor(Number(total) * POINTS_PER_DOLLAR) : 0;

    const order = await prisma.order.create({
      data: {
        order_num,
        subtotal,
        tax,
        discount: finalDiscount,
        total,
        promo_code: resolvedPromoCode,
        customer_id: customer?.id ?? null,
        loyalty_points_earned: pointsEarned,
        items: {
          create: items.map((i) => ({
            item_id: i.item_id,
            quantity: i.quantity,
            unit_price: i.unit_price,
            modifiers: i.modifiers ?? null,
          })),
        },
      },
      include: {
        items: {
          include: { item: { select: { name: true } } },
        },
      },
    });

    // Award loyalty points
    if (customer && pointsEarned > 0) {
      await prisma.$transaction([
        prisma.customer.update({
          where: { id: customer.id },
          data: { points: { increment: pointsEarned } },
        }),
        prisma.loyaltyTransaction.create({
          data: {
            customer_id: customer.id,
            order_id: order.id,
            points: pointsEarned,
            type: 'earned',
            description: `Earned from order #${order.order_num}`,
          },
        }),
      ]);
    }

    res.status(201).json({
      ...order,
      loyalty_points_earned: pointsEarned,
      customer_name: customer?.name ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders/:id  (for status polling)
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          include: { item: { select: { name: true } } },
        },
      },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
