# Coffee Christopher Ops Suite

> CSIS 4903 Capstone — Christopher Betancourt, Nova Southeastern University

Full-stack web application providing a QR-based digital menu, order management, sales dashboard, and inventory tracking for Coffee Christopher.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React 18 + Vite + Tailwind CSS + Recharts |
| Backend | Node.js + Express.js + Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | JWT |
| Frontend Host | Vercel |
| Backend Host | Railway |

---

## Project Structure

```
coffee-christopher-ops/
├── client/          # React frontend (Vite)
└── server/          # Express backend
    └── prisma/      # Schema + seed data
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A PostgreSQL database (Supabase free tier recommended)

### 1. Clone & install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

```bash
cd server
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET
```

### 3. Run database migrations + seed

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

Then open `http://localhost:5173`

---

## Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@coffeechristopher.com |
| Password | Benji14141! |

---

## Routes

### Customer
| Route | Page |
|-------|------|
| `/menu` | Menu home — browse by category |
| `/menu/item/:id` | Item detail + customization |
| `/cart` | Cart + order placement |
| `/order/:id/confirmed` | Order confirmation |
| `/order/:id` | Order status (auto-polls every 5s) |

### Admin
| Route | Page |
|-------|------|
| `/admin/login` | Admin sign in |
| `/admin/dashboard` | KPI overview + alerts |
| `/admin/orders` | Live order queue |
| `/admin/menu` | Menu CRUD + availability toggles |
| `/admin/sales` | Sales dashboard — day/week/month/year |
| `/admin/inventory` | Inventory tracking + audit log |
| `/admin/reviews` | Review moderation |

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

### Admin (JWT required)
- `POST /api/admin/login`
- `GET/PATCH /api/admin/orders`
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
- `GET /api/reviews/admin/all`
- `DELETE /api/reviews/admin/:id`

---

## Deployment

See the sprint deliverables in `/docs` for full architecture and deployment details.