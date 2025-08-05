'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';

export default function CreateProductsPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createSampleProducts = async () => {
    if (!user) {
      setMessage('❌ Usuario no autenticado');
      return;
    }

    setLoading(true);
    setMessage('🔄 Creando productos...');

    try {
      // Get the organization ID
      const { data: organizations, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('user_id', user.id)
        .limit(1);

      if (orgError) {
        console.error('Error fetching organizations:', orgError);
        setMessage('❌ Error al obtener organizaciones');
        return;
      }

      if (!organizations || organizations.length === 0) {
        setMessage('❌ No se encontraron organizaciones. Crea una organización primero.');
        return;
      }

      const organizationId = organizations[0].id;
      console.log(`Using organization: ${organizations[0].name} (${organizationId})`);

      // Check if products already exist
      const { data: existingProducts } = await supabase
        .from('products')
        .select('id')
        .eq('organization_id', organizationId);

      if (existingProducts && existingProducts.length > 0) {
        setMessage(`✅ Ya tienes ${existingProducts.length} productos creados. Ve al Constructor de Campañas para usarlos.`);
        setLoading(false);
        return;
      }

      // Sample products for Ingenes
      const sampleProducts = [
        {
          organization_id: organizationId,
          name: 'Tratamiento de Fertilidad Básico',
          description: 'Paquete completo de tratamiento de fertilidad que incluye consultas, estudios y procedimientos básicos.',
          price: 15000.00,
          sku: 'TFB-001'
        },
        {
          organization_id: organizationId,
          name: 'Tratamiento de Fertilidad Premium',
          description: 'Paquete premium que incluye todos los servicios básicos más tratamientos avanzados y seguimiento personalizado.',
          price: 25000.00,
          sku: 'TFP-001'
        },
        {
          organization_id: organizationId,
          name: 'Consulta de Evaluación',
          description: 'Consulta inicial para evaluación de fertilidad con especialista certificado.',
          price: 2500.00,
          sku: 'CE-001'
        },
        {
          organization_id: organizationId,
          name: 'Estudios de Laboratorio',
          description: 'Paquete completo de estudios de laboratorio para diagnóstico de fertilidad.',
          price: 5000.00,
          sku: 'EL-001'
        },
        {
          organization_id: organizationId,
          name: 'Preservación de Fertilidad',
          description: 'Servicios de preservación de óvulos y esperma para futuras necesidades reproductivas.',
          price: 18000.00,
          sku: 'PF-001'
        }
      ];

      // Insert products
      const { data, error } = await supabase
        .from('products')
        .insert(sampleProducts)
        .select();

      if (error) {
        console.error('Error inserting products:', error);
        setMessage('❌ Error al crear productos: ' + error.message);
        return;
      }

      setMessage(`✅ ¡Productos creados exitosamente! Se crearon ${data.length} productos.`);
      console.log('Products created:', data);

    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('❌ Error inesperado: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Crear Productos de Ejemplo</h1>
        <p className="text-muted-foreground">
          Crea productos de ejemplo para probar el Constructor de Campañas
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Productos de Ejemplo para Ingenes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Este botón creará 5 productos de ejemplo relacionados con tratamientos de fertilidad:
          </p>
          
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• Tratamiento de Fertilidad Básico ($15,000)</li>
            <li>• Tratamiento de Fertilidad Premium ($25,000)</li>
            <li>• Consulta de Evaluación ($2,500)</li>
            <li>• Estudios de Laboratorio ($5,000)</li>
            <li>• Preservación de Fertilidad ($18,000)</li>
          </ul>

          <div className="pt-4">
            <Button 
              onClick={createSampleProducts} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creando productos...' : 'Crear Productos de Ejemplo'}
            </Button>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('❌') ? 'bg-red-50 text-red-700' : 
              message.includes('✅') ? 'bg-green-50 text-green-700' : 
              'bg-blue-50 text-blue-700'
            }`}>
              {message}
            </div>
          )}

          {message.includes('✅') && (
            <div className="pt-4">
              <Button 
                onClick={() => window.location.href = '/campaigns'}
                variant="outline"
                className="w-full"
              >
                Ir al Constructor de Campañas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
