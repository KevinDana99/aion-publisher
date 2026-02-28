import type { Metadata } from 'next'
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider
} from '@mantine/core'
import { Suspense } from 'react'

import './globals.css'
import theme from '@/global/theme'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { UserProvider } from '@/contexts/UserContext'
import { InstagramProvider } from '@/lib/instagram/context'
import { FacebookProvider } from '@/lib/facebook/context'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'Aion',
  description: 'Aion Publisher'
}

function LoadingProviders() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Loading...
    </div>
  )
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme='light' />
      </head>

      <body className='antialiased'>
        <MantineProvider theme={theme} defaultColorScheme='light'>
          <Suspense fallback={<LoadingProviders />}>
            <UserProvider>
              <InstagramProvider>
                <FacebookProvider>
                  <SettingsProvider>{children}</SettingsProvider>
                </FacebookProvider>
              </InstagramProvider>
            </UserProvider>
          </Suspense>
        </MantineProvider>
      </body>
    </html>
  )
}
