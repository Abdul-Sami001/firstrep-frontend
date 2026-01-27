# Order Cancellation & Return API - Quick Reference

## 🔗 Base URL
All endpoints are prefixed with: `/api/v1/orders/`

---

## 👤 Customer Endpoints

### 1. Request Cancellation (Authenticated)

**Endpoint:** `POST /api/v1/orders/{order_id}/request-cancellation/`

**Authentication:** Required (JWT Bearer Token)

**Request Body:**
```json
{
  "reason": "changed_mind",
  "reason_details": "I no longer need this item"
}
```

**Fields:**
- `reason` (string, **required**): One of:
  - `"changed_mind"` - Changed my mind
  - `"found_cheaper"` - Found cheaper elsewhere
  - `"wrong_item"` - Ordered wrong item
  - `"delayed_delivery"` - Delivery taking too long
  - `"other"` - Other reason
- `reason_details` (string, optional): Additional details

**Success Response (201):**
```json
{
  "id": "uuid",
  "order": {...},
  "reason": "changed_mind",
  "reason_display": "Changed my mind",
  "status": "pending",
  "status_display": "Pending Review",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400`: Order cannot be cancelled (already shipped/delivered/cancelled)
- `400`: Cancellation request already exists
- `401`: Not authenticated
- `404`: Order not found

---

### 2. Request Cancellation (Guest)

**Endpoint:** `POST /api/v1/orders/track/{tracking_token}/request-cancellation/`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "guest@example.com",
  "reason": "changed_mind",
  "reason_details": "Changed my mind"
}
```

**Fields:**
- `email` (string, **required**): Must match `order.guest_email`
- `reason` (string, **required**): Same as authenticated endpoint
- `reason_details` (string, optional): Additional details

**Success Response:** Same as authenticated endpoint

**Error Responses:**
- `403`: Email does not match order
- `400`: Order cannot be cancelled
- `400`: Cancellation request already exists
- `404`: Order not found

---

### 3. Request Return (Authenticated)

**Endpoint:** `POST /api/v1/orders/{order_id}/request-return/`

**Authentication:** Required (JWT Bearer Token)

**Request Body:**
```json
{
  "reason": "defective",
  "reason_details": "Item arrived damaged",
  "return_items": [
    {
      "order_item_id": "uuid-of-order-item",
      "quantity": 1,
      "reason": "Damaged"
    }
  ]
}
```

**Fields:**
- `reason` (string, **required**): One of:
  - `"defective"` - Item is defective
  - `"wrong_item"` - Wrong item received
  - `"not_as_described"` - Not as described
  - `"changed_mind"` - Changed my mind
  - `"size_issue"` - Size doesn't fit
  - `"other"` - Other reason
- `reason_details` (string, optional): Additional details
- `return_items` (array, **required**): List of items to return
  - `order_item_id` (uuid, **required**): ID of order item
  - `quantity` (integer, **required**): Quantity to return (≤ order item quantity)
  - `reason` (string, optional): Item-specific reason

**Success Response (201):**
```json
{
  "id": "uuid",
  "order": {...},
  "reason": "defective",
  "reason_display": "Item is defective",
  "status": "pending",
  "status_display": "Pending Review",
  "return_items": [
    {
      "id": "uuid",
      "order_item": {...},
      "quantity": 1,
      "reason": "Damaged"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400`: Order cannot be returned (not shipped/delivered)
- `400`: Return quantity exceeds order quantity
- `400`: Return request already exists
- `400`: Order item not found
- `401`: Not authenticated
- `404`: Order not found

---

### 4. Request Return (Guest)

**Endpoint:** `POST /api/v1/orders/track/{tracking_token}/request-return/`

**Authentication:** Not required

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

**Fields:** Same as authenticated endpoint, plus:
- `email` (string, **required**): Must match `order.guest_email`

**Success Response:** Same as authenticated endpoint

**Error Responses:**
- `403`: Email does not match order
- `400`: Order cannot be returned
- `400`: Return request already exists
- `404`: Order not found

---

## 🔧 Admin Endpoints

### 5. List Cancellation Requests

**Endpoint:** `GET /api/v1/orders/admin/cancellation-requests/`

**Authentication:** Required (JWT Bearer Token with `orders.change_order` permission)

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`, `cancelled`)
- `order` (uuid, optional): Filter by order ID

**Example:**
```
GET /api/v1/orders/admin/cancellation-requests/?status=pending
```

**Success Response (200):**
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
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 6. Get Cancellation Request Details

**Endpoint:** `GET /api/v1/orders/admin/cancellation-requests/{request_id}/`

**Authentication:** Required (JWT Bearer Token with `orders.change_order` permission)

**Success Response:** Single cancellation request object (same structure as list)

---

### 7. Process Cancellation Request

**Endpoint:** `POST /api/v1/orders/admin/cancellation-requests/{request_id}/process/`

**Authentication:** Required (JWT Bearer Token with `orders.change_order` permission)

**Request Body:**
```json
{
  "action": "approve",
  "admin_notes": "Approved per customer request"
}
```

**Fields:**
- `action` (string, **required**): `"approve"` or `"reject"`
- `admin_notes` (string, optional): Internal admin notes

**What Happens When Approved:**
1. Request status → `approved`
2. Order status → `cancelled`
3. Stock automatically restored
4. Email notification sent
5. Reseller commissions voided

**Success Response (200):**
```json
{
  "id": "uuid",
  "order": {
    "id": "uuid",
    "status": "cancelled",  // Updated
    ...
  },
  "status": "approved",
  "status_display": "Approved",
  "processed_by": "uuid",
  "processed_at": "2024-01-15T11:00:00Z",
  "admin_notes": "Approved per customer request"
}
```

**Error Responses:**
- `400`: Request already processed
- `400`: Invalid action
- `401`: Not authenticated
- `403`: Missing permission
- `404`: Request not found

---

### 8. List Return Requests

**Endpoint:** `GET /api/v1/orders/admin/return-requests/`

**Authentication:** Required (JWT Bearer Token with `orders.change_order` permission)

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`, `returned`, `refunded`, `cancelled`)
- `order` (uuid, optional): Filter by order ID

**Success Response (200):**
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
    "refund_amount": null,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 9. Get Return Request Details

**Endpoint:** `GET /api/v1/orders/admin/return-requests/{request_id}/`

**Authentication:** Required (JWT Bearer Token with `orders.change_order` permission)

**Success Response:** Single return request object (same structure as list)

---

### 10. Process Return Request

**Endpoint:** `POST /api/v1/orders/admin/return-requests/{request_id}/process/`

**Authentication:** Required (JWT Bearer Token with `orders.change_order` permission)

**Request Body Examples:**

**Approve:**
```json
{
  "action": "approve",
  "return_label_url": "https://shipping.com/label/123",
  "return_tracking_number": "RET123456",
  "admin_notes": "Return label sent"
}
```

**Mark Returned:**
```json
{
  "action": "mark_returned",
  "admin_notes": "Items received in warehouse"
}
```

**Mark Refunded:**
```json
{
  "action": "mark_refunded",
  "refund_amount": "99.99",
  "admin_notes": "Refund processed via Stripe"
}
```

**Reject:**
```json
{
  "action": "reject",
  "admin_notes": "Return window expired"
}
```

**Fields:**
- `action` (string, **required**): One of:
  - `"approve"` - Approve return and send label (requires `return_label_url`)
  - `"reject"` - Reject return request
  - `"mark_returned"` - Mark items as returned (requires `approved` status)
  - `"mark_refunded"` - Mark refund processed (requires `returned` status, needs `refund_amount`)
- `return_label_url` (string, optional): Required for `approve` action
- `return_tracking_number` (string, optional): Tracking number for return shipment
- `refund_amount` (decimal, optional): Required for `mark_refunded` action
- `admin_notes` (string, optional): Internal admin notes

**What Happens When Refunded:**
1. Request status → `refunded`
2. Order status → `refunded`
3. Order payment_status → `refunded`
4. Stripe refund processed (if payment exists)
5. Stock automatically restored
6. Email notification sent

**Success Response (200):**
```json
{
  "id": "uuid",
  "status": "approved",
  "status_display": "Approved - Return Label Sent",
  "return_label_url": "https://shipping.com/label/123",
  "return_tracking_number": "RET123456",
  "processed_by": "uuid",
  "processed_at": "2024-01-15T11:00:00Z"
}
```

**Error Responses:**
- `400`: Invalid action or status transition
- `400`: Missing required fields
- `401`: Not authenticated
- `403`: Missing permission
- `404`: Request not found

---

## 📊 Response Field Reference

### OrderCancellationRequest Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Request ID |
| `order` | object | Full order object |
| `reason` | string | Reason code (e.g., "changed_mind") |
| `reason_display` | string | Human-readable reason |
| `reason_details` | string | Additional details |
| `status` | string | Request status |
| `status_display` | string | Human-readable status |
| `requested_by_user` | uuid\|null | User who requested (null for guest) |
| `guest_email` | string\|null | Guest email (null for authenticated) |
| `admin_notes` | string | Internal admin notes |
| `processed_by` | uuid\|null | Admin who processed |
| `processed_at` | datetime\|null | When processed |
| `created_at` | datetime | When created |
| `updated_at` | datetime | Last updated |

### OrderReturnRequest Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Request ID |
| `order` | object | Full order object |
| `reason` | string | Reason code |
| `reason_display` | string | Human-readable reason |
| `reason_details` | string | Additional details |
| `status` | string | Request status |
| `status_display` | string | Human-readable status |
| `return_items` | array | Items to return |
| `return_label_url` | string | Shipping label URL |
| `return_tracking_number` | string | Return tracking number |
| `return_received_at` | datetime\|null | When items received |
| `refund_amount` | decimal\|null | Refund amount |
| `admin_notes` | string | Internal admin notes |
| `requested_by_user` | uuid\|null | User who requested |
| `guest_email` | string\|null | Guest email |
| `processed_by` | uuid\|null | Admin who processed |
| `processed_at` | datetime\|null | When processed |
| `created_at` | datetime | When created |
| `updated_at` | datetime | Last updated |

### ReturnItem Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Return item ID |
| `order_item` | object | Full order item object |
| `quantity` | integer | Quantity to return |
| `reason` | string | Item-specific reason |

---

## 🔐 Authentication

### Customer Endpoints
- **Authenticated**: Include `Authorization: Bearer {jwt_token}` header
- **Guest**: No authentication required, but email verification needed

### Admin Endpoints
- **Required**: `Authorization: Bearer {admin_jwt_token}` header
- **Permission**: User must have `orders.change_order` permission

---

## ⚠️ Important Notes for Frontend Teams

### Customer-Facing Website

1. **Show Cancellation Option When:**
   - Order status is `pending` or `processing`
   - No existing cancellation request with status `pending` or `approved`

2. **Show Return Option When:**
   - Order status is `shipped` or `delivered`
   - No existing return request with status `pending`, `approved`, or `returned`

3. **Guest Flow:**
   - Use `guest_tracking_token` from order
   - Require email input and verification
   - Email must match `order.guest_email`

4. **Request Status Display:**
   - `pending` → "Under Review"
   - `approved` → "Approved" (for cancellation) or "Return Label Sent" (for returns)
   - `rejected` → "Rejected" with admin notes if available
   - `returned` → "Items Returned - Awaiting Refund"
   - `refunded` → "Refund Processed"

### Admin Panel (Next.js)

1. **Cancellation Requests Dashboard:**
   - List all requests with filters
   - Show order details, customer, reason
   - Approve/Reject buttons for pending requests
   - Admin notes field

2. **Return Requests Dashboard:**
   - List all requests with filters
   - Show order details, return items, reason
   - Process buttons based on status:
     - `pending` → Approve/Reject
     - `approved` → Mark Returned
     - `returned` → Mark Refunded

3. **Workflow:**
   - Cancellation: Pending → Approve/Reject → Done
   - Return: Pending → Approve (add label) → Mark Returned → Mark Refunded → Done

---

## 🧪 Testing Endpoints

### Test Cancellation Request (Authenticated)
```bash
curl -X POST https://your-api.com/api/v1/orders/{order_id}/request-cancellation/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"reason": "changed_mind", "reason_details": "Test"}'
```

### Test Return Request (Guest)
```bash
curl -X POST https://your-api.com/api/v1/orders/track/{tracking_token}/request-return/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guest@example.com",
    "reason": "defective",
    "return_items": [{"order_item_id": "uuid", "quantity": 1}]
  }'
```

### Test Admin Process Cancellation
```bash
curl -X POST https://your-api.com/api/v1/orders/admin/cancellation-requests/{request_id}/process/ \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"action": "approve", "admin_notes": "Approved"}'
```

---

## 📝 Migration Command

After deployment, run:
```bash
python manage.py migrate orders
```

This creates the new tables for cancellation and return requests.

---

## ✅ Implementation Checklist

- [x] Models created
- [x] Serializers created
- [x] Customer endpoints implemented
- [x] Admin endpoints implemented
- [x] URL routes configured
- [x] Test cases written
- [x] Admin interface registered
- [x] Migration file created
- [x] API documentation created

---

## 📖 Full Documentation

For complete details, see:
- `docs/ORDER_CANCELLATION_RETURN_API.md` - Complete API documentation
- `docs/ORDER_CANCELLATION_RETURN_IMPLEMENTATION_SUMMARY.md` - Implementation summary

---

## 🆘 Support

For issues:
1. Check API documentation at `/api/docs/` (Swagger UI)
2. Review test cases in `orders/tests.py`
3. Check backend logs for detailed error messages
