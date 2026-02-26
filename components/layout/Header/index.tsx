'use client'

import { useRouter } from 'next/navigation'
import {
  ActionIcon,
  Group,
  Text,
  Box,
  useMantineColorScheme,
  useComputedColorScheme,
  Tooltip
} from '@mantine/core'
import { IoSunnyOutline, IoMoonOutline, IoLogOutOutline } from 'react-icons/io5'

export default function Header() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  })
  const router = useRouter()

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
  }

  const handleLogout = () => {
    router.push('/auth/login')
  }

  return (
    <Box
      component='header'
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 60,
        padding: '0 1rem',
        backdropFilter: 'blur(12px)',
        background:
          computedColorScheme === 'dark'
            ? 'rgba(26, 27, 30, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        borderBottom:
          computedColorScheme === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Group justify='space-between' h='100%'>
        <Text fw={700} size='xl'>
          Aion
        </Text>

        <Group gap='xs'>
          <ActionIcon
            onClick={toggleColorScheme}
            variant='subtle'
            size='lg'
            radius='md'
            aria-label='Toggle color scheme'
          >
            {computedColorScheme === 'dark' ? (
              <IoSunnyOutline size={20} />
            ) : (
              <IoMoonOutline size={20} />
            )}
          </ActionIcon>

          <Tooltip label='Cerrar sesión' position='bottom'>
            <ActionIcon
              onClick={handleLogout}
              variant='subtle'
              size='lg'
              radius='md'
              aria-label='Cerrar sesión'
              color='red'
            >
              <IoLogOutOutline size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Box>
  )
}
