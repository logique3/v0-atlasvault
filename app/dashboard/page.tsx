'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useOrders } from '@/lib/orders-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, LogOut, User, Package, History, TrendingUp, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

function DashboardContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { getUserOrders } = useOrders()
  const [userOrders, setUserOrders] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      const orders = getUserOrders(user.id)
      setUserOrders(orders)
    }
  }, [user, getUserOrders])

  const handleSignOut = async () => {
    await logout()
    router.push('/')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">AtlasVault</Link>
          <div className="flex gap-4">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.fullName}!</h1>
          <p className="text-muted-foreground">Manage your account and view your orders</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold mt-2">{userOrders.length}</p>
                </div>
                <Package className="w-6 h-6 text-muted-foreground opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Orders</p>
                  <p className="text-3xl font-bold mt-2 text-green-600">
                    {userOrders.filter((o) => o.status === 'completed').length}
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold mt-2 text-primary">
                    {userOrders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)} TND
                  </p>
                </div>
                <DollarSign className="w-6 h-6 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-lg">{user.fullName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-lg">{user.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Link href="/my-account">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                    <Link href="/products">
                      <Button>Start Shopping</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                userOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">Order #{order.id}</CardTitle>
                          <CardDescription>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-2">Services</p>
                          <div className="space-y-1">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{item.serviceName}</span>
                                <span className="text-muted-foreground">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Amount</p>
                            <p className="text-lg font-bold text-primary">{order.totalAmount.toFixed(2)} TND</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Payment Method</p>
                            <p className="text-sm font-semibold capitalize">{order.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <Badge variant="outline" className="mt-1">
                              {order.status}
                            </Badge>
                          </div>
                        </div>

                        <Link href={`/order-confirmation/${order.id}`}>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            View Full Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>Your complete transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                {userOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No purchase history yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Order ID</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Services</th>
                          <th className="text-right py-3 px-4">Amount</th>
                          <th className="text-center py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-mono text-xs">{order.id}</td>
                            <td className="py-3 px-4">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-xs space-y-1">
                                {order.items.slice(0, 2).map((item: any, idx: number) => (
                                  <div key={idx}>{item.serviceName}</div>
                                ))}
                                {order.items.length > 2 && (
                                  <div className="text-muted-foreground">+{order.items.length - 2} more</div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-bold">{order.totalAmount.toFixed(2)} TND</td>
                            <td className="py-3 px-4 text-center">
                              <Badge
                                className={
                                  order.status === 'completed'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : order.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }
                              >
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
