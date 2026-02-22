'use client'

import Modal from '@/components/ui/modals/Modal'

export default function ModalWrapper() {
  return (
    <Modal
      title="Modal de ejemplo"
      triggerLabel="Abrir modal"
      confirmLabel="Aceptar"
      cancelLabel="Cerrar"
      onConfirm={() => console.log('Confirmado!')}
    >
      <p>Este es el contenido del modal.</p>
    </Modal>
  )
}
