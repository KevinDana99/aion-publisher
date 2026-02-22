'use client'

import { Suspense, useState } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, TextInput, NumberInput, Select, Textarea, Divider, Progress, RingProgress, ThemeIcon, Box, Badge } from '@mantine/core'
import { IoAdd, IoWallet, IoTrendingUp, IoTrendingDown, IoAlertCircle } from 'react-icons/io5'

function BudgeterLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

const mockBudgets = [
  { name: 'Campaña Marketing Q1', total: 50000, spent: 32000, category: 'Marketing' },
  { name: 'Rediseño Web Cliente X', total: 80000, spent: 65000, category: 'Proyecto' },
  { name: 'Producción Video', total: 25000, spent: 12000, category: 'Producción' },
]

function BudgeterContent() {
  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.total, 0)
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0)
  const percentage = Math.round((totalSpent / totalBudget) * 100)

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoWallet size={28} />
            <Title order={2}>Presupuestador</Title>
          </Group>
          <Button leftSection={<IoAdd size={18} />}>
            Nuevo Presupuesto
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="lg">
          <Paper shadow="xs" p="md" radius="md">
            <Text size="sm" c="dimmed">Presupuesto Total</Text>
            <Text size="xl" fw={700}>${totalBudget.toLocaleString()}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Text size="sm" c="dimmed">Gastado</Text>
            <Text size="xl" fw={700} c="orange">${totalSpent.toLocaleString()}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Text size="sm" c="dimmed">Disponible</Text>
            <Text size="xl" fw={700} c="green">${(totalBudget - totalSpent).toLocaleString()}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Text size="sm" c="dimmed">% Utilizado</Text>
            <Group gap="xs">
              <Text size="xl" fw={700}>{percentage}%</Text>
              {percentage > 80 && <IoAlertCircle size={20} color="var(--mantine-color-red-6)" />}
            </Group>
          </Paper>
        </SimpleGrid>

        <Paper shadow="xs" p="xl" radius="md">
          <Stack gap="lg">
            <Text fw={600} size="lg">Presupuestos Activos</Text>
            <Divider />
            
            {mockBudgets.map((budget, index) => {
              const percentage = Math.round((budget.spent / budget.total) * 100)
              const color = percentage > 90 ? 'red' : percentage > 70 ? 'orange' : 'blue'
              
              return (
                <Box key={index}>
                  <Group justify="space-between" mb="xs">
                    <Group>
                      <Text fw={500}>{budget.name}</Text>
                      <Badge variant="light">{budget.category}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      ${budget.spent.toLocaleString()} / ${budget.total.toLocaleString()}
                    </Text>
                  </Group>
                  <Progress value={percentage} color={color} size="lg" radius="xl" />
                  <Group justify="space-between" mt="xs">
                    <Text size="xs" c="dimmed">{percentage}% utilizado</Text>
                    <Text size="xs" c="dimmed">
                      ${(budget.total - budget.spent).toLocaleString()} disponible
                    </Text>
                  </Group>
                  {index < mockBudgets.length - 1 && <Divider mt="md" />}
                </Box>
              )
            })}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default function BudgeterPage() {
  return (
    <Suspense fallback={<BudgeterLoader />}>
      <BudgeterContent />
    </Suspense>
  )
}