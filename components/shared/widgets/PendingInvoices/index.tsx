'use client'

import { Paper, Text, Group, ThemeIcon, Stack, SimpleGrid, Badge, Avatar, ActionIcon } from '@mantine/core'
import { IoDocumentText, IoAlertCircle, IoCheckmarkCircle, IoTime, IoSend } from 'react-icons/io5'

const invoices = [
  { id: '#FAC-089', client: 'Tech Solutions', amount: '$2,450', status: 'pending', due: '5 Dic' },
  { id: '#FAC-088', client: 'Marketing Pro', amount: '$1,200', status: 'overdue', due: '28 Nov' },
  { id: '#FAC-087', client: 'Design Studio', amount: '$3,100', status: 'paid', due: '20 Nov' },
  { id: '#FAC-086', client: 'Dev Agency', amount: '$890', status: 'pending', due: '8 Dic' },
  { id: '#FAC-085', client: 'Cloud Services', amount: '$4,500', status: 'paid', due: '15 Nov' }
]

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: 'orange', icon: <IoTime size={14} />, label: 'Pendiente' },
  overdue: { color: 'red', icon: <IoAlertCircle size={14} />, label: 'Vencida' },
  paid: { color: 'teal', icon: <IoCheckmarkCircle size={14} />, label: 'Pagada' }
}

export default function PendingInvoices() {
  const totalPending = invoices
    .filter(i => i.status !== 'paid')
    .reduce((acc, i) => acc + parseFloat(i.amount.replace('$', '').replace(',', '')), 0)

  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Facturas Recientes</Text>
        <Badge color="orange" size="lg">
          ${totalPending.toLocaleString()} pendiente
        </Badge>
      </Group>

      <Stack gap="sm">
        {invoices.map((invoice) => (
          <Paper key={invoice.id} p="sm" radius="md" style={{ background: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))' }}>
            <Group justify="space-between">
            <Group gap="sm">
              <ThemeIcon 
                color={statusConfig[invoice.status].color} 
                variant="light" 
                size="lg" 
                radius="md"
              >
                {statusConfig[invoice.status].icon}
              </ThemeIcon>
              <div>
                <Text size="sm" fw={600}>{invoice.id}</Text>
                <Text size="xs" c="dimmed">{invoice.client}</Text>
              </div>
            </Group>
            <Group gap="sm">
              <div style={{ textAlign: 'right' }}>
                <Text size="sm" fw={600}>{invoice.amount}</Text>
                <Text size="xs" c="dimmed">Vence: {invoice.due}</Text>
              </div>
              {invoice.status !== 'paid' && (
                <ActionIcon color="blue" variant="light" size="md" radius="md">
                  <IoSend size={16} />
                </ActionIcon>
              )}
            </Group>
          </Group>
        </Paper>
        ))}
      </Stack>
    </Paper>
  )
}