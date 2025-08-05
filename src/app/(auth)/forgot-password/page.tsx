"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { resetPassword } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa tu correo electrónico.",
        variant: "destructive",
      })
      return
    }
    
    try {
      setLoading(true)
      await resetPassword(email)
      setEmailSent(true)
    } catch (error) {
      // Error is handled in auth-context
      console.error("Reset password error:", error)
    } finally {
      setLoading(false)
    }
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
                    Campaign<span className="neon-text-blue">Manager</span>
                  </span>
                </div>
              </Link>
              
              <h1 className="text-2xl font-bold">Recuperar Contraseña</h1>
              <p className="text-muted-foreground mt-2">
                {!emailSent 
                  ? "Ingresa tu correo electrónico para recibir un enlace de recuperación."
                  : "Se ha enviado un enlace a tu correo electrónico."}
              </p>
            </div>
            
            {!emailSent ? (
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
                
                <Button type="submit" className="w-full neon-button" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar Instrucciones"}
                </Button>
                
                <div className="mt-6 text-center">
                  <Link 
                    href="/login" 
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Volver a inicio de sesión
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 dark:text-green-400 text-sm">
                  <p>
                    Hemos enviado instrucciones para restablecer tu contraseña a{" "}
                    <span className="font-medium">{email}</span>. Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      setEmailSent(false)
                      setEmail("")
                    }} 
                    variant="outline" 
                    className="w-full"
                  >
                    Intentar con otro correo
                  </Button>
                  
                  <Link href="/login">
                    <Button className="w-full">
                      Volver a inicio de sesión
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>
                    ¿No recibiste el correo?{" "}
                    <button 
                      type="button"
                      onClick={handleSubmit}
                      className="text-primary hover:underline font-medium"
                      disabled={loading}
                    >
                      Reenviar
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
