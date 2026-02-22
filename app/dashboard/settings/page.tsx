'use client'

import { Container, Stack, Title, Paper, Text, Group, Switch, SimpleGrid, ThemeIcon, Divider } from '@mantine/core'
import { IoSettings, IoNotifications, IoMoon, IoLanguage, IoShield, IoColorPalette } from 'react-icons/io5'

export default function SettingsPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group gap="xs" mb="sm">
          <IoSettings size={28} />
          <Title order={2}>Configuración</Title>
        </Group>

        <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
          <Stack gap="lg">
            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                  <IoMoon size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Tema oscuro</Text>
                  <Text size="sm" c="dimmed">Cambiar entre modo claro y oscuro</Text>
                </div>
              </Group>
              <Switch size="lg" />
            </Group>

            <Divider />

            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon color="violet" variant="light" size="lg" radius="md">
                  <IoNotifications size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Notificaciones</Text>
                  <Text size="sm" c="dimmed">Recibir notificaciones por email</Text>
                </div>
              </Group>
              <Switch size="lg" defaultChecked />
            </Group>

            <Divider />

            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon color="teal" variant="light" size="lg" radius="md">
                  <IoLanguage size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Idioma</Text>
                  <Text size="sm" c="dimmed">Seleccionar idioma de la interfaz</Text>
                </div>
              </Group>
              <Text c="dimmed">Español</Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon color="orange" variant="light" size="lg" radius="md">
                  <IoShield size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Seguridad</Text>
                  <Text size="sm" c="dimmed">Autenticación de dos factores</Text>
                </div>
              </Group>
              <Switch size="lg" />
            </Group>

            <Divider />

            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon color="pink" variant="light" size="lg" radius="md">
                  <IoColorPalette size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Widgets del Dashboard</Text>
                  <Text size="sm" c="dimmed">Personalizar widgets visibles</Text>
                </div>
              </Group>
              <Text c="blue" fw={500} style={{ cursor: 'pointer' }}>Configurar</Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
