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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-muted-foreground">Gestiona la configuración de tu cuenta y de la organización.</p>
      </header>

      <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Facturación
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-2 h-4 w-4" />
            Equipo
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Puzzle className="mr-2 h-4 w-4" />
            Integraciones
          </TabsTrigger>
        </TabsList>

                <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil Público</CardTitle>
              <CardDescription>Esta información será visible para otros en la plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email || ''}.png`} alt="Avatar" />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Button variant="outline">Cambiar Foto</Button>
                  <p className="text-xs text-muted-foreground">JPG, GIF o PNG. 1MB max.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" defaultValue={user?.email?.split('@')[0] || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
              <Button>Guardar Cambios</Button>
              <Button variant="destructive" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

                <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Plan y Facturación</CardTitle>
              <CardDescription>Actualmente estás en el plan Gratuito. ¡Actualiza para más funciones!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Plan Gratuito</h3>
                  <p className="text-sm text-muted-foreground">Funcionalidades básicas para empezar.</p>
                </div>
                <Button>Ver Planes</Button>
              </div>
              <h4 className="text-md font-semibold pt-4">Método de Pago</h4>
              <p className="text-sm text-muted-foreground">No hay un método de pago guardado.</p>
            </CardContent>
          </Card>
        </TabsContent>

                <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Miembros del Equipo</CardTitle>
              <CardDescription>Invita y colabora con tu equipo.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Invita a tu equipo</h3>
              <p className="mt-2 text-sm text-muted-foreground">La gestión de equipos estará disponible en el plan Pro.</p>
              <Button className="mt-6">Actualizar a Pro</Button>
            </CardContent>
          </Card>
        </TabsContent>

                <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integraciones</CardTitle>
              <CardDescription>Potencia tu flujo de trabajo conectando otras apps.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Puzzle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Conecta tus Herramientas</h3>
              <p className="mt-2 text-sm text-muted-foreground">Las integraciones estarán disponibles pronto.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
