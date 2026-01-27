// components/orders/CancellationRequestModal.tsx
'use client';
import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useRequestCancellation, useRequestCancellationGuest } from '@/hooks/useOrders';
import { Order } from '@/lib/api/orders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CancellationRequestModalProps {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CANCELLATION_REASONS = [
    { value: 'changed_mind', label: 'Changed my mind' },
    { value: 'found_cheaper', label: 'Found cheaper elsewhere' },
    { value: 'wrong_item', label: 'Ordered wrong item' },
    { value: 'delayed_delivery', label: 'Delivery taking too long' },
    { value: 'other', label: 'Other reason' },
] as const;

export default function CancellationRequestModal({
    order,
    open,
    onOpenChange,
}: CancellationRequestModalProps) {
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [reason, setReason] = useState<string>('');
    const [reasonDetails, setReasonDetails] = useState('');
    const [email, setEmail] = useState(order?.guest_email || '');
    const [emailError, setEmailError] = useState('');

    const cancellationMutation = useRequestCancellation();
    const cancellationGuestMutation = useRequestCancellationGuest();

    const isLoading = cancellationMutation.isPending || cancellationGuestMutation.isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason) {
            return;
        }

        // Validate order exists
        if (!order) {
            toast({
                title: "Error",
                description: "Order information is missing. Please refresh the page.",
                variant: "destructive",
            });
            return;
        }

        // Validate email for guest requests
        if (!isAuthenticated) {
            if (!email) {
                setEmailError('Email is required');
                return;
            }
            if (email !== order.guest_email) {
                setEmailError('Email does not match the order email');
                return;
            }
        }

        setEmailError('');

        const payload = {
            reason: reason as any,
            reason_details: reasonDetails || undefined,
            ...(!isAuthenticated && { email }),
        };

        try {
            if (isAuthenticated) {
                if (!order?.id) {
                    toast({
                        title: "Error",
                        description: "Order information is missing. Please refresh the page.",
                        variant: "destructive",
                    });
                    return;
                }
                await cancellationMutation.mutateAsync({
                    orderId: String(order.id),
                    data: payload,
                });
            } else {
                if (!order.guest_tracking_token) {
                    toast({
                        title: "Error",
                        description: "Tracking token is missing. Please refresh the page.",
                        variant: "destructive",
                    });
                    return;
                }
                await cancellationGuestMutation.mutateAsync({
                    trackingToken: order.guest_tracking_token,
                    data: payload,
                });
            }
            // Reset form
            setReason('');
            setReasonDetails('');
            setEmail(order.guest_email || '');
            onOpenChange(false);
        } catch (error) {
            // Error handled by mutation hook
            console.error('Cancellation request error:', error);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setReason('');
            setReasonDetails('');
            setEmail(order.guest_email || '');
            setEmailError('');
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-white">
                        Request Order Cancellation
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Please provide a reason for cancelling this order. Your request will be reviewed by our team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Guest Email Field */}
                    {!isAuthenticated && (
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">
                                Email Address <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError('');
                                }}
                                placeholder="Enter your email"
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
                                required
                            />
                            {emailError && (
                                <p className="text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {emailError}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Reason Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-white">
                            Reason for Cancellation <span className="text-red-400">*</span>
                        </Label>
                        <Select value={reason} onValueChange={setReason} required>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#3c83f6]">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                {CANCELLATION_REASONS.map((r) => (
                                    <SelectItem
                                        key={r.value}
                                        value={r.value}
                                        className="focus:bg-gray-700 focus:text-white"
                                    >
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2">
                        <Label htmlFor="reasonDetails" className="text-white">
                            Additional Details (Optional)
                        </Label>
                        <Textarea
                            id="reasonDetails"
                            value={reasonDetails}
                            onChange={(e) => setReasonDetails(e.target.value)}
                            placeholder="Please provide any additional information..."
                            rows={4}
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6] resize-none"
                        />
                    </div>

                    {/* Order Info */}
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400">
                            Total: £{parseFloat(order.total).toFixed(2)}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !reason}
                            className="flex-1 bg-[#3c83f6] hover:bg-[#2563eb] text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
