'use client'

import { Modal, Stack, Group, Text, Switch, Divider, Button, Box } from '@mantine/core'
import { IoSettings, IoMegaphone, IoAnalytics, IoFolder, IoPeople, IoWallet, IoGrid } from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'

interface WidgetSettingsModalProps {
  opened: boolean
  onClose: () => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  general: <IoGrid size={18} />,
  marketing: <IoMegaphone size={18} />,
  analytics: <IoAnalytics size={18} />,
  projects: <IoFolder size={18} />,
  team: <IoPeople size={18} />,
  finance: <IoWallet size={18} />
}

const categoryNames: Record<string, string> = {
  general: 'General',
  marketing: 'Marketing y Publicidad',
  analytics: 'Analíticas y Métricas',
  projects: 'Gestión de Proyectos',
  team: 'Gestión de Equipo',
  finance: 'Gestión Financiera'
}

export function WidgetSettingsModal({ opened, onClose }: WidgetSettingsModalProps) {
  const { settings, updateWidget, resetSettings } = useSettings()

  const categories = ['general', 'marketing', 'analytics', 'projects', 'team', 'finance']

  const handleToggle = (widgetId: string, enabled: boolean) => {
    updateWidget(widgetId, { enabled })
  }

  const handleReset = () => {
    resetSettings()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IoSettings size={20} />
          <Text fw={600}>Configurar Widgets</Text>
        </Group>
      }
      size="lg"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Activa o desactiva los widgets que deseas ver en el dashboard.
        </Text>

        {categories.map(category => {
          const categoryWidgets = settings.widgets.filter(w => w.category === category)
          if (categoryWidgets.length === 0) return null

          return (
            <Box key={category}>
              <Group gap="xs" mb="xs">
                {categoryIcons[category]}
                <Text fw={500} size="sm">{categoryNames[category]}</Text>
              </Group>
              <Stack gap="xs">
                {categoryWidgets.map(widget => (
                  <Group key={widget.id} justify="space-between" wrap="nowrap">
                    <Text size="sm">{widget.name}</Text>
                    <Switch
                      checked={widget.enabled}
                      onChange={(e) => handleToggle(widget.id, e.currentTarget.checked)}
                      aria-label={`Toggle ${widget.name}`}
                    />
                  </Group>
                ))}
              </Stack>
              <Divider my="sm" />
            </Box>
          )
        })}

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={handleReset}>
            Restaurar por defecto
          </Button>
          <Button onClick={onClose}>
            Listo
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}