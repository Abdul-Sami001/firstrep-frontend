# Frontend Integration Guide – Customer Support Module

## New API Endpoints (prefixed `/api/v1/`)
1) `GET/POST support/tickets/`
2) `GET/PATCH support/tickets/{id}/`
3) `POST support/tickets/{id}/mark-read/`
4) `GET/POST support/messages/`
5) `GET support/events/`

All endpoints use JWT auth. Cursor pagination via `next/previous` tokens (CustomCursorPagination).

## Ticket Fields (requests/responses)
- Core: `id`, `subject`, `description`, `status`, `priority`, `category`, `channel`, `sla_due_at`
- Relations: `user`, `contact`, `order`, `assigned_to`, `watchers` (list of user IDs)
- Activity: `last_message_at`, `unread_by_agent`, `unread_by_customer`
- AI: `ai_summary`, `ai_confidence_score`, `ai_first_response_time`, `ai_auto_resolved`
- Timestamps: `created_at`, `updated_at`, `closed_at`
- Write-only helper: `initial_message` (sets first message on create)

## Ticket Filters & Ordering (list)
Use query params:
- Filters: `status`, `priority`, `assigned_to`, `contact`, `order`, `channel`
- Date range filters (DjangoFilter suffixes):
  - `created_at_after`, `created_at_before`
  - `last_message_at_after`, `last_message_at_before`
  - `sla_due_at_after`, `sla_due_at_before`
- SLA helper: `sla_overdue=true`
- Search: `search=<text>` on subject/description/contact.email/user.email
- Ordering: `ordering=created_at` or `ordering=-last_message_at` (default)

## Ticket Actions
- Create ticket (customer portal):
  - POST `support/tickets/` with `subject`, `description` (optional), `initial_message` (optional), `order` (optional).
  - If authenticated customer and no `user` provided, backend links ticket to requester and CRM contact.
- Agent update:
  - PATCH `support/tickets/{id}/` with `status`, `priority`, `assigned_to`, `watchers`, `category`, `sla_due_at`, AI fields, etc.
- Mark read:
  - POST `support/tickets/{id}/mark-read/` to zero unread for current actor (agents clear `unread_by_agent`; customers clear `unread_by_customer`).

## Messages API
- Create message:
  - POST `support/messages/` with `ticket`, `body`, optional `is_internal` (agents only), optional `files` (array of multipart uploads).
  - Direction auto-set: agents → `outbound`; customers → `inbound`.
  - Unread counters and `last_message_at` updated automatically; notifications sent via email templates if present.
- List messages:
  - GET `support/messages/?ticket=<id>&direction=inbound|outbound&is_internal=true|false&created_at_after/before=...`
  - Ordered ascending by `created_at`.

## Events API
- GET `support/events/?ticket=<id>` returns status/assignment/message events for timeline views. Ordered desc by `created_at`.

## Permissions (frontend expectations)
- Agents (staff or roles `customer_service|sales_manager|admin|super_admin` or perm `support.view_ticket`) can see all tickets; assignment/status changes restricted to assignee/admin.
- Customers see only tickets where they are `user` or linked `contact.user`; can post messages (not internal).
- Internal notes: set `is_internal=true` only if agent; otherwise 400.

## UX Recommendations
- Sorting: default to `-last_message_at` for “active” views; allow switch to `sla_due_at` for ops.
- Badges: show `unread_by_agent` to agents, `unread_by_customer` to customers; call `mark-read` when opening thread.
- Filters: expose `status`, `priority`, `assigned_to`, `channel`, `sla_overdue`; provide date pickers for `created_at`/`last_message_at`.
- SLA highlighting: if `sla_overdue=true`, emphasize row; show countdown to `sla_due_at`.
- AI fields: display AI summary if present; show confidence badge; hide AI flags from customers if desired (frontend-owned).

## Sample Flows
- Customer opens ticket:
  - POST ticket with `initial_message` → fetch thread via `support/messages/?ticket=id`.
  - Mark read after viewing thread.
- Agent reply:
  - PATCH ticket to assign self; POST message (optionally `is_internal` for notes).
  - Customer replies → `unread_by_agent` increments; agent UI polls or uses pagination cursors to refresh.
- SLA queue:
  - GET `support/tickets/?sla_overdue=true&ordering=-sla_due_at` to surface breaches.

## Error Handling
- Standard DRF validation errors (400) for invalid fields/permissions.
- 403 when not participant/authorized; 401 when unauthenticated.
- Upload limits depend on Django/file storage config; consider front-end size checks.

## Implementation Hooks
- Email templates to provide for notifications:
  - `support_ticket_update.html` (customer-facing)
  - `support_customer_reply.html` (agent-facing)
- Consider adding ETag or `If-Unmodified-Since` headers on PATCH for collision control (frontend optional). 

