import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { I18nProvider } from '@/contexts/i18nContext'

export const metadata: Metadata = {
  title: 'Admin Panel - Lawyer Management System',
  description: 'Administrative dashboard for managing lawyers, clients, and cases',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <I18nProvider>
            {children}
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
}