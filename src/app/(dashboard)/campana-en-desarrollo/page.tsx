'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, Smartphone, Globe, Newspaper, Users, Play, Pause, Settings, Send } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createLogger } from '@/lib/logger';

interface CampaignData {
  modules?: any[];
  connections?: any[];
  selectedOrganizationId?: string;
  selectedMedia?: string[];
  selectedSpecs?: string[];
  mediosDeseados?: string[];
  submittedAt?: string;
  // Canvas data
  companyInfo?: {
    name: string;
    mission: string;
    vision: string;
    objectives: string;
    purpose: string;
  };
  userPersonas?: Array<{
    id?: string;
    name: string;
    description: string;
    demographics: string;
  }>;
  products?: Array<{
    id?: string;
    name: string;
    description: string;
    category: string;
  }>;
  contentModules?: Array<{
    id?: string;
    title: string;
    description: string;
    tags: string[];
  }>;
  // Canvas modules data (alternative structure)
  canvasModules?: {
    userPersonas?: Array<{
      id?: string;
      userPersonaId?: string; // Real database ID
      canvasId?: string; // Canvas-generated ID
      name: string;
      description?: string;
      demographics?: string;
    }>;
    products?: Array<{
      id?: string;
      productId?: string; // Real database ID
      canvasId?: string; // Canvas-generated ID
      name: string;
      description?: string;
      category?: string;
    }>;
    content?: Array<{
      id?: string;
      contentId?: string; // Real database ID
      canvasId?: string; // Canvas-generated ID
      title: string;
      description?: string;
      tags?: string[];
    }>;
  };
}

interface Organization {
  id: string;
  name: string;
  mission?: string;
  vision?: string;
  objectives?: string;
  settings?: {
    purpose?: string;
  };
}

interface UserPersona {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  occupation?: string;
  bio?: string;
  goals?: string[];
  frustrations?: string[];
  motivations?: string[];
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  sku?: string;
}

interface ContentDescription {
  id: string;
  title: string;
  description: string;
  content_type?: string;
  tags?: string[];
  metadata?: any;
}

export default function CampanaEnDesarrolloPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [campaignData, setCampaignData] = useState<CampaignData>({});
  const [campaignStatus, setCampaignStatus] = useState<'developing' | 'ready' | 'running'>('developing');
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Supabase data states
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userPersonas, setUserPersonas] = useState<UserPersona[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contentDescriptions, setContentDescriptions] = useState<ContentDescription[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClientComponentClient();
  const logger = createLogger('CampanaEnDesarrollo');

  // Function to fetch organization data from Supabase (filtered by canvas selections)
  const fetchOrganizationData = async (organizationId: string, canvasData: CampaignData) => {
    try {
      setLoading(true);
      logger.debug('Fetching organization data for ID:', organizationId);
      logger.debug('Canvas data for filtering:', canvasData);
      
      // Fetch organization (always fetch this)
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();
      
      if (orgError) {
        logger.error('Error fetching organization', orgError);
      } else {
        logger.debug('Organization data loaded', orgData);
        setOrganization(orgData);
      }
      
      // Extract IDs from canvas data
      logger.debug('Extracting IDs from canvas data', {
        userPersonas: canvasData.userPersonas,
        products: canvasData.products,
        contentModules: canvasData.contentModules,
        canvasModules: canvasData.canvasModules
      });
      
      // Debug: Log detailed structure of canvasModules
      logger.debug('Checking canvasModules arrays', {
        userPersonasExists: !!canvasData.canvasModules?.userPersonas,
        userPersonasLength: canvasData.canvasModules?.userPersonas?.length,
        contentExists: !!canvasData.canvasModules?.content,
        contentLength: canvasData.canvasModules?.content?.length
      });
      
      if (canvasData.canvasModules?.userPersonas && canvasData.canvasModules.userPersonas.length > 0) {
        logger.debug('User Personas in canvasModules', canvasData.canvasModules.userPersonas);
      } else {
        logger.warn('No userPersonas found or array is empty');
      }
      
      if (canvasData.canvasModules?.content && canvasData.canvasModules.content.length > 0) {
        logger.debug('Content in canvasModules', canvasData.canvasModules.content);
      } else {
        logger.warn('No content found or array is empty');
      }
      
      // Direct extraction from canvasModules
      const personaIds: string[] = [];
      const productIds: string[] = [];
      const contentIds: string[] = [];
      
      logger.debug('Direct ID extraction from canvasModules', canvasData.canvasModules);
      
      // Extract user persona IDs
      if (canvasData.canvasModules?.userPersonas) {
        canvasData.canvasModules.userPersonas.forEach(persona => {
          if (persona.userPersonaId) {
            personaIds.push(persona.userPersonaId);
            logger.debug('Found userPersonaId', persona.userPersonaId);
          }
        });
      }
      
      // Extract product IDs
      if (canvasData.canvasModules?.products) {
        canvasData.canvasModules.products.forEach(product => {
          if (product.productId) {
            productIds.push(product.productId);
            logger.debug('Found productId', product.productId);
          }
        });
      }
      
      // Extract content IDs
      if (canvasData.canvasModules?.content) {
        canvasData.canvasModules.content.forEach(content => {
          if (content.contentId) {
            contentIds.push(content.contentId);
            logger.debug('Found contentId', content.contentId);
          }
        });
      }
      
      logger.debug('Extracted IDs for filtering', { personaIds, productIds, contentIds });
      
      // Fetch user personas (only selected ones)
      if (personaIds.length > 0) {
        const { data: personasData, error: personasError } = await supabase
          .from('user_personas')
          .select('*')
          .in('id', personaIds);
        
        if (personasError) {
          logger.error('Error fetching user personas', personasError);
        } else {
          logger.debug('Filtered user personas loaded', { count: personasData?.length });
          setUserPersonas(personasData || []);
        }
      } else {
        logger.info('No user personas selected in canvas');
        setUserPersonas([]);
      }
      
      // Fetch products (only selected ones)
      if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
        
        if (productsError) {
          logger.error('Error fetching products', productsError);
        } else {
          logger.debug('Filtered products loaded', { count: productsData?.length });
          setProducts(productsData || []);
        }
      } else {
        logger.info('No products selected in canvas');
        setProducts([]);
      }
      
      // Fetch content descriptions (only selected ones)
      if (contentIds.length > 0) {
        const { data: contentData, error: contentError } = await supabase
          .from('content_descriptions')
          .select('*')
          .in('id', contentIds);
        
        if (contentError) {
          logger.error('Error fetching content descriptions', contentError);
        } else {
          logger.debug('Filtered content descriptions loaded', { count: contentData?.length });
          setContentDescriptions(contentData || []);
        }
      } else {
        logger.info('No content modules selected in canvas');
        setContentDescriptions([]);
      }
      
    } catch (error) {
      logger.error('Error fetching organization data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get campaign data from URL parameters
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decodedParam = decodeURIComponent(dataParam);
        const decodedData = JSON.parse(decodedParam);
        logger.debug('Campaign data received', decodedData);
        setCampaignData(decodedData);
      } catch (error) {
        logger.error('Error parsing campaign data', error);
        setCampaignData({});
      }
    } else {
      logger.warn('No campaign data found in URL parameters');
    }
  }, [searchParams]);
  
  // Fetch Supabase data when organization ID is available
  useEffect(() => {
    if (campaignData.selectedOrganizationId) {
      fetchOrganizationData(campaignData.selectedOrganizationId, campaignData);
    }
  }, [campaignData.selectedOrganizationId, campaignData.userPersonas, campaignData.products, campaignData.contentModules]);

  const getStatusBadge = () => {
    switch (campaignStatus) {
      case 'developing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />En Desarrollo</Badge>;
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Lista para Lanzar</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300"><Play className="w-3 h-3 mr-1" />En Ejecución</Badge>;
      default:
        return <Badge variant="secondary">Estado Desconocido</Badge>;
    }
  };

  const getMediaIcon = (mediaName: string) => {
    switch (mediaName?.toLowerCase()) {
      case 'digital/social media':
        return <Smartphone className="w-4 h-4" />;
      case 'sitios web':
        return <Globe className="w-4 h-4" />;
      case 'medios impresos':
        return <Newspaper className="w-4 h-4" />;
      case 'publicidad exterior':
        return <Users className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  // Function to handle campaign generation and send data to webhook
  const handleGenerateCampaign = async () => {
    setIsSendingToWebhook(true);
    
    try {
      // Prepare comprehensive campaign summary data
      const campaignSummary = {
        // Company information
        company: organization ? {
          name: organization.name,
          mission: organization.mission,
          vision: organization.vision,
          objectives: organization.objectives
        } : null,
        
        // Selected user personas
        userPersonas: userPersonas.map(persona => ({
          id: persona.id,
          name: persona.name,
          age: persona.age,
          gender: persona.gender,
          occupation: persona.occupation,
          bio: persona.bio,
          goals: persona.goals,
          frustrations: persona.frustrations,
          motivations: persona.motivations
        })),
        
        // Selected products
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          sku: product.sku
        })),
        
        // Selected content modules
        contentModules: contentDescriptions.map(content => ({
          id: content.id,
          title: content.title,
          description: content.description,
          content_type: content.content_type,
          tags: content.tags
        })),
        
        // Selected media and specifications
        selectedMedia: campaignData.selectedMedia || [],
        selectedSpecs: campaignData.selectedSpecs || [],
        mediosDeseados: campaignData.mediosDeseados || [],
        
        // Campaign metadata
        campaignStatus: campaignStatus,
        timestamp: new Date().toISOString(),
        source: 'campaign-builder',
        action: 'generate-campaign'
      };
      
      logger.info('Sending campaign summary to webhook', campaignSummary);
      
      // Send to webhook using API route (to avoid CORS)
      const response = await fetch('/api/send-to-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl: 'https://n8nqa.ingenes.com:5689/webhook-test/creadorCampañas',
          data: campaignSummary
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      logger.info('Webhook response', result);
      
      // Check if webhook returned an image
      const webhookResponse = result.webhookResponse;
      let imageUrl = null;
      let revisedPrompt = null;
      
      if (webhookResponse) {
        // Handle array response format (like the example provided)
        if (Array.isArray(webhookResponse) && webhookResponse.length > 0) {
          const firstItem = webhookResponse[0];
          imageUrl = firstItem.url || firstItem.image || firstItem.imageUrl;
          revisedPrompt = firstItem.revised_prompt || firstItem.prompt;
          logger.debug('Parsed from array response - Image URL', { imageUrl });
        } else {
          // Handle direct object response format
          imageUrl = webhookResponse.image || webhookResponse.url || webhookResponse.imageUrl;
          revisedPrompt = webhookResponse.revised_prompt || webhookResponse.prompt;
          logger.debug('Parsed from object response - Image URL', { imageUrl });
        }
        
        if (imageUrl) {
          logger.info('Image found in webhook response', { imageUrl });
          
          // Encode campaign data for the result page
          const resultData = {
            image: imageUrl,
            campaign: campaignSummary,
            generatedAt: new Date().toISOString(),
            prompt: revisedPrompt
          };
          
          const encodedResultData = encodeURIComponent(JSON.stringify(resultData));
          
          // Open result page in new tab
          window.open(`/campana-resultado?data=${encodedResultData}`, '_blank');
          
          // Show success message
          alert('✅ Campaña generada exitosamente. Se abrió en una nueva pestaña.');
        } else {
          logger.info('No image found in webhook response');
          logger.debug('Webhook response structure', webhookResponse);
          alert('✅ Resumen de campaña enviado exitosamente al webhook');
        }
      }
      
      // Change campaign status after successful webhook send
      setCampaignStatus(campaignStatus === 'developing' ? 'ready' : 'developing');
      
    } catch (error) {
      logger.error('Error sending to webhook', error);
      alert(`❌ Error al enviar al webhook: ${error}`);
    } finally {
      setIsSendingToWebhook(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50">
      {/* Header with back button */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaña en Desarrollo</h1>
          <p className="text-muted-foreground">
            Tu campaña está siendo procesada y configurada para su lanzamiento
          </p>
        </div>
        <div>
          <Link href="/medios-deseados">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Campaign Status */}


      {/* Company Information from Supabase */}
      {organization && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información de la Compañía</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">Cargando información...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg text-primary">{organization.name}</p>
                </div>
                
                {organization.mission && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Misión:</p>
                    <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{organization.mission}</p>
                  </div>
                )}
                
                {organization.vision && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Visión:</p>
                    <p className="text-gray-600 bg-green-50 p-3 rounded-lg">{organization.vision}</p>
                  </div>
                )}
                
                {organization.objectives && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Objetivos:</p>
                    <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg">{organization.objectives}</p>
                  </div>
                )}
                
                {organization.settings?.purpose && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Propósito:</p>
                    <p className="text-gray-600 bg-purple-50 p-3 rounded-lg">{organization.settings.purpose}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
              
      {/* User Personas from Supabase */}
      {userPersonas.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Personas Seleccionadas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">Cargando personas...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userPersonas.map((persona, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {persona.name ? persona.name.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{persona.name}</h4>
                        {persona.bio && (
                          <p className="text-sm text-gray-600 mt-1">{persona.bio}</p>
                        )}
                        <div className="mt-2 space-y-1">
                          {persona.age && (
                            <p className="text-xs text-gray-500">Edad: {persona.age} años</p>
                          )}
                          {persona.occupation && (
                            <p className="text-xs text-gray-500">Ocupación: {persona.occupation}</p>
                          )}
                          {persona.goals && persona.goals.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700">Objetivos:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {persona.goals.slice(0, 3).map((goal, goalIndex) => (
                                  <Badge key={goalIndex} variant="outline" className="text-xs">
                                    {goal}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Products from Supabase */}
      {products.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Productos Seleccionados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">Cargando productos...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{product.name}</h4>
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      )}
                      {product.price && (
                        <p className="text-xs text-gray-500 mt-1">Precio: ${product.price}</p>
                      )}
                      {product.sku && (
                        <Badge variant="secondary" className="mt-2 text-xs">SKU: {product.sku}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Descriptions from Supabase */}
      {contentDescriptions.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Módulos de Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">Cargando contenido...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {contentDescriptions.map((content, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                      <Newspaper className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{content.title}</h4>
                      {content.description && (
                        <p className="text-sm text-gray-600 mt-2">{content.description}</p>
                      )}
                      {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {content.tags.map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Media Details */}
      {campaignData.selectedMedia && campaignData.selectedMedia.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Medios Seleccionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignData.selectedMedia.map((mediaId, index) => {
                // Map media IDs to readable names
                const mediaNames: { [key: string]: string } = {
                  'digital': 'Digital/Social Media',
                  'web': 'Sitios Web',
                  'print': 'Medios Impresos',
                  'outdoor': 'Publicidad Exterior'
                };
                const medio = mediaNames[mediaId] || mediaId;
                
                return (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary text-white">
                        {getMediaIcon(medio)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{medio}</p>
                        <p className="text-sm text-gray-600 mt-1">Configurándose...</p>
                        
                        {/* Show Digital/Social Media specs if available */}
                        {medio === 'Digital/Social Media' && campaignData.selectedSpecs && campaignData.selectedSpecs.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">Especificaciones seleccionadas:</p>
                            <div className="flex flex-wrap gap-1">
                              {campaignData.selectedSpecs.map((specId, specIndex) => {
                                // Map spec IDs to readable names
                                const specNames: { [key: string]: string } = {
                                  'fb_feed': 'Facebook Feed Post',
                                  'fb_story': 'Facebook Story',
                                  'fb_cover': 'Facebook Cover',
                                  'ig_feed': 'Instagram Feed Post',
                                  'ig_story': 'Instagram Story',
                                  'ig_reel': 'Instagram Reel',
                                  'tw_post': 'Twitter Post',
                                  'tw_header': 'Twitter Header',
                                  'li_post': 'LinkedIn Post',
                                  'li_cover': 'LinkedIn Cover',
                                  'yt_thumbnail': 'YouTube Thumbnail',
                                  'yt_banner': 'YouTube Banner',
                                  'tt_video': 'TikTok Video',
                                  'tt_profile': 'TikTok Profile'
                                };
                                return (
                                  <Badge key={specIndex} variant="outline" className="text-xs bg-white">
                                    {specNames[specId] || specId}
                                  </Badge>
                                );
                              })}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {campaignData.selectedSpecs.length} especificaciones configuradas
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progreso de Desarrollo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">Campaña recibida</p>
                <p className="text-xs text-gray-600">{campaignData.submittedAt ? new Date(campaignData.submittedAt).toLocaleString() : 'Hace unos momentos'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">Procesando configuración</p>
                <p className="text-xs text-gray-600">En progreso...</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-500">Revisión y aprobación</p>
                <p className="text-xs text-gray-400">Pendiente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-500">Lanzamiento</p>
                <p className="text-xs text-gray-400">Pendiente</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        <Button 
          variant="secondary"
          onClick={handleGenerateCampaign}
          disabled={isSendingToWebhook}
        >
          {isSendingToWebhook ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Enviando...
            </>
          ) : campaignStatus === 'developing' ? (
            <>
              <Send className="mr-2 h-4 w-4" />
              Generar Campaña
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Continuar Desarrollo
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
