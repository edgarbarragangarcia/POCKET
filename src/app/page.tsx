import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/marketing/hero-section"
import { FeatureSection } from "@/components/marketing/feature-section"
import { TestimonialsSection } from "@/components/marketing/testimonials-section"
import { PricingSection } from "@/components/marketing/pricing-section"
import { CallToAction } from "@/components/marketing/call-to-action"
import { ModeToggle } from "@/components/mode-toggle"

export const metadata: Metadata = {
  title: "POCKET | Plataforma SaaS para gestión de campañas publicitarias",
  description:
    "Plataforma SaaS para creación, gestión y análisis de campañas publicitarias con herramientas avanzadas y asistencia de IA",
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col homepage-content">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Campaign Manager"
              width={40}
              height={40}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-extrabold text-3xl sm:text-4xl">POCKET</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 homepage-nav">
            <Link 
              href="#features" 
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Características
            </Link>
            <Link 
              href="#testimonials" 
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonios
            </Link>
            <Link 
              href="#pricing" 
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Precios
            </Link>
            <Link 
              href="/blog" 
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button variant="default" asChild className="neon-button">
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <TestimonialsSection />
        <PricingSection />
        <CallToAction />
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Campaign Manager"
              width={40}
              height={40}
              className="h-8 w-8"
            />
            <span className="text-lg font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 font-bold text-2xl sm:text-3xl">POCKET</span>
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} POCKET. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Términos
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
