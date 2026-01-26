// app/(site)/account/orders/[id]/review/page.tsx - Redirect to orders review page
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AccountOrderReviewRedirect() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;

    useEffect(() => {
        // Redirect to the actual review page
        if (orderId) {
            router.replace(`/orders/${orderId}/review`);
        }
    }, [orderId, router]);

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                <p className="text-lg font-medium text-white">Redirecting...</p>
            </div>
        </div>
    );
}
