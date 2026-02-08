'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { initializeMockData } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function VerifySetupPage() {
  const [setupStatus, setSetupStatus] = useState<{
    usersInitialized: boolean
    userCount: number
    adminCount: number
    ordersInitialized: boolean
    orderCount: number
    sampleUsers: string[]
  } | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = () => {
    setIsChecking(true)
    
    // Initialize mock data
    initializeMockData()
    
    // Check users
    const storedUsers = JSON.parse(localStorage.getItem('atlasVaultUsers') || '[]')
    const adminCount = storedUsers.filter((u: any) => u.role === 'admin').length
    const userCount = storedUsers.filter((u: any) => u.role === 'user').length
    const sampleUsers = storedUsers.slice(0, 3).map((u: any) => u.email)

    // Check orders
    const storedOrders = JSON.parse(localStorage.getItem('atlasVaultOrders') || '[]')

    setSetupStatus({
      usersInitialized: storedUsers.length > 0,
      userCount,
      adminCount,
      ordersInitialized: storedOrders.length > 0,
      orderCount: storedOrders.length,
      sampleUsers,
    })
    
    setIsChecking(false)
    toast.success('Setup verification complete!')
  }

  const resetAllData = () => {
    if (confirm('Are you sure? This will reset all data to defaults.')) {
      localStorage.removeItem('atlasVaultUsers')
      localStorage.removeItem('atlasVaultOrders')
      localStorage.removeItem('atlasVaultUser')
      initializeMockData()
      checkSetup()
      toast.success('All data reset to defaults!')
    }
  }

  if (isChecking || !setupStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying setup...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Setup Verification</h1>
          <p className="text-muted-foreground">Check the platform initialization status</p>
        </div>

        <div className="space-y-6">
          {/* Users Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {setupStatus.usersInitialized ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                  Users Initialized
                </CardTitle>
                <Badge variant={setupStatus.usersInitialized ? 'default' : 'destructive'}>
                  {setupStatus.usersInitialized ? 'Active' : 'Failed'}
                </Badge>
              </div>
              <CardDescription>User accounts for authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{setupStatus.userCount + setupStatus.adminCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold text-primary">{setupStatus.adminCount}</p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Sample Accounts:</p>
                <div className="space-y-1 font-mono text-xs">
                  {setupStatus.sampleUsers.map((email) => (
                    <p key={email} className="text-muted-foreground">{email}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {setupStatus.ordersInitialized ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                  Orders Initialized
                </CardTitle>
                <Badge variant={setupStatus.ordersInitialized ? 'default' : 'secondary'}>
                  {setupStatus.ordersInitialized ? 'Active' : 'Empty'}
                </Badge>
              </div>
              <CardDescription>Sample order data for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{setupStatus.orderCount} sample orders</p>
              <p className="text-sm text-muted-foreground mt-2">
                {setupStatus.ordersInitialized
                  ? 'Sample orders are ready for testing'
                  : 'No orders initialized yet'}
              </p>
            </CardContent>
          </Card>

          {/* Test Login Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Quick Test Login</CardTitle>
              <CardDescription>Test the authentication system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p>
                  <strong>Admin Account:</strong>
                </p>
                <p className="font-mono text-muted-foreground ml-4">
                  Email: admin@atlasvault.com
                  <br />
                  Password: admin123
                </p>
              </div>
              <div className="space-y-2 text-sm mb-6">
                <p>
                  <strong>User Account:</strong>
                </p>
                <p className="font-mono text-muted-foreground ml-4">
                  Email: john@example.com
                  <br />
                  Password: password123
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={checkSetup} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </Button>
            <Button onClick={resetAllData} variant="destructive" className="gap-2">
              Reset All Data
            </Button>
          </div>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/login">
                <Button variant="outline" className="w-full justify-start">
                  → Go to Login
                </Button>
              </Link>
              <Link href="/demo-accounts">
                <Button variant="outline" className="w-full justify-start">
                  → View All Demo Accounts
                </Button>
              </Link>
              <Link href="/quick-start">
                <Button variant="outline" className="w-full justify-start">
                  → Quick Start Guide
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  → Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
