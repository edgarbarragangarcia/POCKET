"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation';
import { createLogger } from '@/lib/logger';
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter();
  const logger = createLogger('Register');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }
    
    if (!agreeTerms) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones para continuar.",
        variant: "destructive",
      })
      return
    }
    
    try {
      setLoading(true)
      await signUp(email, password)
      // Redirect to a page that tells the user to check their email
      router.push(`/check-email?email=${encodeURIComponent(email)}`)
    } catch (error) {
      // Error is handled in auth-context
      logger.error('Register error', error);
    } finally {
      setLoading(false)
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
              <h1 className="text-2xl md:text-3xl font-bold">Crear una cuenta</h1>
              <p className="text-base md:text-lg text-muted-foreground mt-2">
                Regístrate para comenzar a gestionar tus campañas.
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
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
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
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo 8 caracteres, incluyendo una mayúscula y un número.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input 
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="bg-background"
                />
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                />
                <Label 
                  htmlFor="terms" 
                  className="text-sm leading-tight"
                >
                  Acepto los{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Términos y Condiciones
                  </Link>
                  {" "}y la{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Política de Privacidad
                  </Link>
                </Label>
              </div>
              
              <Button type="submit" className="w-full neon-button" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Iniciar Sesión
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
