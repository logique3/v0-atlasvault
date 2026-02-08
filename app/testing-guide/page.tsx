'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MOCK_ADMINS, MOCK_USERS, MOCK_ORDERS, getMockStatistics, resetMockData } from '@/lib/mock-data'
import { Copy, RefreshCw, LogIn, Users, ShoppingCart, Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function TestingGuidePage() {
  const stats = getMockStatistics()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">AtlasVault - Testing Guide</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Welcome to the testing environment. Below you'll find all the mock data and credentials you need to test the platform.
          </p>
          <Link href="/demo-accounts">
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              View All Demo Accounts
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground">{stats.adminUsers} admins • {stats.regularUsers} users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
                <p className="text-xs text-muted-foreground">{stats.completedOrders} completed • {stats.pendingOrders} pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">{stats.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">TND from completed orders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Actions</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 mt-2"
                  onClick={() => {
                    resetMockData()
                    toast.success('Mock data reset!')
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Accounts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Test Accounts
            </CardTitle>
            <CardDescription>Use these accounts to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ADMINS.map((admin, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="default" className="bg-red-600 mb-2">Admin</Badge>
                      <h3 className="font-semibold text-foreground">{admin.fullName}</h3>
                    </div>
                    <Link href="/login">
                      <Button size="sm" className="gap-1">
                        <LogIn className="w-4 h-4" />
                        Try Login
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1 font-mono">{admin.email}</code>
                        <button
                          onClick={() => copyToClipboard(admin.email)}
                          className="p-1 hover:bg-muted rounded"
                          title="Copy email"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Password</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1 font-mono">{admin.password}</code>
                        <button
                          onClick={() => copyToClipboard(admin.password)}
                          className="p-1 hover:bg-muted rounded"
                          title="Copy password"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm">{admin.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Test Accounts
            </CardTitle>
            <CardDescription>Use these accounts to test the platform as a regular user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_USERS.map((user, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">User</Badge>
                      <h3 className="font-semibold text-foreground">{user.fullName}</h3>
                    </div>
                    <Link href="/login">
                      <Button size="sm" className="gap-1">
                        <LogIn className="w-4 h-4" />
                        Try Login
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1 font-mono text-xs">{user.email}</code>
                        <button
                          onClick={() => copyToClipboard(user.email)}
                          className="p-1 hover:bg-muted rounded"
                          title="Copy email"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Password</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1 font-mono">{user.password}</code>
                        <button
                          onClick={() => copyToClipboard(user.password)}
                          className="p-1 hover:bg-muted rounded"
                          title="Copy password"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm">{user.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Scenarios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Test Scenarios
            </CardTitle>
            <CardDescription>Try these flows to test the platform features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Test User Registration</h3>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>1. Go to <Link href="/register" className="underline font-semibold">/register</Link></li>
                  <li>2. Create a new account with your information</li>
                  <li>3. Login with your new credentials</li>
                  <li>4. Access your dashboard and account settings</li>
                </ol>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Test Service Purchase & Favorites</h3>
                <ol className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>1. Browse services at <Link href="/products" className="underline font-semibold">/products</Link></li>
                  <li>2. Add services to cart and to favorites</li>
                  <li>3. View your favorites in <Link href="/my-account" className="underline font-semibold">My Account</Link></li>
                  <li>4. Place an order via WhatsApp</li>
                </ol>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Test Admin Management</h3>
                <ol className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li>1. Login as admin: <code className="bg-white dark:bg-slate-800 px-1 font-mono text-xs">{MOCK_ADMINS[0].email}</code></li>
                  <li>2. Access <Link href="/admin" className="underline font-semibold">Admin Dashboard</Link></li>
                  <li>3. Manage users, orders, services, and promotions</li>
                  <li>4. Update order statuses and user roles</li>
                </ol>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Test WhatsApp Order Flow</h3>
                <ol className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                  <li>1. Add services to cart from <Link href="/products" className="underline font-semibold">/products</Link></li>
                  <li>2. Go to <Link href="/cart" className="underline font-semibold">Cart</Link> and checkout</li>
                  <li>3. Send order via WhatsApp button</li>
                  <li>4. Check order confirmation at <Link href="/dashboard" className="underline font-semibold">Dashboard</Link></li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Orders in Database</CardTitle>
            <CardDescription>These orders are available for testing admin features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Order ID</th>
                    <th className="text-left py-2 px-3">Customer</th>
                    <th className="text-left py-2 px-3">Amount</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ORDERS.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-3 font-mono text-xs">{order.id}</td>
                      <td className="py-3 px-3">{order.userName}</td>
                      <td className="py-3 px-3 font-semibold">{order.totalAmount.toFixed(2)} TND</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="secondary"
                          className={
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900'
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-xs">{order.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="text-lg font-semibold text-foreground mb-4">Key Features to Test</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ <span className="text-foreground font-semibold">Authentication:</span> Register, login, logout with different user roles</li>
            <li>✓ <span className="text-foreground font-semibold">Role-Based Access:</span> Admin can access admin dashboard, users cannot</li>
            <li>✓ <span className="text-foreground font-semibold">Service Management:</span> Browse, filter, and add services to cart</li>
            <li>✓ <span className="text-foreground font-semibold">Favorites:</span> Add/remove services from favorites (requires login)</li>
            <li>✓ <span className="text-foreground font-semibold">WhatsApp Orders:</span> Send orders via WhatsApp with formatted messages</li>
            <li>✓ <span className="text-foreground font-semibold">User Dashboard:</span> View orders, profile, and manage settings</li>
            <li>✓ <span className="text-foreground font-semibold">Admin Dashboard:</span> Manage users, orders, services, and promotions</li>
            <li>✓ <span className="text-foreground font-semibold">Order Management:</span> Update order statuses and view detailed order information</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
