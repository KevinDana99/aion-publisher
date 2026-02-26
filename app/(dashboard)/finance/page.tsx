'use client'

import { Box, Stack, Title, SimpleGrid, Group } from '@mantine/core'
import { IoWallet } from 'react-icons/io5'
import { 
  RevenueOverview, 
  PendingInvoices, 
  CashFlow,
  StatsGrid
} from '@/components/shared/widgets'

export default function FinancePage() {
  return (
    <Box p="xl" style={{ width: '100%' }}>
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
    </Box>
  )
}
