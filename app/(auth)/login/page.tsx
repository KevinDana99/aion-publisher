'use client'

import { useRouter } from 'next/navigation'
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Stack
} from '@mantine/core'
import { useForm } from '@mantine/form'

export default function LoginPage() {
  const router = useRouter()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      remember: false
    },
    validate: {
      email: (value) => (value.length > 0 ? null : 'Email requerido'),
      password: (value) => (value.length > 0 ? null : 'Contraseña requerida')
    }
  })

  const handleSubmit = () => {
    router.push('/dashboard')
  }

  const handleInvalidSubmit = () => {
    console.log('Invalid submit')
  }

  return (
    <Container
      size={500}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)'
      }}
    >
      <Stack align='center' gap={8} mb='lg' w='100%'>
        <Title order={2} fw={600}>
          Bienvenido a Aion
        </Title>
        <Text c='dimmed' size='sm'>
          Plataforma privada
        </Text>
      </Stack>

      <Paper p='xl' radius='lg' shadow='md' w={500} mih={500}>
        <form onSubmit={form.onSubmit(handleSubmit, handleInvalidSubmit)}>
          <Stack gap='xl' justify='center' style={{ height: '100%' }}>

            <TextInput
              label='Email'
              placeholder='tu@email.com'
              required
              size='md'
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label='Contraseña'
              placeholder='Tu contraseña'
              required
              size='md'
              {...form.getInputProps('password')}
            />

            <Group justify='space-between'>
              <Checkbox label='Recordarme' {...form.getInputProps('remember', { type: 'checkbox' })} />
              <Anchor component='a' href='#' size='sm'>
                ¿Olvidaste tu contraseña?
              </Anchor>
            </Group>

            <Button type='submit' fullWidth size='md'>
              Iniciar sesión
            </Button>

            <Text c='dimmed' size='xs' ta='center'>
              Al iniciar sesión, aceptas nuestros Términos de servicio y Política de privacidad
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
