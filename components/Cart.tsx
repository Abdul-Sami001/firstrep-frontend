import { X, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    totalItems,
    subtotal,
    shipping,
    total,
    isCartOpen,
    closeCart,
    isLoading,
    error
  } = useCart();

  // ✅ Don't render if cart is closed
  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart} // ✅ Use context function
        data-testid="overlay-cart"
      />
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl flex flex-col transition-transform"
        data-testid="panel-cart"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold" data-testid="text-cart-title">Shopping Cart ({totalItems})</h2>
          <Button variant="ghost" size="icon" onClick={closeCart} data-testid="button-close-cart">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading cart...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Failed to load cart</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-12" data-testid="text-empty-cart">
              Your cart is empty
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4" data-testid={`item-cart-${item.id}`}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-md"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm" data-testid={`text-cart-item-name-${item.id}`}>{item.name}</h3>
                    <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                    <p className="text-xs text-muted-foreground">Color: {item.color}</p>
                    <p className="font-semibold mt-1" data-testid={`text-cart-item-price-${item.id}`}>
                      ${Number(item.price).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto"
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span data-testid="text-subtotal">${Number(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span data-testid="text-shipping">{shipping === 0 ? 'FREE' : `$${Number(shipping).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span data-testid="text-total">${Number(total).toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button
                className="w-full"
                size="lg"
                disabled={isLoading}
                data-testid="button-checkout"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}