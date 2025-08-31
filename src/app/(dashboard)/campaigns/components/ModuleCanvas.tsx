import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Module, ModuleInstance, Connection as FlowConnection, Product } from './types';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  Panel,
  Handle,
  Position,
  EdgeProps,
  getBezierPath,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';


export interface ModuleCanvasProps {
  modules: ModuleInstance[];
  connections?: FlowConnection[];
  selectedCompanyId?: string;
  onDrop: (e: React.DragEvent, canvasRect: DOMRect) => void;
  onModuleMove: (id: string, position: { x: number; y: number }) => void;
  onConnect?: (sourceId: string, targetId: string) => void;
  onDeleteConnection?: (id: string) => void;
  onDeleteModule?: (id: string) => void;
}

// Componente personalizado para los nodos del módulo
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ModuleNode = ({ id, data }: { id: string, data: { label: string; description: string; type: string; onDelete?: (id: string) => void; selectedCompanyId?: string; } }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  
  let borderColor = isSelected ? 'border-blue-700' : 'border-blue-500';
  let bgColor = 'bg-blue-50';
  let handleColor = '#3b82f6'; // Color para los puntos de conexión
  
  switch (data.type) {
    case 'company':
      borderColor = isSelected ? 'border-indigo-700' : 'border-indigo-500';
      bgColor = 'bg-indigo-50';
      handleColor = '#6366f1'; // indigo
      break;
    case 'product':
      borderColor = isSelected ? 'border-green-700' : 'border-green-500';
      bgColor = 'bg-green-50';
      handleColor = '#22c55e'; // green
      break;
    case 'dynamic':
      borderColor = isSelected ? 'border-amber-700' : 'border-amber-500';
      bgColor = 'bg-amber-50';
      handleColor = '#f59e0b'; // amber
      break;
  }

  // Cargar productos cuando el módulo es de tipo 'product' y hay un ID de compañía seleccionada
  useEffect(() => {
    if (data.type === 'product' && data.selectedCompanyId) {
      fetchProducts();
    }
  }, [data.type, data.selectedCompanyId]);

  const fetchProducts = async () => {
    if (!data.selectedCompanyId) return;
    
    setLoading(true);
    try {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', data.selectedCompanyId);
        
      if (error) throw error;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStyle = { background: handleColor, width: '10px', height: '10px', border: '2px solid white' };

  const handleEdit = () => {
    console.log(`Edit action triggered for node ${id}`);
    // Aquí se podría abrir un modal de edición, por ejemplo.
  };

  const handleDoubleClick = () => {
    // La prop onDelete viene del componente Flow, que a su vez la recibe de ModuleCanvas
    if (data.onDelete) {
      data.onDelete(id);
    }
  };
  
  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div 
      className={`p-3 border-2 ${borderColor} ${bgColor} rounded-lg shadow-sm w-60 relative ${data.type === 'product' && isSelected ? 'min-h-[200px]' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}>
      <svg 
        className="absolute top-2 right-2 cursor-pointer" 
        width="18" 
        height="18" 
        onDoubleClick={(e) => {
          e.stopPropagation(); 
          if (data.onDelete) {
            data.onDelete(id);
          }
        }}
      >
        <circle cx="9" cy="9" r="8" fill="white" stroke="#FF0000" strokeWidth="1" />
        <path d="M5,5 L13,13 M5,13 L13,5" stroke="#FF0000" strokeWidth="1.5" />
      </svg>
      {/* Handle superior (entrada) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top" 
        style={handleStyle}
        className="!rounded-full"
      />
      
      {/* Handle inferior (salida) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom" 
        style={handleStyle}
        className="!rounded-full"
      />
      
      {/* Handle izquierdo (entrada alternativa) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        style={handleStyle}
        className="!rounded-full"
      />
      
      {/* Handle derecho (salida alternativa) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right" 
        style={handleStyle}
        className="!rounded-full"
      />
      
      {/* Botón de eliminación */}

      
      <div className="font-bold">{data.label}</div>
      <div className="text-xs text-gray-600 mt-1">{data.description}</div>
      
      {/* Lista de productos cuando es módulo de producto */}
      {data.type === 'product' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          
          {loading ? (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="max-h-[130px] overflow-y-auto">
              <ul className="space-y-1">
                
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Componente de borde personalizado con botón de eliminación
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data && data.onDelete) {
      data.onDelete(id);
    }
  };

  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <g
        transform={`translate(${centerX}, ${centerY})`}
        className="delete-button"
        onClick={handleDelete}
      >
        <circle r="8" fill="white" stroke="#FF0000" strokeWidth="1" />
        <path
          d="M-4,-4 L4,4 M-4,4 L4,-4"
          stroke="#FF0000"
          strokeWidth="1.5"
        />
      </g>
    </>
  );
};

// Definición de tipos de nodos personalizados
const nodeTypes = {
  moduleNode: ModuleNode,
};

// Definición de tipos de bordes personalizados
const edgeTypes = {
  custom: CustomEdge,
};

function Flow({ 
  modules, 
  connections = [], 
  selectedCompanyId,
  onModuleMove, 
  onConnect: handleConnectCallback, 
  onDeleteConnection,
  onDeleteModule 
}: { 
  modules: ModuleInstance[]; 
  connections?: FlowConnection[]; 
  selectedCompanyId?: string;
  onModuleMove: ModuleCanvasProps['onModuleMove']; 
  onConnect?: ModuleCanvasProps['onConnect']; 
  onDeleteConnection?: ModuleCanvasProps['onDeleteConnection'];
  onDeleteModule?: (id: string) => void;
}) {
  const { fitView } = useReactFlow();
  // Convertir módulos a formato de nodo de ReactFlow
  const initialNodes: Node[] = modules.map((module) => ({
    id: module.id,
    type: 'moduleNode',
    position: module.position,
    data: {
      label: module.name,
      description: module.description,
      type: module.type,
      onDelete: onDeleteModule,
      selectedCompanyId: selectedCompanyId,
    },
    draggable: true,
    deletable: true, // Hacer que el nodo sea eliminable por ReactFlow
  }));

  // Convertir conexiones a formato de edges de ReactFlow
  const initialEdges: Edge[] = connections.map((conn) => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    type: 'custom',
    animated: conn.animated || true,
    style: conn.style || { stroke: '#6366F1', strokeWidth: 2 },
    data: {
      onDelete: onDeleteConnection
    }
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sincronizar nodos cuando cambian los módulos
  React.useEffect(() => {
    setNodes(
      modules.map((module) => ({
        id: module.id,
        type: 'moduleNode',
        position: { x: module.position.x, y: module.position.y },
        data: { 
          label: module.name, 
          description: module.description,
          type: module.type
        },
        draggable: true,
      }))
    );
  }, [modules, setNodes]);
  
  // Auto-ajustar zoom cuando se agreguen o eliminen módulos
  React.useEffect(() => {
    if (modules.length > 0) {
      // Pequeño delay para asegurar que los nodos se hayan renderizado
      const timer = setTimeout(() => {
        fitView({ 
          padding: 0.1, // 10% de padding alrededor de los nodos
          duration: 800, // Animación suave de 800ms
          maxZoom: 1.2,  // Zoom máximo para evitar que se vea muy grande
          minZoom: 0.3   // Zoom mínimo para evitar que se vea muy pequeño
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [modules.length, fitView]);
  
  // Sincronizar conexiones cuando cambien
  React.useEffect(() => {
    setEdges(
      connections.map((conn) => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        type: 'custom',
        animated: conn.animated || true,
        style: conn.style || { stroke: '#6366F1', strokeWidth: 2 },
        data: {
          onDelete: onDeleteConnection
        }
      }))
    );
  }, [connections, setEdges, onDeleteConnection]);

  // Manejar cuando el nodo se mueve
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node | undefined) => {
      if (node && node.id && node.position) {
        onModuleMove(node.id, node.position);
      }
    },
    [onModuleMove]
  );
  
  // Manejar la eliminación de nodos
  const onNodesDelete = useCallback((deleted: Node[]) => {
    if (onDeleteModule) {
      deleted.forEach(node => onDeleteModule(node.id));
    }
  }, [onDeleteModule]);



  // Manejar conexiones entre nodos
  const onConnect = useCallback(
    (params: Connection) => {
      // Añadir visualmente la conexión
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366F1' } }, eds));
      
      // Notificar a través del callback
      if (handleConnectCallback && params.source && params.target) {
        handleConnectCallback(params.source, params.target);
      }
    },
    [setEdges, handleConnectCallback]
  );
  
  // Manejar eliminación de conexiones
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      // Si es clic derecho, eliminar la conexión
      if (event.button === 2 && onDeleteConnection) {
        event.preventDefault();
        onDeleteConnection(edge.id);
        // Eliminar visualmente la conexión
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    [onDeleteConnection, setEdges]
  );
  
  // Prevenir menú contextual del navegador en las conexiones
  const onEdgeContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onNodesDelete={onNodesDelete}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionMode={ConnectionMode.Loose}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <Controls />
      <Panel position="top-right">
        <div className="text-xs text-gray-400 bg-white/80 p-2 rounded-md">
          Conecta módulos arrastrando desde un punto de conexión a otro
        </div>
      </Panel>
    </ReactFlow>
  );
}

const ModuleCanvas: React.FC<ModuleCanvasProps> = ({ modules, connections, selectedCompanyId, onDrop, onModuleMove, onConnect, onDeleteConnection, onDeleteModule }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const moduleId = e.dataTransfer.getData('module-id');
    if (moduleId) return; // This is a move, not a drop from sidebar

    if (reactFlowWrapper.current) {
      // Asegurarse de que el drop se maneje incluso si ocurre en un elemento hijo
      onDrop(e, reactFlowWrapper.current.getBoundingClientRect());
    }
  };

  // Capture drag events on the whole document to ensure drop works everywhere
  React.useEffect(() => {
    const preventDefaultDrag = (e: DragEvent) => {
      // Verificar si el target es un elemento del DOM y está dentro de nuestro wrapper
      const target = e.target as Element;
      if (reactFlowWrapper.current && target && reactFlowWrapper.current.contains(target)) {
        e.preventDefault();
      }
    };

    document.addEventListener('dragover', preventDefaultDrag);
    return () => {
      document.removeEventListener('dragover', preventDefaultDrag);
    };
  }, []);

  return (
    <div 
      ref={reactFlowWrapper}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-grow h-full border rounded-md overflow-hidden"
    >
      {modules.length === 0 ? (
        <div className="flex items-center justify-center h-full bg-gray-50/50 border-2 border-dashed rounded-md">
          <p className="text-gray-400">Arrastra módulos aquí para construir tu campaña</p>
        </div>
      ) : (
        <ReactFlowProvider>
          <Flow 
            modules={modules} 
            connections={connections}
            selectedCompanyId={selectedCompanyId}
            onModuleMove={onModuleMove} 
            onConnect={onConnect}
            onDeleteConnection={onDeleteConnection}
            onDeleteModule={onDeleteModule}
          />
        </ReactFlowProvider>
      )}
    </div>
  );
}

export default ModuleCanvas;
