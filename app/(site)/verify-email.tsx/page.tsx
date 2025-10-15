// app/(site)/verify-email/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVerifyEmail } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
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
                    onSuccess: () => {
                        setStatus('success');
                        setMessage('Your email has been verified successfully!');
                    },
                    onError: (error: any) => {
                        setStatus('error');
                        setMessage(error.response?.data?.detail || 'Verification failed');
                    },
                }
            );
        } else {
            setStatus('error');
            setMessage('Invalid verification link');
        }
    }, [uid, token]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6">
                <div className="text-center space-y-4">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                            <h1 className="text-2xl font-bold">Verifying Email</h1>
                            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                            <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
                            <p className="text-muted-foreground">{message}</p>
                            <Button onClick={() => window.location.href = '/CustomerLogin'}>
                                Continue to Login
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="h-12 w-12 mx-auto text-red-500" />
                            <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
                            <Alert variant="destructive">
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                            <Button variant="outline" onClick={() => window.location.href = '/CustomerLogin'}>
                                Back to Login
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}