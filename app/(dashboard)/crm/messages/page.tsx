'use client'

import { Box } from '@mantine/core'
import MessagesWidget from '@/components/shared/widgets/MessagesWidget'

export default function CRMMessagesPage() {
  return (
    <Box style={{ width: '100%', height: 'calc(100vh - 140px)' }}>
      <MessagesWidget />
    </Box>
  )
}
