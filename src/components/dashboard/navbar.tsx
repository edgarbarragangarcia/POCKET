'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, Target, Building, LogOut, LayoutDashboard, Briefcase, UserCircle, BarChart3, Users, Zap, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect, useRef } from 'react'
import { ModeToggle } from '@/components/mode-toggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/companies', label: 'Empresas', icon: Briefcase },
  { href: '/campaigns', label: 'Campañas', icon: Zap },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/team', label: 'Equipo', icon: Users },
  { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Cerrar navbar móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node) && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  // Cerrar navbar móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile hamburger button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg border border-slate-200/50 dark:border-slate-700/50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Navbar */}
      <nav 
        ref={navbarRef}
        className={`
          fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-slate-50/95 to-white/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 font-bold whitespace-nowrap group">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <Target className="h-6 w-6 text-white flex-shrink-0" />
                </div>
                <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-xl hidden sm:block">
                  CampaignBuilder
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out group relative overflow-hidden ${ 
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/10'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                      <item.icon className={`h-4 w-4 mr-2 flex-shrink-0 z-10 transition-transform duration-300 ${isActive ? 'text-white' : ''} group-hover:scale-110`} />
                      <span className="z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side - User menu and theme toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <ModeToggle />
              
              {/* User Avatar and Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 border-2 border-slate-200 dark:border-slate-600 shadow-lg">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Administrador</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={signOut} 
                  aria-label="Cerrar sesión"
                  className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile User Section */}
            <div className="pt-4 pb-3 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center px-3">
                <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-600 shadow-lg">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-slate-900 dark:text-white">{user?.email?.split('@')[0]}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Administrador</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ModeToggle />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={signOut} 
                    aria-label="Cerrar sesión"
                    className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below navbar */}
      <div className="h-16" />
    </>
  )
}