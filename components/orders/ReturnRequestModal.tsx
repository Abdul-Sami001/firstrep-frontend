// components/orders/ReturnRequestModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Package } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useRequestReturn, useRequestReturnGuest } from '@/hooks/useOrders';
import { Order, OrderItem } from '@/lib/api/orders';
import { useAuth } from '@/contexts/AuthContext';

interface ReturnRequestModalProps {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const RETURN_REASONS = [
    { value: 'defective', label: 'Item is defective' },
    { value: 'wrong_item', label: 'Wrong item received' },
    { value: 'not_as_described', label: 'Not as described' },
    { value: 'changed_mind', label: 'Changed my mind' },
    { value: 'size_issue', label: 'Size doesn\'t fit' },
    { value: 'other', label: 'Other reason' },
] as const;

interface SelectedReturnItem {
    orderItemId: string;
    quantity: number;
    maxQuantity: number;
    reason?: string;
}

export default function ReturnRequestModal({
    order,
    open,
    onOpenChange,
}: ReturnRequestModalProps) {
    const { isAuthenticated } = useAuth();
    const [reason, setReason] = useState<string>('');
    const [reasonDetails, setReasonDetails] = useState('');
    const [email, setEmail] = useState(order.guest_email || '');
    const [emailError, setEmailError] = useState('');
    const [selectedItems, setSelectedItems] = useState<Map<string, SelectedReturnItem>>(new Map());

    const returnMutation = useRequestReturn();
    const returnGuestMutation = useRequestReturnGuest();

    const isLoading = returnMutation.isPending || returnGuestMutation.isPending;

    // Initialize selected items when modal opens
    useEffect(() => {
        if (open) {
            const itemsMap = new Map<string, SelectedReturnItem>();
            order.items.forEach((item) => {
                itemsMap.set(item.id.toString(), {
                    orderItemId: item.id.toString(),
                    quantity: 0,
                    maxQuantity: item.quantity,
                });
            });
            setSelectedItems(itemsMap);
        }
    }, [open, order.items]);

    const handleItemToggle = (itemId: string, maxQuantity: number) => {
        const newSelectedItems = new Map(selectedItems);
        const current = newSelectedItems.get(itemId);
        
        if (current && current.quantity > 0) {
            // Unselect item
            newSelectedItems.set(itemId, {
                orderItemId: itemId,
                quantity: 0,
                maxQuantity,
            });
        } else {
            // Select item with quantity 1
            newSelectedItems.set(itemId, {
                orderItemId: itemId,
                quantity: 1,
                maxQuantity,
            });
        }
        setSelectedItems(newSelectedItems);
    };

    const handleQuantityChange = (itemId: string, quantity: number, maxQuantity: number) => {
        const newSelectedItems = new Map(selectedItems);
        const current = newSelectedItems.get(itemId);
        if (current) {
            const newQuantity = Math.max(0, Math.min(quantity, maxQuantity));
            newSelectedItems.set(itemId, {
                ...current,
                quantity: newQuantity,
            });
            setSelectedItems(newSelectedItems);
        }
    };

    const getSelectedItemsArray = (): SelectedReturnItem[] => {
        return Array.from(selectedItems.values()).filter(item => item.quantity > 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason) {
            return;
        }

        const itemsToReturn = getSelectedItemsArray();
        if (itemsToReturn.length === 0) {
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
            return_items: itemsToReturn.map(item => ({
                order_item_id: item.orderItemId,
                quantity: item.quantity,
                reason: item.reason || undefined,
            })),
            ...(!isAuthenticated && { email }),
        };

        try {
            if (isAuthenticated) {
                await returnMutation.mutateAsync({
                    orderId: order.id,
                    data: payload,
                });
            } else {
                if (!order.guest_tracking_token) {
                    return;
                }
                await returnGuestMutation.mutateAsync({
                    trackingToken: order.guest_tracking_token,
                    data: payload,
                });
            }
            // Reset form
            setReason('');
            setReasonDetails('');
            setEmail(order.guest_email || '');
            setSelectedItems(new Map());
            onOpenChange(false);
        } catch (error) {
            // Error handled by mutation hook
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setReason('');
            setReasonDetails('');
            setEmail(order.guest_email || '');
            setEmailError('');
            setSelectedItems(new Map());
            onOpenChange(false);
        }
    };

    const selectedItemsArray = getSelectedItemsArray();

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-white">
                        Request Order Return
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Select the items you want to return and provide a reason. Your request will be reviewed by our team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    {/* Items Selection */}
                    <div className="space-y-3">
                        <Label className="text-white">
                            Select Items to Return <span className="text-red-400">*</span>
                        </Label>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {order.items.map((item) => {
                                const selectedItem = selectedItems.get(item.id.toString());
                                const isSelected = selectedItem && selectedItem.quantity > 0;
                                
                                return (
                                    <div
                                        key={item.id}
                                        className={`p-4 rounded-lg border ${
                                            isSelected
                                                ? 'bg-gray-800/50 border-[#3c83f6]'
                                                : 'bg-gray-800/30 border-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() =>
                                                    handleItemToggle(item.id.toString(), item.quantity)
                                                }
                                                className="mt-1"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white">
                                                    {item.product_name || `Item #${item.id}`}
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Quantity ordered: {item.quantity}
                                                </p>
                                                {(item.size || item.color) && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {item.size && `Size: ${item.size}`}
                                                        {item.size && item.color && ' • '}
                                                        {item.color && `Color: ${item.color}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {isSelected && selectedItem && (
                                            <div className="mt-3 ml-7 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <Label className="text-sm text-gray-300">
                                                        Quantity to return:
                                                    </Label>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.id.toString(),
                                                                    selectedItem.quantity - 1,
                                                                    item.quantity
                                                                )
                                                            }
                                                            disabled={selectedItem.quantity <= 1}
                                                            className="h-8 w-8 p-0 border-gray-600 text-gray-300"
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="text-white font-medium w-8 text-center">
                                                            {selectedItem.quantity}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.id.toString(),
                                                                    selectedItem.quantity + 1,
                                                                    item.quantity
                                                                )
                                                            }
                                                            disabled={selectedItem.quantity >= item.quantity}
                                                            className="h-8 w-8 p-0 border-gray-600 text-gray-300"
                                                        >
                                                            +
                                                        </Button>
                                                        <span className="text-sm text-gray-400">
                                                            / {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-400">
                                                        Item-specific reason (optional):
                                                    </Label>
                                                    <Input
                                                        value={selectedItem.reason || ''}
                                                        onChange={(e) => {
                                                            const newSelectedItems = new Map(selectedItems);
                                                            const current = newSelectedItems.get(item.id.toString());
                                                            if (current) {
                                                                newSelectedItems.set(item.id.toString(), {
                                                                    ...current,
                                                                    reason: e.target.value,
                                                                });
                                                                setSelectedItems(newSelectedItems);
                                                            }
                                                        }}
                                                        placeholder="e.g., Damaged, Wrong size"
                                                        className="bg-gray-800 border-gray-700 text-white text-sm placeholder:text-gray-500 focus:border-[#3c83f6]"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {selectedItemsArray.length === 0 && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                Please select at least one item to return
                            </p>
                        )}
                    </div>

                    {/* Reason Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-white">
                            Reason for Return <span className="text-red-400">*</span>
                        </Label>
                        <Select value={reason} onValueChange={setReason} required>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#3c83f6]">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                {RETURN_REASONS.map((r) => (
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
                            disabled={isLoading || !reason || selectedItemsArray.length === 0}
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
