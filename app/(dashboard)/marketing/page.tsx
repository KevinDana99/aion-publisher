'use client'

import { Box, Stack, Title, SimpleGrid, Group } from '@mantine/core'
import { IoMegaphone } from 'react-icons/io5'
import {
  CampaignPerformance,
  UpcomingPosts,
  PendingComments,
  StatsGrid
} from '@/components/shared/widgets'

export default function MarketingPage() {
  return (
    <Box p="xl" style={{ width: '100%' }}>
      <Stack gap="xl">
        <Group gap="xs" mb="sm">
          <IoMegaphone size={28} />
          <Title order={2}>Marketing y Publicidad</Title>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <CampaignPerformance />
          <UpcomingPosts />
          <PendingComments />
        </SimpleGrid>
      </Stack>
    </Box>
  )
}
