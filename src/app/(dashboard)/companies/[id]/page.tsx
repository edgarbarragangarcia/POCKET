'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { ArrowLeft, Save, XCircle, Building, Target, Eye, PenSquare, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductManager } from '@/components/products/product-manager';
import { PersonaManager } from '@/components/personas/PersonaManager';

interface Organization {
  id: string;
  name: string;
  mission: string;
  vision: string;
  objectives: string;
}

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
    const [objectives, setObjectives] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        if (data) {
          setOrganization(data);
          setName(data.name);
          setMission(data.mission);
          setVision(data.vision);
          setObjectives(data.objectives);
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        toast.error('No se pudo cargar la información de la compañía.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [user, supabase, params?.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/companies" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Compañías
          </Link>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold">Compañía no encontrada</h1>
        <p className="text-muted-foreground">No pudimos encontrar la compañía que buscas.</p>
        <Button onClick={() => router.push('/companies')} className="mt-4">Volver a Compañías</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/companies" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Compañías
        </Link>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="persona">User Persona</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <PenSquare className="mr-3 h-6 w-6" />
                Editar Compañía
              </CardTitle>
              <CardDescription>
                Actualiza la información de tu compañía. Los cambios se guardarán automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center text-base">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    Nombre de la Compañía
                  </label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mission" className="flex items-center text-base">
                    <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                    Misión
                  </label>
                  <Textarea id="mission" value={mission} onChange={(e) => setMission(e.target.value)} rows={4} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="vision" className="flex items-center text-base">
                    <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                    Visión
                  </label>
                  <Textarea id="vision" value={vision} onChange={(e) => setVision(e.target.value)} rows={4} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="objectives" className="flex items-center text-base">
                    <PenSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                    Objetivos y Propósito
                  </label>
                  <Textarea id="objectives" value={objectives} onChange={(e) => setObjectives(e.target.value)} rows={4} />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="persona">
          <PersonaManager organizationId={params.id} />
        </TabsContent>
        <TabsContent value="products">
          <ProductManager organizationId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  );

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name,
          mission,
          vision,
          objectives,
        })
        .eq('id', params.id);

      if (error) throw error;

      toast.success('Compañía actualizada con éxito.');
      router.push('/companies'); // Opcional: redirigir tras el éxito
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('No se pudo actualizar la compañía.');
    } finally {
      setIsSubmitting(false);
    }
  }
}
