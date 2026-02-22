'use client'

import { Container, Stack, Title, SimpleGrid, Group } from '@mantine/core'
import { IoMegaphone } from 'react-icons/io5'
import { 
  CampaignPerformance, 
  UpcomingPosts, 
  PendingComments,
  StatsGrid
} from '@/components/dashboard'

export default function MarketingPage() {
  return (
    <Container size="xl" py="xl" fluid>
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
    </Container>
  )
}
