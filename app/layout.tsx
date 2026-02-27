import type { Metadata } from 'next'
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider
} from '@mantine/core'

import './globals.css'
import theme from '@/global/theme'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { UserProvider } from '@/contexts/UserContext'
import { InstagramProvider } from '@/lib/instagram/context'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'Aion',
  description: 'Aion Publisher'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme='auto' />
      </head>

      <body className='antialiased'>
        <MantineProvider theme={theme} defaultColorScheme='auto'>
          <UserProvider>
            <InstagramProvider>
              <SettingsProvider>{children}</SettingsProvider>
            </InstagramProvider>
          </UserProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
