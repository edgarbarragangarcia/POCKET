"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/lib/auth-context"
import { Tenant, TenantMember } from "@/models/tenant"
import { useToast } from "@/components/ui/use-toast"
import { createLogger } from '@/lib/logger'

type TenantContextType = {
  currentTenant: Tenant | null
  tenants: Tenant[]
  userRole: string | null
  isLoading: boolean
  switchTenant: (tenantId: string) => Promise<void>
  createTenant: (tenantData: Partial<Tenant>) => Promise<void>
  updateTenant: (tenantId: string, tenantData: Partial<Tenant>) => Promise<void>
  inviteMember: (email: string, role: string) => Promise<void>
  removeMember: (userId: string) => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { user } = useAuth()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const logger = createLogger('TenantProvider')

  useEffect(() => {
    logger.debug('[TenantProvider] useEffect triggered', { user });
    const loadTenants = async () => {
      if (!user) {
        setCurrentTenant(null)
        setTenants([])
        setUserRole(null)
        setIsLoading(false)
        logger.debug('[TenantProvider] No user, cleared tenant state');
        return
      }

      try {
        setIsLoading(true)
        logger.debug('Loading tenants for user', { userId: user.id });
        
        // Verificar que la tabla existe
        try {
          const { data, error } = await supabase
            .from('tenant_members')
            .select('count')
            .limit(1)
            
          if (error) {
            logger.error("Error verificando la tabla tenant_members:", {
            message: error.message,
            details: error.details,
            code: error.code,
            hint: error.hint
          })
            throw new Error(`Error al acceder a tabla: ${error.message}`)
          }
          
          logger.debug("Tabla tenant_members verificada correctamente")
        } catch (tableError: any) {
          logger.error('Error al verificar la tabla', tableError);
          throw new Error(`Error verificando tabla: ${tableError?.message || 'Error desconocido'}`)
        }
        
        // Get all tenants that the user is a member of
        logger.debug('Consultando tenant_members con user_id', { userId: user.id });
        const { data: memberData, error: memberError } = await supabase
          .from('tenant_members')
          .select('*, tenant:tenants(*)')
          .eq('user_id', user.id)

        if (memberError) {
          logger.error("Error obteniendo tenant_members:", {
            message: memberError.message,
            details: memberError.details,
            code: memberError.code,
            hint: memberError.hint
          })
          throw memberError
        }

        if (!memberData || memberData.length === 0) {
          setCurrentTenant(null)
          setTenants([])
          setUserRole(null)
          setIsLoading(false)
          logger.debug('No tenants found for user');
          return
        }

        // Transform the data
        const userTenants = memberData.map((member) => {
          const tenant = member.tenant as unknown as Tenant
          return {
            ...tenant,
            createdAt: new Date(tenant.createdAt),
            updatedAt: new Date(tenant.updatedAt)
          }
        })
        
        setTenants(userTenants)
        logger.debug('[TenantProvider] Tenants loaded', { tenants: userTenants });

        // Get current tenant from local storage or use the first one
        const savedTenantId = localStorage.getItem('currentTenantId')
        const tenantToUse = savedTenantId 
          ? userTenants.find(t => t.id === savedTenantId) || userTenants[0]
          : userTenants[0]

        setCurrentTenant(tenantToUse)
        logger.debug('[TenantProvider] Current tenant set', { tenant: tenantToUse });
        
        if (tenantToUse) {
          localStorage.setItem('currentTenantId', tenantToUse.id)
          
          // Get user role for current tenant
          const currentMember = memberData.find(m => 
            (m.tenant as unknown as Tenant).id === tenantToUse.id
          )
          
          setUserRole(currentMember?.role || null)
          logger.debug('[TenantProvider] User role set', { role: currentMember?.role || null });
        }
      } catch (error: any) {
        // Capturar y mostrar detalles completos del error
        const errorDetails = {
          message: error?.message || 'Unknown error',
          details: error?.details || {},
          code: error?.code,
          hint: error?.hint,
          name: error?.name,
          cause: error?.cause,
          constructor: error?.constructor?.name,
        };
        
        logger.error("Error loading tenants", { error: errorDetails, stack: error?.stack });
        
        // Si hay un error original, mostrarlo también
        if (error.originalError) {
          logger.error('Error original', error.originalError);
        }
        
        // Si es un error de Supabase, podría tener más información
        const errorMessage = error?.message || 'Error desconocido al cargar organizaciones';
        
        toast({
          title: "Error al cargar organizaciones",
          description: `${errorMessage}. Por favor inténtalo de nuevo.`,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        logger.debug('[TenantProvider] isLoading set to false')
      }
    }

    loadTenants()
  }, [user, supabase, toast])

  const switchTenant = async (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (!tenant) {
      toast({
        title: "Organización no encontrada",
        description: "No se pudo cambiar a la organización seleccionada.",
        variant: "destructive",
      })
      return
    }

    try {
      setCurrentTenant(tenant)
      localStorage.setItem('currentTenantId', tenant.id)

      // Get user role for selected tenant
      const { data: memberData, error: memberError } = await supabase
        .from('tenant_members')
        .select('role')
        .eq('user_id', user?.id)
        .eq('tenant_id', tenant.id)
        .single()

      if (memberError) throw memberError
      
      setUserRole(memberData?.role || null)

      toast({
        title: "Organización cambiada",
        description: `Has cambiado a ${tenant.name}.`,
      })
    } catch (error) {
      logger.error('Error switching tenant', error);
      toast({
        title: "Error al cambiar organización",
        description: "No se pudo cambiar a la organización seleccionada.",
        variant: "destructive",
      })
    }
  }

  const createTenant = async (tenantData: Partial<Tenant>) => {
    if (!user) return
    
    try {
      // Create the tenant
      const { data: newTenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: tenantData.name,
          slug: tenantData.slug,
          plan: tenantData.plan || 'free',
          is_active: true,
          logo_url: tenantData.logoUrl,
          settings: tenantData.settings || {
            brandColors: {
              primary: '#3B82F6',
              secondary: '#8B5CF6',
              accent: '#10B981'
            },
            features: {
              aiAssistant: false,
              advancedAnalytics: false,
              multiLanguageCampaigns: false,
              customIntegrations: false,
              prioritySupport: false,
              maxUsers: 5,
              maxCampaignsPerMonth: 10,
              maxStorageGb: 5
            },
            locales: ['es-ES'],
            defaultLocale: 'es-ES'
          },
          owner_id: user.id
        })
        .select()
        .single()

      if (tenantError) throw tenantError

      // Add user as member with owner role
      const { error: memberError } = await supabase
        .from('tenant_members')
        .insert({
          user_id: user.id,
          tenant_id: newTenant.id,
          role: 'owner'
        })

      if (memberError) throw memberError

      // Format the new tenant
      const formattedTenant: Tenant = {
        ...newTenant,
        createdAt: new Date(newTenant.created_at),
        updatedAt: new Date(newTenant.updated_at),
        plan: newTenant.plan,
        isActive: newTenant.is_active,
        logoUrl: newTenant.logo_url,
        settings: newTenant.settings,
        ownerId: newTenant.owner_id
      }

      // Update state
      setTenants([...tenants, formattedTenant])
      setCurrentTenant(formattedTenant)
      setUserRole('owner')
      localStorage.setItem('currentTenantId', formattedTenant.id)

      toast({
        title: "Organización creada",
        description: `${formattedTenant.name} ha sido creada exitosamente.`,
      })
    } catch (error) {
      logger.error('Error creating tenant', error);
      toast({
        title: "Error al crear organización",
        description: "No se pudo crear la organización. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateTenant = async (tenantId: string, tenantData: Partial<Tenant>) => {
    try {
      // Update tenant in database
      const { error } = await supabase
        .from('tenants')
        .update({
          name: tenantData.name,
          slug: tenantData.slug,
          plan: tenantData.plan,
          is_active: tenantData.isActive,
          logo_url: tenantData.logoUrl,
          settings: tenantData.settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenantId)

      if (error) throw error

      // Update local state
      const updatedTenants = tenants.map(tenant => {
        if (tenant.id === tenantId) {
          return { ...tenant, ...tenantData, updatedAt: new Date() }
        }
        return tenant
      })

      setTenants(updatedTenants)
      
      if (currentTenant?.id === tenantId) {
        setCurrentTenant(updatedTenants.find(t => t.id === tenantId) || null)
      }

      toast({
        title: "Organización actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      })
    } catch (error) {
      logger.error('Error updating tenant', error);
      toast({
        title: "Error al actualizar organización",
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const inviteMember = async (email: string, role: string) => {
    if (!currentTenant || !user) return

    try {
      // Check if user already exists
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (userError) throw userError

      // Create invitation
      const { error: inviteError } = await supabase
        .from('tenant_invitations')
        .insert({
          tenant_id: currentTenant.id,
          email,
          role,
          status: 'pending',
          invited_by: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })

      if (inviteError) throw inviteError

      // If user exists, add them as a member directly
      if (existingUser) {
        const { error: memberError } = await supabase
          .from('tenant_members')
          .insert({
            user_id: existingUser.id,
            tenant_id: currentTenant.id,
            role
          })

        if (memberError && memberError.code !== '23505') { // Ignore unique constraint violations
          throw memberError
        }
      }

      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${email}.`,
      })
    } catch (error) {
      logger.error('Error inviting member', error);
      toast({
        title: "Error al invitar miembro",
        description: "No se pudo enviar la invitación. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const removeMember = async (userId: string) => {
    if (!currentTenant || !user) return

    try {
      // Check if user is the owner
      if (currentTenant.ownerId === userId) {
        toast({
          title: "Acción no permitida",
          description: "No puedes eliminar al propietario de la organización.",
          variant: "destructive",
        })
        return
      }

      // Remove member
      const { error } = await supabase
        .from('tenant_members')
        .delete()
        .eq('user_id', userId)
        .eq('tenant_id', currentTenant.id)

      if (error) throw error

      toast({
        title: "Miembro eliminado",
        description: "El miembro ha sido eliminado de la organización.",
      })
    } catch (error) {
      logger.error('Error removing member', error);
      toast({
        title: "Error al eliminar miembro",
        description: "No se pudo eliminar al miembro. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    logger.debug('[TenantProvider] State changed', { currentTenant, tenants, userRole, isLoading });
  }, [currentTenant, tenants, userRole, isLoading]);

  const value = {
    currentTenant,
    tenants,
    userRole,
    isLoading,
    switchTenant,
    createTenant,
    updateTenant,
    inviteMember,
    removeMember
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}
