const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Categories ──────────────────────────────────────────────
  const [coffeeCat, refresherCat, energyCat, breakfastCat, hotFoodCat, drinksCat, combosCat] =
    await Promise.all([
      prisma.category.upsert({ where: { id: 1 }, update: {}, create: { name: 'Coffee & Core Drinks', sort_order: 1 } }),
      prisma.category.upsert({ where: { id: 2 }, update: {}, create: { name: 'Refreshers', sort_order: 2 } }),
      prisma.category.upsert({ where: { id: 3 }, update: {}, create: { name: 'Energy Drinks', sort_order: 3 } }),
      prisma.category.upsert({ where: { id: 4 }, update: {}, create: { name: 'Breakfast Items', sort_order: 4 } }),
      prisma.category.upsert({ where: { id: 5 }, update: {}, create: { name: 'Hot Food', sort_order: 5 } }),
      prisma.category.upsert({ where: { id: 6 }, update: {}, create: { name: 'Drinks', sort_order: 6 } }),
      prisma.category.upsert({ where: { id: 7 }, update: {}, create: { name: 'Combos', sort_order: 7 } }),
    ]);

  // ── Coffee modifiers (reused for all coffee & hot choc items) ──
  const coffeeModifiers = [
    { name: 'Milk', options: ['Oat', 'Whole', 'Almond', 'Coconut'] },
    { name: 'Sweetener', options: ['None', 'Raw Sugar', 'Splenda'] },
    { name: 'Extras', options: ['Extra Shot', 'Whipped Cream'] },
  ];

  const hotChocModifiers = [
    { name: 'Milk', options: ['Oat', 'Whole', 'Almond', 'Coconut'] },
    { name: 'Sweetener', options: ['None', 'Raw Sugar', 'Splenda'] },
    { name: 'Extras', options: ['Whipped Cream'] },
  ];

  async function createItem(data, modifiers = []) {
    const item = await prisma.menuItem.create({ data });
    for (const mod of modifiers) {
      await prisma.modifier.create({ data: { item_id: item.id, ...mod } });
    }
    return item;
  }

  // ── Coffee & Core Drinks ─────────────────────────────────────
  const coffeeItems = [
    { name: 'Hot Coffee',       description: 'Classic hot brewed coffee', price: 6.00 },
    { name: 'Iced Coffee',      description: 'Chilled brewed coffee over ice', price: 6.00 },
    { name: 'Classic Latte',    description: 'Espresso with steamed milk — hot or iced', price: 6.00 },
    { name: 'Shaken Espresso',  description: 'Espresso shaken over ice', price: 6.00 },
    { name: 'Espresso Shots',   description: 'Single or double espresso shots', price: 6.00 },
    { name: 'Americano',        description: 'Espresso with hot water', price: 6.00 },
    { name: 'Cappuccino',       description: 'Espresso with steamed and frothed milk', price: 6.00 },
  ];

  for (const item of coffeeItems) {
    await createItem({ category_id: coffeeCat.id, available: true, ...item }, coffeeModifiers);
  }

  await createItem(
    { category_id: coffeeCat.id, name: 'Hot Chocolate', description: 'Rich creamy hot chocolate', price: 6.00, available: true },
    hotChocModifiers
  );

  // ── Refreshers ───────────────────────────────────────────────
  const refresherItems = [
    { name: 'Dragon Burst Refresher',   description: 'Dragon fruit refresher with a burst of flavor', price: 6.00 },
    { name: 'Strawberry Spark Refresher', description: 'Bright strawberry refresher', price: 6.00 },
    { name: 'Coconut Pink Drink',       description: 'Creamy coconut milk pink drink', price: 6.00 },
  ];
  for (const item of refresherItems) {
    await createItem({ category_id: refresherCat.id, available: true, ...item });
  }

  // ── Energy Drinks ────────────────────────────────────────────
  const energyItems = [
    { name: 'Dragon Burst Energy',    description: 'Energy drink with dragon fruit flavor', price: 6.00 },
    { name: 'Strawberry Spark Energy', description: 'Strawberry flavored energy drink', price: 6.00 },
    { name: 'Berry Bliss Energy',     description: 'Mixed berry energy drink', price: 6.00 },
  ];
  for (const item of energyItems) {
    await createItem({ category_id: energyCat.id, available: true, ...item });
  }

  // ── Breakfast Items ──────────────────────────────────────────
  await createItem({ category_id: breakfastCat.id, name: 'Croissant',            description: 'Buttery flaky croissant',           price: 3.00, available: true });
  await createItem({ category_id: breakfastCat.id, name: 'Blueberry Muffin',     description: 'Fresh-baked blueberry muffin',      price: 4.00, available: true });
  await createItem({ category_id: breakfastCat.id, name: 'Chocolate Muffin',     description: 'Rich chocolate chip muffin',         price: 4.00, available: true });
  await createItem({ category_id: breakfastCat.id, name: 'Breakfast Sandwich',   description: 'Egg and cheese breakfast sandwich',  price: 5.00, available: true });

  // ── Hot Food ─────────────────────────────────────────────────
  await createItem({ category_id: hotFoodCat.id, name: 'Fries',             description: 'Hot crispy fries',                  price: 5.00, available: true });
  await createItem({ category_id: hotFoodCat.id, name: 'Pizza',             description: 'Slice or personal pizza',            price: 6.00, available: true });
  await createItem({ category_id: hotFoodCat.id, name: 'Hot Dog',           description: 'Classic hot dog',                   price: 5.00, available: true });
  await createItem({ category_id: hotFoodCat.id, name: 'Chicken Nuggets',   description: 'Crispy chicken nuggets',             price: 6.00, available: true });
  await createItem({ category_id: hotFoodCat.id, name: 'Quesadilla',        description: 'Grilled cheese quesadilla',          price: 6.00, available: true });
  await createItem({ category_id: hotFoodCat.id, name: 'Mozzarella Sticks', description: 'Fried mozzarella sticks',            price: 6.00, available: true });

  // ── Drinks ───────────────────────────────────────────────────
  await createItem({ category_id: drinksCat.id, name: 'Corona',  description: 'Ice cold Corona beer',   price: 5.50, available: true });
  await createItem({ category_id: drinksCat.id, name: 'Seltzer', description: 'Sparkling seltzer water', price: 5.50, available: true });

  // ── Combos ───────────────────────────────────────────────────
  await createItem({ category_id: combosCat.id, name: 'Chicken Nuggets + Fries Combo',     description: 'Chicken nuggets with a side of fries',           price: 10.00, available: true });
  await createItem({ category_id: combosCat.id, name: 'Pizza + Drink Combo',               description: 'Pizza slice or personal with a drink',           price: 10.00, available: true });
  await createItem({ category_id: combosCat.id, name: 'Hot Dog + Fries Combo',             description: 'Hot dog with a side of fries',                   price: 9.00,  available: true });
  await createItem({ category_id: combosCat.id, name: 'Breakfast Sandwich + Coffee Combo', description: 'Breakfast sandwich paired with any coffee',       price: 9.00,  available: true });
  await createItem({ category_id: combosCat.id, name: 'Croissant + Coffee Combo',          description: 'Buttery croissant with any coffee',              price: 8.00,  available: true });
  await createItem({ category_id: combosCat.id, name: 'Muffin + Coffee Combo',             description: 'Your choice of muffin with any coffee',          price: 9.00,  available: true });

  // ── Ingredients ──────────────────────────────────────────────
  const ingredients = [
    { name: 'Whole Milk',          unit: 'gallon', count: 6,  par_level: 4,  supplier: 'Local Dairy',       supplier_contact: 'localdairy@email.com',   cost_per_unit: 5.50 },
    { name: 'Oat Milk',            unit: 'gallon', count: 3,  par_level: 4,  supplier: 'Sysco',             supplier_contact: 'orders@sysco.com',       cost_per_unit: 8.00 },
    { name: 'Almond Milk',         unit: 'gallon', count: 2,  par_level: 3,  supplier: 'Sysco',             supplier_contact: 'orders@sysco.com',       cost_per_unit: 7.50 },
    { name: 'Coconut Milk',        unit: 'gallon', count: 2,  par_level: 3,  supplier: 'Sysco',             supplier_contact: 'orders@sysco.com',       cost_per_unit: 7.00 },
    { name: 'Espresso Beans',      unit: 'lb',     count: 8,  par_level: 4,  supplier: 'Bean Co.',          supplier_contact: 'supply@beanco.com',      cost_per_unit: 14.00 },
    { name: 'Vanilla Syrup',       unit: 'bottle', count: 2,  par_level: 3,  supplier: 'WebstaurantStore',  supplier_contact: 'orders@webstaurant.com', cost_per_unit: 9.00 },
    { name: 'Chocolate Sauce',     unit: 'bottle', count: 3,  par_level: 2,  supplier: 'WebstaurantStore',  supplier_contact: 'orders@webstaurant.com', cost_per_unit: 8.00 },
    { name: 'Croissants',          unit: 'unit',   count: 15, par_level: 10, supplier: 'Local Bakery',      supplier_contact: 'bakery@email.com',       cost_per_unit: 1.50 },
    { name: 'Blueberry Muffins',   unit: 'unit',   count: 10, par_level: 8,  supplier: 'Local Bakery',      supplier_contact: 'bakery@email.com',       cost_per_unit: 2.00 },
    { name: 'Chocolate Muffins',   unit: 'unit',   count: 10, par_level: 8,  supplier: 'Local Bakery',      supplier_contact: 'bakery@email.com',       cost_per_unit: 2.00 },
    { name: 'Fries',               unit: 'lb',     count: 12, par_level: 8,  supplier: 'Sysco',             supplier_contact: 'orders@sysco.com',       cost_per_unit: 2.50 },
    { name: 'Hot Dogs',            unit: 'unit',   count: 20, par_level: 10, supplier: 'Sysco',             supplier_contact: 'orders@sysco.com',       cost_per_unit: 0.75 },
    { name: 'Chicken Nuggets',     unit: 'lb',     count: 8,  par_level: 5,  supplier: 'Sysco',             supplier_contact: 'orders@sysco.com',       cost_per_unit: 4.00 },
    { name: 'Mozzarella Sticks',   unit: 'unit',   count: 30, par_level: 20, supplier: 'Sysco',             supplier_contact: 'orders@sysco.com',       cost_per_unit: 0.50 },
    { name: 'Tortillas',           unit: 'pack',   count: 5,  par_level: 3,  supplier: 'Sysco',             supplier_contact: 'orders@sysco.com',       cost_per_unit: 3.00 },
    { name: 'Pizza',               unit: 'unit',   count: 12, par_level: 8,  supplier: 'Local Bakery',      supplier_contact: 'bakery@email.com',       cost_per_unit: 3.00 },
    { name: 'Breakfast Sandwiches',unit: 'unit',   count: 10, par_level: 6,  supplier: 'Local Bakery',      supplier_contact: 'bakery@email.com',       cost_per_unit: 2.50 },
    { name: 'Coronas',             unit: 'unit',   count: 24, par_level: 12, supplier: 'Beverage Dist.',    supplier_contact: 'bev@email.com',          cost_per_unit: 1.50 },
    { name: 'Seltzers',            unit: 'unit',   count: 24, par_level: 12, supplier: 'Beverage Dist.',    supplier_contact: 'bev@email.com',          cost_per_unit: 1.00 },
  ];

  for (const ingredient of ingredients) {
    await prisma.ingredient.create({ data: ingredient });
  }

  // ── Admin ────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Benji14141!', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@coffeechristopher.com' },
    update: {},
    create: { email: 'admin@coffeechristopher.com', password_hash: passwordHash },
  });

  console.log('Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
