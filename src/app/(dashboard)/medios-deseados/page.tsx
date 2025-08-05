'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft, Tv, Radio, Smartphone, Globe, Newspaper, Users, X, Info } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CampaignData {
  modules?: any[];
  connections?: any[];
  selectedOrganizationId?: string;
  timestamp?: string;
}

// Componentes de iconos de redes sociales
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

// Especificaciones de imagen para redes sociales
const socialMediaSpecs = {
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    color: '#1877F2',
    specs: [
      { id: 'fb_feed', type: 'Feed Post', size: '1200 x 630 px', ratio: '1.91:1' },
      { id: 'fb_stories', type: 'Stories', size: '1080 x 1920 px', ratio: '9:16' },
      { id: 'fb_cover', type: 'Cover Photo', size: '820 x 312 px', ratio: '2.63:1' },
      { id: 'fb_profile', type: 'Profile Picture', size: '170 x 170 px', ratio: '1:1' }
    ]
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    color: '#E4405F',
    specs: [
      { id: 'ig_square', type: 'Feed Post (Square)', size: '1080 x 1080 px', ratio: '1:1' },
      { id: 'ig_portrait', type: 'Feed Post (Portrait)', size: '1080 x 1350 px', ratio: '4:5' },
      { id: 'ig_stories', type: 'Stories', size: '1080 x 1920 px', ratio: '9:16' },
      { id: 'ig_reels', type: 'Reels', size: '1080 x 1920 px', ratio: '9:16' }
    ]
  },
  twitter: {
    name: 'Twitter/X',
    icon: TwitterIcon,
    color: '#000000',
    specs: [
      { id: 'tw_tweet', type: 'Tweet Image', size: '1200 x 675 px', ratio: '16:9' },
      { id: 'tw_header', type: 'Header Photo', size: '1500 x 500 px', ratio: '3:1' },
      { id: 'tw_profile', type: 'Profile Picture', size: '400 x 400 px', ratio: '1:1' }
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    color: '#0A66C2',
    specs: [
      { id: 'li_feed', type: 'Feed Post', size: '1200 x 627 px', ratio: '1.91:1' },
      { id: 'li_cover', type: 'Company Cover', size: '1192 x 220 px', ratio: '5.4:1' },
      { id: 'li_profile', type: 'Profile Picture', size: '400 x 400 px', ratio: '1:1' }
    ]
  },
  youtube: {
    name: 'YouTube',
    icon: YouTubeIcon,
    color: '#FF0000',
    specs: [
      { id: 'yt_thumbnail', type: 'Thumbnail', size: '1280 x 720 px', ratio: '16:9' },
      { id: 'yt_channel', type: 'Channel Art', size: '2560 x 1440 px', ratio: '16:9' },
      { id: 'yt_profile', type: 'Profile Picture', size: '800 x 800 px', ratio: '1:1' }
    ]
  },
  tiktok: {
    name: 'TikTok',
    icon: TikTokIcon,
    color: '#000000',
    specs: [
      { id: 'tt_video', type: 'Video', size: '1080 x 1920 px', ratio: '9:16' },
      { id: 'tt_profile', type: 'Profile Picture', size: '200 x 200 px', ratio: '1:1' }
    ]
  }
};

const mediaChannels = [
  {
    id: 'digital',
    name: 'Digital/Social Media',
    description: 'Publicidad en redes sociales y plataformas digitales',
    icon: Smartphone,
    color: 'bg-purple-500',
    reach: 'Alto alcance',
    cost: 'Bajo costo',
    hasSpecs: true
  },
  {
    id: 'web',
    name: 'Sitios Web',
    description: 'Banners y anuncios en sitios web especializados',
    icon: Globe,
    color: 'bg-orange-500',
    reach: 'Medio alcance',
    cost: 'Medio costo'
  },
  {
    id: 'print',
    name: 'Medios Impresos',
    description: 'Periódicos, revistas y publicaciones físicas',
    icon: Newspaper,
    color: 'bg-gray-500',
    reach: 'Bajo alcance',
    cost: 'Alto costo'
  },
  {
    id: 'outdoor',
    name: 'Publicidad Exterior',
    description: 'Vallas, espectaculares y publicidad en vía pública',
    icon: Users,
    color: 'bg-red-500',
    reach: 'Alto alcance',
    cost: 'Alto costo'
  }
];

export default function MediosDeseadosPage() {
  const searchParams = useSearchParams();
  const [campaignData, setCampaignData] = useState<CampaignData>({});
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  useEffect(() => {
    // Get campaign data from URL parameters
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        console.log('Raw data param:', dataParam);
        const decodedParam = decodeURIComponent(dataParam);
        console.log('Decoded param:', decodedParam);
        
        // Validate that the decoded string looks like valid JSON
        if (!decodedParam.trim().startsWith('{') || !decodedParam.trim().endsWith('}')) {
          console.error('Invalid JSON format detected:', decodedParam);
          setCampaignData({});
          return;
        }
        
        const decodedData = JSON.parse(decodedParam);
        console.log('Parsed campaign data:', decodedData);
        setCampaignData(decodedData);
      } catch (error) {
        console.error('Error parsing campaign data:', error);
        console.error('Raw param that failed:', dataParam);
        console.error('Decoded param that failed:', decodeURIComponent(dataParam));
        // Set empty campaign data to prevent crashes
        setCampaignData({});
      }
    }
  }, [searchParams]);

  const handleMediaToggle = (mediaId: string) => {
    console.log('=== MEDIA TOGGLE DEBUG ===');
    console.log('Toggling media ID:', mediaId);
    console.log('Current selectedMedia before toggle:', selectedMedia);
    
    setSelectedMedia(prev => {
      const newMedia = prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId];
      
      console.log('New selectedMedia after toggle:', newMedia);
      return newMedia;
    });
  };

  const handleCardClick = (channel: any) => {
    // Si es Digital/Social Media, mostrar el modal de especificaciones
    if (channel.id === 'digital' && channel.hasSpecs) {
      setShowSpecsModal(true);
    } else {
      // Para otros medios, comportamiento normal de selección
      handleMediaToggle(channel.id);
    }
  };

  const handleSpecToggle = (specId: string) => {
    console.log('=== SPEC TOGGLE DEBUG ===');
    console.log('Toggling spec ID:', specId);
    console.log('Current selectedSpecs before toggle:', selectedSpecs);
    
    setSelectedSpecs(prev => {
      const newSpecs = prev.includes(specId) 
        ? prev.filter(id => id !== specId)
        : [...prev, specId];
      
      console.log('New selectedSpecs after toggle:', newSpecs);
      
      // Automáticamente agregar/quitar "digital" de selectedMedia basado en si hay specs seleccionadas
      if (newSpecs.length > 0 && !selectedMedia.includes('digital')) {
        console.log('📱 Auto-adding "digital" to selectedMedia because specs are selected');
        setSelectedMedia(prevMedia => [...prevMedia, 'digital']);
      } else if (newSpecs.length === 0 && selectedMedia.includes('digital')) {
        console.log('📱 Auto-removing "digital" from selectedMedia because no specs are selected');
        setSelectedMedia(prevMedia => prevMedia.filter(id => id !== 'digital'));
      }
      
      return newSpecs;
    });
  };

  const handleSelectAllSpecs = () => {
    const allSpecIds = Object.values(socialMediaSpecs).flatMap(platform => 
      platform.specs.map(spec => spec.id)
    );
    setSelectedSpecs(allSpecIds);
  };

  const handleClearAllSpecs = () => {
    setSelectedSpecs([]);
  };

  // Función para generar el resumen de especificaciones seleccionadas
  const getSelectedSpecsSummary = () => {
    if (selectedSpecs.length === 0) return null;
    
    const specsByPlatform: { [key: string]: string[] } = {};
    
    selectedSpecs.forEach(specId => {
      Object.entries(socialMediaSpecs).forEach(([platform, data]) => {
        const spec = data.specs.find(s => s.id === specId);
        if (spec) {
          if (!specsByPlatform[platform]) {
            specsByPlatform[platform] = [];
          }
          specsByPlatform[platform].push(spec.type);
        }
      });
    });
    
    return specsByPlatform;
  };

  const handleSubmit = async () => {
    if (selectedMedia.length === 0) {
      alert('Por favor selecciona al menos un medio deseado');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...campaignData,
        selectedMedia,
        selectedSpecs,
        mediosDeseados: selectedMedia.map(id => 
          mediaChannels.find(channel => channel.id === id)?.name
        ),
        submittedAt: new Date().toISOString()
      };

      console.log('=== REDIRECTING TO CAMPAIGN DEVELOPMENT ===');
      console.log('Submission data:', JSON.stringify(submissionData, null, 2));
      console.log('Selected media:', selectedMedia);
      console.log('Selected specs:', selectedSpecs);

      // Encode the data to pass as URL parameter
      const encodedData = encodeURIComponent(JSON.stringify(submissionData));
      
      // Redirect to the Campaign Development page
      window.location.href = `/campana-en-desarrollo?data=${encodedData}`;
      
    } catch (error) {
      console.error('=== REDIRECT ERROR ===');
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      
      alert(`Error al procesar la campaña:\n\n${error instanceof Error ? error.message : 'Error desconocido'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50">
      {/* Header with back button */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medios Deseados</h1>
          <p className="text-muted-foreground">
            Selecciona los canales de medios donde deseas que se ejecute tu campaña
          </p>
        </div>
        <div>
          <Link href="/campaigns">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {campaignData.modules && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumen de la Campaña</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Módulos:</p>
                <p>{campaignData.modules?.length || 0} módulos configurados</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Conexiones:</p>
                <p>{campaignData.connections?.length || 0} conexiones</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Organización:</p>
                <p>{campaignData.selectedOrganizationId || 'No seleccionada'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mediaChannels.map((channel) => {
          const Icon = channel.icon;
          const isSelected = selectedMedia.includes(channel.id);
          
          return (
            <Card 
              key={channel.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleCardClick(channel)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${channel.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{channel.name}</h3>
                      {channel.hasSpecs && (
                        <Info className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                    
                    {/* Resumen de especificaciones seleccionadas */}
                    {channel.id === 'digital' && selectedSpecs.length > 0 && (
                      <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-xs font-semibold text-purple-800 mb-2">
                          Especificaciones Seleccionadas ({selectedSpecs.length}):
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(getSelectedSpecsSummary() || {}).map(([platform, specs]) => {
                            const platformData = socialMediaSpecs[platform as keyof typeof socialMediaSpecs];
                            const IconComponent = platformData.icon;
                            return (
                              <div key={platform} className="flex items-start gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-white mt-0.5" 
                                  style={{ backgroundColor: platformData.color }}
                                >
                                  <IconComponent />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-700">{platformData.name}:</p>
                                  <p className="text-xs text-gray-600">{specs.join(', ')}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {channel.reach}
                      </Badge>
                      <Badge variant="outline" className="text-xs ml-2">
                        {channel.cost}
                      </Badge>
                      {channel.hasSpecs && (
                        <Badge variant="outline" className="text-xs ml-2 bg-blue-50 text-blue-700">
                          {selectedSpecs.length > 0 ? `${selectedSpecs.length} especificaciones` : 'Ver especificaciones'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={selectedMedia.length === 0 || isSubmitting}
          size="lg"
          className="px-8"
        >
          {isSubmitting ? 'Enviando...' : `Enviar Campaña (${selectedMedia.length} medios seleccionados)`}
        </Button>
      </div>

      {/* Modal de Especificaciones de Redes Sociales */}
      <Dialog open={showSpecsModal} onOpenChange={setShowSpecsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-purple-500" />
              Especificaciones de Imagen - Digital/Social Media
            </DialogTitle>
            <DialogDescription>
              Tamaños y resoluciones recomendadas para diferentes redes sociales
            </DialogDescription>
          </DialogHeader>
          
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAllSpecs}>
                Seleccionar Todo
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAllSpecs}>
                Limpiar Todo
              </Button>
            </div>
            <Badge variant="secondary">
              {selectedSpecs.length} especificaciones seleccionadas
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {Object.entries(socialMediaSpecs).map(([platform, data]) => {
              const IconComponent = data.icon;
              return (
                <Card key={platform} className="border-l-4" style={{ borderLeftColor: data.color }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white" 
                        style={{ backgroundColor: data.color }}
                      >
                        <IconComponent />
                      </div>
                      {data.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.specs.map((spec, index) => {
                        const isSelected = selectedSpecs.includes(spec.id);
                        return (
                          <div 
                            key={index} 
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                            }`}
                            onClick={() => handleSpecToggle(spec.id)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                isSelected 
                                  ? 'border-purple-500 bg-purple-500' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{spec.type}</p>
                                <p className="text-xs text-gray-600">Ratio: {spec.ratio}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-white ml-2">
                              {spec.size}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Recomendaciones Generales:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Usa imágenes de alta calidad (300 DPI para impresión, 72 DPI para web)</li>
              <li>• Mantén el texto legible en tamaños pequeños</li>
              <li>• Considera el área segura para evitar recortes en diferentes dispositivos</li>
              <li>• Optimiza el peso de las imágenes para carga rápida</li>
              <li>• Prueba cómo se ven las imágenes en diferentes dispositivos</li>
            </ul>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => {
                console.log('=== MODAL CLOSED ===');
                console.log('Final selectedSpecs:', selectedSpecs);
                console.log('Final selectedMedia:', selectedMedia);
                setShowSpecsModal(false);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Cerrar ({selectedSpecs.length} especificaciones seleccionadas)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
