'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Title, Tooltip, UnstyledButton, Text } from '@mantine/core'
import {
  IoHomeOutline,
  IoMegaphoneOutline,
  IoAnalyticsOutline,
  IoFolderOutline,
  IoPeopleOutline,
  IoWalletOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoHome,
  IoMegaphone,
  IoAnalytics,
  IoFolder,
  IoPeople,
  IoWallet,
  IoSettings
} from 'react-icons/io5'
import classes from './Sidebar.module.css'

const mainLinksMockdata = [
  { icon: IoHomeOutline, activeIcon: IoHome, label: 'Dashboard', href: '/dashboard' },
  { icon: IoMegaphoneOutline, activeIcon: IoMegaphone, label: 'Marketing', href: '/dashboard/marketing' },
  { icon: IoAnalyticsOutline, activeIcon: IoAnalytics, label: 'Analíticas', href: '/dashboard/analytics' },
  { icon: IoFolderOutline, activeIcon: IoFolder, label: 'Proyectos', href: '/dashboard/projects' },
  { icon: IoPeopleOutline, activeIcon: IoPeople, label: 'Equipo', href: '/dashboard/team' },
  { icon: IoWalletOutline, activeIcon: IoWallet, label: 'Finanzas', href: '/dashboard/finance' },
  { icon: IoSettingsOutline, activeIcon: IoSettings, label: 'Configuración', href: '/dashboard/settings' }
]

const linksMockdata: Record<string, { label: string; href: string }[]> = {
  Dashboard: [
    { label: 'Resumen', href: '/dashboard' },
    { label: 'Actividad', href: '/dashboard/activity' },
    { label: 'Notificaciones', href: '/dashboard/notifications' }
  ],
  Marketing: [
    { label: 'Dashboard', href: '/dashboard/marketing' },
    { label: 'Campañas', href: '/dashboard/marketing/campaigns' },
    { label: 'Calendario', href: '/dashboard/marketing/calendar' },
    { label: 'Redes', href: '/dashboard/marketing/social' }
  ],
  Analíticas: [
    { label: 'Dashboard', href: '/dashboard/analytics' },
    { label: 'Website', href: '/dashboard/analytics/website' },
    { label: 'Reportes', href: '/dashboard/analytics/reports' }
  ],
  Proyectos: [
    { label: 'Dashboard', href: '/dashboard/projects' },
    { label: 'Kanban', href: '/dashboard/projects/kanban' },
    { label: 'Tareas', href: '/dashboard/projects/tasks' },
    { label: 'Tiempo', href: '/dashboard/projects/time' }
  ],
  Equipo: [
    { label: 'Miembros', href: '/dashboard/team' },
    { label: 'Roles', href: '/dashboard/team/roles' },
    { label: 'Soporte', href: '/dashboard/team/support' }
  ],
  Finanzas: [
    { label: 'Dashboard', href: '/dashboard/finance' },
    { label: 'Facturas', href: '/dashboard/finance/invoices' },
    { label: 'Pagos', href: '/dashboard/finance/payments' }
  ],
  Configuración: [
    { label: 'General', href: '/dashboard/settings' },
    { label: 'Integraciones', href: '/dashboard/settings/integrations' }
  ]
}

interface SidebarProps {
  activeSection?: string
}

export default function Sidebar({ activeSection = 'Dashboard' }: SidebarProps) {
  const [active, setActive] = useState(activeSection)
  const [activeLink, setActiveLink] = useState('')
  const router = useRouter()

  const handleLogout = () => {
    router.push('/auth/login')
  }

  const mainLinks = mainLinksMockdata.map((link) => {
    const Icon = link.icon
    const ActiveIcon = link.activeIcon
    const isActive = link.label === active

    return (
      <Tooltip
        label={link.label}
        position="right"
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
          className={classes.mainLink}
          data-active={isActive || undefined}
          aria-label={link.label}
        >
          {isActive ? <ActiveIcon size={22} /> : <Icon size={22} />}
        </UnstyledButton>
      </Tooltip>
    )
  })

  const links = (linksMockdata[active] || []).map((link) => (
    <a
      className={classes.link}
      data-active={activeLink === link.label || undefined}
      href={link.href}
      onClick={(event) => {
        event.preventDefault()
        setActiveLink(link.label)
        router.push(link.href)
      }}
      key={link.label}
    >
      {link.label}
    </a>
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            <Text fw={700} size="xl" c="blue">
              A
            </Text>
          </div>
          {mainLinks}
          <Tooltip
            label="Cerrar sesión"
            position="right"
            withArrow
            transitionProps={{ duration: 0 }}
          >
            <UnstyledButton
              onClick={handleLogout}
              className={classes.mainLink}
              aria-label="Cerrar sesión"
              style={{ marginTop: 'auto', marginBottom: '1rem' }}
            >
              <IoLogOutOutline size={22} />
            </UnstyledButton>
          </Tooltip>
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>
          {links}
        </div>
      </div>
    </nav>
  )
}