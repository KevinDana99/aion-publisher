'use client'

import {
  Modal as MantineModal,
  Button,
  Group,
  ModalProps
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface ModalComponentProps extends Omit<ModalProps, 'opened' | 'onClose'> {
  triggerLabel?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
}

export default function Modal({
  triggerLabel = 'Abrir',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  title,
  children,
  ...props
}: ModalComponentProps) {
  const [opened, { open, close }] = useDisclosure(false)

  const handleConfirm = () => {
    onConfirm?.()
    close()
  }

  return (
    <>
      <Button onClick={open}>{triggerLabel}</Button>

      <MantineModal opened={opened} onClose={close} title={title} {...props}>
        {children}
        <Group justify="flex-end" mt="xl">
          <Button variant="subtle" onClick={close}>
            {cancelLabel}
          </Button>
          <Button onClick={handleConfirm}>{confirmLabel}</Button>
        </Group>
      </MantineModal>
    </>
  )
}
