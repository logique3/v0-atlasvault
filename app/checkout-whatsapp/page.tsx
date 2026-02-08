'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { useOrders } from '@/lib/orders-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { MessageCircle, ArrowLeft, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

const WHATSAPP_NUMBER = '21695555555' // Replace with your WhatsApp number

export default function CheckoutWhatsAppPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { items, total, clearCart } = useCart()
  const { createOrder } = useOrders()
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push('/cart')
    }
  }, [isLoading, items, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (!user || items.length === 0) {
    return null
  }

  // Format order message for WhatsApp
  const formatWhatsAppMessage = (): string => {
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    let message = `🛍️ *AtlasVault Order Request*\n\n`
    message += `📋 *Order Details:*\n`
    message += `Date: ${orderDate}\n`
    message += `Order ID: ORDER-${Date.now()}\n\n`

    message += `👤 *Customer Information:*\n`
    message += `Name: ${user.fullName}\n`
    message += `Email: ${user.email}\n`
    message += `Phone: ${user.phone}\n\n`

    message += `📦 *Services Ordered:*\n`
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   Quantity: ${item.quantity}\n`
      message += `   Price: ${(item.price * item.quantity).toFixed(2)} TND\n`
    })

    message += `\n💰 *Order Total: ${total.toFixed(2)} TND*\n`

    if (notes) {
      message += `\n📝 *Additional Notes:*\n${notes}\n`
    }

    message += `\n🎯 *Payment Method: WhatsApp*\n`
    message += `Status: Pending Confirmation\n`

    return message
  }

  const handleSendToWhatsApp = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsProcessing(true)
    try {
      // Create order in system
      const orderItems = items.map((item) => ({
        id: item.id,
        serviceId: item.id,
        serviceName: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      const orderId = await createOrder(orderItems, 'whatsapp', notes)

      // Format message
      const message = formatWhatsAppMessage()
      const encodedMessage = encodeURIComponent(message)

      // Create WhatsApp link
      const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`

      // Open WhatsApp in new window
      window.open(whatsappLink, '_blank')

      toast.success('Opening WhatsApp... Your order request will be sent.')

      // Clear cart after successful creation
      setTimeout(() => {
        clearCart()
        router.push(`/order-confirmation/${orderId}`)
      }, 1500)
    } catch (error: any) {
      console.error('Error creating order:', error)
      toast.error(error.message || 'Failed to process order')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-16 bg-background/95 backdrop-blur z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your services before sending to WhatsApp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Customer Info Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Information</CardTitle>
                <CardDescription>This will be included in your WhatsApp message</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium text-foreground">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{user.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
                <CardDescription>Optional - Add any special requests or preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special requests, preferences, or additional information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Total Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{total.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">{total.toFixed(2)} TND</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-balance">
                    You'll be redirected to WhatsApp to complete your order. Our team will confirm your order and handle payment.
                  </p>
                </div>

                <Button
                  onClick={handleSendToWhatsApp}
                  disabled={isProcessing || items.length === 0}
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#20BA5C] text-white gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {isProcessing ? 'Processing...' : 'Send via WhatsApp'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/cart')}
                  className="w-full"
                >
                  Continue Shopping
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Questions? Chat with us on WhatsApp
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
