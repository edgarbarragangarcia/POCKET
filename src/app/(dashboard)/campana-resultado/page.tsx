'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createLogger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Copy, Share2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CampaignResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const logger = createLogger('CampaignResult');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get image URL from search params
    const imageUrl = searchParams.get('image');
    const dataParam = searchParams.get('data');
    
    if (imageUrl) {
      setGeneratedImage(decodeURIComponent(imageUrl));
    }
    
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setCampaignData(decodedData);
      } catch (error) {
        logger.error('Error parsing campaign data', error);
      }
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `campana-generada-${Date.now()}.jpg`;
    link.click();
  };

  const handleCopyUrl = async () => {
    if (!generatedImage) return;
    
    try {
      await navigator.clipboard.writeText(generatedImage);
      alert('✅ URL de imagen copiada al portapapeles');
    } catch (error) {
      logger.error('Error copying to clipboard', error);
      alert('❌ Error al copiar URL');
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Campaña Generada',
          text: 'Mira esta campaña que generé',
          url: generatedImage
        });
      } catch (error) {
        logger.error('Error sharing', error);
      }
    } else {
      // Fallback to copy URL
      handleCopyUrl();
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!generatedImage) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No se encontró imagen</h1>
          <p className="text-gray-600 mb-6">No se pudo cargar la imagen generada.</p>
          <Link href="/campana-en-desarrollo">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaña Generada</h1>
              <p className="text-gray-600">Tu campaña ha sido generada exitosamente</p>
            </div>
            <Link href="/campana-en-desarrollo">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Phone Mockup Section */}
          <div className="flex flex-col items-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle>Vista Previa</CardTitle>
                <p className="text-sm text-gray-600">Así se ve tu campaña</p>
              </CardHeader>
              <CardContent className="flex justify-center">
                {/* Phone Mockup */}
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative w-80 h-[640px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                    {/* Screen */}
                    <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                      
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/20 to-transparent z-10 flex items-center justify-between px-6 pt-2">
                        <span className="text-white text-sm font-medium">9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 border border-white rounded-sm">
                            <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Generated Image */}
                      <div className="w-full h-full">
                        <img 
                          src={generatedImage} 
                          alt="Campaña generada" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            logger.error('Error loading generated image', e);
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjY0MCIgdmlld0JveD0iMCAwIDMyMCA2NDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNjQwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iMzIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
                          }}
                        />
                      </div>
                      
                      {/* Bottom Home Indicator */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
                    </div>
                  </div>
                  
                  {/* Phone Shadow */}
                  <div className="absolute inset-0 rounded-[3rem] shadow-2xl pointer-events-none"></div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar
              </Button>
              <Button variant="outline" onClick={handleCopyUrl} className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copiar URL
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartir
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(generatedImage, '_blank')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Original
              </Button>
            </div>
          </div>

          {/* Campaign Info Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Campaña</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaignData?.company && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Compañía</h4>
                    <p className="text-sm text-gray-600">{campaignData.company.name}</p>
                  </div>
                )}
                
                {campaignData?.userPersonas && campaignData.userPersonas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">User Personas</h4>
                    <div className="space-y-2">
                      {campaignData.userPersonas.map((persona: any, index: number) => (
                        <div key={index} className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                          {persona.name} {persona.age && `(${persona.age} años)`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {campaignData?.products && campaignData.products.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Productos</h4>
                    <div className="space-y-2">
                      {campaignData.products.map((product: any, index: number) => (
                        <div key={index} className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                          {product.name} {product.price && `- $${product.price}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {campaignData?.contentModules && campaignData.contentModules.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Contenido</h4>
                    <div className="space-y-2">
                      {campaignData.contentModules.map((content: any, index: number) => (
                        <div key={index} className="text-sm text-gray-600 bg-purple-50 p-2 rounded">
                          {content.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {campaignData?.mediosDeseados && campaignData.mediosDeseados.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Medios Seleccionados</h4>
                    <div className="space-y-2">
                      {campaignData.mediosDeseados.map((medio: string, index: number) => (
                        <div key={index} className="text-sm text-gray-600 bg-orange-50 p-2 rounded">
                          {medio}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalles Técnicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Generado:</span> {new Date().toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Estado:</span> Completado
                </div>
                <div className="text-sm">
                  <span className="font-medium">Formato:</span> Imagen Digital
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
