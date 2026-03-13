const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

function periodBounds(period, dateStr) {
  const base = dateStr ? new Date(dateStr) : new Date();
  let start, end;

  if (period === 'day') {
    start = new Date(base); start.setHours(0, 0, 0, 0);
    end   = new Date(base); end.setHours(23, 59, 59, 999);
  } else if (period === 'week') {
    const day = base.getDay(); // 0=Sun
    start = new Date(base); start.setDate(base.getDate() - day); start.setHours(0, 0, 0, 0);
    end   = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
  } else if (period === 'month') {
    start = new Date(base.getFullYear(), base.getMonth(), 1);
    end   = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
  } else { // year
    start = new Date(base.getFullYear(), 0, 1);
    end   = new Date(base.getFullYear(), 11, 31, 23, 59, 59, 999);
  }
  return { start, end };
}

// GET /api/dashboard/summary?period=day|week|month|year&date=YYYY-MM-DD
router.get('/summary', requireAuth, async (req, res) => {
  const { period = 'day', date } = req.query;
  const { start, end } = periodBounds(period, date);

  try {
    const orders = await prisma.order.findMany({
      where: { created_at: { gte: start, lte: end } },
    });

    const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const orderCount = orders.length;

    // Low stock count for dashboard widget
    const ingredients = await prisma.ingredient.findMany();
    const lowStockCount = ingredients.filter((i) => Number(i.count) < Number(i.par_level)).length;

    // Pending orders (sent or preparing)
    const pendingOrders = await prisma.order.count({
      where: { status: { in: ['sent', 'preparing'] } },
    });

    res.json({ revenue: parseFloat(revenue.toFixed(2)), orderCount, lowStockCount, pendingOrders, period, start, end });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// GET /api/dashboard/sales?period=day|week|month|year&date=YYYY-MM-DD
// Returns breakdown data points for charting
router.get('/sales', requireAuth, async (req, res) => {
  const { period = 'week', date } = req.query;
  const { start, end } = periodBounds(period, date);

  try {
    const orders = await prisma.order.findMany({
      where: { created_at: { gte: start, lte: end } },
      orderBy: { created_at: 'asc' },
    });

    // Group by day for week, by week for month, by month for year, by hour for day
    const buckets = {};

    for (const order of orders) {
      let key;
      const d = new Date(order.created_at);
      if (period === 'day')   key = `${d.getHours()}:00`;
      else if (period === 'week')  key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      else if (period === 'month') key = `Week ${Math.ceil(d.getDate() / 7)}`;
      else                         key = d.toLocaleDateString('en-US', { month: 'short' });

      if (!buckets[key]) buckets[key] = { label: key, revenue: 0, orders: 0 };
      buckets[key].revenue += Number(order.total);
      buckets[key].orders  += 1;
    }

    const data = Object.values(buckets).map((b) => ({ ...b, revenue: parseFloat(b.revenue.toFixed(2)) }));
    res.json({ data, period, start, end });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

// GET /api/dashboard/top-items?period=day|week|month|year&date=YYYY-MM-DD
router.get('/top-items', requireAuth, async (req, res) => {
  const { period = 'week', date } = req.query;
  const { start, end } = periodBounds(period, date);

  try {
    const orderItems = await prisma.orderItem.findMany({
      where: { order: { created_at: { gte: start, lte: end } } },
      include: { item: { select: { name: true } } },
    });

    const totals = {};
    for (const oi of orderItems) {
      const name = oi.item.name;
      if (!totals[name]) totals[name] = { name, qty: 0, revenue: 0 };
      totals[name].qty     += oi.quantity;
      totals[name].revenue += Number(oi.unit_price) * oi.quantity;
    }

    const top5 = Object.values(totals)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
      .map((t) => ({ ...t, revenue: parseFloat(t.revenue.toFixed(2)) }));

    res.json(top5);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top items' });
  }
});

// GET /api/dashboard/volume?period=week&date=YYYY-MM-DD
router.get('/volume', requireAuth, async (req, res) => {
  const { period = 'week', date } = req.query;
  const { start, end } = periodBounds(period, date);

  try {
    const orders = await prisma.order.findMany({
      where: { created_at: { gte: start, lte: end } },
      select: { created_at: true },
      orderBy: { created_at: 'asc' },
    });

    const buckets = {};
    for (const order of orders) {
      const d = new Date(order.created_at);
      let key;
      if (period === 'day')        key = `${d.getHours()}:00`;
      else if (period === 'week')  key = d.toLocaleDateString('en-US', { weekday: 'short' });
      else if (period === 'month') key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      else                         key = d.toLocaleDateString('en-US', { month: 'short' });

      buckets[key] = (buckets[key] || 0) + 1;
    }

    const data = Object.entries(buckets).map(([label, count]) => ({ label, count }));
    res.json({ data, period });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volume data' });
  }
});

module.exports = router;
