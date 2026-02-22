'use client'

import { Container, Stack, Title, SimpleGrid, Box } from '@mantine/core'
import { IoWallet, IoDocumentText } from 'react-icons/io5'
import { StatsGrid, StatsRing, StatsSegments, ProgressCard } from '@/components/dashboard'

export default function DashboardPage() {
  const today = new Date()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const daysLeft = Math.ceil((endOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Title order={2} mb="md">
          Resumen
        </Title>

        <StatsGrid />

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Box>
            <StatsRing />
          </Box>
          <ProgressCard
            title="Meta mensual"
            icon={<IoWallet size={20} />}
            current={5431}
            target={10000}
            daysLeft={daysLeft}
            color="blue"
          />
        </SimpleGrid>

        <StatsSegments />
      </Stack>
    </Container>
  )
}
