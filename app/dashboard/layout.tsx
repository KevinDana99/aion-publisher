'use client'

import { Box } from '@mantine/core'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <Sidebar activeSection="Home" />
      <Box
        component="main"
        pt={60}
        pl={300}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </Box>
    </>
  )
}
