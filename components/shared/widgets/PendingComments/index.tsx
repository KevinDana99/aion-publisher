'use client'

import { Paper, Text, Group, ThemeIcon, Stack, Avatar, Badge, Button, SimpleGrid } from '@mantine/core'
import { IoChatbubbleEllipses, IoLogoInstagram, IoLogoTwitter, IoLogoFacebook } from 'react-icons/io5'

const comments = [
  { user: 'María García', avatar: 'MG', platform: 'instagram', comment: 'Me encanta este producto! ¿Cuándo estará disponible?', time: 'Hace 5 min' },
  { user: 'Carlos López', avatar: 'CL', platform: 'facebook', comment: 'Tengo una duda sobre el proceso de compra...', time: 'Hace 23 min' },
  { user: 'Ana Martínez', avatar: 'AM', platform: 'instagram', comment: '¿Hacen envíos a Argentina?', time: 'Hace 1 hora' },
  { user: 'Pedro Sánchez', avatar: 'PS', platform: 'twitter', comment: 'Excelente servicio al cliente!', time: 'Hace 2 horas' }
]

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <IoLogoInstagram size={16} />,
  twitter: <IoLogoTwitter size={16} />,
  facebook: <IoLogoFacebook size={16} />
}

const platformColors: Record<string, string> = {
  instagram: 'violet',
  twitter: 'cyan',
  facebook: 'blue'
}

export default function PendingComments() {
  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Comentarios Pendientes</Text>
        <Badge color="red" size="lg" variant="filled">{comments.length}</Badge>
      </Group>

      <Stack gap="sm">
        {comments.map((comment, index) => (
          <Paper key={index} p="sm" radius="md" style={{ background: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))' }}>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <Avatar color="blue" radius="xl" size="sm">{comment.avatar}</Avatar>
                <Text size="sm" fw={600}>{comment.user}</Text>
                <ThemeIcon color={platformColors[comment.platform]} variant="light" size="xs" radius="xl">
                  {platformIcons[comment.platform]}
                </ThemeIcon>
              </Group>
              <Text size="xs" c="dimmed">{comment.time}</Text>
            </Group>
            <Text size="sm" c="dimmed" lineClamp={2}>{comment.comment}</Text>
          </Paper>
        ))}
      </Stack>

      <Button variant="light" fullWidth mt="md" size="sm">
        Ver todos los comentarios
      </Button>
    </Paper>
  )
}