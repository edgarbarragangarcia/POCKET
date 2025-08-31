'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus, Filter, Search, Calendar, MoreHorizontal, ArrowUpDown, Eye, Activity, TrendingUp, LayoutGrid, List, Send } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleSidebar from './components/ModuleSidebar';
import ModuleCanvas from './components/ModuleCanvas';
import { Module, Product, ModuleInstance, Connection, Organization, UserPersona } from './components/types';

// Datos de ejemplo para las campañas
const campaignsData = [
  {
    id: "camp_1",
    name: "Campaña de Verano",
    status: "active",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    budget: 2500,
    spent: 1245.50,
    impressions: 125340,
    clicks: 3450,
    ctr: 2.75,
    conversions: 187
  },
  {
    id: "camp_2",
    name: "Lanzamiento Producto X",
    status: "active",
    startDate: "2025-07-15",
    endDate: "2025-09-15",
    budget: 5000,
    spent: 2100.75,
    impressions: 240500,
    clicks: 7230,
    ctr: 3.01,
    conversions: 412
  },
  {
    id: "camp_3",
    name: "Oferta Black Friday",
    status: "paused",
    startDate: "2025-11-20",
    endDate: "2025-11-30",
    budget: 3000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0
  },
  {
    id: "camp_4",
    name: "Navidad 2025",
    status: "draft",
    startDate: "2025-12-01",
    endDate: "2025-12-25",
    budget: 4500,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0
  },
  {
    id: "camp_5",
    name: "Promoción Fin de Año",
    status: "scheduled",
    startDate: "2025-12-26",
    endDate: "2026-01-10",
    budget: 3500,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { color: "bg-green-100 text-green-800", label: "Activa" },
    paused: { color: "bg-amber-100 text-amber-800", label: "Pausada" },
    draft: { color: "bg-slate-100 text-slate-800", label: "Borrador" },
    scheduled: { color: "bg-blue-100 text-blue-800", label: "Programada" },
    ended: { color: "bg-gray-100 text-gray-800", label: "Finalizada" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  
  return (
    <Badge variant="outline" className={`${config.color} border-none`}>
      {config.label}
    </Badge>
  );
};

export default function CampaignsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [userPersonas, setUserPersonas] = useState<UserPersona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [loadingUserPersonas, setLoadingUserPersonas] = useState<boolean>(false);
  
  // State for module builder
  const [modules, setModules] = useState<ModuleInstance[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedModule, setDraggedModule] = useState<Module | null>(null);

  // State for saving campaign
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');

  interface Campaign {
    id: string;
    name: string;
    modules: ModuleInstance[];
    connections: Connection[];
  }
  const [savedCampaigns, setSavedCampaigns] = useState<Campaign[]>([]);
  const [isSending, setIsSending] = useState(false);

  async function fetchOrganizations() {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts(companyId: string) {
    if (!companyId) return;
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', companyId)
        .order('name', { ascending: true });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchUserPersonas(organizationId: string) {
    if (!organizationId) return;
    setLoadingUserPersonas(true);
    try {
      const { data, error } = await supabase
        .from('user_personas')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name', { ascending: true });
      
      if (error) throw error;
      console.log('User Personas fetched from Supabase:', data);
      setUserPersonas(data as UserPersona[]);
    } catch (error) {
      console.error('Error fetching user personas:', error);
    } finally {
      setLoadingUserPersonas(false);
    }
  }

  useEffect(() => {
    fetchOrganizations();
    loadCachedState();
  }, []);
  
  // Function to load cached state
  const loadCachedState = () => {
    try {
      const savedState = localStorage.getItem('campaignBuilderState');
      if (savedState) {
        const { modules, connections, selectedOrganizationId } = JSON.parse(savedState);
        console.log('🔄 Restaurando estado desde caché:', { 
          modules: modules?.length || 0, 
          connections: connections?.length || 0, 
          selectedOrganizationId: selectedOrganizationId || 'sin organización' 
        });
        
        if (modules && Array.isArray(modules)) {
          setModules(modules);
          console.log(`✅ ${modules.length} módulos restaurados`);
        }
        
        if (connections && Array.isArray(connections)) {
          setConnections(connections);
          console.log(`✅ ${connections.length} conexiones restauradas`);
        }
        
        if (selectedOrganizationId) {
          setSelectedOrganizationId(selectedOrganizationId);
          console.log(`✅ Organización restaurada: ${selectedOrganizationId}`);
        }
        
        console.log('✅ Estado restaurado exitosamente desde caché');
      } else {
        console.log('ℹ️ No se encontró estado guardado en caché - empezando con canvas vacío');
      }
    } catch (error) {
      console.error('❌ Error al cargar estado desde caché:', error);
      localStorage.removeItem('campaignBuilderState');
    }
  };

  useEffect(() => {
    if (selectedOrganizationId) {
      fetchProducts(selectedOrganizationId);
      fetchUserPersonas(selectedOrganizationId);
    }
  }, [selectedOrganizationId]);

  useEffect(() => {
    const stateToSave = { 
      modules, 
      connections, 
      selectedOrganizationId: selectedOrganizationId || null,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('campaignBuilderState', JSON.stringify(stateToSave));
    console.log('💾 Estado guardado en caché:', { modules: modules.length, connections: connections.length, selectedOrganizationId: selectedOrganizationId || 'sin organización' });
  }, [modules, connections, selectedOrganizationId]);

  const handleModuleDragStart = (e: React.DragEvent, module: Module) => {
    setDraggedModule(module);
    e.dataTransfer.setData('application/reactflow', JSON.stringify(module));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, canvasRect: DOMRect) => {
    e.preventDefault();
    if (!draggedModule) return;

    const position = { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top };

    const newModule: ModuleInstance = {
      id: `${draggedModule.type}-${Date.now()}`,
      type: draggedModule.type,
      name: draggedModule.name,
      description: draggedModule.description,
      position: position,
      data: { ...draggedModule },
    };

    if (draggedModule.type === 'product_instance' && draggedModule.productId) {
      const product = products.find(p => p.id === draggedModule.productId);
      if (product) {
        newModule.name = product.name;
        newModule.description = product.description;
      }
    }
    
    if (draggedModule.type === 'company' && draggedModule.companyId) {
      const company = organizations.find(o => o.id === draggedModule.companyId);
      if (company) {
        newModule.name = company.name;
        newModule.description = 'Organización';
      }
    }

    if (draggedModule.type === 'user_persona' && draggedModule.userPersonaId) {
      const persona = userPersonas.find(p => p.id === draggedModule.userPersonaId);
      if (persona) {
        newModule.name = persona.name;
        newModule.description = persona.bio;
      }
    }

    setModules((prevModules) => [...prevModules, newModule]);
    setDraggedModule(null);
  };

  const handleModuleMove = (id: string, newPosition: { x: number; y: number }) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === id ? { ...module, position: newPosition } : module
      )
    );
  };

  const handleCreateConnection = (source: string, target: string) => {
    const newConnection: Connection = { id: `conn-${source}-${target}`, source, target };
    setConnections((prevConnections) => [...prevConnections, newConnection]);
  };

  const handleDeleteConnection = (connectionId: string) => {
    setConnections(prevConnections => prevConnections.filter(conn => conn.id !== connectionId));
  };
  
  const handleDeleteModule = (moduleId: string) => {
    setModules((prevModules) => prevModules.filter((m) => m.id !== moduleId));
    setConnections((prevConnections) =>
      prevConnections.filter((c) => c.source !== moduleId && c.target !== moduleId)
    );
  };

  const handleGoToNextStage = () => {
    console.log('=== GOING TO NEXT STAGE ===');
    console.log('Redirecting to Medios Deseados...');
    
    try {
      // Extract detailed information from canvas modules
      const extractModuleData = (modules: any[]) => {
        const userPersonas: any[] = [];
        const products: any[] = [];
        const content: any[] = [];
        let companyInfo: any = null;
        
        modules.forEach(module => {
          switch (module.type) {
            case 'user_persona':
              if (module.data) {
                userPersonas.push({
                  canvasId: module.id, // Canvas-generated ID
                  id: module.data.id || module.data.originalId, // Real database ID
                  name: module.data.name,
                  description: module.data.description,
                  demographics: module.data.demographics,
                  ...module.data
                });
              }
              break;
            case 'product':
              if (module.data) {
                products.push({
                  canvasId: module.id, // Canvas-generated ID
                  id: module.data.id || module.data.originalId, // Real database ID
                  name: module.data.name,
                  description: module.data.description,
                  category: module.data.category,
                  ...module.data
                });
              }
              break;
            case 'content_instance':
              if (module.data) {
                content.push({
                  canvasId: module.id, // Canvas-generated ID
                  id: module.data.id || module.data.originalId, // Real database ID
                  title: module.data.title,
                  description: module.data.description,
                  tags: module.data.tags,
                  ...module.data
                });
              }
              break;
            case 'company':
              if (module.data) {
                companyInfo = {
                  name: module.data.name,
                  mission: module.data.mission,
                  vision: module.data.vision,
                  objectives: module.data.objectives,
                  purpose: module.data.purpose,
                  ...module.data
                };
              }
              break;
          }
        });
        
        return { userPersonas, products, content, companyInfo };
      };
      
      // Debug: Log all modules before extraction
      console.log('🔍 All modules before extraction:', modules);
      modules?.forEach((module, index) => {
        console.log(`📦 Module ${index}:`, {
          id: module.id,
          type: module.type,
          data: module.data,
          position: module.position
        });
      });
      
      const canvasData = extractModuleData(modules || []);
      
      // Debug: Log extracted canvas data
      console.log('🎯 Extracted canvas data:', canvasData);
      
      // Prepare comprehensive campaign data for the medios deseados page
      const campaignData = {
        modules: modules || [],
        connections: connections || [],
        selectedOrganizationId: selectedOrganizationId || null,
        timestamp: new Date().toISOString(),
        // Company information
        companyInfo: canvasData.companyInfo,
        // Canvas modules data
        canvasModules: {
          userPersonas: canvasData.userPersonas,
          products: canvasData.products,
          content: canvasData.content,
          connections: connections || []
        }
      };
      
      console.log('Campaign data prepared:', campaignData);
      
      // Validate that the data can be stringified
      const jsonString = JSON.stringify(campaignData);
      console.log('JSON string generated:', jsonString);
      
      // Test that it can be parsed back
      const testParse = JSON.parse(jsonString);
      console.log('JSON validation successful:', testParse);
      
      // Encode the campaign data to pass it as URL parameter
      const encodedData = encodeURIComponent(jsonString);
      console.log('Encoded data length:', encodedData.length);
      
      // Redirect to Medios Deseados page with campaign data
      router.push(`/medios-deseados?data=${encodedData}`);
      
    } catch (error) {
      console.error('Error preparing campaign data:', error);
      console.error('Modules:', modules);
      console.error('Connections:', connections);
      console.error('Selected org:', selectedOrganizationId);
      
      // Fallback: redirect without data
      alert('Error al preparar los datos de campaña. Redirigiendo sin datos.');
      router.push('/medios-deseados');
    }
  };

  const fetchCampaigns = useCallback(async () => {
    if (!selectedOrganizationId) {
      setSavedCampaigns([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('organization_id', selectedOrganizationId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setSavedCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  }, [selectedOrganizationId, supabase]);

  const handleLoadCampaign = (campaign: Campaign) => {
    if (window.confirm('¿Estás seguro de que quieres cargar esta campaña? Se perderán los cambios no guardados.')) {
      setModules(campaign.modules || []);
      setConnections(campaign.connections || []);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSaveCampaign = async () => {
    if (!campaignName.trim()) {
      alert('Por favor, introduce un nombre para la campaña.');
      return;
    }
    if (!user) {
      alert('Debes iniciar sesión para guardar una campaña.');
      return;
    }
    if (!selectedOrganizationId) {
      alert('Por favor, selecciona una organización antes de guardar.');
      return;
    }

    const campaignData = {
      name: campaignName,
      tenant_id: selectedOrganizationId, // Corregido: Usar tenant_id en lugar de organization_id
      created_by: user.id, // Corregido: Usar created_by en lugar de user_id (según esquema DB)
      modules: modules,
      connections: connections,
    };

    console.log('Intentando guardar la campaña con los siguientes datos:', campaignData);

    try {
      const { data, error } = await supabase.from('campaigns').insert([campaignData]).select();

      if (error) {
        console.error('Error de Supabase al insertar:', error);
        throw error;
      }

      console.log('Campaña guardada con éxito en Supabase:', data);
      alert('¡Campaña guardada con éxito!');
      fetchCampaigns();
      setIsSaveDialogOpen(false);
      setCampaignName('');
    } catch (error) {
      console.error('Error capturado al guardar la campaña:', error);
      alert(`No se pudo guardar la campaña. Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="h-full flex flex-col p-6 bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Constructor de Campañas</h1>
            <p className="text-muted-foreground">
              Diseña y configura tu campaña publicitaria arrastrando módulos al canvas y conectándolos
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsSaveDialogOpen(true)} variant="outline">Guardar Campaña</Button>
          </div>
        </div>

        <div className="flex flex-grow h-[70vh] gap-6 mt-4">
          <ModuleCanvas 
            modules={modules} 
            connections={connections}
            onDrop={handleDrop} 
            onModuleMove={handleModuleMove}
            onConnect={handleCreateConnection}
            onDeleteConnection={handleDeleteConnection}
            onDeleteModule={handleDeleteModule}
          />
          <ModuleSidebar 
            onModuleDragStart={handleModuleDragStart} 
            selectedCompanyId={selectedOrganizationId || undefined}
            products={products}
            loadingProducts={loadingProducts}
            userPersonas={userPersonas}
            loadingUserPersonas={loadingUserPersonas}
            organizations={organizations}
            loadingOrganizations={loading}
            setSelectedOrganizationId={setSelectedOrganizationId}
            selectedOrganizationId={selectedOrganizationId}
            onGoToNextStage={handleGoToNextStage}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Campañas Guardadas</h2>
          {savedCampaigns.length > 0 ? (
            <div className="max-h-48 overflow-y-auto border rounded-md bg-white">
              <ul className="divide-y">
                {savedCampaigns.map((campaign) => (
                  <li key={campaign.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                    <span className="font-medium text-gray-800">{campaign.name}</span>
                    <Button variant="outline" size="sm" onClick={() => handleLoadCampaign(campaign)}>
                      Cargar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-white border-dashed">
              <p className="text-gray-500">No hay campañas guardadas para esta organización.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Guardar Campaña</DialogTitle>
            <DialogDescription>
              Dale un nombre a tu campaña para guardarla y acceder a ella más tarde.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="campaign-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsSaveDialogOpen(false)}>Cancelar</Button>
            <Button type="button" onClick={handleSaveCampaign}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
