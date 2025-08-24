'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, Target, Building, LogOut, LayoutDashboard, Briefcase, UserCircle, BarChart3, Users, Zap } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect, useRef } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/companies', label: 'Empresas', icon: Briefcase },
  { href: '/campaigns', label: 'Campañas', icon: Zap },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/team', label: 'Equipo', icon: Users },
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
      className={`flex h-full max-h-screen flex-col gap-2 border-r bg-gradient-to-b from-slate-50/80 to-white/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-xl transition-all duration-300 ease-in-out ${isExpanded ? 'w-72' : 'w-24'} shadow-2xl border-slate-200/50 dark:border-slate-700/50`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex h-20 items-center border-b border-slate-200/50 dark:border-slate-700/50 px-6 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3 font-bold whitespace-nowrap group">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
            <Target className="h-6 w-6 text-white flex-shrink-0" />
          </div>
          <span className={`font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${isExpanded ? 'opacity-100 ml-2 text-xl' : 'opacity-0 w-0'}`}>CampaignBuilder</span>
        </Link>
      </div>
      <div className="flex-1 px-4 py-6">
        <nav className="grid items-start gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl px-4 py-3.5 transition-all duration-300 ease-in-out group relative overflow-hidden ${ 
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/10' // Modern active state
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white' // Modern hover state
                } ${!isExpanded ? 'justify-center' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                <item.icon className={`h-5 w-5 flex-shrink-0 z-10 transition-transform duration-300 ${isActive ? 'text-white' : ''} group-hover:scale-110`} />
                <span className={`font-medium transition-all duration-300 ${isExpanded ? 'opacity-100 ml-4' : 'opacity-0 w-0'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/50 rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-12 w-12 flex-shrink-0 border-2 border-slate-200 dark:border-slate-600 shadow-lg">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm">{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className={`flex-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 ml-3' : 'opacity-0 w-0'}`}>
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Administrador</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut} 
              aria-label="Cerrar sesión"
              className={`flex-shrink-0 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 rounded-lg ${!isExpanded ? 'hidden sm:inline-flex' : ''}`}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
      </div>
    </div>
  )
}
