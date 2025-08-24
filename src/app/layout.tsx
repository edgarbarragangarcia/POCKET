import * as React from 'react';
import { Outfit, Space_Grotesk, Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth-context';
import { TenantProvider } from '@/lib/tenant-context';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-sans'
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-heading'
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'POCKET | Plataforma SaaS para gestión de campañas publicitarias',
  description: 'Plataforma SaaS para creación, gestión y análisis de campañas publicitarias con herramientas avanzadas y asistencia de IA',
  keywords: 'campañas publicitarias, marketing digital, SaaS, analítica de campañas, gestión de publicidad',
  authors: [
    {
      name: 'Edgar Barragan',
      url: 'https://pocket.app',
    }
  ],
  creator: 'POCKET Team',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${outfit.variable} ${spaceGrotesk.variable} ${firaCode.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TenantProvider>
              {children}
            </TenantProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
