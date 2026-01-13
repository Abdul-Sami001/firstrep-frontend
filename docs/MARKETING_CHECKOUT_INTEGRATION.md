# Marketing Tools Checkout Integration Guide

## Overview

The backend now fully supports applying **gift cards**, **referral codes**, and **loyalty points** directly at checkout. All discount types can be combined and are automatically calculated with VAT (20% UK rate).

**Status**: ✅ Backend is complete and ready for frontend integration

---

## High-Level System Architecture

### How Cart & Order System Works

**Simple Explanation:**

1. **Cart**: Temporary storage of items customer wants to buy
   - Items are stored with prices at time of adding
   - Cart can have discounts applied (gift card, referral, loyalty, promotion)
   - Discounts are stored on cart but not finalized until checkout

2. **Checkout Process**:
   - Customer adds items to cart
   - Customer can apply discounts (gift card, referral, loyalty)
   - System calculates: Subtotal → Apply Discounts → Calculate VAT → Final Total
   - Customer confirms checkout → Order is created
   - Order stores all discount details for audit trail
   - Payment is processed via Stripe (includes VAT)

3. **Order Creation**:
   - Cart is converted to Order
   - All discounts are re-validated (to prevent fraud)
   - Discounts are applied atomically (all or nothing)
   - VAT is calculated on discounted amount
   - Stock is reserved
   - Payment session is created

4. **After Payment**:
   - Loyalty points are auto-awarded
   - Referral rewards are processed
   - Gift card balances are updated
   - Order status updates

### Discount Application Flow

```
Cart Subtotal: £100.00
├── Promotion Discount: -£10.00
├── Gift Card: -£20.00
├── Referral Discount: -£5.00
└── Loyalty Points: -£15.00

Discounted Subtotal: £50.00
VAT (20%): £10.00
Final Total: £60.00
```

**Key Point**: Discounts are applied sequentially, VAT is calculated on the final discounted amount.

---

## New API Endpoints

### 1. Gift Card Validation & Application

#### Validate Gift Card Code
```
POST /api/v1/marketing/gift-cards/validate/
```

**Request Body:**
```json
{
  "code": "GIFT-ABC123XYZ"
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "balance": "50.00",
  "max_discount": "50.00",
  "message": "Gift card is valid"
}
```

**Response (400 Bad Request):**
```json
{
  "valid": false,
  "balance": null,
  "max_discount": null,
  "message": "Invalid gift card code"
}
```

**Permission**: Public (no authentication required)

---

#### Apply Gift Card to Cart
```
POST /api/v1/marketing/gift-cards/apply-to-cart/
```

**Request Body:**
```json
{
  "code": "GIFT-ABC123XYZ",
  "cart_id": "uuid-of-cart"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "applied_amount": "50.00",
  "remaining_balance": "0.00",
  "cart_totals": {
    "subtotal": "100.00",
    "gift_card_discount": "50.00",
    "total_discount": "50.00",
    "discounted_subtotal": "50.00",
    "vat": "10.00",
    "total": "60.00"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid gift card code"
}
```

**Permission**: Public (no authentication required)

---

### 2. Referral Code Validation & Application

#### Validate Referral Code
```
POST /api/v1/marketing/referrals/validate/
```

**Request Body:**
```json
{
  "code": "REF-ABC123"
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "discount_amount": "10.00",
  "discount_type": "percentage",
  "discount_value": "10",
  "message": "Referral code is valid"
}
```

**Response (400 Bad Request):**
```json
{
  "valid": false,
  "discount_amount": null,
  "message": "Invalid or expired referral code"
}
```

**Permission**: Public (no authentication required)

**Note**: Referral codes can only be used by new customers (not the referrer themselves)

---

#### Apply Referral to Cart
```
POST /api/v1/marketing/referrals/apply-to-cart/
```

**Request Body:**
```json
{
  "code": "REF-ABC123",
  "cart_id": "uuid-of-cart"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "applied_discount": "10.00",
  "cart_totals": {
    "subtotal": "100.00",
    "referral_discount": "10.00",
    "total_discount": "10.00",
    "discounted_subtotal": "90.00",
    "vat": "18.00",
    "total": "108.00"
  }
}
```

**Permission**: Public (no authentication required)

---

### 3. Loyalty Points Preview & Application

#### Preview Loyalty Redemption
```
POST /api/v1/marketing/loyalty/preview-redemption/
```

**Request Body:**
```json
{
  "points": 1000,
  "cart_id": "uuid-of-cart"
}
```

**Response (200 OK):**
```json
{
  "discount_amount": "10.00",
  "remaining_balance": 900,
  "points_to_redeem": 1000,
  "message": "1000 points = £10.00 discount"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Insufficient loyalty points"
}
```

**Permission**: Requires authentication (`IsAuthenticated`)

---

#### Apply Loyalty Points to Cart
```
POST /api/v1/marketing/loyalty/apply-to-cart/
```

**Request Body:**
```json
{
  "points": 1000,
  "cart_id": "uuid-of-cart"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "points_applied": 1000,
  "discount_amount": "10.00",
  "remaining_balance": 900,
  "cart_totals": {
    "subtotal": "100.00",
    "loyalty_discount": "10.00",
    "total_discount": "10.00",
    "discounted_subtotal": "90.00",
    "vat": "18.00",
    "total": "108.00"
  }
}
```

**Permission**: Requires authentication (`IsAuthenticated`)

**Important**: Points are NOT deducted until order is successfully paid. This is just a preview/reservation.

---

### 4. Get Cart Totals (Updated)

#### Get Cart with All Discounts
```
GET /api/v1/cart/{cart_id}/
```

**Response (200 OK):**
```json
{
  "id": "cart-uuid",
  "items": [...],
  "total": "108.00",
  "applied_gift_card_code": "GIFT-ABC123XYZ",
  "applied_gift_card_amount": "50.00",
  "applied_referral_code": "REF-ABC123",
  "applied_referral_discount": "10.00",
  "applied_loyalty_points": 1000,
  "applied_loyalty_discount": "15.00",
  "total_discount": "75.00"
}
```

**New Fields Added to Cart Response:**
- `applied_gift_card_code` (string | null)
- `applied_gift_card_amount` (decimal)
- `applied_referral_code` (string | null)
- `applied_referral_discount` (decimal)
- `applied_loyalty_points` (integer)
- `applied_loyalty_discount` (decimal)
- `total_discount` (decimal) - Sum of all discounts

---

### 5. Get My Referral Code (Permission Fixed)

#### Get User's Referral Code
```
GET /api/v1/marketing/referrals/my-code/
```

**Response (200 OK):**
```json
{
  "id": "referral-uuid",
  "code": "REF-ABC123",
  "status": "pending",
  "program_name": "Referral Program",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Permission**: Now requires authentication (`IsAuthenticated`) - **FIXED**

---

### 6. Get Loyalty Account (Already Exists)

#### Get User's Loyalty Account
```
GET /api/v1/marketing/loyalty/account/
```

**Response (200 OK):**
```json
{
  "id": "account-uuid",
  "points_balance": 5000,
  "lifetime_points": 10000,
  "program_name": "Loyalty Program"
}
```

**Permission**: Requires authentication (`IsAuthenticated`)

---

### 7. Get Loyalty Transactions (Permission Fixed)

#### Get User's Loyalty Transactions
```
GET /api/v1/marketing/loyalty/transactions/
```

**Response (200 OK):**
```json
{
  "count": 10,
  "results": [
    {
      "id": "transaction-uuid",
      "transaction_type": "earned",
      "points_amount": 100,
      "description": "Points earned for order",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Permission**: Now requires authentication (`IsAuthenticated`) - **FIXED**

---

## Updated Checkout Flow

### Checkout Endpoint (No Changes Required)

The existing checkout endpoint already handles all discount types:

```
POST /api/v1/cart/checkout/
```

**Request Body:**
```json
{
  "shipping_address": "123 Main St",
  "city": "London",
  "state": "England",
  "zip_code": "SW1A 1AA",
  "country": "UK",
  "email": "customer@example.com"  // Required for guest checkout
}
```

**How It Works:**
1. System reads applied discounts from cart
2. Re-validates all discounts (security check)
3. Creates order with all discount details
4. Calculates VAT on discounted amount
5. Creates Stripe payment session (includes VAT)
6. Returns checkout URL

**Response (200 OK):**
```json
{
  "detail": "Order created",
  "order_id": "order-uuid",
  "checkout_url": "https://checkout.stripe.com/...",
  "session_id": "cs_..."
}
```

**Important**: All discounts applied to cart are automatically included in the order. No need to pass them again in checkout request.

---

## Frontend Integration Recommendations

### ✅ What's Now Possible (Backend Ready)

1. **Gift Card at Checkout**
   - ✅ Validate gift card code
   - ✅ Apply to cart
   - ✅ Show remaining balance
   - ✅ Auto-applied at checkout

2. **Referral Code at Checkout**
   - ✅ Validate referral code
   - ✅ Apply to cart
   - ✅ Show discount preview
   - ✅ Auto-applied at checkout

3. **Loyalty Points at Checkout**
   - ✅ Preview redemption
   - ✅ Apply to cart
   - ✅ Show discount amount
   - ✅ Auto-applied at checkout

4. **Combined Discounts**
   - ✅ All discount types can be used together
   - ✅ System handles priority automatically
   - ✅ VAT calculated correctly

---

### Frontend Implementation Guide

#### Priority 1: Checkout Integration

**1. Gift Card Section**

Add to checkout page:
```typescript
// Gift Card Input Section
<GiftCardInput 
  cartId={cart.id}
  onApplied={(amount, balance) => {
    // Update cart totals
    // Show: "Applied: £50.00, Remaining: £0.00"
  }}
/>
```

**Flow:**
1. User enters gift card code
2. Call `POST /api/v1/marketing/gift-cards/validate/` on blur/button click
3. If valid, call `POST /api/v1/marketing/gift-cards/apply-to-cart/`
4. Update cart display with new totals
5. Show applied amount and remaining balance

**2. Referral Code Section**

Add to checkout page:
```typescript
// Referral Code Input Section
<ReferralCodeInput 
  cartId={cart.id}
  onApplied={(discount) => {
    // Update cart totals
    // Show: "Discount: £10.00"
  }}
/>
```

**Flow:**
1. User enters referral code
2. Call `POST /api/v1/marketing/referrals/validate/` on blur
3. If valid, show discount preview
4. Call `POST /api/v1/marketing/referrals/apply-to-cart/` on apply
5. Update cart display

**3. Loyalty Points Section**

Add to checkout page:
```typescript
// Loyalty Points Section
<LoyaltyPointsRedeem 
  cartId={cart.id}
  pointsBalance={loyaltyAccount.points_balance}
  onApplied={(points, discount) => {
    // Update cart totals
    // Show: "Redeeming 1000 points = £10.00 discount"
  }}
/>
```

**Flow:**
1. Show current points balance (from `/api/v1/marketing/loyalty/account/`)
2. User enters points to redeem
3. Call `POST /api/v1/marketing/loyalty/preview-redemption/` to preview
4. Show discount amount
5. Call `POST /api/v1/marketing/loyalty/apply-to-cart/` on apply
6. Update cart display

**Important**: Points are NOT deducted until payment succeeds. This is just a reservation.

---

#### Priority 2: UX Improvements

**1. Show Available Gift Cards**

On checkout page, show user's available gift cards:
```typescript
// Fetch user's gift cards
GET /api/v1/marketing/gift-cards/?status=active

// Display with one-click apply button
<GiftCardList 
  cards={giftCards}
  onApply={(code) => applyGiftCardToCart(code)}
/>
```

**2. Show Referral Code**

If user has a referral code, show it on checkout:
```typescript
// Fetch user's referral code
GET /api/v1/marketing/referrals/my-code/

// Display with reminder to share
<ReferralCodeDisplay 
  code={referralCode}
  message="Share your code and earn rewards!"
/>
```

**3. Show Points Balance**

Display current points balance prominently:
```typescript
// Fetch loyalty account
GET /api/v1/marketing/loyalty/account/

// Display
<PointsBalance 
  balance={loyaltyAccount.points_balance}
  message="Redeem points for discount"
/>
```

---

## Discount Combination Rules

### How Multiple Discounts Work

1. **Order of Application**:
   - Promotion codes (if any)
   - Gift card
   - Referral discount
   - Loyalty points

2. **Sequential Application**:
   - Each discount is applied to remaining amount
   - Prevents negative totals
   - Example: £100 → -£50 gift card → £50 remaining → -£10 referral → £40 remaining

3. **VAT Calculation**:
   - VAT is calculated on final discounted amount
   - Example: £40 discounted subtotal → £8 VAT (20%) → £48 total

4. **Maximum Discount**:
   - Total discounts cannot exceed cart subtotal
   - System automatically caps at available amount

---

## Error Handling

### Common Error Responses

**Invalid Gift Card:**
```json
{
  "success": false,
  "error": "Invalid gift card code"
}
```

**Insufficient Gift Card Balance:**
```json
{
  "success": false,
  "error": "Insufficient gift card balance"
}
```

**Expired Gift Card:**
```json
{
  "success": false,
  "error": "Gift card has expired"
}
```

**Invalid Referral Code:**
```json
{
  "valid": false,
  "message": "Invalid or expired referral code"
}
```

**Referral Code Already Used:**
```json
{
  "valid": false,
  "message": "Referral code has already been used"
}
```

**Insufficient Loyalty Points:**
```json
{
  "error": "Insufficient loyalty points"
}
```

**Authentication Required (Loyalty):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Testing Checklist

### Test Scenarios

1. **Gift Card**
   - ✅ Apply valid gift card
   - ✅ Apply expired gift card (should fail)
   - ✅ Apply gift card with insufficient balance (should fail)
   - ✅ Apply gift card that covers full order
   - ✅ Apply gift card that covers partial order

2. **Referral Code**
   - ✅ Apply valid referral code
   - ✅ Apply invalid referral code (should fail)
   - ✅ Apply referral code as referrer (should fail)
   - ✅ Apply referral code on order below minimum (should fail)

3. **Loyalty Points**
   - ✅ Preview redemption
   - ✅ Apply valid points
   - ✅ Apply more points than available (should fail)
   - ✅ Apply points as guest (should fail)

4. **Combined Discounts**
   - ✅ Apply gift card + referral
   - ✅ Apply gift card + loyalty
   - ✅ Apply all three discount types
   - ✅ Verify VAT calculation is correct

5. **Checkout**
   - ✅ Complete checkout with gift card
   - ✅ Complete checkout with referral code
   - ✅ Complete checkout with loyalty points
   - ✅ Complete checkout with all discounts
   - ✅ Verify Stripe payment amount matches order total

---

## Important Notes

### 1. Discount Persistence

- Discounts are stored on the cart model
- They persist until checkout or cart is cleared
- Re-validated at checkout for security

### 2. VAT Compliance

- All prices shown to customers include VAT
- VAT is calculated on discounted amount (UK law compliant)
- VAT is shown separately on invoices/receipts
- Stripe payment includes VAT as separate line item

### 3. Loyalty Points Deduction

- Points are NOT deducted when applied to cart
- Points are deducted only when order payment succeeds
- If payment fails, points are not deducted
- This prevents points loss on failed payments

### 4. Referral Processing

- Referral codes are validated at checkout
- Rewards are issued after order payment succeeds
- Both referrer and referee receive rewards
- Processed via Celery background tasks

### 5. Gift Card Redemption

- Gift card balance is updated at checkout
- If order is less than gift card, remaining balance is saved
- If order is more than gift card, customer pays difference
- Transaction is recorded for audit trail

---

## Migration Notes

### Database Changes

- Cart model: Added discount tracking fields
- Order model: Added discount tracking fields and foreign keys
- All fields have defaults, so existing carts/orders are unaffected

### API Changes

- New endpoints added (no breaking changes)
- Existing endpoints unchanged
- Permission fixes: Some endpoints now require authentication (was admin-only)

### Backward Compatibility

- ✅ Existing promotion code flow still works
- ✅ Existing cart/order creation still works
- ✅ All changes are additive (no breaking changes)

---

## Support & Questions

If you encounter any issues during integration:

1. Check error responses for specific error messages
2. Verify authentication tokens for loyalty endpoints
3. Ensure cart_id is valid UUID
4. Check that discount amounts don't exceed cart subtotal

**Backend Status**: ✅ Ready for production

**Integration Status**: ⏳ Pending frontend implementation

---

## Summary

### What's Ready

✅ Gift card validation and application  
✅ Referral code validation and application  
✅ Loyalty points preview and application  
✅ Combined discount support  
✅ VAT calculation (20% UK rate)  
✅ Stripe payment integration with VAT  
✅ All permissions fixed for customer access  
✅ Comprehensive error handling  
✅ Test coverage complete  

### What Frontend Needs to Do

1. Add gift card input to checkout page
2. Add referral code input to checkout page
3. Add loyalty points redemption to checkout page
4. Display applied discounts in cart totals
5. Show available gift cards on checkout
6. Show referral code reminder on checkout
7. Show points balance on checkout

**Estimated Integration Time**: 2-4 hours for basic implementation, 4-8 hours with UX improvements.

---

*Last Updated: 2024*  
*Backend Version: Ready for Integration*
