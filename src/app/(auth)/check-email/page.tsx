"use client"

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { MailCheck } from 'lucide-react'
import { createLogger } from '@/lib/logger'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { resendConfirmationEmail } = useAuth()
  const [loading, setLoading] = useState(false)
  const logger = createLogger('CheckEmail')

  const handleResend = async () => {
    if (!email) return
    setLoading(true)
    try {
      await resendConfirmationEmail(email)
      // Success toast is handled in auth-context
    } catch (error) {
      // Error toast is handled in auth-context
      logger.error('Error resending confirmation email', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="neumorphic-light dark:neumorphic-dark p-1 md:p-3 rounded-2xl">
          <div className="glassmorphic rounded-xl p-8 text-center">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center justify-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Campaign Manager"
                  width={40}
                  height={40}
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold tracking-tight">
                  POCKET
                </span>
              </div>
            </Link>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
              <MailCheck className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Verifica tu correo electrónico</h1>
            <p className="text-muted-foreground mb-6">
              Hemos enviado un enlace de confirmación a <br />
              <strong className="text-foreground">{email || 'tu correo'}</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Por favor, revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
            </p>

            <Button 
              onClick={handleResend} 
              disabled={loading || !email}
              className="w-full neon-button mb-4"
            >
              {loading ? 'Enviando...' : 'Reenviar correo de confirmación'}
            </Button>

            <Link href="/login" className="text-sm text-primary hover:underline">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckEmailContent />
    </Suspense>
  )
}
