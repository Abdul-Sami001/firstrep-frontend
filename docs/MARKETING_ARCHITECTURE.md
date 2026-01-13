# Marketing App Architecture Documentation

## Overview

The Marketing app is a comprehensive email marketing and automation platform integrated with the existing e-commerce and CRM systems. It provides email campaigns, simple automations (welcome series, abandoned cart), customer segmentation, and growth tools (referrals, loyalty points, gift cards).

## System Architecture

### Design Patterns

1. **Service Layer Pattern**: Business logic is separated into `marketing/services.py` to keep views thin and business logic reusable.

2. **Event-Driven Architecture**: 
   - Django signals trigger automations on user registration and order events
   - Celery tasks handle async email sending and processing

3. **Async Processing**: All email sending and heavy operations are offloaded to Celery tasks for better performance.

4. **Denormalized Analytics**: CampaignAnalytics model stores pre-calculated metrics for fast dashboard queries.

## Data Models

### EmailTemplate
- **Purpose**: Reusable email templates for campaigns and automations
- **Key Features**:
  - HTML and text content
  - Variable substitution (merge tags like {{first_name}})
  - Categories (transactional, promotional, newsletter, automation)

### Segment
- **Purpose**: Customer segmentation for targeted campaigns
- **Key Features**:
  - Static segments (manually managed contact lists)
  - Dynamic segments (auto-updated based on criteria)
  - Criteria stored as JSON (lifecycle_stage, tags, min_order_count, min_ltv)

### Campaign
- **Purpose**: Email campaigns (one-time or scheduled)
- **Key Features**:
  - Links to template and segment
  - Scheduling support
  - Status tracking (draft, scheduled, sending, sent, cancelled)

### CampaignRecipient
- **Purpose**: Individual recipient tracking
- **Key Features**:
  - Open/click tracking via tracking tokens
  - Conversion tracking (links to orders)
  - Status tracking (pending, sent, failed, bounced, unsubscribed)

### Automation
- **Purpose**: Automated email sequences
- **Key Features**:
  - Trigger types (user_registered, cart_abandoned)
  - Status (active, paused)
  - Multiple emails in sequence with delays

### AutomationEmail
- **Purpose**: Individual email in automation sequence
- **Key Features**:
  - Email order (1, 2, 3...)
  - Delay hours after trigger
  - Template and subject line

### AutomationExecution
- **Purpose**: Tracks automation progress for each contact
- **Key Features**:
  - Current email order
  - Status (pending, in_progress, completed, stopped)

### Subscriber
- **Purpose**: Email list management
- **Key Features**:
  - Links to Contact and User
  - Status (subscribed, unsubscribed, bounced)
  - Source tracking (website, import, api)

### EmailPreference
- **Purpose**: Granular email preferences
- **Key Features**:
  - Email type preferences (transactional, promotional, newsletter)
  - Per-type subscription status

### CampaignAnalytics
- **Purpose**: Denormalized campaign performance metrics
- **Key Features**:
  - Sent, delivered, opened, clicked counts
  - Conversion count and revenue attribution
  - Auto-updated via Celery tasks

### ReferralProgram
- **Purpose**: Referral program configuration
- **Key Features**:
  - Reward types (discount_percent, discount_fixed, points)
  - Referrer and referee rewards
  - Minimum purchase amount

### Referral
- **Purpose**: Individual referral tracking
- **Key Features**:
  - Unique referral code
  - Status (pending, completed, expired)
  - Reward issuance tracking

### LoyaltyProgram
- **Purpose**: Loyalty program configuration
- **Key Features**:
  - Points per pound spent
  - Redemption rate (points per £1)

### LoyaltyAccount
- **Purpose**: Customer loyalty account
- **Key Features**:
  - Points balance
  - Lifetime points
  - Links to Contact and User

### LoyaltyTransaction
- **Purpose**: Points transaction history
- **Key Features**:
  - Transaction types (earned, redeemed, expired, adjusted)
  - Links to orders

### GiftCard
- **Purpose**: Digital gift cards
- **Key Features**:
  - Unique code
  - Balance tracking
  - Expiration dates
  - Status (active, redeemed, expired)

### GiftCardTransaction
- **Purpose**: Gift card transaction history
- **Key Features**:
  - Transaction types (purchase, redemption, refund)
  - Links to orders

## Integration Points

### With CRM App
- **Contact Integration**: Uses CRM Contact model for segmentation and targeting
- **Segment Sync**: Segments can use CRM tags and lifecycle stages
- **Activity Logging**: Campaign sends can create CRM activities (future enhancement)

### With Orders App
- **Conversion Tracking**: CampaignRecipient links to Orders for conversion attribution
- **Loyalty Points**: Orders trigger automatic loyalty point awards
- **Referral Completion**: Orders check and complete referrals
- **Gift Card Redemption**: Orders can use gift cards

### With Users App
- **Auto-Subscription**: New users auto-subscribe to newsletter
- **Welcome Automation**: User registration triggers welcome series
- **Loyalty Accounts**: One-to-one with User accounts

## Service Layer

### Campaign Services
- `create_campaign()`: Create new campaign
- `schedule_campaign()`: Schedule campaign send
- `send_campaign()`: Send campaign to segment
- `calculate_campaign_metrics()`: Calculate analytics

### Automation Services
- `create_automation()`: Create automation
- `trigger_automation()`: Trigger automation for contact
- `process_automation_emails()`: Process pending automation emails
- `calculate_automation_metrics()`: Calculate analytics

### Segment Services
- `create_segment()`: Create segment
- `evaluate_segment()`: Evaluate dynamic segment criteria
- `refresh_segment()`: Refresh segment contacts and count
- `get_segment_size()`: Get contact count

### Growth Tools Services
- `create_referral()`: Create referral code
- `process_referral_completion()`: Process referral when order placed
- `award_loyalty_points()`: Award points for order
- `redeem_loyalty_points()`: Redeem points for discount
- `create_gift_card()`: Create gift card
- `redeem_gift_card()`: Redeem gift card on order

### Email Services
- `render_email_template()`: Render template with variables
- `track_email_open()`: Track email open via pixel
- `track_email_click()`: Track email click via redirect
- `handle_unsubscribe()`: Handle unsubscribe request

## API Endpoints

All endpoints follow RESTful conventions and are documented with OpenAPI/Swagger.

### Templates
- `GET /api/v1/marketing/templates/` - List templates
- `POST /api/v1/marketing/templates/` - Create template
- `GET /api/v1/marketing/templates/{id}/` - Template detail
- `PATCH /api/v1/marketing/templates/{id}/` - Update template
- `DELETE /api/v1/marketing/templates/{id}/` - Delete template

### Segments
- `GET /api/v1/marketing/segments/` - List segments
- `POST /api/v1/marketing/segments/` - Create segment
- `GET /api/v1/marketing/segments/{id}/` - Segment detail
- `PATCH /api/v1/marketing/segments/{id}/` - Update segment
- `DELETE /api/v1/marketing/segments/{id}/` - Delete segment
- `POST /api/v1/marketing/segments/{id}/refresh/` - Refresh segment
- `GET /api/v1/marketing/segments/{id}/contacts/` - Get segment contacts

### Campaigns
- `GET /api/v1/marketing/campaigns/` - List campaigns
- `POST /api/v1/marketing/campaigns/` - Create campaign
- `GET /api/v1/marketing/campaigns/{id}/` - Campaign detail
- `PATCH /api/v1/marketing/campaigns/{id}/` - Update campaign
- `DELETE /api/v1/marketing/campaigns/{id}/` - Delete campaign
- `POST /api/v1/marketing/campaigns/{id}/send/` - Send campaign
- `POST /api/v1/marketing/campaigns/{id}/schedule/` - Schedule campaign
- `GET /api/v1/marketing/campaigns/{id}/analytics/` - Campaign analytics
- `GET /api/v1/marketing/campaigns/{id}/recipients/` - Campaign recipients

### Automations
- `GET /api/v1/marketing/automations/` - List automations
- `POST /api/v1/marketing/automations/` - Create automation
- `GET /api/v1/marketing/automations/{id}/` - Automation detail
- `PATCH /api/v1/marketing/automations/{id}/` - Update automation
- `DELETE /api/v1/marketing/automations/{id}/` - Delete automation
- `POST /api/v1/marketing/automations/{id}/activate/` - Activate automation
- `POST /api/v1/marketing/automations/{id}/pause/` - Pause automation
- `GET /api/v1/marketing/automations/{id}/analytics/` - Automation analytics
- `GET /api/v1/marketing/automations/{id}/executions/` - Automation executions

### Subscribers
- `GET /api/v1/marketing/subscribers/` - List subscribers
- `POST /api/v1/marketing/subscribers/` - Subscribe
- `GET /api/v1/marketing/subscribers/{id}/` - Subscriber detail
- `PATCH /api/v1/marketing/subscribers/{id}/` - Update subscriber
- `DELETE /api/v1/marketing/subscribers/{id}/` - Unsubscribe
- `GET /api/v1/marketing/subscribers/{id}/preferences/` - Get preferences
- `PATCH /api/v1/marketing/subscribers/{id}/preferences/` - Update preferences

### Analytics
- `GET /api/v1/marketing/analytics/overview/` - Dashboard overview
- `GET /api/v1/marketing/analytics/campaigns/` - Campaign analytics

### Growth Tools

**Referrals:**
- `GET /api/v1/marketing/referrals/` - List referrals
- `POST /api/v1/marketing/referrals/` - Create referral
- `GET /api/v1/marketing/referrals/my-code/` - Get my referral code

**Loyalty:**
- `GET /api/v1/marketing/loyalty/account/` - Get loyalty account
- `GET /api/v1/marketing/loyalty/transactions/` - Loyalty transactions
- `POST /api/v1/marketing/loyalty/redeem/` - Redeem points

**Gift Cards:**
- `GET /api/v1/marketing/gift-cards/` - List gift cards
- `POST /api/v1/marketing/gift-cards/` - Create gift card
- `GET /api/v1/marketing/gift-cards/{id}/` - Gift card detail
- `POST /api/v1/marketing/gift-cards/{id}/redeem/` - Redeem gift card

### Tracking
- `GET /api/v1/marketing/track/open/{token}/` - Email open tracking (pixel)
- `GET /api/v1/marketing/track/click/{token}/` - Email click tracking (redirect)
- `GET /api/v1/marketing/unsubscribe/` - Unsubscribe endpoint

## Permissions

### IsMarketingUser
- Base permission for marketing access
- All authenticated users can access

### CanManageCampaigns
- Permission to create/edit campaigns
- Staff only

### CanViewAnalytics
- Permission to view analytics and reports
- Staff only

## Celery Tasks

### Campaign Tasks
- `send_campaign_task(campaign_id)` - Send campaign emails
- `update_campaign_analytics(campaign_id)` - Update analytics

### Automation Tasks
- `send_automation_email_task(execution_id, email_order)` - Send automation email
- `process_automation_emails_task()` - Process pending automation emails (every 15 min)
- `update_automation_analytics(automation_id)` - Update analytics

### Segment Tasks
- `refresh_dynamic_segments()` - Refresh all dynamic segments (daily at 2 AM)

### Growth Tools Tasks
- `process_referral_rewards()` - Process completed referrals (daily at 1 AM)
- `award_loyalty_points_for_order(order_id)` - Award points (triggered on order)
- `expire_gift_cards()` - Expire old gift cards (daily at 4 AM)

## Data Flow

### Campaign Send Flow
1. Admin creates campaign → Campaign saved
2. Admin sends → Celery task queued
3. Task evaluates segment → Gets contacts
4. For each contact → Create CampaignRecipient
5. Render template → Personalize with variables
6. Send email → Via EmailMultiAlternatives
7. User opens/clicks → Track via pixel/redirect
8. User converts → Link to Order, update analytics

### Welcome Automation Flow
1. User registers → Signal triggered
2. Create AutomationExecution → Link to contact
3. Send first email → Immediate (if delay_hours=0)
4. Schedule subsequent emails → Based on delay_hours
5. Celery task processes → Sends next email when due
6. Continue until sequence complete

### Abandoned Cart Flow
1. Cart abandoned → Detected (via scheduled task or signal)
2. Create AutomationExecution → Link to contact
3. Send first email → After delay (e.g., 2 hours)
4. Schedule subsequent emails → With delays
5. If cart completed → Stop automation (future enhancement)

### Loyalty Points Flow
1. Order placed and paid → Signal triggered
2. Celery task awards points → Based on order total
3. Update LoyaltyAccount → Increase balance
4. Create LoyaltyTransaction → Record transaction
5. Customer redeems points → Apply discount to order

### Referral Flow
1. User gets referral code → Referral created
2. Referee uses code → Referral status = pending
3. Referee places order → Signal checks referral
4. Order meets minimum → Referral status = completed
5. Rewards issued → To both referrer and referee

## Performance Considerations

1. **Cached Values**: Segment contact counts cached
2. **Async Processing**: All email sending via Celery
3. **Database Indexes**: All foreign keys and frequently queried fields indexed
4. **Denormalized Analytics**: CampaignAnalytics for fast queries
5. **Batch Processing**: Segment refresh and automation processing batched

## Security

1. **JWT Authentication**: All endpoints require authentication (except tracking/unsubscribe)
2. **Permission Checks**: Staff-only for campaign management and analytics
3. **Data Validation**: Serializers validate all input data
4. **Unsubscribe Links**: All emails include unsubscribe links
5. **GDPR Compliance**: Unsubscribe and preference management

## Email Infrastructure

- Uses Django's EmailMultiAlternatives for sending
- Gmail SMTP configured in settings
- Tracking via 1x1 pixel (opens) and redirect URLs (clicks)
- Template variable substitution for personalization

## Future Enhancements

1. **SendGrid Integration**: Better deliverability and analytics
2. **A/B Testing**: Subject line and content testing
3. **Advanced Segmentation**: More complex criteria
4. **SMS Marketing**: SMS notifications
5. **Landing Pages**: Campaign landing pages
6. **Social Media Integration**: Social sharing
7. **Advanced Analytics**: Cohort analysis, customer journey

## Testing

- Unit tests for services
- Integration tests for automations
- API endpoint tests
- Permission tests

## Migration Notes

When deploying:
1. Run migrations: `python manage.py migrate marketing`
2. Create initial segments (e.g., "All Customers")
3. Set up welcome automation
4. Configure loyalty program
5. Restart Celery workers to pick up new tasks
6. Verify Celery Beat schedule is running

