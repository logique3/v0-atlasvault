'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err: any) {
      const message = err.message || 'Login failed'
      setError(message)
      toast.error(message)
    }
  }

  // Create demo admin account if it doesn't exist
  const createDemoAdmin = () => {
    const storedUsers = JSON.parse(localStorage.getItem('atlasVaultUsers') || '[]')
    if (!storedUsers.some((u: any) => u.email === 'admin@atlas.test')) {
      storedUsers.push({
        id: 'admin_demo',
        email: 'admin@atlas.test',
        password: 'admin123',
        fullName: 'Admin User',
        phone: '+216 99 000 000',
        role: 'admin',
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('atlasVaultUsers', JSON.stringify(storedUsers))
      toast.success('Demo admin account created! Email: admin@atlas.test, Password: admin123')
    }
  }

  // Create demo user account if it doesn't exist
  const createDemoUser = () => {
    const storedUsers = JSON.parse(localStorage.getItem('atlasVaultUsers') || '[]')
    if (!storedUsers.some((u: any) => u.email === 'user@atlas.test')) {
      storedUsers.push({
        id: 'user_demo',
        email: 'user@atlas.test',
        password: 'user123',
        fullName: 'John Doe',
        phone: '+216 95 123 456',
        role: 'user',
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('atlasVaultUsers', JSON.stringify(storedUsers))
      toast.success('Demo user account created! Email: user@atlas.test, Password: user123')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0066CC] to-[#4A90E2] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              AV
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your AtlasVault account</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="flex gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-muted/50 border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={createDemoAdmin}
              className="w-full justify-center text-xs"
            >
              Create Demo Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={createDemoUser}
              className="w-full justify-center text-xs"
            >
              Create Demo User
            </Button>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>
            <Link href="/" className="hover:text-foreground">
              Back to Home
            </Link>
          </p>
          <p>
            <Link href="/about" className="hover:text-foreground">
              About Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
