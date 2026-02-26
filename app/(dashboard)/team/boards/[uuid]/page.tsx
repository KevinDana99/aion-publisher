'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Stack,
  Title,
  Group,
  ActionIcon,
  Paper,
  Text
} from '@mantine/core'
import { IoGitBranch, IoArrowBack } from 'react-icons/io5'
import KanbanBoard from '@/components/shared/boards/KanbanBoard'

const mockBoards = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Website Redesign', color: '#228be6' },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'API Development', color: '#15aabf' },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Marketing Campaign', color: '#be4bdb' },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'DevOps Infrastructure', color: '#fd7e14' },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Documentation', color: '#40c057' },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'UX Research', color: '#fab005' }
]

export default function BoardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const boardId = params.uuid as string
  const board = mockBoards.find(b => b.id === boardId)

  if (!board) {
    return (
      <Box style={{ width: '100%' }}>
        <Stack gap='lg'>
          <Group gap='xs'>
            <Paper shadow='xs' radius='xl' style={{ background: 'var(--mantine-color-default)' }}>
              <ActionIcon variant='subtle' size='lg' onClick={() => router.push('/team/boards')}>
                <IoArrowBack size={20} />
              </ActionIcon>
            </Paper>
            <Title order={2}>Tablero no encontrado</Title>
          </Group>
          <Text c='dimmed'>El tablero con ID {boardId} no existe.</Text>
        </Stack>
      </Box>
    )
  }

  return (
    <Box style={{ width: '100%' }}>
      <Stack gap='lg'>
        <Group gap='xs'>
          <Paper shadow='xs' radius='xl' style={{ background: 'var(--mantine-color-default)' }}>
            <ActionIcon variant='subtle' size='lg' onClick={() => router.push('/team/boards')}>
              <IoArrowBack size={20} />
            </ActionIcon>
          </Paper>
          <IoGitBranch size={28} color={board.color} />
          <Title order={2}>{board.name}</Title>
        </Group>

        <KanbanBoard project={boardId} />
      </Stack>
    </Box>
  )
}
