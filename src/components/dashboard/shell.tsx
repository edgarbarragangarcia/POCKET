"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  FileSpreadsheet, 
  Grid, 
  ImageIcon, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  TextIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { TenantSwitcher, TenantMenu } from "@/components/tenant-switcher"
import { useTenant } from "@/lib/tenant-context"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Creatividad",
    href: "/dashboard/creative",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    title: "Plantillas",
    href: "/dashboard/templates",
    icon: <TextIcon className="h-5 w-5" />,
  },
  {
    title: "Audiencias",
    href: "/dashboard/audiences",
    icon: <Grid className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Configuración",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
