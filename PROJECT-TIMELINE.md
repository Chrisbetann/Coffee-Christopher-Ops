# Project Timeline — Coffee Christopher Ops Suite

> **CSIS 4903 Capstone** — Christopher Betancourt, Nova Southeastern University

This document is the dated record of every milestone on the Coffee Christopher Ops Suite project, from initial kickoff through the Loyalty Program release.

---

## At a Glance

| Phase | Dates | Highlights |
|---|---|---|
| **Planning & Setup** | Feb 4 – Feb 19 2026 | Repo init, backlog, sprint planning |
| **Build Phase 1** | Mar 5 – Mar 12 2026 | Customer ordering MVP |
| **Build Phase 2** | Mar 13 – Mar 23 2026 | Admin portal, menu CRUD, midterm report |
| **Build Phase 3** | Mar 26 2026 | Sales dashboard, inventory, customer reviews |
| **Polish & Features** | Apr 2 – Apr 9 2026 | Bug fixes, loyalty program, rewards UX |

---

## Detailed Timeline

### February 2026 — Planning & Foundations

#### **Feb 4, 2026** — Project Kickoff
- Repository initialized on GitHub: `Chrisbetann/Coffee-Christopher-Ops`
- Initial project scaffolding
- Week 3 & 4 deliverables document drafted

#### **Feb 5, 2026** — Sprint Overview
- Sprint overview document created
- Initial backlog organized
- First pull request merged (`review-sprint-planning-Cko7e` → `main`)

#### **Feb 6, 2026** — Deliverables Checkpoint
- Capstone Deliverables documentation added
- Legacy PDF retired in favor of Markdown-based deliverables

#### **Feb 19, 2026** — Deliverables Update
- Secondary deliverables checkpoint

---

### March 2026 — Build Phase

#### **Mar 5, 2026** — Week 9: Customer Menu Module
**Delivered:**
- Dynamic category pills (Coffee, Refreshers, Energy, Breakfast, Hot Food, Drinks, Combos)
- Item detail pages with milk / sweetener / extras customization
- Full Coffee Christopher menu seeded (30+ items across 7 categories)
- Backend: `GET /api/menu/categories`, `GET /api/menu/items`, `GET /api/menu/items/:id`

#### **Mar 12, 2026** — Week 10: 🎉 Release 1 (MVP Ordering)
**Delivered:**
- Cart management (quantity 1–10, remove, subtotal/tax/total)
- Order submission with unique 6-character order numbers
- Customer order status page (auto-polls every 5 seconds)
- Admin order queue with Sent → Preparing → Ready advancement
- 7% tax calculation stored per order for accurate reporting

#### **Mar 13, 2026** — Full Application Build
- Server + Prisma schema + all REST routes (menu, orders, admin, inventory, dashboard)
- JWT auth middleware
- Default port changed to 5001 (avoids macOS AirPlay conflict on 5000)
- Sprint deliverables document published (Weeks 9–13)

#### **Mar 19, 2026** — Week 11: Admin Menu Management
**Delivered:**
- Menu CRUD (create / read / update / delete)
- Sold-out toggle — changes reflect on customer menu immediately
- Searchable, filterable admin table
- Zod validation on all admin endpoints

#### **Mar 23, 2026** — Mid-Project Status Report
- Two-page HTML status report covering tools, languages, problems faced, GUI mockups, 8-week schedule
- Reviewed midterm deliverables list

#### **Mar 26, 2026** — Week 12 & 13: 🎉 Releases 2 & 3 (Analytics + Inventory)
**Analytics Delivered:**
- Sales dashboard with Day / Week / Month / Year tabs
- Bar chart (revenue), line chart (order volume), pie chart (top 5 items) via Recharts
- KPI cards: period revenue, order count, low-stock alerts, pending orders
- `GET /api/dashboard/summary`, `/sales`, `/top-items`, `/volume`

**Inventory Delivered:**
- 19 pre-seeded ingredients with par levels
- Low-stock alerts (red highlighting for count < par)
- Manual count entry (whole + decimal)
- Supplier linking (name, contact, cost per unit)
- Full audit log for every count change

#### **Mar 26, 2026** — Week 14: Customer Review System
**Delivered:**
- 1–5 star ratings + comments
- Review submission from Order Status page once order is Ready
- Public reviews displayed on Item Detail pages with average rating
- Duplicate prevention (one review per item per order)
- Admin review moderation with delete
- Also shipped: favicon fix and README updates

---

### April 2026 — Polish & Loyalty Phase

#### **Apr 2, 2026** — Admin Login Bugfix
- Fixed render-time `navigate()` call in admin `Login.jsx` by moving it into `useEffect`
- Admin dashboard now loads reliably after sign-in

#### **Apr 9, 2026** — 🎉 Release 4: Loyalty Program
**Customer Delivered:**
- Virtual stamp card with animations (`stamp-pop` keyframe)
- Every 6th drink free
- Registration: first name, last name, email, phone, optional birthday
- Unique 8-character QR code per member
- 6-slot stamp grid with gold star + "FREE!" on 6th slot
- Live card updates (polls every 5 seconds)

**Admin Delivered:**
- Dedicated loyalty management portal
- Summary cards (total members, total stamps, free drinks ready)
- Search by name, email, or phone
- +Stamp and Redeem buttons per member
- **CSV export** of full member list (browser-native Blob API) for marketing campaigns and birthday promotions

#### **Apr 9, 2026** — Rewards UX Improvements
- Enlarged Rewards button in customer header
- New standalone `/loyalty` landing page — customers can join or open their existing card without going through the ordering menu
- Card lookup form for returning members (8-character code)

---

## Releases Summary

| Release | Date | Theme |
|---|---|---|
| **Release 1** | Mar 12 2026 | MVP Customer Ordering + Admin Queue |
| **Release 2** | Mar 26 2026 | Sales Analytics Dashboard |
| **Release 3** | Mar 26 2026 | Inventory Tracking + Low-Stock Alerts |
| **Release 4** | Apr 9 2026 | Customer Loyalty Program |

---

## Success Criteria — Final Status

| Criteria | Target | Result |
|---|---|---|
| Customer: QR → customize → order | < 60 seconds | ✅ ~30 seconds achievable |
| Admin: add/edit item and publish | < 2 minutes | ✅ ~45 seconds achievable |
| Dashboard: daily + weekly totals + top 5 | Correct from DB | ✅ Live from order data |
| Inventory: ≤20 ingredients + alerts | 10 simulated events | ✅ 4 low-stock at seed, more triggerable |
| Customer Reviews | Post-order rating + comment | ✅ Live with moderation |
| Loyalty Program | Stamp card + redeem flow | ✅ Live with CSV export |

---

## Tech Stack Evolution

| Date | Addition |
|---|---|
| Feb 4 2026 | React + Vite + Tailwind scaffolded |
| Mar 13 2026 | Express + Prisma + PostgreSQL (Supabase) |
| Mar 13 2026 | JWT authentication for admin portal |
| Mar 26 2026 | Recharts for sales visualizations |
| Mar 26 2026 | Zod for request validation |
| Apr 9 2026 | `qrcode.react` for loyalty QR codes |
| Apr 9 2026 | Browser Blob API for CSV export |

---

## Repository
- **GitHub:** https://github.com/Chrisbetann/Coffee-Christopher-Ops
- **Primary branch:** `main`
- **Author:** Christopher Betancourt
- **Course:** CSIS 4903 Capstone Project for Computer Science
- **Institution:** Nova Southeastern University
