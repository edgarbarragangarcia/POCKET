'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export default function CompaniesPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOrganizations(data || []);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [user, supabase]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compañías</h1>
          <p className="text-muted-foreground">Gestiona tus compañías y clientes.</p>
        </div>
        <Link href="/companies/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Compañía
          </Button>
        </Link>
      </header>

      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : organizations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Card
                key={org.id}
                onClick={() => router.push(`/companies/${org.id}`)}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{org.name}</CardTitle>
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Creada el {new Date(org.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Aún no tienes compañías</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Crea tu primera compañía para empezar a gestionar tus campañas.
            </p>
            <Link href="/companies/new" className="mt-6 inline-block">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Compañía
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
