'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useOrders } from '@/lib/orders-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle, MessageCircle, Home, Package, MapPin, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface PageProps {
  params: Promise<{ orderId: string }>
}

function OrderConfirmationContent({ orderId }: { orderId: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const { getOrderById } = useOrders()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrder = () => {
      const foundOrder = getOrderById(orderId)
      if (foundOrder && foundOrder.userId === user?.id) {
        setOrder(foundOrder)
      } else {
        toast.error('Order not found')
        router.push('/dashboard')
      }
      setIsLoading(false)
    }

    if (user) {
      loadOrder()
    }
  }, [orderId, user, getOrderById, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-background dark:from-green-950/20 dark:to-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-muted-foreground">Thank you for your order. We've received your request.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Order Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Your order has been submitted via WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order ID */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono text-lg font-bold text-foreground">{order.id}</p>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Services Ordered</h3>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{item.serviceName}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary">{(item.price * item.quantity).toFixed(2)} TND</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">{order.totalAmount.toFixed(2)} TND</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">WhatsApp Submitted</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Our team will confirm your order shortly</p>
                </div>
              </div>

              {/* Notes if any */}
              {order.notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</p>
                  <p className="text-sm text-foreground">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer & Next Steps */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground break-all">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">{user?.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-primary mt-0.5">1.</span>
                    <span className="text-muted-foreground">Keep an eye on your WhatsApp for confirmation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-primary mt-0.5">2.</span>
                    <span className="text-muted-foreground">Our team will verify and process your order</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-primary mt-0.5">3.</span>
                    <span className="text-muted-foreground">Payment details will be confirmed via WhatsApp</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-primary mt-0.5">4.</span>
                    <span className="text-muted-foreground">Receive your credentials instantly after payment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <a
              href="https://wa.me/21695555555?text=Hello%20AtlasVault%20support"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-[#25D366] hover:bg-[#20BA5C] text-white gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Button>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Package className="w-4 h-4" />
              View My Orders
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Have questions? Our support team is available 24/7
          </p>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage({ params }: PageProps) {
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setOrderId(p.orderId))
  }, [params])

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <OrderConfirmationContent orderId={orderId} />
    </ProtectedRoute>
  )
}
