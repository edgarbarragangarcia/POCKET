"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Building2, Users, Zap } from "lucide-react"

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingExisting, setIsCheckingExisting] = useState(true)
  const [organizationName, setOrganizationName] = useState("")
  const [organizationSlug, setOrganizationSlug] = useState("")
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Verificar si el usuario ya tiene organizaciones
  React.useEffect(() => {
    const checkExistingOrganizations = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      try {
        // Verificar si el usuario ya es miembro de alguna organización
        const { data: existingMemberships, error } = await supabase
          .from('tenant_members')
          .select('*, tenant:tenants(*)')
          .eq('user_id', user.id)

        if (error) {
          console.error("Error checking existing organizations:", error)
          // Continuar con el onboarding si hay error
          setIsCheckingExisting(false)
          return
        }

        if (existingMemberships && existingMemberships.length > 0) {
          console.log("Usuario ya tiene organizaciones, redirigiendo al dashboard")
          
          // Verificar si viene de una redirección automática del dashboard
          const urlParams = new URLSearchParams(window.location.search)
          const fromDashboard = urlParams.get('from') === 'dashboard'
          
          if (fromDashboard) {
            // Si viene del dashboard, hay un problema con el contexto de tenant
            // Redirigir silenciosamente de vuelta al dashboard
            console.log("Redirección desde dashboard detectada, regresando silenciosamente")
            router.replace("/dashboard")
            return
          } else {
            // Si el usuario accedió directamente, mostrar mensaje informativo
            toast({
              title: "Ya tienes una organización",
              description: "Redirigiendo al dashboard...",
            })
            setTimeout(() => {
              router.replace("/dashboard")
            }, 1500)
            return
          }
        }

        setIsCheckingExisting(false)
      } catch (error) {
        console.error("Error checking organizations:", error)
        setIsCheckingExisting(false)
      }
    }

    checkExistingOrganizations()
  }, [user, router, supabase, toast])

  // Generate slug from organization name
  const handleNameChange = (name: string) => {
    setOrganizationName(name)
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    setOrganizationSlug(slug)
  }

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!organizationName.trim() || !organizationSlug.trim()) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para crear una organización.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // First check if the slug already exists
      const { data: existingTenant, error: checkError } = await supabase
        .from('tenants')
        .select('slug')
        .eq('slug', organizationSlug.trim())
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("Error checking slug availability:", checkError)
        throw new Error("Error verificando disponibilidad del nombre")
      }

      if (existingTenant) {
        toast({
          title: "Nombre no disponible",
          description: "Este nombre de organización ya está en uso. Por favor, elige otro.",
          variant: "destructive",
        })
        return
      }

      // Create the tenant/organization
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: organizationName.trim(),
          slug: organizationSlug.trim(),
          owner_id: user.id,
          plan: 'free',
          is_active: true
        })
        .select()
        .single()

      if (tenantError) {
        console.error("Error creating tenant:", tenantError)
        
        // Handle specific error cases
        if (tenantError.code === '23505') { // Unique constraint violation
          toast({
            title: "Nombre no disponible",
            description: "Este nombre de organización ya está en uso. Por favor, elige otro.",
            variant: "destructive",
          })
          return
        }
        
        throw new Error(tenantError.message)
      }

      // Add the user as a member with owner role
      const { error: memberError } = await supabase
        .from('tenant_members')
        .insert({
          tenant_id: tenantData.id,
          user_id: user.id,
          role: 'owner'
        })

      if (memberError) {
        console.error("Error adding user as member:", memberError)
        throw new Error(memberError.message)
      }

      toast({
        title: "¡Organización creada!",
        description: `${organizationName} ha sido creada exitosamente.`,
      })

      // Esperar un momento para que el toast se muestre y luego redirigir
      setTimeout(() => {
        console.log("Redirigiendo al dashboard...")
        router.push("/dashboard")
        // Forzar recarga de la página para actualizar el contexto de tenant
        window.location.href = "/dashboard"
      }, 1500)
      
    } catch (error: any) {
      console.error("Error creating organization:", error)
      
      // Don't show generic error if we already handled specific cases
      if (!error.message.includes("Nombre no disponible")) {
        toast({
          title: "Error al crear organización",
          description: error.message || "Ocurrió un error inesperado. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar pantalla de carga mientras se verifica si ya tiene organizaciones
  if (isCheckingExisting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600 dark:text-gray-300">Verificando tu cuenta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido a Campaign Manager!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Crea tu primera organización para comenzar a gestionar tus campañas publicitarias
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4">
            <div className="flex justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Colaboración</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Invita a tu equipo y colabora en tiempo real
            </p>
          </div>
          <div className="text-center p-4">
            <div className="flex justify-center mb-2">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Automatización</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Automatiza tus campañas con IA avanzada
            </p>
          </div>
          <div className="text-center p-4">
            <div className="flex justify-center mb-2">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Escalabilidad</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Crece sin límites con nuestra plataforma
            </p>
          </div>
        </div>

        {/* Organization Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Crear tu organización</CardTitle>
            <CardDescription>
              Configura tu organización para comenzar a crear y gestionar campañas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Nombre de la organización</Label>
                <Input
                  id="organizationName"
                  type="text"
                  placeholder="Mi Empresa"
                  value={organizationName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organizationSlug">URL de la organización</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                    campaignmanager.com/
                  </span>
                  <Input
                    id="organizationSlug"
                    type="text"
                    placeholder="mi-empresa"
                    value={organizationSlug}
                    onChange={(e) => setOrganizationSlug(e.target.value)}
                    disabled={isLoading}
                    className="rounded-l-none"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Esta será la URL única de tu organización
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !organizationName.trim() || !organizationSlug.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando organización...
                  </>
                ) : (
                  "Crear organización"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Necesitas ayuda? Contacta nuestro{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              soporte técnico
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
