# Support Module Overview

## Scope (Phase 1)
- Email/ticket portal with mixed handling: internal agents + assigned customer contacts.
- Threads with internal notes vs customer-visible replies.
- SLA fields, assignment, watchers, unread counters, and AI metadata for future agent.

## Data Model
- `Ticket`: status (new/open/pending_customer/resolved/closed), priority, category, channel (portal/email/ai/system), `sla_due_at`, `assigned_to`, `watchers`, `last_message_at`, `unread_by_agent`, `unread_by_customer`, AI fields (`ai_summary`, `ai_confidence_score`, `ai_first_response_time`, `ai_auto_resolved`), optional `order`, `contact`, `user`.
- `TicketMessage`: body, `direction` (inbound/outbound), `is_internal`, `author_user/author_contact`, attachments.
- `TicketAttachment`: file + original name.
- `TicketEvent`: status/assignment/message history for audit.

## API (prefixed with `/api/v1/`)
- `GET/POST support/tickets/`: list/create tickets (customers see their own; agents see all).
- `GET/PATCH support/tickets/{id}/`: update ticket (status, priority, assignment, watchers, AI fields).
- `POST support/tickets/{id}/mark-read/`: zero unread counter for current actor.
- `GET/POST support/messages/`: list or post messages; `is_internal` allowed for agents only; attachments via `files`.
- `GET support/events/`: timeline of status/assignment/message events.

## Permissions
- Agents: staff/superuser or roles `customer_service|sales_manager|admin|super_admin` or `support.view_ticket`.
- Customers: can access tickets where they are `user` or linked contact user.
- Write operations on tickets restricted to assigned agent/admin; messages allowed to participants.

## Notifications
- Outbound emails reuse `core.email_service.send_templated_email` (fails silently if templates absent):
  - Agent reply → customer notification (`support_ticket_update` template).
  - Customer reply → agent/watchers notification (`support_customer_reply` template).

## Inbound Email Stub
- Celery task `support.tasks.ingest_inbound_email` logs payloads and appends inbound message; ready for webhook/IMAP wiring and AI agent ingestion later.

## Testing
- `support/tests.py` covers unread counters and message creation flows.


