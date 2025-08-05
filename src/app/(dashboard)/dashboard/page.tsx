'use client';

import React, { useState } from "react";
// Placeholder imports for all components and utilities used
import { Button } from "@/components/ui/button";
import { Calendar, Layers, Eye, Activity, TrendingUp, Users, BarChart2, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MetricCard } from "../../../components/dashboard/MetricCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const campaignData = [
  { name: 'Día 1', Clics: 400, Impresiones: 2400 },
  { name: 'Día 5', Clics: 300, Impresiones: 1398 },
  { name: 'Día 10', Clics: 200, Impresiones: 9800 },
  { name: 'Día 15', Clics: 278, Impresiones: 3908 },
  { name: 'Día 20', Clics: 189, Impresiones: 4800 },
  { name: 'Día 25', Clics: 239, Impresiones: 3800 },
  { name: 'Día 30', Clics: 349, Impresiones: 4300 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading] = useState(false); // Placeholder for loading state

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}!</h1>
          <p className="text-muted-foreground">Aquí tienes un resumen de tus campañas y rendimiento.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Últimos 30 días
          </Button>
          <Button size="sm">
            <Layers className="mr-2 h-4 w-4" />
            Nueva campaña
          </Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-grid sm:grid-cols-3">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analytics">Analítica</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Impresiones totales" 
              value="356,789"
              trend="+12.5%"
              description="vs. periodo anterior"
              icon={<Eye className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard 
              title="Clics"
              value="28,453"
              trend="+7.2%"
              description="vs. periodo anterior"
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard 
              title="Conversiones"
              value="1,642"
              trend="+23.1%"
              description="vs. periodo anterior"
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard 
              title="Costo por adquisición"
              value={formatCurrency(28.75)}
              trend="-5.3%"
              description="vs. periodo anterior"
              trendDirection="down"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Rendimiento de Campañas</CardTitle>
                <CardDescription>
                  Evolución de clics e impresiones en los últimos 30 días.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Impresiones" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Clics" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle>Campañas Recientes</CardTitle>
                <CardDescription>Tus campañas activas más recientes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Layers className="h-6 w-6 mr-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Campaña de Verano</p>
                      <p className="text-sm text-muted-foreground">Activa - Finaliza en 15 días</p>
                    </div>
                    <Button variant="outline" size="sm">Ver</Button>
                  </div>
                  <div className="flex items-center">
                    <Layers className="h-6 w-6 mr-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Lanzamiento Producto X</p>
                      <p className="text-sm text-muted-foreground">Activa - Finaliza en 25 días</p>
                    </div>
                    <Button variant="outline" size="sm">Ver</Button>
                  </div>
                  <div className="flex items-center">
                    <Layers className="h-6 w-6 mr-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Oferta Black Friday</p>
                      <p className="text-sm text-muted-foreground">Pausada</p>
                    </div>
                    <Button variant="outline" size="sm">Ver</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
                <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analítica Avanzada</CardTitle>
              <CardDescription>Profundiza en los datos de tus campañas.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-16">
              <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Análisis Detallado Próximamente</h3>
              <p className="mt-2 text-sm text-muted-foreground">Estamos trabajando en gráficos y métricas avanzadas.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generador de Reportes</CardTitle>
              <CardDescription>Crea y exporta reportes personalizados.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-16">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Reportes a tu Medida</h3>
              <p className="mt-2 text-sm text-muted-foreground">Pronto podrás generar y descargar reportes en PDF y CSV.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

