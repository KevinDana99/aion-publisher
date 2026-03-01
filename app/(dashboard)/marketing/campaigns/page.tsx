'use client'

import { useState } from 'react'
import {
  Box,
  Stack,
  Title,
  Group,
  Text,
  Paper,
  ThemeIcon,
  Badge,
  Button,
  Progress,
  SimpleGrid,
  ActionIcon,
  Menu,
  Tabs,
  Table,
  Avatar
} from '@mantine/core'
import {
  IoMegaphone,
  IoTrendingUp,
  IoTrendingDown,
  IoEye,
  IoHandLeft,
  IoPeople,
  IoWallet,
  IoEllipsisVertical,
  IoCreate,
  IoPause,
  IoPlay,
  IoTrash,
  IoRefresh,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoLinkedin,
  IoAdd,
  IoOpen
} from 'react-icons/io5'
import { useRouter } from 'next/navigation'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  platforms: string[]
  budget: number
  spent: number
  impressions: number
  clicks: number
  reach: number
  ctr: number
  cpc: number
  startDate: string
  endDate: string | null
  objective: string
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Black Friday 2024',
    status: 'active',
    platforms: ['instagram', 'facebook'],
    budget: 5000,
    spent: 3250,
    impressions: 125000,
    clicks: 4500,
    reach: 89000,
    ctr: 3.6,
    cpc: 0.72,
    startDate: '2024-11-20',
    endDate: '2024-11-30',
    objective: 'Conversiones'
  },
  {
    id: '2',
    name: 'Lanzamiento Q4',
    status: 'active',
    platforms: ['instagram', 'facebook', 'linkedin'],
    budget: 8000,
    spent: 5600,
    impressions: 210000,
    clicks: 7200,
    reach: 145000,
    ctr: 3.4,
    cpc: 0.78,
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    objective: 'Tráfico'
  },
  {
    id: '3',
    name: 'Brand Awareness',
    status: 'paused',
    platforms: ['instagram', 'facebook'],
    budget: 3000,
    spent: 2900,
    impressions: 180000,
    clicks: 2100,
    reach: 120000,
    ctr: 1.2,
    cpc: 1.38,
    startDate: '2024-09-01',
    endDate: '2024-10-15',
    objective: 'Reconocimiento de marca'
  },
  {
    id: '4',
    name: 'Email Campaign',
    status: 'completed',
    platforms: ['facebook'],
    budget: 1500,
    spent: 1500,
    impressions: 45000,
    clicks: 3200,
    reach: 38000,
    ctr: 7.1,
    cpc: 0.47,
    startDate: '2024-08-01',
    endDate: '2024-08-31',
    objective: 'Leads'
  },
  {
    id: '5',
    name: 'Retargeting Carritos',
    status: 'active',
    platforms: ['instagram', 'facebook'],
    budget: 2000,
    spent: 890,
    impressions: 32000,
    clicks: 1800,
    reach: 25000,
    ctr: 5.6,
    cpc: 0.49,
    startDate: '2024-11-01',
    endDate: null,
    objective: 'Conversiones'
  }
]

const statusColors: Record<string, string> = {
  active: 'green',
  paused: 'yellow',
  completed: 'blue',
  draft: 'gray'
}

const statusLabels: Record<string, string> = {
  active: 'Activa',
  paused: 'Pausada',
  completed: 'Completada',
  draft: 'Borrador'
}

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns] = useState<Campaign[]>(mockCampaigns)

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spent, 0)
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0)
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0)
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length

  return (
    <Box p='xl' style={{ width: '100%' }}>
      <Stack gap='xl'>
        <Group justify='space-between'>
          <Group gap='xs'>
            <IoMegaphone size={28} />
            <Title order={2}>Campañas</Title>
          </Group>
          <Group>
            <Button
              variant='light'
              leftSection={<IoOpen size={16} />}
              component='a'
              href='https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=308458716498232&filter_set=campaign.impressions-NUMBER%1EGREATER_THAN%1E%220%22&nav_source=business_manager'
              target='_blank'
            >
              Meta Business
            </Button>
            <Button
              leftSection={<IoAdd size={18} />}
              onClick={() => router.push('/marketing/publisher')}
            >
              Nueva Campaña
            </Button>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing='lg'>
          <Paper p='md' radius='lg' shadow='sm'>
            <Group justify='space-between'>
              <Box>
                <Text size='sm' c='dimmed'>
                  Presupuesto Total
                </Text>
                <Text size='xl' fw={700}>
                  ${totalBudget.toLocaleString()}
                </Text>
                <Text size='xs' c='dimmed'>
                  ${totalSpend.toLocaleString()} gastado
                </Text>
              </Box>
              <ThemeIcon color='blue' variant='light' size='lg' radius='md'>
                <IoWallet size={20} />
              </ThemeIcon>
            </Group>
            <Progress
              value={(totalSpend / totalBudget) * 100}
              size='sm'
              radius='xl'
              mt='sm'
              color='blue'
            />
          </Paper>

          <Paper p='md' radius='lg' shadow='sm'>
            <Group justify='space-between'>
              <Box>
                <Text size='sm' c='dimmed'>
                  Impresiones
                </Text>
                <Text size='xl' fw={700}>
                  {(totalImpressions / 1000).toFixed(1)}K
                </Text>
                <Group gap={4}>
                  <IoTrendingUp
                    size={14}
                    color='var(--mantine-color-green-6)'
                  />
                  <Text size='xs' c='green'>
                    +12% vs mes anterior
                  </Text>
                </Group>
              </Box>
              <ThemeIcon color='violet' variant='light' size='lg' radius='md'>
                <IoEye size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p='md' radius='lg' shadow='sm'>
            <Group justify='space-between'>
              <Box>
                <Text size='sm' c='dimmed'>
                  Clics
                </Text>
                <Text size='xl' fw={700}>
                  {(totalClicks / 1000).toFixed(1)}K
                </Text>
                <Group gap={4}>
                  <IoTrendingUp
                    size={14}
                    color='var(--mantine-color-green-6)'
                  />
                  <Text size='xs' c='green'>
                    +8% vs mes anterior
                  </Text>
                </Group>
              </Box>
              <ThemeIcon color='teal' variant='light' size='lg' radius='md'>
                <IoHandLeft size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p='md' radius='lg' shadow='sm'>
            <Group justify='space-between'>
              <Box>
                <Text size='sm' c='dimmed'>
                  Campañas Activas
                </Text>
                <Text size='xl' fw={700}>
                  {activeCampaigns}
                </Text>
                <Text size='xs' c='dimmed'>
                  {campaigns.length} total
                </Text>
              </Box>
              <ThemeIcon color='green' variant='light' size='lg' radius='md'>
                <IoMegaphone size={20} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        <Tabs defaultValue='all'>
          <Tabs.List>
            <Tabs.Tab value='all'>Todas ({campaigns.length})</Tabs.Tab>
            <Tabs.Tab value='active'>
              Activas ({campaigns.filter((c) => c.status === 'active').length})
            </Tabs.Tab>
            <Tabs.Tab value='paused'>
              Pausadas ({campaigns.filter((c) => c.status === 'paused').length})
            </Tabs.Tab>
            <Tabs.Tab value='completed'>
              Completadas (
              {campaigns.filter((c) => c.status === 'completed').length})
            </Tabs.Tab>
          </Tabs.List>

          {['all', 'active', 'paused', 'completed'].map((tabValue) => (
            <Tabs.Panel key={tabValue} value={tabValue} pt='md'>
              <Paper radius='lg' shadow='sm'>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Campaña</Table.Th>
                      <Table.Th>Estado</Table.Th>
                      <Table.Th>Plataformas</Table.Th>
                      <Table.Th>Presupuesto</Table.Th>
                      <Table.Th>Impresiones</Table.Th>
                      <Table.Th>Clics</Table.Th>
                      <Table.Th>CTR</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {campaigns
                      .filter(
                        (c) => tabValue === 'all' || c.status === tabValue
                      )
                      .map((campaign) => (
                        <Table.Tr key={campaign.id}>
                          <Table.Td>
                            <Box>
                              <Text fw={500}>{campaign.name}</Text>
                              <Text size='xs' c='dimmed'>
                                {campaign.objective}
                              </Text>
                            </Box>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={statusColors[campaign.status]}
                              variant='light'
                            >
                              {statusLabels[campaign.status]}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group gap={4}>
                              {campaign.platforms.includes('instagram') && (
                                <IoLogoInstagram
                                  size={16}
                                  color='var(--mantine-color-violet-6)'
                                />
                              )}
                              {campaign.platforms.includes('facebook') && (
                                <IoLogoFacebook
                                  size={16}
                                  color='var(--mantine-color-blue-6)'
                                />
                              )}
                              {campaign.platforms.includes('linkedin') && (
                                <IoLogoLinkedin
                                  size={16}
                                  color='var(--mantine-color-blue-7)'
                                />
                              )}
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Box>
                              <Text size='sm' fw={500}>
                                ${campaign.spent.toLocaleString()} / $
                                {campaign.budget.toLocaleString()}
                              </Text>
                              <Progress
                                value={(campaign.spent / campaign.budget) * 100}
                                size='xs'
                                radius='xl'
                                color={
                                  campaign.spent / campaign.budget > 0.9
                                    ? 'red'
                                    : 'blue'
                                }
                                w={80}
                              />
                            </Box>
                          </Table.Td>
                          <Table.Td>
                            <Text>
                              {(campaign.impressions / 1000).toFixed(1)}K
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text>{(campaign.clicks / 1000).toFixed(1)}K</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={
                                campaign.ctr >= 3
                                  ? 'green'
                                  : campaign.ctr >= 1
                                    ? 'yellow'
                                    : 'red'
                              }
                              variant='light'
                            >
                              {campaign.ctr}%
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Menu shadow='md' width={200}>
                              <Menu.Target>
                                <ActionIcon variant='subtle'>
                                  <IoEllipsisVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IoEye size={14} />}>
                                  Ver Detalles
                                </Menu.Item>
                                <Menu.Item leftSection={<IoCreate size={14} />}>
                                  Editar
                                </Menu.Item>
                                {campaign.status === 'active' ? (
                                  <Menu.Item
                                    leftSection={<IoPause size={14} />}
                                  >
                                    Pausar
                                  </Menu.Item>
                                ) : campaign.status === 'paused' ? (
                                  <Menu.Item leftSection={<IoPlay size={14} />}>
                                    Reanudar
                                  </Menu.Item>
                                ) : null}
                                <Menu.Divider />
                                <Menu.Item
                                  leftSection={<IoTrash size={14} />}
                                  color='red'
                                >
                                  Eliminar
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </Paper>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Stack>
    </Box>
  )
}
