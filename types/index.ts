export type Role = 'admin' | 'manager' | 'member' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: Role
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee: User
  reporter: User
  project: string
  labels: string[]
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  comments: number
  attachments: number
}

export interface Project {
  id: string
  name: string
  color: string
  members: User[]
}

export interface ActivityLog {
  id: string
  taskId: string
  user: User
  action: string
  timestamp: Date
  details?: string
}
