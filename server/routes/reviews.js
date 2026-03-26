const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const ReviewSchema = z.object({
  order_id: z.number().int().positive(),
  item_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional().nullable(),
});

// GET /api/reviews/admin/all — all reviews for admin moderation
// NOTE: must be defined BEFORE /:itemId or Express will match 'admin' as itemId
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        item: { select: { name: true } },
        order: { select: { order_num: true } },
      },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// DELETE /api/reviews/admin/:id — admin deletes a review
// NOTE: must be defined BEFORE /:itemId
router.delete('/admin/:id', requireAuth, async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// POST /api/reviews — customer submits a review
router.post('/', async (req, res) => {
  const parse = ReviewSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  try {
    // Verify the order exists and is ready
    const order = await prisma.order.findUnique({
      where: { id: parse.data.order_id },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'ready') return res.status(400).json({ error: 'Can only review completed orders' });

    // Verify the item was part of the order
    const ordered = order.items.some((i) => i.item_id === parse.data.item_id);
    if (!ordered) return res.status(400).json({ error: 'Item was not part of this order' });

    // Prevent duplicate reviews for same order+item
    const existing = await prisma.review.findFirst({
      where: { order_id: parse.data.order_id, item_id: parse.data.item_id },
    });
    if (existing) return res.status(409).json({ error: 'Already reviewed this item for this order' });

    const review = await prisma.review.create({ data: parse.data });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// GET /api/reviews/:itemId — public reviews for a menu item
router.get('/:itemId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { item_id: parseInt(req.params.itemId) },
      orderBy: { created_at: 'desc' },
      take: 20,
      include: { order: { select: { order_num: true } } },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating: parseFloat(avgRating.toFixed(1)), count: reviews.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});


module.exports = router;
