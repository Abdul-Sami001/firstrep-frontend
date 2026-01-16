# Backend Cart Price Fix - Critical Issue

## Problem
When products are on sale and added to cart, the **original price (retail_price)** is being stored as `price_at_time` instead of the **sale price (current_price)**.

## Root Cause
The backend's cart add endpoint (`/cart/add/`) is likely using `retail_price` or `price` field instead of `current_price` when determining what price to store as `price_at_time`.

## Expected Behavior
When a product is on sale (`is_on_sale === true`), the backend should:
1. Use `current_price` (which is the sale price) when storing `price_at_time`
2. NOT use `retail_price` (which is the original/base price)

## Current Frontend Implementation
The frontend sends only:
```json
{
  "product": "product-uuid",
  "variant": "variant-uuid",  // optional
  "quantity": 1
}
```

The backend is responsible for:
1. Fetching the product
2. Determining the correct price to store
3. Storing it as `price_at_time`

## Backend Fix Required

### In the Cart Add Endpoint (`/cart/add/`)

**Current (WRONG):**
```python
# ❌ WRONG - Uses retail_price
price_at_time = product.retail_price
# or
price_at_time = product.price  # Legacy field
```

**Correct (FIXED):**
```python
# ✅ CORRECT - Uses current_price (handles sales automatically)
price_at_time = product.current_price

# If variant has price_override, handle it:
if variant and variant.price_override is not None:
    price_at_time = variant.price_override
else:
    price_at_time = product.current_price
```

### Why This Matters
- `current_price` automatically handles sales (sale price if on sale, retail_price if not)
- `retail_price` is always the base price, ignoring sales
- Customers should pay the sale price when adding items during a sale

## Testing Checklist

After backend fix:
- [ ] Add product on sale to cart → `price_at_time` should be `current_price` (sale price)
- [ ] Add product not on sale to cart → `price_at_time` should be `retail_price` (same as current_price)
- [ ] Verify cart totals use the correct sale price
- [ ] Verify checkout uses the correct sale price
- [ ] Verify orders store the correct sale price

## Frontend Impact
✅ Frontend is already correctly displaying `price_at_time` from the cart
❌ Backend is storing wrong price (retail_price instead of current_price)

## Priority
🔴 **HIGH** - Customers are seeing incorrect (higher) prices in their cart when products are on sale.

## Related Files
- Backend: Cart add endpoint (`/cart/add/`)
- Frontend: `lib/api/cart/index.ts` (already correct)
- Frontend: `contexts/CartContext.tsx` (already correct)
