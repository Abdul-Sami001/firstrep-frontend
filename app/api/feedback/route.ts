// app/api/feedback/route.ts - Feedback API Route
import { NextRequest, NextResponse } from 'next/server';

// ============================================
// CONFIGURE YOUR EMAIL HERE
// ============================================
// Set this environment variable in your .env.local file:
// FEEDBACK_EMAIL=your-email@example.com
// Or change the default below:
const FEEDBACK_EMAIL = process.env.FEEDBACK_EMAIL || 'support@1strep.com';

// Optional: Configure email sending service
// Option 1: Use Resend (recommended - free tier: https://resend.com)
// Set RESEND_API_KEY in your .env.local file
// Option 2: Use SendGrid, Nodemailer, or any other email service

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, feedbackType, subject, message, email, name, userEmail, userName } = body;

    // Get user info (from auth if logged in, or from form if guest)
    const userEmailFinal = userEmail || email;
    const userNameFinal = userName || name;

    // Format the email content
    const emailSubject = `Feedback: ${subject}`;
    const emailBody = `
New Feedback Received

Rating: ${rating}/5
Type: ${feedbackType}
Subject: ${subject}

Message:
${message}

---
Submitted by: ${userNameFinal} (${userEmailFinal})
Date: ${new Date().toLocaleString()}
    `.trim();

    // Email sending can be configured here
    // To enable email sending, you can:
    // 1. Install Resend: npm install resend
    // 2. Set RESEND_API_KEY in .env.local
    // 3. Uncomment and configure the email sending code below
    // 
    // Example with Resend (after installing):
    // if (process.env.RESEND_API_KEY) {
    //   const { Resend } = require('resend');
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.emails.send({
    //     from: process.env.RESEND_FROM_EMAIL || 'feedback@1strep.com',
    //     to: FEEDBACK_EMAIL,
    //     subject: emailSubject,
    //     text: emailBody,
    //     replyTo: userEmailFinal,
    //   });
    // }

    // Log the feedback (you can configure email sending above)
    // For production, you should set up one of these:
    // 1. Resend: Add RESEND_API_KEY to .env.local
    // 2. SendGrid: Add SENDGRID_API_KEY to .env.local
    // 3. Nodemailer: Configure SMTP settings
    console.log('Feedback received (email not sent - configure email service):', {
      to: FEEDBACK_EMAIL,
      subject: emailSubject,
      body: emailBody,
    });

    // For development: Return mailto link
    const mailtoLink = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback submitted successfully',
        note: 'Email service not configured. Configure RESEND_API_KEY in .env.local to enable email sending.',
        mailtoLink // For development/testing
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit feedback', error: error.message },
      { status: 500 }
    );
  }
}
