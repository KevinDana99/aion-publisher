'use client'

import { Suspense, useMemo, useState } from 'react'
import { Container, Stack, Title, SimpleGrid, Group, Divider, Center, Loader, ActionIcon, Paper, Box } from '@mantine/core'
import { IoWallet, IoMegaphone, IoAnalytics, IoFolder, IoPeople, IoSettings, IoChatbubble } from 'react-icons/io5'
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
  CashFlow,
  DashboardCalendarWidget,
  WidgetSettingsModal,
  CRMOverview
} from '@/components/shared/widgets'
import { useSettings } from '@/contexts/SettingsContext'

function DashboardLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

function DashboardContent() {
  const [settingsOpened, setSettingsOpened] = useState(false)
  const { settings } = useSettings()
  
  const daysLeft = useMemo(() => {
    const today = new Date()
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return Math.ceil((endOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }, [])

  const isWidgetEnabled = (id: string) => {
    return settings.widgets.find(w => w.id === id)?.enabled ?? true
  }

  const hasEnabledWidget = (ids: string[]) => {
    return ids.some(id => isWidgetEnabled(id))
  }

  const marketingWidgets = ['campaignPerformance', 'upcomingPosts', 'pendingComments']
  const analyticsWidgets = ['realTimeVisitors', 'topPages', 'statsRing']
  const projectWidgets = ['activeProjects', 'tasksOverview', 'progressCard']
  const teamWidgets = ['onlineMembers', 'teamActivity', 'statsSegments']
  const financeWidgets = ['revenueOverview', 'pendingInvoices', 'cashFlow']
  const crmWidgets = ['crmOverview']

  return (
    <Box style={{ width: '100%' }}>
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>Dashboard</Title>
          <Paper shadow="xs" radius="xl" style={{ background: 'var(--mantine-color-default)' }}>
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => setSettingsOpened(true)}
              aria-label="Configurar widgets"
            >
              <IoSettings size={20} />
            </ActionIcon>
          </Paper>
        </Group>

        {isWidgetEnabled('statsGrid') && <StatsGrid />}

        {hasEnabledWidget(crmWidgets) && (
          <>
            <Divider my="md" />
            <Group gap="xs" mb="sm">
              <IoChatbubble size={24} />
              <Title order={4}>CRM</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {isWidgetEnabled('crmOverview') && <CRMOverview />}
            </SimpleGrid>
          </>
        )}

        {isWidgetEnabled('calendarWidget') && (
          <SimpleGrid cols={{ base: 1 }} spacing="lg">
            <DashboardCalendarWidget />
          </SimpleGrid>
        )}

        {hasEnabledWidget(marketingWidgets) && (
          <>
            <Divider my="md" />
            <Group gap="xs" mb="sm">
              <IoMegaphone size={24} />
              <Title order={4}>Marketing y Publicidad</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {isWidgetEnabled('campaignPerformance') && <CampaignPerformance />}
              {isWidgetEnabled('upcomingPosts') && <UpcomingPosts />}
              {isWidgetEnabled('pendingComments') && <PendingComments />}
            </SimpleGrid>
          </>
        )}

        {hasEnabledWidget(analyticsWidgets) && (
          <>
            <Divider my="md" />
            <Group gap="xs" mb="sm">
              <IoAnalytics size={24} />
              <Title order={4}>Analíticas y Métricas</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {isWidgetEnabled('realTimeVisitors') && <RealTimeVisitors />}
              {isWidgetEnabled('topPages') && <TopPages />}
              {isWidgetEnabled('statsRing') && <StatsRing />}
            </SimpleGrid>
          </>
        )}

        {hasEnabledWidget(projectWidgets) && (
          <>
            <Divider my="md" />
            <Group gap="xs" mb="sm">
              <IoFolder size={24} />
              <Title order={4}>Gestión de Proyectos</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {isWidgetEnabled('activeProjects') && <ActiveProjects />}
              {isWidgetEnabled('tasksOverview') && <TasksOverview />}
              {isWidgetEnabled('progressCard') && (
                <ProgressCard
                  title="Meta mensual"
                  icon={<IoWallet size={20} />}
                  current={5431}
                  target={10000}
                  daysLeft={daysLeft}
                  color="blue"
                />
              )}
            </SimpleGrid>
          </>
        )}

        {hasEnabledWidget(teamWidgets) && (
          <>
            <Divider my="md" />
            <Group gap="xs" mb="sm">
              <IoPeople size={24} />
              <Title order={4}>Gestión de Equipo</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {isWidgetEnabled('onlineMembers') && <OnlineMembers />}
              {isWidgetEnabled('teamActivity') && <TeamActivity />}
              {isWidgetEnabled('statsSegments') && <StatsSegments />}
            </SimpleGrid>
          </>
        )}

        {hasEnabledWidget(financeWidgets) && (
          <>
            <Divider my="md" />
            <Group gap="xs" mb="sm">
              <IoWallet size={24} />
              <Title order={4}>Gestión Financiera</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {isWidgetEnabled('revenueOverview') && <RevenueOverview />}
              {isWidgetEnabled('pendingInvoices') && <PendingInvoices />}
              {isWidgetEnabled('cashFlow') && <CashFlow />}
            </SimpleGrid>
          </>
        )}
      </Stack>

      <WidgetSettingsModal opened={settingsOpened} onClose={() => setSettingsOpened(false)} />
    </Box>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <DashboardContent />
    </Suspense>
  )
}