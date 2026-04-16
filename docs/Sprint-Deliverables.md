# Coffee Christopher Ops Suite
## Sprint Deliverables: Week 9 — Week 15
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
**Date:** 03/26/2026 *(completed ahead of schedule)*
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

## Week 14 — Customer Review System
**Date:** 03/26/2026
**Status:** ✅ Complete

### What Was Built
A customer review system that allows customers to rate and comment on items they ordered. Reviews are displayed publicly on item detail pages and can be moderated by admins.

### Features Delivered
| Feature | Status | Acceptance Criteria Met |
|---------|--------|------------------------|
| Review Submission | ✅ | Customers can rate (1–5 stars) and comment after order completion |
| Review Display | ✅ | Item detail pages show average rating and recent reviews |
| Duplicate Prevention | ✅ | One review per item per order enforced |
| Admin Moderation | ✅ | Admin can view all reviews and delete inappropriate ones |

### Technical Implementation
- **Frontend:** Review submission form on `OrderStatus.jsx` (appears when status = ready)
- **Frontend:** Review display section on `ItemDetail.jsx` with star ratings and comments
- **Frontend:** `ReviewModeration.jsx` — admin page to view and delete reviews
- **Backend:** `POST /api/reviews` — submit review (validates order is ready, item was ordered, no duplicates)
- **Backend:** `GET /api/reviews/:itemId` — public endpoint returns reviews + average rating
- **Backend:** `GET /api/reviews/admin/all` — all reviews for admin moderation
- **Backend:** `DELETE /api/reviews/admin/:id` — admin deletes a review
- **Database:** `reviews` table with FK to orders and menu_items

---

## Week 15 — Loyalty Program: Virtual Stamp Card + Member Management
**Date:** 04/09/2026
**Status:** ✅ Complete — **Release 4 (Loyalty & Customer Retention)**

### What Was Built
A full virtual loyalty program: customers sign up with first/last name, email, phone, and optional birthday, receive a unique 8-character QR code, and earn a stamp per visit. Every 6th drink is free. The customer sees an animated stamp card on their phone; admins manage members from a dedicated portal that exports to CSV for marketing campaigns.

### Features Delivered
| Feature | Status | Notes |
|---------|--------|-------|
| Customer Registration | ✅ | First name, last name, email, phone required; birthday optional |
| Unique QR Code | ✅ | 8-character code generated and verified unique at sign-up |
| Virtual Stamp Card | ✅ | 6-slot grid; 6th slot shows gold star + "FREE!" |
| Stamp Animation | ✅ | Keyframe animation (`stamp-pop`) plays on new stamp |
| Admin Stamp Button | ✅ | One-click stamp from admin portal |
| Admin Redeem | ✅ | Decrements stamps by 6 when customer redeems free drink |
| Member Search | ✅ | Search members by name, email, or phone |
| CSV Export | ✅ | Downloads full member list (pure browser Blob API) |
| Standalone Landing Page | ✅ | `/loyalty` accessible without going through ordering menu |
| Live Sync | ✅ | Customer card polls every 5 seconds for stamp updates |

### Technical Implementation
- **Database:** Added `Customer` model (first_name, last_name, email, phone, stamps, qr_code, birthday, created_at) with unique indexes on email, phone, and qr_code
- **Frontend:** `LoyaltyHome.jsx` — landing page with preview stamp card and existing-member code lookup
- **Frontend:** `LoyaltyRegister.jsx` — sign-up form with stamp card preview
- **Frontend:** `LoyaltyCard.jsx` — animated stamp card using `qrcode.react` for QR generation
- **Frontend:** `LoyaltyManagement.jsx` — admin portal with summary cards, search, +stamp, redeem, and CSV export
- **Backend:** `POST /api/loyalty/register` — generates unique QR code
- **Backend:** `GET /api/loyalty/:qrCode` — public card lookup
- **Backend:** `POST /api/loyalty/admin/stamp` — add stamp (admin)
- **Backend:** `POST /api/loyalty/admin/redeem` — redeem free drink (admin)
- **Backend:** `GET /api/loyalty/admin/customers` — list all members
- **Backend:** `GET /api/loyalty/lookup/phone/:phone` — admin phone lookup

### CSV Export
The admin portal generates a CSV of all loyalty members entirely in the browser using the Blob API — no server round-trip, no storage of generated files. Columns: First Name, Last Name, Email, Phone, Stamps, Birthday. Useful for importing into Mailchimp, Klaviyo, or any SMS marketing platform for birthday promotions and targeted campaigns.

### Stamps Threshold
- **Every 6th drink is free.** Easy to change: update the `STAMPS_FOR_FREE` constant in `server/routes/loyalty.js`.

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
| reviews | Customer ratings and comments |
| admins | Admin accounts (hashed passwords) |
| customers | Loyalty program members (QR codes + stamps) |

### API Endpoints (35 total)
**Public (no auth):**
- `GET /api/menu/categories`
- `GET /api/menu/items`
- `GET /api/menu/items/:id`
- `POST /api/orders`
- `GET /api/orders/:id`

**Loyalty Public:**
- `POST /api/loyalty/register`
- `GET /api/loyalty/:qrCode`

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
- `POST /api/reviews`
- `GET /api/reviews/:itemId`
- `GET /api/reviews/admin/all`
- `DELETE /api/reviews/admin/:id`
- `GET /api/loyalty/admin/customers`
- `GET /api/loyalty/lookup/phone/:phone`
- `POST /api/loyalty/admin/stamp`
- `POST /api/loyalty/admin/redeem`

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
**Total files:** 50+ source files
**Total lines of code:** ~4,200
