"use client"

import * as React from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { MoreHorizontal, ExternalLink, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Campaign {
  id: string
  name: string
  status: "active" | "paused" | "draft" | "completed" | "scheduled"
  type: string
  budget: number
  impressions: number
  clicks: number
  lastModified: Date
}

const recentCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Promoción de verano",
    status: "active",
    type: "Display",
    budget: 5000,
    impressions: 24500,
    clicks: 1050,
    lastModified: new Date("2023-06-15"),
  },
  {
    id: "2",
    name: "Remarketing clientes",
    status: "active",
    type: "Remarketing",
    budget: 3200,
    impressions: 15700,
    clicks: 820,
    lastModified: new Date("2023-06-10"),
  },
  {
    id: "3",
    name: "Lanzamiento Producto X",
    status: "scheduled",
    type: "Social Media",
    budget: 8000,
    impressions: 0,
    clicks: 0,
    lastModified: new Date("2023-06-08"),
  },
  {
    id: "4",
    name: "Campaña SEO Q2",
    status: "draft",
    type: "Search",
    budget: 2500,
    impressions: 0,
    clicks: 0,
    lastModified: new Date("2023-06-05"),
  },
  {
    id: "5",
    name: "Black Friday 2022",
    status: "completed",
    type: "Multi-channel",
    budget: 15000,
    impressions: 142000,
    clicks: 8300,
    lastModified: new Date("2022-11-30"),
  },
]

export function RecentCampaignsTable() {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Impresiones</TableHead>
              <TableHead className="hidden md:table-cell">Clics</TableHead>
              <TableHead className="hidden md:table-cell">Última modificación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <CampaignStatusBadge status={campaign.status} />
                </TableCell>
                <TableCell>{campaign.type}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {campaign.impressions.toLocaleString()}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {campaign.clicks.toLocaleString()}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(campaign.lastModified)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface CampaignStatusBadgeProps {
  status: Campaign["status"]
}

function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const statusConfig: Record<Campaign["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    active: { 
      label: "Activa", 
      variant: "default"
    },
    paused: { 
      label: "Pausada", 
      variant: "secondary"
    },
    draft: { 
      label: "Borrador", 
      variant: "outline"
    },
    completed: { 
      label: "Completada", 
      variant: "outline"
    },
    scheduled: { 
      label: "Programada", 
      variant: "secondary"
    }
  }

  const config = statusConfig[status]
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}
