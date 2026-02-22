'use client'

import {
  ActionIcon,
  Group,
  Text,
  Box,
  useMantineColorScheme,
  useComputedColorScheme
} from '@mantine/core'
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5'

export default function Header() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  })

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
  }

  return (
    <Box
      component="header"
      style={{
        position: 'fixed',
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
      <Group justify="space-between" h="100%">
        <Text fw={700} size="xl">
          Aion
        </Text>

        <ActionIcon
          onClick={toggleColorScheme}
          variant="subtle"
          size="lg"
          radius="md"
          aria-label="Toggle color scheme"
        >
          {computedColorScheme === 'dark' ? (
            <IoSunnyOutline size={20} />
          ) : (
            <IoMoonOutline size={20} />
          )}
        </ActionIcon>
      </Group>
    </Box>
  )
}