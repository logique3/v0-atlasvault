'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MOCK_ADMINS, MOCK_USERS } from '@/lib/mock-data'
import {
  ArrowRight,
  ShoppingCart,
  Users,
  BarChart3,
  Smartphone,
  Heart,
  MessageSquare,
  CheckCircle,
  Play,
} from 'lucide-react'
import { toast } from 'sonner'

export default function QuickStartPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const quickStartScenarios = [
    {
      title: 'Test as Regular User',
      description: 'Experience the full shopping and ordering workflow',
      user: MOCK_USERS[0],
      steps: [
        'Login with user account',
        'Browse services and categories',
        'Add items to cart and favorites',
        'Send order via WhatsApp',
        'View order history in dashboard',
      ],
      color: 'blue',
      icon: ShoppingCart,
    },
    {
      title: 'Test as Admin',
      description: 'Explore admin panel and management features',
      user: MOCK_ADMINS[0],
      steps: [
        'Login with admin account',
        'View dashboard statistics',
        'Manage users and orders',
        'Edit services and categories',
        'Monitor platform analytics',
      ],
      color: 'red',
      icon: BarChart3,
    },
  ]

  const handleQuickLogin = async (user: any) => {
    setIsLoading(true)
    try {
      await login(user.email, user.password)
      toast.success(`Logged in as ${user.fullName}`)
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Quick Start Guide</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with AtlasVault in seconds. Choose a scenario and login with demo credentials.
          </p>
        </div>

        {/* Quick Login Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {quickStartScenarios.map((scenario, idx) => {
            const Icon = scenario.icon
            const colorClasses = {
              blue: 'from-blue-600 to-blue-700 border-blue-200 dark:border-blue-800',
              red: 'from-red-600 to-red-700 border-red-200 dark:border-red-800',
            }
            const color = scenario.color as 'blue' | 'red'

            return (
              <Card key={idx} className={`border-2 hover:shadow-xl transition-shadow`}>
                <CardHeader className={`bg-gradient-to-r ${colorClasses[color]} text-white rounded-t-lg`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className="w-8 h-8 mt-1" />
                      <div>
                        <CardTitle className="text-white">{scenario.title}</CardTitle>
                        <CardDescription className="text-blue-100 dark:text-blue-200">
                          {scenario.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Credentials */}
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">Login Credentials:</p>
                    <div className="space-y-1 text-sm font-mono">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <span className="ml-2 text-foreground">{scenario.user.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Password:</span>
                        <span className="ml-2 text-foreground">••••••••</span>
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">What You Can Do:</p>
                    <ul className="space-y-2">
                      {scenario.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleQuickLogin(scenario.user)}
                    disabled={isLoading}
                    className={`w-full gap-2 ${
                      color === 'blue'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    {isLoading ? 'Logging in...' : 'Start Now'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Spotlight */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Feature Showcase</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: ShoppingCart,
                title: 'Shopping',
                description: 'Browse, filter, and purchase digital services with ease',
              },
              {
                icon: Heart,
                title: 'Favorites',
                description: 'Save your favorite services for quick future access',
              },
              {
                icon: MessageSquare,
                title: 'WhatsApp Orders',
                description: 'Send orders directly via WhatsApp with formatted details',
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Admin panel to manage users and their accounts',
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'View platform statistics and order metrics',
              },
              {
                icon: Smartphone,
                title: 'Multi-Device',
                description: 'Fully responsive design works on all devices',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Testing Roadmap */}
        <Card className="mb-12 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-600" />
              Suggested Testing Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  phase: 'Phase 1: Authentication',
                  tasks: ['Login with admin account', 'Login with user account', 'Test logout functionality'],
                },
                {
                  phase: 'Phase 2: Shopping Experience',
                  tasks: [
                    'Browse products by category',
                    'Search for services',
                    'Add items to cart',
                    'Add services to favorites',
                  ],
                },
                {
                  phase: 'Phase 3: Ordering',
                  tasks: [
                    'Review cart items',
                    'Enter delivery details',
                    'Send order via WhatsApp',
                    'View order confirmation',
                  ],
                },
                {
                  phase: 'Phase 4: Dashboard',
                  tasks: [
                    'View order history',
                    'Check account profile',
                    'Review order statistics',
                    'Access favorites list',
                  ],
                },
                {
                  phase: 'Phase 5: Admin Management',
                  tasks: [
                    'View admin dashboard',
                    'Manage users',
                    'View all orders',
                    'Manage services',
                  ],
                },
              ].map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Badge variant="outline">{idx + 1}</Badge>
                    {section.phase}
                  </h4>
                  <ul className="ml-10 space-y-1">
                    {section.tasks.map((task, taskIdx) => (
                      <li key={taskIdx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Link href="/demo-accounts">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">Demo Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View all available test accounts with credentials and details.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Accounts <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/testing-guide">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">Testing Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed testing guide with scenarios and mock data information.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">Browse Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore all available services and categories.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Support */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">Need Help?</h3>
                <p className="text-sm text-green-800 dark:text-green-300 mb-4">
                  If you encounter any issues during testing, contact support via WhatsApp or review the testing guide for more information.
                </p>
                <a
                  href="https://wa.me/21695555555?text=Hello%20AtlasVault%20support"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Contact Support
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
