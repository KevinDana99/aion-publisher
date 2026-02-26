'use client'

import { useState, useEffect } from 'react'
import { 
  Paper, 
  Text, 
  Group, 
  Switch, 
  Stack, 
  Select,
  ThemeIcon,
  Divider,
  Button,
  Container,
  Title
} from '@mantine/core'
import { 
  IoMoon, 
  IoNotifications, 
  IoLanguage, 
  IoShield, 
  IoColorPalette,
  IoSettings
} from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'

export default function GeneralSettings() {
  const { settings, updateSettings } = useSettings()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Stack gap="lg">
      <Group gap="xs" mb="sm">
        <IoSettings size={28} />
        <Title order={2}>Configuración General</Title>
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
            <Select
              value={settings.theme}
              onChange={(value) => updateSettings({ theme: value as 'light' | 'dark' | 'auto' })}
              data={[
                { value: 'light', label: 'Claro' },
                { value: 'dark', label: 'Oscuro' },
                { value: 'auto', label: 'Automático' }
              ]}
              size="sm"
              style={{ width: 140 }}
            />
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
            <Switch
              size="lg"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.currentTarget.checked })}
            />
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
            <Select
              value={settings.language}
              onChange={(value) => updateSettings({ language: value || 'es' })}
              data={[
                { value: 'es', label: 'Español' },
                { value: 'en', label: 'English' },
                { value: 'pt', label: 'Português' }
              ]}
              size="sm"
              style={{ width: 140 }}
            />
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
            <Switch
              size="lg"
              checked={settings.twoFactor}
              onChange={(e) => updateSettings({ twoFactor: e.currentTarget.checked })}
            />
          </Group>
        </Stack>
      </Paper>
    </Stack>
  )
}
