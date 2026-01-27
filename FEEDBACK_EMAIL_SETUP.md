# Feedback Email Setup Guide

## Quick Setup (Choose One Method)

### Method 1: Simple Email Configuration (Recommended)

The feedback form is now configured to send emails. To set it up:

1. **Set the recipient email address** in `.env.local`:
   ```env
   FEEDBACK_EMAIL=your-email@example.com
   ```

2. **Choose an email service** (pick one):

   #### Option A: Resend (Easiest - Free tier available)
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=feedback@1strep.com
   ```
   - Sign up at https://resend.com
   - Get your API key
   - Add to `.env.local`

   #### Option B: SendGrid
   ```env
   SENDGRID_API_KEY=SG.your_api_key_here
   ```
   - Sign up at https://sendgrid.com
   - Get your API key
   - Add to `.env.local`

3. **Install the email service package** (if using Resend):
   ```bash
   npm install resend
   ```

### Method 2: Frontend-Only with EmailJS (No Backend Required)

If you prefer a completely frontend-only solution:

1. Sign up at https://www.emailjs.com (free tier available)
2. Create an email service and template
3. Get your Service ID, Template ID, and Public Key
4. Update the feedback form to use EmailJS (see `app/(site)/feedback/page.tsx`)

## Current Configuration

- **Default Email**: `support@1strep.com`
- **API Route**: `/api/feedback`
- **Form Location**: `/feedback`

## Testing

1. Fill out the feedback form at `/feedback`
2. Submit the form
3. Check your configured email inbox

## Troubleshooting

- If emails aren't sending, check the browser console and server logs
- Make sure your `.env.local` file is in the root directory
- Restart your development server after adding environment variables
