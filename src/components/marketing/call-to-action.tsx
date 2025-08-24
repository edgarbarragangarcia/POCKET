"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CallToAction() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto relative"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-1/2 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="glassmorphic p-8 md:p-12 lg:p-16 rounded-2xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
              Lleva tus campañas al <span className="neon-text-blue">siguiente nivel</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 text-center">
              Comienza hoy mismo y descubre cómo nuestra plataforma puede transformar tu estrategia de marketing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="neon-button gap-2">
                <Link href="/register">
                  Empezar ahora
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Programar una demo</Link>
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-muted-foreground">
              <p>No se requiere tarjeta de crédito • Prueba gratuita de 14 días • Cancela en cualquier momento</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
