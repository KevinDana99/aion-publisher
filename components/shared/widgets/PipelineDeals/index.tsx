'use client'

import { Box, Paper, Text, Group, Badge, Progress, Stack, useMantineColorScheme } from '@mantine/core'

interface Deal {
  id: string
  name: string
  value: number
  company: string
}

interface PipelineStage {
  id: string
  name: string
  color: string
  deals: Deal[]
}

const pipelineData: PipelineStage[] = [
  {
    id: 'new',
    name: 'Nuevos',
    color: 'blue',
    deals: [
      { id: '1', name: 'Plan Enterprise', value: 12000, company: 'TechCorp' },
      { id: '2', name: 'Consultoría', value: 5000, company: 'StartUp XYZ' }
    ]
  },
  {
    id: 'contacted',
    name: 'Contactados',
    color: 'yellow',
    deals: [
      { id: '3', name: 'Plan Premium', value: 8000, company: 'MediaLab' }
    ]
  },
  {
    id: 'proposal',
    name: 'Propuesta',
    color: 'orange',
    deals: [
      { id: '4', name: 'Diseño UI/UX', value: 15000, company: 'RetailMax' },
      { id: '5', name: 'Desarrollo Web', value: 25000, company: 'HealthPlus' }
    ]
  },
  {
    id: 'negotiation',
    name: 'Negociación',
    color: 'grape',
    deals: [
      { id: '6', name: 'App Móvil', value: 35000, company: 'FinanceApp' }
    ]
  },
  {
    id: 'closed',
    name: 'Cerrados',
    color: 'teal',
    deals: [
      { id: '7', name: 'SEO Package', value: 3000, company: 'Café Local' }
    ]
  }
]

export default function PipelineDeals() {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const totalValue = pipelineData.reduce((acc, stage) => 
    acc + stage.deals.reduce((sum, deal) => sum + deal.value, 0), 0
  )

  const stageBg = isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-0)'
  const dealCardBg = isDark ? 'var(--mantine-color-dark-6)' : 'white'
  const totalBg = isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-blue-light)'

  return (
    <Paper p="md" radius="lg" shadow="sm" style={{ background: isDark ? 'var(--mantine-color-dark-6)' : 'white' }}>
      <Text fw={700} size="lg" mb="md">Pipeline de Ventas</Text>
      <Group align="flex-start" gap="md" wrap="nowrap" style={{ overflowX: 'auto' }}>
        {pipelineData.map((stage) => {
          const stageValue = stage.deals.reduce((sum, deal) => sum + deal.value, 0)
          const percentage = totalValue > 0 ? (stageValue / totalValue) * 100 : 0

          return (
            <Paper
              key={stage.id}
              p="sm"
              radius="md"
              style={{ minWidth: 180, flex: 1, background: stageBg }}
            >
              <Group justify="space-between" mb="sm">
                <Text fw={600} size="sm">{stage.name}</Text>
                <Badge size="sm" variant="light" color={stage.color}>
                  {stage.deals.length}
                </Badge>
              </Group>
              
              <Text fw={700} size="lg" mb="xs">
                ${stageValue.toLocaleString()}
              </Text>
              
              <Progress 
                value={percentage} 
                color={stage.color} 
                size="sm" 
                mb="sm" 
              />

              <Stack gap={4}>
                {stage.deals.slice(0, 3).map((deal) => (
                  <Box key={deal.id} p={8} style={{ background: dealCardBg, borderRadius: 6 }}>
                    <Text size="xs" fw={500} lineClamp={1}>{deal.name}</Text>
                    <Text size="xs" c="dimmed">{deal.company}</Text>
                  </Box>
                ))}
                {stage.deals.length > 3 && (
                  <Text size="xs" c="dimmed" ta="center">
                    +{stage.deals.length - 3} más
                  </Text>
                )}
              </Stack>
            </Paper>
          )
        })}
      </Group>

      <Box mt="md" p="md" style={{ background: totalBg, borderRadius: 8 }}>
        <Group justify="space-between">
          <Text size="sm" fw={500}>Total Pipeline</Text>
          <Text size="lg" fw={700}>${totalValue.toLocaleString()}</Text>
        </Group>
      </Box>
    </Paper>
  )
}
