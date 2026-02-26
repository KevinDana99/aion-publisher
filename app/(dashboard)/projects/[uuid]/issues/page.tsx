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
  Table,
  TextInput,
  Select,
  Menu,
  Tooltip
} from '@mantine/core'
import { 
  IoArrowBack, 
  IoGitBranch, 
  IoAlertCircle,
  IoCheckmarkCircle,
  IoTime,
  IoSearch,
  IoEllipsisVertical
} from 'react-icons/io5'

const mockProjects = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Website Redesign', color: '#228be6' },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'API Development', color: '#15aabf' },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Mobile App', color: '#be4bdb' },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Admin Dashboard', color: '#fd7e14' },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Documentation', color: '#40c057' }
]

const mockIssues = [
  { id: '1', number: 23, title: 'Error en el login con Google', state: 'open', labels: [{ name: 'bug', color: '#fa5252' }], assignee: { name: 'Juan Pérez', avatar: 'JP' }, createdAt: '2024-01-15' },
  { id: '2', number: 22, title: 'Agregar dark mode al dashboard', state: 'open', labels: [{ name: 'feature', color: '#228be6' }], assignee: { name: 'María García', avatar: 'MG' }, createdAt: '2024-01-14' },
  { id: '3', number: 21, title: 'Optimizar queries de base de datos', state: 'open', labels: [{ name: 'performance', color: '#fd7e14' }], assignee: { name: 'Carlos López', avatar: 'CL' }, createdAt: '2024-01-13' },
  { id: '4', number: 20, title: 'Fix de CSS en mobile', state: 'closed', labels: [{ name: 'bug', color: '#fa5252' }], assignee: { name: 'Ana Martínez', avatar: 'AM' }, createdAt: '2024-01-12' },
  { id: '5', number: 19, title: 'Implementar cache redis', state: 'closed', labels: [{ name: 'feature', color: '#228be6' }], assignee: { name: 'Pedro Sánchez', avatar: 'PS' }, createdAt: '2024-01-11' },
  { id: '6', number: 18, title: 'Actualizar dependencias', state: 'closed', labels: [{ name: 'maintenance', color: '#868e96' }], assignee: { name: 'Juan Pérez', avatar: 'JP' }, createdAt: '2024-01-10' },
]

export default function ProjectIssuesPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.uuid as string
  const project = mockProjects.find(p => p.id === projectId) || { name: projectId, color: '#228be6' }

  const openIssues = mockIssues.filter(i => i.state === 'open').length
  const closedIssues = mockIssues.filter(i => i.state === 'closed').length

  return (
    <Box style={{ width: '100%' }}>
      <Stack gap='lg'>
        <Group gap='xs'>
          <Paper shadow='xs' radius='xl' style={{ background: 'var(--mantine-color-default)' }}>
            <ActionIcon variant='subtle' size='lg' onClick={() => router.push(`/projects/${projectId}`)}>
              <IoArrowBack size={20} />
            </ActionIcon>
          </Paper>
          <ThemeIcon color={project.color} variant='light' size='xl' radius='md'>
            <IoAlertCircle size={24} />
          </ThemeIcon>
          <Title order={2}>Issues</Title>
          <Badge variant='light' color='gray'>{project.name}</Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing='md'>
          <Paper shadow='sm' radius='md' p='md' withBorder>
            <Group justify='space-between'>
              <Group gap='xs'>
                <IoAlertCircle size={18} color='#fa5252' />
                <Text size='sm'>Abiertas</Text>
              </Group>
              <Text size='xl' fw={700}>{openIssues}</Text>
            </Group>
          </Paper>
          <Paper shadow='sm' radius='md' p='md' withBorder>
            <Group justify='space-between'>
              <Group gap='xs'>
                <IoCheckmarkCircle size={18} color='#40c057' />
                <Text size='sm'>Cerradas</Text>
              </Group>
              <Text size='xl' fw={700}>{closedIssues}</Text>
            </Group>
          </Paper>
          <Paper shadow='sm' radius='md' p='md' withBorder>
            <Group justify='space-between'>
              <Group gap='xs'>
                <IoTime size={18} color='#868e96' />
                <Text size='sm'>Total</Text>
              </Group>
              <Text size='xl' fw={700}>{mockIssues.length}</Text>
            </Group>
          </Paper>
        </SimpleGrid>

        <Paper shadow='sm' radius='md' withBorder>
          <Group p='md' justify='space-between'>
            <Group gap='sm'>
              <TextInput placeholder='Buscar issues...' leftSection={<IoSearch size={16} />} w={250} />
              <Select placeholder='Estado' data={[{ value: 'all', label: 'Todos' }, { value: 'open', label: 'Abiertas' }, { value: 'closed', label: 'Cerradas' }]} defaultValue='all' w={130} />
              <Select placeholder='Label' data={[{ value: 'all', label: 'Todos' }, { value: 'bug', label: 'Bug' }, { value: 'feature', label: 'Feature' }]} defaultValue='all' w={130} />
            </Group>
          </Group>

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={50}>#</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th w={100}>Estado</Table.Th>
                <Table.Th w={150}>Labels</Table.Th>
                <Table.Th w={130}>Asignado</Table.Th>
                <Table.Th w={100}>Fecha</Table.Th>
                <Table.Th w={50}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {mockIssues.map((issue) => (
                <Table.Tr key={issue.id}>
                  <Table.Td><Text size='sm' c='dimmed'>#{issue.number}</Text></Table.Td>
                  <Table.Td>
                    <Group gap='xs'>
                      {issue.state === 'open' ? <IoAlertCircle size={16} color='#228be6' /> : <IoCheckmarkCircle size={16} color='#40c057' />}
                      <Text size='sm' fw={500}>{issue.title}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={issue.state === 'open' ? 'blue' : 'teal'} variant='light' size='sm'>
                      {issue.state === 'open' ? 'Abierta' : 'Cerrada'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {issue.labels.map((label) => (
                        <Badge key={label.name} size='xs' variant='filled' style={{ backgroundColor: label.color }}>{label.name}</Badge>
                      ))}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={issue.assignee.name}>
                      <Badge variant='light' size='sm'>{issue.assignee.avatar}</Badge>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td><Text size='xs' c='dimmed'>{issue.createdAt}</Text></Table.Td>
                  <Table.Td>
                    <Menu shadow='md' width={150}>
                      <Menu.Target>
                        <ActionIcon variant='subtle' color='gray'><IoEllipsisVertical size={16} /></ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item>Ver en GitHub</Menu.Item>
                        <Menu.Item>Editar</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item color='red'>Cerrar issue</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </Box>
  )
}
