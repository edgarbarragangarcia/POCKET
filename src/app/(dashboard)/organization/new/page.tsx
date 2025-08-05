'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useTenant } from '@/lib/tenant-context'

export default function NewOrganizationPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { createTenant } = useTenant()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    mission: '',
    vision: '',
    objectives: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !prev.slug ? 
          { slug: value.toLowerCase().replace(/\s+/g, "-") } : {})
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Campo requerido",
        description: "El nombre de la organización es obligatorio.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      await createTenant({
        name: formData.name,
        slug: formData.slug,
        settings: {
          brandColors: {
            primary: '#3B82F6',
            secondary: '#10B981',
            accent: '#8B5CF6'
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
          locales: ['es'],
          defaultLocale: 'es',
          customDomain: formData.slug ? `${formData.slug}.campaignmanager.app` : undefined
        }
      })
      
      if (formData.mission || formData.vision || formData.objectives) {
        localStorage.setItem('organization-metadata', JSON.stringify({
          mission: formData.mission,
          vision: formData.vision,
          objectives: formData.objectives
        }))
      }

      toast({
        title: "Organización creada",
        description: "Tu organización ha sido creada exitosamente con todos los datos.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error creating tenant:", error)
      toast({
        title: "Error al crear organización",
        description: error.message || "No se pudo crear la organización. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <CardTitle>Nueva organización</CardTitle>
          </div>
          <CardDescription>
            Crea una nueva organización y define su misión, visión y objetivos para establecer una dirección clara.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre de la organización *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Mi Organización"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="slug">
                  URL de la organización
                  <span className="text-muted-foreground ml-1 text-xs">(opcional)</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="mi-organizacion"
                  value={formData.slug}
                  onChange={handleChange}
                  className="bg-background"
                />
                {formData.slug && (
                  <p className="text-xs text-muted-foreground">
                    campaignmanager.app/{formData.slug}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Información organizacional</h3>
              <p className="text-sm text-muted-foreground">
                Define los valores fundamentales y objetivos de tu organización.
              </p>
              
              <div className="grid gap-2">
                <Label htmlFor="mission">Misión</Label>
                <Textarea
                  id="mission"
                  name="mission"
                  placeholder="¿Cuál es la misión principal de tu organización?"
                  value={formData.mission}
                  onChange={handleChange}
                  className="bg-background min-h-[100px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="vision">Visión</Label>
                <Textarea
                  id="vision"
                  name="vision"
                  placeholder="¿Cuál es la visión a largo plazo de tu organización?"
                  value={formData.vision}
                  onChange={handleChange}
                  className="bg-background min-h-[100px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="objectives">Objetivos organizacionales</Label>
                <Textarea
                  id="objectives"
                  name="objectives"
                  placeholder="¿Cuáles son los principales objetivos de tu organización? Sepáralos por líneas."
                  value={formData.objectives}
                  onChange={handleChange}
                  className="bg-background min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  Escribe cada objetivo en una línea separada.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear organización"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
