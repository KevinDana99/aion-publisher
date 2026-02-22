'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { User, Role } from '@/types'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  users: User[]
  hasPermission: (permission: string) => boolean
}

const mockUsers: User[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@aion.com', avatar: 'JP', role: 'admin' },
  { id: '2', name: 'María García', email: 'maria@aion.com', avatar: 'MG', role: 'manager' },
  { id: '3', name: 'Carlos López', email: 'carlos@aion.com', avatar: 'CL', role: 'member' },
  { id: '4', name: 'Ana Martínez', email: 'ana@aion.com', avatar: 'AM', role: 'member' },
  { id: '5', name: 'Pedro Sánchez', email: 'pedro@aion.com', avatar: 'PS', role: 'viewer' }
]

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers[0])

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    const [module, action] = permission.split(':')
    const rolePermissions: Record<Role, string[]> = {
      admin: ['*'],
      manager: ['dashboard:read', 'marketing:read', 'marketing:write', 'analytics:read', 'projects:read', 'projects:write', 'team:read', 'team:write', 'finance:read', 'settings:read'],
      member: ['dashboard:read', 'analytics:read', 'projects:read', 'projects:write', 'settings:read'],
      viewer: ['dashboard:read', 'analytics:read', 'projects:read', 'settings:read']
    }
    
    const permissions = rolePermissions[user.role]
    return permissions.includes('*') || permissions.includes(permission)
  }

  return (
    <UserContext.Provider value={{ user, setUser, users: mockUsers, hasPermission }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
