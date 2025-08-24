"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Building2, LogOut, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTenant } from "@/lib/tenant-context"
import { createLogger } from "@/lib/logger"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TenantSwitcherProps extends PopoverTriggerProps {
  className?: string
}

export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewTenantDialog, setShowNewTenantDialog] = React.useState(false)
  const { currentTenant, tenants, switchTenant, createTenant } = useTenant()
  const router = useRouter()
  const logger = createLogger('TenantSwitcher')

  if (!currentTenant) {
    return null
  }

  return (
    <Dialog open={showNewTenantDialog} onOpenChange={setShowNewTenantDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Seleccionar organización"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              {currentTenant.logoUrl ? (
                <AvatarImage
                  src={currentTenant.logoUrl}
                  alt={currentTenant.name}
                />
              ) : (
                <AvatarFallback>
                  {currentTenant.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="truncate">{currentTenant.name}</span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar organización..." />
              <CommandEmpty>No se encontraron organizaciones.</CommandEmpty>
              <CommandGroup heading="Organizaciones">
                {tenants.map((tenant) => (
                  <CommandItem
                    key={tenant.id}
                    onSelect={() => {
                      switchTenant(tenant.id)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      {tenant.logoUrl ? (
                        <AvatarImage
                          src={tenant.logoUrl}
                          alt={tenant.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {tenant.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{tenant.name}</span>
                    {currentTenant.id === tenant.id && (
                      <CheckIcon className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                  }}
                >
                  <div 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(false);
                      router.push('/dashboard/organization/new');
                    }}
                    className="flex items-center w-full cursor-pointer"
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Crear organización
                  </div>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <NewTenantForm onClose={() => setShowNewTenantDialog(false)} />
      </DialogContent>
    </Dialog>
  )
}

interface TenantMenuProps {
  className?: string
}

export function TenantMenu({ className }: TenantMenuProps) {
  const { currentTenant } = useTenant()
  const { signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const logger = createLogger('TenantMenu')

  if (!currentTenant) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("px-2", className)}>
          <Avatar className="h-6 w-6">
            {currentTenant.logoUrl ? (
              <AvatarImage
                src={currentTenant.logoUrl}
                alt={currentTenant.name}
              />
            ) : (
              <AvatarFallback>
                {currentTenant.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentTenant.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              Plan {currentTenant.plan.charAt(0).toUpperCase() + currentTenant.plan.slice(1)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(`/settings/organization`)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/settings/members`)}>
            <Users className="mr-2 h-4 w-4" />
            <span>Miembros</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/settings/billing`)}>
            <Building2 className="mr-2 h-4 w-4" />
            <span>Facturación</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={async () => {
            try {
              await signOut()
              toast({
                title: "Sesión cerrada",
                description: "Has cerrado sesión exitosamente.",
              })
            } catch (error) {
              logger.error('Error signing out', error)
              toast({
                title: "Error",
                description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
                variant: "destructive",
              })
            }
          }}
          className="text-red-600 dark:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface NewTenantFormProps {
  onClose: () => void
}

function NewTenantForm({ onClose }: NewTenantFormProps) {
  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { createTenant } = useTenant()
  const { toast } = useToast()
  const logger = createLogger('NewTenantForm')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "Campo requerido",
        description: "El nombre de la organización es obligatorio.",
        variant: "destructive",
      })
      return
    }

    // Generate slug from name if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-")

    try {
      setIsLoading(true)
      await createTenant({
        name,
        slug: finalSlug,
      })
      onClose()
    } catch (error) {
      logger.error('Error creating tenant', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Crear nueva organización</DialogTitle>
        <DialogDescription>
          Añade una nueva organización para gestionar tus campañas de forma separada.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Mi Organización"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                // Auto-generate slug when name changes
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
              }}
              className="bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">
              URL de la organización
              <span className="text-muted-foreground ml-1 text-xs">(opcional)</span>
            </Label>
            <Input
              id="slug"
              placeholder="mi-organizacion"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              className="bg-background"
            />
            {slug && (
              <p className="text-xs text-muted-foreground">
                campaignmanager.app/{slug}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
