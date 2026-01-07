# Reseller Portal – Frontend Integration Notes

This file summarizes how the new reseller portal is wired to the backend APIs and where to find the key pieces in the frontend codebase.

## Entry Points
- `app/(reseller)/layout.tsx` — protected layout with auth guard; redirects to `/ResellerLogin` on 401/403.
- `app/(reseller)/ResellerDashboard/page.tsx` — main reseller dashboard (overview, commissions, storefronts, marketing assets, profile).
- `app/(reseller)/ResellerLogin/page.tsx` — reseller login; uses `useLogin` and redirects to the dashboard.

## API Layer
- `lib/api/resellers/index.ts` defines typed methods for:
  - Profile: `getMe`, `updateProfile`
  - Analytics: `getAnalyticsOverview`
  - Commissions: `getCommissions`, `getCommissionSummary`
  - Storefronts: `getStorefronts`, `getStorefront`, `updateStorefront`, `getStorefrontProducts`, `bulkAddStorefrontProducts`, `removeStorefrontProduct`
  - Marketing: `getMarketingAssets`, `getMarketingAsset`
- `lib/utils/constants.ts` — reseller query keys.
- `lib/utils/api-endpoints.ts` — marks `/resellers/` as protected for token handling.

## Data Hooks
- `hooks/useResellers.ts` wraps React Query calls:
  - `useResellerProfile`, `useUpdateResellerProfile`
  - `useResellerAnalytics`
  - `useResellerCommissions`, `useResellerCommissionSummary`
  - `useResellerStorefronts`, `useResellerStorefrontProducts`
  - `useResellerMarketingAssets`, `useResellerMarketingAsset`

## Dashboard Sections (ResellerDashboard)
- Overview cards (GMV, commission, orders, lifetime).
- Top storefronts (GMV, commission, orders).
- Commissions ledger with filters (status, storefront), pagination, summary cards (this month / last 30d).
- Storefronts list with type/status and inline products viewer.
- Marketing assets grid with open/download.
- Profile self-service form (company/contact/VAT/payout).

## Auth Flow
- Login page uses `useLogin`; on success, store token via existing auth flow and route to `/ResellerDashboard`.
- Layout guards access and shows tier/status in the header.

## Components/Patterns Reused
- shadcn UI: cards, tables, select, badge, skeleton, button, etc.
- `formatCurrency` from `lib/utils/formatters` for money display.
- React Query caching via `QUERY_KEYS.RESELLERS.*`.

## API Contracts (high level)
- `/api/v1/resellers/me/` — reseller profile and tier/status.
- `/api/v1/resellers/analytics/overview/` — lifetime, month-to-date, last-30d stats, top storefronts, recent commissions.
- `/api/v1/resellers/commissions/` — paginated ledger with filters.
- `/api/v1/resellers/commissions/summary/` — quick totals.
- `/api/v1/resellers/storefronts/` and `.../{id}/products/` — storefront management.
- `/api/v1/resellers/marketing-assets/` — asset library with tier gating.

## Notes for Future Work
- Add application/onboarding wiring when backend endpoint is available.
- Extend storefront product management (bulk add/remove UI) when required.
- Add charts/time-series if the backend provides timeseries slices.

