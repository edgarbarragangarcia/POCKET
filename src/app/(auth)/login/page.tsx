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
  const { signIn, resendConfirmationEmail } = useAuth()
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
              <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
              <p className="text-muted-foreground mt-2">
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
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Registrarse
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
