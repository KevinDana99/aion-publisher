'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Stack,
  Title,
  Group,
  Loader,
  Center,
  SimpleGrid,
  Paper,
  Text,
  Badge,
  Progress,
  Avatar,
  ActionIcon,
  Box,
  TextInput
} from '@mantine/core'
import { IoGrid, IoChevronForward, IoGitBranch, IoSearch } from 'react-icons/io5'

const mockBoards = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Website Redesign',
    description: 'Rediseño completo del sitio web corporativo',
    color: '#228be6',
    totalTasks: 24,
    completedTasks: 8,
    members: [
      { id: '1', name: 'Juan Pérez', avatar: 'JP' },
      { id: '2', name: 'María García', avatar: 'MG' },
      { id: '3', name: 'Carlos López', avatar: 'CL' }
    ],
    status: 'active'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'API Development',
    description: 'Desarrollo de APIs REST y GraphQL',
    color: '#15aabf',
    totalTasks: 18,
    completedTasks: 12,
    members: [
      { id: '3', name: 'Carlos López', avatar: 'CL' },
      { id: '4', name: 'Ana Martínez', avatar: 'AM' }
    ],
    status: 'active'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Marketing Campaign',
    description: 'Campañas de marketing digital Q1',
    color: '#be4bdb',
    totalTasks: 32,
    completedTasks: 20,
    members: [
      { id: '2', name: 'María García', avatar: 'MG' },
      { id: '5', name: 'Pedro Sánchez', avatar: 'PS' }
    ],
    status: 'active'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'DevOps Infrastructure',
    description: 'Infestructura CI/CD y automatización',
    color: '#fd7e14',
    totalTasks: 15,
    completedTasks: 10,
    members: [{ id: '3', name: 'Carlos López', avatar: 'CL' }],
    status: 'active'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Documentation',
    description: 'Documentación técnica y de usuario',
    color: '#40c057',
    totalTasks: 10,
    completedTasks: 10,
    members: [{ id: '4', name: 'Ana Martínez', avatar: 'AM' }],
    status: 'completed'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'UX Research',
    description: 'Investigación y pruebas de usuario',
    color: '#fab005',
    totalTasks: 8,
    completedTasks: 3,
    members: [
      { id: '4', name: 'Ana Martínez', avatar: 'AM' },
      { id: '5', name: 'Pedro Sánchez', avatar: 'PS' }
    ],
    status: 'active'
  }
]

function BoardsLoader() {
  return (
    <Center h={400}>
      <Loader size='lg' />
    </Center>
  )
}

interface BoardCardProps {
  board: (typeof mockBoards)[0]
  onClick: () => void
}

function BoardCard({ board, onClick }: BoardCardProps) {
  const progress = Math.round((board.completedTasks / board.totalTasks) * 100)

  return (
    <Paper
      shadow='sm'
      radius='md'
      p='lg'
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderLeft: `4px solid ${board.color}`
      }}
      onClick={onClick}
    >
      <Stack gap='md'>
        <Group justify='space-between' align='flex-start'>
          <Stack gap={4}>
            <Group gap='xs'>
              <IoGitBranch size={18} color={board.color} />
              <Text fw={600} size='lg'>
                {board.name}
              </Text>
            </Group>
            <Text size='sm' c='dimmed' lineClamp={2}>
              {board.description}
            </Text>
          </Stack>
          <Badge
            color={board.status === 'completed' ? 'teal' : 'blue'}
            variant='light'
            size='sm'
          >
            {board.status === 'completed' ? 'Completado' : 'En curso'}
          </Badge>
        </Group>

        <Box>
          <Group justify='space-between' mb='xs'>
            <Text size='xs' c='dimmed'>
              {board.completedTasks} de {board.totalTasks} tareas
            </Text>
            <Text size='xs' fw={500}>
              {progress}%
            </Text>
          </Group>
          <Progress
            value={progress}
            color={board.color}
            size='sm'
            radius='xl'
          />
        </Box>

        <Group justify='space-between'>
          <Group gap={0}>
            {board.members.slice(0, 3).map((member, index) => (
              <Avatar
                key={member.id}
                size='sm'
                radius='xl'
                color='blue'
                style={{
                  marginLeft: index > 0 ? -8 : 0,
                  border: '2px solid var(--mantine-color-body)'
                }}
              >
                {member.avatar}
              </Avatar>
            ))}
            {board.members.length > 3 && (
              <Avatar
                size='sm'
                radius='xl'
                color='gray'
                style={{ marginLeft: -8 }}
              >
                +{board.members.length - 3}
              </Avatar>
            )}
          </Group>
          <ActionIcon variant='subtle' size='md'>
            <IoChevronForward size={16} />
          </ActionIcon>
        </Group>
      </Stack>
    </Paper>
  )
}

function BoardsContent() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filteredBoards = mockBoards.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  )

  const activeBoards = filteredBoards.filter((b) => b.status === 'active')
  const completedBoards = filteredBoards.filter((b) => b.status === 'completed')

  return (
    <Box style={{ width: '100%' }}>
      <Stack gap='xl'>
        <Group justify='space-between'>
          <Group gap='xs'>
            <IoGrid size={28} />
            <Title order={2}>Tableros</Title>
          </Group>
          <TextInput
            placeholder='Buscar tableros...'
            leftSection={<IoSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            w={250}
          />
        </Group>

        {activeBoards.length > 0 && (
          <Stack gap='md'>
            <Text fw={500} c='dimmed'>
              En curso
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='lg'>
              {activeBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onClick={() => router.push(`/team/boards/${board.id}`)}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}

        {completedBoards.length > 0 && (
          <Stack gap='md'>
            <Text fw={500} c='dimmed'>
              Completados
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='lg'>
              {completedBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onClick={() => router.push(`/team/boards/${board.id}`)}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default function BoardsPage() {
  return (
    <Suspense fallback={<BoardsLoader />}>
      <BoardsContent />
    </Suspense>
  )
}
