const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

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
  total: z.number().positive(),
});

function generateOrderNum() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// POST /api/orders
router.post('/', async (req, res) => {
  const parse = OrderSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const { items, subtotal, tax, total } = parse.data;

  try {
    let order_num;
    let unique = false;
    while (!unique) {
      order_num = generateOrderNum();
      const existing = await prisma.order.findUnique({ where: { order_num } });
      if (!existing) unique = true;
    }

    const order = await prisma.order.create({
      data: {
        order_num,
        subtotal,
        tax,
        total,
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
    res.status(201).json(order);
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
