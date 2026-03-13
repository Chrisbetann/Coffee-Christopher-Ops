# Coffee Christopher Ops Suite
## Sprint Deliverables: Week 9 — Week 13
**Author:** Christopher Betancourt
**Course:** CSIS 4903 - Capstone Project for Computer Science
**Institution:** Nova Southeastern University

---

## Week 9 — Customer Module: Dynamic Menu + Item Detail Pages
**Date:** 03/05/2026
**Status:** ✅ Complete

### What Was Built
A fully dynamic customer-facing menu that loads all categories and items directly from the PostgreSQL database. Customers can browse by category, view item details, and see all customization options.

### Features Delivered
| Feature | Status | Acceptance Criteria Met |
|---------|--------|------------------------|
| QR Code Access | ✅ | Menu opens at `/menu` — QR points here |
| Menu Browsing by Category | ✅ | AC-1.2 — Category pills filter items in real time |
| Item Detail Page | ✅ | AC-1.3 — Name, description, price, and options displayed |
| Item Customization | ✅ | AC-1.4 — Milk, Sweetener, and Extras selectable |

### Technical Implementation
- **Frontend:** `MenuHome.jsx` — category pills, item grid, floating cart button
- **Frontend:** `ItemDetail.jsx` — modifier selection (single-select + multi-select), quantity picker
- **Backend:** `GET /api/menu/categories` — returns all 7 categories ordered by sort_order
- **Backend:** `GET /api/menu/items` — returns all available items with modifiers
- **Backend:** `GET /api/menu/items/:id` — single item with full modifier data
- **Database:** `categories`, `menu_items`, `modifiers` tables seeded with full Coffee Christopher menu

### Seed Data Summary
| Category | Items |
|----------|-------|
| Coffee & Core Drinks | Hot Coffee, Iced Coffee, Classic Latte, Shaken Espresso, Espresso Shots, Americano, Cappuccino, Hot Chocolate |
| Refreshers | Dragon Burst Refresher, Strawberry Spark Refresher, Coconut Pink Drink |
| Energy Drinks | Dragon Burst Energy, Strawberry Spark Energy, Berry Bliss Energy |
| Breakfast Items | Croissant, Blueberry Muffin, Chocolate Muffin, Breakfast Sandwich |
| Hot Food | Fries, Pizza, Hot Dog, Chicken Nuggets, Quesadilla, Mozzarella Sticks |
| Drinks | Corona, Seltzer |
| Combos | 6 combo meals |

### Modifier Options (Coffee & Hot Chocolate)
- **Milk:** Oat, Whole, Almond, Coconut (no added price)
- **Sweetener:** None, Raw Sugar, Splenda
- **Extras:** Extra Shot, Whipped Cream (multi-select)

---

## Week 10 — Ordering: Cart + Submit Order + Admin Order Queue
**Date:** 03/12/2026
**Status:** ✅ Complete — **Release 1 (MVP Ordering)**

### What Was Built
Complete end-to-end ordering flow: customer adds items to cart, submits order, receives a unique order number, and tracks status in real time. Admin can view all incoming orders and advance them through the workflow.

### Features Delivered
| Feature | Status | Acceptance Criteria Met |
|---------|--------|------------------------|
| Cart Management | ✅ | AC-1.5 — Add, adjust qty (1–10), remove items |
| Order Submission | ✅ | AC-1.6 — Order placed, confirmation shown, appears in admin queue |
| Order Status View | ✅ | AC-1.7 — Updates within 5 seconds via 5s polling |
| Admin Order Queue | ✅ | Admin sees all orders with modifier details |
| Status Advancement | ✅ | Admin advances: Sent → Preparing → Ready |

### Technical Implementation
- **Frontend:** `Cart.jsx` — line items with qty controls, subtotal/tax/total, place order button
- **Frontend:** `OrderConfirmation.jsx` — order number display, items summary
- **Frontend:** `OrderStatus.jsx` — 3-step progress bar, 5-second polling (per Risk R-03 mitigation)
- **Frontend:** `OrderQueue.jsx` — live order table, polls every 5 seconds, advance buttons
- **Backend:** `POST /api/orders` — creates order with unique 6-character order number
- **Backend:** `GET /api/orders/:id` — customer polls this for status updates
- **Backend:** `GET /api/admin/orders` — admin fetches all orders
- **Backend:** `PATCH /api/admin/orders/:id/status` — admin updates status
- **Database:** `orders` and `order_items` tables with JSON modifier storage

### Order Flow
```
Customer: Customize → Add to Cart → Place Order → See Confirmation
Admin:    Order Queue → Mark Preparing → Mark Ready
Customer: Status page auto-updates Sent → Preparing → Ready ✅
```

### Tax Calculation
- Tax rate: 7%
- Subtotal, tax, and total stored per order for accurate reporting

---

## Week 11 — Admin: Menu CRUD + Availability/Sold-Out Toggles
**Date:** 03/19/2026
**Status:** ✅ Complete

### What Was Built
Full admin menu management interface. Admins can create, edit, delete, and toggle the availability of any menu item. Changes reflect on the customer menu immediately.

### Features Delivered
| Feature | Status | Acceptance Criteria Met |
|---------|--------|------------------------|
| Create Menu Item | ✅ | AC-2.1 — Name, description, price, category required |
| Read All Items | ✅ | AC-2.2 — Table shows name, price, category, status |
| Edit Menu Item | ✅ | AC-2.3 — All fields editable, saves successfully |
| Delete Menu Item | ✅ | AC-2.4 — Item removed from customer menu |
| Availability Toggle | ✅ | AC-2.6 — Sold-out items visible but not orderable |
| Live Publishing | ✅ | AC-2.7 — Changes reflect immediately on customer menu |

### Technical Implementation
- **Frontend:** `MenuManagement.jsx` — searchable/filterable table, modal form for add/edit
- **Backend:** `POST /api/admin/menu/items` — create with Zod validation
- **Backend:** `PUT /api/admin/menu/items/:id` — update any fields
- **Backend:** `DELETE /api/admin/menu/items/:id` — hard delete
- **Backend:** `PATCH /api/admin/menu/items/:id/toggle` — flips available boolean
- **Auth:** All admin routes protected by JWT middleware

### Admin Workflow (Timed Test)
- Add new item: < 2 minutes ✅ (satisfies success criteria)
- Toggle sold-out: < 5 seconds ✅

---

## Week 12 — Sales Dashboard: Daily/Weekly Totals + Top Items
**Date:** 03/26/2026
**Status:** ✅ Complete — **Release 2 (Analytics)**

### What Was Built
A full sales analytics dashboard with period selectors, revenue charts, top-selling items, and order volume trends. Supports day, week, month, and year views.

### Features Delivered
| Feature | Status | Acceptance Criteria Met |
|---------|--------|------------------------|
| Daily Sales Totals | ✅ | AC-3.1 — Revenue + order count, defaults to today |
| Weekly Sales Totals | ✅ | AC-3.2 — Revenue + order count with daily breakdown |
| Monthly Sales Totals | ✅ | AC-3.3 — Weekly breakdown |
| Yearly Sales Totals | ✅ | AC-3.4 — Monthly breakdown |
| Top-Selling Items | ✅ | AC-3.5 — Top 5 by quantity sold and revenue |
| Order Volume Trends | ✅ | AC-3.6 — Line chart showing order counts over time |
| Visual Reports | ✅ | AC-3.7 — Bar chart + Line chart + Pie chart (3 types) |

### Technical Implementation
- **Frontend:** `SalesDashboard.jsx` — period selector tabs, KPI cards, Recharts visualizations
- **Charts:** Bar chart (revenue trend), Line chart (order volume), Pie chart (top 5 items)
- **Backend:** `GET /api/dashboard/summary` — revenue, order count, low stock count, pending orders
- **Backend:** `GET /api/dashboard/sales` — bucketed revenue data for charting
- **Backend:** `GET /api/dashboard/top-items` — top 5 items by quantity/revenue
- **Backend:** `GET /api/dashboard/volume` — order count buckets for line chart
- **Library:** Recharts (React-native charting library)

### Dashboard KPI Cards
| Card | Data Source |
|------|------------|
| Period Revenue | Sum of order totals in period |
| Period Orders | Count of orders in period |
| Low Stock Alerts | Ingredients below par level |
| Pending Orders | Orders in sent/preparing status |

---

## Week 13 — Inventory: Ingredients + Thresholds + Low-Stock Alerts
**Date:** 04/02/2026
**Status:** ✅ Complete — **Release 3 (Inventory + Stability)**

### What Was Built
Complete inventory tracking module with 19 pre-seeded ingredients, configurable par levels, automatic low-stock alerts, and a full audit log for every count change.

### Features Delivered
| Feature | Status | Acceptance Criteria Met |
|---------|--------|------------------------|
| Ingredient List | ✅ | AC-4.1 — 19 ingredients with name, unit, count, par level |
| Par Levels | ✅ | AC-4.2 — Editable per ingredient, positive numbers required |
| Low-Stock Alerts | ✅ | AC-4.3 — Alert triggers when count < par, shows name/count/par |
| Manual Count Entry | ✅ | AC-4.4 — Accepts whole numbers and decimals |
| Supplier Linking | ✅ | AC-4.5 — Supplier name, contact, and cost per unit stored |
| Audit Logging | ✅ | AC-4.6 — Every count change logs timestamp, user, old/new count |

### Technical Implementation
- **Frontend:** `InventoryTracking.jsx` — ingredient table with red highlighting for low stock, edit modal, audit log modal
- **Backend:** `GET /api/inventory` — all ingredients with computed `low_stock` boolean
- **Backend:** `GET /api/inventory/alerts` — only low-stock items
- **Backend:** `PUT /api/inventory/:id` — updates ingredient, auto-creates audit log if count changed
- **Backend:** `GET /api/inventory/:id/log` — full change history for one ingredient
- **Database:** `ingredients` table + `audit_log` table with FK to ingredient

### Pre-Seeded Ingredients (19 total)
| Ingredient | Unit | Count | Par | Low Stock |
|-----------|------|-------|-----|-----------|
| Whole Milk | gallon | 6 | 4 | No |
| Oat Milk | gallon | 3 | 4 | ⚠️ Yes |
| Almond Milk | gallon | 2 | 3 | ⚠️ Yes |
| Coconut Milk | gallon | 2 | 3 | ⚠️ Yes |
| Espresso Beans | lb | 8 | 4 | No |
| Vanilla Syrup | bottle | 2 | 3 | ⚠️ Yes |
| Chocolate Sauce | bottle | 3 | 2 | No |
| Croissants | unit | 15 | 10 | No |
| Blueberry Muffins | unit | 10 | 8 | No |
| Chocolate Muffins | unit | 10 | 8 | No |
| Fries | lb | 12 | 8 | No |
| Hot Dogs | unit | 20 | 10 | No |
| Chicken Nuggets | lb | 8 | 5 | No |
| Mozzarella Sticks | unit | 30 | 20 | No |
| Tortillas | pack | 5 | 3 | No |
| Pizza | unit | 12 | 8 | No |
| Breakfast Sandwiches | unit | 10 | 6 | No |
| Coronas | unit | 24 | 12 | No |
| Seltzers | unit | 24 | 12 | No |

### Low-Stock Alert Demonstration
At seed time, 4 ingredients are intentionally below par to demonstrate alert functionality:
- Oat Milk (3 / par 4)
- Almond Milk (2 / par 3)
- Coconut Milk (2 / par 3)
- Vanilla Syrup (2 / par 3)

---

## Overall Technical Summary

### Architecture
```
Customer Browser (React)          Admin Browser (React)
        │                                  │
        └──────────── Vite Proxy ──────────┘
                            │
                   Express.js API (Node)
                    JWT Auth Middleware
                            │
                      Prisma ORM
                            │
                  PostgreSQL (Supabase)
```

### Stack
| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS (custom brand colors) |
| Charts | Recharts |
| HTTP Client | Axios |
| State | React Context (Cart + Auth) |
| Routing | React Router v6 |
| Backend | Node.js + Express.js |
| ORM | Prisma |
| Validation | Zod |
| Auth | JWT (8-hour tokens) |
| Database | PostgreSQL (Supabase free tier) |

### Database Tables
| Table | Purpose |
|-------|---------|
| categories | Menu categories with sort order |
| menu_items | All menu items with pricing |
| modifiers | Customization options per item |
| orders | Customer orders with status |
| order_items | Line items per order with modifiers |
| ingredients | Inventory items with par levels |
| audit_log | Count change history |
| admins | Admin accounts (hashed passwords) |

### API Endpoints (21 total)
**Public (no auth):**
- `GET /api/menu/categories`
- `GET /api/menu/items`
- `GET /api/menu/items/:id`
- `POST /api/orders`
- `GET /api/orders/:id`

**Admin (JWT required):**
- `POST /api/admin/login`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET/POST/PUT/DELETE /api/admin/menu/items`
- `PATCH /api/admin/menu/items/:id/toggle`
- `GET/POST/PUT/DELETE /api/admin/categories`
- `GET/POST/PUT/DELETE /api/inventory`
- `GET /api/inventory/alerts`
- `GET /api/inventory/:id/log`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/sales`
- `GET /api/dashboard/top-items`
- `GET /api/dashboard/volume`

---

## Success Criteria Verification

| Criteria | Target | Result |
|----------|--------|--------|
| Customer: QR → customize → order | < 60 seconds | ✅ Achievable in ~30s |
| Admin: add/edit item and publish | < 2 minutes | ✅ Achievable in ~45s |
| Dashboard: daily + weekly totals + top 5 | Correct from DB | ✅ Live from order data |
| Inventory: ≤20 ingredients + alerts + low-stock events | 10 simulated | ✅ 4 low-stock at seed, more triggerable |

---

## Repository
**GitHub:** https://github.com/Chrisbetann/Coffee-Christopher-Ops
**Branch:** main
**Total files:** 38 source files
**Total lines of code:** ~2,800
