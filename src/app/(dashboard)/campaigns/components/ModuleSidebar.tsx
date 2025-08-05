import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Building, Package, Puzzle, Users, Plus, Edit3, Send, ChevronDown } from 'lucide-react';
import { Module, Product, Organization, UserPersona, ContentDescription } from './types';
import { ContentDescriptionsService } from '@/lib/services/contentDescriptions';

const availableModules: Module[] = [
  {
    type: 'company',
    name: 'Módulo de Compañía',
    description: 'Representa la compañía seleccionada.',
    color: 'bg-blue-500',
  },
  {
    type: 'product',
    name: 'Módulo de Productos',
    description: 'Muestra los productos seleccionados.',
    color: 'bg-orange-500',
  },
  {
    type: 'user_persona',
    name: 'User Persona',
    description: 'Define el público objetivo de la campaña.',
    dependencies: ['product'],
    color: 'bg-purple-500',
  },
  {
    type: 'dynamic',
    name: 'Módulo de Contenido',
    description: 'Genera el contenido creativo para los anuncios.',
    dependencies: ['product'],
    color: 'bg-green-500',
  },
];

interface ModuleSidebarProps {
  selectedCompanyId?: string;
  onModuleDragStart: (e: React.DragEvent, module: Module) => void;
  products: Product[];
  loadingProducts: boolean;
  userPersonas: UserPersona[];
  loadingUserPersonas: boolean;
  selectedProductIds?: string[];
  organizations: Organization[];
  loadingOrganizations: boolean;
  setSelectedOrganizationId: (id: string) => void;
  selectedOrganizationId?: string;
  onGoToNextStage?: () => void;
}

const ModuleCard = ({ module, onModuleDragStart, disabled }: { module: Module; onModuleDragStart: (e: React.DragEvent, module: Module) => void; disabled: boolean }) => {
  const getIcon = () => {
    switch (module.type) {
      case 'company':
        return <Building className="h-5 w-5 mr-3" />;
      case 'product':
        return <Package className="h-5 w-5 mr-3" />;
      case 'user_persona':
        return <Users className="h-5 w-5 mr-3" />;
      default:
        return <Puzzle className="h-5 w-5 mr-3" />;
    }
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={(e) => onModuleDragStart(e, module)}
      className={`p-3 border rounded-lg flex items-center transition-all ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white hover:shadow-md cursor-grab active:cursor-grabbing'
      }`}
    >
      {getIcon()}
      <div>
        <p className="font-semibold">{module.name}</p>
        <p className="text-xs text-gray-500">{module.description}</p>
      </div>
    </div>
  );
};

export default function ModuleSidebar({ 
  selectedCompanyId, 
  onModuleDragStart, 
  products, 
  loadingProducts,
  userPersonas,
  loadingUserPersonas,
  selectedProductIds,
  organizations,
  loadingOrganizations,
  setSelectedOrganizationId,
  selectedOrganizationId,
  onGoToNextStage
}: ModuleSidebarProps) {

  const [isCompaniesExpanded, setCompaniesExpanded] = React.useState(false); // Collapsed by default
  const [isProductsExpanded, setProductsExpanded] = React.useState(false); // Collapsed by default
  const [isUserPersonasExpanded, setUserPersonasExpanded] = React.useState(false); // Collapsed by default
  const [isContentModuleExpanded, setContentModuleExpanded] = React.useState(false); // Collapsed by default
  const [contentDescriptions, setContentDescriptions] = React.useState<ContentDescription[]>([]);
  const [loadingContentDescriptions, setLoadingContentDescriptions] = React.useState(false);
  const [isAddingContent, setIsAddingContent] = React.useState(false);
  const [newContentTitle, setNewContentTitle] = React.useState('');
  const [newContentDescription, setNewContentDescription] = React.useState('');

  console.log('User Personas received in Sidebar:', userPersonas);

  // Load content descriptions when organization is selected
  React.useEffect(() => {
    const loadContentDescriptions = async () => {
      if (!selectedOrganizationId) {
        setContentDescriptions([]);
        return;
      }

      setLoadingContentDescriptions(true);
      try {
        const descriptions = await ContentDescriptionsService.getContentDescriptions(selectedOrganizationId);
        setContentDescriptions(descriptions);
      } catch (error) {
        console.error('Error loading content descriptions:', error);
        setContentDescriptions([]);
      } finally {
        setLoadingContentDescriptions(false);
      }
    };

    loadContentDescriptions();
  }, [selectedOrganizationId]);

  const productsToShow = selectedProductIds 
    ? products.filter(p => selectedProductIds.includes(p.id))
    : products;

  const isModuleDisabled = (module: Module) => {
    // Lógica para deshabilitar módulos que dependen de productos (simplificada por ahora)
    if (module.dependencies?.includes('product') && products.length === 0) {
      return true;
    }
    return false;
  };

  return (
    <Card className="w-1/3 lg:w-1/4 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Módulos Disponibles</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto space-y-4">
        {availableModules.map((module) => {
          if (module.type === 'company') {
            return (
              <div key={module.name}>
                <div 
                  onClick={() => setCompaniesExpanded(!isCompaniesExpanded)}
                  className={`p-3 border rounded-lg flex items-center transition-all cursor-pointer ${'bg-white hover:shadow-md'}`}>
                  <div className={`p-3 rounded-lg ${module.color} text-white mr-3`}>
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{module.name}</p>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                </div>
                {isCompaniesExpanded && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 ml-4">
                    {loadingOrganizations ? (
                      <p className="text-xs text-gray-500">Cargando compañías...</p>
                    ) : organizations.length > 0 ? (
                      organizations.map((org) => (
                        <div key={org.id} className="relative" onClick={() => setSelectedOrganizationId(org.id)}>
                          <div 
                            className={`p-3 border rounded-lg flex items-center transition-all ${selectedCompanyId === org.id ? 'bg-blue-50 border-blue-300' : 'bg-white hover:shadow-md'}`}
                            draggable={true}
                            onDragStart={(e) => onModuleDragStart(e, {
                              type: 'company',
                              name: org.name,
                              description: 'Organización',
                              dependencies: [org.id]
                            })}
                          >
                            <Building className="h-5 w-5 mr-3" />
                            <div>
                              <p className="font-semibold">{org.name}</p>
                              <p className="text-xs text-gray-500">Organización</p>
                              {selectedCompanyId === org.id && (
                                <Badge variant="outline" className="mt-1 bg-blue-100 text-blue-800 border-none">Seleccionada</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No hay compañías disponibles.</p>
                    )}
                  </div>
                )}
              </div>
            );
          } else if (module.type === 'product') {
            return (
              <div key={module.name}>
                <div 
                  className={`p-3 border rounded-lg flex items-center justify-between transition-all cursor-pointer hover:bg-gray-50 ${isModuleDisabled(module) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}`}
                  onClick={() => !isModuleDisabled(module) && setProductsExpanded(!isProductsExpanded)}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${module.color} text-white mr-3`}>
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{module.name}</p>
                      <p className="text-xs text-gray-500">{module.description}</p>
                    </div>
                  </div>
                </div>
                {isProductsExpanded && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 ml-4">
                  {loadingProducts ? (
                    <p className="text-xs text-gray-500">Cargando productos...</p>
                  ) : productsToShow.length > 0 ? (
                    productsToShow.map((product) => (
                      <ModuleCard
                        key={product.id}
                        module={{
                          type: 'product_instance',
                          name: product.name,
                          description: '', // No mostrar descripción
                          productId: product.id,
                          price: product.price,
                        }}
                        onModuleDragStart={onModuleDragStart}
                        disabled={false}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No hay productos para mostrar.</p>
                  )}
                  </div>
                )}
              </div>
            );
          } else if (module.type === 'user_persona') {
            return (
              <div key={module.name}>
                <div 
                  className={`p-3 border rounded-lg flex items-center transition-all cursor-pointer ${isModuleDisabled(module) ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}
                  onClick={() => setUserPersonasExpanded(!isUserPersonasExpanded)}>
                  <div className={`p-3 rounded-lg ${module.color} text-white mr-3`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{module.name}</p>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                </div>
                {isUserPersonasExpanded && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 ml-4">
                    {loadingUserPersonas ? (
                      <p className="text-xs text-gray-500">Cargando user personas...</p>
                    ) : userPersonas.length > 0 ? (
                      userPersonas.map((persona) => (
                        <ModuleCard
                          key={persona.id}
                          module={{
                            type: 'user_persona',
                            name: persona.name,
                            description: persona.bio, // Usar 'bio' como descripción
                            userPersonaId: persona.id,
                          }}
                          onModuleDragStart={onModuleDragStart}
                          disabled={!selectedCompanyId}
                        />
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No hay user personas para mostrar.</p>
                    )}
                  </div>
                )}
              </div>
            );
          } else if (module.type === 'dynamic') {
            return (
              <div key={module.name}>
                <div 
                  className={`p-3 border rounded-lg flex items-center transition-all cursor-pointer ${isModuleDisabled(module) ? 'bg-gray-100 text-gray-400' : 'bg-white hover:shadow-md'}`}
                  onClick={() => setContentModuleExpanded(!isContentModuleExpanded)}>
                  <div className={`p-3 rounded-lg ${module.color} text-white mr-3`}>
                    <Edit3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{module.name}</p>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                </div>
                {isContentModuleExpanded && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 ml-4">
                    {contentDescriptions.map((content) => (
                      <ModuleCard
                        key={content.id}
                        module={{
                          type: 'content_instance',
                          name: content.title,
                          description: content.description,
                          contentId: content.id,
                        }}
                        onModuleDragStart={onModuleDragStart}
                        disabled={isModuleDisabled(module)}
                      />
                    ))}
                    
                    {isAddingContent ? (
                      <div className="p-3 border rounded-lg bg-gray-50 space-y-2">
                        <Input
                          placeholder="Título del contenido"
                          value={newContentTitle}
                          onChange={(e) => setNewContentTitle(e.target.value)}
                          className="text-sm"
                        />
                        <Textarea
                          placeholder="Descripción del contenido creativo..."
                          value={newContentDescription}
                          onChange={(e) => setNewContentDescription(e.target.value)}
                          className="text-sm min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (newContentTitle.trim() && newContentDescription.trim() && selectedOrganizationId) {
                                try {
                                  const newContent = await ContentDescriptionsService.createContentDescription(
                                    selectedOrganizationId,
                                    newContentTitle.trim(),
                                    newContentDescription.trim()
                                  );
                                  setContentDescriptions(prev => [newContent, ...prev]);
                                  setNewContentTitle('');
                                  setNewContentDescription('');
                                  setIsAddingContent(false);
                                } catch (error) {
                                  console.error('Error creating content description:', error);
                                  // You could add a toast notification here
                                }
                              }
                            }}
                            disabled={!newContentTitle.trim() || !newContentDescription.trim() || !selectedOrganizationId}
                          >
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setNewContentTitle('');
                              setNewContentDescription('');
                              setIsAddingContent(false);
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAddingContent(true)}
                        className="w-full text-xs"
                        disabled={isModuleDisabled(module) || !selectedOrganizationId}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar Contenido
                      </Button>
                    )}
                    
                    {loadingContentDescriptions ? (
                      <p className="text-xs text-gray-500">Cargando contenidos...</p>
                    ) : contentDescriptions.length === 0 && !isAddingContent ? (
                      <p className="text-xs text-gray-500">
                        {selectedOrganizationId 
                          ? 'No hay contenidos creados. Haz clic en "Agregar Contenido" para crear uno.'
                          : 'Selecciona una organización para ver los contenidos.'
                        }
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            );
          }

          return (
            <ModuleCard 
              key={module.name} 
              module={module} 
              onModuleDragStart={onModuleDragStart} 
              disabled={isModuleDisabled(module)}
            />
          );
        })}
        
        {/* Siguiente Etapa Button - positioned below Content Module */}
        {onGoToNextStage && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={onGoToNextStage} 
              className="w-full"
              size="lg"
            >
              <Send className="mr-2 h-4 w-4" />
              Siguiente Etapa
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
