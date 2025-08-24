'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, Target, Building, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect, useRef } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Manejar eventos de mouse para expandir/colapsar
  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  return (
    <div 
      ref={sidebarRef}
      className={`flex h-full max-h-screen flex-col gap-2 border-r transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] overflow-hidden">
        <Link href="/" className="flex items-center gap-2 font-semibold whitespace-nowrap">
          <Target className="h-6 w-6 text-primary flex-shrink-0" />
          <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>CampaignBuilder</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all whitespace-nowrap ${ 
                pathname.startsWith(item.href)
                  ? `text-primary ${!isExpanded ? 'justify-center px-0' : ''}`
                  : 'text-muted-foreground hover:text-primary'
              }`}>
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-2 sm:p-4 border-t">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <p className="truncate text-sm font-medium">{user?.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut} 
              aria-label="Cerrar sesión"
              className={`flex-shrink-0 ${!isExpanded ? 'hidden sm:inline-flex' : ''}`}
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
      </div>
    </div>
  )
}
