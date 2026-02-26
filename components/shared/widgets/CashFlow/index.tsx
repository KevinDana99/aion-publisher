'use client'

import { Paper, Text, Group, ThemeIcon, Stack, SimpleGrid, Badge, Progress } from '@mantine/core'
import { IoTrendingUp, IoTrendingDown, IoCash, IoArrowUp, IoArrowDown } from 'react-icons/io5'

const cashFlow = [
  { month: 'Ene', income: 12000, expense: 8000 },
  { month: 'Feb', income: 15000, expense: 9500 },
  { month: 'Mar', income: 18000, expense: 11000 },
  { month: 'Abr', income: 14000, expense: 10000 },
  { month: 'May', income: 22000, expense: 12000 },
  { month: 'Jun', income: 25000, expense: 14000 }
]

export default function CashFlow() {
  const maxAmount = Math.max(...cashFlow.map(c => Math.max(c.income, c.expense)))
  const lastMonth = cashFlow[cashFlow.length - 1]
  const balance = lastMonth.income - lastMonth.expense

  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Flujo de Caja</Text>
        <Group gap="xs">
          <IoCash size={20} />
          <Text fw={700} c="teal">+${balance.toLocaleString()}</Text>
        </Group>
      </Group>

      <SimpleGrid cols={2} mb="md">
        <Paper p="sm" radius="md" style={{ background: 'rgba(64, 192, 87, 0.1)' }}>
          <Group gap="xs">
            <IoArrowUp size={16} color="var(--mantine-color-teal-6)" />
            <Text size="xs" c="dimmed">Ingresos</Text>
          </Group>
          <Text size="lg" fw={700} c="teal">${lastMonth.income.toLocaleString()}</Text>
        </Paper>
        <Paper p="sm" radius="md" style={{ background: 'rgba(250, 82, 82, 0.1)' }}>
          <Group gap="xs">
            <IoArrowDown size={16} color="var(--mantine-color-red-6)" />
            <Text size="xs" c="dimmed">Egresos</Text>
          </Group>
          <Text size="lg" fw={700} c="red">${lastMonth.expense.toLocaleString()}</Text>
        </Paper>
      </SimpleGrid>

      <Stack gap="xs">
        {cashFlow.map((month) => (
          <Group key={month.month} justify="space-between">
            <Text size="sm" c="dimmed" style={{ width: 40 }}>{month.month}</Text>
            <div style={{ flex: 1, display: 'flex', gap: 4 }}>
              <Progress 
                value={(month.income / maxAmount) * 100} 
                size="sm" 
                radius="xl" 
                color="teal" 
                style={{ flex: 1 }}
              />
              <Progress 
                value={(month.expense / maxAmount) * 100} 
                size="sm" 
                radius="xl" 
                color="red" 
                style={{ flex: 1 }}
              />
            </div>
          </Group>
        ))}
      </Stack>
    </Paper>
  )
}