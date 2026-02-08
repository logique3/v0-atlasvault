'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, MessageCircle, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = total;
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal - discountAmount;

  const applyCoupon = () => {
    if (couponCode === 'SAVE10') {
      setDiscount(10);
      toast.success('Coupon applied! 10% discount');
      setCouponCode('');
    } else if (couponCode === 'SAVE20') {
      setDiscount(20);
      toast.success('Coupon applied! 20% discount');
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckoutWithWhatsApp = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed');
      router.push('/login');
      return;
    }
    router.push('/checkout-whatsapp');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Start shopping to add items to your cart</p>
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">{items.length} item(s) in cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div>
                            <Link href={`/product/${item.slug}`}>
                              <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">Service</p>
                          </div>
                          <p className="text-lg font-bold text-primary">
                            {(item.price * item.quantity).toFixed(2)} TND
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            readOnly
                            className="w-12 text-center border-x border-border outline-none bg-background"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success('Item removed from cart');
                          }}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 overflow-hidden">
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

                {/* Pricing Breakdown */}
                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} TND</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-{discountAmount.toFixed(2)} TND</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-foreground text-lg">
                    <span>Total</span>
                    <span className="text-primary">{finalTotal.toFixed(2)} TND</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Coupon Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={!couponCode}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Try: SAVE10 or SAVE20</p>
                </div>

                {/* Auth Check */}
                {!isAuthenticated && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300 text-balance">
                      Please log in to proceed with checkout
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                {isAuthenticated ? (
                  <Button
                    onClick={handleCheckoutWithWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#20BA5C] text-white py-6 text-base font-semibold gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Checkout with WhatsApp
                  </Button>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base font-semibold gap-2">
                      <LogIn className="w-5 h-5" />
                      Sign In to Checkout
                    </Button>
                  </Link>
                )}

                {/* Continue Shopping */}
                <Link href="/products">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>

                {/* Security Info */}
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">Secure Checkout</p>
                  <p className="text-xs text-muted-foreground">
                    Your order will be securely sent via WhatsApp. Our team will confirm and handle payment.
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>✓</span>
                    <span>Free delivery on all orders</span>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>✓</span>
                    <span>Instant account activation</span>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>✓</span>
                    <span>24/7 WhatsApp support</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
