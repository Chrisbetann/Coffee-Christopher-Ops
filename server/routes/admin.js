const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// ── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── Orders ───────────────────────────────────────────────────────────────────

// GET /api/admin/orders
router.get('/orders', requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        items: {
          include: { item: { select: { name: true } } },
        },
      },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;
  if (!['sent', 'preparing', 'ready'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ── Categories ───────────────────────────────────────────────────────────────

router.get('/categories', requireAuth, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { sort_order: 'asc' } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/categories', requireAuth, async (req, res) => {
  const { name, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  try {
    const category = await prisma.category.create({ data: { name, sort_order: sort_order || 0 } });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/categories/:id', requireAuth, async (req, res) => {
  const { name, sort_order } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, sort_order },
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/categories/:id', requireAuth, async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ── Menu Items ───────────────────────────────────────────────────────────────

const ItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().positive(),
  category_id: z.number().int().positive(),
  available: z.boolean().optional(),
  image_url: z.string().optional().nullable(),
});

// GET /api/admin/menu/items — all items (including unavailable)
router.get('/menu/items', requireAuth, async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      include: { modifiers: true, category: true },
      orderBy: [{ category_id: 'asc' }, { name: 'asc' }],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /api/admin/menu/items
router.post('/menu/items', requireAuth, async (req, res) => {
  const parse = ItemSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  try {
    const item = await prisma.menuItem.create({ data: parse.data, include: { category: true } });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/admin/menu/items/:id
router.put('/menu/items/:id', requireAuth, async (req, res) => {
  const parse = ItemSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  try {
    const item = await prisma.menuItem.update({
      where: { id: parseInt(req.params.id) },
      data: parse.data,
      include: { category: true, modifiers: true },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/admin/menu/items/:id
router.delete('/menu/items/:id', requireAuth, async (req, res) => {
  try {
    await prisma.menuItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// PATCH /api/admin/menu/items/:id/toggle — toggle availability
router.patch('/menu/items/:id/toggle', requireAuth, async (req, res) => {
  try {
    const current = await prisma.menuItem.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!current) return res.status(404).json({ error: 'Item not found' });

    const item = await prisma.menuItem.update({
      where: { id: parseInt(req.params.id) },
      data: { available: !current.available },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle item' });
  }
});

module.exports = router;
