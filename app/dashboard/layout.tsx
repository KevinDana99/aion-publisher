'use client'

import { Box } from '@mantine/core'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Box component='main' style={{ minHeight: '100vh' }}>
      {children}
    </Box>
  )
}
