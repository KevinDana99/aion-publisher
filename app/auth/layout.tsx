'use client'

import { Box } from '@mantine/core'
import Header from '@/components/layout/Header'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <Box pt={60} style={{ minHeight: '100vh' }}>
        {children}
      </Box>
    </>
  )
}
