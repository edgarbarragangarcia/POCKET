'use client'

import React, { useState, useEffect } from 'react'
import { useTenant } from '@/lib/tenant-context'
import { useAuth } from '@/lib/auth-context'
import { TenantMember, TenantInvitation, TenantRole } from '@/models/tenant'
import { MembersTable } from '@/components/members/members-table'
import { Button } from '@/components/ui/button'

export default function MembersPage() {
  const { currentTenant } = useTenant()
  const { user } = useAuth()
  const [members, setMembers] = useState<TenantMember[]>([])
  const [invitations, setInvitations] = useState<TenantInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (currentTenant && user) {
      // Mock members data
      const mockMembers: TenantMember[] = [
        {
          id: "1",
          tenantId: currentTenant.id,
          userId: user.id,
          role: TenantRole.OWNER,
          joinedAt: new Date(2023, 5, 15),
          invitedBy: null
        },
        {
          id: "2",
          tenantId: currentTenant.id,
          userId: "user-2",
          role: TenantRole.ADMIN,
          joinedAt: new Date(2023, 6, 20),
          invitedBy: user.id
        }
      ]

      // Mock invitations data
      const mockInvitations: TenantInvitation[] = [
        {
          id: "1",
          tenantId: currentTenant.id,
          email: "pending@example.com",
          role: TenantRole.EDITOR,
          status: "pending",
          createdAt: new Date(2023, 7, 1),
          expiresAt: new Date(2023, 8, 1),
          invitedBy: user.id
        }
      ]

      setMembers(mockMembers)
      setInvitations(mockInvitations)
      setIsLoading(false)
    }
  }, [currentTenant, user])

  if (isLoading || !currentTenant) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Miembros</h2>
        <p className="text-muted-foreground">
          Gestiona los miembros e invitaciones de tu organización {currentTenant.name}.
        </p>
      </div>

      <div className="space-y-4">
        <MembersTable members={members} invitations={invitations} />
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Límites de tu plan:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Tu plan <span className="font-medium">{currentTenant.plan?.toUpperCase() || 'FREE'}</span> permite 
              un máximo de 5 miembros.
            </li>
            <li>
              Estás utilizando {members.length} de 5 asientos disponibles.
            </li>
            {members.length >= 5 && (
              <li className="text-destructive">
                Has alcanzado el límite de miembros para tu plan actual. 
                <Button variant="link" className="h-auto p-0 ml-1">
                  Actualiza tu plan
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
