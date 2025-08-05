"use client"

import * as React from "react"
import { 
  MoreHorizontal, 
  Mail, 
  Trash2, 
  Shield, 
  UserCog,
  Check,
  X
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

import { useTenant } from "@/lib/tenant-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { TenantMember, TenantRole, TenantInvitation } from "@/models/tenant"
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MembersTableProps {
  members: TenantMember[]
  invitations: TenantInvitation[]
}

export function MembersTable({ members, invitations }: MembersTableProps) {
  const { currentTenant, userRole, removeMember, inviteMember } = useTenant()
  const [showInviteDialog, setShowInviteDialog] = React.useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = React.useState(false)
  const [memberToRemove, setMemberToRemove] = React.useState<TenantMember | null>(null)
  const { toast } = useToast()

  const canManageMembers = userRole === TenantRole.OWNER || userRole === TenantRole.ADMIN
  
  const handleRemoveMember = async () => {
    if (!memberToRemove) return
    
    try {
      await removeMember(memberToRemove.userId)
      setShowRemoveDialog(false)
      setMemberToRemove(null)
    } catch (error) {
      console.error("Error removing member:", error)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Miembros</h3>
          {canManageMembers && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowInviteDialog(true)}
            >
              Invitar
            </Button>
          )}
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3">
                  Ingreso
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr 
                  key={member.id} 
                  className="bg-background border-b hover:bg-muted/20"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {member.userId.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {member.userId === currentTenant?.ownerId && (
                        <span className="text-xs text-muted-foreground block">Tú</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {member.email || "No email available"}
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(member.joinedAt, {
                      addSuffix: true,
                      locale: es
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canManageMembers && member.userId !== currentTenant?.ownerId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              // Change role functionality (would be implemented in a separate dialog)
                              toast({
                                title: "Cambiar rol",
                                description: "Funcionalidad en desarrollo",
                              })
                            }}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>Cambiar rol</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setMemberToRemove(member)
                              setShowRemoveDialog(true)
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}

              {/* Show pending invitations */}
              {invitations
                .filter(inv => inv.status === "pending")
                .map((invitation) => (
                <tr 
                  key={invitation.id} 
                  className="bg-background border-b hover:bg-muted/20 text-muted-foreground"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {invitation.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground block">Invitado</span>
                  </td>
                  <td className="px-6 py-4">
                    {invitation.email}
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={invitation.role} />
                    <span className="ml-2 text-xs text-muted-foreground">(Pendiente)</span>
                  </td>
                  <td className="px-6 py-4">
                    Invitado {formatDistanceToNow(invitation.createdAt, {
                      addSuffix: true,
                      locale: es
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canManageMembers && (
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteMemberDialog 
        open={showInviteDialog} 
        onClose={() => setShowInviteDialog(false)}
      />

      <RemoveMemberDialog
        open={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={handleRemoveMember}
        memberEmail={memberToRemove ? "user@example.com" : ""}
      />
    </>
  )
}

function RoleBadge({ role }: { role: string }) {
  let variant: "default" | "outline" | "secondary" | "destructive" = "default"
  let label = role.charAt(0).toUpperCase() + role.slice(1)
  let icon = null

  switch (role) {
    case TenantRole.OWNER:
      variant = "destructive"
      icon = <Shield className="h-3 w-3 mr-1" />
      break
    case TenantRole.ADMIN:
      variant = "default"
      break
    case TenantRole.EDITOR:
      variant = "secondary"
      break
    case TenantRole.VIEWER:
      variant = "outline"
      break
  }

  return (
    <Badge variant={variant} className="font-normal">
      {icon}{label}
    </Badge>
  )
}

interface InviteMemberDialogProps {
  open: boolean
  onClose: () => void
}

function InviteMemberDialog({ open, onClose }: InviteMemberDialogProps) {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<string>(TenantRole.VIEWER)
  const [isLoading, setIsLoading] = React.useState(false)
  const { inviteMember } = useTenant()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Campo requerido",
        description: "Por favor, introduce un correo electrónico.",
        variant: "destructive",
      })
      return
    }
    
    try {
      setIsLoading(true)
      await inviteMember(email, role)
      setEmail("")
      setRole(TenantRole.VIEWER)
      onClose()
    } catch (error) {
      console.error("Error inviting member:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar miembro</DialogTitle>
          <DialogDescription>
            Invita a un nuevo miembro a tu organización. Se le enviará un correo electrónico con instrucciones para unirse.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TenantRole.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={TenantRole.EDITOR}>Editor</SelectItem>
                  <SelectItem value={TenantRole.VIEWER}>Visualizador</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {role === TenantRole.ADMIN && "Acceso completo a la configuración y gestión de la organización."}
                {role === TenantRole.EDITOR && "Puede crear y editar campañas, pero no acceder a la configuración."}
                {role === TenantRole.VIEWER && "Solo puede ver campañas, sin permisos de edición."}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar invitación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface RemoveMemberDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  memberEmail: string
}

function RemoveMemberDialog({ open, onClose, onConfirm, memberEmail }: RemoveMemberDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      await onConfirm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar miembro</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a este miembro de la organización? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            El usuario <strong>{memberEmail}</strong> perderá todo acceso a esta organización.
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar miembro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
