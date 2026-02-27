'use client'

import { useState, useEffect } from 'react'
import { Container, Stack, Title, Group, Paper, Text, Switch, ThemeIcon, Divider, Badge, SimpleGrid, TextInput, PasswordInput, Modal, Button, Anchor, Box } from '@mantine/core'
import { IoLogoInstagram, IoLogoFacebook, IoLogoTiktok, IoLogoTwitter, IoLogoLinkedin, IoLogoYoutube, IoLogoPinterest, IoLogoWhatsapp, IoCheckmarkCircle, IoSettings, IoSave, IoPulse, IoCalendar, IoLogoGithub, IoLogIn, IoCloseCircle } from 'react-icons/io5'
import { useSettings, Integration } from '@/contexts/SettingsContext'
import { useInstagram } from '@/lib/instagram/context'

const iconMap: Record<string, React.ReactNode> = {
  IoLogoInstagram: <IoLogoInstagram size={20} />,
  IoLogoFacebook: <IoLogoFacebook size={20} />,
  IoLogoTiktok: <IoLogoTiktok size={20} />,
  IoLogoTwitter: <IoLogoTwitter size={20} />,
  IoLogoLinkedin: <IoLogoLinkedin size={20} />,
  IoLogoYoutube: <IoLogoYoutube size={20} />,
  IoLogoPinterest: <IoLogoPinterest size={20} />,
  IoLogoWhatsapp: <IoLogoWhatsapp size={20} />,
  IoCalendar: <IoCalendar size={20} />,
  IoLogoGithub: <IoLogoGithub size={20} />
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const { updateIntegration } = useSettings()
  const instagram = useInstagram()
  const [modalOpen, setModalOpen] = useState(false)
  const [instagramAppConfigured, setInstagramAppConfigured] = useState(false)
  const [instagramConnected, setInstagramConnected] = useState(false)
  const [tempConfig, setTempConfig] = useState({
    token: integration.token || '',
    apiKey: integration.apiKey || '',
    apiSecret: integration.apiSecret || '',
    webhookUrl: integration.webhookUrl || ''
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('instagram_connected') === 'true') {
      localStorage.setItem('instagram_connected', 'true')
      window.history.replaceState({}, '', '/settings/integrations')
    }
    
    setInstagramConnected(localStorage.getItem('instagram_connected') === 'true')
  }, [])

  useEffect(() => {
    const checkInstagramConfig = async () => {
      try {
        const res = await fetch('/api/instagram/config')
        const data = await res.json()
        if (data.clientId) {
          setInstagramAppConfigured(true)
        }
      } catch (e) {
        console.error('Error checking Instagram config:', e)
      }
    }
    checkInstagramConfig()
  }, [])

  const isCalendly = integration.id === 'calendly'
  const isGithub = integration.id === 'github'
  const isInstagram = integration.id === 'instagram'

  const handleInstagramConnect = async () => {
    try {
      const res = await fetch('/api/instagram/config')
      const config = await res.json()
      
      if (!config.clientId) {
        alert('Primero guarda la configuración de la app')
        return
      }
      
      const redirectUri = 'https://4e43-216-244-247-162.ngrok-free.app/api/auth/callback/instagram'
      const scope = 'instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments'
      
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`
      
      console.log('Instagram Auth URL:', authUrl)
      window.location.href = authUrl
    } catch (e) {
      console.error('Error:', e)
      alert('Error al obtener configuración')
    }
  }

  const handleInstagramDisconnect = async () => {
    try {
      await fetch('/api/instagram/auth', { method: 'DELETE' })
      localStorage.setItem('instagram_connected', 'false')
      setInstagramConnected(false)
      window.location.reload()
    } catch (e) {
      console.error('Error disconnecting:', e)
    }
  }

  const isInstagramConnected = instagramConnected

  const handleToggle = (enabled: boolean) => {
    updateIntegration(integration.id, { enabled })
    if (enabled && !integration.token && !integration.apiKey && !integration.webhookUrl) {
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

  const handleInstagramSaveConfig = async () => {
    try {
      const redirectUri = 'https://4e43-216-244-247-162.ngrok-free.app/api/auth/callback/instagram'
      
      await fetch('/api/instagram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: tempConfig.apiKey,
          clientSecret: tempConfig.apiSecret,
          verifyToken: tempConfig.webhookUrl,
          redirectUri
        })
      })
      
      updateIntegration(integration.id, tempConfig)
      setInstagramAppConfigured(true)
      setModalOpen(false)
    } catch (error) {
      console.error('Error saving Instagram config:', error)
    }
  }

  const isConnected = isCalendly 
    ? integration.token && integration.webhookUrl
    : isGithub 
      ? integration.token
      : isInstagram
        ? instagramConnected
        : (integration.token || integration.apiKey)

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
        <Box>
          <Group justify="flex-end">
            {isInstagram && integration.enabled && isInstagramConnected && (
              <Text size="xs" c="teal" fw={500} mb={5}>
                @{instagram.username || 'conectado'}
              </Text>
            )}
          </Group>
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
                    ? isInstagram 
                      ? (isInstagramConnected ? 'Conectado' : 'Habilitado - Sin configurar')
                      : (isConnected ? 'Conectado' : 'Habilitado - Sin configurar')
                    : 'Deshabilitado'
                  }
                </Text>
              </div>
            </Group>
            <Group gap="xs">
              {isInstagram && integration.enabled && (
                <Button 
                  size="xs" 
                  variant={isInstagramConnected ? "outline" : "filled"}
                  color={isInstagramConnected ? "red" : "blue"}
                  onClick={isInstagramConnected ? handleInstagramDisconnect : handleInstagramConnect}
                >
                  {isInstagramConnected ? "Desconectar" : "Conectar"}
                </Button>
              )}
              {integration.enabled && isConnected && !isInstagram && (
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
        </Box>
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
          {isCalendly ? (
            <>
              <Text size="sm" c="dimmed">
                Configura tu integración con Calendly para sincronizar reuniones automáticamente.
              </Text>

              <Divider />

              <PasswordInput
                label="Token de Acceso (OAuth)"
                placeholder="Ingresa tu token de acceso de Calendly"
                value={tempConfig.token}
                onChange={(e) => setTempConfig(prev => ({ ...prev, token: e.target.value }))}
                description="Token OAuth de Calendly para acceder a la API"
              />

              <TextInput
                label="URL de Calendly"
                placeholder="https://calendly.com/tu-usuario"
                value={tempConfig.webhookUrl}
                onChange={(e) => setTempConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                description="Tu URL pública de Calendly para generar enlaces de reunión"
              />

              <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-gray-0)' }}>
                <Text size="xs" c="dimmed">
                  <strong>Cómo obtener tu token de Calendly:</strong><br />
                  1. Ve a calendly.com/integrations/api_webhooks<br />
                  2. Copia tu API Token o genera uno nuevo en "Integrations"<br />
                  3. Pega el token aquí y guarda la configuración
                </Text>
              </Paper>
            </>
          ) : isGithub ? (
            <>
              <Text size="sm" c="dimmed">
                Conecta tu cuenta de GitHub para sincronizar tus repositorios y proyectos.
              </Text>

              <Divider />

              <PasswordInput
                label="Personal Access Token"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={tempConfig.token}
                onChange={(e) => setTempConfig(prev => ({ ...prev, token: e.target.value }))}
                description="Token de acceso personal con permisos de repo"
              />

              <TextInput
                label="Organización (opcional)"
                placeholder="nombre-de-tu-organizacion"
                value={tempConfig.webhookUrl}
                onChange={(e) => setTempConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                description="Nombre de la organización para filtrar repositorios"
              />

              <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-gray-0)' }}>
                <Text size="xs" c="dimmed">
                  <strong>Cómo obtener un Personal Access Token:</strong><br />
                  1. Ve a GitHub.com → Settings → Developer settings<br />
                  2. Personal access tokens → Tokens (classic)<br />
                  3. Generate new token con scope &quot;repo&quot;<br />
                  4. Copia el token y pégalo aquí
                </Text>
              </Paper>
            </>
          ) : isInstagram ? (
            <>
              <Text size="sm" c="dimmed">
                Configura tu app de Instagram y conecta tu cuenta para recibir mensajes.
              </Text>

              <Divider />

              <TextInput
                label="App ID (Client ID)"
                placeholder="1591223445959501"
                value={tempConfig.apiKey}
                onChange={(e) => setTempConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                description="Tu Instagram App ID de Meta for Developers"
              />

              <PasswordInput
                label="App Secret (Client Secret)"
                placeholder="91b5c75fd740e36fa2405fdf3b2c3fe9"
                value={tempConfig.apiSecret}
                onChange={(e) => setTempConfig(prev => ({ ...prev, apiSecret: e.target.value }))}
                description="Tu Instagram App Secret de Meta for Developers"
              />

              <PasswordInput
                label="Verify Token"
                placeholder="mi_token_secreto_123"
                value={tempConfig.webhookUrl}
                onChange={(e) => setTempConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                description="Token que usarás en Meta for Developers (crea uno random)"
              />

              <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-blue-0)' }}>
                <Text size="xs" c="dimmed">
                  <strong>Tu Webhook URL:</strong><br />
                  <code>{typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/instagram</code>
                </Text>
              </Paper>

              <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-green-0)' }}>
                <Text size="xs" c="dimmed">
                  <strong>Redirect URI (configuralo en Meta):</strong><br />
                  <code>{typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback/instagram</code>
                </Text>
              </Paper>

              <Divider />

              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  Guardar configuración
                </Text>
                <Group>
                  <Button variant="subtle" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button leftSection={<IoSave size={16} />} onClick={handleInstagramSaveConfig}>
                    Guardar
                  </Button>
                </Group>
              </Group>
            </>
          ) : (
            <>
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
            </>
          )}

          {!isInstagram && <Divider />}

          {!isInstagram && (
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
          )}
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
