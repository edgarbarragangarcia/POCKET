'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Building, 
  Package, 
  Plus, 
  GripVertical,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Definición de tipos para los módulos
export type ModuleType = 'company' | 'product' | 'custom';

export interface Module {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  icon: React.ReactNode;
  data?: any;
}

interface ModuleSidebarProps {
  onModuleDragStart: (module: Module, e: React.DragEvent) => void;
}

export default function ModuleSidebar({ onModuleDragStart }: ModuleSidebarProps) {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['companies', 'products']);

  // Módulos base disponibles
  const baseModules: Module[] = [
    {
      id: 'company-module',
      type: 'company',
      title: 'Compañía',
      description: 'Seleccionar una compañía',
      icon: <Building className="w-4 h-4" />
    },
    {
      id: 'product-module',
      type: 'product',
      title: 'Producto',
      description: 'Seleccionar un producto',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'custom-module',
      type: 'custom',
      title: 'Módulo Personalizado',
      description: 'Añadir configuración personalizada',
      icon: <Plus className="w-4 h-4" />
    }
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Manejo de arrastrar módulos
  const handleDragStart = (module: Module, e: React.DragEvent) => {
    // Guardar datos del módulo para cuando se suelte
    e.dataTransfer.setData('application/json', JSON.stringify(module));
    onModuleDragStart(module, e);
  };

  return (
    <div className="w-64 bg-gray-50 border-l h-full overflow-y-auto">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="font-medium text-lg">Módulos</h2>
        <p className="text-sm text-gray-500">Arrastra para añadir al flujo</p>
      </div>
      
      <div className="p-2">
        {/* Categoría: Compañías */}
        <div className="mb-2">
          <button 
            className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
            onClick={() => toggleCategory('companies')}
          >
            <span className="font-medium">Compañías</span>
            {expandedCategories.includes('companies') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedCategories.includes('companies') && (
            <div className="ml-2 mt-1 space-y-1">
              {baseModules
                .filter(module => module.type === 'company')
                .map(module => (
                  <div
                    key={module.id}
                    className="flex items-center p-2 bg-white rounded-md border shadow-sm cursor-grab hover:shadow-md transition-all"
                    draggable
                    onDragStart={(e) => handleDragStart(module, e)}
                  >
                    <div className="mr-2 text-gray-400">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="mr-2 text-primary">
                      {module.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{module.title}</div>
                      <div className="text-xs text-gray-500">{module.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        
        {/* Categoría: Productos */}
        <div className="mb-2">
          <button 
            className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
            onClick={() => toggleCategory('products')}
          >
            <span className="font-medium">Productos</span>
            {expandedCategories.includes('products') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedCategories.includes('products') && (
            <div className="ml-2 mt-1 space-y-1">
              {baseModules
                .filter(module => module.type === 'product')
                .map(module => (
                  <div
                    key={module.id}
                    className="flex items-center p-2 bg-white rounded-md border shadow-sm cursor-grab hover:shadow-md transition-all"
                    draggable
                    onDragStart={(e) => handleDragStart(module, e)}
                  >
                    <div className="mr-2 text-gray-400">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="mr-2 text-primary">
                      {module.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{module.title}</div>
                      <div className="text-xs text-gray-500">{module.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        
        {/* Categoría: Personalizados */}
        <div className="mb-2">
          <button 
            className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
            onClick={() => toggleCategory('custom')}
          >
            <span className="font-medium">Personalizados</span>
            {expandedCategories.includes('custom') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedCategories.includes('custom') && (
            <div className="ml-2 mt-1 space-y-1">
              {baseModules
                .filter(module => module.type === 'custom')
                .map(module => (
                  <div
                    key={module.id}
                    className="flex items-center p-2 bg-white rounded-md border shadow-sm cursor-grab hover:shadow-md transition-all"
                    draggable
                    onDragStart={(e) => handleDragStart(module, e)}
                  >
                    <div className="mr-2 text-gray-400">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="mr-2 text-primary">
                      {module.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{module.title}</div>
                      <div className="text-xs text-gray-500">{module.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
