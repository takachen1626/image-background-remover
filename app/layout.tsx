import './globals.css'
import { SessionProvider } from 'next-auth/react'

export const runtime = 'edge'

export const metadata = {
  title: 'BgRemover — AI Background Removal',
  description: 'Remove backgrounds instantly, privately, in your browser.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
