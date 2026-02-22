'use client'

import { Suspense } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, TextInput, NumberInput, Select, Textarea, Divider, Table, Badge, ActionIcon, Box } from '@mantine/core'
import { IoAdd, IoTrash, IoDownload, IoPrint, IoDocumentText } from 'react-icons/io5'
import { useDisclosure } from '@mantine/hooks'

function InvoicerLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

const mockInvoices = [
  { id: 'FAC-001', client: 'Cliente Alpha', date: '2026-02-20', total: 2500, status: 'pagada' },
  { id: 'FAC-002', client: 'Beta Corp', date: '2026-02-18', total: 4800, status: 'pendiente' },
  { id: 'FAC-003', client: 'Gamma Studios', date: '2026-02-15', total: 1200, status: 'vencida' },
]

function InvoicerContent() {
  const statusColors: Record<string, string> = {
    pagada: 'green',
    pendiente: 'yellow',
    vencida: 'red'
  }

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoDocumentText size={28} />
            <Title order={2}>Facturador</Title>
          </Group>
          <Button leftSection={<IoAdd size={18} />}>
            Nueva Factura
          </Button>
        </Group>

        <Paper shadow="xs" p="md" radius="md">
          <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
            <TextInput label="Buscar" placeholder="Buscar factura..." />
            <Select label="Estado" placeholder="Todos" data={['Todos', 'Pagada', 'Pendiente', 'Vencida']} />
            <TextInput label="Cliente" placeholder="Nombre del cliente" />
            <Select label="Ordenar" data={['Más reciente', 'Más antigua', 'Mayor monto', 'Menor monto']} />
          </SimpleGrid>
        </Paper>

        <Paper shadow="xs" radius="md">
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nº Factura</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {mockInvoices.map((invoice) => (
                <Table.Tr key={invoice.id}>
                  <Table.Td><Text fw={500}>{invoice.id}</Text></Table.Td>
                  <Table.Td>{invoice.client}</Table.Td>
                  <Table.Td>{invoice.date}</Table.Td>
                  <Table.Td>${invoice.total.toLocaleString()}</Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[invoice.status]} variant="light">
                      {invoice.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue"><IoDownload size={18} /></ActionIcon>
                      <ActionIcon variant="subtle" color="gray"><IoPrint size={18} /></ActionIcon>
                      <ActionIcon variant="subtle" color="red"><IoTrash size={18} /></ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </Container>
  )
}

export default function InvoicerPage() {
  return (
    <Suspense fallback={<InvoicerLoader />}>
      <InvoicerContent />
    </Suspense>
  )
}