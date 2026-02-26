'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Box,
  Title,
  Tooltip,
  UnstyledButton,
  Text,
  Stack,
  useMantineTheme
} from '@mantine/core'
import {
  IoHomeOutline,
  IoMegaphoneOutline,
  IoAnalyticsOutline,
  IoFolderOutline,
  IoPeopleOutline,
  IoWalletOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoConstructOutline,
  IoHome,
  IoMegaphone,
  IoAnalytics,
  IoFolder,
  IoPeople,
  IoWallet,
  IoSettings,
  IoConstruct,
  IoChatbubble,
  IoChatbubbleOutline
} from 'react-icons/io5'

const mainLinksMockdata = [
  {
    icon: IoHomeOutline,
    activeIcon: IoHome,
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    icon: IoMegaphoneOutline,
    activeIcon: IoMegaphone,
    label: 'Marketing',
    href: '/marketing'
  },
  {
    icon: IoAnalyticsOutline,
    activeIcon: IoAnalytics,
    label: 'Analíticas',
    href: '/analytics'
  },
  {
    icon: IoFolderOutline,
    activeIcon: IoFolder,
    label: 'Proyectos',
    href: '/projects'
  },
  {
    icon: IoPeopleOutline,
    activeIcon: IoPeople,
    label: 'Equipo',
    href: '/team'
  },
  {
    icon: IoWalletOutline,
    activeIcon: IoWallet,
    label: 'Finanzas',
    href: '/finance'
  },
  {
    icon: IoConstructOutline,
    activeIcon: IoConstruct,
    label: 'Herramientas',
    href: '/tools'
  },
  {
    icon: IoChatbubbleOutline,
    activeIcon: IoChatbubble,
    label: 'CRM',
    href: '/crm'
  },
  {
    icon: IoSettingsOutline,
    activeIcon: IoSettings,
    label: 'Configuración',
    href: '/settings'
  }
]

const linksMockdata: Record<string, { label: string; href: string }[]> = {
  Dashboard: [
    { label: 'Resumen', href: '' },
    { label: 'Actividad', href: '/activity' },
    { label: 'Notificaciones', href: '/notifications' }
  ],
  Marketing: [
    { label: 'Dashboard', href: '/marketing' },
    { label: 'Campañas', href: '/marketing/campaigns' },
    { label: 'Calendario', href: '/marketing/calendar' },
    { label: 'Redes', href: '/marketing/social' }
  ],
  Analíticas: [
    { label: 'Dashboard', href: '/analytics' },
    { label: 'Website', href: '/analytics/website' },
    { label: 'Reportes', href: '/analytics/reports' }
  ],
  Proyectos: [
    { label: 'Dashboard', href: '/projects' }
  ],
  Equipo: [
    { label: 'Miembros', href: '/team' },
    { label: 'Tableros', href: '/team/boards' },
    { label: 'Roles', href: '/team/roles' },
    { label: 'Soporte', href: '/team/support' }
  ],
  Finanzas: [
    { label: 'Dashboard', href: '/finance' },
    { label: 'Facturas', href: '/finance/invoices' },
    { label: 'Pagos', href: '/finance/payments' }
  ],
  Herramientas: [
    { label: 'Dashboard', href: '/tools' },
    { label: 'Facturador', href: '/tools/invoicer' },
    { label: 'Cotizador', href: '/tools/quoter' },
    { label: 'Presupuestador', href: '/tools/budgeter' },
    { label: 'Informes', href: '/tools/reports' },
    { label: 'Reuniones', href: '/tools/meetings' }
  ],
  CRM: [
    { label: 'Resumen', href: '/crm' },
    { label: 'Mensajes', href: '/crm/messages' }
  ],
  Configuración: [
    { label: 'General', href: '/settings' },
    { label: 'Integraciones', href: '/settings/integrations' }
  ]
}

interface SidebarProps {
  activeSection?: string
}

export default function Sidebar({ activeSection }: SidebarProps) {
  const pathname = usePathname()
  
  const getInitialSection = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard'
    if (pathname.startsWith('/marketing')) return 'Marketing'
    if (pathname.startsWith('/analytics')) return 'Analíticas'
    if (pathname.startsWith('/projects')) return 'Proyectos'
    if (pathname.startsWith('/team')) return 'Equipo'
    if (pathname.startsWith('/finance')) return 'Finanzas'
    if (pathname.startsWith('/tools')) return 'Herramientas'
    if (pathname.startsWith('/crm')) return 'CRM'
    if (pathname.startsWith('/settings')) return 'Configuración'
    return activeSection || 'Dashboard'
  }
  
  const [active, setActive] = useState(getInitialSection())
  const [activeLink, setActiveLink] = useState('')
  const router = useRouter()
  const theme = useMantineTheme()

  const handleLogout = () => {
    router.push('/login')
  }

  const mainLinks = mainLinksMockdata.map((link) => {
    const Icon = link.icon
    const ActiveIcon = link.activeIcon
    const isActive = link.label === active

    return (
      <Tooltip
        label={link.label}
        position='right'
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <UnstyledButton
          onClick={() => {
            setActive(link.label)
            setActiveLink('')
            router.push(link.href)
          }}
          w={44}
          h={44}
          style={{
            borderRadius: theme.radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActive
              ? 'var(--mantine-color-blue-light-color)'
              : 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0))',
            backgroundColor: isActive
              ? 'var(--mantine-color-blue-light)'
              : 'transparent'
          }}
          aria-label={link.label}
        >
          {isActive ? <ActiveIcon size={22} /> : <Icon size={22} />}
        </UnstyledButton>
      </Tooltip>
    )
  })

  const links = (linksMockdata[active] || []).map((link) => (
    <UnstyledButton
      component='a'
      key={link.label}
      href={link.href}
      onClick={(event) => {
        event.preventDefault()
        setActiveLink(link.label)
        router.push(link.href)
      }}
      display='block'
      style={{
        textDecoration: 'none',
        borderTopRightRadius: theme.radius.md,
        borderBottomRightRadius: theme.radius.md,
        padding: '0 var(--mantine-spacing-md)',
        marginRight: 'var(--mantine-spacing-md)',
        fontWeight: 500,
        height: 44,
        lineHeight: '44px',
        color:
          activeLink === link.label
            ? 'var(--mantine-color-white)'
            : 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0))',
        backgroundColor:
          activeLink === link.label
            ? 'var(--mantine-color-blue-filled)'
            : 'transparent'
      }}
    >
      {link.label}
    </UnstyledButton>
  ))

  return (
    <Box
      component='nav'
      h='100vh'
      w={300}
      style={{
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        borderRight:
          '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
        position: 'sticky',
        top: 60,
        left: 0,
        backgroundColor:
          'light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))'
      }}
    >
      <Box style={{ display: 'flex', flex: 1 }}>
        <Box
          style={{
            flex: '0 0 60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRight:
              '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))',
            paddingBottom: 'var(--mantine-spacing-md)',
            backgroundColor:
              'light-dark(var(--mantine-color-body), var(--mantine-color-dark-6))'
          }}
        >
          <Box
            w='100%'
            h={60}
            pt='md'
            pb='md'
            style={{
              display: 'flex',
              justifyContent: 'center',
              borderBottom:
                '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))'
            }}
          >
            <Text fw={700} size='xl' c='blue'>
              A
            </Text>
          </Box>
          <Stack gap={0} mt='xl' align='center'>
            {mainLinks}
          </Stack>
          <Tooltip
            label='Cerrar sesión'
            position='right'
            withArrow
            transitionProps={{ duration: 0 }}
          >
            <UnstyledButton
              onClick={handleLogout}
              w={44}
              h={44}
              style={{
                borderRadius: theme.radius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 'auto',
                marginBottom: '1rem',
                color:
                  'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0))'
              }}
              aria-label='Cerrar sesión'
            >
              <IoLogOutOutline size={22} />
            </UnstyledButton>
          </Tooltip>
        </Box>
        <Box
          style={{
            flex: 1,
            backgroundColor:
              'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))'
          }}
        >
          <Title
            order={4}
            mb='xl'
            p='md'
            pt={18}
            h={60}
            style={{
              fontWeight: 500,
              borderBottom:
                '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))',
              backgroundColor:
                'light-dark(var(--mantine-color-body), var(--mantine-color-dark-6))'
            }}
          >
            {active}
          </Title>
          <Stack gap={0}>{links}</Stack>
        </Box>
      </Box>
    </Box>
  )
}
