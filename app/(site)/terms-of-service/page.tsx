// app/(site)/terms-of-service/page.tsx - Terms of Service Page (redirects to shipping-returns)
import { redirect } from 'next/navigation';

export default function TermsOfServicePage() {
  redirect('/shipping-returns');
}

