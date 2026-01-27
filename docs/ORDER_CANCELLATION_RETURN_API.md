# Order Cancellation & Return Request API Documentation

## Overview

This document provides comprehensive API documentation for order cancellation and return request functionality. The system supports both authenticated users and guest users (via tracking tokens).

## Table of Contents

1. [Customer Endpoints](#customer-endpoints)
2. [Admin Endpoints](#admin-endpoints)
3. [Data Models](#data-models)
4. [Frontend Integration Guide](#frontend-integration-guide)
5. [Error Handling](#error-handling)
6. [Workflow Examples](#workflow-examples)

---

## Customer Endpoints

### 1. Request Order Cancellation (Authenticated)

**Endpoint:** `POST /api/v1/orders/{order_id}/request-cancellation/`

**Authentication:** Required (JWT Token)

**Description:** Submit a cancellation request for an order. Only works for orders with status `pending` or `processing`.

**Request Body:**
```json
{
  "reason": "changed_mind",
  "reason_details": "I no longer need this item"
}
```

**Request Fields:**
- `reason` (string, required): Cancellation reason. One of:
  - `"changed_mind"` - Changed my mind
  - `"found_cheaper"` - Found cheaper elsewhere
  - `"wrong_item"` - Ordered wrong item
  - `"delayed_delivery"` - Delivery taking too long
  - `"other"` - Other reason
- `reason_details` (string, optional): Additional details about the cancellation

**Response (201 Created):**
```json
{
  "id": "uuid",
  "order": {
    "id": "uuid",
    "status": "processing",
    "total": "99.99",
    ...
  },
  "reason": "changed_mind",
  "reason_display": "Changed my mind",
  "reason_details": "I no longer need this item",
  "status": "pending",
  "status_display": "Pending Review",
  "requested_by_user": "uuid",
  "guest_email": null,
  "admin_notes": "",
  "processed_by": null,
  "processed_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Order cannot be cancelled (already shipped/delivered/cancelled)
- `400 Bad Request`: Cancellation request already exists
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Order not found or doesn't belong to user

---

### 2. Request Order Cancellation (Guest)

**Endpoint:** `POST /api/v1/orders/track/{tracking_token}/request-cancellation/`

**Authentication:** Not required (public endpoint)

**Description:** Submit a cancellation request using guest tracking token. Email verification required.

**Request Body:**
```json
{
  "email": "guest@example.com",
  "reason": "changed_mind",
  "reason_details": "Changed my mind"
}
```

**Request Fields:**
- `email` (string, required): Email address associated with the order (must match `order.guest_email`)
- `reason` (string, required): Same as authenticated endpoint
- `reason_details` (string, optional): Additional details

**Response:** Same as authenticated endpoint

**Error Responses:**
- `403 Forbidden`: Email does not match order
- `400 Bad Request`: Order cannot be cancelled
- `400 Bad Request`: Cancellation request already exists
- `404 Not Found`: Order not found with tracking token

---

### 3. Request Order Return (Authenticated)

**Endpoint:** `POST /api/v1/orders/{order_id}/request-return/`

**Authentication:** Required (JWT Token)

**Description:** Submit a return request for an order. Only works for orders with status `shipped` or `delivered`.

**Request Body:**
```json
{
  "reason": "defective",
  "reason_details": "Item arrived damaged",
  "return_items": [
    {
      "order_item_id": "uuid",
      "quantity": 1,
      "reason": "Damaged"
    }
  ]
}
```

**Request Fields:**
- `reason` (string, required): Return reason. One of:
  - `"defective"` - Item is defective
  - `"wrong_item"` - Wrong item received
  - `"not_as_described"` - Not as described
  - `"changed_mind"` - Changed my mind
  - `"size_issue"` - Size doesn't fit
  - `"other"` - Other reason
- `reason_details` (string, optional): Additional details
- `return_items` (array, required): List of items to return
  - `order_item_id` (uuid, required): ID of the order item to return
  - `quantity` (integer, required): Quantity to return (must be ≤ order item quantity)
  - `reason` (string, optional): Item-specific return reason

**Response (201 Created):**
```json
{
  "id": "uuid",
  "order": {
    "id": "uuid",
    "status": "delivered",
    ...
  },
  "reason": "defective",
  "reason_display": "Item is defective",
  "reason_details": "Item arrived damaged",
  "status": "pending",
  "status_display": "Pending Review",
  "return_items": [
    {
      "id": "uuid",
      "order_item": {
        "id": "uuid",
        "product_name": "Test Product",
        "quantity": 2,
        "price": "99.99"
      },
      "quantity": 1,
      "reason": "Damaged"
    }
  ],
  "return_label_url": "",
  "return_tracking_number": "",
  "return_received_at": null,
  "refund_amount": null,
  "admin_notes": "",
  "requested_by_user": "uuid",
  "guest_email": null,
  "processed_by": null,
  "processed_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Order cannot be returned (not shipped/delivered)
- `400 Bad Request`: Return quantity exceeds order quantity
- `400 Bad Request`: Return request already exists
- `400 Bad Request`: Order item not found
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Order not found

---

### 4. Request Order Return (Guest)

**Endpoint:** `POST /api/v1/orders/track/{tracking_token}/request-return/`

**Authentication:** Not required (public endpoint)

**Description:** Submit a return request using guest tracking token.

**Request Body:**
```json
{
  "email": "guest@example.com",
  "reason": "wrong_item",
  "reason_details": "Received wrong item",
  "return_items": [
    {
      "order_item_id": "uuid",
      "quantity": 1
    }
  ]
}
```

**Request Fields:** Same as authenticated endpoint, plus:
- `email` (string, required): Email address associated with the order

**Response:** Same as authenticated endpoint

**Error Responses:**
- `403 Forbidden`: Email does not match order
- `400 Bad Request`: Order cannot be returned
- `400 Bad Request`: Return request already exists
- `404 Not Found`: Order not found

---

## Admin Endpoints

### 5. List Cancellation Requests

**Endpoint:** `GET /api/v1/orders/admin/cancellation-requests/`

**Authentication:** Required (JWT Token with `orders.change_order` permission)

**Description:** Get all cancellation requests with optional filtering.

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`, `cancelled`)
- `order` (uuid, optional): Filter by order ID

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "order": {...},
    "reason": "changed_mind",
    "reason_display": "Changed my mind",
    "status": "pending",
    "status_display": "Pending Review",
    "requested_by_user": "uuid",
    "guest_email": null,
    "admin_notes": "",
    "processed_by": null,
    "processed_at": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Missing `orders.change_order` permission

---

### 6. Get Cancellation Request Details

**Endpoint:** `GET /api/v1/orders/admin/cancellation-requests/{request_id}/`

**Authentication:** Required (JWT Token with `orders.change_order` permission)

**Description:** Get details of a specific cancellation request.

**Response:** Same structure as list endpoint (single object)

---

### 7. Process Cancellation Request

**Endpoint:** `POST /api/v1/orders/admin/cancellation-requests/{request_id}/process/`

**Authentication:** Required (JWT Token with `orders.change_order` permission)

**Description:** Approve or reject a cancellation request. When approved, the order status is automatically set to `cancelled` and stock is restored.

**Request Body:**
```json
{
  "action": "approve",
  "admin_notes": "Approved per customer request"
}
```

**Request Fields:**
- `action` (string, required): Action to take. One of:
  - `"approve"` - Approve the cancellation request
  - `"reject"` - Reject the cancellation request
- `admin_notes` (string, optional): Internal admin notes

**Response (200 OK):**
```json
{
  "id": "uuid",
  "order": {
    "id": "uuid",
    "status": "cancelled",  // Order status updated
    ...
  },
  "status": "approved",
  "status_display": "Approved",
  "processed_by": "uuid",
  "processed_at": "2024-01-15T11:00:00Z",
  "admin_notes": "Approved per customer request",
  ...
}
```

**What Happens When Approved:**
1. Cancellation request status → `approved`
2. Order status → `cancelled`
3. Stock is automatically restored (via existing signals)
4. Email notification sent to customer
5. Reseller commissions voided (if applicable)

**Error Responses:**
- `400 Bad Request`: Request already processed
- `400 Bad Request`: Invalid action
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Missing permission
- `404 Not Found`: Request not found

---

### 8. List Return Requests

**Endpoint:** `GET /api/v1/orders/admin/return-requests/`

**Authentication:** Required (JWT Token with `orders.change_order` permission)

**Description:** Get all return requests with optional filtering.

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`, `returned`, `refunded`, `cancelled`)
- `order` (uuid, optional): Filter by order ID

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "order": {...},
    "reason": "defective",
    "reason_display": "Item is defective",
    "status": "pending",
    "status_display": "Pending Review",
    "return_items": [...],
    "return_label_url": "",
    "return_tracking_number": "",
    "return_received_at": null,
    "refund_amount": null,
    "admin_notes": "",
    "created_at": "2024-01-15T10:30:00Z",
    ...
  }
]
```

---

### 9. Get Return Request Details

**Endpoint:** `GET /api/v1/orders/admin/return-requests/{request_id}/`

**Authentication:** Required (JWT Token with `orders.change_order` permission)

**Description:** Get details of a specific return request.

**Response:** Same structure as list endpoint (single object)

---

### 10. Process Return Request

**Endpoint:** `POST /api/v1/orders/admin/return-requests/{request_id}/process/`

**Authentication:** Required (JWT Token with `orders.change_order` permission)

**Description:** Process a return request through various stages.

**Request Body (Approve):**
```json
{
  "action": "approve",
  "return_label_url": "https://shipping.com/label/123",
  "return_tracking_number": "RET123456",
  "admin_notes": "Return label sent to customer"
}
```

**Request Body (Mark Returned):**
```json
{
  "action": "mark_returned",
  "admin_notes": "Items received in warehouse"
}
```

**Request Body (Mark Refunded):**
```json
{
  "action": "mark_refunded",
  "refund_amount": "99.99",
  "admin_notes": "Refund processed via Stripe"
}
```

**Request Body (Reject):**
```json
{
  "action": "reject",
  "admin_notes": "Return window expired"
}
```

**Request Fields:**
- `action` (string, required): Action to take. One of:
  - `"approve"` - Approve return and send return label (status → `approved`)
  - `"reject"` - Reject return request (status → `rejected`)
  - `"mark_returned"` - Mark items as returned (status → `returned`, requires `approved` status)
  - `"mark_refunded"` - Mark refund as processed (status → `refunded`, requires `returned` status)
- `return_label_url` (string, optional): Required for `approve` action
- `return_tracking_number` (string, optional): Optional tracking number for return shipment
- `refund_amount` (decimal, optional): Required for `mark_refunded` action
- `admin_notes` (string, optional): Internal admin notes

**Response (200 OK):**
```json
{
  "id": "uuid",
  "status": "approved",
  "status_display": "Approved - Return Label Sent",
  "return_label_url": "https://shipping.com/label/123",
  "return_tracking_number": "RET123456",
  "processed_by": "uuid",
  "processed_at": "2024-01-15T11:00:00Z",
  ...
}
```

**What Happens When Refunded:**
1. Return request status → `refunded`
2. Order status → `refunded`
3. Order payment_status → `refunded`
4. Stripe refund processed (if payment exists)
5. Stock is automatically restored (via existing signals)
6. Email notification sent to customer

**Error Responses:**
- `400 Bad Request`: Invalid action or status transition
- `400 Bad Request`: Missing required fields (e.g., `return_label_url` for approve)
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Missing permission
- `404 Not Found`: Request not found

---

## Data Models

### OrderCancellationRequest

```typescript
interface OrderCancellationRequest {
  id: string;                    // UUID
  order: Order;                  // Full order object
  reason: string;                // One of: changed_mind, found_cheaper, wrong_item, delayed_delivery, other
  reason_display: string;        // Human-readable reason
  reason_details: string;         // Additional details
  status: string;                // pending, approved, rejected, cancelled
  status_display: string;         // Human-readable status
  requested_by_user: string | null;  // UUID of user (null for guest)
  guest_email: string | null;     // Guest email (null for authenticated)
  admin_notes: string;           // Internal admin notes
  processed_by: string | null;    // UUID of admin who processed
  processed_at: string | null;    // ISO datetime
  created_at: string;            // ISO datetime
  updated_at: string;             // ISO datetime
}
```

### OrderReturnRequest

```typescript
interface OrderReturnRequest {
  id: string;                    // UUID
  order: Order;                  // Full order object
  reason: string;                // One of: defective, wrong_item, not_as_described, changed_mind, size_issue, other
  reason_display: string;        // Human-readable reason
  reason_details: string;         // Additional details
  status: string;                // pending, approved, rejected, returned, refunded, cancelled
  status_display: string;         // Human-readable status
  return_items: ReturnItem[];    // Array of items to return
  return_label_url: string;      // Shipping label URL (when approved)
  return_tracking_number: string; // Return shipment tracking number
  return_received_at: string | null; // ISO datetime when items received
  refund_amount: string | null;   // Decimal amount refunded
  admin_notes: string;           // Internal admin notes
  requested_by_user: string | null;  // UUID of user (null for guest)
  guest_email: string | null;     // Guest email (null for authenticated)
  processed_by: string | null;    // UUID of admin who processed
  processed_at: string | null;     // ISO datetime
  created_at: string;             // ISO datetime
  updated_at: string;             // ISO datetime
}
```

### ReturnItem

```typescript
interface ReturnItem {
  id: string;                    // UUID
  order_item: OrderItem;         // Full order item object
  quantity: number;              // Quantity to return
  reason: string;                // Item-specific return reason
}
```

---

## Frontend Integration Guide

### Customer-Facing Website

#### 1. Display Cancellation Option

**When to Show:**
- Order status is `pending` or `processing`
- No existing cancellation request with status `pending` or `approved`
- User is authenticated OR has guest tracking token

**UI Elements Needed:**
- "Request Cancellation" button
- Reason dropdown/radio buttons
- Optional textarea for additional details
- Submit button

**Example Flow:**
```typescript
// Check if cancellation is possible
const canCancel = order.status === 'pending' || order.status === 'processing';
const hasPendingRequest = order.cancellation_requests?.some(
  req => req.status === 'pending' || req.status === 'approved'
);

if (canCancel && !hasPendingRequest) {
  // Show cancellation form
}
```

#### 2. Display Return Option

**When to Show:**
- Order status is `shipped` or `delivered`
- No existing return request with status `pending`, `approved`, or `returned`
- User is authenticated OR has guest tracking token

**UI Elements Needed:**
- "Request Return" button
- Reason dropdown/radio buttons
- Item selection (checkboxes for each order item)
- Quantity selector for each item
- Optional textarea for additional details
- Submit button

**Example Flow:**
```typescript
// Check if return is possible
const canReturn = order.status === 'shipped' || order.status === 'delivered';
const hasPendingRequest = order.return_requests?.some(
  req => ['pending', 'approved', 'returned'].includes(req.status)
);

if (canReturn && !hasPendingRequest) {
  // Show return form with order items
}
```

#### 3. Display Request Status

**Cancellation Request Status:**
- `pending` → Show "Cancellation Request Submitted - Under Review"
- `approved` → Show "Cancellation Approved - Order Cancelled" (order status should be `cancelled`)
- `rejected` → Show "Cancellation Request Rejected" with admin notes if available

**Return Request Status:**
- `pending` → Show "Return Request Submitted - Under Review"
- `approved` → Show "Return Approved - Return Label Sent" with label URL
- `returned` → Show "Items Returned - Awaiting Refund"
- `refunded` → Show "Refund Processed - £X.XX refunded"
- `rejected` → Show "Return Request Rejected" with admin notes

---

### Admin Panel (Next.js)

#### 1. Cancellation Requests Dashboard

**Page:** `/admin/orders/cancellations`

**Features:**
- List all cancellation requests
- Filter by status (`pending`, `approved`, `rejected`)
- Filter by order ID
- Show order details, customer info, reason
- Approve/Reject buttons for pending requests
- Admin notes field

**Table Columns:**
- Order ID (link to order)
- Customer (email or "Guest")
- Reason
- Status
- Created At
- Actions (Approve/Reject buttons)

**Actions:**
- Click "Approve" → Opens modal with admin notes field → Calls process endpoint
- Click "Reject" → Opens modal with admin notes field → Calls process endpoint
- Click Order ID → Navigate to order detail page

#### 2. Return Requests Dashboard

**Page:** `/admin/orders/returns`

**Features:**
- List all return requests
- Filter by status
- Filter by order ID
- Show order details, return items, reason
- Process buttons based on status:
  - `pending` → Approve/Reject
  - `approved` → Mark Returned
  - `returned` → Mark Refunded

**Table Columns:**
- Order ID (link to order)
- Customer (email or "Guest")
- Reason
- Items (summary)
- Status
- Created At
- Actions

**Workflow:**
1. **Pending** → Click "Approve" → Enter return label URL → Submit
2. **Approved** → Wait for items → Click "Mark Returned" → Submit
3. **Returned** → Click "Mark Refunded" → Enter refund amount → Submit

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "detail": "Cannot cancel order with status: shipped"
}
```

**403 Forbidden:**
```json
{
  "detail": "Email does not match order"
}
```

**404 Not Found:**
```json
{
  "detail": "Not found."
}
```

**401 Unauthorized:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Frontend Error Handling

```typescript
try {
  const response = await fetch('/api/v1/orders/123/request-cancellation/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ reason: 'changed_mind' })
  });
  
  if (!response.ok) {
    const error = await response.json();
    // Handle error.detail
    if (response.status === 400) {
      // Show error message to user
    } else if (response.status === 401) {
      // Redirect to login
    }
    return;
  }
  
  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle network error
}
```

---

## Workflow Examples

### Example 1: Customer Cancels Order

1. Customer views order detail page
2. Sees "Request Cancellation" button (order status is `processing`)
3. Clicks button → Modal opens with reason dropdown
4. Selects reason: "Changed my mind"
5. Adds details: "I no longer need this item"
6. Submits → `POST /api/v1/orders/{id}/request-cancellation/`
7. Request created with status `pending`
8. Customer sees: "Cancellation Request Submitted - Under Review"

**Admin Side:**
1. Admin views cancellation requests dashboard
2. Sees pending request
3. Reviews order details
4. Clicks "Approve" → Enters admin notes → Submits
5. Order status → `cancelled`
6. Stock restored automatically
7. Customer receives email notification

### Example 2: Customer Returns Order

1. Customer views order detail page (order status is `delivered`)
2. Sees "Request Return" button
3. Clicks button → Form opens
4. Selects reason: "Item is defective"
5. Selects item to return (checkbox)
6. Sets quantity: 1 (out of 2 ordered)
7. Adds details: "Item arrived damaged"
8. Submits → `POST /api/v1/orders/{id}/request-return/`
9. Request created with status `pending`

**Admin Side:**
1. Admin views return requests dashboard
2. Sees pending request
3. Reviews return items and reason
4. Clicks "Approve" → Enters return label URL → Submits
5. Request status → `approved`
6. Customer receives email with return label
7. Customer ships items back
8. Admin receives items → Clicks "Mark Returned"
9. Request status → `returned`
10. Admin processes refund → Clicks "Mark Refunded" → Enters refund amount
11. Order status → `refunded`
12. Stock restored automatically
13. Customer receives refund confirmation email

---

## Important Notes for Frontend Developers

1. **Guest Users:** Always require email verification for guest endpoints
2. **Status Validation:** Check order status before showing cancellation/return options
3. **Duplicate Prevention:** Check for existing requests before allowing new ones
4. **Stock Restoration:** Happens automatically via backend signals - no frontend action needed
5. **Email Notifications:** Sent automatically by backend - no frontend action needed
6. **Reseller Commissions:** Voided automatically when order cancelled/refunded
7. **Support Tickets:** Created automatically when requests are submitted (if support app is installed)
8. **Permissions:** Admin endpoints require `orders.change_order` permission
9. **Error Messages:** Always display `error.detail` to users
10. **Loading States:** Show loading indicators during API calls
11. **Success Messages:** Show confirmation messages after successful submissions
12. **Refresh Data:** Refresh order data after request submission to show updated status

---

## Testing Checklist

### Customer-Facing Tests
- [ ] Authenticated user can create cancellation request
- [ ] Guest user can create cancellation request with correct email
- [ ] Cannot cancel shipped/delivered orders
- [ ] Cannot create duplicate cancellation request
- [ ] Authenticated user can create return request
- [ ] Guest user can create return request
- [ ] Cannot return pending/processing orders
- [ ] Cannot return more items than ordered
- [ ] Request status updates correctly

### Admin Panel Tests
- [ ] Admin can list cancellation requests
- [ ] Admin can filter requests by status
- [ ] Admin can approve cancellation request
- [ ] Admin can reject cancellation request
- [ ] Order status updates when cancellation approved
- [ ] Admin can list return requests
- [ ] Admin can approve return request
- [ ] Admin can mark return as received
- [ ] Admin can mark return as refunded
- [ ] Order status updates when return refunded
- [ ] Regular user cannot access admin endpoints

---

## Migration Instructions

After backend deployment:

1. **Run Migrations:**
   ```bash
   python manage.py migrate orders
   ```

2. **Verify Models:**
   - Check that `OrderCancellationRequest` table exists
   - Check that `OrderReturnRequest` table exists
   - Check that `ReturnItem` table exists

3. **Test Endpoints:**
   - Test customer endpoints with authenticated user
   - Test guest endpoints with tracking token
   - Test admin endpoints with admin user

4. **Update Frontend:**
   - Deploy customer-facing website updates
   - Deploy admin panel updates
   - Test end-to-end workflows

---

## Support

For questions or issues:
- Check API documentation: `/api/docs/` (Swagger UI)
- Review test cases: `orders/tests.py`
- Check backend logs for detailed error messages
