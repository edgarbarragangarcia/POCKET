"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Esta plataforma ha transformado por completo nuestra estrategia de marketing digital. Hemos incrementado nuestras conversiones en un 45% en solo tres meses.",
    author: "Elena Rodríguez",
    position: "CMO, TechVision Inc.",
    avatar: "/images/avatars/avatar-1.png"
  },
  {
    quote: "La facilidad de uso combinada con análisis detallados nos permite optimizar campañas en tiempo real. Una herramienta indispensable para cualquier equipo de marketing.",
    author: "Carlos Mendoza",
    position: "Director de Marketing Digital, GlobalRetail",
    avatar: "/images/avatars/avatar-2.png"
  },
  {
    quote: "El asistente de IA ha mejorado significativamente la calidad de nuestras campañas, generando contenido relevante y atractivo que resuena con nuestra audiencia.",
    author: "Marta Sánchez",
    position: "Especialista en Campañas, CreativeAgency",
    avatar: "/images/avatars/avatar-3.png"
  },
  {
    quote: "La capacidad de segmentación y las herramientas de automatización nos han permitido escalar nuestras operaciones sin sacrificar la personalización.",
    author: "Javier López",
    position: "CEO, StartupGrowth",
    avatar: "/images/avatars/avatar-4.png"
  },
  {
    quote: "Después de probar múltiples plataformas, esta es definitivamente la más intuitiva y completa. La relación calidad-precio es inmejorable.",
    author: "Ana Torres",
    position: "Directora de Publicidad, MediaGroup",
    avatar: "/images/avatars/avatar-5.png"
  },
  {
    quote: "El soporte al cliente es excepcional. Cualquier consulta o problema se resuelve en cuestión de minutos. Un equipo verdaderamente comprometido.",
    author: "Ricardo Gómez",
    position: "Gerente de Marketing, InnoTech",
    avatar: "/images/avatars/avatar-6.png"
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24">
      <div className="container px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre cómo empresas de diferentes sectores han mejorado sus resultados utilizando nuestra plataforma.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glassmorphic p-6 rounded-xl relative"
            >
              <div className="absolute top-4 left-4 opacity-50">
                <Quote className="h-8 w-8 text-primary" />
              </div>
              
              <blockquote className="pt-8 pb-4">
                <p className="text-foreground">"{testimonial.quote}"</p>
              </blockquote>
              
              <div className="flex items-center gap-3 mt-4">
                <div className="neumorphic-light dark:neumorphic-dark rounded-full p-0.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 brutalist rounded-2xl p-8 lg:p-16 max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Más de <span className="neon-text-blue">2,000</span> empresas confían en nosotros
              </h3>
              <p className="text-muted-foreground mb-6">
                Desde startups hasta multinacionales, nuestras soluciones se adaptan a empresas de todos los tamaños y sectores.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((id) => (
                <div 
                  key={id}
                  className="bg-muted/50 rounded-lg p-3 flex items-center justify-center"
                >
                  <Image 
                    src={`/images/logos/logo-${id}.svg`}
                    alt={`Cliente ${id}`}
                    width={80}
                    height={40}
                    className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
