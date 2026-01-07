# Reseller & Partner Portal – Business Guide

## What This Feature Does

The Reseller & Partner Portal turns your platform into a **partner-driven sales engine**.
Instead of traditional wholesale (where partners buy inventory at a discount), this model
is **commission-based**:

- Partners (gyms, trainers, influencers, locations) get **digital storefronts** that show your products.
- Customers buy at your **normal retail price** on your existing e‑commerce site.
- You handle **payments, inventory, and shipping** exactly as today.
- The system tracks **which reseller and storefront generated each order**, and calculates commissions.

You get:

- A scalable B2B2C / affiliate-style reseller channel.
- Clear attribution and reporting per reseller, location, and tier.
- A controlled brand experience (pricing, catalog, and fulfillment are centralised).

## How It Works (Non-Technical)

### 1. Resellers & Storefronts

- A **reseller** is a business partner (e.g. a gym, trainer, or influencer).
- Each reseller can have **multiple storefronts**, for example:
  - “Gym Alpha – Main Entrance Screen”
  - “Gym Alpha – Changing Room QR Code”
  - “Coach Sarah’s Link in Bio”

Each storefront is just a **different entry point** into your products:

- The storefront might be a tablet, a QR code, a micro-site, or a shared link.
- When a customer uses that entry point, all their orders are **attributed to that storefront and reseller**.

### 2. Customer Journey (End Customer)

From the customer's point of view, nothing changes:

1. They see your products on a reseller storefront (screen/link).
2. They tap or scan and are taken to your normal online store.
3. They add products to cart and checkout as usual.
4. They pay via Stripe and get the same order emails and tracking they do today.

**Behind the scenes**, the system quietly remembers:

- Which reseller + storefront sent this customer.
- How much product value (GMV) they generated.
- How much commission the reseller should earn.

### 3. Tiers & Commissions

Resellers are grouped into tiers with different commission rates:

| Tier      | Commission (Example) |
|-----------|----------------------|
| Bronze    | 10%                  |
| Silver    | 15%                  |
| Gold      | 25%                  |
| Platinum  | 35%                  |

You can adjust these numbers, but conceptually:

- **Higher tiers = higher commission** and potentially better assets/support.
- Tiers represent **partnership level**, not purchasing power (no credit / bulk buying).

Commission is calculated on **product value only**:

- Base = sum of product prices **after discounts**, excluding VAT and shipping.
- Commission = `base × commission %`.
- When payment succeeds, the commission is marked as **earned**.
- If the order is cancelled or refunded, the commission is **voided or adjusted**.

### 4. Who Gets Paid and When

- The **brand** receives all customer payments as normal.
- The system builds a **commission ledger** per reseller:
  - Order amount (product subtotal).
  - Commission rate (from tier or overrides).
  - Commission amount.
  - Status: earned, voided, or paid.
- Finance/admin teams use this ledger to:
  - Calculate payouts (e.g. monthly).
  - Mark entries as **paid** once settled.

You can also set **minimum payout thresholds** by tier (e.g. don’t pay out under £50).

## What Resellers See

### Reseller Dashboard

Each reseller gets secure access to:

- **Profile & Tier**
  - Company info, contact details, and current tier.
  - Commission rate and any special terms.

- **Storefront Management**
  - See all their storefronts (locations/screens/links).
  - Add or update storefronts (e.g. new QR code location).
  - Curate which products appear per storefront (where you allow this).

- **Commissions & Performance**
  - List of all attributed orders and commissions.
  - Filters by date range, storefront, and status.
  - Summary cards:
    - Orders this month.
    - GMV (sales) this month.
    - Commission earned this month.
    - Lifetime totals.
  - Top-performing storefronts.

- **Marketing Materials**
  - Access to approved brand assets:
    - Images, logos, banners.
    - PDF flyers or posters.
    - Copy blocks for social media and email.
  - Visibility is controlled by tier:
    - Higher tiers can unlock premium materials.

This gives resellers a **professional portal** that feels like a light-weight CRM/analytics
tool focused on your products.

## What Admins See

### 1. Reseller Management

Admin views provide:

- **Reseller list** with search & filters:
  - Filter by tier, status, company, or email.
  - See key stats: orders, GMV, total commission.

- **Reseller detail view**:
  - Full profile, tier, and payout details.
  - Storefront summary.
  - Key performance metrics.

### 2. Onboarding & Approval Workflow

- Prospective partners submit a **reseller application** with:
  - Company info.
  - How they will promote the brand.
  - Type of locations/screens/traffic they have.
- Admin can:
  - Review applications by status (`submitted`, `under_review`, `approved`, `rejected`).
  - Approve → the system:
    - Creates/updates the `ResellerProfile`.
    - Assigns an initial tier (typically Bronze).
    - Marks the user as a **reseller**.
  - Reject with a reason (stored in the application history).

### 3. Commission Ledger & Payouts

- A **global commission ledger** across all resellers, with filters:
  - By reseller.
  - By storefront.
  - By status (earned, paid, voided).
  - By date range.
- Finance team can:
  - Export data (via API now, CSV later if needed).
  - Mark individual commission entries as **paid**.
  - Use the data for invoices or automated payouts.

### 4. Reseller Analytics

Admins can see:

- Total **wholesale-like GMV** driven by resellers (but at retail prices).
- Total commission cost.
- Top-performing:
  - Resellers (by GMV or commission).
  - Storefronts (e.g. which gyms or screens perform best).
- Performance by tier:
  - Compare the output of Bronze vs Silver vs Gold vs Platinum.

This provides a clear **ROI view** of the reseller program.

## What This Is NOT

It’s important to clarify what this system is **not** doing:

- **No wholesale buying**: Resellers do not purchase stock or hold inventory.
- **No credit terms**: There is no net‑30/net‑60 credit account or credit limits here.
- **No price changes for customers**: End customers always see the same retail prices;
  commissions are internal.

This keeps operations simple:

- Pricing logic is unchanged.
- Inventory flows and shipping are unchanged.
- Only **attribution and commission tracking** are added.

## Frontend Integration – Practical Notes

### Passing Storefront Information

To attribute orders correctly, the frontend needs to pass the **storefront identifier**
when a customer checks out:

- On checkout:
  - `POST /api/v1/cart/checkout/`
  - Include `storefront_id` in the JSON body:
    - Can be either the **UUID** or the **slug** of the storefront.

Example:

```json
{
  "shipping_address": "123 Main St",
  "city": "London",
  "state": "England",
  "zip_code": "SW1A 1AA",
  "country": "UK",
  "email": "customer@example.com",
  "storefront_id": "gym-alpha-main-entrance"
}
```

The backend:

- Resolves that identifier to a `Storefront`.
- Attaches the corresponding `reseller` and `storefront` to the order.
- Calculates commissions automatically when payment succeeds.

### What the Frontend Gets Back

When the order is created and later retrieved:

- `Order` objects now include:
  - `reseller_id`
  - `storefront_id`
  - `storefront_slug`

This allows:

- Admin or analytics UIs to display where the order came from.
- Reseller dashboards to filter their own data.

### Product Catalog for Storefronts

- The API provides **storefront-based product lists** for internal use and potential
  dedicated storefront UIs:
  - `GET /api/v1/resellers/storefronts/{storefront_id}/products/`
  - This returns curated products for that storefront.
- For now, the primary customer path can still use the **existing product catalog**
  endpoints; storefront curation is an extra capability.

## Business Value

### 1. New Revenue Stream (Without Extra Complexity)

- You gain a scalable **partner channel** without:
  - Managing wholesale price lists.
  - Handling credit terms or manual invoicing.
  - Changing your fulfillment operations.
- Partners are motivated to push customers to your store because:
  - They get visibility and analytics.
  - They earn predictable commissions on every sale.

### 2. Clear Attribution & Partner Performance

- Know **exactly** which gyms, influencers, or locations are driving revenue.
- Identify:
  - Top performers to reward or upgrade.
  - Underperforming partners who may need support or different incentives.
- Use this for:
  - Tier upgrades/downgrades.
  - Negotiating deeper partnerships.
  - Targeted marketing or co-branded campaigns.

### 3. Better Partner Experience

- Resellers feel like true partners:
  - They get a **dashboard** that shows their contribution and earnings.
  - They get access to **brand-approved marketing assets**.
  - They can manage their locations and storefronts in one place.

This improves partner retention and makes your brand more attractive to new resellers.

### 4. Strong Governance & Control

- You retain full control over:
  - Product pricing.
  - Inventory and shipping.
  - Which assets are available by tier.
  - Which resellers are active or suspended.
- The system is built on top of your existing:
  - **RBAC & audit logging** (Access Manager and Audit modules).
  - **E‑commerce flows** (Products, Orders, Payments, Inventory).

## Example Scenarios

### Scenario 1 – Gym Screen that Sells

1. Gym Alpha installs a screen by the reception.
2. Screen shows a curated set of 1stRep products.
3. Customers scan a QR code that contains the `storefront_slug`.
4. They checkout on your normal site.
5. All orders from that QR flow are:
   - Attributed to **Gym Alpha – Main Entrance Screen**.
   - Commissioned at Gym Alpha’s tier rate.
6. At month end, Gym Alpha sees:
   - Orders, sales, and commission from that screen.

### Scenario 2 – Upgrading a High-Performer

1. A Bronze reseller consistently drives strong sales.
2. Admin views analytics and sees:
   - High GMV and commission generated.
3. You upgrade them to **Silver or Gold**:
   - Commission rate increases.
   - They gain access to new marketing assets (banners, creative, etc.).
4. This deepens the partnership and incentivises further growth.

### Scenario 3 – Auditing & Issue Handling

1. A large order is refunded.
2. The system:
   - Updates the order status.
   - Automatically **voids** the associated commission.
3. Admin can see:
   - Original commission amount.
   - Voiding reason (for finance records).
4. This avoids overpaying commissions and keeps the ledger clean.

## Summary

The Reseller & Partner Portal gives you:

- A **scalable reseller/affiliate program** built directly on your existing platform.
- Clear **attribution, analytics, and commission tracking** per reseller and storefront.
- A better **partner experience** through dashboards and marketing support.
- Minimal operational risk, because:
  - Pricing, inventory, and fulfillment stay centralised.
  - The system is additive, not disruptive, to your Phase 1 & 2 foundation.

It is a strategic Phase 3 feature that opens up **new revenue and growth channels** without
sacrificing control, brand consistency, or operational simplicity.


