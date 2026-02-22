'use client'

import { useState, useEffect } from 'react'
import { Container, Stack, Title, Group, Paper, Text, Switch, ThemeIcon, Divider, Badge, SimpleGrid, TextInput, PasswordInput, Modal, Button, Anchor } from '@mantine/core'
import { IoLogoInstagram, IoLogoFacebook, IoLogoTiktok, IoLogoTwitter, IoLogoLinkedin, IoLogoYoutube, IoLogoPinterest, IoLogoWhatsapp, IoCheckmarkCircle, IoSettings, IoSave, IoPulse } from 'react-icons/io5'
import { useSettings, Integration } from '@/contexts/SettingsContext'

const iconMap: Record<string, React.ReactNode> = {
  IoLogoInstagram: <IoLogoInstagram size={20} />,
  IoLogoFacebook: <IoLogoFacebook size={20} />,
  IoLogoTiktok: <IoLogoTiktok size={20} />,
  IoLogoTwitter: <IoLogoTwitter size={20} />,
  IoLogoLinkedin: <IoLogoLinkedin size={20} />,
  IoLogoYoutube: <IoLogoYoutube size={20} />,
  IoLogoPinterest: <IoLogoPinterest size={20} />,
  IoLogoWhatsapp: <IoLogoWhatsapp size={20} />
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const { updateIntegration } = useSettings()
  const [modalOpen, setModalOpen] = useState(false)
  const [tempConfig, setTempConfig] = useState({
    token: integration.token || '',
    apiKey: integration.apiKey || '',
    apiSecret: integration.apiSecret || '',
    webhookUrl: integration.webhookUrl || ''
  })

  const handleToggle = (enabled: boolean) => {
    updateIntegration(integration.id, { enabled })
    if (enabled && !integration.token && !integration.apiKey) {
      setModalOpen(true)
    }
  }

  const handleSave = () => {
    updateIntegration(integration.id, tempConfig)
    setModalOpen(false)
  }

  const handleOpenConfig = () => {
    setTempConfig({
      token: integration.token || '',
      apiKey: integration.apiKey || '',
      apiSecret: integration.apiSecret || '',
      webhookUrl: integration.webhookUrl || ''
    })
    setModalOpen(true)
  }

  return (
    <>
      <Paper 
        p="md" 
        radius="md" 
        style={{ 
          background: integration.enabled 
            ? 'light-dark(var(--mantine-color-teal-0), var(--mantine-color-dark-5))' 
            : 'var(--mantine-color-body)'
        }}
      >
        <Group justify="space-between">
          <Group gap="sm">
            <ThemeIcon 
              color={integration.enabled ? 'teal' : 'gray'} 
              variant="light" 
              size="lg" 
              radius="md"
            >
              {iconMap[integration.icon] || <IoSettings size={20} />}
            </ThemeIcon>
            <div>
              <Text fw={500}>{integration.name}</Text>
              <Text size="xs" c="dimmed">
                {integration.enabled 
                  ? integration.token || integration.apiKey 
                    ? 'Conectado' 
                    : 'Habilitado - Sin configurar'
                  : 'Deshabilitado'
                }
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            {integration.enabled && (integration.token || integration.apiKey) && (
              <Badge color="teal" variant="light" size="sm">
                <Group gap={4}>
                  <IoCheckmarkCircle size={12} />
                  <span>OK</span>
                </Group>
              </Badge>
            )}
            {integration.enabled && (
              <Anchor size="sm" onClick={handleOpenConfig}>
                Configurar
              </Anchor>
            )}
            <Switch
              checked={integration.enabled}
              onChange={(e) => handleToggle(e.currentTarget.checked)}
              size="md"
            />
          </Group>
        </Group>
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <Group gap="sm">
            <ThemeIcon color="blue" variant="light" size="lg" radius="md">
              {iconMap[integration.icon] || <IoSettings size={20} />}
            </ThemeIcon>
            <Text fw={600}>Configurar {integration.name}</Text>
          </Group>
        }
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Ingresa las credenciales de tu cuenta de {integration.name} para habilitar la integración.
          </Text>

          <Divider />

          <TextInput
            label="Token de acceso"
            placeholder="Ingresa tu token de acceso"
            value={tempConfig.token}
            onChange={(e) => setTempConfig(prev => ({ ...prev, token: e.target.value }))}
          />

          <SimpleGrid cols={2}>
            <TextInput
              label="API Key"
              placeholder="API Key"
              value={tempConfig.apiKey}
              onChange={(e) => setTempConfig(prev => ({ ...prev, apiKey: e.target.value }))}
            />
            <PasswordInput
              label="API Secret"
              placeholder="API Secret"
              value={tempConfig.apiSecret}
              onChange={(e) => setTempConfig(prev => ({ ...prev, apiSecret: e.target.value }))}
            />
          </SimpleGrid>

          <TextInput
            label="Webhook URL (opcional)"
            placeholder="https://tu-servidor.com/webhook"
            value={tempConfig.webhookUrl}
            onChange={(e) => setTempConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
          />

          <Divider />

          <Group justify="space-between">
            <Anchor size="sm" href="#" onClick={(e) => e.preventDefault()}>
              ¿Cómo obtener las credenciales?
            </Anchor>
            <Group>
              <Button variant="subtle" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button leftSection={<IoSave size={16} />} onClick={handleSave}>
                Guardar
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}

export default function IntegrationsPage() {
  const { settings } = useSettings()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const enabledCount = settings.integrations.filter(i => i.enabled).length
  const configuredCount = settings.integrations.filter(i => i.enabled && (i.token || i.apiKey)).length

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Group gap="xs" mb="sm">
              <IoPulse size={28} />
              <Title order={2}>Integraciones</Title>
            </Group>
            <Text size="sm" c="dimmed">
              Conecta tus redes sociales y plataformas para gestionarlas desde un solo lugar
            </Text>
          </div>
          <Group gap="sm">
            <Badge color="blue" size="lg">{enabledCount} habilitadas</Badge>
            <Badge color="teal" size="lg">{configuredCount} conectadas</Badge>
          </Group>
        </Group>

        <Divider />

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {settings.integrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </SimpleGrid>

        <Divider my="md" />

        <Paper p="md" radius="md" style={{ background: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))' }}>
          <Group gap="sm">
            <ThemeIcon color="blue" variant="light" size="lg" radius="md">
              <IoSettings size={20} />
            </ThemeIcon>
            <div style={{ flex: 1 }}>
              <Text fw={500}>¿Necesitas otra integración?</Text>
              <Text size="sm" c="dimmed">
                Solicita una nueva plataforma y la agregaremos a nuestra hoja de ruta.
              </Text>
            </div>
            <Button variant="light" size="sm">
              Solicitar
            </Button>
          </Group>
        </Paper>
      </Stack>
    </Container>
  )
}
