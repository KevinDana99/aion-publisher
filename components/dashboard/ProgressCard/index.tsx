'use client'

import { IoCalendar, IoWallet } from 'react-icons/io5'
import { Group, Paper, Progress, Text, ThemeIcon } from '@mantine/core'
import classes from './ProgressCard.module.css'

interface ProgressCardProps {
  title: string
  icon: React.ReactNode
  current: number
  target: number
  daysLeft: number
  color?: string
}

export default function ProgressCard({
  title,
  icon,
  current,
  target,
  daysLeft,
  color = 'blue'
}: ProgressCardProps) {
  const progress = Math.min((current / target) * 100, 100)
  const formattedCurrent = current.toLocaleString('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
  const formattedTarget = target.toLocaleString('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
          {title}
        </Text>
        <ThemeIcon color={color} variant="light" size="lg" radius="md">
          {icon}
        </ThemeIcon>
      </Group>

      <Group justify="apart" mb="xs">
        <Text fw={700} fz="lg">
          {formattedCurrent} / {formattedTarget}
        </Text>
        <Text c="dimmed" fz="sm">
          {Math.round(progress)}%
        </Text>
      </Group>

      <Progress 
        value={progress} 
        color={color} 
        size="lg" 
        radius="md" 
        striped 
        animated
        className={classes.progress}
      />

      <Group justify="space-between" mt="md">
        <Group gap="xs">
          <IoCalendar size={16} />
          <Text c="dimmed" fz="sm">
            {daysLeft} días restantes
          </Text>
        </Group>
        <Text c={progress >= 100 ? 'teal' : 'orange'} fz="sm" fw={500}>
          {progress >= 100 ? 'Meta alcanzada' : 'En progreso'}
        </Text>
      </Group>
    </Paper>
  )
}
