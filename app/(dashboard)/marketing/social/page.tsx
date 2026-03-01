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
  SimpleGrid,
  Tabs,
  Table,
  Avatar,
  Select,
  Progress,
  Grid,
  Divider
} from '@mantine/core'
import {
  IoStatsChart,
  IoPeople,
  IoEye,
  IoHeart,
  IoChatbubble,
  IoShareSocial,
  IoBookmark,
  IoTrendingUp,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoFlash,
  IoCash,
  IoCalendar,
  IoArrowUp,
  IoArrowDown,
  IoEllipse,
  IoOpen
} from 'react-icons/io5'
import dayjs from 'dayjs'

interface PlatformStats {
  platform: string
  followers: number
  followersChange: number
  reach: number
  reachChange: number
  impressions: number
  likes: number
  comments: number
  shares: number
  saves?: number
  engagement: number
}

interface Post {
  id: string
  content: string
  platform: string
  date: string
  reach: number
  likes: number
  comments: number
  shares: number
  engagement: number
}

interface Lead {
  id: string
  name: string
  email: string
  platform: string
  campaign: string
  date: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
}

interface CampaignPerformance {
  campaign: string
  platform: string
  impressions: number
  clicks: number
  ctr: number
  leads: number
  cost: number
}

const platformStats: PlatformStats[] = [
  {
    platform: 'instagram',
    followers: 12500,
    followersChange: 8.5,
    reach: 45000,
    reachChange: 12.3,
    impressions: 89000,
    likes: 12500,
    comments: 890,
    shares: 450,
    saves: 780,
    engagement: 4.2
  },
  {
    platform: 'facebook',
    followers: 8200,
    followersChange: 3.2,
    reach: 32000,
    reachChange: -2.1,
    impressions: 56000,
    likes: 4500,
    comments: 320,
    shares: 180,
    engagement: 2.8
  },
  {
    platform: 'linkedin',
    followers: 5600,
    followersChange: 15.7,
    reach: 18000,
    reachChange: 22.4,
    impressions: 34000,
    likes: 2100,
    comments: 156,
    shares: 89,
    engagement: 3.1
  },
  {
    platform: 'twitter',
    followers: 3200,
    followersChange: -1.2,
    reach: 12000,
    reachChange: 5.6,
    impressions: 28000,
    likes: 890,
    comments: 67,
    shares: 45,
    engagement: 1.8
  }
]

const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Nueva colección de verano',
    platform: 'instagram',
    date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    reach: 15000,
    likes: 2300,
    comments: 156,
    shares: 89,
    engagement: 5.2
  },
  {
    id: '2',
    content: 'Tips de marketing digital',
    platform: 'linkedin',
    date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    reach: 8500,
    likes: 1200,
    comments: 89,
    shares: 45,
    engagement: 4.1
  },
  {
    id: '3',
    content: 'Black Friday promo',
    platform: 'facebook',
    date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    reach: 22000,
    likes: 3400,
    comments: 234,
    shares: 167,
    engagement: 3.8
  },
  {
    id: '4',
    content: 'Case study cliente X',
    platform: 'instagram',
    date: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    reach: 12000,
    likes: 1800,
    comments: 123,
    shares: 67,
    engagement: 4.5
  },
  {
    id: '5',
    content: 'Nuevo servicio de consulting',
    platform: 'linkedin',
    date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
    reach: 6500,
    likes: 890,
    comments: 56,
    shares: 34,
    engagement: 3.2
  },
  {
    id: '6',
    content: 'Promoción del día',
    platform: 'twitter',
    date: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    reach: 4500,
    likes: 320,
    comments: 28,
    shares: 15,
    engagement: 2.1
  }
]

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    platform: 'instagram',
    campaign: 'Black Friday',
    date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    status: 'converted'
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@email.com',
    platform: 'linkedin',
    campaign: 'Consulting Q4',
    date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    status: 'qualified'
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@email.com',
    platform: 'facebook',
    campaign: 'Newsletter',
    date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    status: 'contacted'
  },
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana@email.com',
    platform: 'instagram',
    campaign: 'Webinar',
    date: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    status: 'new'
  },
  {
    id: '5',
    name: 'Pedro Sánchez',
    email: 'pedro@email.com',
    platform: 'linkedin',
    campaign: 'Case Studies',
    date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
    status: 'converted'
  },
  {
    id: '6',
    name: 'Laura Torres',
    email: 'laura@email.com',
    platform: 'facebook',
    campaign: 'Black Friday',
    date: dayjs().subtract(6, 'day').format('YYYY-DD-MM'),
    status: 'qualified'
  }
]

const mockCampaignPerformance: CampaignPerformance[] = [
  {
    campaign: 'Black Friday',
    platform: 'instagram',
    impressions: 45000,
    clicks: 1800,
    ctr: 4.0,
    leads: 45,
    cost: 320
  },
  {
    campaign: 'Black Friday',
    platform: 'facebook',
    impressions: 32000,
    clicks: 1200,
    ctr: 3.75,
    leads: 32,
    cost: 280
  },
  {
    campaign: 'Lanzamiento Q4',
    platform: 'instagram',
    impressions: 28000,
    clicks: 980,
    ctr: 3.5,
    leads: 28,
    cost: 190
  },
  {
    campaign: 'Lanzamiento Q4',
    platform: 'linkedin',
    impressions: 15000,
    clicks: 650,
    ctr: 4.3,
    leads: 22,
    cost: 150
  },
  {
    campaign: 'Brand Awareness',
    platform: 'facebook',
    impressions: 56000,
    clicks: 1400,
    ctr: 2.5,
    leads: 15,
    cost: 420
  },
  {
    campaign: 'Retargeting',
    platform: 'instagram',
    impressions: 12000,
    clicks: 890,
    ctr: 7.4,
    leads: 38,
    cost: 95
  }
]

const engagementData = [
  { day: 'Lun', instagram: 4.2, facebook: 2.8, linkedin: 3.1, twitter: 1.8 },
  { day: 'Mar', instagram: 4.5, facebook: 3.0, linkedin: 3.4, twitter: 2.0 },
  { day: 'Mié', instagram: 4.8, facebook: 3.2, linkedin: 3.8, twitter: 2.2 },
  { day: 'Jue', instagram: 4.3, facebook: 2.9, linkedin: 3.5, twitter: 1.9 },
  { day: 'Vie', instagram: 5.2, facebook: 3.5, linkedin: 4.1, twitter: 2.5 },
  { day: 'Sáb', instagram: 5.8, facebook: 4.0, linkedin: 2.8, twitter: 1.5 },
  { day: 'Dom', instagram: 5.5, facebook: 3.8, linkedin: 2.2, twitter: 1.2 }
]

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2'
}

const platformNames: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn'
}

const statusColors: Record<string, string> = {
  new: 'blue',
  contacted: 'yellow',
  qualified: 'violet',
  converted: 'green'
}

const SimpleBarChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data)
  return (
    <Group gap={4} align='flex-end' h={60}>
      {data.map((value, index) => (
        <Box
          key={index}
          style={{
            width: 20,
            height: `${(value / max) * 100}%`,
            backgroundColor: color,
            borderRadius: '4px 4px 0 0',
            minHeight: 4
          }}
        />
      ))}
    </Group>
  )
}

const SimpleLineChart = ({ data }: { data: typeof engagementData }) => {
  return (
    <Box>
      <Group justify='space-between' mb='xs'>
        {data.map((item, index) => (
          <Box key={index} ta='center' style={{ flex: 1 }}>
            <Text size='xs' c='dimmed'>
              {item.day}
            </Text>
          </Box>
        ))}
      </Group>
      <Box h={100} pos='relative'>
        <svg width='100%' height='100%' preserveAspectRatio='none'>
          <polyline
            fill='none'
            stroke='#E1306C'
            strokeWidth='2'
            points={data
              .map(
                (item, i) =>
                  `${(i * 100) / 6}%,${50 - (item.instagram - 2) * 15}%`
              )
              .join(' ')}
          />
          <polyline
            fill='none'
            stroke='#1877F2'
            strokeWidth='2'
            points={data
              .map(
                (item, i) =>
                  `${(i * 100) / 6}%,${50 - (item.facebook - 1) * 15}%`
              )
              .join(' ')}
          />
          <polyline
            fill='none'
            stroke='#0A66C2'
            strokeWidth='2'
            points={data
              .map(
                (item, i) =>
                  `${(i * 100) / 6}%,${50 - (item.linkedin - 1) * 15}%`
              )
              .join(' ')}
          />
        </svg>
      </Box>
      <Group justify='center' gap='lg' mt='xs'>
        <Group gap={4}>
          <Box
            w={8}
            h={8}
            style={{ backgroundColor: '#E1306C', borderRadius: '50%' }}
          />
          <Text size='xs'>Instagram</Text>
        </Group>
        <Group gap={4}>
          <Box
            w={8}
            h={8}
            style={{ backgroundColor: '#1877F2', borderRadius: '50%' }}
          />
          <Text size='xs'>Facebook</Text>
        </Group>
        <Group gap={4}>
          <Box
            w={8}
            h={8}
            style={{ backgroundColor: '#0A66C2', borderRadius: '50%' }}
          />
          <Text size='xs'>LinkedIn</Text>
        </Group>
      </Group>
    </Box>
  )
}

export default function SocialPage() {
  const [timeRange, setTimeRange] = useState('30d')

  const totalReach = platformStats.reduce((acc, p) => acc + p.reach, 0)
  const totalImpressions = platformStats.reduce(
    (acc, p) => acc + p.impressions,
    0
  )
  const totalLikes = platformStats.reduce((acc, p) => acc + p.likes, 0)
  const totalComments = platformStats.reduce((acc, p) => acc + p.comments, 0)
  const avgEngagement =
    platformStats.reduce((acc, p) => acc + p.engagement, 0) /
    platformStats.length
  const totalLeads = mockLeads.length
  const convertedLeads = mockLeads.filter(
    (l) => l.status === 'converted'
  ).length

  return (
    <Box p='xl' style={{ width: '100%' }}>
      <Stack gap='xl'>
        <Group justify='space-between'>
          <Group gap='xs'>
            <IoStatsChart size={28} />
            <Title order={2}>Estadísticas de Redes</Title>
          </Group>
          <Group>
            <Button
              variant='light'
              leftSection={<IoOpen size={16} />}
              component='a'
              href='hhttps://adsmanager.facebook.com/adsmanager/manage/campaigns?act=308458716498232&filter_set=campaign.impressions-NUMBER%1EGREATER_THAN%1E%220%22&nav_source=business_manager'
              target='_blank'
            >
              Meta Business
            </Button>
            <Select
              value={timeRange}
              onChange={(v) => setTimeRange(v || '30d')}
              data={[
                { value: '7d', label: 'Últimos 7 días' },
                { value: '30d', label: 'Últimos 30 días' },
                { value: '90d', label: 'Últimos 90 días' }
              ]}
              w={180}
            />
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing='lg'>
          <Paper p='md' radius='lg' shadow='sm'>
            <Group justify='space-between'>
              <Box>
                <Text size='sm' c='dimmed'>
                  Alcance Total
                </Text>
                <Text size='xl' fw={700}>
                  {(totalReach / 1000).toFixed(1)}K
                </Text>
                <Group gap={4}>
                  <IoArrowUp size={14} color='var(--mantine-color-green-6)' />
                  <Text size='xs' c='green'>
                    +8.5% vs anterior
                  </Text>
                </Group>
              </Box>
              <ThemeIcon color='blue' variant='light' size='lg' radius='md'>
                <IoEye size={20} />
              </ThemeIcon>
            </Group>
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
                  <IoArrowUp size={14} color='var(--mantine-color-green-6)' />
                  <Text size='xs' c='green'>
                    +12.3% vs anterior
                  </Text>
                </Group>
              </Box>
              <ThemeIcon color='violet' variant='light' size='lg' radius='md'>
                <IoStatsChart size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p='md' radius='lg' shadow='sm'>
            <Group justify='space-between'>
              <Box>
                <Text size='sm' c='dimmed'>
                  Engagement Rate
                </Text>
                <Text size='xl' fw={700}>
                  {avgEngagement.toFixed(1)}%
                </Text>
                <Group gap={4}>
                  <IoArrowUp size={14} color='var(--mantine-color-green-6)' />
                  <Text size='xs' c='green'>
                    +0.8% vs anterior
                  </Text>
                </Group>
              </Box>
              <ThemeIcon color='pink' variant='light' size='lg' radius='md'>
                <IoHeart size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p='md' radius='lg' shadow='sm'>
            <Group justify='space-between'>
              <Box>
                <Text size='sm' c='dimmed'>
                  Leads Totales
                </Text>
                <Text size='xl' fw={700}>
                  {totalLeads}
                </Text>
                <Group gap={4}>
                  <IoArrowUp size={14} color='var(--mantine-color-green-6)' />
                  <Text size='xs' c='green'>
                    +15 vs anterior
                  </Text>
                </Group>
              </Box>
              <ThemeIcon color='green' variant='light' size='lg' radius='md'>
                <IoFlash size={20} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        <Tabs defaultValue='overview'>
          <Tabs.List>
            <Tabs.Tab value='overview'>Resumen</Tabs.Tab>
            <Tabs.Tab value='platforms'>Plataformas</Tabs.Tab>
            <Tabs.Tab value='posts'>Publicaciones</Tabs.Tab>
            <Tabs.Tab value='leads'>Leads</Tabs.Tab>
            <Tabs.Tab value='campaigns'>Campañas</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='overview' pt='md'>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper p='lg' radius='lg' shadow='sm' h='100%'>
                  <Text fw={600} mb='md'>
                    Engagement por Día
                  </Text>
                  <SimpleLineChart data={engagementData} />
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper p='lg' radius='lg' shadow='sm' h='100%'>
                  <Text fw={600} mb='md'>
                    Leads por Plataforma
                  </Text>
                  <Stack gap='md'>
                    {platformStats.map((p) => {
                      const leads = mockLeads.filter(
                        (l) => l.platform === p.platform
                      ).length
                      const percentage = (leads / totalLeads) * 100
                      return (
                        <Box key={p.platform}>
                          <Group justify='space-between' mb={4}>
                            <Group gap='xs'>
                              {p.platform === 'instagram' && (
                                <IoLogoInstagram size={16} color='#E1306C' />
                              )}
                              {p.platform === 'facebook' && (
                                <IoLogoFacebook size={16} color='#1877F2' />
                              )}
                              {p.platform === 'linkedin' && (
                                <IoLogoLinkedin size={16} color='#0A66C2' />
                              )}
                              {p.platform === 'twitter' && (
                                <IoLogoTwitter size={16} color='#1DA1F2' />
                              )}
                              <Text size='sm'>{platformNames[p.platform]}</Text>
                            </Group>
                            <Text size='sm' fw={500}>
                              {leads} leads
                            </Text>
                          </Group>
                          <Progress
                            value={percentage}
                            color={platformColors[p.platform]}
                            size='sm'
                            radius='xl'
                          />
                        </Box>
                      )
                    })}
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value='platforms' pt='md'>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing='lg'>
              {platformStats.map((platform) => (
                <Paper key={platform.platform} p='lg' radius='lg' shadow='sm'>
                  <Group justify='space-between' mb='md'>
                    <Group gap='sm'>
                      {platform.platform === 'instagram' && (
                        <IoLogoInstagram size={24} color='#E1306C' />
                      )}
                      {platform.platform === 'facebook' && (
                        <IoLogoFacebook size={24} color='#1877F2' />
                      )}
                      {platform.platform === 'linkedin' && (
                        <IoLogoLinkedin size={24} color='#0A66C2' />
                      )}
                      {platform.platform === 'twitter' && (
                        <IoLogoTwitter size={24} color='#1DA1F2' />
                      )}
                      <Text fw={600} size='lg'>
                        {platformNames[platform.platform]}
                      </Text>
                    </Group>
                    <Badge
                      color={platform.followersChange >= 0 ? 'green' : 'red'}
                      variant='light'
                    >
                      {platform.followersChange >= 0 ? '+' : ''}
                      {platform.followersChange}%
                    </Badge>
                  </Group>

                  <SimpleGrid cols={2} spacing='md'>
                    <Box>
                      <Text size='xs' c='dimmed'>
                        Seguidores
                      </Text>
                      <Text fw={600}>
                        {(platform.followers / 1000).toFixed(1)}K
                      </Text>
                    </Box>
                    <Box>
                      <Text size='xs' c='dimmed'>
                        Alcance
                      </Text>
                      <Text fw={600}>
                        {(platform.reach / 1000).toFixed(1)}K
                      </Text>
                    </Box>
                    <Box>
                      <Text size='xs' c='dimmed'>
                        Impresiones
                      </Text>
                      <Text fw={600}>
                        {(platform.impressions / 1000).toFixed(1)}K
                      </Text>
                    </Box>
                    <Box>
                      <Text size='xs' c='dimmed'>
                        Engagement
                      </Text>
                      <Text fw={600}>{platform.engagement}%</Text>
                    </Box>
                  </SimpleGrid>

                  <Divider my='md' />

                  <Group grow>
                    <Box ta='center'>
                      <IoHeart size={16} color='var(--mantine-color-pink-6)' />
                      <Text size='sm' fw={500}>
                        {(platform.likes / 1000).toFixed(1)}K
                      </Text>
                      <Text size='xs' c='dimmed'>
                        Likes
                      </Text>
                    </Box>
                    <Box ta='center'>
                      <IoChatbubble
                        size={16}
                        color='var(--mantine-color-blue-6)'
                      />
                      <Text size='sm' fw={500}>
                        {platform.comments}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        Comentarios
                      </Text>
                    </Box>
                    <Box ta='center'>
                      <IoShareSocial
                        size={16}
                        color='var(--mantine-color-green-6)'
                      />
                      <Text size='sm' fw={500}>
                        {platform.shares}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        Compartidos
                      </Text>
                    </Box>
                    {platform.saves && (
                      <Box ta='center'>
                        <IoBookmark
                          size={16}
                          color='var(--mantine-color-yellow-6)'
                        />
                        <Text size='sm' fw={500}>
                          {platform.saves}
                        </Text>
                        <Text size='xs' c='dimmed'>
                          Guardados
                        </Text>
                      </Box>
                    )}
                  </Group>
                </Paper>
              ))}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value='posts' pt='md'>
            <Paper radius='lg' shadow='sm'>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Publicación</Table.Th>
                    <Table.Th>Plataforma</Table.Th>
                    <Table.Th>Alcance</Table.Th>
                    <Table.Th>Likes</Table.Th>
                    <Table.Th>Comentarios</Table.Th>
                    <Table.Th>Compartidos</Table.Th>
                    <Table.Th>Engagement</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {mockPosts.map((post) => (
                    <Table.Tr key={post.id}>
                      <Table.Td>
                        <Text size='sm' lineClamp={1}>
                          {post.content}
                        </Text>
                        <Text size='xs' c='dimmed'>
                          {post.date}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {post.platform === 'instagram' && (
                          <IoLogoInstagram size={18} color='#E1306C' />
                        )}
                        {post.platform === 'facebook' && (
                          <IoLogoFacebook size={18} color='#1877F2' />
                        )}
                        {post.platform === 'linkedin' && (
                          <IoLogoLinkedin size={18} color='#0A66C2' />
                        )}
                        {post.platform === 'twitter' && (
                          <IoLogoTwitter size={18} color='#1DA1F2' />
                        )}
                      </Table.Td>
                      <Table.Td>{(post.reach / 1000).toFixed(1)}K</Table.Td>
                      <Table.Td>{(post.likes / 1000).toFixed(1)}K</Table.Td>
                      <Table.Td>{post.comments}</Table.Td>
                      <Table.Td>{post.shares}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            post.engagement >= 4
                              ? 'green'
                              : post.engagement >= 2
                                ? 'yellow'
                                : 'red'
                          }
                        >
                          {post.engagement}%
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value='leads' pt='md'>
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper p='lg' radius='lg' shadow='sm'>
                  <Text fw={600} mb='md'>
                    Resumen de Leads
                  </Text>
                  <Stack gap='md'>
                    <Group justify='space-between'>
                      <Text size='sm' c='dimmed'>
                        Total Leads
                      </Text>
                      <Text fw={600}>{totalLeads}</Text>
                    </Group>
                    <Group justify='space-between'>
                      <Text size='sm' c='dimmed'>
                        Nuevos
                      </Text>
                      <Badge color='blue'>
                        {mockLeads.filter((l) => l.status === 'new').length}
                      </Badge>
                    </Group>
                    <Group justify='space-between'>
                      <Text size='sm' c='dimmed'>
                        Contactados
                      </Text>
                      <Badge color='yellow'>
                        {
                          mockLeads.filter((l) => l.status === 'contacted')
                            .length
                        }
                      </Badge>
                    </Group>
                    <Group justify='space-between'>
                      <Text size='sm' c='dimmed'>
                        Calificados
                      </Text>
                      <Badge color='violet'>
                        {
                          mockLeads.filter((l) => l.status === 'qualified')
                            .length
                        }
                      </Badge>
                    </Group>
                    <Group justify='space-between'>
                      <Text size='sm' c='dimmed'>
                        Convertidos
                      </Text>
                      <Badge color='green'>{convertedLeads}</Badge>
                    </Group>
                    <Divider />
                    <Text size='sm' fw={600}>
                      Tasa de Conversión:{' '}
                      {((convertedLeads / totalLeads) * 100).toFixed(1)}%
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper radius='lg' shadow='sm'>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Lead</Table.Th>
                        <Table.Th>Plataforma</Table.Th>
                        <Table.Th>Campaña</Table.Th>
                        <Table.Th>Fecha</Table.Th>
                        <Table.Th>Estado</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockLeads.map((lead) => (
                        <Table.Tr key={lead.id}>
                          <Table.Td>
                            <Group gap='sm'>
                              <Avatar color='blue' radius='xl' size='sm'>
                                {lead.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Text size='sm' fw={500}>
                                  {lead.name}
                                </Text>
                                <Text size='xs' c='dimmed'>
                                  {lead.email}
                                </Text>
                              </Box>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            {lead.platform === 'instagram' && (
                              <IoLogoInstagram size={18} color='#E1306C' />
                            )}
                            {lead.platform === 'facebook' && (
                              <IoLogoFacebook size={18} color='#1877F2' />
                            )}
                            {lead.platform === 'linkedin' && (
                              <IoLogoLinkedin size={18} color='#0A66C2' />
                            )}
                          </Table.Td>
                          <Table.Td>
                            <Text size='sm'>{lead.campaign}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size='sm'>{lead.date}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge color={statusColors[lead.status]}>
                              {lead.status === 'new'
                                ? 'Nuevo'
                                : lead.status === 'contacted'
                                  ? 'Contactado'
                                  : lead.status === 'qualified'
                                    ? 'Calificado'
                                    : 'Convertido'}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value='campaigns' pt='md'>
            <Paper radius='lg' shadow='sm'>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Campaña</Table.Th>
                    <Table.Th>Plataforma</Table.Th>
                    <Table.Th>Impresiones</Table.Th>
                    <Table.Th>Clics</Table.Th>
                    <Table.Th>CTR</Table.Th>
                    <Table.Th>Leads</Table.Th>
                    <Table.Th>Costo</Table.Th>
                    <Table.Th>CPL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {mockCampaignPerformance.map((perf, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Text fw={500}>{perf.campaign}</Text>
                      </Table.Td>
                      <Table.Td>
                        {perf.platform === 'instagram' && (
                          <IoLogoInstagram size={18} color='#E1306C' />
                        )}
                        {perf.platform === 'facebook' && (
                          <IoLogoFacebook size={18} color='#1877F2' />
                        )}
                        {perf.platform === 'linkedin' && (
                          <IoLogoLinkedin size={18} color='#0A66C2' />
                        )}
                      </Table.Td>
                      <Table.Td>
                        {(perf.impressions / 1000).toFixed(1)}K
                      </Table.Td>
                      <Table.Td>{perf.clicks}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            perf.ctr >= 4
                              ? 'green'
                              : perf.ctr >= 2
                                ? 'yellow'
                                : 'red'
                          }
                        >
                          {perf.ctr}%
                        </Badge>
                      </Table.Td>
                      <Table.Td>{perf.leads}</Table.Td>
                      <Table.Td>${perf.cost}</Table.Td>
                      <Table.Td>
                        ${(perf.cost / perf.leads).toFixed(2)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  )
}
