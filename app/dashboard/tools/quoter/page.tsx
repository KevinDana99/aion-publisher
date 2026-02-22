'use client'

import { Suspense, useState } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, TextInput, NumberInput, Select, Textarea, Divider, Table, ActionIcon, Box, ThemeIcon, Tabs } from '@mantine/core'
import { IoAdd, IoTrash, IoDocumentText, IoCalculator, IoCopy } from 'react-icons/io5'

function QuoterLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

function QuoterContent() {
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: 'Diseño de logo', quantity: 1, unitPrice: 500 },
    { id: '2', description: 'Desarrollo web', quantity: 1, unitPrice: 2500 },
  ])

  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoCalculator size={28} />
            <Title order={2}>Cotizador</Title>
          </Group>
          <Group>
            <Button variant="light" leftSection={<IoCopy size={18} />}>Duplicar</Button>
            <Button leftSection={<IoDocumentText size={18} />}>Generar PDF</Button>
          </Group>
        </Group>

        <Tabs defaultValue="nueva">
          <Tabs.List>
            <Tabs.Tab value="nueva">Nueva Cotización</Tabs.Tab>
            <Tabs.Tab value="historial">Historial</Tabs.Tab>
            <Tabs.Tab value="plantillas">Plantillas</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="nueva" pt="md">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <Paper shadow="xs" p="md" radius="md">
                <Stack gap="md">
                  <Text fw={600}>Información del Cliente</Text>
                  <TextInput label="Nombre del cliente" placeholder="Empresa o persona" />
                  <TextInput label="Email" placeholder="cliente@email.com" />
                  <TextInput label="Teléfono" placeholder="+52 000 000 0000" />
                  <Textarea label="Dirección" placeholder="Dirección del cliente" rows={2} />
                </Stack>
              </Paper>

              <Paper shadow="xs" p="md" radius="md">
                <Stack gap="md">
                  <Text fw={600}>Detalles de Cotización</Text>
                  <TextInput label="Número de cotización" placeholder="COT-001" />
                  <Select label="Validez" data={['7 días', '15 días', '30 días', '60 días']} defaultValue="15 días" />
                  <Textarea label="Notas" placeholder="Notas adicionales..." rows={2} />
                </Stack>
              </Paper>
            </SimpleGrid>

            <Paper shadow="xs" p="md" radius="md" mt="lg">
              <Stack gap="md">
                <Group justify="space-between">
                  <Text fw={600}>Conceptos</Text>
                  <Button size="sm" variant="light" leftSection={<IoAdd size={16} />} onClick={addItem}>
                    Agregar concepto
                  </Button>
                </Group>

                <Divider />

                {items.map((item, index) => (
                  <Group key={item.id} align="flex-end" gap="sm">
                    <TextInput
                      style={{ flex: 2 }}
                      placeholder="Descripción del servicio"
                      defaultValue={item.description}
                    />
                    <NumberInput
                      style={{ width: 100 }}
                      label={index === 0 ? 'Cantidad' : undefined}
                      defaultValue={item.quantity}
                      min={1}
                    />
                    <NumberInput
                      style={{ width: 150 }}
                      label={index === 0 ? 'Precio unit.' : undefined}
                      defaultValue={item.unitPrice}
                      prefix="$"
                      min={0}
                    />
                    <NumberInput
                      style={{ width: 150 }}
                      label={index === 0 ? 'Subtotal' : undefined}
                      value={item.quantity * item.unitPrice}
                      prefix="$"
                      disabled
                    />
                    <ActionIcon color="red" variant="subtle" onClick={() => removeItem(item.id)}>
                      <IoTrash size={18} />
                    </ActionIcon>
                  </Group>
                ))}

                <Divider />

                <Group justify="flex-end">
                  <Stack gap="xs" align="flex-end">
                    <Text>Subtotal: <strong>${total.toLocaleString()}</strong></Text>
                    <Text>IVA (16%): <strong>${(total * 0.16).toLocaleString()}</strong></Text>
                    <Text size="lg">Total: <strong>${(total * 1.16).toLocaleString()}</strong></Text>
                  </Stack>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="historial" pt="md">
            <Paper shadow="xs" p="md" radius="md">
              <Text c="dimmed" ta="center" py="xl">
                Historial de cotizaciones aparecerá aquí
              </Text>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="plantillas" pt="md">
            <Paper shadow="xs" p="md" radius="md">
              <Text c="dimmed" ta="center" py="xl">
                Plantillas de cotización aparecerán aquí
              </Text>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
}

export default function QuoterPage() {
  return (
    <Suspense fallback={<QuoterLoader />}>
      <QuoterContent />
    </Suspense>
  )
}