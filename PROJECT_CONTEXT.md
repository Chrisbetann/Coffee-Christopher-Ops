# Coffee Christopher Ops — Full Project Context
> Paste this into a new Claude chat and say: "Make me a professional PowerPoint presentation from this. Include speaker notes in a casual, conversational voice. Add visual mockups of each page."

---

## What Is This?
A full-stack operations platform built for a real coffee shop called Coffee Christopher. It replaces pen-and-paper loyalty tracking and spreadsheet inventory with a single, mobile-friendly web app. Two audiences: customers (public menu, loyalty card) and admin staff (full back-office portal).

## Tech Stack
- **Frontend:** React 18 + Vite 5, React Router v6, Tailwind CSS, Axios
- **Backend:** Node.js + Express
- **Database:** PostgreSQL via Prisma ORM, hosted on Supabase
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Email:** Nodemailer via Gmail SMTP (App Password)
- **PWA:** Service Worker + Web App Manifest (installable on iOS & Android)
- **Other:** qrcode.react for QR code generation

## Brand Colors
- Brown: #6B3F1E
- Tan: #C9A96E
- Cream: #F5EFE6

## 8 Core Features

### 1. Menu
- Public browsable menu with categories
- Item details, images, available/unavailable toggle
- Admin can add, edit, delete items and categories

### 2. Orders
- Customers browse menu and place orders
- Order confirmation screen with order ID
- Admin order queue: pending → in-progress → complete status updates

### 3. Loyalty Program v2 (centrepiece feature)
- Every 6th drink is free
- Customers look up their card by phone number at /loyalty
- QR code stamp card displayed on phone
- Admin scans QR → adds stamp or redeems free drink
- New customers register at /loyalty/register
- Stamps roll over after redemption
- Card is installable as a PWA (home screen shortcut)

### 4. Promotions
- Admin creates promos: % off, $ off, or $ off specific item
- Every loyalty member appears as a recipient automatically
- 📧 Email button sends personalised offer email directly via Gmail SMTP
- 📱 SMS button opens Messages app with pre-filled text
- Send status tracked per-customer per-promo with timestamp

### 5. Weekly Loyalty Reminders
- Admin clicks one button → emails ALL loyalty members
- 4 randomly chosen email templates per customer:
  1. "We miss seeing your face around here!"
  2. "There's no better time for a great cup of coffee"
  3. "You've got X stamps building up on your card!" (skipped if 0 stamps)
  4. "Coffee Christopher wouldn't be the same without regulars like you"
- Promise.allSettled so one bad email doesn't stop the rest
- Returns exact sent/failed count to admin

### 6. Inventory
- Ingredient tracking with quantity and unit
- Low-stock alerts when below threshold
- Audit log per ingredient (who changed what, when)
- Admin CRUD: add, edit, delete ingredients

### 7. Reviews
- Post-order review submission with star rating
- Per-item review display on menu
- Admin moderation: view all reviews, delete inappropriate ones

### 8. Dashboard & Analytics
- Sales totals, order count, average order value
- Top selling items
- Order volume chart
- Filterable by day / week / month

## PWA Details
- manifest.webmanifest with brand colours
- Maskable icons: 192px + 512px SVG
- display: standalone for full-screen install
- Service worker: cache-first shell, network-first API, stale-while-revalidate assets
- InstallPrompt component: iOS share-sheet instructions + Android beforeinstallprompt
- Dismissible for 7 days via localStorage
- Native Web Share API with clipboard fallback
- SW only registers in production (PROD guard) so Vite dev mode is never broken

## Database Schema (Prisma/PostgreSQL)
- Category, MenuItem
- Order, OrderItem
- Admin (email + bcrypt hash)
- Customer (first_name, last_name, email, phone, stamps, qr_code)
- Promo, PromoSend (tracks email_sent, sms_sent, sent_at per customer)
- Review
- Ingredient, IngredientLog

## Key Challenges Solved During This Sprint
1. **Two repo clones** — had ~/Coffee-Christopher-Ops AND ~/Desktop/Coffee-Christopher-Ops. Server ran from Desktop while .env updates went to home folder. Diagnosed via Prisma error showing full file path.
2. **Supabase auth failures** — password rotation without updating both .env files caused P1001 and auth errors. Fixed with sed replace on both files.
3. **Service worker crashing Vite** — SW fetch handler returned undefined, breaking hot module reload. Fixed with PROD guard in index.jsx and Response.error() fallbacks.
4. **mailto: links doing nothing** — macOS had no default email client configured. Replaced all mailto: hrefs with server-side Nodemailer sends via Gmail SMTP.
5. **Stale browser JS cache** — old JS bundle cached by Vite and Opera after code updates. Fixed by killing Vite PID, deleting node_modules/.vite, switching to Chrome.
6. **Git history rewrite** — stripped Claude/AI attribution from commit history using git filter-repo with mailmap.

## Email System Architecture
- mailer.js: Nodemailer transporter using SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars
- Promo email: POST /api/promos/:id/recipients/:custId/email — personalises, sends, auto-marks email_sent
- Weekly reminder: POST /api/loyalty/admin/reminders/weekly — sends to all members, 4 random templates
- Error handling: Promise.allSettled, console.error logging, returns sent/failed counts

## Roadmap / Next Steps
- Rotate exposed credentials (Supabase DB password, Gmail App Password)
- Consolidate to single repo clone
- Deploy: Vercel (frontend) + Railway (backend) + Supabase (already hosted)
- Buy domain (e.g. coffeechristopher.com via Namecheap ~$12/yr)
- Activate Apple Wallet + Google Wallet (certs needed)
- Add cron job for automatic weekly reminders (replace manual button)
- Push notifications for order status updates

## Pages / Routes
- / — home / landing
- /menu — public menu
- /loyalty — phone lookup landing
- /loyalty/register — new member registration
- /loyalty/:qrCode — stamp card display
- /admin/login — admin auth
- /admin/dashboard — analytics
- /admin/orders — order queue
- /admin/menu — menu management
- /admin/loyalty — loyalty member management + weekly reminder
- /admin/promotions — promo creation + send
- /admin/inventory — ingredient tracking
- /admin/reviews — review moderation

## GitHub
Repository: github.com/Chrisbetann/Coffee-Christopher-Ops
Branch: claude/review-sprint-planning-EqmdC
