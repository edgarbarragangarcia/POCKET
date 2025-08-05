'use client';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewCompanyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!user) {
      toast({
        title: 'Error de autenticación',
        description: 'Debes iniciar sesión para crear una compañía.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const companyData = {
      name: formData.get('name') as string,
      mission: formData.get('mission') as string,
      vision: formData.get('vision') as string,
      objectives: formData.get('objectives') as string,
      user_id: user.id,
      slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
    };

    try {
      const { error } = await supabase.from('organizations').insert([companyData]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Compañía creada',
        description: 'La nueva compañía ha sido registrada exitosamente.',
      });

      router.push('/companies');
    } catch (error: any) {
      toast({
        title: 'Error al crear la compañía',
        description: error.message || 'No se pudo guardar la compañía. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Compañía</h1>
        <p className="text-muted-foreground">Completa la información para registrar una nueva compañía.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Compañía</CardTitle>
            <CardDescription>Define la identidad y los objetivos de la compañía.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Compañía</Label>
              <Input id="name" name="name" placeholder="Ej: Acme Inc." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission">Misión</Label>
              <Textarea id="mission" name="mission" placeholder="¿Cuál es la razón de ser de la compañía?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision">Visión</Label>
              <Textarea id="vision" name="vision" placeholder="¿Qué futuro busca crear la compañía?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objectives">Objetivos y Propósito</Label>
              <Textarea id="objectives" name="objectives" placeholder="Describe las metas, el propósito y el impacto que la compañía busca generar." />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Compañía'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
