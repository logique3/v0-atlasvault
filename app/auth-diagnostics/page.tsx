'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { initializeMockData, resetMockData, getAllMockUsers } from '@/lib/mock-data'
import { CheckCircle2, AlertCircle, Trash2, RefreshCw, Copy, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function AuthDiagnosticsPage() {
  const [users, setUsers] = useState<any[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [showPasswords, setShowPasswords] = useState(false)
  const [testEmail, setTestEmail] = useState('admin@atlasvault.com')
  const [testPassword, setTestPassword] = useState('admin123')
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    try {
      // Initialize mock data first
      initializeMockData()
      
      // Get all users
      const allUsers = getAllMockUsers()
      setUsers(allUsers)
      
      if (allUsers.length > 0) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setStatus('error')
    }
  }

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to defaults?')) {
      resetMockData()
      loadUsers()
      toast.success('Data reset successfully')
    }
  }

  const testLoginCredentials = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('atlasVaultUsers') || '[]')
      const trimmedEmail = testEmail.trim().toLowerCase()
      const trimmedPassword = testPassword.trim()

      const foundUser = stored.find((u: any) => 
        (u.email || '').trim().toLowerCase() === trimmedEmail &&
        (u.password || '').trim() === trimmedPassword
      )

      setTestResult({
        success: !!foundUser,
        email: testEmail,
        foundUser: foundUser ? {
          id: foundUser.id,
          fullName: foundUser.fullName,
          role: foundUser.role,
        } : null,
      })
    } catch (error) {
      setTestResult({
        success: false,
        error: (error as any).message,
      })
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Authentication Diagnostics</h1>
          <p className="text-muted-foreground">Verify your authentication setup and troubleshoot issues</p>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  System Status: OK
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  System Status: Issue Detected
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admin Users</p>
                <p className="text-2xl font-bold text-primary">{users.filter((u) => u.role === 'admin').length}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">localStorage Status:</p>
              <div className="flex flex-wrap gap-2">
                {localStorage.getItem('atlasVaultUsers') ? (
                  <Badge className="bg-green-100 text-green-800">atlasVaultUsers ✓</Badge>
                ) : (
                  <Badge variant="destructive">atlasVaultUsers ✗</Badge>
                )}
                {localStorage.getItem('atlasVaultOrders') ? (
                  <Badge className="bg-green-100 text-green-800">atlasVaultOrders ✓</Badge>
                ) : (
                  <Badge variant="destructive">atlasVaultOrders ✗</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={loadUsers} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Status
          </Button>
          <Button onClick={handleResetData} variant="outline" className="gap-2 text-destructive">
            <Trash2 className="w-4 h-4" />
            Reset Data
          </Button>
          <Link href="/login" className="ml-auto">
            <Button>Go to Login</Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users List</TabsTrigger>
            <TabsTrigger value="test">Test Login</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Available Accounts</CardTitle>
                <CardDescription>All users in the system with their credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users found</p>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold">{user.fullName}</p>
                              <p className="text-sm text-muted-foreground">{user.id}</p>
                            </div>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Email</p>
                              <div className="flex items-center gap-2">
                                <code className="bg-muted px-2 py-1 rounded text-xs font-mono flex-1">
                                  {user.email}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(user.email, 'Email')}
                                  className="p-1 hover:bg-muted rounded"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Password</p>
                              <div className="flex items-center gap-2">
                                <code className="bg-muted px-2 py-1 rounded text-xs font-mono flex-1">
                                  {showPasswords ? user.password : '•'.repeat(user.password.length)}
                                </code>
                                <button
                                  onClick={() => setShowPasswords(!showPasswords)}
                                  className="p-1 hover:bg-muted rounded"
                                >
                                  {showPasswords ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(user.password, 'Password')}
                                  className="p-1 hover:bg-muted rounded"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Phone</p>
                              <p className="text-sm font-mono">{user.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Created</p>
                              <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTestEmail(user.email)
                              setTestPassword(user.password)
                            }}
                            className="w-full"
                          >
                            Test This Account
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Login Tab */}
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test Login Credentials</CardTitle>
                <CardDescription>Verify that credentials work correctly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                      placeholder="password"
                    />
                  </div>

                  <Button onClick={testLoginCredentials} className="w-full">
                    Test Credentials
                  </Button>
                </div>

                {testResult && (
                  <Card className={testResult.success ? 'border-green-200' : 'border-red-200'}>
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        {testResult.success ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          {testResult.success ? (
                            <>
                              <p className="font-medium text-green-800">Login Successful</p>
                              <p className="text-sm text-green-700 mt-2">
                                User found: <strong>{testResult.foundUser.fullName}</strong> ({testResult.foundUser.role})
                              </p>
                              <Link href="/login" className="mt-4 block">
                                <Button size="sm">Go to Login</Button>
                              </Link>
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-red-800">Login Failed</p>
                              <p className="text-sm text-red-700 mt-2">
                                No matching user found for this email and password combination
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base">Troubleshooting Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>If login is not working:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Click "Refresh Status" to reload users from localStorage</li>
              <li>Click "Reset Data" to restore all demo accounts</li>
              <li>Use "Test Login" tab to verify credentials work</li>
              <li>Check browser console (F12) for detailed error logs with [v0] prefix</li>
              <li>Clear browser cache if data seems corrupted</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
