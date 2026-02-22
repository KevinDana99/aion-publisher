'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Title, Tooltip, UnstyledButton, Text } from '@mantine/core'
import {
  IoHomeOutline,
  IoStatsChartOutline,
  IoAnalyticsOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoHome,
  IoStatsChart,
  IoAnalytics,
  IoCalendar,
  IoPerson,
  IoShieldCheckmark,
  IoSettings
} from 'react-icons/io5'
import classes from './Sidebar.module.css'

const mainLinksMockdata = [
  { icon: IoHomeOutline, activeIcon: IoHome, label: 'Home', href: '/dashboard' },
  { icon: IoStatsChartOutline, activeIcon: IoStatsChart, label: 'Dashboard', href: '/dashboard/stats' },
  { icon: IoAnalyticsOutline, activeIcon: IoAnalytics, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: IoCalendarOutline, activeIcon: IoCalendar, label: 'Releases', href: '/dashboard/releases' },
  { icon: IoPersonOutline, activeIcon: IoPerson, label: 'Account', href: '/dashboard/account' },
  { icon: IoShieldCheckmarkOutline, activeIcon: IoShieldCheckmark, label: 'Security', href: '/dashboard/security' },
  { icon: IoSettingsOutline, activeIcon: IoSettings, label: 'Settings', href: '/dashboard/settings' }
]

const linksMockdata: Record<string, string[]> = {
  Home: ['Overview', 'Projects', 'Recent'],
  Dashboard: ['Statistics', 'Reports', 'Metrics'],
  Analytics: ['Overview', 'Forecasts', 'Real time'],
  Releases: ['Upcoming', 'Previous', 'Schedule'],
  Account: ['Profile', 'Preferences', 'Billing'],
  Security: ['2FA', 'Password', 'Recovery'],
  Settings: ['General', 'Notifications', 'Integrations']
}

interface SidebarProps {
  activeSection?: string
}

export default function Sidebar({ activeSection = 'Home' }: SidebarProps) {
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