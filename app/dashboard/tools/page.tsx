'use client'

import { Suspense } from 'react'
import { Container, Stack, Title, SimpleGrid, Center, Loader, Paper, Text, Group, ThemeIcon, UnstyledButton } from '@mantine/core'
import { IoDocumentText, IoCalculator, IoWallet, IoDocuments, IoArrowForward, IoVideocam } from 'react-icons/io5'
import Link from 'next/link'

function ToolsLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

const tools = [
  {
    id: 'invoicer',
    name: 'Facturador',
    description: 'Crea y gestiona facturas para tus clientes',
    icon: IoDocumentText,
    href: '/dashboard/tools/invoicer',
    color: 'blue'
  },
  {
    id: 'quoter',
    name: 'Cotizador',
    description: 'Genera cotizaciones profesionales rápidamente',
    icon: IoCalculator,
    href: '/dashboard/tools/quoter',
    color: 'green'
  },
  {
    id: 'budgeter',
    name: 'Presupuestador',
    description: 'Planifica presupuestos para proyectos',
    icon: IoWallet,
    href: '/dashboard/tools/budgeter',
    color: 'orange'
  },
  {
    id: 'reports',
    name: 'Informes de Proyecto',
    description: 'Crea informes detallados de proyectos',
    icon: IoDocuments,
    href: '/dashboard/tools/reports',
    color: 'violet'
  },
  {
    id: 'meetings',
    name: 'Reuniones',
    description: 'Agenda y gestiona reuniones con Calendly',
    icon: IoVideocam,
    href: '/dashboard/tools/meetings',
    color: 'teal'
  }
]

function ToolsContent() {
  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Title order={2}>Herramientas</Title>
        <Text c="dimmed">Herramientas diarias para la gestión de tu agencia</Text>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 2 }} spacing="lg">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <UnstyledButton key={tool.id} component={Link} href={tool.href}>
                <Paper
                  shadow="xs"
                  p="lg"
                  radius="md"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'var(--mantine-shadow-xs)'
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Group>
                      <ThemeIcon size={50} radius="md" variant="light" color={tool.color}>
                        <Icon size={26} />
                      </ThemeIcon>
                      <Stack gap={4}>
                        <Text fw={600} size="lg">{tool.name}</Text>
                        <Text size="sm" c="dimmed">{tool.description}</Text>
                      </Stack>
                    </Group>
                    <IoArrowForward size={20} style={{ opacity: 0.5 }} />
                  </Group>
                </Paper>
              </UnstyledButton>
            )
          })}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsLoader />}>
      <ToolsContent />
    </Suspense>
  )
}