# Storefront Management Integration

## Overview

This document describes the complete integration of storefront management functionality into the reseller dashboard. Storefronts allow resellers to create multiple sales surfaces (online stores, physical screens, links/QR codes) and curate products for each storefront. Orders attributed to storefronts automatically generate commissions for the reseller.

## Architecture

### Data Flow

```mermaid
flowchart TB
    subgraph UI[Reseller Dashboard]
        A[Storefront List] --> B[Create/Edit Dialog]
        A --> C[Product Curation]
        C --> D[Bulk Add Products Dialog]
        C --> E[Remove Product Action]
    end
    
    subgraph API[API Layer]
        B --> F[POST /resellers/storefronts/]
        B --> G[PATCH /resellers/storefronts/{id}/]
        D --> H[POST /resellers/storefronts/{id}/products/bulk-add/]
        E --> I[DELETE /resellers/storefronts/{id}/products/{product_id}/]
    end
    
    subgraph Hooks[React Query Hooks]
        F --> J[useCreateStorefront]
        G --> K[useUpdateStorefront]
        H --> L[useBulkAddStorefrontProducts]
        I --> M[useRemoveStorefrontProduct]
    end
    
    UI --> Hooks
    Hooks --> API
```

## API Integration

### Endpoints Used

#### Storefront Management
- `POST /api/v1/resellers/storefronts/` - Create new storefront
- `GET /api/v1/resellers/storefronts/` - List all storefronts (with filters)
- `GET /api/v1/resellers/storefronts/{id}/` - Get storefront details
- `PATCH /api/v1/resellers/storefronts/{id}/` - Update storefront

#### Product Curation
- `GET /api/v1/resellers/storefronts/{storefront_id}/products/` - List curated products
- `POST /api/v1/resellers/storefronts/{storefront_id}/products/bulk-add/` - Add multiple products
- `DELETE /api/v1/resellers/storefronts/{storefront_id}/products/{product_id}/` - Remove product

### Request/Response Types

**Create Storefront Payload:**
```typescript
interface CreateStorefrontPayload {
  name: string;                    // Required, max 255 chars
  slug: string;                    // Required, max 120 chars, unique
  type: 'online' | 'physical_screen' | 'link';
  address_line1?: string;
  city?: string;
  country?: string;
  notes?: string;
  commission_rate_override?: string;  // 0-1 decimal (e.g., "0.10" for 10%)
  is_active?: boolean;                  // Default: true
}
```

**Storefront Response:**
```typescript
interface Storefront {
  id: string;
  reseller: string;
  name: string;
  slug: string;
  type: StorefrontType;
  address_line1?: string;
  city?: string;
  country?: string;
  notes?: string;
  commission_rate_override?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

## Component Structure

### Files Modified

1. **`lib/api/resellers/index.ts`**
   - Added `CreateStorefrontPayload` interface
   - Added `createStorefront()` API method

2. **`hooks/useResellers.ts`**
   - Added `useCreateStorefront()` mutation hook
   - Added `useUpdateStorefront()` mutation hook
   - Added `useBulkAddStorefrontProducts()` mutation hook
   - Added `useRemoveStorefrontProduct()` mutation hook

3. **`app/(reseller)/ResellerDashboard/page.tsx`**
   - Enhanced storefront tab with full CRUD operations
   - Added create/edit storefront dialogs
   - Added bulk add products dialog
   - Added remove product confirmation dialog
   - Added filtering and search functionality

### UI Components

#### 1. Storefront List
**Location:** `app/(reseller)/ResellerDashboard/page.tsx` - Storefront Tab

**Features:**
- Grid layout displaying all storefronts
- Create button in header
- Search bar (name, slug, city, country)
- Type filter dropdown (online, physical_screen, link)
- Status filter dropdown (active, inactive)
- Empty state with CTA
- Each card shows:
  - Name and slug
  - Type badge
  - Address (if provided)
  - Commission override rate
  - Active/Inactive status
  - Action buttons (View products, Edit, Add Products)

#### 2. Create Storefront Dialog
**Features:**
- Form fields:
  - Name (required, max 255 chars)
  - Slug (required, max 120 chars, auto-formatted to lowercase with hyphens)
  - Type (required, dropdown: online, physical_screen, link)
  - Address line 1 (optional)
  - City (optional)
  - Country (optional)
  - Commission rate override (optional, 0-100% input converted to decimal)
  - Notes (optional, textarea)
  - Active toggle (switch, default: true)
- Validation:
  - Slug auto-formats to URL-friendly format
  - Commission rate validates 0-100% range
  - Required fields enforced
- Success/error handling via toast notifications

#### 3. Edit Storefront Dialog
**Features:**
- Pre-populated form with existing storefront data
- Same fields and validation as create dialog
- Updates storefront via PATCH request
- Optimistic UI updates

#### 4. Bulk Add Products Dialog
**Features:**
- Product search input (filters active products)
- Multi-select product list with checkboxes
- Product display:
  - Title
  - Price and currency
  - Product image thumbnail
- Select All / Deselect All buttons
- Selected count indicator
- Submit button shows count of products to add
- Loading states during submission

#### 5. Remove Product Action
**Features:**
- Delete button on each product in list
- Confirmation dialog (AlertDialog)
- Optimistic removal from UI
- Toast notification on success/error

#### 6. Enhanced Product List
**Features:**
- Better formatting with cards
- Product ID display
- Position indicator badge
- Featured badge (if `is_featured`)
- Remove button for each product
- Empty state with "Add Products" CTA

## User Workflows

### Creating a Storefront

1. Navigate to Reseller Dashboard → Storefront tab
2. Click "Create Storefront" button
3. Fill in required fields:
   - Name: e.g., "Gym Alpha Main Entrance Screen"
   - Slug: e.g., "gym-alpha-main-entrance" (auto-formatted)
   - Type: Select from dropdown
4. Optionally fill in:
   - Address, city, country
   - Commission rate override (if different from tier default)
   - Notes
5. Toggle Active status (default: enabled)
6. Click "Create Storefront"
7. Success toast appears, storefront list refreshes

### Editing a Storefront

1. Navigate to Storefront tab
2. Click "Edit" button on desired storefront card
3. Modify fields in the dialog
4. Click "Update Storefront"
5. Success toast appears, changes reflected immediately

### Adding Products to Storefront

1. Navigate to Storefront tab
2. Click "Add Products" button on a storefront card
3. Search for products (optional)
4. Select products using checkboxes
5. Use "Select All" / "Deselect All" for bulk selection
6. Click "Add X Products" button
7. Success toast shows count of products added
8. Product list refreshes automatically

### Removing Products from Storefront

1. Navigate to Storefront tab
2. Click "View products" on a storefront card
3. Click trash icon on product to remove
4. Confirm removal in dialog
5. Product removed, list refreshes

### Filtering and Searching Storefronts

1. Navigate to Storefront tab
2. Use search bar to filter by name, slug, city, or country
3. Use Type dropdown to filter by storefront type
4. Use Status dropdown to filter by active/inactive
5. Filters work in combination (AND logic)

## Integration with Existing Systems

### Checkout Attribution

Storefronts are used in checkout to attribute orders:
- Customer visits storefront page with `?storefront=slug` parameter
- Storefront ID captured via `getStorefrontId()` utility
- Included in checkout request: `{ storefront_id: "slug-or-uuid" }`
- Backend attributes order to reseller and storefront
- Commission automatically calculated on payment success

**Related Files:**
- `lib/utils/storefront.ts` - Storefront ID capture utilities
- `app/(site)/checkout/page.tsx` - Checkout integration
- `lib/api/cart/index.ts` - Checkout API with storefront_id field

### Analytics Integration

Storefront performance appears in analytics:
- Top storefronts by GMV shown in Overview tab
- Commission filtering by storefront in Earning tab
- Analytics API includes storefront breakdown

**Related Files:**
- `hooks/useResellers.ts` - `useResellerAnalytics()` hook
- Analytics overview includes `top_storefronts` array

### Commission Tracking

Commissions are tracked per storefront:
- Commission list can be filtered by storefront
- Each commission record includes `storefront` field
- Commission rate resolution:
  1. Storefront override (if set)
  2. Reseller default override (if set)
  3. Tier commission rate (default)

**Related Files:**
- `hooks/useResellers.ts` - `useResellerCommissions()` hook
- Commission filtering supports `storefront` parameter

## State Management

### React Query Integration

All storefront operations use React Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

**Query Keys:**
- `QUERY_KEYS.RESELLERS.STOREFRONTS` - Storefronts list
- `QUERY_KEYS.RESELLERS.STOREFRONT_PRODUCTS(storefrontId)` - Products for storefront

**Cache Invalidation:**
- Create/Update storefront → Invalidates storefronts list and analytics
- Bulk add products → Invalidates storefront products list
- Remove product → Invalidates storefront products list

### Local State

Component-level state managed for:
- Dialog open/close states
- Form data
- Selected products (multi-select)
- Filters and search queries
- Selected storefront (for product viewing)

## Error Handling

### API Errors
- Displayed via toast notifications
- Error messages extracted from backend response
- Field-specific errors (e.g., slug uniqueness) shown in toast
- Network errors show generic "Please check your connection" message

### Validation Errors
- Client-side validation for required fields
- Slug auto-formatting prevents invalid characters
- Commission rate range validation (0-100%)
- Backend validation errors displayed in toast

### User Feedback
- Loading spinners during mutations
- Success toasts with descriptive messages
- Error toasts with actionable error messages
- Optimistic UI updates for better perceived performance

## Styling and Theme

All components follow the existing dark theme:
- Background: `bg-[#0b0b0f]`
- Borders: `border-gray-800`
- Text: `text-white` for primary, `text-gray-400` for secondary
- Accent color: `#00bfff` (cyan) for primary actions
- Cards: `bg-[#0f172a]` for nested elements

## Testing Checklist

### Storefront Management
- [x] Create storefront with all fields
- [x] Create storefront with minimal fields (name, slug, type)
- [x] Edit storefront (update name, commission rate, etc.)
- [x] Toggle storefront active/inactive
- [x] Search storefronts by name/slug/city/country
- [x] Filter storefronts by type
- [x] Filter storefronts by active/inactive status
- [x] Error handling (duplicate slug, invalid data)
- [x] Loading states during mutations
- [x] Query invalidation after mutations

### Product Curation
- [x] Bulk add products to storefront
- [x] Search products in bulk add dialog
- [x] Select/deselect individual products
- [x] Select All / Deselect All functionality
- [x] Remove product from storefront
- [x] Remove product confirmation dialog
- [x] View products in storefront
- [x] Product list displays correctly with details
- [x] Empty state when no products assigned

### Integration
- [x] Storefront list refreshes after create/update
- [x] Product list refreshes after add/remove
- [x] Analytics updates after storefront changes
- [x] Commission filtering by storefront works
- [x] Toast notifications appear correctly
- [x] Loading states show during API calls

## Future Enhancements

### Planned Features (Out of Scope)
- Drag-to-reorder products (position management)
- Featured product toggle UI
- Product position editing
- Storefront analytics charts
- Storefront preview page
- QR code generation for storefront links
- Storefront duplication
- Bulk storefront operations

### Potential Improvements
- Product search with pagination (currently limited to 50)
- Product images in storefront product list
- Storefront templates
- Storefront sharing/embedding
- Advanced filtering (date range, commission rate range)
- Export storefront data

## Related Documentation

- `docs/reseller-system-documentation.md` - Complete reseller system overview
- `docs/RESELLER_PORTAL_INTEGRATION.md` - Reseller portal integration notes
- `docs/RESELLER_ARCHITECTURE.md` - Backend architecture details
- `docs/FRONTEND_FIXES_IMPLEMENTED.md` - Checkout integration with storefronts

## Code References

### Key Files
- `lib/api/resellers/index.ts` - API methods and types
- `hooks/useResellers.ts` - React Query hooks
- `app/(reseller)/ResellerDashboard/page.tsx` - Main UI component
- `lib/utils/storefront.ts` - Storefront utility functions
- `lib/utils/constants.ts` - Query keys

### Key Functions
- `useCreateStorefront()` - Create storefront mutation
- `useUpdateStorefront()` - Update storefront mutation
- `useBulkAddStorefrontProducts()` - Bulk add products mutation
- `useRemoveStorefrontProduct()` - Remove product mutation
- `getStorefrontId()` - Capture storefront ID from URL/storage

## Summary

The storefront management integration provides resellers with complete control over their sales surfaces. The implementation follows existing patterns, uses React Query for state management, and provides a seamless user experience with proper error handling and feedback. All functionality is integrated into the reseller dashboard with a consistent dark theme matching the rest of the application.
