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
  TextInput
} from '@mantine/core'
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
  IoSearch
} from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'

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
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
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
          <ActionIcon variant='subtle' color='gray'>
            <IoChevronForward size={16} />
          </ActionIcon>
        </Group>
      </Stack>
    </Paper>
  )
}

function ProjectsContent() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filteredProjects = mockProjects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

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
          <TextInput
            placeholder='Buscar proyectos...'
            leftSection={<IoSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            w={250}
          />
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing='lg'>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => router.push(`/projects/${project.id}`)}
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
