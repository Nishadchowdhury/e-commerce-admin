import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

import { ModalProvider } from '@/providers/modal-provider'
import './custom.css'
import './globals.css'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <ModalProvider />
          {children}
        </body>
      </ClerkProvider>
    </html>
  )
}
