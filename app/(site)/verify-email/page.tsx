// app/(site)/verify-email/page.tsx - Email Verification Page
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyEmail } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const verifyEmailMutation = useVerifyEmail();

    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    useEffect(() => {
        if (uid && token) {
            verifyEmailMutation.mutate(
                { uid, token },
                {
                    onSuccess: (data) => {
                        setStatus('success');
                        setMessage(data?.detail || 'Your email has been verified successfully! You can now log in.');
                        // Auto-redirect to login after 3 seconds
                        setTimeout(() => {
                            router.push('/CustomerLogin');
                        }, 3000);
                    },
                    onError: (error: any) => {
                        setStatus('error');
                        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message || 
                            'Verification failed. The link may be expired or invalid.';
                        setMessage(errorMessage);
                    },
                }
            );
        } else {
            setStatus('error');
            setMessage('Invalid verification link. Please check your email and try again.');
        }
    }, [uid, token, verifyEmailMutation, router]);

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-8 md:p-10 shadow-2xl">
                    <div className="text-center space-y-6">
                        {status === 'loading' && (
                            <>
                                <div className="flex justify-center">
                                    <Loader2 className="h-16 w-16 animate-spin text-[#00bfff]" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                        Verifying Your Email
                                    </h1>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        Please wait while we verify your email address...
                                    </p>
                                </div>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <CheckCircle className="h-16 w-16 text-green-500" />
                                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-green-500 mb-2">
                                        Email Verified!
                                    </h1>
                                    <p className="text-gray-300 text-sm md:text-base mb-6">
                                        {message}
                                    </p>
                                    <p className="text-gray-400 text-xs md:text-sm mb-6">
                                        Redirecting to login page...
                                    </p>
                                    <Button 
                                        onClick={() => router.push('/CustomerLogin')}
                                        className="w-full bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-medium"
                                    >
                                        Continue to Login
                                    </Button>
                                </div>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="flex justify-center">
                                    <XCircle className="h-16 w-16 text-red-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-2">
                                        Verification Failed
                                    </h1>
                                    <Alert variant="destructive" className="bg-red-900/20 border-red-800 mb-6">
                                        <AlertDescription className="text-red-300 text-sm">
                                            {message}
                                        </AlertDescription>
                                    </Alert>
                                    <div className="space-y-3">
                                        <p className="text-gray-400 text-xs md:text-sm">
                                            The verification link may have expired (links expire after 24 hours) or has already been used.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => router.push('/CustomerLogin')}
                                                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                                            >
                                                Back to Login
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => router.push('/CustomerLogin?resend=true')}
                                                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                                            >
                                                Request New Link
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs md:text-sm">
                        Need help?{' '}
                        <a 
                            href="/contact-support" 
                            className="text-[#00bfff] hover:text-[#0ea5e9] underline"
                        >
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-8 md:p-10 shadow-2xl">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 mx-auto animate-spin text-[#00bfff]" />
                            <h1 className="text-xl md:text-2xl font-bold text-white">Loading...</h1>
                            <p className="text-gray-400 text-sm">Preparing verification page...</p>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
