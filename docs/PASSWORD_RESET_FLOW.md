# Password Reset Flow - Frontend Implementation

## Overview

The password reset flow allows users to reset their password via email link.

## Flow

1. **User requests password reset** (`/CustomerLogin` page)
   - User enters email and clicks "Forgot Password?"
   - Frontend calls `POST /api/v1/password-reset/` with email
   - Backend sends email with reset link

2. **User clicks email link**
   - Email contains link: `http://localhost:3000/password-reset-confirm?uid=...&token=...`
   - User is redirected to `/password-reset-confirm` page

3. **User enters new password** (`/password-reset-confirm` page)
   - Frontend extracts `uid` and `token` from URL query parameters
   - User enters new password and confirms it
   - Frontend calls `POST /api/v1/password-reset-confirm/` with uid, token, and password
   - On success, user is redirected to login page

## Frontend Implementation

### Page: `/password-reset-confirm`

**Location**: `app/(site)/password-reset-confirm/page.tsx`

**Features**:
- ✅ Extracts `uid` and `token` from URL query parameters
- ✅ Validates that both parameters are present
- ✅ Shows form to enter new password (with confirmation)
- ✅ Validates password (minimum 8 characters, passwords must match)
- ✅ Calls API endpoint to confirm reset
- ✅ Shows success state and redirects to login
- ✅ Handles errors (invalid/expired link, validation errors)
- ✅ Matches site's black theme design

### API Integration

**Endpoint**: `POST /api/v1/password-reset-confirm/`

**Request Body**:
```json
{
  "uid": "string",
  "token": "string",
  "password": "string"
}
```

**Response**:
- `200 OK`: Password reset successful
- `400 Bad Request`: Invalid uid/token or password validation failed

**Hook**: `usePasswordResetConfirm()` from `hooks/useAuth.ts`

## Backend Email URL Configuration

**IMPORTANT**: The backend email must generate a link pointing to the **frontend URL**, not the backend API URL.

**Correct** (Frontend URL):
```
http://localhost:3000/password-reset-confirm?uid=...&token=...
```

**Incorrect** (Backend API URL):
```
http://localhost:8000/api/v1/password-reset-confirm/?uid=...&token=...
```

### Backend Configuration

In your Django backend (`users/views.py` or email template), ensure the reset URL is:

```python
# Frontend URL (correct)
reset_url = f"{settings.FRONTEND_URL}/password-reset-confirm?uid={uid}&token={token}"

# NOT the backend API URL
# reset_url = f"{settings.BACKEND_URL}/api/v1/password-reset-confirm/?uid={uid}&token={token}"
```

Where `FRONTEND_URL` should be set in your Django settings (e.g., `http://localhost:3000` for development).

## Testing

1. Go to `/CustomerLogin`
2. Click "Forgot Password?"
3. Enter email and click "SEND RESET LINK"
4. Check email for reset link
5. Click link (should go to `/password-reset-confirm?uid=...&token=...`)
6. Enter new password and confirm
7. Click "Reset Password"
8. Should redirect to login page

## Error Handling

The page handles:
- ✅ Missing `uid` or `token` parameters
- ✅ Invalid/expired reset tokens
- ✅ Password validation errors (too short, mismatch)
- ✅ Network errors
- ✅ API errors (400, 500, etc.)

## Design

The page matches the site's black theme:
- Black background (`bg-[#000000]`)
- White text for headings
- Gray text for descriptions
- Gradient buttons matching login page
- Responsive design (mobile/tablet/desktop)

