# Coffee Christopher Ops Suite
## Sprint Deliverables: Week 3 — Week 8

**Author:** Christopher Betancourt
**Course:** CSIS 4903 - Capstone Project for Computer Science
**Institution:** Nova Southeastern University

---

# Week 3 — Proposal + Initial Backlog

**Date:** 01/23/2026
**Deliverables:** Proposal Completed + Initial Backlog (Epics/Features)

---

## Proposal Summary

### Project Overview
Coffee Christopher Ops Suite is a single web application that provides:
- QR-based digital menu and ordering experience for customers
- Admin portal for menu management
- Sales + inventory tracking dashboard
- (Stretch) Loyalty/rewards system

### Problem Statement
Customers often lose time waiting to view menus and place orders. On the business side, limited sales visibility and manual inventory tracking can contribute to waste and margin loss—especially with perishable items like milk that expire.

### Benefits
1. **Faster service / reduced waiting** — QR ordering reduces wait time and improves efficiency
2. **Rapid menu updates** — Digital menus make it easy to update items and pricing quickly
3. **Better margins** — Inventory management helps reduce food waste and improve profits

### Success Criteria
- Customer can scan QR, customize an item, and place an order in less than 60 seconds (3 timed trials)
- Admin can add/edit an item and publish it live in less than 2 minutes
- Dashboard correctly shows daily, weekly, monthly, and yearly sales totals and top 5 items
- Inventory module supports up to 20 ingredients with thresholds and produces low-stock alerts
- (Stretch) Loyalty: points accrue/redeem for 10 test users with 0 calculation errors

---

## Initial Backlog: 5 Epics, 29 Features

### Epic 1: Customer QR Menu & Ordering (7 features)

| Feature | Description |
|---------|-------------|
| QR Code Access | Scan QR to open mobile web menu |
| Menu Browsing | View items organized by categories |
| Item Details | See description, price, and options |
| Item Customization | Select modifiers/options (milk type, size, etc.) |
| Cart Management | Add items, adjust quantities, remove items |
| Order Submission | Place order from cart |
| Order Status View | Track status: Sent → Preparing → Ready |

### Epic 2: Admin Portal / Menu Management (5 features)

| Feature | Description |
|---------|-------------|
| Item CRUD | Create, read, update, delete menu items |
| Category Management | Organize items into categories |
| Pricing Management | Set/update item prices |
| Availability Toggle | Mark items as available or sold-out |
| Live Publishing | Changes reflect immediately for customers |

### Epic 3: Sales Dashboard (7 features)

| Feature | Description |
|---------|-------------|
| Daily Totals | View sales total for current/selected day |
| Weekly Totals | View sales total for current/selected week |
| Monthly Totals | View sales total for current/selected month |
| Yearly Totals | View sales total for current/selected year |
| Top-Selling Items | Display top 5 items by volume/revenue |
| Order Volume Trends | Charts showing order patterns over time |
| Visual Reports | Graphs and charts for data representation |

### Epic 4: Inventory Tracking (6 features)

| Feature | Description |
|---------|-------------|
| Ingredient List | Manage list of ingredients (<20 to start) |
| Par Levels | Set minimum threshold for each ingredient |
| Low-Stock Alerts | Notifications when inventory drops below par |
| Manual Count Entry | Input current inventory counts |
| Supplier Linking | Track where ingredients come from + cost |
| Audit Logging | Record changes for accuracy/accountability |

### Epic 5: (Stretch) Loyalty/Rewards (4 features)

| Feature | Description |
|---------|-------------|
| Customer Accounts | Registration with name, phone number, email |
| Points Accrual | Earn points on purchases |
| Points Redemption | Redeem points for rewards |
| Regulars List | Track frequent customers (CRM-lite) |

---

# Week 4 — Requirements

**Date:** 01/30/2026
**Deliverables:** User Stories, Use Cases, Acceptance Criteria

---

## Epic 1: Customer QR Menu & Ordering

### User Stories

| ID | User Story |
|----|------------|
| US-1.1 | As a **customer**, I want to scan a QR code so that I can quickly access the menu on my phone |
| US-1.2 | As a **customer**, I want to browse items by category so that I can find what I'm looking for easily |
| US-1.3 | As a **customer**, I want to view item details so that I can see the description, price, and options |
| US-1.4 | As a **customer**, I want to customize my item so that I can choose my preferred options (milk type, size, etc.) |
| US-1.5 | As a **customer**, I want to manage my cart so that I can add, adjust, or remove items before ordering |
| US-1.6 | As a **customer**, I want to submit my order so that the shop can prepare it |
| US-1.7 | As a **customer**, I want to view my order status so that I know when it's ready |

### Use Case: Customer Places an Order

| Step | Action |
|------|--------|
| 1 | Customer scans QR code at the shop |
| 2 | System opens mobile web menu in browser |
| 3 | Customer browses categories and selects an item |
| 4 | System displays item details and customization options |
| 5 | Customer selects options and adds item to cart |
| 6 | Customer reviews cart (can adjust quantities or remove items) |
| 7 | Customer submits order |
| 8 | System confirms order and displays status: **Sent** |
| 9 | Customer views status updates: **Sent → Preparing → Ready** |
| 10 | Customer picks up order |

### Acceptance Criteria

| ID | Feature | Criteria |
|----|---------|----------|
| AC-1.1 | QR Code Access | QR code opens menu in mobile browser within 3 seconds |
| AC-1.2 | Menu Browsing | All categories display with correct items; tapping a category shows its items |
| AC-1.3 | Item Details | Item page shows name, description, price, and available options |
| AC-1.4 | Item Customization | Customer can select at least one modifier; selection reflects in price if applicable |
| AC-1.5 | Cart Management | Cart shows all added items; quantities can be adjusted (1-10); items can be removed |
| AC-1.6 | Order Submission | Order submits successfully; confirmation message displays; order appears in admin queue |
| AC-1.7 | Order Status View | Status updates reflect within 5 seconds of admin change; shows Sent, Preparing, or Ready |

---

## Epic 2: Admin Portal / Menu Management

### User Stories

| ID | User Story |
|----|------------|
| US-2.1 | As an **admin**, I want to create menu items so that I can add new products to the menu |
| US-2.2 | As an **admin**, I want to view all menu items so that I can see what's currently on the menu |
| US-2.3 | As an **admin**, I want to edit menu items so that I can update names, descriptions, or prices |
| US-2.4 | As an **admin**, I want to delete menu items so that I can remove discontinued products |
| US-2.5 | As an **admin**, I want to manage categories so that I can organize items logically |
| US-2.6 | As an **admin**, I want to toggle item availability so that I can mark items as sold-out without deleting them |
| US-2.7 | As an **admin**, I want changes to publish live immediately so that customers always see the current menu |

### Use Case: Admin Adds a New Menu Item

| Step | Action |
|------|--------|
| 1 | Admin logs into admin portal |
| 2 | Admin navigates to Menu Management |
| 3 | Admin clicks "Add New Item" |
| 4 | System displays item creation form |
| 5 | Admin enters name, description, price, and selects category |
| 6 | Admin adds customization options (if applicable) |
| 7 | Admin clicks "Save" |
| 8 | System validates inputs and saves item |
| 9 | Item appears on customer menu immediately |

### Use Case: Admin Marks Item as Sold-Out

| Step | Action |
|------|--------|
| 1 | Admin navigates to Menu Management |
| 2 | Admin locates item in the list |
| 3 | Admin toggles availability to "Sold-Out" |
| 4 | System saves change |
| 5 | Item displays as sold-out on customer menu (visible but not orderable) |

### Acceptance Criteria

| ID | Feature | Criteria |
|----|---------|----------|
| AC-2.1 | Item CRUD | Admin can create item with name (required), description, price (required), and category |
| AC-2.2 | Item CRUD | Admin can view list of all items with name, price, category, and availability status |
| AC-2.3 | Item CRUD | Admin can edit any field of an existing item; changes save successfully |
| AC-2.4 | Item CRUD | Admin can delete an item; item no longer appears on customer menu |
| AC-2.5 | Category Management | Admin can create, rename, and delete categories; items can be reassigned |
| AC-2.6 | Availability Toggle | Toggle switches between "Available" and "Sold-Out"; sold-out items are visible but not orderable |
| AC-2.7 | Live Publishing | Changes reflect on customer menu within 5 seconds without requiring page refresh |

---

## Epic 3: Sales Dashboard

### User Stories

| ID | User Story |
|----|------------|
| US-3.1 | As an **admin**, I want to view daily sales totals so that I can track daily revenue |
| US-3.2 | As an **admin**, I want to view weekly sales totals so that I can monitor week-over-week performance |
| US-3.3 | As an **admin**, I want to view monthly sales totals so that I can assess monthly trends |
| US-3.4 | As an **admin**, I want to view yearly sales totals so that I can see annual performance |
| US-3.5 | As an **admin**, I want to see top-selling items so that I know what products are most popular |
| US-3.6 | As an **admin**, I want to view order volume trends so that I can identify busy periods |
| US-3.7 | As an **admin**, I want data displayed as charts/graphs so that I can quickly understand the numbers |

### Use Case: Admin Reviews Sales Performance

| Step | Action |
|------|--------|
| 1 | Admin logs into admin portal |
| 2 | Admin navigates to Sales Dashboard |
| 3 | System displays today's sales total by default |
| 4 | Admin selects time period (day/week/month/year) |
| 5 | System updates totals and charts for selected period |
| 6 | Admin views top 5 selling items for the period |
| 7 | Admin reviews order volume trend chart |
| 8 | Admin identifies peak hours/days for staffing decisions |

### Use Case: Admin Compares Monthly Performance

| Step | Action |
|------|--------|
| 1 | Admin navigates to Sales Dashboard |
| 2 | Admin selects "Monthly" view |
| 3 | System displays current month's total |
| 4 | Admin selects a previous month to compare |
| 5 | System shows both months' data for comparison |
| 6 | Admin assesses growth or decline |

### Acceptance Criteria

| ID | Feature | Criteria |
|----|---------|----------|
| AC-3.1 | Daily Totals | Displays total revenue and order count for selected day; defaults to today |
| AC-3.2 | Weekly Totals | Displays total revenue and order count for selected week; shows daily breakdown |
| AC-3.3 | Monthly Totals | Displays total revenue and order count for selected month; shows weekly breakdown |
| AC-3.4 | Yearly Totals | Displays total revenue and order count for selected year; shows monthly breakdown |
| AC-3.5 | Top-Selling Items | Displays top 5 items by quantity sold and revenue for selected period |
| AC-3.6 | Order Volume Trends | Chart shows order counts over time; can identify peak hours/days |
| AC-3.7 | Visual Reports | At least 2 chart types (bar, line, or pie); charts render correctly on desktop and mobile |

---

## Epic 4: Inventory Tracking

### User Stories

| ID | User Story |
|----|------------|
| US-4.1 | As an **admin**, I want to manage an ingredient list so that I can track what inventory I have |
| US-4.2 | As an **admin**, I want to set par levels for each ingredient so that I know the minimum stock I need |
| US-4.3 | As an **admin**, I want to receive low-stock alerts so that I can reorder before running out |
| US-4.4 | As an **admin**, I want to enter manual inventory counts so that I can keep stock levels accurate |
| US-4.5 | As an **admin**, I want to link ingredients to suppliers with prices so that I can reorder quickly and track costs |
| US-4.6 | As an **admin**, I want changes logged so that I can audit inventory accuracy and catch errors |

### Use Case: Admin Adds a New Ingredient

| Step | Action |
|------|--------|
| 1 | Admin navigates to Inventory Tracking |
| 2 | Admin clicks "Add Ingredient" |
| 3 | System displays ingredient form |
| 4 | Admin enters name, unit of measure, current count, and par level |
| 5 | Admin optionally links supplier and cost per unit |
| 6 | Admin clicks "Save" |
| 7 | System saves ingredient and logs the addition |
| 8 | Ingredient appears in inventory list |

### Use Case: Admin Updates Inventory Count

| Step | Action |
|------|--------|
| 1 | Admin navigates to Inventory Tracking |
| 2 | Admin locates ingredient (e.g., "Oat Milk") |
| 3 | Admin enters new count from physical count |
| 4 | System saves new count and logs the change (who, when, old value, new value) |
| 5 | If count is below par level, system triggers low-stock alert |

### Use Case: Admin Responds to Low-Stock Alert

| Step | Action |
|------|--------|
| 1 | System detects ingredient below par level |
| 2 | Alert appears on dashboard/notification area |
| 3 | Admin views alert with ingredient name, current count, and par level |
| 4 | Admin clicks ingredient to view supplier info and cost |
| 5 | Admin places order with supplier (outside system) |
| 6 | Admin updates count after restock arrives |
| 7 | Alert clears automatically when count exceeds par level |

### Acceptance Criteria

| ID | Feature | Criteria |
|----|---------|----------|
| AC-4.1 | Ingredient List | Supports up to 20 ingredients; each has name, unit, current count, and par level |
| AC-4.2 | Par Levels | Par level is editable per ingredient; must be a positive number |
| AC-4.3 | Low-Stock Alerts | Alert triggers when count drops below par; alert displays ingredient name, count, and par level |
| AC-4.4 | Manual Count Entry | Admin can update count; system accepts whole numbers and decimals (e.g., 2.5 gallons) |
| AC-4.5 | Supplier Linking | Each ingredient can have supplier name, contact info, and cost per unit |
| AC-4.6 | Audit Logging | Every count change logs: timestamp, user, ingredient, old count, new count |

---

## Epic 5: (Stretch) Loyalty/Rewards

### User Stories

| ID | User Story |
|----|------------|
| US-5.1 | As a **customer**, I want to create an account with my name, phone, and email so that I can join the loyalty program |
| US-5.2 | As a **customer**, I want to earn points on purchases so that I can work toward rewards |
| US-5.3 | As a **customer**, I want to redeem points for rewards so that I get value from my loyalty |
| US-5.4 | As a **customer**, I want to view my points balance so that I know how close I am to a reward |
| US-5.5 | As an **admin**, I want to view a regulars list so that I can see my frequent customers |
| US-5.6 | As an **admin**, I want to see customer contact info so that I can reach out for promotions |

### Use Case: Customer Registers for Loyalty Program

| Step | Action |
|------|--------|
| 1 | Customer selects "Join Rewards" from menu |
| 2 | System displays registration form |
| 3 | Customer enters name, phone number, and email |
| 4 | System validates inputs (valid email format, valid phone) |
| 5 | System creates account with 0 points balance |
| 6 | Customer receives confirmation |
| 7 | Customer can now earn points on orders |

### Use Case: Customer Earns and Redeems Points

| Step | Action |
|------|--------|
| 1 | Customer logs into loyalty account before ordering |
| 2 | Customer places order |
| 3 | System calculates points earned (e.g., 1 point per $1 spent) |
| 4 | System adds points to customer balance |
| 5 | Customer views updated balance |
| 6 | When customer has enough points, redemption option appears at checkout |
| 7 | Customer chooses to redeem points for reward (e.g., free drink) |
| 8 | System deducts points and applies reward to order |

### Use Case: Admin Views Regulars List

| Step | Action |
|------|--------|
| 1 | Admin navigates to Loyalty section in admin portal |
| 2 | System displays list of registered customers |
| 3 | Admin can sort by total points, total orders, or recent activity |
| 4 | Admin selects a customer to view details |
| 5 | System shows name, phone, email, points balance, and order history |
| 6 | Admin can use contact info for promotional outreach |

### Acceptance Criteria

| ID | Feature | Criteria |
|----|---------|----------|
| AC-5.1 | Customer Accounts | Registration requires name (required), phone (required, valid format), email (required, valid format) |
| AC-5.2 | Customer Accounts | Duplicate phone or email rejected with clear error message |
| AC-5.3 | Points Accrual | Points calculated correctly based on order total; 0 calculation errors for 10 test users |
| AC-5.4 | Points Accrual | Points added to balance immediately after order submission |
| AC-5.5 | Points Redemption | Customer can redeem only if balance meets minimum threshold |
| AC-5.6 | Points Redemption | Points deducted correctly; reward applied to order total |
| AC-5.7 | Regulars List | Admin can view all registered customers with name, phone, email, and points balance |
| AC-5.8 | Regulars List | List sortable by points, order count, or last order date |

---

# Week 5 — Wireframes + User Flows

**Date:** 02/06/2026
**Deliverables:** User Flows + Wireframes (Customer QR + Admin Portal)

---

## Customer User Flows

### Flow 1: Browse & Order

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Scan QR    │────▶│   Menu      │────▶│  Item       │────▶│  Customize  │
│  Code       │     │   Home      │     │  Detail     │     │  Item       │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Order      │◀────│  Order      │◀────│  Review     │◀────│  Add to     │
│  Status     │     │  Confirmed  │     │  Cart       │     │  Cart       │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Flow 2: Track Order Status

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Order      │────▶│   SENT      │────▶│  PREPARING  │────▶│   READY     │
│  Submitted  │     │   (yellow)  │     │  (orange)   │     │   (green)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Flow 3: (Stretch) Loyalty Sign-Up

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Tap "Join  │────▶│  Enter      │────▶│  Confirm    │────▶│  Account    │
│  Rewards"   │     │  Info       │     │  Details    │     │  Created    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                    │ Name        │
                    │ Phone       │
                    │ Email       │
```

---

## Admin User Flows

### Flow 1: Login & Dashboard

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Admin      │────▶│  Enter      │────▶│  Admin      │
│  Login Page │     │  Credentials│     │  Dashboard  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
             ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
             │  Order      │           │  Menu       │           │  Sales      │
             │  Queue      │           │  Management │           │  Dashboard  │
             └─────────────┘           └─────────────┘           └─────────────┘
                                                                        │
                                                                        ▼
                                                                 ┌─────────────┐
                                                                 │  Inventory  │
                                                                 │  Tracking   │
                                                                 └─────────────┘
```

### Flow 2: Manage Orders

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  View Order │────▶│  Mark as    │────▶│  Mark as    │────▶│  Order      │
│  Queue      │     │  PREPARING  │     │  READY      │     │  Complete   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Flow 3: Menu Management (CRUD)

```
┌─────────────┐     ┌─────────────┐
│  Menu       │────▶│  View All   │
│  Management │     │  Items      │
└─────────────┘     └─────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 │  Add New    │    │  Edit       │    │  Delete     │
 │  Item       │    │  Item       │    │  Item       │
 └─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 │  Enter      │    │  Modify     │    │  Confirm    │
 │  Details    │    │  Fields     │    │  Delete     │
 └─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                    ┌─────────────┐
                    │  Save &     │
                    │  Publish    │
                    └─────────────┘
```

### Flow 4: Sales Dashboard

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Sales      │────▶│  Select     │────▶│  View       │
│  Dashboard  │     │  Time Period│     │  Reports    │
└─────────────┘     └─────────────┘     └─────────────┘
                    │ Daily       │      │ Totals      │
                    │ Weekly      │      │ Top 5       │
                    │ Monthly     │      │ Charts      │
                    │ Yearly      │
```

### Flow 5: Inventory Management

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Inventory  │────▶│  View       │────▶│  Update     │
│  Tracking   │     │  Ingredients│     │  Count      │
└─────────────┘     └─────────────┘     └─────────────┘
        │                                      │
        ▼                                      ▼
 ┌─────────────┐                        ┌─────────────┐
 │  Add New    │                        │  System     │
 │  Ingredient │                        │  Logs Change│
 └─────────────┘                        └─────────────┘
        │                                      │
        ▼                                      ▼
 ┌─────────────┐                        ┌─────────────┐
 │  Set Par    │                        │  Alert if   │
 │  Level      │                        │  Below Par  │
 └─────────────┘                        └─────────────┘
```

### Flow 6: (Stretch) Loyalty / Regulars

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Loyalty    │────▶│  View       │────▶│  View       │
│  Section    │     │  Regulars   │     │  Customer   │
└─────────────┘     │  List       │     │  Details    │
                    └─────────────┘     └─────────────┘
                    │ Sort by:    │     │ Name        │
                    │ - Points    │     │ Phone       │
                    │ - Orders    │     │ Email       │
                    │ - Recent    │     │ Points      │
                                        │ History     │
```

---

## Customer Wireframes (Mobile Web)

### Screen 1: Menu Home

```
┌─────────────────────────────┐
│  ☰    COFFEE CHRISTOPHER    │
├─────────────────────────────┤
│                             │
│  ┌───────┐  ┌───────┐       │
│  │       │  │       │       │
│  │ HOT   │  │ COLD  │       │
│  │DRINKS │  │DRINKS │       │
│  └───────┘  └───────┘       │
│                             │
│  ┌───────┐  ┌───────┐       │
│  │       │  │       │       │
│  │PASTRY │  │SEASONAL│      │
│  │       │  │       │       │
│  └───────┘  └───────┘       │
│                             │
├─────────────────────────────┤
│  🛒 Cart (0)                │
└─────────────────────────────┘
```

### Screen 2: Category View

```
┌─────────────────────────────┐
│  ←  HOT DRINKS              │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ ☕ Latte          $5.00│  │
│  │ Espresso + steamed milk│  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ ☕ Cappuccino    $4.75│  │
│  │ Equal parts espresso...│  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ ☕ Americano     $3.50│  │
│  │ Espresso + hot water  │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ ☕ Mocha         $5.50│  │
│  │ Espresso + chocolate..│  │
│  └───────────────────────┘  │
│                             │
├─────────────────────────────┤
│  🛒 Cart (0)                │
└─────────────────────────────┘
```

### Screen 3: Item Detail

```
┌─────────────────────────────┐
│  ←  LATTE                   │
├─────────────────────────────┤
│                             │
│       ┌───────────┐         │
│       │   ☕ IMG  │         │
│       └───────────┘         │
│                             │
│  Latte                $5.00 │
│  Espresso with steamed      │
│  milk and light foam.       │
│                             │
│  SIZE                       │
│  ○ Small (12oz)      +$0.00 │
│  ● Medium (16oz)     +$0.50 │
│  ○ Large (20oz)      +$1.00 │
│                             │
│  MILK                       │
│  ● Whole             +$0.00 │
│  ○ Oat               +$0.75 │
│  ○ Almond            +$0.75 │
│  ○ Skim              +$0.00 │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────────┐│
│  │  ADD TO CART   $5.50    ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

### Screen 4: Cart / Review Order

```
┌─────────────────────────────┐
│  ←  YOUR CART               │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ Latte (Medium, Oat)   │  │
│  │         ─ 1 +   $6.25 │  │
│  │                   🗑️  │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ Cappuccino (Small)    │  │
│  │         ─ 2 +   $9.50 │  │
│  │                   🗑️  │  │
│  └───────────────────────┘  │
│                             │
│  Subtotal            $15.75 │
│  Tax                  $1.26 │
│  TOTAL               $17.01 │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────────┐│
│  │    PLACE ORDER          ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

### Screen 5: Order Confirmation

```
┌─────────────────────────────┐
│      ORDER CONFIRMED        │
├─────────────────────────────┤
│                             │
│            ✓                │
│       Order #0042           │
│                             │
│    Your order has been      │
│    sent to the barista!     │
│                             │
│  1x Latte (Medium, Oat)     │
│  2x Cappuccino (Small)      │
│  Total: $17.01              │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────────┐│
│  │   VIEW ORDER STATUS     ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

### Screen 6: Order Status

```
┌─────────────────────────────┐
│      ORDER STATUS           │
├─────────────────────────────┤
│    Order #0042              │
│                             │
│  ● ─────── ○ ─────── ○      │
│  SENT  PREPARING   READY    │
│                             │
│  Status: SENT               │
│  Waiting for barista...     │
│                             │
│  1x Latte (Medium, Oat)     │
│  2x Cappuccino (Small)      │
│                             │
│  Page auto-refreshes        │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────────┐│
│  │    ORDER AGAIN          ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

### Screen 7: (Stretch) Loyalty Sign-Up

```
┌─────────────────────────────┐
│  ←  JOIN REWARDS            │
├─────────────────────────────┤
│    Earn points on every     │
│    purchase!                │
│                             │
│  Name                       │
│  ┌─────────────────────────┐│
│  │ Christopher             ││
│  └─────────────────────────┘│
│  Phone                      │
│  ┌─────────────────────────┐│
│  │ (555) 123-4567          ││
│  └─────────────────────────┘│
│  Email                      │
│  ┌─────────────────────────┐│
│  │ chris@email.com         ││
│  └─────────────────────────┘│
├─────────────────────────────┤
│  ┌─────────────────────────┐│
│  │    CREATE ACCOUNT       ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

---

## Admin Wireframes (Desktop Web)

### Screen 1: Admin Login

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    ┌──────────────────────────────────┐                    │
│                    │      COFFEE CHRISTOPHER          │                    │
│                    │         Admin Portal             │                    │
│                    │  Email                           │                    │
│                    │  ┌────────────────────────────┐  │                    │
│                    │  │ admin@coffeechristopher.com│  │                    │
│                    │  └────────────────────────────┘  │                    │
│                    │  Password                        │                    │
│                    │  ┌────────────────────────────┐  │                    │
│                    │  │ ••••••••••                 │  │                    │
│                    │  └────────────────────────────┘  │                    │
│                    │  ┌────────────────────────────┐  │                    │
│                    │  │         LOGIN              │  │                    │
│                    │  └────────────────────────────┘  │                    │
│                    └──────────────────────────────────┘                    │
└────────────────────────────────────────────────────────────────────────────┘
```

### Screen 2: Admin Dashboard

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│  📋 Order Queue  │   DASHBOARD                                             │
│  🍽️ Menu Mgmt    │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  📊 Sales        │   │ TODAY       │  │ PENDING     │  │ LOW STOCK   │     │
│  📦 Inventory    │   │   $847.50   │  │  ORDERS: 7  │  │  ALERTS: 3  │     │
│  ⭐ Loyalty      │   └─────────────┘  └─────────────┘  └─────────────┘     │
│     (Stretch)    │                                                         │
│                  │   PENDING ORDERS                                        │
│                  │   ┌─────────────────────────────────────────────────┐   │
│                  │   │ #0042 │ 1x Latte, 2x Cap │ SENT     │ [PREPARE]│   │
│                  │   │ #0043 │ 1x Mocha         │ PREPARING│ [READY]  │   │
│                  │   │ #0044 │ 3x Americano     │ SENT     │ [PREPARE]│   │
│                  │   └─────────────────────────────────────────────────┘   │
│                  │   LOW STOCK ALERTS                                      │
│                  │   ┌─────────────────────────────────────────────────┐   │
│                  │   │ ⚠️ Oat Milk: 2 gal (par: 5)                     │   │
│                  │   │ ⚠️ Vanilla Syrup: 1 bottle (par: 3)             │   │
│                  │   └─────────────────────────────────────────────────┘   │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 3: Order Queue

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│  📋 Order Queue  │   ORDER QUEUE                        Filter: [All ▼]   │
│     ← active     │   ┌──────────────────────────────────────────────────┐  │
│  🍽️ Menu Mgmt    │   │ ORDER  │ ITEMS           │ TOTAL │STATUS │ACTION │  │
│  📊 Sales        │   ├──────────────────────────────────────────────────┤  │
│  📦 Inventory    │   │ #0042  │ 1x Latte, 2x Cap│$17.01 │ SENT  │[PREP] │  │
│  ⭐ Loyalty      │   │ #0043  │ 1x Mocha (L)    │$6.50  │PREPAR │[READY]│  │
│                  │   │ #0044  │ 3x Americano    │$10.50 │ SENT  │[PREP] │  │
│                  │   │ #0045  │ 1x Latte (S)    │$5.00  │ READY │[DONE] │  │
│                  │   │ #0046  │ 2x Cold Brew    │$9.00  │ SENT  │[PREP] │  │
│                  │   └──────────────────────────────────────────────────┘  │
│                  │   ◀ Prev   Page 1 of 3   Next ▶                        │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 4: Menu Management

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│  📋 Order Queue  │   MENU MANAGEMENT                    [+ Add New Item]  │
│  🍽️ Menu Mgmt    │   Category: [All ▼]    Search: [____________] 🔍       │
│     ← active     │   ┌──────────────────────────────────────────────────┐  │
│  📊 Sales        │   │ ITEM       │CATEGORY │PRICE │STATUS    │ACTIONS │  │
│  📦 Inventory    │   ├──────────────────────────────────────────────────┤  │
│  ⭐ Loyalty      │   │ Latte      │Hot Drink│$5.00 │Available │[✏️][🗑️]│  │
│                  │   │ Cappuccino │Hot Drink│$4.75 │Available │[✏️][🗑️]│  │
│                  │   │ Americano  │Hot Drink│$3.50 │Available │[✏️][🗑️]│  │
│                  │   │ Mocha      │Hot Drink│$5.50 │SOLD OUT  │[✏️][🗑️]│  │
│                  │   │ Cold Brew  │Cold Drnk│$4.50 │Available │[✏️][🗑️]│  │
│                  │   │ Croissant  │Pastry   │$3.50 │Available │[✏️][🗑️]│  │
│                  │   └──────────────────────────────────────────────────┘  │
│                  │   [Manage Categories]                                   │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 5: Add/Edit Menu Item (Modal)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│  📋 Order Queue  │   ┌────────────────────────────────────────────────┐    │
│  🍽️ Menu Mgmt    │   │  ADD NEW ITEM                              ✕   │    │
│     ← active     │   │  Item Name *                                   │    │
│  📊 Sales        │   │  ┌──────────────────────────────────────────┐  │    │
│  📦 Inventory    │   │  │ Caramel Macchiato                        │  │    │
│  ⭐ Loyalty      │   │  └──────────────────────────────────────────┘  │    │
│                  │   │  Description                                   │    │
│                  │   │  ┌──────────────────────────────────────────┐  │    │
│                  │   │  │ Espresso with vanilla, milk & caramel   │  │    │
│                  │   │  └──────────────────────────────────────────┘  │    │
│                  │   │  Category *          Price *                   │    │
│                  │   │  ┌───────────────┐   ┌──────────────────────┐  │    │
│                  │   │  │ Hot Drinks ▼  │   │ $ 5.75               │  │    │
│                  │   │  └───────────────┘   └──────────────────────┘  │    │
│                  │   │  Status                                        │    │
│                  │   │  ● Available   ○ Sold Out                      │    │
│                  │   │         [Cancel]    [Save & Publish]           │    │
│                  │   └────────────────────────────────────────────────┘    │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 6: Sales Dashboard

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│  📋 Order Queue  │   SALES DASHBOARD          Period: [This Month ▼]      │
│  🍽️ Menu Mgmt    │   ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  📊 Sales        │   │ DAILY AVG  │ │ THIS WEEK  │ │ THIS MONTH │          │
│     ← active     │   │  $623.40   │ │  $4,363.80 │ │ $18,702.00 │          │
│  📦 Inventory    │   └────────────┘ └────────────┘ └────────────┘          │
│  ⭐ Loyalty      │   ┌─────────────────────────────────────────────────┐   │
│                  │   │  REVENUE TREND (Bar Chart)                      │   │
│                  │   │        ┌──┐       ┌──┐┌──┐  ┌──┐  ┌──┐         │   │
│                  │   │   ┌──┐ │  │  ┌──┐ │  ││  │  │  │  │  │         │   │
│                  │   │   Mon  Tue  Wed  Thu  Fri  Sat  Sun              │   │
│                  │   └─────────────────────────────────────────────────┘   │
│                  │   TOP 5 ITEMS                                           │
│                  │   ┌─────────────────────────────────────────────────┐   │
│                  │   │ 1. Latte.......... 423 sold...... $2,115.00    │   │
│                  │   │ 2. Cold Brew...... 387 sold...... $1,741.50    │   │
│                  │   │ 3. Cappuccino..... 298 sold...... $1,415.50    │   │
│                  │   │ 4. Americano...... 276 sold......   $966.00    │   │
│                  │   │ 5. Croissant...... 245 sold......   $857.50    │   │
│                  │   └─────────────────────────────────────────────────┘   │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 7: Inventory Tracking

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│  📋 Order Queue  │   INVENTORY TRACKING                [+ Add Ingredient] │
│  🍽️ Menu Mgmt    │   ⚠️ 3 items below par level                            │
│  📊 Sales        │   ┌──────────────────────────────────────────────────┐  │
│  📦 Inventory    │   │INGREDIENT  │UNIT│COUNT│PAR │SUPPLIER        │ACT│  │
│     ← active     │   ├──────────────────────────────────────────────────┤  │
│  ⭐ Loyalty      │   │⚠️ Oat Milk  │gal │  2  │ 5  │Sysco           │[✏️]│  │
│                  │   │⚠️ Vanilla S.│btl │  1  │ 3  │WebstaurantStore│[✏️]│  │
│                  │   │⚠️ Whole Milk│gal │  3  │ 6  │Local Dairy     │[✏️]│  │
│                  │   │  Espresso  │lb  │  8  │ 4  │Bean Co.        │[✏️]│  │
│                  │   │  Almond Mlk│gal │  4  │ 3  │Sysco           │[✏️]│  │
│                  │   │  Caramel S.│btl │  5  │ 3  │WebstaurantStore│[✏️]│  │
│                  │   └──────────────────────────────────────────────────┘  │
│                  │   [View Audit Log]                                      │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 8: Update Ingredient (Modal)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│  📋 Order Queue  │   ┌────────────────────────────────────────────────┐    │
│  🍽️ Menu Mgmt    │   │  UPDATE INGREDIENT                         ✕   │    │
│  📊 Sales        │   │  Ingredient: Oat Milk                          │    │
│  📦 Inventory    │   │  Current Count        Par Level                │    │
│     ← active     │   │  ┌────────────────┐   ┌────────────────────┐   │    │
│  ⭐ Loyalty      │   │  │ 2 gallons      │   │ 5 gallons          │   │    │
│                  │   │  └────────────────┘   └────────────────────┘   │    │
│                  │   │  Supplier              Cost per Unit           │    │
│                  │   │  ┌────────────────┐   ┌────────────────────┐   │    │
│                  │   │  │ Sysco          │   │ $ 6.99             │   │    │
│                  │   │  └────────────────┘   └────────────────────┘   │    │
│                  │   │  Supplier Contact                              │    │
│                  │   │  ┌──────────────────────────────────────────┐  │    │
│                  │   │  │ 1-800-555-1234                           │  │    │
│                  │   │  └──────────────────────────────────────────┘  │    │
│                  │   │         [Cancel]         [Save]                │    │
│                  │   └────────────────────────────────────────────────┘    │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 9: (Stretch) Loyalty — Regulars List

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│  📋 Order Queue  │   LOYALTY - REGULARS              Sort: [Points ▼]     │
│  🍽️ Menu Mgmt    │   Total Members: 127                                    │
│  📊 Sales        │   ┌──────────────────────────────────────────────────┐  │
│  📦 Inventory    │   │NAME      │PHONE        │EMAIL           │POINTS │  │
│  ⭐ Loyalty      │   ├──────────────────────────────────────────────────┤  │
│     ← active     │   │Maria S.  │555-123-4567 │maria@em.com    │ 2,450 │  │
│                  │   │John D.   │555-234-5678 │johnd@em.com    │ 1,875 │  │
│                  │   │Sarah K.  │555-345-6789 │sarahk@em.com   │ 1,640 │  │
│                  │   │Mike R.   │555-456-7890 │miker@em.com    │ 1,520 │  │
│                  │   │Lisa T.   │555-567-8901 │lisat@em.com    │ 1,380 │  │
│                  │   └──────────────────────────────────────────────────┘  │
│                  │   ◀ Prev   Page 1 of 13   Next ▶                       │
│                  │   [Export List]                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

---

# Week 6 — ERD + DB Schema + Seed Data Plan

**Date:** 02/13/2026
**Deliverables:** Entity Relationship Diagram + Database Schema + Seed Data Plan

---

## Entity Relationship Diagram (ERD)

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   CATEGORY   │        │  MENU_ITEM   │        │   MODIFIER   │
├──────────────┤        ├──────────────┤        ├──────────────┤
│ PK id        │1      *│ PK id        │1      *│ PK id        │
│    name      │───────▶│    name      │───────▶│    name      │
│    sort_order│        │    description│        │    options   │
│    created_at│        │    price     │        │    created_at│
└──────────────┘        │    image_url │        └──────────────┘
                        │    available │
                        │ FK category_id│
                        │    created_at│
                        │    updated_at│
                        └──────────────┘
                               │ 1
                               │ *
                        ┌──────────────┐
                        │  ORDER_ITEM  │
                        ├──────────────┤
                        │ PK id        │
                        │ FK order_id  │◀──────────────┐
                        │ FK item_id   │               │
                        │    quantity  │        ┌──────────────┐
                        │    unit_price│        │    ORDER     │
                        │    modifiers │        ├──────────────┤
                        └──────────────┘        │ PK id        │
                                                │    order_num │
                                                │    status    │
                                                │    subtotal  │
                                                │    tax       │
                                                │    total     │
                                                │    created_at│
                                                │    updated_at│
                                                └──────────────┘

┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  INGREDIENT  │        │  AUDIT_LOG   │        │    ADMIN     │
├──────────────┤        ├──────────────┤        ├──────────────┤
│ PK id        │1      *│ PK id        │        │ PK id        │
│    name      │───────▶│ FK ingred_id │        │    email     │
│    unit      │        │    old_count │        │    password_ │
│    count     │        │    new_count │        │    hash      │
│    par_level │        │    changed_by│        │    created_at│
│    supplier  │        │    changed_at│        └──────────────┘
│    contact   │        └──────────────┘
│    cost/unit │
│    created_at│
│    updated_at│
└──────────────┘

┌──────────────┐        ┌──────────────┐
│  LOYALTY_    │        │  LOYALTY_    │
│  CUSTOMER    │        │  TRANSACTION │
├──────────────┤        ├──────────────┤
│ PK id        │1      *│ PK id        │
│    name      │───────▶│ FK customer_id│
│    phone     │        │ FK order_id  │
│    email     │        │    points    │
│    points_   │        │    type      │
│    balance   │        │    created_at│
│    created_at│        └──────────────┘
└──────────────┘
```

---

## DB Schema

### Table: `categories`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| sort_order | INT | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Table: `menu_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| category_id | INT | FK → categories.id |
| name | VARCHAR(150) | NOT NULL |
| description | TEXT | NULLABLE |
| price | DECIMAL(8,2) | NOT NULL |
| image_url | VARCHAR(255) | NULLABLE |
| available | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Table: `modifiers`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| item_id | INT | FK → menu_items.id |
| name | VARCHAR(100) | NOT NULL |
| options | JSON | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Table: `orders`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| order_num | VARCHAR(10) | NOT NULL, UNIQUE |
| status | ENUM | 'sent', 'preparing', 'ready' DEFAULT 'sent' |
| subtotal | DECIMAL(8,2) | NOT NULL |
| tax | DECIMAL(8,2) | NOT NULL |
| total | DECIMAL(8,2) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Table: `order_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| order_id | INT | FK → orders.id |
| item_id | INT | FK → menu_items.id |
| quantity | INT | NOT NULL, DEFAULT 1 |
| unit_price | DECIMAL(8,2) | NOT NULL |
| modifiers | JSON | NULLABLE |

### Table: `ingredients`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(150) | NOT NULL |
| unit | VARCHAR(50) | NOT NULL |
| count | DECIMAL(8,2) | NOT NULL, DEFAULT 0 |
| par_level | DECIMAL(8,2) | NOT NULL |
| supplier | VARCHAR(150) | NULLABLE |
| supplier_contact | VARCHAR(150) | NULLABLE |
| cost_per_unit | DECIMAL(8,2) | NULLABLE |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Table: `audit_log`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| ingredient_id | INT | FK → ingredients.id |
| old_count | DECIMAL(8,2) | NOT NULL |
| new_count | DECIMAL(8,2) | NOT NULL |
| changed_by | VARCHAR(100) | NOT NULL |
| changed_at | TIMESTAMP | DEFAULT NOW() |

### Table: `admins`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Table: `loyalty_customers` *(Stretch)*
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(150) | NOT NULL |
| phone | VARCHAR(20) | NOT NULL, UNIQUE |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| points_balance | INT | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Table: `loyalty_transactions` *(Stretch)*
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, AUTO_INCREMENT |
| customer_id | INT | FK → loyalty_customers.id |
| order_id | INT | FK → orders.id, NULLABLE |
| points | INT | NOT NULL |
| type | ENUM | 'earned', 'redeemed' |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

## Seed Data Plan

### Categories (4 records)
| name | sort_order |
|------|------------|
| Hot Drinks | 1 |
| Cold Drinks | 2 |
| Pastries | 3 |
| Seasonal | 4 |

### Menu Items (8 records)
| name | category | price | available |
|------|----------|-------|-----------|
| Latte | Hot Drinks | $5.00 | true |
| Cappuccino | Hot Drinks | $4.75 | true |
| Americano | Hot Drinks | $3.50 | true |
| Mocha | Hot Drinks | $5.50 | true |
| Cold Brew | Cold Drinks | $4.50 | true |
| Iced Latte | Cold Drinks | $5.25 | true |
| Croissant | Pastries | $3.50 | true |
| Pumpkin Latte | Seasonal | $6.00 | false |

### Ingredients (10 records)
| name | unit | count | par_level | supplier |
|------|------|-------|-----------|----------|
| Whole Milk | gallon | 6 | 6 | Local Dairy |
| Oat Milk | gallon | 2 | 5 | Sysco |
| Almond Milk | gallon | 4 | 3 | Sysco |
| Skim Milk | gallon | 3 | 4 | Local Dairy |
| Espresso Beans | lb | 8 | 4 | Bean Co. |
| Vanilla Syrup | bottle | 1 | 3 | WebstaurantStore |
| Caramel Syrup | bottle | 5 | 3 | WebstaurantStore |
| Chocolate Sauce | bottle | 4 | 2 | WebstaurantStore |
| Cold Brew Concentrate | gallon | 3 | 2 | Bean Co. |
| Croissants | unit | 12 | 10 | Local Bakery |

### Admin (1 record)
| email | password |
|-------|----------|
| admin@coffeechristopher.com | (hashed at seed time) |

---

# Week 7 — Architecture + Tech Stack + Deployment Plan

**Date:** 02/20/2026
**Deliverables:** Architecture Outline + Tech Stack Decision + Deployment Plan

---

## Architecture Outline

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   ┌─────────────────────┐       ┌─────────────────────┐        │
│   │   Customer Mobile   │       │    Admin Desktop    │        │
│   │   Web (React)       │       │    Web (React)      │        │
│   │   QR → Menu →       │       │    Dashboard →      │        │
│   │   Order → Status    │       │    Orders → Inventory│       │
│   └──────────┬──────────┘       └──────────┬──────────┘        │
└──────────────┼──────────────────────────────┼───────────────────┘
               ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│              Node.js + Express REST API                         │
│   /api/menu        /api/orders      /api/admin                  │
│   /api/inventory   /api/dashboard   /api/loyalty (stretch)      │
└─────────────────────────────────┬───────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│              PostgreSQL (primary database)                      │
│   categories   menu_items   orders   order_items                │
│   ingredients  audit_log    admins   loyalty (stretch)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Decision

### Frontend
| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **React** | Component-based, widely supported, fast mobile rendering |
| Styling | **Tailwind CSS** | Utility-first, fast to build clean mobile/desktop layouts |
| State Management | **React Context** | Sufficient for this scale; avoids Redux overhead |
| Charts | **Recharts** | Simple React-native charting library for sales dashboard |
| HTTP Client | **Axios** | Clean API calls, easy error handling |

### Backend
| Layer | Choice | Reason |
|-------|--------|--------|
| Runtime | **Node.js** | JavaScript full-stack consistency, large ecosystem |
| Framework | **Express.js** | Lightweight, easy REST API setup |
| Auth | **JWT** | Stateless admin authentication, simple to implement |
| ORM | **Prisma** | Type-safe DB queries, easy schema migrations |
| Validation | **Zod** | Schema validation for all API inputs |

### Database
| Layer | Choice | Reason |
|-------|--------|--------|
| Primary DB | **PostgreSQL** | Relational, handles transactions well, strong with financial data |
| Hosting | **Supabase** | Managed PostgreSQL with free tier, easy setup |

### Deployment
| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | **Vercel** | Free tier, auto-deploys from GitHub, optimized for React |
| Backend | **Railway** | Simple Node.js hosting, free tier, connects easily to PostgreSQL |
| Domain | **Namecheap** | Low-cost domain for QR code URL |
| QR Code | **QR code library** | Generated and printed once, points to deployed menu URL |

---

## Application Structure

```
coffee-christopher-ops/
│
├── client/                      # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── customer/        # Menu, Item Detail, Cart, Status
│   │   │   └── admin/           # Dashboard, Orders, Menu, Sales, Inventory
│   │   ├── components/          # Shared UI components
│   │   ├── context/             # React Context (cart, auth)
│   │   ├── hooks/               # Custom hooks
│   │   └── api/                 # Axios API calls
│   └── public/
│
├── server/                      # Express backend
│   ├── routes/
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── admin.js
│   │   ├── inventory.js
│   │   ├── dashboard.js
│   │   └── loyalty.js           # Stretch
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── validate.js          # Zod validation
│   ├── prisma/
│   │   ├── schema.prisma        # DB schema
│   │   └── seed.js              # Seed data
│   └── index.js
│
└── docs/                        # Sprint deliverables
```

---

## Deployment Plan

### Environments
| Environment | Purpose | URL Pattern |
|-------------|---------|-------------|
| Development | Local dev and testing | localhost:3000 / localhost:5000 |
| Production | Live app for real use | coffeechristopher.com |

### Deployment Steps

**Step 1: Database (Supabase)**
- Create Supabase project
- Run Prisma migrations to create all tables
- Run seed script to populate initial data
- Copy connection string to backend environment variables

**Step 2: Backend (Railway)**
- Connect Railway to GitHub repository
- Set environment variables (DATABASE_URL, JWT_SECRET)
- Railway auto-deploys on every push to main
- Verify all API endpoints return correct responses

**Step 3: Frontend (Vercel)**
- Connect Vercel to GitHub repository
- Set environment variable (REACT_APP_API_URL → Railway backend URL)
- Vercel auto-deploys on every push to main
- Verify customer and admin flows work end-to-end

**Step 4: Domain + QR Code**
- Point domain DNS to Vercel deployment
- Generate QR code pointing to `coffeechristopher.com/menu`
- Print QR code and place at shop counter

### Environment Variables
| Variable | Location | Description |
|----------|----------|-------------|
| DATABASE_URL | Backend | Supabase PostgreSQL connection string |
| JWT_SECRET | Backend | Secret key for signing admin tokens |
| REACT_APP_API_URL | Frontend | Backend Railway URL |

### CI/CD Flow

```
Developer pushes to GitHub
        │
        ▼
┌───────────────┐     ┌───────────────┐
│    Vercel     │     │    Railway    │
│ Auto-deploys  │     │ Auto-deploys  │
│   Frontend    │     │   Backend     │
└───────────────┘     └───────────────┘
        │                    │
        ▼                    ▼
   Customer &           API connects
   Admin UI live        to Supabase DB
```

---

# Week 8 — Midterm Checkpoint

**Date:** 02/27/2026
**Deliverables:** MVP Design Review + Risk Review + Sprint Plan

---

## MVP Design Review

### What is the MVP?
The MVP (Minimum Viable Product) is the smallest working version of Coffee Christopher Ops Suite that delivers real value. It covers the core customer ordering experience and admin menu + order management.

### MVP Scope Confirmation

| Feature | In MVP | Notes |
|---------|--------|-------|
| QR code → mobile menu | Yes | Core customer entry point |
| Browse menu by category | Yes | Required for ordering |
| Item detail + customization | Yes | Milk type, size options |
| Cart + order submission | Yes | Core transaction |
| Order status (Sent/Preparing/Ready) | Yes | Customer feedback loop |
| Admin login | Yes | Secure portal access |
| Admin order queue | Yes | Required to fulfill orders |
| Admin menu CRUD | Yes | Required to manage menu |
| Availability toggle | Yes | Sold-out management |
| Sales dashboard | No | Week 12 (post-MVP) |
| Inventory tracking | No | Week 13 (post-MVP) |
| Loyalty/rewards | No | Stretch only |

### MVP Success Checklist
- [ ] Customer can scan QR, browse, customize, and place an order in < 60 seconds
- [ ] Order appears in admin queue immediately after submission
- [ ] Admin can move order through Sent → Preparing → Ready
- [ ] Customer order status page updates within 5 seconds of admin change
- [ ] Admin can add, edit, delete, and toggle menu items
- [ ] Changes to menu reflect on customer side within 5 seconds
- [ ] Admin login is protected by JWT authentication

### Deliverables Completed Pre-Midterm

| Week | Deliverable | Status |
|------|-------------|--------|
| 3 | Proposal + Initial Backlog | Done |
| 4 | Requirements (User Stories, Use Cases, AC) | Done |
| 5 | Wireframes + User Flows | Done |
| 6 | ERD + DB Schema + Seed Data | Done |
| 7 | Architecture + Tech Stack + Deployment Plan | Done |

---

## Risk Review

### Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R-01 | Loyalty feature creeps into scope | High | Medium | Locked as stretch; not touched until Week 15 only if ahead |
| R-02 | Inventory accuracy depends on manual input | High | Medium | Simple workflow + audit logging to catch errors |
| R-03 | Real-time order status updates are complex | Medium | High | Use polling every 5 seconds instead of WebSockets |
| R-04 | QR code links to broken URL | Low | High | Test before printing; use redirect URL so it can change without reprint |
| R-05 | Schema changes mid-project break data | Medium | High | Use Prisma migrations; never edit schema directly in production |
| R-06 | Admin portal exposed without auth | Low | High | JWT auth required on all admin routes from day one |
| R-07 | Mobile layout breaks on older phones | Medium | Medium | Test on 3 device sizes during Week 9; use Tailwind responsive classes |
| R-08 | Free tier hosting causes slowdowns | Low | Medium | Supabase + Railway free tiers sufficient for capstone scale |
| R-09 | Scope expands beyond what is testable | Medium | High | Freeze scope after midterm; new ideas go to future backlog |
| R-10 | Perishables expire without inventory update | High | Medium | Audit log makes it easy to spot stale counts |

### Top 3 Risks to Watch
1. **R-09** — Scope creep after midterm (freeze scope, log extras for future)
2. **R-03** — Real-time order status (use polling, avoid WebSocket complexity)
3. **R-05** — Schema changes mid-project (always use Prisma migrations)

---

## Sprint Plan (Weeks 9–15)

### Overview

```
Week 9  ──▶ Customer Module (dynamic menu from DB)
Week 10 ──▶ Ordering (cart + submit + queue) ──▶ RELEASE 1
Week 11 ──▶ Admin menu CRUD + availability toggles
Week 12 ──▶ Sales dashboard ──▶ RELEASE 2
Week 13 ──▶ Inventory module
Week 14 ──▶ Testing + hardening ──▶ RELEASE 3
Week 15 ──▶ Stretch (loyalty) + polish + final demo
```

### Detailed Sprint Breakdown

#### Week 9 (03/05/2026) — Customer Module
| Task | Description |
|------|-------------|
| Set up React project + routing | Customer routes: /menu, /menu/:category, /item/:id, /status/:id |
| Connect frontend to API | Fetch categories and menu items from backend |
| Build Menu Home screen | Category grid, dynamic from DB |
| Build Category View screen | Item list filtered by category |
| Build Item Detail screen | Item info + modifiers + price calculation |

#### Week 10 (03/12/2026) — Ordering → Release 1
| Task | Description |
|------|-------------|
| Build Cart screen | Add/remove/adjust items, show totals |
| Build Order Submission | POST to /api/orders, show confirmation |
| Build Order Status screen | Poll /api/orders/:id every 5 seconds |
| Build Admin Order Queue | View all orders, update status buttons |
| **Release 1 checkpoint** | Customer can order end-to-end, admin can manage queue |

#### Week 11 (03/19/2026) — Admin Menu CRUD
| Task | Description |
|------|-------------|
| Build Admin Login | JWT auth flow |
| Build Menu Management screen | Table of all items with edit/delete |
| Build Add/Edit Item modal | Form with validation, category select |
| Build Category Management | Create/rename/delete categories |
| Build Availability Toggle | Sold-out switch, reflects live on customer side |

#### Week 12 (03/26/2026) — Sales Dashboard → Release 2
| Task | Description |
|------|-------------|
| Build Sales Dashboard screen | Period selector (day/week/month/year) |
| Daily + weekly + monthly + yearly totals | Aggregate queries from orders table |
| Top 5 items chart | Bar chart using Recharts |
| Order volume trend chart | Line chart by day/week |
| **Release 2 checkpoint** | Admin can view all sales analytics |

#### Week 13 (04/02/2026) — Inventory Module
| Task | Description |
|------|-------------|
| Build Inventory Tracking screen | Table of ingredients with counts |
| Add/edit ingredient modal | Name, unit, count, par level, supplier |
| Low-stock alert display | Banner + highlighted rows below par |
| Audit log view | Table of all count changes |
| Low-stock simulation | Test with 10 ingredients below par |

#### Week 14 (04/09/2026) — Testing + Hardening → Release 3
| Task | Description |
|------|-------------|
| Write unit tests | API route tests (menu, orders, inventory) |
| Write end-to-end tests | Customer order flow + admin queue flow |
| Bug fixes | Address issues found during testing |
| Performance check | Verify load times on mobile |
| Deployment guide | Step-by-step setup doc |
| User/admin quick-start manual | How-to guide for real use |
| **Release 3 checkpoint** | Fully tested, stable, deployed |

#### Week 15 (04/16/2026) — Stretch + Final Demo
| Task | Description | Condition |
|------|-------------|-----------|
| Loyalty registration | Customer sign-up flow | Only if ahead of schedule |
| Points accrual + redemption | Earn/redeem logic | Only if ahead of schedule |
| Regulars list (admin) | View + sort customer list | Only if ahead of schedule |
| Final polish | UI cleanup, responsive fixes | Always |
| Final demo package | Slide deck + live demo + test results | Always |

---

## Milestone Summary

| Release | Week | Includes |
|---------|------|----------|
| **Release 1 (MVP Ordering)** | Week 10 | QR menu + ordering + order queue |
| **Release 2 (Analytics)** | Week 12 | Sales dashboard + admin CRUD |
| **Release 3 (Inventory + Stability)** | Week 14 | Inventory + testing + deployment |
| **Final Demo** | Week 15 | Polish + stretch + presentation |

---

*Coffee Christopher Ops Suite — CSIS 4903 Capstone Project*
