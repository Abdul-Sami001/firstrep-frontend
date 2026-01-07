# Reseller Application Flow - Quick Summary

## 🎯 What Happens When Someone Applies?

### Step-by-Step Journey

```
User Visits Portal
       ↓
Chooses "Apply as Reseller"
       ↓
Fills Application Form
       ↓
Submits Application
       ↓
[BACKEND PROCESSES]
       ↓
Admin Reviews (2-3 days)
       ↓
Admin Approves/Rejects
       ↓
User Gets Email Notification
       ↓
If Approved: Can Login & Use Portal
```

## 📋 Detailed Flow

### 1. **Application Submission** (User Action)
- User fills out form with:
  - Business email & password (creates account)
  - Business name
  - Contact person name
  - Phone number
  - Business address
- Clicks "Submit Application"
- **What happens:**
  - ✅ Form data sent to backend API: `POST /api/v1/reseller-applications/`
  - ✅ User account created automatically
  - ✅ `ResellerApplication` record created with status `submitted`
  - ✅ Confirmation email sent to applicant
  - ✅ Admin team notified of new application

### 2. **Admin Review** (Admin Action - 2-3 business days)
- Admin logs into admin panel
- Views application at: `/api/v1/admin/reseller-applications/`
- Reviews business information
- Makes decision: **Approve** or **Reject**

### 3. **If Approved** ✅
**What happens automatically:**
- `ResellerProfile` created for the user
- User assigned to **Bronze Tier** (10% commission rate)
- User role set to `"reseller"`
- Application status changed to `approved`
- Approval email sent to applicant

**What user can do now:**
- ✅ Log in to reseller portal (`/ResellerLogin`)
- ✅ Access dashboard (`/ResellerDashboard`)
- ✅ View analytics and commissions
- ✅ Create storefronts
- ✅ Access marketing materials
- ✅ Start earning commissions on sales

### 4. **If Rejected** ❌
**What happens:**
- Application status changed to `rejected`
- Rejection reason stored
- Rejection email sent with reason
- User cannot access reseller portal
- User can reapply if they want

## ⏱️ Timeline

| Stage | Duration | Who |
|-------|----------|-----|
| Application Submission | Instant | Automated |
| Admin Review | 2-3 business days | Admin Team |
| Approval/Rejection | Instant | Automated |
| Portal Access | Immediate after approval | User |

## 📧 Email Notifications

1. **Application Submitted** → Sent to applicant immediately
2. **New Application** → Sent to admin team
3. **Application Approved** → Sent to applicant with welcome info
4. **Application Rejected** → Sent to applicant with reason

## 🔐 What User Needs

### To Apply:
- Valid business email
- Business information
- Clear password

### After Approval:
- Same email/password from application
- Can log in and start using portal immediately

## 🎁 Benefits After Approval

1. **Dashboard Access**: View sales, commissions, analytics
2. **Storefront Management**: Create multiple storefronts (gym screens, links, etc.)
3. **Commission Tracking**: See all commissions earned
4. **Marketing Materials**: Access brand assets based on tier
5. **Profile Management**: Update business information

## ⚠️ Important Notes

- **Application is NOT instant approval** - requires admin review
- **User account is created immediately** when application is submitted
- **User cannot access portal until approved**
- **If rejected, user can reapply** with updated information

## 🔄 Current Implementation Status

✅ **Frontend**: Complete and wired to API
✅ **API Integration**: Ready (calls `/api/v1/reseller-applications/`)
⏳ **Backend**: Needs `POST /api/v1/reseller-applications/` endpoint
⏳ **Email Service**: Needs to be configured for notifications

## 📞 Support

If applicant has questions:
- Check email for status updates
- Contact support if no response after 3 business days
- Can reapply if application was rejected

