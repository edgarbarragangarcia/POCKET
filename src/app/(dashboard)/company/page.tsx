"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { useState } from "react";

const products = [
  {
    id: 1,
    image: "/images/dashboard-preview.png",
    name: "Software de Gestión de Proyectos",
    category: "Productividad",
    description: "Optimiza la colaboración y el seguimiento de tareas.",
    features: ["Gestión de tareas", "Diagramas de Gantt", "Integraciones"],
    price: "$29.99/mes",
    keyBenefit: "Aumenta la eficiencia del equipo en un 30%.",
    ctaUrl: "https://example.com/project-management",
  },
  {
    id: 2,
    image: "/images/analytics-preview.png",
    name: "Herramienta de Análisis de Datos",
    category: "Business Intelligence",
    description: "Convierte datos complejos en insights accionables.",
    features: ["Paneles personalizables", "Informes en tiempo real", "Conectores de datos"],
    price: "$49.99/mes",
    keyBenefit: "Toma decisiones más inteligentes basadas en datos.",
    ctaUrl: "https://example.com/data-analytics",
  },
  {
    id: 3,
    image: "/logo.svg",
    name: "Plataforma de E-commerce",
    category: "Ventas Online",
    description: "Crea tu tienda online y vende tus productos fácilmente.",
    features: ["Plantillas personalizables", "Pasarelas de pago", "Gestión de inventario"],
    price: "$39.99/mes",
    keyBenefit: "Lanza tu negocio online en cuestión de horas.",
    ctaUrl: "https://example.com/ecommerce-platform",
  },
];

interface BuyerPersonaState {
  name: string;
  occupation: string;
  goals: string;
  frustrations: string;
  motivations: string;
  channels: string;
  personalGoals: string;
  buyingMotivations: string;
  painPoints: string;
}

const CompanyPage = () => {
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    mission: "",
    vision: "",
    strategicObjectives: [
      "",
      "",
      "",
      ""
    ]
  });

  const [buyerPersona, setBuyerPersona] = useState<BuyerPersonaState>({
    name: "",
    occupation: "",
    goals: "",
    frustrations: "",
    motivations: "",
    channels: "",
    personalGoals: "",
    buyingMotivations: "",
    painPoints: ""
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      image: "/images/dashboard-preview.png",
      name: "",
      category: "",
      description: "",
      features: ["", "", ""],
      price: "",
      keyBenefit: "",
      ctaUrl: ""
    }
  ]);

  const handleInputChange = (section, field, value) => {
    if (section === 'company') {
      setCompanyData(prev => ({ ...prev, [field]: value }));
    } else if (section === 'buyerPersona') {
      setBuyerPersona(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleFeatureChange = (productIndex, featureIndex, value) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].features[featureIndex] = value;
    setProducts(updatedProducts);
  };

  const addFeature = (productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].features.push("Nueva característica");
    setProducts(updatedProducts);
  };

  const removeFeature = (productIndex, featureIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].features.splice(featureIndex, 1);
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      image: "/logo.svg",
      name: "Nuevo Producto",
      category: "Categoría",
      description: "Descripción del nuevo producto",
      features: ["Característica 1"],
      price: "$0.00/mes",
      keyBenefit: "Beneficio clave",
      ctaUrl: "https://example.com"
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <div className="p-4">
      <PageHeader title="Compañía" parentTitle="Mis Compañías" parentHref="/companies" />
      
      <Tabs defaultValue="company-info" className="w-full">
        <TabsList className="flex w-full gap-2">
          <TabsTrigger value="company-info" className="flex-1">
            Información
          </TabsTrigger>
          <TabsTrigger value="buyer-persona" className="flex-1">
            Buyer Persona
          </TabsTrigger>
          <TabsTrigger value="products" className="flex-1">
            Productos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="company-info" className="space-y-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Información de la Compañía
              </h2>
              <div className="flex items-center space-x-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                  <Image src="/logo.svg" alt="Company Logo" width={48} height={48} className="text-white" />
                </div>
                <div>
                  <Label htmlFor="company-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre de la Empresa</Label>
                  <Input 
                    id="company-name" 
                    value={companyData.name}
                    className="text-xl font-bold text-slate-900 dark:text-white bg-transparent border-0 p-0 h-auto focus:ring-0"
                    onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                    placeholder="Ej: TechSolutions Pro"
                  />
                  <Label htmlFor="company-description" className="text-sm font-medium text-slate-600 dark:text-slate-400">Descripción</Label>
                  <Input 
                    id="company-description" 
                    value={companyData.description}
                    className="text-sm text-slate-600 dark:text-slate-400 bg-transparent border-0 p-0 h-auto focus:ring-0"
                    onChange={(e) => handleInputChange('company', 'description', e.target.value)}
                    placeholder="Describe brevemente tu empresa, sus servicios y propuesta de valor principal..."
                  />
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                  <Button 
                    onClick={addProduct}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  >
                    + Agregar Nuevo Producto
                  </Button>
              </div>
            </div>
          </TabsContent>
        
        <TabsContent value="buyer-persona" className="space-y-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Buyer Persona Principal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200/50 dark:border-green-700/50">
                <Label htmlFor="persona-name" className="font-bold text-base mb-2 text-green-700 dark:text-green-300 flex items-center">
                  <span className="mr-2">👤</span>
                  Nombre y Edad
                </Label>
                <Input 
                    id="persona-name"
                    value={buyerPersona.name}
                    onChange={(e) => handleInputChange('buyerPersona', 'name', e.target.value)}
                    className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                    placeholder="Ej: Carlos Mendoza, 35 años"
                  />
              </div>
              <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <Label htmlFor="persona-occupation" className="font-bold text-base mb-2 text-blue-700 dark:text-blue-300 flex items-center">
                  <span className="mr-2">💼</span>
                  Ocupación
                </Label>
                <Input 
                    id="persona-occupation"
                    value={buyerPersona.occupation}
                    onChange={(e) => handleInputChange('buyerPersona', 'occupation', e.target.value)}
                    className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                    placeholder="Ej: Director de Marketing en empresa B2B"
                  />
              </div>
              <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                <Label htmlFor="persona-goals" className="font-bold text-base mb-2 text-purple-700 dark:text-purple-300 flex items-center">
                  <span className="mr-2">🎯</span>
                  Objetivos
                </Label>
                <Input 
                    id="persona-goals"
                    value={buyerPersona.goals}
                    onChange={(e) => handleInputChange('buyerPersona', 'goals', e.target.value)}
                    className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                    placeholder="¿Cuáles son sus objetivos profesionales principales?"
                  />
              </div>
              <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                <Label htmlFor="persona-frustrations" className="font-bold text-base mb-2 text-orange-700 dark:text-orange-300 flex items-center">
                  <span className="mr-2">❌</span>
                  Frustraciones
                </Label>
                <Input 
                    id="persona-frustrations"
                    value={buyerPersona.frustrations}
                    onChange={(e) => handleInputChange('buyerPersona', 'frustrations', e.target.value)}
                    className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                    placeholder="¿Qué problemas o frustraciones enfrenta actualmente?"
                  />
              </div>
              <div className="bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-xl border border-red-200/50 dark:border-red-700/50">
                <Label htmlFor="persona-motivations" className="font-bold text-base mb-2 text-red-700 dark:text-red-300 flex items-center">
                  <span className="mr-2">💡</span>
                  Motivaciones
                </Label>
                <Input 
                  id="persona-motivations"
                  value={buyerPersona.motivations}
                  onChange={(e) => handleInputChange('buyerPersona', 'motivations', e.target.value)}
                  className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                  placeholder="¿Qué le motiva a tomar decisiones de compra?"
                />
              </div>
              <div className="bg-gradient-to-br from-teal-50/80 to-cyan-50/80 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-teal-200/50 dark:border-teal-700/50">
                <Label htmlFor="persona-channels" className="font-bold text-base mb-2 text-teal-700 dark:text-teal-300 flex items-center">
                  <span className="mr-2">📱</span>
                  Canales
                </Label>
                <Input 
                  id="persona-channels"
                  value={buyerPersona.channels}
                  onChange={(e) => handleInputChange('buyerPersona', 'channels', e.target.value)}
                  className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                  placeholder="Ej: LinkedIn, email, webinars, redes sociales"
                />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="persona-personalGoals" className="font-bold text-base mb-2 text-slate-800 dark:text-slate-200 flex items-center">
                  <span className="mr-2">🎯</span>
                  Objetivos personales
                </Label>
                <Textarea 
                  id="persona-personalGoals"
                  value={buyerPersona.personalGoals}
                  onChange={(e) => handleInputChange('buyerPersona', 'personalGoals', e.target.value)}
                  className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                  rows={3}
                  placeholder="¿Cuáles son sus objetivos personales y profesionales a largo plazo?"
                />
              </div>
              <div>
                <Label htmlFor="persona-buyingMotivations" className="font-bold text-base mb-2 text-slate-800 dark:text-slate-200 flex items-center">
                  <span className="mr-2">💡</span>
                  Motivaciones compra
                </Label>
                <Textarea 
                  id="persona-buyingMotivations"
                  value={buyerPersona.buyingMotivations}
                  onChange={(e) => handleInputChange('buyerPersona', 'buyingMotivations', e.target.value)}
                  className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                  rows={3}
                  placeholder="¿Qué factores le motivan a invertir en soluciones como las tuyas?"
                />
              </div>
              <div>
                <Label htmlFor="persona-painPoints" className="font-bold text-base mb-2 text-slate-800 dark:text-slate-200 flex items-center">
                  <span className="mr-2">❌</span>
                  Puntos de dolor
                </Label>
                <Textarea 
                  id="persona-painPoints"
                  value={buyerPersona.painPoints}
                  onChange={(e) => handleInputChange('buyerPersona', 'painPoints', e.target.value)}
                  className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600"
                  rows={3}
                  placeholder="¿Qué problemas específicos intenta resolver?"
                />
              </div>


            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Productos y Servicios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <Card key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-4">
                      <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-4 flex items-center justify-center">
                        <Image src={product.image} alt={product.name} width={200} height={120} className="rounded-lg" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        <Input 
                          value={product.name}
                          onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                          className="text-base font-bold text-slate-900 dark:text-white bg-transparent border-0 p-0 h-auto focus:ring-0"
                          placeholder="Ej: Software de Gestión de Proyectos"
                        />
                      <Input 
                        value={product.category}
                        onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                        className="text-xs text-slate-600 dark:text-slate-400 bg-transparent border-0 p-0 h-auto focus:ring-0 mt-1"
                        placeholder="Ej: Productividad, Business Intelligence, Ventas Online"
                      />
                      </CardTitle>
                      <Textarea 
                          value={product.description}
                          onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                          className="text-sm text-slate-600 dark:text-slate-400 mt-2 bg-transparent border-0 p-0 h-auto focus:ring-0"
                          rows={2}
                          placeholder="Describe brevemente tu producto y su propuesta de valor principal..."
                        />
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Input 
                          value={product.price}
                          onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                          className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent bg-transparent border-0 p-0 h-auto focus:ring-0"
                          placeholder="Ej: $29.99/mes o $5,000/proyecto"
                        />
                        <Input 
                          value={product.keyBenefit}
                          onChange={(e) => handleProductChange(index, 'keyBenefit', e.target.value)}
                          className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 mt-1"
                          placeholder="Ej: Aumenta la eficiencia del equipo en un 30%"
                        />
                        <Input 
                          value={product.ctaUrl}
                          onChange={(e) => handleProductChange(index, 'ctaUrl', e.target.value)}
                          className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 mt-1"
                          placeholder="https://tusitio.com/producto"
                        />
                      </div>
                      <div className="mb-6">
                        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">Características</Label>
                        {product.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center mb-2">
                            <Input 
                              value={feature}
                              onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                              className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 ml-2 flex-1"
                              placeholder="Ej: Gestión de tareas, Diagramas de Gantt, etc."
                            />
                            <Button 
                              onClick={() => removeFeature(index, featureIndex)}
                              variant="ghost" 
                              size="sm"
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                        <Button 
                          onClick={() => addFeature(index)}
                          variant="outline" 
                          size="sm"
                          className="mt-2 text-xs"
                        >
                          + Agregar característica
                        </Button>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        Comenzar Ahora
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button 
                  onClick={() => {
                    setProducts(prev => [...prev, {
                      id: Date.now(),
                      name: "Nuevo Producto",
                      description: "Descripción del nuevo producto",
                      price: "$0/mes",
                      features: ["Característica 1", "Característica 2"],
                      image: "/product-placeholder.jpg",
                      category: "Nueva categoría",
                      keyBenefit: "Beneficio clave del producto",
                      ctaUrl: "https://example.com/new-product"
                    }]);
                  }}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-32"
                >
                  + Agregar Producto
                </Button>
              </div>
            </div>
          </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyPage;
