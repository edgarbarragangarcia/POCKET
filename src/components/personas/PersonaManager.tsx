'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, User, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonaDialog } from './PersonaDialog';

// Definición de la interfaz para un User Persona
interface UserPersona {
  id: string;
  organization_id: string;
  name: string;
  age?: number;
  gender?: string;
  occupation?: string;
  goals?: string[];
  frustrations?: string[];
  motivations?: string[];
  bio?: string;
  created_at: string;
}

// Props que recibirá el componente
interface PersonaManagerProps {
  organizationId: string;
}

export function PersonaManager({ organizationId }: PersonaManagerProps) {
  const supabase = createClientComponentClient();
  const [personas, setPersonas] = useState<UserPersona[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para cargar los personas al montar el componente
  useEffect(() => {
    const fetchPersonas = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_personas')
          .select('*')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPersonas(data || []);
      } catch (error) {
        console.error('Error fetching user personas:', error);
        toast.error('No se pudieron cargar los user personas.');
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      fetchPersonas();
    }
  }, [organizationId, supabase]);

  const handleSavePersona = async (personaData: Omit<UserPersona, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('user_personas')
        .insert({ ...personaData, organization_id: organizationId })
        .select()
        .single();

      if (error) throw error;

      setPersonas((prev) => [data, ...prev]);
      toast.success('User Persona creado con éxito.');
    } catch (error) {
      console.error('Error creating user persona:', error);
      toast.error('No se pudo crear el user persona.');
    }
  };

  const handleUpdatePersona = async (personaId: string, personaData: Partial<Omit<UserPersona, 'id'>>) => {
    try {
      const { data, error } = await supabase
        .from('user_personas')
        .update(personaData)
        .eq('id', personaId)
        .select()
        .single();

      if (error) throw error;

      setPersonas((prev) =>
        prev.map((p) => (p.id === personaId ? data : p))
      );
      toast.success('User Persona actualizado con éxito.');
    } catch (error) {
      console.error('Error updating user persona:', error);
      toast.error('No se pudo actualizar el user persona.');
    }
  };

  const handleDeletePersona = async (personaId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este User Persona? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_personas')
        .delete()
        .eq('id', personaId);

      if (error) throw error;

      setPersonas((prev) => prev.filter((p) => p.id !== personaId));
      toast.success('User Persona eliminado con éxito.');
    } catch (error) {
      console.error('Error deleting user persona:', error);
      toast.error('No se pudo eliminar el user persona.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>User Personas</CardTitle>
            <CardDescription>Gestiona los perfiles de usuario de esta compañía.</CardDescription>
          </div>
          <PersonaDialog onSave={handleSavePersona}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Persona
            </Button>
          </PersonaDialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : personas.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ocupación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personas.map((persona) => (
                  <TableRow key={persona.id}>
                    <TableCell className="font-medium">{persona.name}</TableCell>
                    <TableCell>{persona.occupation || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <PersonaDialog persona={persona} onSave={(data) => handleUpdatePersona(persona.id, data)}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </PersonaDialog>
                        <Button variant="outline" size="icon" onClick={() => handleDeletePersona(persona.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <Package className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Sin User Personas</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta compañía aún no tiene perfiles. Añade tu primer persona.
            </p>
            <PersonaDialog onSave={handleSavePersona}>
                <Button className="mt-4">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Añadir Persona
                </Button>
            </PersonaDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
