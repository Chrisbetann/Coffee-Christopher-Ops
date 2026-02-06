# Coffee Christopher Ops Suite
## Sprint Deliverables: Week 3 & Week 4

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
                    │ Daily       │      │ Totals     │
                    │ Weekly      │      │ Top 5      │
                    │ Monthly     │      │ Charts     │
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
│                             │
├─────────────────────────────┤
│  🛒 Cart (0)                │
└─────────────────────────────┘
```

### Screen 2: Category View (e.g., Hot Drinks)

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
│       │           │         │
│       │   ☕ IMG  │         │
│       │           │         │
│       └───────────┘         │
│                             │
│  Latte                $5.00 │
│  Espresso with steamed      │
│  milk and light foam.       │
│                             │
│  ─────────────────────────  │
│  SIZE                       │
│  ○ Small (12oz)      +$0.00 │
│  ● Medium (16oz)     +$0.50 │
│  ○ Large (20oz)      +$1.00 │
│                             │
│  ─────────────────────────  │
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
│  │ Latte (Medium)        │  │
│  │ Oat Milk              │  │
│  │         ─ 1 +   $6.25 │  │
│  │                   🗑️  │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ Cappuccino (Small)    │  │
│  │ Whole Milk            │  │
│  │         ─ 2 +   $9.50 │  │
│  │                   🗑️  │  │
│  └───────────────────────┘  │
│                             │
│  ─────────────────────────  │
│                             │
│  Subtotal            $15.75 │
│  Tax                  $1.26 │
│  ─────────────────────────  │
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
│                             │
│    Order #0042              │
│                             │
│    Your order has been      │
│    sent to the barista!     │
│                             │
│  ─────────────────────────  │
│                             │
│  1x Latte (Medium, Oat)     │
│  2x Cappuccino (Small)      │
│                             │
│  Total: $17.01              │
│                             │
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
│                             │
│    Order #0042              │
│                             │
│  ┌─────────────────────────┐│
│  │                         ││
│  │    ● ─────── ○ ─────── ○││
│  │   SENT   PREPARING  READY│
│  │                         ││
│  └─────────────────────────┘│
│                             │
│    Status: SENT             │
│    Waiting for barista...   │
│                             │
│  ─────────────────────────  │
│                             │
│  1x Latte (Medium, Oat)     │
│  2x Cappuccino (Small)      │
│                             │
│                             │
│                             │
│    Page auto-refreshes      │
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
│                             │
│    Earn points on every     │
│    purchase!                │
│                             │
│  ─────────────────────────  │
│                             │
│  Name                       │
│  ┌─────────────────────────┐│
│  │ Christopher             ││
│  └─────────────────────────┘│
│                             │
│  Phone                      │
│  ┌─────────────────────────┐│
│  │ (555) 123-4567          ││
│  └─────────────────────────┘│
│                             │
│  Email                      │
│  ┌─────────────────────────┐│
│  │ chris@email.com         ││
│  └─────────────────────────┘│
│                             │
│                             │
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
│                                                                            │
│                                                                            │
│                                                                            │
│                    ┌──────────────────────────────────┐                    │
│                    │                                  │                    │
│                    │      COFFEE CHRISTOPHER          │                    │
│                    │         Admin Portal             │                    │
│                    │                                  │                    │
│                    │  Email                           │                    │
│                    │  ┌────────────────────────────┐  │                    │
│                    │  │ admin@coffeechristopher.com│  │                    │
│                    │  └────────────────────────────┘  │                    │
│                    │                                  │                    │
│                    │  Password                        │                    │
│                    │  ┌────────────────────────────┐  │                    │
│                    │  │ ••••••••••                 │  │                    │
│                    │  └────────────────────────────┘  │                    │
│                    │                                  │                    │
│                    │  ┌────────────────────────────┐  │                    │
│                    │  │         LOGIN              │  │                    │
│                    │  └────────────────────────────┘  │                    │
│                    │                                  │                    │
│                    └──────────────────────────────────┘                    │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Screen 2: Admin Dashboard (Home)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│                  │                                                         │
│  📋 Order Queue  │   DASHBOARD                                             │
│                  │                                                         │
│  🍽️ Menu Mgmt    │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│                  │   │ TODAY       │  │ PENDING     │  │ LOW STOCK   │     │
│  📊 Sales        │   │   $847.50   │  │  ORDERS     │  │  ALERTS     │     │
│                  │   │  +12% ↑     │  │     7       │  │     3       │     │
│  📦 Inventory    │   └─────────────┘  └─────────────┘  └─────────────┘     │
│                  │                                                         │
│  ⭐ Loyalty      │   ───────────────────────────────────────────────────   │
│     (Stretch)    │                                                         │
│                  │   PENDING ORDERS                                        │
│                  │   ┌─────────────────────────────────────────────────┐   │
│                  │   │ #0042 │ 1x Latte, 2x Cap │ SENT     │ [PREPARE]│   │
│                  │   ├─────────────────────────────────────────────────┤   │
│                  │   │ #0043 │ 1x Mocha         │ PREPARING│ [READY]  │   │
│                  │   ├─────────────────────────────────────────────────┤   │
│                  │   │ #0044 │ 3x Americano     │ SENT     │ [PREPARE]│   │
│                  │   └─────────────────────────────────────────────────┘   │
│                  │                                                         │
│                  │   LOW STOCK ALERTS                                      │
│                  │   ┌─────────────────────────────────────────────────┐   │
│                  │   │ ⚠️ Oat Milk: 2 gal (par: 5)                     │   │
│                  │   │ ⚠️ Vanilla Syrup: 1 bottle (par: 3)             │   │
│                  │   └─────────────────────────────────────────────────┘   │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 3: Order Queue

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│                  │                                                         │
│  📋 Order Queue  │   ORDER QUEUE                        Filter: [All ▼]   │
│     ← active     │                                                         │
│  🍽️ Menu Mgmt    │   ┌──────────────────────────────────────────────────┐  │
│                  │   │ ORDER   │ ITEMS          │ TOTAL │STATUS │ACTION │  │
│  📊 Sales        │   ├──────────────────────────────────────────────────┤  │
│                  │   │ #0042   │ 1x Latte (M)   │$17.01 │ SENT  │[PREP] │  │
│  📦 Inventory    │   │         │ 2x Cappuccino  │       │       │       │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│  ⭐ Loyalty      │   │ #0043   │ 1x Mocha (L)   │$6.50  │PREPAR │[READY]│  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ #0044   │ 3x Americano   │$10.50 │ SENT  │[PREP] │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ #0045   │ 1x Latte (S)   │$5.00  │ READY │[DONE] │  │
│                  │   │         │ Oat Milk       │       │       │       │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ #0046   │ 2x Cold Brew   │$9.00  │ SENT  │[PREP] │  │
│                  │   └──────────────────────────────────────────────────┘  │
│                  │                                                         │
│                  │   ◀ Prev   Page 1 of 3   Next ▶                        │
│                  │                                                         │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 4: Menu Management

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│                  │                                                         │
│  📋 Order Queue  │   MENU MANAGEMENT                    [+ Add New Item]  │
│                  │                                                         │
│  🍽️ Menu Mgmt    │   Category: [All ▼]    Search: [____________] 🔍       │
│     ← active     │                                                         │
│  📊 Sales        │   ┌──────────────────────────────────────────────────┐  │
│                  │   │ ITEM       │CATEGORY │PRICE │STATUS    │ACTIONS │  │
│  📦 Inventory    │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Latte      │Hot Drink│$5.00 │Available │[✏️][🗑️]│  │
│  ⭐ Loyalty      │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Cappuccino │Hot Drink│$4.75 │Available │[✏️][🗑️]│  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Americano  │Hot Drink│$3.50 │Available │[✏️][🗑️]│  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Mocha      │Hot Drink│$5.50 │SOLD OUT  │[✏️][🗑️]│  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Cold Brew  │Cold Drnk│$4.50 │Available │[✏️][🗑️]│  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Croissant  │Pastry   │$3.50 │Available │[✏️][🗑️]│  │
│                  │   └──────────────────────────────────────────────────┘  │
│                  │                                                         │
│                  │   [Manage Categories]                                   │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 5: Add/Edit Menu Item (Modal)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│                  │                                                         │
│  📋 Order Queue  │   ┌────────────────────────────────────────────────┐    │
│                  │   │  ADD NEW ITEM                              ✕   │    │
│  🍽️ Menu Mgmt    │   ├────────────────────────────────────────────────┤    │
│     ← active     │   │                                                │    │
│  📊 Sales        │   │  Item Name *                                   │    │
│                  │   │  ┌──────────────────────────────────────────┐  │    │
│  📦 Inventory    │   │  │ Caramel Macchiato                        │  │    │
│                  │   │  └──────────────────────────────────────────┘  │    │
│  ⭐ Loyalty      │   │                                                │    │
│                  │   │  Description                                   │    │
│                  │   │  ┌──────────────────────────────────────────┐  │    │
│                  │   │  │ Espresso with vanilla, milk & caramel   │  │    │
│                  │   │  └──────────────────────────────────────────┘  │    │
│                  │   │                                                │    │
│                  │   │  Category *          Price *                   │    │
│                  │   │  ┌───────────────┐   ┌──────────────────────┐  │    │
│                  │   │  │ Hot Drinks ▼  │   │ $ 5.75               │  │    │
│                  │   │  └───────────────┘   └──────────────────────┘  │    │
│                  │   │                                                │    │
│                  │   │  Status                                        │    │
│                  │   │  ● Available   ○ Sold Out                      │    │
│                  │   │                                                │    │
│                  │   │         [Cancel]    [Save & Publish]           │    │
│                  │   └────────────────────────────────────────────────┘    │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 6: Sales Dashboard

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│                  │                                                         │
│  📋 Order Queue  │   SALES DASHBOARD          Period: [This Month ▼]      │
│                  │                                                         │
│  🍽️ Menu Mgmt    │   ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│                  │   │ DAILY AVG  │ │ THIS WEEK  │ │ THIS MONTH │          │
│  📊 Sales        │   │  $623.40   │ │  $4,363.80 │ │ $18,702.00 │          │
│     ← active     │   │  142 orders│ │  994 orders│ │ 4,267 orders│         │
│  📦 Inventory    │   └────────────┘ └────────────┘ └────────────┘          │
│                  │                                                         │
│  ⭐ Loyalty      │   ┌─────────────────────────────────────────────────┐   │
│                  │   │  REVENUE TREND                                  │   │
│                  │   │                                          ┌──┐   │   │
│                  │   │                                    ┌──┐  │  │   │   │
│                  │   │                          ┌──┐┌──┐  │  │  │  │   │   │
│                  │   │              ┌──┐  ┌──┐  │  ││  │  │  │  │  │   │   │
│                  │   │        ┌──┐  │  │  │  │  │  ││  │  │  │  │  │   │   │
│                  │   │   ┌──┐ │  │  │  │  │  │  │  ││  │  │  │  │  │   │   │
│                  │   │   Mon  Tue  Wed  Thu  Fri  Sat  Sun              │   │
│                  │   └─────────────────────────────────────────────────┘   │
│                  │                                                         │
│                  │   TOP 5 ITEMS                                           │
│                  │   ┌─────────────────────────────────────────────────┐   │
│                  │   │ 1. Latte.............. 423 sold..... $2,115.00 │   │
│                  │   │ 2. Cold Brew.......... 387 sold..... $1,741.50 │   │
│                  │   │ 3. Cappuccino......... 298 sold..... $1,415.50 │   │
│                  │   │ 4. Americano.......... 276 sold..... $  966.00 │   │
│                  │   │ 5. Croissant.......... 245 sold..... $  857.50 │   │
│                  │   └─────────────────────────────────────────────────┘   │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 7: Inventory Tracking

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│                  │                                                         │
│  📋 Order Queue  │   INVENTORY TRACKING                [+ Add Ingredient] │
│                  │                                                         │
│  🍽️ Menu Mgmt    │   ⚠️ 3 items below par level                            │
│                  │                                                         │
│  📊 Sales        │   ┌──────────────────────────────────────────────────┐  │
│                  │   │INGREDIENT  │UNIT │COUNT│PAR  │SUPPLIER   │ACTION│  │
│  📦 Inventory    │   ├──────────────────────────────────────────────────┤  │
│     ← active     │   │⚠️Oat Milk   │gal  │ 2   │ 5   │Sysco      │[✏️]  │  │
│  ⭐ Loyalty      │   ├──────────────────────────────────────────────────┤  │
│                  │   │⚠️Vanilla Syr│btl  │ 1   │ 3   │WebstaurantStore│[✏️]│ │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │⚠️Whole Milk │gal  │ 3   │ 6   │Local Dairy│[✏️]  │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Espresso   │lb   │ 8   │ 4   │Bean Co.   │[✏️]  │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Almond Milk│gal  │ 4   │ 3   │Sysco      │[✏️]  │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │ Caramel Syr│btl  │ 5   │ 3   │WebstaurantStore│[✏️]│ │
│                  │   └──────────────────────────────────────────────────┘  │
│                  │                                                         │
│                  │   [View Audit Log]                                      │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 8: Update Inventory Count (Modal)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│                  │                                                         │
│  📋 Order Queue  │   ┌────────────────────────────────────────────────┐    │
│                  │   │  UPDATE INGREDIENT                         ✕   │    │
│  🍽️ Menu Mgmt    │   ├────────────────────────────────────────────────┤    │
│                  │   │                                                │    │
│  📊 Sales        │   │  Ingredient: Oat Milk                          │    │
│                  │   │                                                │    │
│  📦 Inventory    │   │  Current Count        Par Level                │    │
│     ← active     │   │  ┌────────────────┐   ┌────────────────────┐   │    │
│  ⭐ Loyalty      │   │  │ 2              │   │ 5                  │   │    │
│                  │   │  └────────────────┘   └────────────────────┘   │    │
│                  │   │  gallons               gallons                 │    │
│                  │   │                                                │    │
│                  │   │  Supplier              Cost per Unit           │    │
│                  │   │  ┌────────────────┐   ┌────────────────────┐   │    │
│                  │   │  │ Sysco          │   │ $ 6.99             │   │    │
│                  │   │  └────────────────┘   └────────────────────┘   │    │
│                  │   │                                                │    │
│                  │   │  Supplier Contact                              │    │
│                  │   │  ┌──────────────────────────────────────────┐  │    │
│                  │   │  │ 1-800-555-1234                           │  │    │
│                  │   │  └──────────────────────────────────────────┘  │    │
│                  │   │                                                │    │
│                  │   │         [Cancel]         [Save]                │    │
│                  │   └────────────────────────────────────────────────┘    │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

### Screen 9: (Stretch) Loyalty - Regulars List

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COFFEE CHRISTOPHER ADMIN                              👤 Admin  │ Logout │
├──────────────────┬─────────────────────────────────────────────────────────┤
│                  │                                                         │
│  📋 Order Queue  │   LOYALTY - REGULARS              Sort: [Points ▼]     │
│                  │                                                         │
│  🍽️ Menu Mgmt    │   Total Members: 127                                    │
│                  │                                                         │
│  📊 Sales        │   ┌──────────────────────────────────────────────────┐  │
│                  │   │NAME        │PHONE       │EMAIL         │POINTS  │  │
│  📦 Inventory    │   ├──────────────────────────────────────────────────┤  │
│                  │   │Maria S.    │555-123-4567│maria@em.com  │ 2,450  │  │
│  ⭐ Loyalty      │   ├──────────────────────────────────────────────────┤  │
│     ← active     │   │John D.     │555-234-5678│johnd@em.com  │ 1,875  │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │Sarah K.    │555-345-6789│sarahk@em.com │ 1,640  │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │Mike R.     │555-456-7890│miker@em.com  │ 1,520  │  │
│                  │   ├──────────────────────────────────────────────────┤  │
│                  │   │Lisa T.     │555-567-8901│lisat@em.com  │ 1,380  │  │
│                  │   └──────────────────────────────────────────────────┘  │
│                  │                                                         │
│                  │   ◀ Prev   Page 1 of 13   Next ▶                       │
│                  │                                                         │
│                  │   [Export List]                                         │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

---

# Up Next: Week 6 (02/13/2026)

**Deliverable:** ERD + DB Schema + Seed Data Plan (Menu + Ingredients)

---

*Document generated for CSIS 4903 Capstone Project*
