'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Users, Plus, Trash2, Edit2, Search, Mail, Phone, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  fullName: string
  phone: string
  role: 'admin' | 'user'
  createdAt: string
}

interface UserFormData {
  email: string
  fullName: string
  phone: string
  role: 'admin' | 'user'
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    fullName: '',
    phone: '',
    role: 'user',
  })

  // Load users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      const stored = localStorage.getItem('atlasVaultUsers')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setUsers(parsed.map((u: any) => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            phone: u.phone,
            role: u.role,
            createdAt: u.createdAt,
          })))
        } catch {
          toast.error('Failed to load users')
        }
      }
    }
    loadUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  )

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ email: '', fullName: '', phone: '', role: 'user' })
    setShowModal(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    })
    setShowModal(true)
  }

  const handleSaveUser = () => {
    // Validation
    if (!formData.email || !formData.fullName || !formData.phone) {
      toast.error('Please fill in all fields')
      return
    }

    // Check for duplicate email (excluding current user)
    const emailExists = users.some(
      (u) => u.email === formData.email && (!editingUser || u.id !== editingUser.id)
    )
    if (emailExists) {
      toast.error('Email already exists')
      return
    }

    const stored = localStorage.getItem('atlasVaultUsers')
    const allUsers = stored ? JSON.parse(stored) : []

    if (editingUser) {
      // Update existing user
      const updated = allUsers.map((u: any) =>
        u.id === editingUser.id
          ? {
              ...u,
              email: formData.email,
              fullName: formData.fullName,
              phone: formData.phone,
              role: formData.role,
            }
          : u
      )
      localStorage.setItem('atlasVaultUsers', JSON.stringify(updated))
      setUsers(
        updated.map((u: any) => ({
          id: u.id,
          email: u.email,
          fullName: u.fullName,
          phone: u.phone,
          role: u.role,
          createdAt: u.createdAt,
        }))
      )
      toast.success('User updated successfully')
    } else {
      // Add new user
      const newUser = {
        id: `user_${Date.now()}`,
        email: formData.email,
        password: 'password123', // Default password for new users
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        createdAt: new Date().toISOString(),
      }
      allUsers.push(newUser)
      localStorage.setItem('atlasVaultUsers', JSON.stringify(allUsers))
      setUsers([
        ...users,
        {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          phone: newUser.phone,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      ])
      toast.success('User created successfully. Default password is: password123')
    }

    setShowModal(false)
  }

  const handleDeleteUser = (userId: string) => {
    setSelectedUserId(userId)
    setShowDeleteDialog(true)
  }

  const confirmDeleteUser = () => {
    if (!selectedUserId) return

    const stored = localStorage.getItem('atlasVaultUsers')
    const allUsers = stored ? JSON.parse(stored) : []
    const updated = allUsers.filter((u: any) => u.id !== selectedUserId)
    localStorage.setItem('atlasVaultUsers', JSON.stringify(updated))
    setUsers(users.filter((u) => u.id !== selectedUserId))
    toast.success('User deleted successfully')
    setShowDeleteDialog(false)
    setSelectedUserId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8" />
            Users Management
          </h2>
          <p className="text-muted-foreground mt-1">Manage all system users and their access</p>
        </div>
        <Button onClick={handleAddUser} className="gap-2 bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4" />
          Add New User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {users.length} total users - {users.filter((u) => u.role === 'admin').length} admins, {users.filter((u) => u.role === 'user').length} regular users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {user.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className={user.role === 'admin' ? 'bg-red-600 text-white' : ''}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information' : 'Create a new user account'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+216 20 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                className="w-full border border-input bg-background px-3 py-2 rounded-md"
              >
                <option value="user">Regular User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {!editingUser && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 rounded text-sm text-blue-700 dark:text-blue-400">
                Default password: password123
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} className="bg-primary hover:bg-primary/90 text-white">
              {editingUser ? 'Update' : 'Create'} User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
