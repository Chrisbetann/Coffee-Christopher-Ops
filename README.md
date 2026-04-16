# Coffee Christopher Ops Suite

> **CSIS 4903 Capstone Project** — Christopher Betancourt, Nova Southeastern University

A full-stack operations platform for **Coffee Christopher**, a drive-thru coffee and food shop in Hollywood, FL. The suite gives customers a frictionless QR-based ordering experience and gives owners a single dashboard to run the whole business — orders, menu, sales, inventory, customer reviews, and a virtual loyalty program.

![Status](https://img.shields.io/badge/status-production--ready-success) ![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20Prisma%20%7C%20Postgres-informational) ![License](https://img.shields.io/badge/license-Academic-blue)

---

## Table of Contents
1. [Overview](#overview)
2. [Feature Summary](#feature-summary)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Local Setup](#local-setup)
6. [Default Admin Credentials](#default-admin-credentials)
7. [Routes & Pages](#routes--pages)
8. [API Endpoints](#api-endpoints)
9. [Project Timeline](#project-timeline)
10. [Deployment](#deployment)
11. [Documentation](#documentation)

---

## Overview

Coffee Christopher Ops Suite is a complete operational web application built to replace manual processes with a digital workflow:

- **Customers** scan a QR code, browse the menu, customize drinks, pay, and watch their order move from *Sent → Preparing → Ready* in real time.
- **Admins** run the shop from one portal: live order queue, menu management, sales analytics, inventory + low-stock alerts, customer review moderation, and a loyalty stamp-card program.

The project satisfies the capstone success criteria for speed (≤60s customer flow, ≤2m admin menu edits), live data accuracy, and a functional inventory/alerts system.

---

## Feature Summary

### Customer-facing
| Feature | Description |
|---|---|
| **QR-based menu** | Opens directly at `/menu` — no app install required |
| **Category browsing** | Filter by Coffee, Refreshers, Energy, Breakfast, Hot Food, Drinks, Combos |
| **Item customization** | Milk type, sweetener, extras (extra shot, whipped cream), quantity |
| **Cart & checkout** | Adjust quantities, see subtotal / 7% tax / total, place order |
| **Real-time order tracking** | Status page auto-updates every 5 seconds |
| **Customer reviews** | Rate 1–5 stars and comment after an order is Ready |
| **Loyalty program** | Virtual stamp card — every 6th drink free, QR-code accessible |
| **Loyalty landing page** | Stand-alone `/loyalty` entry point so customers can join or open their card without going through ordering |

### Admin portal
| Feature | Description |
|---|---|
| **Secure login** | JWT-authenticated, 8-hour sessions |
| **Dashboard KPIs** | Revenue, order count, low-stock alerts, pending orders |
| **Live order queue** | Auto-polls every 5s; advance *Sent → Preparing → Ready* |
| **Menu management** | Full CRUD + sold-out toggle; changes reflect on customer menu instantly |
| **Sales dashboard** | Day / Week / Month / Year views with bar, line, and pie charts |
| **Inventory tracking** | 19 pre-seeded ingredients, par levels, low-stock alerts, audit log |
| **Review moderation** | View all reviews, delete inappropriate ones |
| **Loyalty management** | Member list, +stamp, redeem, search, CSV export for marketing |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS (custom brand palette) |
| Charts | Recharts |
| HTTP client | Axios |
| State management | React Context (Cart + Auth) |
| Routing | React Router v6 |
| QR codes | `qrcode.react` v3 |
| Backend | Node.js + Express.js |
| ORM | Prisma 5 |
| Validation | Zod |
| Authentication | JSON Web Tokens (bcrypt-hashed passwords) |
| Database | PostgreSQL (Supabase) |
| Frontend host | Vercel |
| Backend host | Railway |

---

## Project Structure

```
coffee-christopher-ops/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── api/              # Axios instance + endpoint helpers
│       ├── components/       # Shared UI (AdminLayout, ProtectedRoute, …)
│       ├── context/          # Cart + Auth contexts
│       ├── pages/
│       │   ├── customer/     # MenuHome, ItemDetail, Cart, OrderStatus,
│       │   │                 # LoyaltyHome, LoyaltyRegister, LoyaltyCard
│       │   └── admin/        # Login, Dashboard, OrderQueue, MenuManagement,
│       │                     # SalesDashboard, InventoryTracking,
│       │                     # ReviewModeration, LoyaltyManagement
│       └── App.jsx           # Route definitions
├── server/                   # Express backend
│   ├── routes/               # menu, orders, admin, inventory, dashboard,
│   │                         # reviews, loyalty
│   ├── middleware/           # JWT auth middleware
│   └── prisma/
│       ├── schema.prisma     # Full DB schema
│       └── seed.js           # Menu, ingredients, admin, sample data
├── docs/                     # Sprint deliverables + status report
├── PROJECT-TIMELINE.md       # Full dated project history
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18 or higher
- A PostgreSQL database (Supabase free tier recommended)

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure environment variables
```bash
cd server
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET
```

### 3. Run migrations and seed data
```bash
npm run db:migrate    # Creates all tables
npm run db:seed       # Seeds menu, ingredients, and admin account
```

### 4. Start development servers
```bash
# Terminal 1 — Backend (port 5001)
npm run dev:server

# Terminal 2 — Frontend (port 5173)
npm run dev:client
```

Open `http://localhost:5173`.

> **Tip:** Run `npm run dev:client -- --host` to expose the client to your phone on the same Wi-Fi network for QR-code testing.

---

## Default Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@coffeechristopher.com` |
| Password | `Benji14141!` |

> Change these immediately in any production deployment.

---

## Routes & Pages

### Customer
| Route | Page |
|---|---|
| `/menu` | Menu home — browse by category |
| `/menu/item/:id` | Item detail + customization |
| `/cart` | Cart + order placement |
| `/order/:id/confirmed` | Order confirmation |
| `/order/:id` | Order status (auto-polls every 5s) |
| `/loyalty` | Loyalty landing page |
| `/loyalty/register` | Join the loyalty program |
| `/loyalty/:qrCode` | Personal stamp card (animated) |

### Admin (JWT required)
| Route | Page |
|---|---|
| `/admin/login` | Admin sign in |
| `/admin/dashboard` | KPI overview + alerts |
| `/admin/orders` | Live order queue |
| `/admin/menu` | Menu CRUD + availability toggles |
| `/admin/sales` | Sales dashboard — day / week / month / year |
| `/admin/inventory` | Inventory tracking + audit log |
| `/admin/reviews` | Review moderation |
| `/admin/loyalty` | Loyalty members + CSV export |

---

## API Endpoints

### Public
- `GET /api/menu/categories`
- `GET /api/menu/items?category=ID`
- `GET /api/menu/items/:id`
- `POST /api/orders`
- `GET /api/orders/:id`
- `POST /api/reviews`
- `GET /api/reviews/:itemId`
- `POST /api/loyalty/register`
- `GET /api/loyalty/:qrCode`

### Admin (JWT required)
- `POST /api/admin/login`
- `GET` / `PATCH /api/admin/orders`
- `GET` / `POST` / `PUT` / `DELETE /api/admin/menu/items`
- `PATCH /api/admin/menu/items/:id/toggle`
- `GET` / `POST` / `PUT` / `DELETE /api/admin/categories`
- `GET` / `POST` / `PUT` / `DELETE /api/inventory`
- `GET /api/inventory/alerts`
- `GET /api/inventory/:id/log`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/sales`
- `GET /api/dashboard/top-items`
- `GET /api/dashboard/volume`
- `GET /api/reviews/admin/all`
- `DELETE /api/reviews/admin/:id`
- `GET /api/loyalty/admin/customers`
- `GET /api/loyalty/lookup/phone/:phone`
- `POST /api/loyalty/admin/stamp`
- `POST /api/loyalty/admin/redeem`

---

## Project Timeline

| Sprint | Date | Milestone |
|---|---|---|
| Sprint 1 | Feb 4 2026 | Project kickoff, repo initialized |
| Sprint 1 | Feb 4 2026 | Week 3–4 deliverables document |
| Sprint 2 | Feb 5 2026 | Sprint overview + backlog |
| Sprint 3 | Feb 19 2026 | Deliverables checkpoint |
| **Release 1** | Mar 12 2026 | **MVP: Customer ordering + admin queue** |
| Sprint 5 | Mar 13 2026 | Weeks 9–13 full build (menu, orders, admin, inventory, sales) |
| Sprint 5 | Mar 13 2026 | Sprint deliverables document published |
| Sprint 6 | Mar 23 2026 | Mid-project status report |
| **Release 2** | Mar 26 2026 | **Analytics dashboard + customer review system** |
| **Release 3** | Mar 26 2026 | **Inventory module + low-stock alerts** |
| Sprint 7 | Apr 2 2026 | Admin login fix (render-time navigate bug) |
| **Release 4** | Apr 9 2026 | **Loyalty program: virtual stamp card, QR code, admin management, CSV export** |
| Sprint 8 | Apr 9 2026 | Rewards entry point enlarged, `/loyalty` landing page |

See [`PROJECT-TIMELINE.md`](./PROJECT-TIMELINE.md) for the full dated history and [`docs/Sprint-Deliverables-Weeks-9-13.md`](./docs/Sprint-Deliverables-Weeks-9-13.md) for detailed sprint deliverables.

---

## Deployment

### Frontend — Vercel
1. Import the GitHub repo into Vercel.
2. Set the root directory to `client/`.
3. Add environment variable: `VITE_API_URL=https://<your-backend>.up.railway.app`.
4. Build command: `npm run build`. Output directory: `dist`.

### Backend — Railway
1. Import the repo into Railway and point it at `server/`.
2. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `PORT`.
3. Start command: `node index.js`.
4. Run `npx prisma migrate deploy` after the first deploy.

### Database — Supabase
- Create a new project, copy the **pooler** connection string (port 5432) into `DATABASE_URL`.
- Free-tier projects pause after ~7 days of inactivity — restore from the Supabase dashboard.

---

## Documentation

- [`PROJECT-TIMELINE.md`](./PROJECT-TIMELINE.md) — Full dated project history
- [`docs/Sprint-Deliverables-Weeks-9-13.md`](./docs/Sprint-Deliverables-Weeks-9-13.md) — Per-week sprint deliverables
- [`docs/Midterm-Status-Report.html`](./docs/Midterm-Status-Report.html) — Formatted mid-project status report

---

## Repository
**GitHub:** https://github.com/Chrisbetann/Coffee-Christopher-Ops
**Primary branch:** `main`
**Author:** Christopher Betancourt — CSIS 4903 Capstone, Nova Southeastern University
