import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartSheetProps {
  children?: React.ReactNode;
}

export default function CartSheet({ children }: CartSheetProps) {
  const { cartItems, updateQuantity, removeItem, totalItems, subtotal, shipping, total } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            data-testid="button-cart-trigger"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                data-testid="badge-cart-count"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle data-testid="cart-title">Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground" data-testid="empty-cart-message">Your cart is empty</p>
            <Button onClick={() => window.location.href = '/shop'} data-testid="button-continue-shopping">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 p-4 border border-card-border rounded-lg" data-testid={`cart-item-${item.id}`}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    data-testid={`cart-item-image-${item.id}`}
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm" data-testid={`cart-item-name-${item.id}`}>{item.name}</h3>
                        <p className="text-xs text-muted-foreground" data-testid={`cart-item-details-${item.id}`}>
                          {item.color} • {item.size}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-card-border rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 py-1 text-sm" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <span className="font-semibold" data-testid={`cart-item-total-${item.id}`}>
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-card-border pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span data-testid="subtotal-label">Subtotal</span>
                  <span data-testid="subtotal-amount">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span data-testid="shipping-label">Shipping</span>
                  <span data-testid="shipping-amount">
                    {shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 75 && (
                  <p className="text-xs text-muted-foreground" data-testid="free-shipping-message">
                    Add £{(75 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between font-semibold border-t border-card-border pt-2">
                  <span data-testid="total-label">Total</span>
                  <span data-testid="total-amount">£{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => window.location.href = '/checkout'}
                  data-testid="button-checkout"
                >
                  Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/checkout'}
                  data-testid="button-view-cart"
                >
                  View Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}