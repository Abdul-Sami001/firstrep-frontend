import { X, Minus, Plus, Trash2, Loader2, ShoppingBag } from 'lucide-react';
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
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeCart}
        data-testid="overlay-cart"
      />
      
      {/* Cart Panel - Dark Theme */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#000000] border-l border-gray-800 z-50 shadow-2xl flex flex-col transition-transform"
        data-testid="panel-cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-white" />
            <h2 className="text-xl font-bold text-white" data-testid="text-cart-title">
              Shopping Cart {totalItems > 0 && <span className="text-gray-400 font-normal">({totalItems})</span>}
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeCart} 
            className="text-gray-400 hover:text-white hover:bg-gray-900"
            data-testid="button-close-cart"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                  <p className="text-gray-400">Loading cart...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">Failed to load cart</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="border-gray-700 text-white hover:bg-gray-900"
                >
                  Retry
                </Button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg" data-testid="text-empty-cart">
                  Your cart is empty
                </p>
                <Link href="/shop-clean">
                  <Button
                    variant="outline"
                    className="mt-6 border-white/20 text-white hover:bg-white hover:text-black"
                  >
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={`${item.id}-${item.size}-${item.color}`} 
                    className="flex gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
                    data-testid={`item-cart-${item.id}`}
                  >
                    {/* Product Image */}
                    {item.image ? (
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-800">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700 flex-shrink-0">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-white mb-1 line-clamp-2" data-testid={`text-cart-item-name-${item.id}`}>
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs text-gray-400">Size: <span className="text-gray-300">{item.size}</span></span>
                        {item.color && (
                          <span className="text-xs text-gray-400">Color: <span className="text-gray-300">{item.color}</span></span>
                        )}
                      </div>
                      <p className="font-bold text-white mb-3" data-testid={`text-cart-item-price-${item.id}`}>
                        ${Number(item.price).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-white font-medium" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-auto text-gray-400 hover:text-red-400 hover:bg-red-900/20"
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
          </div>
        </ScrollArea>

        {/* Footer - Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-800 p-6 space-y-4 bg-gray-900/30">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium" data-testid="text-subtotal">
                  ${Number(subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white font-medium" data-testid="text-shipping">
                  {shipping === 0 ? (
                    <span className="text-green-400">FREE</span>
                  ) : (
                    `$${Number(shipping).toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-800">
                <span className="text-white">Total</span>
                <span className="text-white" data-testid="text-total">
                  ${Number(total).toFixed(2)}
                </span>
              </div>
            </div>
            <Link href="/checkout" className="block">
              <Button
                className="w-full bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold uppercase text-sm shadow-lg shadow-[#00bfff]/30 hover:shadow-[#00bfff]/40 transition-all duration-300 border-0 h-12"
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
            <Link href="/shop-clean" className="block">
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}