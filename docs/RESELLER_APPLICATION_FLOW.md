# Reseller Application Flow - Complete Guide

## Overview

This document explains the complete journey from when someone applies to become a reseller through the portal, to when they can start using the reseller dashboard.

## Current Application Flow

### Step 1: User Visits Reseller Portal
- User navigates to `/ResellerLogin` or clicks "Apply as Reseller" from the main reseller portal page
- They see a beautiful login/application page with two options:
  - **Sign In** (if they already have an account)
  - **Apply as Reseller or Vendor** (for new applicants)

### Step 2: User Chooses to Apply
- User clicks "Apply as Reseller or Vendor"
- They see role selection screen with two options:
  - **Reseller**: Commission-based model (10-20% commission)
  - **Wholesaler**: Wholesale pricing model (up to 35% discount)
- User selects their preferred role

### Step 3: User Fills Application Form
The application form collects:
- **Business Email** (required)
- **Password** (required - creates account)
- **Business Name** (required)
- **Contact Person** (required)
- **Phone Number** (required)
- **Business Address** (required)

### Step 4: Application Submission
**Current Status**: ⚠️ **NOT FULLY IMPLEMENTED**

Currently, the form:
1. Shows a success message: "Application Submitted"
2. Displays: "Your application has been submitted successfully. We'll get back to you soon."
3. Resets the form
4. Returns to login view

**What Should Happen** (needs backend API):
1. Create a user account with the provided email/password
2. Create a `ResellerApplication` record with status `submitted`
3. Send confirmation email to applicant
4. Notify admin team of new application
5. Store application data for admin review

## What Happens After Submission

### Immediate (Automated)
1. **User Account Created**: A user account is created (if not exists) with the provided email
2. **Application Record Created**: A `ResellerApplication` is created with:
   - Status: `submitted`
   - All form data stored
   - Timestamp recorded
3. **Email Notifications**:
   - Applicant receives confirmation email
   - Admin team receives notification of new application

### Admin Review Process (Manual)
1. **Admin Views Application**:
   - Admin logs into admin panel
   - Navigates to `/api/v1/admin/reseller-applications/`
   - Sees list of applications with status `submitted`
   - Can view full application details

2. **Admin Reviews**:
   - Reviews business information
   - Checks company legitimacy
   - Evaluates fit for reseller program
   - May request additional information

3. **Admin Decision**:

   **If APPROVED**:
   - Admin clicks "Approve" in admin panel
   - System automatically:
     - Creates/updates `ResellerProfile` for the user
     - Assigns initial tier (typically **Bronze** - 10% commission)
     - Sets `User.role = "reseller"`
     - Sets application status to `approved`
     - Sends approval email to applicant
   - Applicant can now:
     - Log in to reseller portal
     - Access dashboard
     - Create storefronts
     - Start earning commissions

   **If REJECTED**:
   - Admin clicks "Reject" and provides reason
   - System:
     - Sets application status to `rejected`
     - Stores rejection reason
     - Sends rejection email to applicant with reason
   - Applicant cannot access reseller portal

## Application Statuses

| Status | Description | What It Means |
|--------|-------------|---------------|
| `submitted` | Application just submitted | Waiting for admin review |
| `under_review` | Admin is reviewing | Application being processed |
| `approved` | Application approved | User can now access reseller portal |
| `rejected` | Application rejected | User cannot become reseller (can reapply) |

## Timeline Expectations

- **Application Submission**: Instant (automated)
- **Admin Review**: 2-3 business days (manual)
- **Approval/Rejection**: Immediate after admin decision
- **Portal Access**: Immediate after approval

## What Applicants Need to Know

### Before Applying
- Have business information ready
- Valid business email address
- Clear understanding of how they'll promote the brand
- Information about their locations/traffic (for resellers)

### After Applying
- Check email for confirmation
- Wait 2-3 business days for review
- If approved: Log in and start using the portal
- If rejected: Review reason and can reapply

### After Approval
- Log in with the email/password used in application
- Access full reseller dashboard
- Create storefronts
- View commissions and analytics
- Access marketing materials

## Missing Implementation

### Frontend (Current Status)
✅ Application form UI is complete
✅ Form validation works
✅ Success/error messages display
❌ **NOT CONNECTED TO BACKEND API**

### Backend API Needed
The following endpoint should exist (or needs to be created):

```
POST /api/v1/reseller-applications/
```

**Request Body**:
```json
{
  "email": "business@example.com",
  "password": "securepassword",
  "company_name": "Elite Fitness Gym",
  "contact_name": "John Doe",
  "contact_phone": "+44 7XXX XXXXXX",
  "business_address": "123 Main St, London",
  "website_url": "https://example.com",  // optional
  "description": "How they'll promote the brand",  // optional
  "location_description": "Gym locations",  // optional
  "expected_traffic": "High traffic gym"  // optional
}
```

**Response**:
```json
{
  "id": "uuid",
  "status": "submitted",
  "company_name": "Elite Fitness Gym",
  "created_at": "2024-01-15T10:00:00Z",
  "message": "Application submitted successfully. You will receive an email confirmation."
}
```

## Next Steps to Complete Integration

1. **Backend**: Create public `POST /api/v1/reseller-applications/` endpoint
2. **Frontend**: Wire form submission to API endpoint
3. **Email Service**: Set up email notifications (confirmation + admin alert)
4. **Testing**: Test full flow from application to approval

## Alternative: Email-Based Application

If API endpoint doesn't exist yet, you could:
1. Collect form data
2. Send email to admin with application details
3. Admin manually creates application in admin panel
4. Admin approves through existing admin workflow

This is a temporary workaround until the API endpoint is available.

