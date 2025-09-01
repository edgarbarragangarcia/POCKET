"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createLogger } from '@/lib/logger'
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const { signIn, resendConfirmationEmail, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const logger = createLogger('Login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      })
      return
    }
    
    try {
      setLoading(true)
      setIsEmailNotConfirmed(false)
      await signIn(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      // Check if this is our custom error for unconfirmed email
      if (error.message === "EMAIL_NOT_CONFIRMED") {
        setIsEmailNotConfirmed(true)
      }
      logger.error('Login error', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleResendConfirmationEmail = async () => {
    try {
      setResendingEmail(true)
      await resendConfirmationEmail(email)
    } catch (error) {
      logger.error('Error resending confirmation email', error)
    } finally {
      setResendingEmail(false)
    }
  }
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="neumorphic-light dark:neumorphic-dark p-1 md:p-3 rounded-2xl">
          <div className="glassmorphic rounded-xl p-8">
            <div className="text-center mb-8">
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
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-extrabold text-4xl">POCKET</span>
                  </span>
                </div>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">Iniciar Sesión</h1>
              <p className="text-base md:text-lg text-muted-foreground mt-2">
                Bienvenido de vuelta. Ingresa tus credenciales para continuar.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    </span>
                  </button>
                </div>
              </div>
              
              {isEmailNotConfirmed ? (
                <div className="space-y-4">
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 rounded-md text-sm">
                    <p>Tu correo electrónico no ha sido confirmado. Por favor, verifica tu bandeja de entrada o solicita un nuevo correo de verificación.</p>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleResendConfirmationEmail} 
                    className="w-full" 
                    variant="outline" 
                    disabled={resendingEmail}
                  >
                    {resendingEmail ? "Enviando..." : "Reenviar correo de verificación"}
                  </Button>
                  <Button type="submit" className="w-full neon-button" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Intentar iniciar sesión nuevamente"}
                  </Button>
                </div>
              ) : (
                <Button type="submit" className="w-full neon-button" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              )}
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">O continúa con</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  await signInWithGoogle();
                } catch (error) {
                  // Error already handled in auth-context
                }
              }}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Registrarse
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
