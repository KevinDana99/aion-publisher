'use client'

import { Container, Stack, Title, SimpleGrid, Group } from '@mantine/core'
import { IoAnalytics } from 'react-icons/io5'
import { 
  RealTimeVisitors, 
  TopPages, 
  StatsRing,
  StatsSegments
} from '@/components/shared/widgets'

export default function AnalyticsPage() {
  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group gap="xs" mb="sm">
          <IoAnalytics size={28} />
          <Title order={2}>Analíticas y Métricas</Title>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <RealTimeVisitors />
          <TopPages />
          <StatsRing />
        </SimpleGrid>

        <StatsSegments />
      </Stack>
    </Container>
  )
}
