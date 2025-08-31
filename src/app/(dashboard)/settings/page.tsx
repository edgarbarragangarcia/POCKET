"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, CreditCard, Users, Puzzle, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Ajustes</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Gestiona la configuración de tu cuenta y de la organización.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
                <TabsList className="flex w-full bg-gradient-to-r from-slate-50/80 to-white/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-xl rounded-2xl p-1.5 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 dark:data-[state=active]:shadow-indigo-500/10 rounded-xl transition-all duration-300 ease-in-out py-3 px-4 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-center">
            <UserCircle className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 dark:data-[state=active]:shadow-indigo-500/10 rounded-xl transition-all duration-300 ease-in-out py-3 px-4 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Facturación
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 dark:data-[state=active]:shadow-indigo-500/10 rounded-xl transition-all duration-300 ease-in-out py-3 px-4 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-center">
            <Users className="mr-2 h-4 w-4" />
            Equipo
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 dark:data-[state=active]:shadow-indigo-500/10 rounded-xl transition-all duration-300 ease-in-out py-3 px-4 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-center">
            <Puzzle className="mr-2 h-4 w-4" />
            Integraciones
          </TabsTrigger>
        </TabsList>

                <TabsContent value="profile" className="space-y-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Perfil Público
            </h2>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mb-6">Esta información será visible para otros en la plataforma.</CardDescription>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email || ''}.png`} alt="Avatar" />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Button variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">Cambiar Foto</Button>
                  <p className="text-xs text-slate-500 dark:text-slate-400">JPG, GIF o PNG. 1MB max.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre</Label>
                <Input id="name" defaultValue={user?.email?.split('@')[0] || ''} className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 mt-6 pt-6 flex justify-between items-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Guardar Cambios</Button>
              <Button variant="destructive" onClick={signOut} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </TabsContent>

                <TabsContent value="billing" className="space-y-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Plan y Facturación
            </h2>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mb-6">Actualmente estás en el plan Gratuito. ¡Actualiza para más funciones!</CardDescription>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Plan Gratuito</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">Funcionalidades básicas para empezar.</p>
                </div>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">Ver Planes</Button>
              </div>
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 pt-4">Método de Pago</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">No hay un método de pago guardado.</p>
            </div>
          </div>
        </TabsContent>

                <TabsContent value="team" className="space-y-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Miembros del Equipo
            </h2>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mb-6">Invita y colabora con tu equipo.</CardDescription>
            <div className="text-center py-12 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <Users className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
              <h3 className="mt-4 text-lg font-medium text-purple-700 dark:text-purple-300">Invita a tu equipo</h3>
              <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">La gestión de equipos estará disponible en el plan Pro.</p>
              <Button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Actualizar a Pro</Button>
            </div>
          </div>
        </TabsContent>

                <TabsContent value="integrations" className="space-y-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Integraciones
            </h2>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mb-6">Potencia tu flujo de trabajo conectando otras apps.</CardDescription>
            <div className="text-center py-12 bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
              <Puzzle className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
              <h3 className="mt-4 text-lg font-medium text-orange-700 dark:text-orange-300">Conecta tus Herramientas</h3>
              <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">Las integraciones estarán disponibles pronto.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
