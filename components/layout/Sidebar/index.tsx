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

const linksMockdata: Record<string, string[]> = {
  Dashboard: ['Resumen', 'Actividad', 'Notificaciones'],
  Marketing: ['Campañas', 'Contenido', 'Calendario', 'Redes'],
  Analíticas: ['Website', 'Reportes', 'KPIs'],
  Proyectos: ['Activos', 'Tareas', 'Tiempo', 'Timeline'],
  Equipo: ['Miembros', 'Roles', 'Soporte'],
  Finanzas: ['Facturas', 'Pagos', 'Reportes'],
  Configuración: ['General', 'Integraciones', 'Notificaciones']
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
      data-active={activeLink === link || undefined}
      href="#"
      onClick={(event) => {
        event.preventDefault()
        setActiveLink(link)
      }}
      key={link}
    >
      {link}
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