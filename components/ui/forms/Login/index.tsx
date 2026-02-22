'use client'

import { useState } from 'react'
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
  Stack,
  Alert
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IoAlertCircle } from 'react-icons/io5'

export default function Login() {
  const [showError, setShowError] = useState(false)
  const router = useRouter()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : 'Email inválido',
      password: (value: string) =>
        value.length >= 6 ? null : 'La contraseña debe tener al menos 6 caracteres'
    }
  })

  const handleSubmit = (values: typeof form.values) => {
    setShowError(false)
    console.log('Login:', values)
    router.push('/dashboard')
  }

  const handleInvalidSubmit = () => {
    setShowError(true)
  }

  return (
    <Container size={500} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)'
    }}>
      <Stack align="center" gap={8} mb="lg" w="100%">
        <Title order={2} fw={600}>
          Bienvenido a Aion
        </Title>
        <Text c="dimmed" size="sm">
          Plataforma privada
        </Text>
      </Stack>

      <Paper p="xl" radius="lg" shadow="md" w={500} mih={500}>
        <form onSubmit={form.onSubmit(handleSubmit, handleInvalidSubmit)}>
          <Stack gap="xl" justify="center" style={{ height: '100%' }}>
            <TextInput
              label="Email"
              placeholder="tu@email.com"
              required
              size="md"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              required
              size="md"
              {...form.getInputProps('password')}
            />
            <Group justify="space-between">
              <Checkbox
                label="Recordarme"
                {...form.getInputProps('rememberMe', { type: 'checkbox' })}
              />
              <Anchor component="button" size="sm">
                ¿Olvidaste tu contraseña?
              </Anchor>
            </Group>
            <Button fullWidth size="md" type="submit">
              Iniciar Sesión
            </Button>
            
            {showError && Object.keys(form.errors).length > 0 && (
              <Alert
                icon={<IoAlertCircle size={18} />}
                title="Error de validación"
                color="red"
                variant="light"
              >
                Por favor corregí los errores del formulario
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
