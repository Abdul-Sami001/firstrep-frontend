# Marketing App Setup Guide

## Prerequisites

1. Django project with CRM app installed
2. Celery and Redis running
3. Database migrations applied
4. Email backend configured (Gmail SMTP)

## Installation Steps

### 1. Run Migrations

```bash
python manage.py makemigrations marketing
python manage.py migrate marketing
```

### 2. Verify Celery Configuration

Ensure `backend/celery.py` includes marketing tasks in the beat schedule:
- `refresh-dynamic-segments` - Daily at 2 AM
- `process-automation-emails` - Every 15 minutes
- `process-referral-rewards` - Daily at 1 AM
- `expire-gift-cards` - Daily at 4 AM

### 3. Create Initial Segments

Create some basic segments for common use cases:

```python
from marketing.models import Segment
from django.contrib.auth import get_user_model

User = get_user_model()
admin_user = User.objects.filter(is_staff=True).first()

# All Customers
Segment.objects.create(
    name="All Customers",
    type="dynamic",
    criteria={"lifecycle_stage": "customer"},
    created_by=admin_user
)

# VIP Customers (LTV > £500)
Segment.objects.create(
    name="VIP Customers",
    type="dynamic",
    criteria={"lifecycle_stage": "customer", "min_ltv": 500.00},
    created_by=admin_user
)

# New Customers (registered in last 30 days)
# Note: This would require date-based criteria (future enhancement)
```

### 4. Set Up Welcome Automation

Create a welcome series for new customers:

```python
from marketing.models import Automation, AutomationEmail, EmailTemplate
from django.contrib.auth import get_user_model

User = get_user_model()
admin_user = User.objects.filter(is_staff=True).first()

# Create templates
welcome_template = EmailTemplate.objects.create(
    name="Welcome Email 1",
    subject="Welcome to 1stRep!",
    html_content="""
    <h1>Welcome {{first_name}}!</h1>
    <p>Thank you for joining 1stRep. We're excited to have you!</p>
    <p>Start shopping: <a href="https://yourstore.com">Browse Products</a></p>
    """,
    text_content="Welcome! Thank you for joining 1stRep.",
    category="automation",
    created_by=admin_user
)

recommendations_template = EmailTemplate.objects.create(
    name="Welcome Email 2 - Recommendations",
    subject="Products You'll Love",
    html_content="""
    <h1>Hi {{first_name}},</h1>
    <p>Check out our best sellers:</p>
    <p><a href="https://yourstore.com/products">Shop Now</a></p>
    """,
    text_content="Check out our best sellers!",
    category="automation",
    created_by=admin_user
)

# Create automation
automation = Automation.objects.create(
    name="Welcome Series",
    trigger_type="user_registered",
    status="active",
    created_by=admin_user
)

# Add emails to automation
AutomationEmail.objects.create(
    automation=automation,
    email_order=1,
    delay_hours=0,  # Immediate
    template=welcome_template,
    subject_line="Welcome to 1stRep!"
)

AutomationEmail.objects.create(
    automation=automation,
    email_order=2,
    delay_hours=24,  # 24 hours later
    template=recommendations_template,
    subject_line="Products You'll Love"
)
```

### 5. Configure Loyalty Program

```python
from marketing.models import LoyaltyProgram

LoyaltyProgram.objects.create(
    name="1stRep Loyalty",
    is_active=True,
    points_per_pound=1.00,  # 1 point per £1 spent
    redemption_rate=100.00  # 100 points = £1 discount
)
```

### 6. Configure Referral Program

```python
from marketing.models import ReferralProgram

ReferralProgram.objects.create(
    name="Refer a Friend",
    is_active=True,
    referrer_reward_type="discount_percent",
    referrer_reward_value=10.00,  # 10% discount
    referee_reward_type="discount_percent",
    referee_reward_value=5.00,  # 5% discount
    min_purchase_amount=50.00,  # Minimum £50 order
    expiry_days=30
)
```

### 7. Test Email Sending

Create a test campaign to verify email sending works:

```python
from marketing.models import Campaign, EmailTemplate, Segment
from marketing.services import send_campaign

# Get or create test template
template = EmailTemplate.objects.first()
segment = Segment.objects.first()

# Create test campaign
campaign = Campaign.objects.create(
    name="Test Campaign",
    template=template,
    segment=segment,
    subject_line="Test Email",
    created_by=admin_user
)

# Send campaign (this will queue emails via Celery)
send_campaign(campaign)
```

### 8. Verify Celery Workers

Ensure Celery workers are running and can process marketing tasks:

```bash
# Start Celery worker
celery -A backend worker -l info

# Start Celery beat (for scheduled tasks)
celery -A backend beat -l info
```

## Common Tasks

### Creating a Campaign

1. Create or select an email template
2. Create or select a segment
3. Create campaign via API or admin
4. Send immediately or schedule for later

### Setting Up Abandoned Cart Automation

```python
from marketing.models import Automation, AutomationEmail, EmailTemplate

# Create templates
reminder_template = EmailTemplate.objects.create(
    name="Abandoned Cart Reminder",
    subject="You left items in your cart!",
    html_content="<p>Hi {{first_name}}, you left items in your cart. <a href='{{cart_url}}'>Complete your purchase</a></p>",
    category="automation"
)

# Create automation
automation = Automation.objects.create(
    name="Abandoned Cart Recovery",
    trigger_type="cart_abandoned",
    status="active"
)

# Add emails
AutomationEmail.objects.create(
    automation=automation,
    email_order=1,
    delay_hours=2,  # 2 hours after abandonment
    template=reminder_template,
    subject_line="You left items in your cart!"
)
```

### Managing Subscribers

Subscribers are automatically created when:
- User registers (auto-subscribed)
- Contact is created (if has user)

Manually subscribe:
```python
from marketing.models import Subscriber

Subscriber.objects.create(
    email="customer@example.com",
    status="subscribed",
    source="import"
)
```

## Troubleshooting

### Emails Not Sending

1. Check Celery worker is running
2. Check email backend configuration in settings
3. Check Gmail SMTP credentials
4. Review Celery logs for errors

### Automations Not Triggering

1. Verify automation status is "active"
2. Check signal handlers are registered (in `marketing/apps.py`)
3. Verify contact exists for user
4. Check Celery beat is running for scheduled emails

### Segment Not Updating

1. Manually refresh: `POST /api/v1/marketing/segments/{id}/refresh/`
2. Check segment criteria is valid JSON
3. Verify contacts match criteria

## API Testing

Use Swagger UI to test endpoints:
- Navigate to `/api/docs/`
- Authenticate with JWT token
- Test campaign creation, sending, etc.

## Next Steps

1. Create email templates for your brand
2. Set up welcome automation
3. Create segments for targeting
4. Configure loyalty and referral programs
5. Test with real users
6. Monitor analytics

