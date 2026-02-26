'use client'

import { useState, useMemo } from 'react'
import { 
  Paper, 
  Text, 
  Group, 
  Badge, 
  Avatar, 
  Stack, 
  SimpleGrid, 
  Button, 
  Select,
  Indicator,
  ScrollArea,
  SegmentedControl,
  Drawer,
  Divider,
  Timeline,
  TextInput,
  Textarea,
  ActionIcon
} from '@mantine/core'
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  DragOverEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  useDroppable
} from '@dnd-kit/core'
import { 
  useSortable, 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  IoGitBranch, 
  IoEllipse, 
  IoPerson,
  IoCalendar,
  IoChatbubble,
  IoAttach,
  IoAdd
} from 'react-icons/io5'
import { Task, TaskStatus, TaskPriority } from '@/types'
import { useUser } from '@/contexts/UserContext'

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'gray' },
  { id: 'todo', label: 'To Do', color: 'blue' },
  { id: 'in_progress', label: 'In Progress', color: 'orange' },
  { id: 'review', label: 'Review', color: 'violet' },
  { id: 'done', label: 'Done', color: 'teal' }
]

const priorityColors: Record<TaskPriority, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  urgent: 'red'
}

const mockTasks: Task[] = [
  { id: 't1', title: 'Diseñar nueva landing page', status: 'in_progress', priority: 'high', assignee: { id: '1', name: 'Juan Pérez', email: 'juan@aion.com', avatar: 'JP', role: 'admin' }, reporter: { id: '2', name: 'María García', email: 'maria@aion.com', avatar: 'MG', role: 'manager' }, project: 'Website', labels: ['design', 'frontend'], createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01'), dueDate: new Date('2024-12-15'), comments: 5, attachments: 2 },
  { id: 't2', title: 'Implementar autenticación', status: 'todo', priority: 'urgent', assignee: { id: '3', name: 'Carlos López', email: 'carlos@aion.com', avatar: 'CL', role: 'member' }, reporter: { id: '1', name: 'Juan Pérez', email: 'juan@aion.com', avatar: 'JP', role: 'admin' }, project: 'API', labels: ['backend', 'security'], createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01'), dueDate: new Date('2024-12-10'), comments: 3, attachments: 0 },
  { id: 't3', title: 'Crear campaña Black Friday', status: 'review', priority: 'high', assignee: { id: '2', name: 'María García', email: 'maria@aion.com', avatar: 'MG', role: 'manager' }, reporter: { id: '1', name: 'Juan Pérez', email: 'juan@aion.com', avatar: 'JP', role: 'admin' }, project: 'Marketing', labels: ['marketing', 'campaign'], createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01'), comments: 8, attachments: 5 },
  { id: 't4', title: 'Optimizar consultas DB', status: 'backlog', priority: 'medium', assignee: { id: '3', name: 'Carlos López', email: 'carlos@aion.com', avatar: 'CL', role: 'member' }, reporter: { id: '2', name: 'María García', email: 'maria@aion.com', avatar: 'MG', role: 'manager' }, project: 'API', labels: ['backend', 'performance'], createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01'), comments: 1, attachments: 0 },
  { id: 't5', title: 'Documentar API endpoints', status: 'done', priority: 'low', assignee: { id: '4', name: 'Ana Martínez', email: 'ana@aion.com', avatar: 'AM', role: 'member' }, reporter: { id: '1', name: 'Juan Pérez', email: 'juan@aion.com', avatar: 'JP', role: 'admin' }, project: 'Docs', labels: ['documentation'], createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01'), comments: 2, attachments: 1 },
  { id: 't6', title: 'Fix responsive issues', status: 'in_progress', priority: 'medium', assignee: { id: '1', name: 'Juan Pérez', email: 'juan@aion.com', avatar: 'JP', role: 'admin' }, reporter: { id: '3', name: 'Carlos López', email: 'carlos@aion.com', avatar: 'CL', role: 'member' }, project: 'Website', labels: ['frontend', 'bug'], createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01'), comments: 4, attachments: 0 },
  { id: 't7', title: 'Setup CI/CD pipeline', status: 'todo', priority: 'high', assignee: { id: '3', name: 'Carlos López', email: 'carlos@aion.com', avatar: 'CL', role: 'member' }, reporter: { id: '1', name: 'Juan Pérez', email: 'juan@aion.com', avatar: 'JP', role: 'admin' }, project: 'DevOps', labels: ['devops', 'automation'], createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01'), comments: 0, attachments: 0 },
  { id: 't8', title: 'User testing session', status: 'backlog', priority: 'low', assignee: { id: '4', name: 'Ana Martínez', email: 'ana@aion.com', avatar: 'AM', role: 'member' }, reporter: { id: '2', name: 'María García', email: 'maria@aion.com', avatar: 'MG', role: 'manager' }, project: 'UX', labels: ['ux', 'testing'], createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01'), comments: 0, attachments: 0 }
]

interface TaskCardProps {
  task: Task
  onClick?: () => void
  isDragging?: boolean
}

function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab' as const,
    background: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-4))',
    borderColor: 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))',
    opacity: isSortableDragging ? 0 : isDragging ? 0.5 : 1
  }

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      p="sm"
      radius="md"
      mb="sm"
      onClick={onClick}
      withBorder
      shadow="sm"
    >
      <Group justify="space-between" mb="xs">
        <Badge color={priorityColors[task.priority]} variant="light" size="sm">
          {task.priority}
        </Badge>
        <Text size="xs" c="dimmed">{task.project}</Text>
      </Group>
      
      <Text size="sm" fw={500} mb="xs" lineClamp={2}>
        {task.title}
      </Text>

      <Group gap="xs" mb="xs">
        {task.labels.slice(0, 2).map((label) => (
          <Badge key={label} variant="outline" size="xs">
            {label}
          </Badge>
        ))}
      </Group>

      <Group justify="space-between">
        <Group gap="xs">
          <Avatar size="sm" radius="xl" color="blue">
            {task.assignee.avatar}
          </Avatar>
          <Text size="xs" c="dimmed">{task.assignee.name.split(' ')[0]}</Text>
        </Group>
        <Group gap="xs">
          {task.comments > 0 && (
            <Group gap={2}>
              <IoChatbubble size={12} />
              <Text size="xs" c="dimmed">{task.comments}</Text>
            </Group>
          )}
          {task.attachments > 0 && (
            <Group gap={2}>
              <IoAttach size={12} />
              <Text size="xs" c="dimmed">{task.attachments}</Text>
            </Group>
          )}
        </Group>
      </Group>

      {task.dueDate && (
        <Group gap="xs" mt="xs">
          <IoCalendar size={12} />
          <Text size="xs" c="dimmed">
            {new Date(task.dueDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
          </Text>
        </Group>
      )}
    </Paper>
  )
}

interface KanbanColumnProps {
  id: TaskStatus
  label: string
  color: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
}

function KanbanColumn({ id, label, color, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const taskIds = tasks.map(t => t.id)

  return (
    <Paper
      ref={setNodeRef}
      data-column={id}
      p="sm"
      radius="md"
      style={{ 
        background: isOver 
          ? 'light-dark(var(--mantine-color-blue-0), var(--mantine-color-dark-5))'
          : 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
        minHeight: 'calc(100vh - 300px)',
        width: 280,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.2s ease'
      }}
    >
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Indicator color={color} size={10} processing>
            <IoEllipse size={12} color="transparent" />
          </Indicator>
          <Text fw={600} size="sm">{label}</Text>
          <Badge color={color} variant="light" size="sm">{tasks.length}</Badge>
        </Group>
        <ActionIcon 
          variant="subtle" 
          size="md" 
          radius="md"
          onClick={() => onAddTask(id)}
        >
          <IoAdd size={16} />
        </ActionIcon>
      </Group>
      
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <Stack gap={0} style={{ flex: 1, minHeight: 100 }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </Stack>
      </SortableContext>
    </Paper>
  )
}

interface KanbanBoardProps {
  project?: string
}

export default function KanbanBoard({ project }: KanbanBoardProps) {
  const { user, users } = useUser()
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [filter, setFilter] = useState<'all' | 'mine'>('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [newTaskDrawer, setNewTaskDrawer] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'backlog' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assigneeId: user?.id || '1',
    project: project || 'Website'
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  )

  const filteredTasks = useMemo(() => {
    let result = tasks
    if (project) {
      result = result.filter(t => t.project.toLowerCase() === project.toLowerCase())
    }
    if (filter === 'mine' && user) {
      result = result.filter(t => t.assignee.id === user.id)
    }
    return result
  }, [tasks, filter, user, project])

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      review: [],
      done: []
    }
    filteredTasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status]!.push(task)
      }
    })
    return grouped
  }, [filteredTasks])

  const findTaskColumn = (taskId: UniqueIdentifier): TaskStatus | null => {
    const task = tasks.find(t => t.id === taskId)
    return task?.status || null
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeColumn = findTaskColumn(activeId)
    const overIsColumn = columns.some(c => c.id === overId)
    const overColumn = findTaskColumn(overId) || (overIsColumn ? overId as TaskStatus : null)

    if (!activeColumn || !overColumn || activeColumn === overColumn) return

    setTasks(prev => prev.map(task => 
      task.id === activeId ? { ...task, status: overColumn } : task
    ))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeColumn = findTaskColumn(activeId)
    const overColumn = findTaskColumn(overId) || (columns.find(c => c.id === overId)?.id as TaskStatus)

    if (!activeColumn) return

    if (activeColumn === overColumn) {
      const columnTasks = tasks.filter(t => t.status === activeColumn)
      const oldIndex = columnTasks.findIndex(t => t.id === activeId)
      const newIndex = columnTasks.findIndex(t => t.id === overId)
      
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(columnTasks, oldIndex, newIndex)
        setTasks(prev => {
          const otherTasks = prev.filter(t => t.status !== activeColumn)
          return [...otherTasks, ...reordered]
        })
      }
    } else if (overColumn) {
      setTasks(prev => prev.map(task => 
        task.id === activeId ? { ...task, status: overColumn } : task
      ))
    }
  }

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return

    const assignee = users.find(u => u.id === newTask.assigneeId) || users[0]
    
    const task: Task = {
      id: `t${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      assignee,
      reporter: user || users[0],
      project: newTask.project,
      labels: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: 0,
      attachments: 0
    }

    setTasks(prev => [...prev, task])
    setNewTaskDrawer(false)
    setNewTask({
      title: '',
      description: '',
      status: 'backlog',
      priority: 'medium',
      assigneeId: user?.id || '1',
      project: project || 'Website'
    })
  }

  const handleOpenNewTask = (status: TaskStatus) => {
    setNewTask(prev => ({ ...prev, status }))
    setNewTaskDrawer(true)
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group gap="md">
          <SegmentedControl
            value={filter}
            onChange={(value) => setFilter(value as 'all' | 'mine')}
            data={[
              { label: 'Todas', value: 'all' },
              { label: 'Mis tareas', value: 'mine' }
            ]}
          />
          <Select
            placeholder="Filtrar por asignado"
            data={users.map(u => ({ value: u.id, label: u.name }))}
            clearable
            size="sm"
            style={{ width: 200 }}
          />
          {!project && (
            <Select
              placeholder="Filtrar por proyecto"
              data={['Website', 'API', 'Marketing', 'DevOps', 'Docs', 'UX']}
              clearable
              size="sm"
              style={{ width: 150 }}
            />
          )}
        </Group>
        <Button leftSection={<IoAdd size={16} />} onClick={() => setNewTaskDrawer(true)}>
          Nueva tarea
        </Button>
      </Group>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea>
          <Group gap="md" align="flex-start" style={{ minWidth: 'max-content' }}>
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                label={column.label}
                color={column.color}
                tasks={tasksByStatus[column.id] || []}
                onTaskClick={setSelectedTask}
                onAddTask={handleOpenNewTask}
              />
            ))}
          </Group>
        </ScrollArea>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <Drawer
        opened={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        position="right"
        size="md"
        title={<Text fw={600}>{selectedTask?.title}</Text>}
      >
        {selectedTask && (
          <Stack gap="md">
            <Group>
              <Badge color={priorityColors[selectedTask.priority]} variant="light">
                {selectedTask.priority}
              </Badge>
              <Badge color="gray" variant="light">
                {selectedTask.project}
              </Badge>
            </Group>

            <Divider />

            <div>
              <Text size="sm" c="dimmed" mb="xs">Descripción</Text>
              <Text size="sm">
                Descripción detallada de la tarea: {selectedTask.title}. 
                Esta es una descripción de ejemplo para mostrar cómo se vería el contenido.
              </Text>
            </div>

            <Divider />

            <SimpleGrid cols={2}>
              <div>
                <Text size="sm" c="dimmed" mb="xs">Asignado a</Text>
                <Group gap="xs">
                  <Avatar size="sm" radius="xl" color="blue">
                    {selectedTask.assignee.avatar}
                  </Avatar>
                  <Text size="sm">{selectedTask.assignee.name}</Text>
                </Group>
              </div>
              <div>
                <Text size="sm" c="dimmed" mb="xs">Reportado por</Text>
                <Group gap="xs">
                  <Avatar size="sm" radius="xl" color="violet">
                    {selectedTask.reporter.avatar}
                  </Avatar>
                  <Text size="sm">{selectedTask.reporter.name}</Text>
                </Group>
              </div>
            </SimpleGrid>

            <Divider />

            <div>
              <Text size="sm" c="dimmed" mb="xs">Actividad</Text>
              <Timeline active={1} bulletSize={24} lineWidth={2}>
                <Timeline.Item bullet={<IoPerson size={12} />} title="Tarea creada">
                  <Text c="dimmed" size="sm">{selectedTask.reporter.name} creó esta tarea</Text>
                  <Text size="xs" c="dimmed">Hace 2 días</Text>
                </Timeline.Item>
                <Timeline.Item bullet={<IoGitBranch size={12} />} title="Estado cambiado">
                  <Text c="dimmed" size="sm">Movido a {selectedTask.status.replace('_', ' ')}</Text>
                  <Text size="xs" c="dimmed">Hace 1 día</Text>
                </Timeline.Item>
                <Timeline.Item bullet={<IoChatbubble size={12} />} title="Nuevo comentario">
                  <Text c="dimmed" size="sm">María: "Excelente progreso!"</Text>
                  <Text size="xs" c="dimmed">Hace 3 horas</Text>
                </Timeline.Item>
              </Timeline>
            </div>
          </Stack>
        )}
      </Drawer>

      <Drawer
        opened={newTaskDrawer}
        onClose={() => setNewTaskDrawer(false)}
        position="right"
        size="md"
        title={<Text fw={600}>Nueva Tarea</Text>}
      >
        <Stack gap="md">
          <TextInput
            label="Título"
            placeholder="Título de la tarea"
            required
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
          />

          <Textarea
            label="Descripción"
            placeholder="Descripción de la tarea"
            rows={3}
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
          />

          <SimpleGrid cols={2}>
            <Select
              label="Estado"
              data={columns.map(col => ({ value: col.id, label: col.label }))}
              value={newTask.status}
              onChange={(value) => setNewTask(prev => ({ ...prev, status: value as TaskStatus }))}
            />
            <Select
              label="Prioridad"
              data={[
                { value: 'low', label: 'Baja' },
                { value: 'medium', label: 'Media' },
                { value: 'high', label: 'Alta' },
                { value: 'urgent', label: 'Urgente' }
              ]}
              value={newTask.priority}
              onChange={(value) => setNewTask(prev => ({ ...prev, priority: value as TaskPriority }))}
            />
          </SimpleGrid>

          <Select
            label="Asignado a"
            data={users.map(u => ({ value: u.id, label: u.name }))}
            value={newTask.assigneeId}
            onChange={(value) => setNewTask(prev => ({ ...prev, assigneeId: value || '1' }))}
          />

          <Select
            label="Proyecto"
            data={['Website', 'API', 'Marketing', 'DevOps', 'Docs', 'UX']}
            value={newTask.project}
            onChange={(value) => setNewTask(prev => ({ ...prev, project: value || 'Website' }))}
          />

          <Divider />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setNewTaskDrawer(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
              Crear tarea
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </Stack>
  )
}
