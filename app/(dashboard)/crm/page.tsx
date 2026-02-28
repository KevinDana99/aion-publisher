'use client'

import { SimpleGrid, Box, Title } from '@mantine/core'
import dynamic from 'next/dynamic'

const LeadsOverview = dynamic(
  () => import('@/components/shared/widgets/LeadsOverview'),
  { ssr: false }
)

const RecentContacts = dynamic(
  () => import('@/components/shared/widgets/RecentContacts'),
  { ssr: false }
)

const PipelineDeals = dynamic(
  () => import('@/components/shared/widgets/PipelineDeals'),
  { ssr: false }
)

const CRMActivities = dynamic(
  () => import('@/components/shared/widgets/CRMActivities'),
  { ssr: false }
)

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
