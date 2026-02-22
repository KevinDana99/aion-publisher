'use client'

import { Paper, Text, Group, ThemeIcon, Stack, Badge, Avatar, SimpleGrid } from '@mantine/core'
import { IoCalendar, IoLogoInstagram, IoLogoTwitter, IoLogoLinkedin, IoLogoFacebook } from 'react-icons/io5'

const posts = [
  { title: 'Lanzamiento nuevo producto', platform: 'instagram', time: 'Hoy 14:00', status: 'programado' },
  { title: 'Tip semanal', platform: 'twitter', time: 'Hoy 16:30', status: 'programado' },
  { title: 'Caso de éxito cliente', platform: 'linkedin', time: 'Mañana 09:00', status: 'pendiente' },
  { title: 'Promo fin de semana', platform: 'facebook', time: 'Mañana 12:00', status: 'borrador' },
  { title: 'Behind the scenes', platform: 'instagram', time: 'Miércoles 18:00', status: 'programado' }
]

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <IoLogoInstagram size={18} />,
  twitter: <IoLogoTwitter size={18} />,
  linkedin: <IoLogoLinkedin size={18} />,
  facebook: <IoLogoFacebook size={18} />
}

const platformColors: Record<string, string> = {
  instagram: 'violet',
  twitter: 'cyan',
  linkedin: 'blue',
  facebook: 'indigo'
}

const statusColors: Record<string, string> = {
  programado: 'blue',
  pendiente: 'orange',
  borrador: 'gray'
}

export default function UpcomingPosts() {
  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Próximas Publicaciones</Text>
        <ThemeIcon color="grape" variant="light" size="lg" radius="md">
          <IoCalendar size={20} />
        </ThemeIcon>
      </Group>

      <Stack gap="sm">
        {posts.map((post, index) => (
          <Paper key={index} p="sm" radius="md" style={{ background: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))' }}>
            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon color={platformColors[post.platform]} variant="light" size="md" radius="md">
                  {platformIcons[post.platform]}
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={500}>{post.title}</Text>
                  <Text size="xs" c="dimmed">{post.time}</Text>
                </div>
              </Group>
              <Badge color={statusColors[post.status]} variant="light" size="sm">
                {post.status}
              </Badge>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  )
}