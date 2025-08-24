"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Session, User } from "@supabase/supabase-js"
import { useToast } from "@/components/ui/use-toast"
import { createLogger } from '@/lib/logger'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const logger = createLogger('AuthProvider')

  useEffect(() => {
    logger.debug('AuthProvider useEffect triggered');
    const getSession = async () => {
      setIsLoading(true)
      try {
        const { data: { session: activeSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        setSession(activeSession)
        setUser(activeSession?.user || null)
        logger.debug('Session loaded', activeSession)
        logger.debug('User loaded', activeSession?.user)
      } catch (error) {
        logger.error('Error getting session', error)
        toast({
          title: "Error de autenticación",
          description: "No se pudo recuperar la sesión. Inténtalo de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        logger.debug('isLoading set to false')
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user || null)
        setIsLoading(false)
        logger.debug('Auth state changed', session)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, toast])

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: "Registro exitoso",
        description: "Por favor, verifica tu correo electrónico para confirmar tu cuenta.",
      })
    } catch (error: any) {
      logger.error('Error signing up', error)
      toast({
        title: "Error en el registro",
        description: error?.message || "No se pudo completar el registro. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Handle specific error case for unconfirmed email
        if (error.message === "Email not confirmed") {
          toast({
            title: "Correo no verificado",
            description: "Por favor, verifica tu correo electrónico antes de iniciar sesión.",
            variant: "destructive",
          })
          throw new Error("EMAIL_NOT_CONFIRMED")
        }
        throw error
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo.",
      })
    } catch (error: any) {
      logger.error('Error signing in', error)
      // Don't display toast if it's our custom error since we already displayed one
      if (error.message !== "EMAIL_NOT_CONFIRMED") {
        toast({
          title: "Error en el inicio de sesión",
          description: error?.message || "Credenciales inválidas. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Intentar cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut()

      // Si hay error pero es porque no hay sesión, no es un error crítico
      if (error && !error.message.includes('session missing')) {
        throw error
      }

      // Forzar limpieza del estado local independientemente del resultado
      setSession(null)
      setUser(null)
      
      // Limpiar localStorage
      try {
        localStorage.removeItem('currentTenantId')
      } catch (e) {
        logger.warn('Could not clean localStorage', e)
      }

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      })

      // Redirigir a login después de cerrar sesión
      window.location.href = '/login'
      
    } catch (error: any) {
      logger.error('Error signing out', error)
      
      // Aún así, limpiar el estado local
      setSession(null)
      setUser(null)
      
      toast({
        title: "Error al cerrar sesión",
        description: error?.message || "No se pudo cerrar la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      })
      
      // Redirigir a login incluso si hay error
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Restablecimiento de contraseña",
        description: "Revisa tu correo para continuar con el proceso.",
      })
    } catch (error: any) {
      logger.error('Error resetting password', error)
      toast({
        title: "Error al restablecer contraseña",
        description: error?.message || "No se pudo enviar el correo. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada exitosamente.",
      })
    } catch (error: any) {
      logger.error('Error updating password', error)
      toast({
        title: "Error al actualizar contraseña",
        description: error?.message || "No se pudo actualizar la contraseña. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: "Correo de verificación enviado",
        description: "Por favor, revisa tu bandeja de entrada para confirmar tu cuenta.",
      })
    } catch (error: any) {
      logger.error('Error resending confirmation email', error)
      toast({
        title: "Error al enviar correo",
        description: error?.message || "No se pudo enviar el correo de verificación. Inténtalo de nuevo más tarde.",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    logger.debug('State changed', { user, session, isLoading });
  }, [user, session, isLoading]);

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmationEmail,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
