'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Stack,
  Title,
  Group,
  Loader,
  Center,
  SimpleGrid,
  Paper,
  Text,
  Badge,
  ActionIcon,
  ThemeIcon,
  Progress,
  Avatar,
  Tooltip,
  TextInput,
  Button,
  Modal,
  Textarea,
  ColorSwatch,
  Grid,
  Alert,
  Menu
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { 
  IoFolder, 
  IoChevronForward, 
  IoGitBranch, 
  IoRocket,
  IoCodeSlash,
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloudDone,
  IoCloudOffline,
  IoSettings,
  IoSearch,
  IoAdd,
  IoTrash,
  IoPencil,
  IoLink,
  IoEllipsisVertical,
  IoSync,
  IoCheckmark,
  IoClose
} from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'
import { fetchGithubRepos, type GithubRepo } from '@/lib/github/service'

const COLORS = ['#228be6', '#15aabf', '#be4bdb', '#fd7e14', '#40c057', '#fab005', '#fa5252', '#868e96']

const mockProjects = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Website Redesign',
    description: 'Rediseño completo del sitio web corporativo',
    color: '#228be6',
    status: 'active',
    repoUrl: 'https://github.com/aion/website',
    devDeployUrl: 'https://dev-website.aion.app',
    prodDeployUrl: 'https://website.aion.app',
    totalIssues: 24,
    pendingIssues: 8,
    members: [
      { id: '1', name: 'Juan Pérez', avatar: 'JP' },
      { id: '2', name: 'María García', avatar: 'MG' },
      { id: '3', name: 'Carlos López', avatar: 'CL' }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'API Development',
    description: 'Desarrollo de APIs REST y GraphQL',
    color: '#15aabf',
    status: 'active',
    repoUrl: 'https://github.com/aion/api',
    devDeployUrl: 'https://dev-api.aion.app',
    prodDeployUrl: 'https://api.aion.app',
    totalIssues: 18,
    pendingIssues: 6,
    members: [
      { id: '3', name: 'Carlos López', avatar: 'CL' },
      { id: '4', name: 'Ana Martínez', avatar: 'AM' }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Mobile App',
    description: 'Aplicación móvil para iOS y Android',
    color: '#be4bdb',
    status: 'active',
    repoUrl: 'https://github.com/aion/mobile',
    devDeployUrl: 'https://dev-mobile.aion.app',
    prodDeployUrl: null,
    totalIssues: 32,
    pendingIssues: 12,
    members: [
      { id: '2', name: 'María García', avatar: 'MG' },
      { id: '5', name: 'Pedro Sánchez', avatar: 'PS' }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Admin Dashboard',
    description: 'Panel de administración interno',
    color: '#fd7e14',
    status: 'active',
    repoUrl: 'https://github.com/aion/dashboard',
    devDeployUrl: 'https://dev-dashboard.aion.app',
    prodDeployUrl: 'https://dashboard.aion.app',
    totalIssues: 15,
    pendingIssues: 3,
    members: [
      { id: '3', name: 'Carlos López', avatar: 'CL' },
      { id: '1', name: 'Juan Pérez', avatar: 'JP' }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Documentation',
    description: 'Documentación técnica y de usuario',
    color: '#40c057',
    status: 'completed',
    repoUrl: 'https://github.com/aion/docs',
    devDeployUrl: null,
    prodDeployUrl: 'https://docs.aion.app',
    totalIssues: 10,
    pendingIssues: 0,
    members: [
      { id: '4', name: 'Ana Martínez', avatar: 'AM' }
    ]
  }
]

function ProjectsLoader() {
  return (
    <Center h={400}>
      <Loader size='lg' />
    </Center>
  )
}

interface ProjectCardProps {
  project: (typeof mockProjects)[0]
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}

function ProjectCard({ project, onClick, onEdit, onDelete }: ProjectCardProps) {
  const router = useRouter()
  const progress = Math.round(((project.totalIssues - project.pendingIssues) / project.totalIssues) * 100)

  return (
    <Paper
      shadow='sm'
      radius='md'
      p='lg'
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderLeft: `4px solid ${project.color}`
      }}
      onClick={onClick}
    >
      <Stack gap='md'>
        <Group justify='space-between' align='flex-start'>
          <Stack gap={4}>
            <Group gap='xs'>
              <ThemeIcon color={project.color} variant='light' size='lg' radius='md'>
                <IoFolder size={18} />
              </ThemeIcon>
              <Text fw={600} size='lg'>
                {project.name}
              </Text>
            </Group>
            <Text size='sm' c='dimmed' lineClamp={2}>
              {project.description}
            </Text>
          </Stack>
          <Badge
            color={project.status === 'completed' ? 'teal' : 'blue'}
            variant='light'
            size='sm'
          >
            {project.status === 'completed' ? 'Completado' : 'En curso'}
          </Badge>
        </Group>

        <Group gap='xs'>
          <Tooltip label='Repositorio'>
            <ActionIcon 
              variant='subtle' 
              color='gray'
              component='a'
              href={project.repoUrl}
              target='_blank'
              onClick={(e) => e.stopPropagation()}
            >
              <IoGitBranch size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={project.devDeployUrl ? 'Dev Deploy' : 'Sin deploy dev'}>
            <ActionIcon 
              variant={project.devDeployUrl ? 'light' : 'subtle'} 
              color={project.devDeployUrl ? 'blue' : 'gray'}
              component='a'
              href={project.devDeployUrl || '#'}
              target='_blank'
              disabled={!project.devDeployUrl}
              onClick={(e) => e.stopPropagation()}
            >
              <IoCodeSlash size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={project.prodDeployUrl ? 'Production Deploy' : 'Sin deploy prod'}>
            <ActionIcon 
              variant={project.prodDeployUrl ? 'light' : 'subtle'} 
              color={project.prodDeployUrl ? 'teal' : 'gray'}
              component='a'
              href={project.prodDeployUrl || '#'}
              target='_blank'
              disabled={!project.prodDeployUrl}
              onClick={(e) => e.stopPropagation()}
            >
              <IoRocket size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Box style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); router.push(`/projects/${project.id}/issues`) }}>
          <Group gap='xs'>
            <Group gap={4}>
              <IoAlertCircle size={14} color='#fa5252' />
              <Text size='xs' c='dimmed'>
                {project.pendingIssues} abiertas
              </Text>
            </Group>
            <Group gap={4}>
              <IoCheckmarkCircle size={14} color='#40c057' />
              <Text size='xs' c='dimmed'>
                {project.totalIssues - project.pendingIssues} resueltas
              </Text>
            </Group>
          </Group>
        </Box>

        <Box>
          <Group justify='space-between' mb='xs'>
            <Text size='xs' c='dimmed'>
              Progreso de issues
            </Text>
            <Text size='xs' fw={500}>
              {progress}%
            </Text>
          </Group>
          <Progress 
            value={progress} 
            color={progress === 100 ? 'teal' : 'blue'} 
            size='sm' 
            radius='xl' 
          />
        </Box>

        <Group justify='space-between'>
          <Avatar.Group spacing='sm'>
            {project.members.map((member) => (
              <Tooltip key={member.id} label={member.name} withArrow>
                <Avatar 
                  size='sm' 
                  radius='xl' 
                  color={project.color}
                >
                  {member.avatar}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
          <Menu shadow='md' width={150}>
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray'>
                <IoEllipsisVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IoPencil size={14} />} onClick={onEdit}>Editar</Menu.Item>
              <Menu.Item leftSection={<IoLink size={14} />}>Vincular Repositorio</Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IoTrash size={14} />} color='red' onClick={onDelete}>Eliminar</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Stack>
    </Paper>
  )
}

function ProjectsContent() {
  const router = useRouter()
  const { settings } = useSettings()
  const [search, setSearch] = useState('')
  const [projects, setProjects] = useState(mockProjects)
  const [modalOpen, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [editingProject, setEditingProject] = useState<typeof mockProjects[0] | null>(null)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#228be6',
    repoUrl: '',
    devDeployUrl: '',
    prodDeployUrl: ''
  })
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [showRepoSelector, setShowRepoSelector] = useState(false)
  const [repoError, setRepoError] = useState<string | null>(null)

  const githubIntegration = settings.integrations.find(i => i.id === 'github')
  const isGithubEnabled = githubIntegration?.enabled && githubIntegration?.token
  const githubOrg = githubIntegration?.webhookUrl?.trim() || undefined

  const loadGithubRepos = async () => {
    if (!githubIntegration?.token) return
    setLoadingRepos(true)
    setRepoError(null)
    try {
      const repos = await fetchGithubRepos(githubIntegration.token)
      setGithubRepos(repos)
      setShowRepoSelector(true)
    } catch (error) {
      setRepoError('Error al cargar repositorios. Verifica tu token.')
      console.error('Error loading GitHub repos:', error)
    } finally {
      setLoadingRepos(false)
    }
  }

  const handleSelectRepo = (repo: GithubRepo) => {
    setNewProject({
      ...newProject,
      name: repo.name,
      description: repo.description || '',
      repoUrl: repo.html_url
    })
    setShowRepoSelector(false)
  }

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveProject = () => {
    if (!newProject.name.trim()) return

    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...p, ...newProject }
          : p
      ))
    } else {
      const project = {
        id: crypto.randomUUID(),
        ...newProject,
        status: 'active',
        totalIssues: 0,
        pendingIssues: 0,
        members: []
      }
      setProjects([...projects, project])
    }
    closeModal()
    setEditingProject(null)
    setNewProject({ name: '', description: '', color: '#228be6', repoUrl: '', devDeployUrl: '', prodDeployUrl: '' })
  }

  const handleEditProject = (project: typeof mockProjects[0]) => {
    setEditingProject(project)
    setNewProject({
      name: project.name,
      description: project.description,
      color: project.color,
      repoUrl: project.repoUrl,
      devDeployUrl: project.devDeployUrl || '',
      prodDeployUrl: project.prodDeployUrl || ''
    })
    openModal()
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  return (
    <Box style={{ width: '100%' }}>
      <Stack gap='xl'>
        <Group justify='space-between'>
          <Group>
            <ThemeIcon color='blue' variant='light' size='xl' radius='md'>
              <IoFolder size={24} />
            </ThemeIcon>
            <Title order={2}>Proyectos</Title>
          </Group>
          <Group>
            <TextInput
              placeholder='Buscar proyectos...'
              leftSection={<IoSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              w={250}
            />
            <Button leftSection={<IoAdd size={16} />} onClick={() => { setEditingProject(null); openModal() }}>
              Nuevo Proyecto
            </Button>
          </Group>
        </Group>

        {!isGithubEnabled && (
          <Alert icon={<IoAlertCircle size={18} />} color='yellow' title='GitHub no configurado'>
            <Group justify='space-between'>
              <Text size='sm'>
                Configura tu token de GitHub para sincronizar tus repositorios.
              </Text>
              <Button size='xs' variant='light' component={Link} href='/settings/integrations'>
                Configurar
              </Button>
            </Group>
          </Alert>
        )}

        <Modal opened={modalOpen} onClose={closeModal} title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'} size='lg'>
          <Stack gap='md'>
            <TextInput
              label='Nombre'
              placeholder='Nombre del proyecto'
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
            />
            <Textarea
              label='Descripción'
              placeholder='Descripción del proyecto'
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={3}
            />
            <Text size='sm' fw={500}>Color</Text>
            <Group>
              {COLORS.map(color => (
                <ColorSwatch 
                  key={color} 
                  color={color} 
                  onClick={() => setNewProject({ ...newProject, color })}
                  style={{ cursor: 'pointer', border: newProject.color === color ? '2px solid #000' : 'none' }}
                />
              ))}
            </Group>
            {isGithubEnabled ? (
              <Button 
                variant='light' 
                leftSection={loadingRepos ? <Loader size={14} /> : <IoSync size={16} />}
                onClick={loadGithubRepos}
                loading={loadingRepos}
              >
                Sincronizar desde GitHub
              </Button>
            ) : (
              <Alert icon={<IoAlertCircle size={16} />} color='yellow' variant='light'>
                <Text size='sm'>Configura GitHub para sincronizar repositorios</Text>
              </Alert>
            )}

            {repoError && (
              <Alert icon={<IoAlertCircle size={16} />} color='red' variant='light'>
                <Text size='sm'>{repoError}</Text>
              </Alert>
            )}

            {showRepoSelector && githubRepos.length > 0 && (
              <Paper shadow='xs' p='md' withBorder>
                <Text size='sm' fw={500} mb='sm'>Selecciona un repositorio</Text>
                <Stack gap='xs' style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {githubRepos.map(repo => (
                    <Paper 
                      key={repo.id} 
                      p='xs' 
                      withBorder 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectRepo(repo)}
                    >
                      <Group justify='space-between'>
                        <div>
                          <Text size='sm' fw={500}>{repo.name}</Text>
                          <Text size='xs' c='dimmed' lineClamp={1}>{repo.description}</Text>
                        </div>
                        {repo.language && <Badge size='xs' variant='light'>{repo.language}</Badge>}
                      </Group>
                    </Paper>
                  ))}
                </Stack>
                <Button variant='subtle' size='xs' mt='sm' onClick={() => setShowRepoSelector(false)}>
                  Cancelar
                </Button>
              </Paper>
            )}

            <TextInput
              label='URL del Repositorio'
              placeholder='https://github.com/usuario/repo'
              value={newProject.repoUrl}
              onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label='URL Dev'
                  placeholder='https://dev-proyecto.com'
                  value={newProject.devDeployUrl}
                  onChange={(e) => setNewProject({ ...newProject, devDeployUrl: e.target.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label='URL Producción'
                  placeholder='https://proyecto.com'
                  value={newProject.prodDeployUrl}
                  onChange={(e) => setNewProject({ ...newProject, prodDeployUrl: e.target.value })}
                />
              </Grid.Col>
            </Grid>
            <Group justify='flex-end' mt='md'>
              <Button variant='subtle' onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleSaveProject}>Guardar</Button>
            </Group>
          </Stack>
        </Modal>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing='lg'>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => router.push(`/projects/${project.id}`)}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoader />}>
      <ProjectsContent />
    </Suspense>
  )
}
