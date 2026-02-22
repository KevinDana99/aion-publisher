'use client'

import { Container, Stack, Title, SimpleGrid, Box, Text, Group, Divider } from '@mantine/core'
import { IoWallet, IoMegaphone, IoAnalytics, IoFolder, IoPeople } from 'react-icons/io5'
import { 
  StatsGrid, 
  StatsRing, 
  StatsSegments, 
  ProgressCard,
  CampaignPerformance,
  UpcomingPosts,
  PendingComments,
  RealTimeVisitors,
  TopPages,
  ActiveProjects,
  TasksOverview,
  OnlineMembers,
  TeamActivity,
  RevenueOverview,
  PendingInvoices,
  CashFlow
} from '@/components/dashboard'

export default function DashboardPage() {
  const today = new Date()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const daysLeft = Math.ceil((endOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Title order={2} mb="md">
          Dashboard
        </Title>

        <StatsGrid />

        <Divider my="md" />

        {/* Marketing y Publicidad */}
        <Group gap="xs" mb="sm">
          <IoMegaphone size={24} />
          <Title order={4}>Marketing y Publicidad</Title>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <CampaignPerformance />
          <UpcomingPosts />
          <PendingComments />
        </SimpleGrid>

        <Divider my="md" />

        {/* Analíticas y Métricas */}
        <Group gap="xs" mb="sm">
          <IoAnalytics size={24} />
          <Title order={4}>Analíticas y Métricas</Title>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <RealTimeVisitors />
          <TopPages />
          <StatsRing />
        </SimpleGrid>

        <Divider my="md" />

        {/* Gestión de Proyectos */}
        <Group gap="xs" mb="sm">
          <IoFolder size={24} />
          <Title order={4}>Gestión de Proyectos</Title>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <ActiveProjects />
          <TasksOverview />
          <ProgressCard
            title="Meta mensual"
            icon={<IoWallet size={20} />}
            current={5431}
            target={10000}
            daysLeft={daysLeft}
            color="blue"
          />
        </SimpleGrid>

        <Divider my="md" />

        {/* Gestión de Equipo */}
        <Group gap="xs" mb="sm">
          <IoPeople size={24} />
          <Title order={4}>Gestión de Equipo</Title>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <OnlineMembers />
          <TeamActivity />
          <StatsSegments />
        </SimpleGrid>

        <Divider my="md" />

        {/* Gestión Financiera */}
        <Group gap="xs" mb="sm">
          <IoWallet size={24} />
          <Title order={4}>Gestión Financiera</Title>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <RevenueOverview />
          <PendingInvoices />
          <CashFlow />
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
