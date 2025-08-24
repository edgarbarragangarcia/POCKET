'use client';

import React, { useState } from 'react';
import { createLogger } from '@/lib/logger';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from "@/components/ui/card";
import { Building, Package, Plus, X, Settings, ArrowDownUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Module, ModuleType } from './module-sidebar';

interface PlacedModule extends Module {
  instanceId: string;
  position: {
    x: number;
    y: number;
  };
  connections: string[];
}

interface ModuleCanvasProps {
  selectedCompanyId?: string;
}

export default function ModuleCanvas({ selectedCompanyId }: ModuleCanvasProps) {
  const logger = createLogger('ModuleCanvas');
  const supabase = createClientComponentClient();
  const [placedModules, setPlacedModules] = useState<PlacedModule[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  
  // Manejo de soltar módulos en el lienzo
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const moduleData = JSON.parse(e.dataTransfer.getData('application/json')) as Module;
      if (!moduleData) return;
      
      // Calcular posición relativa al lienzo
      const canvas = e.currentTarget as HTMLDivElement;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Crear nueva instancia del módulo
      const instanceId = `${moduleData.type}-${Date.now()}`;
      const newModule: PlacedModule = {
        ...moduleData,
        instanceId,
        position: { x, y },
        connections: []
      };
      
      setPlacedModules(prev => [...prev, newModule]);
    } catch (error) {
      logger.error('Error al colocar el módulo', error);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Permitir mover módulos dentro del lienzo
  const handleModuleDragStart = (instanceId: string, e: React.DragEvent) => {
    setActiveModule(instanceId);
    e.dataTransfer.setData('module/instanceId', instanceId);
    
    // Ajustar offset del cursor para que el módulo no salte a la posición del cursor
    const moduleElement = e.currentTarget as HTMLDivElement;
    const rect = moduleElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    e.dataTransfer.setData('module/offset', JSON.stringify({ x: offsetX, y: offsetY }));
  };
  
  const handleModuleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const instanceId = e.dataTransfer.getData('module/instanceId');
    if (!instanceId) return handleDrop(e);
    
    // Mover un módulo existente
    try {
      const offset = JSON.parse(e.dataTransfer.getData('module/offset')) || { x: 0, y: 0 };
      const canvas = e.currentTarget as HTMLDivElement;
      const rect = canvas.getBoundingClientRect();
      
      const x = e.clientX - rect.left - offset.x;
      const y = e.clientY - rect.top - offset.y;
      
      setPlacedModules(prev => 
        prev.map(module => 
          module.instanceId === instanceId 
            ? { ...module, position: { x, y } } 
            : module
        )
      );
      
      setActiveModule(null);
    } catch (error) {
      logger.error('Error al mover el módulo', error);
    }
  };
  
  const removeModule = (instanceId: string) => {
    setPlacedModules(prev => prev.filter(m => m.instanceId !== instanceId));
  };
  
  // Renderizar el contenido específico de cada tipo de módulo
  const renderModuleContent = (module: PlacedModule) => {
    switch (module.type) {
      case 'company':
        return (
          <div className="text-sm">
            <p className="font-medium">Compañía seleccionada:</p>
            <p>{selectedCompanyId || 'Ninguna seleccionada'}</p>
            <Button size="sm" variant="outline" className="mt-2 text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Configurar
            </Button>
          </div>
        );
        
      case 'product':
        return (
          <div className="text-sm">
            <p className="font-medium">Producto:</p>
            <p className="text-gray-500">Selecciona un producto</p>
            <Button size="sm" variant="outline" className="mt-2 text-xs">
              <ArrowDownUp className="w-3 h-3 mr-1" />
              Ver productos
            </Button>
          </div>
        );
        
      case 'custom':
        return (
          <div className="text-sm">
            <p className="font-medium">Módulo personalizado:</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="text-xs">Opción 1</Button>
              <Button size="sm" variant="outline" className="text-xs">Opción 2</Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Añadir
              </Button>
            </div>
          </div>
        );
        
      default:
        return <p>Módulo sin configurar</p>;
    }
  };
  
  // Obtener el ícono correspondiente al tipo de módulo
  const getModuleIcon = (type: ModuleType) => {
    switch (type) {
      case 'company':
        return <Building className="w-4 h-4" />;
      case 'product':
        return <Package className="w-4 h-4" />;
      case 'custom':
        return <Plus className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };
  
  // Dibujar conexiones entre módulos
  const renderConnections = () => {
    // Esta función renderizaría las líneas SVG entre los módulos conectados
    // Por ahora es un placeholder para la funcionalidad completa
    return null;
  };
  
  return (
    <div 
      className="relative flex-1 bg-gray-50 border rounded-md min-h-[500px] overflow-hidden"
      onDrop={handleModuleDrop}
      onDragOver={handleDragOver}
    >
      {placedModules.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col">
          <div className="rounded-full border-2 border-dashed border-gray-300 p-4 mb-4">
            <ArrowRight className="w-6 h-6" />
          </div>
          <p className="text-sm">Arrastra módulos desde la barra lateral</p>
          <p className="text-xs mt-1">O haz clic para añadir un módulo</p>
        </div>
      ) : null}
      
      {/* Renderizar los módulos colocados */}
      {placedModules.map(module => (
        <div
          key={module.instanceId}
          className={`absolute p-1 cursor-grab ${activeModule === module.instanceId ? 'opacity-50' : ''}`}
          style={{
            left: `${module.position.x}px`,
            top: `${module.position.y}px`,
            zIndex: activeModule === module.instanceId ? 10 : 1
          }}
          draggable
          onDragStart={(e) => handleModuleDragStart(module.instanceId, e)}
        >
          <Card className="w-64 shadow-md">
            <div className="bg-primary text-primary-foreground p-2 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">
                  {getModuleIcon(module.type)}
                </span>
                <span className="text-sm font-medium">{module.title}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => removeModule(module.instanceId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <CardContent className="p-3">
              {renderModuleContent(module)}
            </CardContent>
          </Card>
        </div>
      ))}
      
      {/* Renderizar las conexiones entre módulos */}
      {renderConnections()}
    </div>
  );
}
