'use client'

import { Container, Stack, Title, SimpleGrid, Group } from '@mantine/core'
import { IoWallet } from 'react-icons/io5'
import { 
  RevenueOverview, 
  PendingInvoices, 
  CashFlow,
  StatsGrid
} from '@/components/dashboard'

export default function FinancePage() {
  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group gap="xs" mb="sm">
          <IoWallet size={28} />
          <Title order={2}>Gestión Financiera</Title>
        </Group>

        <StatsGrid />

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <RevenueOverview />
          <PendingInvoices />
          <CashFlow />
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
