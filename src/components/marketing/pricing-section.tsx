"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const plans = [
  {
    name: "Basic",
    description: "Ideal para emprendedores y pequeñas empresas",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "3 campañas activas",
      "Analytics básicos",
      "Editor de campañas",
      "Segmentación básica",
      "Exportación a PDF y CSV",
      "Soporte por email"
    ],
    highlighted: false,
    ctaText: "Comenzar gratis"
  },
  {
    name: "Intermediate",
    description: "Para negocios en desarrollo",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "5 campañas activas",
      "Analytics estándar",
      "Editor de campañas mejorado",
      "Segmentación avanzada",
      "Exportación a múltiples formatos",
      "Soporte técnico estándar",
      "Integraciones básicas"
    ],
    highlighted: false,
    ctaText: "Comenzar prueba"
  },
  {
    name: "Pro",
    description: "Perfecto para empresas en crecimiento",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    features: [
      "10 campañas activas",
      "Analytics avanzados",
      "Editor de campañas avanzado",
      "Segmentación personalizada",
      "Asistente IA básico",
      "Exportación a todos los formatos",
      "Soporte prioritario",
      "Integraciones con CRM"
    ],
    highlighted: true,
    ctaText: "Probar 14 días gratis"
  },
  {
    name: "Enterprise",
    description: "Para equipos y organizaciones grandes",
    monthlyPrice: 499,
    yearlyPrice: 4990,
    features: [
      "Campañas ilimitadas",
      "Analytics premium con predicciones",
      "Editor avanzado con colaboración",
      "Segmentación avanzada con IA",
      "Asistente IA completo",
      "API y webhooks personalizados",
      "Account manager dedicado",
      "Formación personalizada",
      "Implementación a medida"
    ],
    highlighted: false,
    ctaText: "Contactar ventas"
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Planes adaptados a tus necesidades</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a tu empresa y escala a medida que creces.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <Label htmlFor="pricing-toggle" className={annual ? "text-muted-foreground" : ""}>
              Mensual
            </Label>
            <Switch 
              id="pricing-toggle" 
              checked={annual} 
              onCheckedChange={setAnnual} 
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="pricing-toggle" className={!annual ? "text-muted-foreground" : ""}>
              Anual <span className="text-xs text-primary">Ahorra 20%</span>
            </Label>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                relative rounded-xl overflow-hidden 
                ${plan.highlighted 
                  ? 'glassmorphic border-2 border-primary' 
                  : 'bg-card border border-border'
                }
              `}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Más popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">
                    ${annual ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">
                    /{annual ? 'año' : 'mes'}
                  </span>
                </div>
                
                <Button 
                  className={`w-full ${plan.highlighted ? 'neon-button' : ''}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.highlighted ? "/register" : "/contact"}>
                    {plan.ctaText}
                  </Link>
                </Button>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            ¿Necesitas un plan personalizado para tu negocio?
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Contacta con nuestro equipo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
