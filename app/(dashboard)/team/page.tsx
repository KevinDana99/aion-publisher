'use client'

import { Box, Stack, Title, SimpleGrid, Group } from '@mantine/core'
import { IoPeople } from 'react-icons/io5'
import { 
  OnlineMembers, 
  TeamActivity, 
  StatsSegments
} from '@/components/shared/widgets'

export default function TeamPage() {
  return (
    <Box p="xl" style={{ width: '100%' }}>
      <Stack gap="xl">
        <Group gap="xs" mb="sm">
          <IoPeople size={28} />
          <Title order={2}>Gestión de Equipo</Title>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <OnlineMembers />
          <TeamActivity />
          <StatsSegments />
        </SimpleGrid>
      </Stack>
    </Box>
  )
}
