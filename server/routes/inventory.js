const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const IngredientSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  count: z.number().min(0),
  par_level: z.number().positive(),
  supplier: z.string().optional().nullable(),
  supplier_contact: z.string().optional().nullable(),
  cost_per_unit: z.number().positive().optional().nullable(),
});

// GET /api/inventory — all ingredients with low-stock flag
router.get('/', requireAuth, async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
    const result = ingredients.map((i) => ({
      ...i,
      low_stock: Number(i.count) < Number(i.par_level),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// GET /api/inventory/alerts — only low-stock items
router.get('/alerts', requireAuth, async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
    const alerts = ingredients
      .filter((i) => Number(i.count) < Number(i.par_level))
      .map((i) => ({ ...i, low_stock: true }));
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// GET /api/inventory/:id/log — audit log for an ingredient
router.get('/:id/log', requireAuth, async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { ingredient_id: parseInt(req.params.id) },
      orderBy: { changed_at: 'desc' },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

// POST /api/inventory
router.post('/', requireAuth, async (req, res) => {
  const parse = IngredientSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  try {
    const ingredient = await prisma.ingredient.create({ data: parse.data });
    res.status(201).json({ ...ingredient, low_stock: Number(ingredient.count) < Number(ingredient.par_level) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

// PUT /api/inventory/:id
router.put('/:id', requireAuth, async (req, res) => {
  const parse = IngredientSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const id = parseInt(req.params.id);
  try {
    const current = await prisma.ingredient.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Ingredient not found' });

    const updated = await prisma.ingredient.update({ where: { id }, data: parse.data });

    // If count changed, write audit log
    if (parse.data.count !== undefined && Number(parse.data.count) !== Number(current.count)) {
      await prisma.auditLog.create({
        data: {
          ingredient_id: id,
          old_count: current.count,
          new_count: parse.data.count,
          changed_by: req.admin.email,
        },
      });
    }

    res.json({ ...updated, low_stock: Number(updated.count) < Number(updated.par_level) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

// DELETE /api/inventory/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.ingredient.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Ingredient deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

module.exports = router;
