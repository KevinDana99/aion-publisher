'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Stack,
  Title,
  Group,
  ActionIcon,
  Paper,
  Text,
  Badge,
  ThemeIcon,
  SimpleGrid,
  Card,
  Button,
  Divider
} from '@mantine/core'
import {
  IoArrowBack,
  IoGitBranch,
  IoRocket,
  IoCodeSlash,
  IoAlertCircle,
  IoGrid,
  IoLink
} from 'react-icons/io5'
import KanbanBoard from '@/components/shared/boards/KanbanBoard'

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
    boardUuid: '550e8400-e29b-41d4-a716-446655440001'
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
    boardUuid: '550e8400-e29b-41d4-a716-446655440002'
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
    boardUuid: '550e8400-e29b-41d4-a716-446655440003'
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
    boardUuid: '550e8400-e29b-41d4-a716-446655440004'
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
    boardUuid: '550e8400-e29b-41d4-a716-446655440005'
  }
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.uuid as string
  const project = mockProjects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <Box style={{ width: '100%' }}>
        <Stack gap='lg'>
          <Group gap='xs'>
            <Paper
              shadow='xs'
              radius='xl'
              style={{ background: 'var(--mantine-color-default)' }}
            >
              <ActionIcon
                variant='subtle'
                size='lg'
                onClick={() => router.push('/projects')}
              >
                <IoArrowBack size={20} />
              </ActionIcon>
            </Paper>
            <Title order={2}>Proyecto no encontrado</Title>
          </Group>
          <Text c='dimmed'>El proyecto con ID {projectId} no existe.</Text>
        </Stack>
      </Box>
    )
  }

  const resolvedIssues = project.totalIssues - project.pendingIssues

  return (
    <Box style={{ width: '100%' }}>
      <Stack gap='lg'>
        <Group gap='xs'>
          <Paper
            shadow='xs'
            radius='xl'
            style={{ background: 'var(--mantine-color-default)' }}
          >
            <ActionIcon
              variant='subtle'
              size='lg'
              onClick={() => router.push('/projects')}
            >
              <IoArrowBack size={20} />
            </ActionIcon>
          </Paper>
          <ThemeIcon
            color={project.color}
            variant='light'
            size='xl'
            radius='md'
          >
            <IoGitBranch size={24} />
          </ThemeIcon>
          <Title order={2}>{project.name}</Title>
          <Badge
            color={project.status === 'completed' ? 'teal' : 'blue'}
            variant='light'
          >
            {project.status === 'completed' ? 'Completado' : 'En curso'}
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing='md'>
          <Card shadow='sm' radius='md' withBorder>
            <Group justify='space-between' mb='xs'>
              <Text size='xs' c='dimmed' tt='uppercase' fw={700}>
                Repo
              </Text>
              <IoGitBranch size={16} color={project.color} />
            </Group>
            <Text size='sm' fw={500} lineClamp={1}>
              {project.repoUrl.replace('https://github.com/', '')}
            </Text>
            <Button
              variant='subtle'
              size='xs'
              mt='xs'
              leftSection={<IoLink size={14} />}
              component='a'
              href={project.repoUrl}
              target='_blank'
            >
              Abrir
            </Button>
          </Card>

          <Card shadow='sm' radius='md' withBorder>
            <Group justify='space-between' mb='xs'>
              <Text size='xs' c='dimmed' tt='uppercase' fw={700}>
                Dev Deploy
              </Text>
              <IoCodeSlash
                size={16}
                color={project.devDeployUrl ? '#228be6' : '#868e96'}
              />
            </Group>
            <Text size='sm' fw={500} lineClamp={1}>
              {project.devDeployUrl || 'No desplegado'}
            </Text>
            {project.devDeployUrl && (
              <Button
                variant='subtle'
                size='xs'
                mt='xs'
                leftSection={<IoLink size={14} />}
                component='a'
                href={project.devDeployUrl}
                target='_blank'
              >
                Abrir
              </Button>
            )}
          </Card>

          <Card shadow='sm' radius='md' withBorder>
            <Group justify='space-between' mb='xs'>
              <Text size='xs' c='dimmed' tt='uppercase' fw={700}>
                Prod Deploy
              </Text>
              <IoRocket
                size={16}
                color={project.prodDeployUrl ? '#40c057' : '#868e96'}
              />
            </Group>
            <Text size='sm' fw={500} lineClamp={1}>
              {project.prodDeployUrl || 'No desplegado'}
            </Text>
            {project.prodDeployUrl && (
              <Button
                variant='subtle'
                size='xs'
                mt='xs'
                leftSection={<IoLink size={14} />}
                component='a'
                href={project.prodDeployUrl}
                target='_blank'
              >
                Abrir
              </Button>
            )}
          </Card>

          <Card
            shadow='sm'
            radius='md'
            withBorder
            onClick={() => router.push(`/projects/${params.uuid}/issues`)}
            style={{ cursor: 'pointer' }}
          >
            <Group justify='space-between' mb='xs'>
              <Text size='xs' c='dimmed' tt='uppercase' fw={700}>
                Issues
              </Text>
              <IoAlertCircle size={16} color='#fa5252' />
            </Group>
            <Group gap='xs'>
              <Text size='xl' fw={700}>
                {project.pendingIssues}
              </Text>
              <Text size='sm' c='dimmed'>
                / {project.totalIssues}
              </Text>
            </Group>
            <Group gap='xs' mt='xs'>
              <Badge size='xs' color='red' variant='light'>
                {project.pendingIssues} abiertas
              </Badge>
              <Badge size='xs' color='teal' variant='light'>
                {resolvedIssues} resueltas
              </Badge>
            </Group>
          </Card>
        </SimpleGrid>

        <Divider my='sm' />

        <Group justify='space-between' align='center'>
          <Group>
            <IoGrid size={20} />
            <Title order={4}>Tablero de Tareas</Title>
          </Group>
        </Group>

        <KanbanBoard project={project.boardUuid} />
      </Stack>
    </Box>
  )
}
