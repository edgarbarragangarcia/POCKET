"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10 px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="glassmorphic px-4 py-1 rounded-full text-sm">
                ✨ Plataforma SaaS para gestión de campañas
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center lg:text-left">
              Lleva tus <span className="neon-text-blue">campañas</span> al siguiente nivel
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl text-center lg:text-left">
              Crea, gestiona y analiza tus campañas publicitarias con herramientas avanzadas 
              y asistencia de IA para maximizar tu impacto y retorno de inversión.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
              <Button size="lg" asChild className="neon-button">
                <Link href="/register">Empezar gratis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#demo">Ver demostración</Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-6 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((id) => (
                  <div 
                    key={id} 
                    className="w-8 h-8 rounded-full bg-primary-foreground border-2 border-background flex items-center justify-center text-xs font-semibold"
                  >
                    {id}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Más de <span className="font-semibold text-foreground">2,000+</span> profesionales utilizan nuestra plataforma
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="neumorphic-light dark:neumorphic-dark p-1 md:p-3 rounded-2xl relative z-10">
              <div className="glassmorphic rounded-xl overflow-hidden">
                <img
                  src="/images/dashboard-preview.png"
                  alt="Dashboard Preview"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Floating UI elements for decoration */}
            <div className="absolute -top-6 -right-6 brutalist p-4 rounded-lg rotate-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium">Campañas activas</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 glassmorphic p-4 rounded-lg -rotate-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm font-medium">Análisis en tiempo real</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
