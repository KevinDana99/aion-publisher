import { Box } from '@mantine/core'
import dynamic from 'next/dynamic'

const MessagesWidget = dynamic(
  () => import('@/components/shared/widgets/MessagesWidget'),
  { ssr: false }
)

export default function CRMMessagesPage() {
  return (
    <Box style={{ width: '100%', height: 'calc(100vh - 140px)' }}>
      <MessagesWidget />
    </Box>
  )
}
