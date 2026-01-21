# Customer Support Architecture (Phase 1: Ticket Portal + AI-Ready)

## Overview
- New `support` app provides ticketing with email/portal intake, agent/customer threads, SLA support, unread counters, and AI-ready metadata.
- Integrated with existing `crm.Contact`, `users.User`, `orders.Order`, Access Manager roles, audit logging, and core email service.
- Channels supported now: `portal`, `email` (stub), `system`; AI channel reserved for future agent.

## Domain Model
- `Ticket`
  - Core: `subject`, `description`, `status` (new/open/pending_customer/resolved/closed), `priority` (low/normal/high/urgent), `category`, `channel`.
  - Relations: `user` (customer account), `contact` (CRM), optional `order`, `assigned_to`, `watchers` (M2M).
  - Ops: `sla_due_at`, `last_message_at` (activity sort), `unread_by_agent`, `unread_by_customer`.
  - AI fields: `ai_summary`, `ai_confidence_score` (0-1), `ai_first_response_time`, `ai_auto_resolved` (future agent).
  - Lifecycle: `closed_at`, `created_at`, `updated_at`.
- `TicketMessage`
  - `ticket`, `body`, `direction` (inbound/outbound), `is_internal`, `author_user`, `author_contact`, `attachments`.
  - `created_at` for chronological thread; drives `last_message_at` and unread counters.
- `TicketAttachment`
  - File per message, `original_name`, `uploaded_at`.
- `TicketEvent`
  - Timeline: `event_type` (status_change/assignment_change/message/reopen/close/note), `from_status`, `to_status`, assignment changes, `metadata`, `created_by`.

## Permissions & Roles
- Support agents: staff/superuser or roles `customer_service|sales_manager|admin|super_admin` or perm `support.view_ticket`.
- Customers: access tickets where they are `user` or linked `contact.user`.
- Ticket writes (status/assignment) restricted to assignee/admin; messages allowed for participants (internal notes only for agents).

## API Surface (new)
- `support/tickets/` (list/create, supports filters/search/order, cursor pagination)
- `support/tickets/{id}/` (retrieve/update)
- `support/tickets/{id}/mark-read/` (POST)
- `support/messages/` (list/create; supports attachments)
- `support/events/` (list timeline)

## Filtering & Ordering (utilization)
- Ticket filters:
  - `status`, `priority`, `assigned_to`, `contact`, `order`, `channel`
  - Date ranges: `created_at_after/before`, `last_message_at_after/before`, `sla_due_at_after/before`
  - SLA helper: `sla_overdue=true` (open/pending_customer past due)
- Search: `subject`, `description`, `contact.email`, `user.email`
- Ordering: `created_at`, `last_message_at`, `priority`, `sla_due_at` (default `-last_message_at` via cursor)
- Message filters: `ticket`, `direction`, `is_internal`, `created_at_after/before`

## Integrations & Dependencies
- CRM: auto link/sync contact on ticket creation when `user` present.
- Orders: optional linkage for context and filtering.
- Access Manager: permissions via roles and Django perms; setup command updated to include support perms.
- Audit: critical actions recorded via `audit_log` and `TicketEvent`.
- Email: outbound notifications reuse `core.email_service`; templates to add (`support_ticket_update.html`, `support_customer_reply.html`).
- Celery: stub task `support.tasks.ingest_inbound_email` for future email/AI ingestion.

## AI Readiness
- `channel="ai"` to attribute AI-created tickets.
- AI fields usage (future):
  - `ai_summary`: store LLM-generated thread summary for fast previews.
  - `ai_confidence_score`: gating for human review (e.g., <0.7 requires agent approval).
  - `ai_first_response_time`: SLA metric for AI versus human.
  - `ai_auto_resolved`: mark tickets closed by AI; pair with `TicketEvent` for audit.
- Potential enhancements:
  - Auto-draft replies; require agent approve when low confidence.
  - Semantic routing to `assigned_to` based on topic.
  - Similar-ticket suggestions using embeddings.
  - AI-generated tags/category/priority proposals.

## Real-World Use Cases
- Customer portal request: customer opens ticket (portal channel) with initial message → ticket created, unread for agents; agents reply, customer gets email; customer reply increments agent unread; assignee can resolve/close and SLA tracked.
- Order-linked issue: ticket references `order` for fulfillment context; filters enable operations to triage shipping/payment problems quickly.
- Internal note workflow: agents add `is_internal` messages (not sent to customer), maintaining audit trail via events.
- SLA monitoring: ops dashboard queries `sla_overdue=true` to surface at-risk tickets; ordering by `last_message_at` prevents stale threads.
- AI pilot: create AI tickets (`channel=ai`) from bots; store `ai_summary` and confidence; if `ai_auto_resolved` true, events capture closure with AI flag for reporting.

## Enhancements Roadmap
- Email ingestion (SES/SendGrid webhook or IMAP) mapped to `TicketMessage` inbound; auto-create on unknown threads.
- Notifications: add templates, Slack/Webhook for agent alerts, batching digests.
- Collision control: ETag/If-Unmodified-Since on PATCH to prevent overwrites.
- SLA policies: per-priority timers, pause on pending_customer, breach notifications.
- Attachments scanning & size limits; S3 offload.
- Customer-facing status pages: limited fields, only outbound/inbound messages (no internal notes).


