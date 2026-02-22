'use client'

import { Suspense } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, Select, Tabs, ThemeIcon, RingProgress, Box, Badge, ActionIcon, UnstyledButton, Card, Divider } from '@mantine/core'
import { IoDocuments, IoAdd, IoDownload, IoEye, IoTime, IoCheckmarkCircle, IoCalendar } from 'react-icons/io5'

function ReportsLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

const recentReports = [
  { id: 1, name: 'Informe Mensual - Enero 2026', project: 'Campaña Alpha', status: 'completado', date: '2026-02-01' },
  { id: 2, name: 'Reporte de Avance Q1', project: 'Proyecto Beta', status: 'pendiente', date: '2026-02-15' },
  { id: 3, name: 'Análisis de Rendimiento', project: 'Cliente Gamma', status: 'completado', date: '2026-02-10' },
]

const templates = [
  { name: 'Informe de Avance', description: 'Reporte de progreso del proyecto', icon: IoTime },
  { name: 'Informe Final', description: 'Documento de cierre de proyecto', icon: IoCheckmarkCircle },
  { name: 'Informe Mensual', description: 'Resumen de actividades del mes', icon: IoCalendar },
]

function ReportsContent() {
  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoDocuments size={28} />
            <Title order={2}>Informes de Proyecto</Title>
          </Group>
          <Button leftSection={<IoAdd size={18} />}>
            Crear Informe
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Informes este mes</Text>
              <ThemeIcon variant="light" color="blue"><IoDocuments size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>12</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Pendientes</Text>
              <ThemeIcon variant="light" color="orange"><IoTime size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>3</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Completados</Text>
              <ThemeIcon variant="light" color="green"><IoCheckmarkCircle size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>9</Text>
          </Paper>
        </SimpleGrid>

        <Tabs defaultValue="recientes">
          <Tabs.List>
            <Tabs.Tab value="recientes">Recientes</Tabs.Tab>
            <Tabs.Tab value="plantillas">Plantillas</Tabs.Tab>
            <Tabs.Tab value="programados">Programados</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="recientes" pt="md">
            <Paper shadow="xs" radius="md">
              <Stack gap={0}>
                {recentReports.map((report, index) => (
                  <Box key={report.id}>
                    <Group justify="space-between" p="md">
                      <Group>
                        <ThemeIcon variant="light" color="blue">
                          <IoDocuments size={18} />
                        </ThemeIcon>
                        <Box>
                          <Text fw={500}>{report.name}</Text>
                          <Text size="sm" c="dimmed">{report.project}</Text>
                        </Box>
                      </Group>
                      <Group>
                        <Badge color={report.status === 'completado' ? 'green' : 'orange'} variant="light">
                          {report.status}
                        </Badge>
                        <Text size="sm" c="dimmed">{report.date}</Text>
                        <ActionIcon variant="subtle" color="blue"><IoEye size={18} /></ActionIcon>
                        <ActionIcon variant="subtle" color="gray"><IoDownload size={18} /></ActionIcon>
                      </Group>
                    </Group>
                    {index < recentReports.length - 1 && <Divider />}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="plantillas" pt="md">
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              {templates.map((template) => {
                const Icon = template.icon
                return (
                  <UnstyledButton key={template.name}>
                    <Paper
                      shadow="xs"
                      p="lg"
                      radius="md"
                      style={{
                        cursor: 'pointer',
                        transition: 'transform 150ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <Stack align="center" gap="md" ta="center">
                        <ThemeIcon size={50} radius="md" variant="light" color="blue">
                          <Icon size={26} />
                        </ThemeIcon>
                        <Text fw={600}>{template.name}</Text>
                        <Text size="sm" c="dimmed">{template.description}</Text>
                      </Stack>
                    </Paper>
                  </UnstyledButton>
                )
              })}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="programados" pt="md">
            <Paper shadow="xs" p="xl" radius="md">
              <Text c="dimmed" ta="center">
                No hay informes programados
              </Text>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsLoader />}>
      <ReportsContent />
    </Suspense>
  )
}