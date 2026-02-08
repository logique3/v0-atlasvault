'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_ADMINS, MOCK_USERS } from '@/lib/mock-data'
import { Copy, Eye, EyeOff, Shield, User as UserIcon, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function DemoAccountsPage() {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  const togglePasswordVisibility = (email: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [email]: !prev[email],
    }))
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Demo Accounts</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use these test accounts to explore AtlasVault features. All accounts have different permissions and order histories for comprehensive testing.
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to Use</h3>
                <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-300 list-decimal list-inside">
                  <li>Select an account below and copy the email and password</li>
                  <li>Go to the <Link href="/login" className="font-semibold hover:underline">Login Page</Link></li>
                  <li>Paste the credentials and sign in</li>
                  <li>Explore the platform with different user roles</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Admin Accounts */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-foreground">Admin Accounts</h2>
            </div>
            <div className="space-y-4">
              {MOCK_ADMINS.map((admin) => (
                <Card key={admin.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{admin.fullName}</CardTitle>
                        <CardDescription>Full system access and management</CardDescription>
                      </div>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Admin
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={admin.email}
                          readOnly
                          className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(admin.email, 'Email')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Password</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type={showPasswords[admin.email] ? 'text' : 'password'}
                          value={admin.password}
                          readOnly
                          className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(admin.email)}
                        >
                          {showPasswords[admin.email] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(admin.password, 'Password')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bg-muted rounded p-3 text-sm space-y-2">
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="ml-2 font-mono">{admin.phone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Access:</span>
                        <span className="ml-2 font-semibold text-red-600 dark:text-red-400">
                          Full Admin Panel
                        </span>
                      </div>
                    </div>

                    <Link href="/login" className="w-full">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Sign In as Admin
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* User Accounts */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <UserIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-foreground">User Accounts</h2>
            </div>
            <div className="space-y-4">
              {MOCK_USERS.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{user.fullName}</CardTitle>
                        <CardDescription>Regular user with purchase history</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        User
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={user.email}
                          readOnly
                          className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(user.email, 'Email')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Password</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type={showPasswords[user.email] ? 'text' : 'password'}
                          value={user.password}
                          readOnly
                          className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(user.email)}
                        >
                          {showPasswords[user.email] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(user.password, 'Password')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bg-muted rounded p-3 text-sm space-y-2">
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="ml-2 font-mono">{user.phone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Access:</span>
                        <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                          User Dashboard & Shopping
                        </span>
                      </div>
                    </div>

                    <Link href="/login" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Sign In as User
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">What You Can Test</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Authentication',
                description: 'Test login/logout and role-based access control',
              },
              {
                title: 'User Dashboard',
                description: 'View orders, profile info, and account statistics',
              },
              {
                title: 'Shopping',
                description: 'Browse services, add to cart, and manage favorites',
              },
              {
                title: 'WhatsApp Orders',
                description: 'Send orders via WhatsApp with formatted messages',
              },
              {
                title: 'Admin Panel',
                description: 'Manage users, orders, services, and view analytics',
              },
              {
                title: 'Order Tracking',
                description: 'View order history, status, and detailed information',
              },
            ].map((feature, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Go to Login Page
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">
              Browse Products
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
