'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PlusCircle, Package, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductDialog } from './ProductDialog';

// Types
interface Product {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  sku: string;
}

interface ProductManagerProps {
  organizationId: string;
}

export function ProductManager({ organizationId }: ProductManagerProps) {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error('Error al cargar los productos.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, organizationId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (formData: ProductFormData) => {
    if (!formData.name) {
      toast.error('El nombre del producto es obligatorio.');
      return;
    }
    try {
      const { error } = await supabase.from('products').insert([
        {
          ...formData,
          price: formData.price !== '' ? Number(formData.price) : null,
          organization_id: organizationId,
        },
      ]);
      if (error) throw error;
      toast.success('Producto creado con éxito.');
      await fetchProducts();
    } catch (error) {
      toast.error('No se pudo crear el producto.');
    }
  };

  const handleUpdateProduct = async (id: string, formData: ProductFormData) => {
    if (!formData.name) {
      toast.error('El nombre del producto es obligatorio.');
      return;
    }
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          price: formData.price !== '' ? Number(formData.price) : null,
        })
        .eq('id', id);
      if (error) throw error;
      toast.success('Producto actualizado con éxito.');
      await fetchProducts();
    } catch (error) {
      toast.error('No se pudo actualizar el producto.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Producto eliminado con éxito.');
      await fetchProducts();
    } catch (error) {
      toast.error('No se pudo eliminar el producto.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Productos</CardTitle>
            <CardDescription>Gestiona los productos de esta compañía.</CardDescription>
          </div>
          <ProductDialog onSave={handleSaveProduct}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </ProductDialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : products.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {product.price != null ? `$${product.price.toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell>{product.sku || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <ProductDialog product={product} onSave={(data) => handleUpdateProduct(product.id, data)}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </ProductDialog>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)}>
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
          <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg h-60">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No hay productos todavía</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Empieza por añadir tu primer producto.
            </p>
            <ProductDialog onSave={handleSaveProduct}>
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Producto
              </Button>
            </ProductDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
