'use client'

import { SimpleGrid, Box, Title } from '@mantine/core'
import LeadsOverview from '@/components/shared/widgets/LeadsOverview'
import RecentContacts from '@/components/shared/widgets/RecentContacts'
import PipelineDeals from '@/components/shared/widgets/PipelineDeals'
import CRMActivities from '@/components/shared/widgets/CRMActivities'

export default function CRMPage() {
  return (
    <Box>
      <Title order={2} mb='lg'>
        CRM
      </Title>

      <LeadsOverview />

      <SimpleGrid cols={{ base: 1, lg: 2 }} mt='md'>
        <RecentContacts />
        <CRMActivities />
      </SimpleGrid>

      <Box mt='md'>
        <PipelineDeals />
      </Box>
    </Box>
  )
}
