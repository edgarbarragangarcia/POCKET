"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  Lightbulb, 
  Users, 
  Globe, 
  Palette, 
  Clock, 
  LineChart,
  Bot
} from "lucide-react"

const features = [
  {
    title: "Editor visual intuitivo",
    description: "Crea campañas impactantes con nuestra interfaz de arrastrar y soltar sin necesidad de conocimientos técnicos.",
    icon: Palette,
    color: "bg-blue-500",
  },
  {
    title: "Analíticas en tiempo real",
    description: "Monitorea el rendimiento de tus campañas con datos actualizados al minuto para tomar decisiones estratégicas.",
    icon: BarChart3,
    color: "bg-purple-500",
  },
  {
    title: "Segmentación avanzada",
    description: "Dirígete al público correcto con potentes herramientas de segmentación demográfica y conductual.",
    icon: Users,
    color: "bg-pink-500",
  },
  {
    title: "Multilenguaje",
    description: "Crea campañas en varios idiomas y adapta tu mensaje para audiencias globales sin duplicar esfuerzos.",
    icon: Globe,
    color: "bg-yellow-500",
  },
  {
    title: "Asistente IA",
    description: "Optimiza tus campañas y genera contenido con nuestro asistente impulsado por inteligencia artificial.",
    icon: Bot,
    color: "bg-green-500",
  },
  {
    title: "Automatización",
    description: "Programa y automatiza tus campañas para maximizar la eficiencia y llegar a tu audiencia en el momento óptimo.",
    icon: Clock,
    color: "bg-red-500",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export function FeatureSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Características principales
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Nuestra plataforma todo-en-uno te ofrece herramientas avanzadas para crear
            y gestionar campañas publicitarias exitosas.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="glassmorphic p-6 rounded-xl relative overflow-hidden group"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${feature.color}`} />
              
              <div className={`neumorphic-light dark:neumorphic-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 text-foreground`} />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="brutalist p-1 md:p-3 rounded-2xl mx-auto max-w-5xl"
          >
            <div className="glassmorphic rounded-xl overflow-hidden p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Analíticas detalladas para <span className="neon-text-blue">optimizar</span> resultados
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Visualiza el rendimiento de tus campañas con gráficos interactivos
                    y métricas clave para identificar oportunidades de mejora y maximizar tu ROI.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-primary" />
                      <span className="text-sm">Tasas de conversión</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm">Engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <span className="text-sm">Sugerencias IA</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Image 
                    src="/images/analytics-preview.png"
                    alt="Analíticas detalladas"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
